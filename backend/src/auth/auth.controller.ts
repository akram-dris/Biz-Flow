import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
    RegisterDto,
    LoginDto,
    RefreshTokenDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    AuthResponseDto,
    MessageResponseDto,
} from './dto';
import { Public } from './decorators';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Public()
    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 409, description: 'Email already registered' })
    async register(@Body() registerDto: RegisterDto): Promise<AuthResponseDto> {
        return this.authService.register(registerDto);
    }

    @Public()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Login with email and password' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: 200,
        description: 'Login successful',
        type: AuthResponseDto,
    })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    async login(@Body() loginDto: LoginDto): Promise<AuthResponseDto> {
        return this.authService.login(loginDto);
    }

    @Public()
    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Refresh access token using refresh token' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: 200,
        description: 'Tokens refreshed successfully',
    })
    @ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
    async refreshTokens(
        @Body() refreshTokenDto: RefreshTokenDto,
    ): Promise<{ accessToken: string; refreshToken: string }> {
        return this.authService.refreshTokens(refreshTokenDto.refreshToken);
    }

    @Public()
    @Post('logout')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Logout and revoke refresh token' })
    @ApiBody({ type: RefreshTokenDto })
    @ApiResponse({
        status: 200,
        description: 'Logged out successfully',
        type: MessageResponseDto,
    })
    async logout(
        @Body() refreshTokenDto: RefreshTokenDto,
    ): Promise<MessageResponseDto> {
        await this.authService.logout(refreshTokenDto.refreshToken);
        return { message: 'Logged out successfully' };
    }

    @Public()
    @Post('forgot-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Request password reset email' })
    @ApiBody({ type: ForgotPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Password reset email sent (if email exists)',
        type: MessageResponseDto,
    })
    async forgotPassword(
        @Body() forgotPasswordDto: ForgotPasswordDto,
    ): Promise<MessageResponseDto> {
        await this.authService.forgotPassword(forgotPasswordDto.email);
        return {
            message: 'If an account exists with this email, a reset link has been sent',
        };
    }

    @Public()
    @Post('reset-password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Reset password using token from email' })
    @ApiBody({ type: ResetPasswordDto })
    @ApiResponse({
        status: 200,
        description: 'Password reset successfully',
        type: MessageResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Invalid or expired reset token' })
    async resetPassword(
        @Body() resetPasswordDto: ResetPasswordDto,
    ): Promise<MessageResponseDto> {
        await this.authService.resetPassword(
            resetPasswordDto.token,
            resetPasswordDto.newPassword,
        );
        return { message: 'Password reset successfully' };
    }
}
