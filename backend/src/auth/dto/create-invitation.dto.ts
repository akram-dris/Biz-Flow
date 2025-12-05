import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '@prisma/client';

export class CreateInvitationDto {
    @ApiProperty({ example: 'employee@company.com' })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ enum: UserRole, default: UserRole.EMPLOYEE })
    @IsEnum(UserRole)
    role: UserRole;
}
