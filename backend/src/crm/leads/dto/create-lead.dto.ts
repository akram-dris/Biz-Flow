import { IsDateString, IsDecimal, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min, Max } from 'class-validator';
import { LeadStage } from '@prisma/client';

export class CreateLeadDto {
    @IsUUID()
    @IsNotEmpty()
    contactId: string;

    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDecimal()
    @IsOptional()
    dealValue?: number;

    @IsEnum(LeadStage)
    @IsOptional()
    stage?: LeadStage = LeadStage.NEW;

    @IsDateString()
    @IsOptional()
    expectedCloseDate?: Date;

    @IsInt()
    @Min(0)
    @Max(100)
    @IsOptional()
    probability?: number = 0;

    @IsUUID()
    @IsOptional()
    assignedToId?: string;

    @IsString()
    @IsOptional()
    source?: string;

    @IsString()
    @IsOptional()
    lostReason?: string;
}
