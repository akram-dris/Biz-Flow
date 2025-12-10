import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { LeadStage } from '@prisma/client';

@Injectable()
export class LeadsService {
    constructor(private prisma: PrismaService) { }

    async create(organizationId: string, userId: string, createLeadDto: CreateLeadDto) {
        return this.prisma.lead.create({
            data: {
                ...createLeadDto,
                createdById: userId,
            },
        });
    }

    async findAll(organizationId: string, contactId?: string) {
        const where: any = {
            contact: {
                organizationId,
            },
        };

        if (contactId) {
            where.contactId = contactId;
        }

        return this.prisma.lead.findMany({
            where,
            include: {
                contact: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        companyName: true,
                    },
                },
                assignedTo: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(organizationId: string, id: string) {
        const lead = await this.prisma.lead.findFirst({
            where: {
                id,
                contact: {
                    organizationId,
                },
            },
            include: {
                contact: true,
                assignedTo: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                    }
                },
                activities: {
                    orderBy: { activityDate: 'desc' },
                    take: 5
                }
            },
        });

        if (!lead) {
            throw new NotFoundException(`Lead with ID ${id} not found`);
        }

        return lead;
    }

    async update(organizationId: string, id: string, updateLeadDto: UpdateLeadDto) {
        const lead = await this.findOne(organizationId, id);

        const data: any = { ...updateLeadDto };

        if (updateLeadDto.stage) {
            if (updateLeadDto.stage === LeadStage.WON) {
                data.wonAt = new Date();
            } else if (updateLeadDto.stage === LeadStage.LOST) {
                data.lostAt = new Date();
            } else {
                // If moving back from WON/LOST, maybe clear dates?
                // Not strictly required but good practice if re-opening
                if (lead.stage === LeadStage.WON || lead.stage === LeadStage.LOST) {
                    data.wonAt = null;
                    data.lostAt = null;
                }
            }
        }

        return this.prisma.lead.update({
            where: { id },
            data,
        });
    }

    async remove(organizationId: string, id: string) {
        const lead = await this.findOne(organizationId, id);
        return this.prisma.lead.delete({
            where: { id },
        });
    }
}
