import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InvitationsService } from './invitations.service';
import { CreateInvitationDto, AcceptInvitationDto } from './dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserRole } from '@prisma/client';
import { Public } from './decorators/public.decorator';

@ApiTags('invitations')
@Controller('invitations')
export class InvitationsController {
    constructor(private readonly invitationsService: InvitationsService) { }

    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Send an invitation to join the organization' })
    createInvitation(
        @CurrentUser() user: any,
        @Body() createInvitationDto: CreateInvitationDto,
    ) {
        return this.invitationsService.createInvitation(
            user.organizationId,
            user.id,
            createInvitationDto,
        );
    }

    @Get()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Get pending invitations' })
    getPendingInvitations(@CurrentUser() user: any) {
        return this.invitationsService.getPendingInvitations(user.organizationId);
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Cancel/Delete an invitation' })
    deleteInvitation(@CurrentUser() user: any, @Param('id') id: string) {
        return this.invitationsService.deleteInvitation(user.organizationId, id);
    }

    @Public()
    @Get('validate')
    @ApiOperation({ summary: 'Validate invitation token' })
    validateToken(@Query('token') token: string) {
        return this.invitationsService.validateToken(token);
    }

    @Public()
    @Post('accept')
    @ApiOperation({ summary: 'Accept invitation and create account' })
    acceptInvitation(@Body() acceptInvitationDto: AcceptInvitationDto) {
        return this.invitationsService.acceptInvitation(acceptInvitationDto);
    }
}
