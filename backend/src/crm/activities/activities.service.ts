import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';

@Injectable()
export class ActivitiesService {
    constructor(private prisma: PrismaService) { }

    async create(organizationId: string, userId: string, createActivityDto: CreateActivityDto) {
        // Validate linking
        if (!createActivityDto.contactId && !createActivityDto.leadId) {
            throw new BadRequestException('Activity must be linked to a contact or lead');
        }

        if (createActivityDto.contactId) {
            const contact = await this.prisma.contact.findFirst({
                where: { id: createActivityDto.contactId, organizationId },
            });
            if (!contact) throw new NotFoundException('Contact not found');
        }

        if (createActivityDto.leadId) {
            const lead = await this.prisma.lead.findFirst({
                where: { id: createActivityDto.leadId, contact: { organizationId } },
            });
            if (!lead) throw new NotFoundException('Lead not found');
        }

        return this.prisma.activity.create({
            data: {
                ...createActivityDto,
                performedById: userId,
            },
        });
    }

    async findAll(organizationId: string, contactId?: string, leadId?: string) {
        const where: any = {};

        if (contactId) where.contactId = contactId;
        if (leadId) where.leadId = leadId;

        // Ensure we only get activities for this org
        // Since activity doesn't have an orgId, we rely on contact/lead relations.
        // However, fetching all activities for an org is tricky without direct link.
        // But usually we fetch by contact or lead.
        // If fetching all, we need relation filtering.

        if (!contactId && !leadId) {
            // Fetch all activities where contact OR lead belongs to organization
            where.OR = [
                { contact: { organizationId } },
                { lead: { contact: { organizationId } } }
            ];
        } else {
            // If specific entity requested, verify it belongs to org implicitly in query
            if (contactId) where.contact = { organizationId };
            // For lead, it's transitive via contact usually, or check lead->contact->org
            if (leadId) where.lead = { contact: { organizationId } };
        }

        return this.prisma.activity.findMany({
            where,
            include: {
                performedBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    }
                }
            },
            orderBy: { activityDate: 'desc' },
        });
    }

    async findOne(organizationId: string, id: string) {
        const activity = await this.prisma.activity.findFirst({
            where: {
                id,
                OR: [
                    { contact: { organizationId } },
                    { lead: { contact: { organizationId } } }
                ]
            },
            include: {
                performedBy: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        avatarUrl: true,
                    }
                },
                contact: {
                    select: { id: true, firstName: true, lastName: true, companyName: true }
                },
                lead: {
                    select: { id: true, title: true }
                }
            }
        });

        if (!activity) {
            throw new NotFoundException(`Activity with ID ${id} not found`);
        }

        return activity;
    }

    async update(organizationId: string, id: string, updateActivityDto: UpdateActivityDto) {
        const activity = await this.findOne(organizationId, id);
        return this.prisma.activity.update({
            where: { id },
            data: updateActivityDto,
        });
    }

    async remove(organizationId: string, id: string) {
        const activity = await this.findOne(organizationId, id);
        return this.prisma.activity.delete({
            where: { id },
        });
    }
}
