import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactsService {
    constructor(private prisma: PrismaService) { }

    async create(organizationId: string, userId: string, createContactDto: CreateContactDto) {
        return this.prisma.contact.create({
            data: {
                ...createContactDto,
                organizationId,
                createdById: userId,
            },
        });
    }

    async findAll(organizationId: string) {
        return this.prisma.contact.findMany({
            where: { organizationId },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(organizationId: string, id: string) {
        const contact = await this.prisma.contact.findFirst({
            where: { id, organizationId },
        });

        if (!contact) {
            throw new NotFoundException(`Contact with ID ${id} not found`);
        }

        return contact;
    }

    async update(organizationId: string, id: string, updateContactDto: UpdateContactDto) {
        const contact = await this.findOne(organizationId, id); // Ensure existence and ownership

        return this.prisma.contact.update({
            where: { id: contact.id },
            data: updateContactDto,
        });
    }

    async remove(organizationId: string, id: string) {
        const contact = await this.findOne(organizationId, id); // Ensure existence and ownership

        return this.prisma.contact.delete({
            where: { id: contact.id },
        });
    }
}
