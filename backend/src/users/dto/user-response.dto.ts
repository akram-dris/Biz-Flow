import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

export class UserResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    email: string;

    @ApiProperty()
    firstName: string;

    @ApiProperty()
    lastName: string;

    @ApiProperty({ enum: UserRole })
    role: UserRole;

    @ApiProperty()
    isActive: boolean;

    @ApiProperty()
    isEmailVerified: boolean;

    @ApiProperty({ nullable: true })
    avatarUrl: string | null;

    @ApiProperty({ nullable: true })
    lastLoginAt: Date | null;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class UserListResponseDto {
    @ApiProperty({ type: [UserResponseDto] })
    users: UserResponseDto[];

    @ApiProperty()
    total: number;

    @ApiProperty()
    page: number;

    @ApiProperty()
    limit: number;

    @ApiProperty()
    totalPages: number;
}
