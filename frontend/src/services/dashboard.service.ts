import { apiGet } from './api';

// Types
export interface DashboardMetrics {
    totalRevenue: number;
    totalExpenses: number;
    profitLoss: number;
    openTasksCount: number;
    pendingInvoicesCount: number;
    lowStockCount: number;
}

export interface DashboardActivity {
    id: string;
    type: string;
    subject: string;
    description: string | null;
    activityDate: string;
    performedByName: string;
    contactName?: string;
}

export interface DashboardStats {
    revenueThisMonth: number;
    revenueLastMonth: number;
    revenueChangePercent: number;
    expensesThisMonth: number;
    expensesLastMonth: number;
    expensesChangePercent: number;
    tasksThisMonth: number;
    tasksLastMonth: number;
    tasksChangePercent: number;
    invoicesThisMonth: number;
    invoicesLastMonth: number;
    invoicesChangePercent: number;
}

// API Service
const dashboardService = {
    getMetrics: async (): Promise<DashboardMetrics> => {
        return apiGet<DashboardMetrics>('/dashboard/metrics');
    },

    getActivities: async (): Promise<DashboardActivity[]> => {
        return apiGet<DashboardActivity[]>('/dashboard/activities');
    },

    getStats: async (): Promise<DashboardStats> => {
        return apiGet<DashboardStats>('/dashboard/stats');
    },
};

export default dashboardService;

