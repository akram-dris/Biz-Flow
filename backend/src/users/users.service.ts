import {
    Injectable,
    NotFoundException,
    ForbiddenException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
    UpdateUserDto,
    UpdateUserAdminDto,
    ChangePasswordDto,
    UserResponseDto,
    UserListResponseDto,
} from './dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findAll(
        organizationId: string,
        page = 1,
        limit = 10,
        search?: string,
        role?: UserRole,
    ): Promise<UserListResponseDto> {
        const skip = (page - 1) * limit;

        const where: any = {
            organizationId, // Filter by organization to ensure multi-tenancy
        };

        if (search) {
            where.OR = [
                { firstName: { contains: search, mode: 'insensitive' } },
                { lastName: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (role) {
            where.role = role;
        }

        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    firstName: true,
                    lastName: true,
                    role: true,
                    isActive: true,
                    isEmailVerified: true,
                    avatarUrl: true,
                    lastLoginAt: true,
                    createdAt: true,
                    updatedAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);

        return {
            users: users as UserResponseDto[],
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        };
    }

    async findById(id: string): Promise<UserResponseDto> {
        const user = await this.prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                isEmailVerified: true,
                avatarUrl: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user as UserResponseDto;
    }

    async updateOwnProfile(
        userId: string,
        updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        // Check for email conflict if email is being updated
        if (updateUserDto.email) {
            const existingUser = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email.toLowerCase() },
            });

            if (existingUser && existingUser.id !== userId) {
                throw new ConflictException('Email already in use');
            }
        }

        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                ...updateUserDto,
                email: updateUserDto.email?.toLowerCase(),
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                isEmailVerified: true,
                avatarUrl: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user as UserResponseDto;
    }

    async updateByAdmin(
        id: string,
        updateUserDto: UpdateUserAdminDto,
        currentUserId: string,
    ): Promise<UserResponseDto> {
        // Prevent user from modifying their own role/status
        if (id === currentUserId && (updateUserDto.role || updateUserDto.isActive !== undefined)) {
            throw new ForbiddenException('Cannot modify your own role or status');
        }

        // Check if user exists
        const existingUser = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new NotFoundException('User not found');
        }

        // Check for email conflict if email is being updated
        if (updateUserDto.email) {
            const emailUser = await this.prisma.user.findUnique({
                where: { email: updateUserDto.email.toLowerCase() },
            });

            if (emailUser && emailUser.id !== id) {
                throw new ConflictException('Email already in use');
            }
        }

        const user = await this.prisma.user.update({
            where: { id },
            data: {
                ...updateUserDto,
                email: updateUserDto.email?.toLowerCase(),
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                isEmailVerified: true,
                avatarUrl: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        return user as UserResponseDto;
    }

    async deactivate(id: string, currentUserId: string): Promise<UserResponseDto> {
        if (id === currentUserId) {
            throw new ForbiddenException('Cannot deactivate your own account');
        }

        const user = await this.prisma.user.findUnique({
            where: { id },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const updatedUser = await this.prisma.user.update({
            where: { id },
            data: { isActive: false },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                role: true,
                isActive: true,
                isEmailVerified: true,
                avatarUrl: true,
                lastLoginAt: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        // Revoke all refresh tokens for deactivated user
        await this.prisma.refreshToken.updateMany({
            where: { userId: id },
            data: { revoked: true },
        });

        return updatedUser as UserResponseDto;
    }

    async changePassword(
        userId: string,
        changePasswordDto: ChangePasswordDto,
    ): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(
            changePasswordDto.currentPassword,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new BadRequestException('Current password is incorrect');
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(changePasswordDto.newPassword, 12);

        // Update password
        await this.prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });

        // Revoke all refresh tokens (force re-login on all devices)
        await this.prisma.refreshToken.updateMany({
            where: { userId },
            data: { revoked: true },
        });
    }
}
