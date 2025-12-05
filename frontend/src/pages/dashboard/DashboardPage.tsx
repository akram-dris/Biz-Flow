import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { PageHeader, Breadcrumbs } from '../../components/layout';
import { MetricCard, RecentActivities, QuickStats } from '../../components/dashboard';
import dashboardService, {
    type DashboardMetrics,
    type DashboardActivity,
    type DashboardStats,
} from '../../services/dashboard.service';
import {
    DollarSign,
    CreditCard,
    TrendingUp,
    CheckSquare,
    FileText,
    Package,
} from 'lucide-react';

export function DashboardPage() {
    const { user } = useAuth();
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [activities, setActivities] = useState<DashboardActivity[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoadingActivities, setIsLoadingActivities] = useState(true);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all data in parallel
                const [metricsData, activitiesData, statsData] = await Promise.all([
                    dashboardService.getMetrics().catch((err) => {
                        console.error('Error fetching metrics:', err);
                        return null;
                    }),
                    dashboardService.getActivities().catch((err) => {
                        console.error('Error fetching activities:', err);
                        return [];
                    }),
                    dashboardService.getStats().catch((err) => {
                        console.error('Error fetching stats:', err);
                        return null;
                    }),
                ]);

                setMetrics(metricsData);
                setActivities(activitiesData);
                setStats(statsData);
            } catch (err) {
                setError('Failed to load dashboard data');
                console.error(err);
            } finally {
                setIsLoadingActivities(false);
                setIsLoadingStats(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getProfitColor = () => {
        if (!metrics) return 'default';
        return metrics.profitLoss >= 0 ? 'success' : 'danger';
    };

    return (
        <div>
            <Breadcrumbs />
            <PageHeader
                title={`Welcome back, ${user?.firstName}!`}
                description="Here's what's happening with your business today."
            />

            {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400">
                    {error}
                </div>
            )}

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                <MetricCard
                    title="Total Revenue"
                    value={metrics?.totalRevenue ?? 0}
                    icon={<DollarSign size={20} />}
                    format="currency"
                    colorScheme="success"
                    trend={stats ? {
                        value: stats.revenueChangePercent,
                        isPositive: stats.revenueChangePercent >= 0,
                    } : undefined}
                />
                <MetricCard
                    title="Total Expenses"
                    value={metrics?.totalExpenses ?? 0}
                    icon={<CreditCard size={20} />}
                    format="currency"
                    colorScheme="warning"
                    trend={stats ? {
                        value: stats.expensesChangePercent,
                        isPositive: stats.expensesChangePercent <= 0, // Lower expenses is positive
                    } : undefined}
                />
                <MetricCard
                    title="Profit / Loss"
                    value={metrics?.profitLoss ?? 0}
                    icon={<TrendingUp size={20} />}
                    format="currency"
                    colorScheme={getProfitColor()}
                />
                <MetricCard
                    title="Open Tasks"
                    value={metrics?.openTasksCount ?? 0}
                    icon={<CheckSquare size={20} />}
                    trend={stats ? {
                        value: stats.tasksChangePercent,
                    } : undefined}
                />
                <MetricCard
                    title="Pending Invoices"
                    value={metrics?.pendingInvoicesCount ?? 0}
                    icon={<FileText size={20} />}
                    colorScheme={metrics && metrics.pendingInvoicesCount > 5 ? 'warning' : 'default'}
                    trend={stats ? {
                        value: stats.invoicesChangePercent,
                    } : undefined}
                />
                <MetricCard
                    title="Low Stock Items"
                    value={metrics?.lowStockCount ?? 0}
                    icon={<Package size={20} />}
                    colorScheme={metrics && metrics.lowStockCount > 0 ? 'danger' : 'success'}
                />
            </div>

            {/* Bottom Section: Recent Activities + Quick Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentActivities
                    activities={activities}
                    isLoading={isLoadingActivities}
                />
                <QuickStats
                    stats={stats}
                    isLoading={isLoadingStats}
                />
            </div>
        </div>
    );
}

export default DashboardPage;
