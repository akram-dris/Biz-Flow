import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class ResetPasswordDto {
    @ApiProperty({ description: 'Password reset token from email' })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({
        example: 'NewPassword123!',
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
