import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from './email.service';
import { CreateInvitationDto, AcceptInvitationDto } from './dto';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class InvitationsService {
    constructor(
        private prisma: PrismaService,
        private emailService: EmailService,
        private configService: ConfigService,
    ) { }

    async createInvitation(
        organizationId: string,
        invitedById: string,
        dto: CreateInvitationDto,
    ) {
        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Check if invitation already exists
        const existingInvitation = await this.prisma.invitation.findFirst({
            where: {
                email: dto.email,
                organizationId,
            },
        });

        if (existingInvitation) {
            // If expired, delete and create new one
            if (existingInvitation.expiresAt < new Date()) {
                await this.prisma.invitation.delete({
                    where: { id: existingInvitation.id },
                });
            } else {
                throw new ConflictException('Invitation already sent to this email');
            }
        }

        // Create invitation
        const token = uuidv4();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

        const invitation = await this.prisma.invitation.create({
            data: {
                organizationId,
                invitedById,
                email: dto.email,
                role: dto.role,
                token,
                expiresAt,
            },
            include: {
                organization: true,
                invitedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        // Send email
        const frontendUrl = this.configService.get('FRONTEND_URL') || 'http://localhost:5173';
        const inviteLink = `${frontendUrl}/accept-invite?token=${token}`;
        const inviterName = `${invitation.invitedBy.firstName} ${invitation.invitedBy.lastName}`;

        await this.emailService.sendInvitationEmail(
            dto.email,
            inviterName,
            invitation.organization.name,
            dto.role,
            inviteLink,
        );

        return {
            message: 'Invitation sent successfully',
            invitation,
        };
    }

    async getPendingInvitations(organizationId: string) {
        return this.prisma.invitation.findMany({
            where: {
                organizationId,
                acceptedAt: null,
                expiresAt: {
                    gt: new Date(),
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                invitedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });
    }

    async deleteInvitation(organizationId: string, invitationId: string) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { id: invitationId },
        });

        if (!invitation) {
            throw new NotFoundException('Invitation not found');
        }

        if (invitation.organizationId !== organizationId) {
            throw new UnauthorizedException('Cannot delete invitation from another organization');
        }

        await this.prisma.invitation.delete({
            where: { id: invitationId },
        });

        return { message: 'Invitation deleted successfully' };
    }

    async validateToken(token: string) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { token },
            include: {
                organization: true,
                invitedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
        });

        if (!invitation) {
            throw new NotFoundException('Invalid invitation token');
        }

        if (invitation.acceptedAt) {
            throw new BadRequestException('Invitation already accepted');
        }

        if (invitation.expiresAt < new Date()) {
            throw new BadRequestException('Invitation expired');
        }

        return invitation;
    }

    async acceptInvitation(dto: AcceptInvitationDto) {
        const invitation = await this.validateToken(dto.token);

        // Check if user exists (double check)
        const existingUser = await this.prisma.user.findUnique({
            where: { email: invitation.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(dto.password, 12);

        // Create user and update invitation in transaction
        const user = await this.prisma.$transaction(async (tx) => {
            // Create user
            const newUser = await tx.user.create({
                data: {
                    email: invitation.email,
                    passwordHash,
                    firstName: dto.firstName,
                    lastName: dto.lastName,
                    role: invitation.role,
                    organizationId: invitation.organizationId,
                    isEmailVerified: true, // Auto-verify since they clicked email link
                },
            });

            // Mark invitation as accepted
            await tx.invitation.update({
                where: { id: invitation.id },
                data: {
                    acceptedAt: new Date(),
                },
            });

            return newUser;
        });

        return {
            message: 'Account created successfully',
            email: user.email,
        };
    }
}
