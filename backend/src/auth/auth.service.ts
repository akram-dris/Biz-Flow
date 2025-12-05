import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import {
    RegisterDto,
    LoginDto,
    AuthResponseDto,
    UserResponseDto,
} from './dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const { email, password, firstName, lastName, organizationName } = registerDto;

        // Check if user already exists
        const existingUser = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        // Generate slug from organization name
        const slug = this.generateSlug(organizationName);

        // Check if slug exists
        const existingOrg = await this.prisma.organization.findUnique({
            where: { slug },
        });

        if (existingOrg) {
            throw new ConflictException('Organization name already taken. Please choose a different name.');
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create organization and user in a transaction
        const { organization, user } = await this.prisma.$transaction(async (tx) => {
            // Create organization
            const org = await tx.organization.create({
                data: {
                    name: organizationName,
                    slug,
                },
            });

            // Create user as OWNER
            const newUser = await tx.user.create({
                data: {
                    organizationId: org.id,
                    email: email.toLowerCase(),
                    passwordHash,
                    firstName,
                    lastName,
                    role: 'OWNER',
                },
            });

            return { organization: org, user: newUser };
        });

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email);

        // Store refresh token
        await this.storeRefreshToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
            user: this.mapUserToResponse(user),
        };
    }

    private generateSlug(name: string): string {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '')
            .substring(0, 50);
    }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const { email, password } = loginDto;

        // Find user
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Update last login
        await this.prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
        });

        // Generate tokens
        const tokens = await this.generateTokens(user.id, user.email);

        // Store refresh token
        await this.storeRefreshToken(user.id, tokens.refreshToken);

        return {
            ...tokens,
            user: this.mapUserToResponse(user),
        };
    }

    async refreshTokens(
        refreshToken: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        // Find the refresh token in database
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token: refreshToken },
            include: { user: true },
        });

        if (!storedToken) {
            throw new UnauthorizedException('Invalid refresh token');
        }

        if (storedToken.revoked) {
            throw new UnauthorizedException('Refresh token has been revoked');
        }

        if (storedToken.expiresAt < new Date()) {
            throw new UnauthorizedException('Refresh token has expired');
        }

        if (!storedToken.user.isActive) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Revoke old refresh token
        await this.prisma.refreshToken.update({
            where: { id: storedToken.id },
            data: { revoked: true },
        });

        // Generate new tokens
        const tokens = await this.generateTokens(
            storedToken.user.id,
            storedToken.user.email,
        );

        // Store new refresh token
        await this.storeRefreshToken(storedToken.user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(refreshToken: string): Promise<void> {
        // Revoke the refresh token
        await this.prisma.refreshToken.updateMany({
            where: { token: refreshToken },
            data: { revoked: true },
        });
    }

    async forgotPassword(email: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        // Always return success to prevent email enumeration
        if (!user) {
            return;
        }

        // Generate reset token
        const resetToken = randomBytes(32).toString('hex');
        const hashedToken = await bcrypt.hash(resetToken, 10);

        // Store reset token (valid for 1 hour)
        await this.prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token: hashedToken,
                expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
            },
        });

        // In production, send email with reset link
        // For now, log to console (mock email)
        console.log('========================================');
        console.log('PASSWORD RESET TOKEN (Mock Email)');
        console.log('========================================');
        console.log(`Email: ${email}`);
        console.log(`Reset Token: ${resetToken}`);
        console.log(`Reset URL: ${this.configService.get('FRONTEND_URL')}/reset-password?token=${resetToken}`);
        console.log('========================================');
    }

    async resetPassword(token: string, newPassword: string): Promise<void> {
        // Find all non-expired, unused tokens for this token
        const resetTokens = await this.prisma.passwordResetToken.findMany({
            where: {
                used: false,
                expiresAt: { gt: new Date() },
            },
            include: { user: true },
        });

        // Find matching token (by comparing bcrypt hashes)
        type ResetTokenWithUser = typeof resetTokens[number];
        let validToken: ResetTokenWithUser | null = null;
        for (const storedToken of resetTokens) {
            const isMatch = await bcrypt.compare(token, storedToken.token);
            if (isMatch) {
                validToken = storedToken;
                break;
            }
        }

        if (!validToken) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(newPassword, 12);

        // Update user password
        await this.prisma.user.update({
            where: { id: validToken.userId },
            data: { passwordHash },
        });

        // Mark token as used
        await this.prisma.passwordResetToken.update({
            where: { id: validToken.id },
            data: { used: true },
        });

        // Revoke all refresh tokens for this user (force re-login)
        await this.prisma.refreshToken.updateMany({
            where: { userId: validToken.userId },
            data: { revoked: true },
        });
    }

    private async generateTokens(
        userId: string,
        email: string,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                { sub: userId, email },
                {
                    secret: this.configService.get('JWT_SECRET') || 'your-secret-key',
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                { sub: userId, email },
                {
                    secret:
                        this.configService.get('JWT_REFRESH_SECRET') ||
                        'your-refresh-secret-key',
                    expiresIn: '7d',
                },
            ),
        ]);

        return { accessToken, refreshToken };
    }

    private async storeRefreshToken(
        userId: string,
        token: string,
    ): Promise<void> {
        await this.prisma.refreshToken.create({
            data: {
                userId,
                token,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            },
        });
    }

    private mapUserToResponse(user: any): UserResponseDto {
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isActive: user.isActive,
            isEmailVerified: user.isEmailVerified,
            avatarUrl: user.avatarUrl,
            lastLoginAt: user.lastLoginAt,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}
