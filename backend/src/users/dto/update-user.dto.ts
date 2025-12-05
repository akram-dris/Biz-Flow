import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsOptional,
    IsString,
    IsEnum,
    IsBoolean,
    MinLength,
    Matches,
} from 'class-validator';
import { UserRole } from '@prisma/client';

export class UpdateUserDto {
    @ApiProperty({ example: 'John', required: false })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({ example: 'Doe', required: false })
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiProperty({ example: 'john.doe@example.com', required: false })
    @IsEmail()
    @IsOptional()
    email?: string;

    @ApiProperty({ example: 'https://example.com/avatar.jpg', required: false })
    @IsString()
    @IsOptional()
    avatarUrl?: string;
}

export class UpdateUserAdminDto extends UpdateUserDto {
    @ApiProperty({ enum: UserRole, required: false })
    @IsEnum(UserRole)
    @IsOptional()
    role?: UserRole;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @ApiProperty({ example: true, required: false })
    @IsBoolean()
    @IsOptional()
    isEmailVerified?: boolean;
}

export class ChangePasswordDto {
    @ApiProperty({ description: 'Current password' })
    @IsString()
    currentPassword: string;

    @ApiProperty({
        description:
            'New password (min 8 chars, must contain uppercase, lowercase, and number)',
    })
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    })
    newPassword: string;
}
