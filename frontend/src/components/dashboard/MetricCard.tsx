import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    trend?: {
        value: number;
        isPositive?: boolean;
    };
    format?: 'currency' | 'number' | 'percent';
    colorScheme?: 'default' | 'success' | 'warning' | 'danger';
}

const colorSchemes = {
    default: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
    success: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    warning: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    danger: 'from-red-500/20 to-pink-500/20 border-red-500/30',
};

const iconColors = {
    default: 'text-indigo-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    danger: 'text-red-400',
};

export function MetricCard({
    title,
    value,
    icon,
    trend,
    format = 'number',
    colorScheme = 'default',
}: MetricCardProps) {
    const formatValue = (val: string | number): string => {
        if (typeof val === 'string') return val;

        switch (format) {
            case 'currency':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                }).format(val);
            case 'percent':
                return `${val}%`;
            default:
                return new Intl.NumberFormat('en-US').format(val);
        }
    };

    const getTrendIcon = () => {
        if (!trend) return null;
        if (trend.value === 0) return <Minus size={14} className="text-foreground-muted" />;
        if (trend.isPositive !== undefined) {
            return trend.isPositive ? (
                <TrendingUp size={14} className="text-emerald-400" />
            ) : (
                <TrendingDown size={14} className="text-red-400" />
            );
        }
        return trend.value > 0 ? (
            <TrendingUp size={14} className="text-emerald-400" />
        ) : (
            <TrendingDown size={14} className="text-red-400" />
        );
    };

    const getTrendColor = () => {
        if (!trend) return '';
        if (trend.value === 0) return 'text-foreground-muted';
        if (trend.isPositive !== undefined) {
            return trend.isPositive ? 'text-emerald-400' : 'text-red-400';
        }
        return trend.value > 0 ? 'text-emerald-400' : 'text-red-400';
    };

    return (
        <div
            className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${colorSchemes[colorScheme]} border backdrop-blur-xl transition-transform hover:scale-[1.02]`}
        >
            {/* Background decoration */}
            <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />

            <div className="relative">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <span className="text-foreground-muted text-sm font-medium">{title}</span>
                    <div className={`${iconColors[colorScheme]}`}>
                        {icon}
                    </div>
                </div>

                {/* Value */}
                <div className="text-3xl font-bold text-foreground mb-2">
                    {formatValue(value)}
                </div>

                {/* Trend */}
                {trend && (
                    <div className={`flex items-center gap-1 text-sm ${getTrendColor()}`}>
                        {getTrendIcon()}
                        <span>{Math.abs(trend.value)}% vs last month</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MetricCard;
