import { Phone, Video, Mail, FileText, Calendar } from 'lucide-react';
import type { DashboardActivity } from '../../services/dashboard.service';

interface RecentActivitiesProps {
    activities: DashboardActivity[];
    isLoading?: boolean;
}

const activityIcons: Record<string, React.ReactNode> = {
    CALL: <Phone size={16} className="text-green-400" />,
    MEETING: <Video size={16} className="text-blue-400" />,
    EMAIL: <Mail size={16} className="text-purple-400" />,
    NOTE: <FileText size={16} className="text-amber-400" />,
};

const activityColors: Record<string, string> = {
    CALL: 'bg-green-500/20 border-green-500/30',
    MEETING: 'bg-blue-500/20 border-blue-500/30',
    EMAIL: 'bg-purple-500/20 border-purple-500/30',
    NOTE: 'bg-amber-500/20 border-amber-500/30',
};

function formatRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

export function RecentActivities({ activities, isLoading }: RecentActivitiesProps) {
    if (isLoading) {
        return (
            <div className="bg-card rounded-2xl border border-default p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">Recent Activities</h3>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="animate-pulse flex items-start gap-3">
                            <div className="w-8 h-8 rounded-lg bg-card-hover" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-card-hover rounded w-3/4" />
                                <div className="h-3 bg-card-hover rounded w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl border border-default p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-foreground">Recent Activities</h3>
                <Calendar size={18} className="text-foreground-muted" />
            </div>

            {activities.length === 0 ? (
                <div className="text-center py-8 text-foreground-muted">
                    <FileText size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No recent activities</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-card-hover transition-colors"
                        >
                            <div
                                className={`flex items-center justify-center w-8 h-8 rounded-lg border ${activityColors[activity.type] || 'bg-gray-500/20 border-gray-500/30'
                                    }`}
                            >
                                {activityIcons[activity.type] || <FileText size={16} className="text-gray-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                    {activity.subject}
                                </p>
                                <div className="flex items-center gap-2 mt-0.5">
                                    <span className="text-xs text-foreground-muted">
                                        {activity.performedByName}
                                    </span>
                                    {activity.contactName && (
                                        <>
                                            <span className="text-foreground-muted">·</span>
                                            <span className="text-xs text-foreground-muted truncate">
                                                {activity.contactName}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                            <span className="text-xs text-foreground-muted whitespace-nowrap">
                                {formatRelativeTime(activity.activityDate)}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RecentActivities;
