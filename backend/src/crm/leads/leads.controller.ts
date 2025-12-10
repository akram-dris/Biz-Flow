import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

interface AuthenticatedUser {
    id: string;
    organizationId: string;
}

@ApiTags('leads')
@ApiBearerAuth()
@Controller('leads')
export class LeadsController {
    constructor(private readonly leadsService: LeadsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new lead' })
    create(@CurrentUser() user: AuthenticatedUser, @Body() createLeadDto: CreateLeadDto) {
        return this.leadsService.create(user.organizationId, user.id, createLeadDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all leads' })
    @ApiQuery({ name: 'contactId', required: false, type: String })
    findAll(@CurrentUser() user: AuthenticatedUser, @Query('contactId') contactId?: string) {
        return this.leadsService.findAll(user.organizationId, contactId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a lead by ID' })
    findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
        return this.leadsService.findOne(user.organizationId, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a lead' })
    update(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
        @Body() updateLeadDto: UpdateLeadDto,
    ) {
        return this.leadsService.update(user.organizationId, id, updateLeadDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a lead' })
    remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
        return this.leadsService.remove(user.organizationId, id);
    }
}
