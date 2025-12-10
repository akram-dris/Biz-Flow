import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

interface AuthenticatedUser {
    id: string;
    organizationId: string;
}

@ApiTags('activities')
@ApiBearerAuth()
@Controller('activities')
export class ActivitiesController {
    constructor(private readonly activitiesService: ActivitiesService) { }

    @Post()
    @ApiOperation({ summary: 'Log an activity' })
    create(@CurrentUser() user: AuthenticatedUser, @Body() createActivityDto: CreateActivityDto) {
        return this.activitiesService.create(user.organizationId, user.id, createActivityDto);
    }

    @Get()
    @ApiOperation({ summary: 'List activities' })
    @ApiQuery({ name: 'contactId', required: false, type: String })
    @ApiQuery({ name: 'leadId', required: false, type: String })
    findAll(
        @CurrentUser() user: AuthenticatedUser,
        @Query('contactId') contactId?: string,
        @Query('leadId') leadId?: string,
    ) {
        return this.activitiesService.findAll(user.organizationId, contactId, leadId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an activity by ID' })
    findOne(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
        return this.activitiesService.findOne(user.organizationId, id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update an activity' })
    update(
        @CurrentUser() user: AuthenticatedUser,
        @Param('id') id: string,
        @Body() updateActivityDto: UpdateActivityDto,
    ) {
        return this.activitiesService.update(user.organizationId, id, updateActivityDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an activity' })
    remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
        return this.activitiesService.remove(user.organizationId, id);
    }
}
