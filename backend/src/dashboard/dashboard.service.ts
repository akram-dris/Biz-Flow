import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
    DashboardMetricsDto,
    DashboardActivityDto,
    DashboardStatsDto,
} from './dto';

@Injectable()
export class DashboardService {
    constructor(private readonly prisma: PrismaService) { }

    /**
     * Get dashboard metrics for the organization
     */
    async getMetrics(organizationId: string): Promise<DashboardMetricsDto> {
        // Total revenue from paid invoices
        const revenueResult = await this.prisma.invoice.aggregate({
            where: {
                contact: {
                    organizationId,
                },
                status: 'PAID',
            },
            _sum: {
                total: true,
            },
        });
        const totalRevenue = revenueResult._sum.total?.toNumber() ?? 0;

        // Total expenses
        const expensesResult = await this.prisma.expense.aggregate({
            where: {
                category: {
                    organizationId,
                },
            },
            _sum: {
                amount: true,
            },
        });
        const totalExpenses = expensesResult._sum.amount?.toNumber() ?? 0;

        // Profit/Loss
        const profitLoss = totalRevenue - totalExpenses;

        // Count of open tasks (not DONE)
        const openTasksCount = await this.prisma.task.count({
            where: {
                project: {
                    organizationId,
                },
                status: {
                    not: 'DONE',
                },
            },
        });

        // Count of pending invoices (SENT or OVERDUE)
        const pendingInvoicesCount = await this.prisma.invoice.count({
            where: {
                contact: {
                    organizationId,
                },
                status: {
                    in: ['SENT', 'OVERDUE'],
                },
            },
        });

        // Count of low stock items
        const lowStockCount = await this.prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) as count
            FROM products p
            WHERE p.organization_id = ${organizationId}::uuid
            AND p.stock_quantity < p.low_stock_threshold
            AND p.is_active = true
        `;
        const lowStockCountNumber = Number(lowStockCount[0]?.count ?? 0);

        return {
            totalRevenue,
            totalExpenses,
            profitLoss,
            openTasksCount,
            pendingInvoicesCount,
            lowStockCount: lowStockCountNumber,
        };
    }

    /**
     * Get recent activities for the organization
     */
    async getActivities(organizationId: string): Promise<DashboardActivityDto[]> {
        const activities = await this.prisma.activity.findMany({
            where: {
                OR: [
                    {
                        contact: {
                            organizationId,
                        },
                    },
                    {
                        lead: {
                            contact: {
                                organizationId,
                            },
                        },
                    },
                ],
            },
            include: {
                performedBy: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                contact: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: {
                activityDate: 'desc',
            },
            take: 10,
        });

        return activities.map((activity) => ({
            id: activity.id,
            type: activity.type,
            subject: activity.subject,
            description: activity.description,
            activityDate: activity.activityDate,
            performedByName: `${activity.performedBy.firstName} ${activity.performedBy.lastName}`,
            contactName: activity.contact
                ? `${activity.contact.firstName} ${activity.contact.lastName}`
                : undefined,
        }));
    }

    /**
     * Get stats comparing this month vs last month
     */
    async getStats(organizationId: string): Promise<DashboardStatsDto> {
        const now = new Date();
        const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Revenue this month
        const revenueThisMonthResult = await this.prisma.invoice.aggregate({
            where: {
                contact: {
                    organizationId,
                },
                status: 'PAID',
                paidAt: {
                    gte: startOfThisMonth,
                },
            },
            _sum: {
                total: true,
            },
        });
        const revenueThisMonth = revenueThisMonthResult._sum.total?.toNumber() ?? 0;

        // Revenue last month
        const revenueLastMonthResult = await this.prisma.invoice.aggregate({
            where: {
                contact: {
                    organizationId,
                },
                status: 'PAID',
                paidAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
            _sum: {
                total: true,
            },
        });
        const revenueLastMonth = revenueLastMonthResult._sum.total?.toNumber() ?? 0;

        // Expenses this month
        const expensesThisMonthResult = await this.prisma.expense.aggregate({
            where: {
                category: {
                    organizationId,
                },
                expenseDate: {
                    gte: startOfThisMonth,
                },
            },
            _sum: {
                amount: true,
            },
        });
        const expensesThisMonth = expensesThisMonthResult._sum.amount?.toNumber() ?? 0;

        // Expenses last month
        const expensesLastMonthResult = await this.prisma.expense.aggregate({
            where: {
                category: {
                    organizationId,
                },
                expenseDate: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
            _sum: {
                amount: true,
            },
        });
        const expensesLastMonth = expensesLastMonthResult._sum.amount?.toNumber() ?? 0;

        // Tasks this month
        const tasksThisMonth = await this.prisma.task.count({
            where: {
                project: {
                    organizationId,
                },
                createdAt: {
                    gte: startOfThisMonth,
                },
            },
        });

        // Tasks last month
        const tasksLastMonth = await this.prisma.task.count({
            where: {
                project: {
                    organizationId,
                },
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
        });

        // Invoices this month
        const invoicesThisMonth = await this.prisma.invoice.count({
            where: {
                contact: {
                    organizationId,
                },
                createdAt: {
                    gte: startOfThisMonth,
                },
            },
        });

        // Invoices last month
        const invoicesLastMonth = await this.prisma.invoice.count({
            where: {
                contact: {
                    organizationId,
                },
                createdAt: {
                    gte: startOfLastMonth,
                    lte: endOfLastMonth,
                },
            },
        });

        // Calculate percentage changes
        const calculateChangePercent = (current: number, previous: number): number => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Math.round(((current - previous) / previous) * 100);
        };

        return {
            revenueThisMonth,
            revenueLastMonth,
            revenueChangePercent: calculateChangePercent(revenueThisMonth, revenueLastMonth),
            expensesThisMonth,
            expensesLastMonth,
            expensesChangePercent: calculateChangePercent(expensesThisMonth, expensesLastMonth),
            tasksThisMonth,
            tasksLastMonth,
            tasksChangePercent: calculateChangePercent(tasksThisMonth, tasksLastMonth),
            invoicesThisMonth,
            invoicesLastMonth,
            invoicesChangePercent: calculateChangePercent(invoicesThisMonth, invoicesLastMonth),
        };
    }
}
