import { ApiProperty } from '@nestjs/swagger';
import {
    IsEmail,
    IsNotEmpty,
    IsString,
    MinLength,
    Matches,
} from 'class-validator';

export class RegisterDto {
    @ApiProperty({ example: 'John', description: 'User first name' })
    @IsString()
    @IsNotEmpty()
    firstName: string;

    @ApiProperty({ example: 'Doe', description: 'User last name' })
    @IsString()
    @IsNotEmpty()
    lastName: string;

    @ApiProperty({ example: 'john.doe@example.com', description: 'User email' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 'Password123!',
        description:
            'Password (min 8 chars, must contain uppercase, lowercase, and number)',
    })
    @IsString()
    @MinLength(8)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message:
            'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    })
    password: string;
}
