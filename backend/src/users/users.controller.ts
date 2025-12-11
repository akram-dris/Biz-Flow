import {
    Controller,
    Get,
    Patch,
    Delete,
    Body,
    Param,
    Query,
    UseGuards,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { UsersService } from './users.service';
import {
    UpdateUserDto,
    UpdateUserAdminDto,
    ChangePasswordDto,
    UserResponseDto,
    UserListResponseDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { Roles, CurrentUser } from '../auth/decorators';
import { MessageResponseDto } from '../auth/dto';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get()
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'List all users (admin only)' })
    @ApiQuery({ name: 'page', required: false, type: Number })
    @ApiQuery({ name: 'limit', required: false, type: Number })
    @ApiQuery({ name: 'search', required: false, type: String })
    @ApiQuery({ name: 'role', required: false, enum: UserRole })
    @ApiResponse({
        status: 200,
        description: 'Users list',
        type: UserListResponseDto,
    })
    async findAll(
        @CurrentUser() currentUser: any,
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('role') role?: UserRole,
    ): Promise<UserListResponseDto> {
        return this.usersService.findAll(
            currentUser.organizationId,
            page ? parseInt(page, 10) : 1,
            limit ? parseInt(limit, 10) : 10,
            search,
            role,
        );
    }

    @Get('me')
    @ApiOperation({ summary: 'Get current user profile' })
    @ApiResponse({
        status: 200,
        description: 'Current user profile',
        type: UserResponseDto,
    })
    async getMe(@CurrentUser() user: any): Promise<UserResponseDto> {
        return this.usersService.findById(user.id);
    }

    @Patch('me')
    @ApiOperation({ summary: 'Update current user profile' })
    @ApiResponse({
        status: 200,
        description: 'Updated user profile',
        type: UserResponseDto,
    })
    async updateMe(
        @CurrentUser() user: any,
        @Body() updateUserDto: UpdateUserDto,
    ): Promise<UserResponseDto> {
        return this.usersService.updateOwnProfile(user.id, updateUserDto);
    }

    @Patch('me/password')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Change current user password' })
    @ApiResponse({
        status: 200,
        description: 'Password changed successfully',
        type: MessageResponseDto,
    })
    @ApiResponse({ status: 400, description: 'Current password is incorrect' })
    async changePassword(
        @CurrentUser() user: any,
        @Body() changePasswordDto: ChangePasswordDto,
    ): Promise<MessageResponseDto> {
        await this.usersService.changePassword(user.id, changePasswordDto);
        return { message: 'Password changed successfully' };
    }

    @Get(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Get user by ID (admin only)' })
    @ApiResponse({
        status: 200,
        description: 'User details',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async findById(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<UserResponseDto> {
        return this.usersService.findById(id);
    }

    @Patch(':id')
    @Roles(UserRole.OWNER, UserRole.MANAGER)
    @ApiOperation({ summary: 'Update user by ID (admin only)' })
    @ApiResponse({
        status: 200,
        description: 'Updated user',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async updateById(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateUserDto: UpdateUserAdminDto,
        @CurrentUser() currentUser: any,
    ): Promise<UserResponseDto> {
        return this.usersService.updateByAdmin(id, updateUserDto, currentUser.id);
    }

    @Delete(':id')
    @Roles(UserRole.OWNER)
    @ApiOperation({ summary: 'Deactivate user by ID (owner only)' })
    @ApiResponse({
        status: 200,
        description: 'User deactivated',
        type: UserResponseDto,
    })
    @ApiResponse({ status: 404, description: 'User not found' })
    async deactivate(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser() currentUser: any,
    ): Promise<UserResponseDto> {
        return this.usersService.deactivate(id, currentUser.id);
    }
}
