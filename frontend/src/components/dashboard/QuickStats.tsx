import { TrendingUp, TrendingDown, Minus, DollarSign, CreditCard, CheckSquare, FileText } from 'lucide-react';
import type { DashboardStats } from '../../services/dashboard.service';

interface QuickStatsProps {
    stats: DashboardStats | null;
    isLoading?: boolean;
}

interface StatItemProps {
    label: string;
    currentValue: number;
    previousValue: number;
    changePercent: number;
    icon: React.ReactNode;
    format?: 'currency' | 'number';
}

function StatItem({ label, currentValue, previousValue, changePercent, icon, format = 'number' }: StatItemProps) {
    const formatValue = (val: number): string => {
        if (format === 'currency') {
            return new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
            }).format(val);
        }
        return new Intl.NumberFormat('en-US').format(val);
    };

    const getTrendIcon = () => {
        if (changePercent === 0) return <Minus size={12} />;
        return changePercent > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />;
    };

    const getTrendColor = () => {
        if (changePercent === 0) return 'text-foreground-muted bg-foreground-muted/10';
        return changePercent > 0
            ? 'text-emerald-400 bg-emerald-500/10'
            : 'text-red-400 bg-red-500/10';
    };

    return (
        <div className="flex items-center justify-between p-4 rounded-xl bg-card-hover/50 hover:bg-card-hover transition-colors">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-500/20 text-indigo-400">
                    {icon}
                </div>
                <div>
                    <p className="text-sm text-foreground-muted">{label}</p>
                    <p className="text-lg font-semibold text-foreground">{formatValue(currentValue)}</p>
                </div>
            </div>
            <div className="text-right">
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getTrendColor()}`}>
                    {getTrendIcon()}
                    {Math.abs(changePercent)}%
                </div>
                <p className="text-xs text-foreground-muted mt-1">
                    vs {formatValue(previousValue)}
                </p>
            </div>
        </div>
    );
}

export function QuickStats({ stats, isLoading }: QuickStatsProps) {
    if (isLoading) {
        return (
            <div className="bg-card rounded-2xl border border-default p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Comparison</h3>
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse h-[72px] bg-card-hover rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="bg-card rounded-2xl border border-default p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Comparison</h3>
                <div className="text-center py-8 text-foreground-muted">
                    <p>No data available</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl border border-default p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Monthly Comparison</h3>
            <p className="text-sm text-foreground-muted mb-4">This month vs. last month</p>

            <div className="space-y-3">
                <StatItem
                    label="Revenue"
                    currentValue={stats.revenueThisMonth}
                    previousValue={stats.revenueLastMonth}
                    changePercent={stats.revenueChangePercent}
                    icon={<DollarSign size={18} />}
                    format="currency"
                />
                <StatItem
                    label="Expenses"
                    currentValue={stats.expensesThisMonth}
                    previousValue={stats.expensesLastMonth}
                    changePercent={stats.expensesChangePercent}
                    icon={<CreditCard size={18} />}
                    format="currency"
                />
                <StatItem
                    label="Tasks Created"
                    currentValue={stats.tasksThisMonth}
                    previousValue={stats.tasksLastMonth}
                    changePercent={stats.tasksChangePercent}
                    icon={<CheckSquare size={18} />}
                />
                <StatItem
                    label="Invoices Created"
                    currentValue={stats.invoicesThisMonth}
                    previousValue={stats.invoicesLastMonth}
                    changePercent={stats.invoicesChangePercent}
                    icon={<FileText size={18} />}
                />
            </div>
        </div>
    );
}

export default QuickStats;
