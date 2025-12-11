import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ActivityType } from '@prisma/client';

export class CreateActivityDto {
    @IsUUID()
    @IsOptional()
    contactId?: string;

    @IsUUID()
    @IsOptional()
    leadId?: string;

    @IsEnum(ActivityType)
    @IsNotEmpty()
    type: ActivityType;

    @IsString()
    @IsNotEmpty()
    subject: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDateString()
    activityDate: Date;

    @IsInt()
    @Min(0)
    @IsOptional()
    durationMinutes?: number;
}
