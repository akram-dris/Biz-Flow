import { Controller, Get } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { CurrentUser } from '../auth/decorators';
import {
    DashboardMetricsDto,
    DashboardActivityDto,
    DashboardStatsDto,
} from './dto';

interface AuthenticatedUser {
    id: string;
    organizationId: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('metrics')
    @ApiOperation({ summary: 'Get dashboard metrics' })
    @ApiResponse({
        status: 200,
        description: 'Dashboard metrics retrieved successfully',
        type: DashboardMetricsDto,
    })
    async getMetrics(
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<DashboardMetricsDto> {
        return this.dashboardService.getMetrics(user.organizationId);
    }

    @Get('activities')
    @ApiOperation({ summary: 'Get recent activities' })
    @ApiResponse({
        status: 200,
        description: 'Recent activities retrieved successfully',
        type: [DashboardActivityDto],
    })
    async getActivities(
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<DashboardActivityDto[]> {
        return this.dashboardService.getActivities(user.organizationId);
    }

    @Get('stats')
    @ApiOperation({ summary: 'Get dashboard stats (MTD vs last month)' })
    @ApiResponse({
        status: 200,
        description: 'Dashboard stats retrieved successfully',
        type: DashboardStatsDto,
    })
    async getStats(
        @CurrentUser() user: AuthenticatedUser,
    ): Promise<DashboardStatsDto> {
        return this.dashboardService.getStats(user.organizationId);
    }
}
