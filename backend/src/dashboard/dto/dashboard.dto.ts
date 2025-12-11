import { ApiProperty } from '@nestjs/swagger';

export class DashboardMetricsDto {
    @ApiProperty({ description: 'Total revenue from paid invoices' })
    totalRevenue: number;

    @ApiProperty({ description: 'Total expenses' })
    totalExpenses: number;

    @ApiProperty({ description: 'Profit/Loss (revenue - expenses)' })
    profitLoss: number;

    @ApiProperty({ description: 'Count of open tasks (not DONE)' })
    openTasksCount: number;

    @ApiProperty({ description: 'Count of pending invoices (SENT or OVERDUE)' })
    pendingInvoicesCount: number;

    @ApiProperty({ description: 'Count of low stock items' })
    lowStockCount: number;
}

export class DashboardActivityDto {
    @ApiProperty({ description: 'Activity ID' })
    id: string;

    @ApiProperty({ description: 'Activity type (CALL, MEETING, EMAIL, NOTE)' })
    type: string;

    @ApiProperty({ description: 'Activity subject' })
    subject: string;

    @ApiProperty({ description: 'Activity description' })
    description: string | null;

    @ApiProperty({ description: 'Activity date' })
    activityDate: Date;

    @ApiProperty({ description: 'Performer name' })
    performedByName: string;

    @ApiProperty({ description: 'Related contact name', required: false })
    contactName?: string;
}

export class DashboardStatsDto {
    @ApiProperty({ description: 'Revenue this month' })
    revenueThisMonth: number;

    @ApiProperty({ description: 'Revenue last month' })
    revenueLastMonth: number;

    @ApiProperty({ description: 'Revenue change percentage' })
    revenueChangePercent: number;

    @ApiProperty({ description: 'Expenses this month' })
    expensesThisMonth: number;

    @ApiProperty({ description: 'Expenses last month' })
    expensesLastMonth: number;

    @ApiProperty({ description: 'Expenses change percentage' })
    expensesChangePercent: number;

    @ApiProperty({ description: 'New tasks this month' })
    tasksThisMonth: number;

    @ApiProperty({ description: 'Tasks last month' })
    tasksLastMonth: number;

    @ApiProperty({ description: 'Tasks change percentage' })
    tasksChangePercent: number;

    @ApiProperty({ description: 'New invoices this month' })
    invoicesThisMonth: number;

    @ApiProperty({ description: 'Invoices last month' })
    invoicesLastMonth: number;

    @ApiProperty({ description: 'Invoices change percentage' })
    invoicesChangePercent: number;
}
