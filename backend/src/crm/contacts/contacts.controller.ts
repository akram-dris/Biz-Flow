import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedUser {
    id: string;
    organizationId: string;
    email: string;
    role: string;
}

@ApiTags('contacts')
@ApiBearerAuth()
@Controller('contacts')
export class ContactsController {
    constructor(private readonly contactsService: ContactsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new contact' })
    create(@CurrentUser() user: AuthenticatedUser, @Body() createContactDto: CreateContactDto) {
        return this.contactsService.create(user.organizationId, user.id, createContactDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all contacts' })
    findAll(@CurrentUser() user: AuthenticatedUser) {
        return this.contactsService.findAll(user.organizationId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a contact by ID' })
    findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
        return this.contactsService.findOne(user.organizationId, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a contact' })
    update(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
        @Body() updateContactDto: UpdateContactDto,
    ) {
        return this.contactsService.update(user.organizationId, id, updateContactDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a contact' })
    remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
        return this.contactsService.remove(user.organizationId, id);
    }
}
