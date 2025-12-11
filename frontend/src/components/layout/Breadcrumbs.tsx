import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    path?: string;
}

// Map of paths to their labels
const pathLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    team: 'Team',
    crm: 'CRM',
    contacts: 'Contacts',
    leads: 'Leads',
    inventory: 'Inventory',
    products: 'Products',
    categories: 'Categories',
    sales: 'Sales',
    quotes: 'Quotes',
    invoices: 'Invoices',
    projects: 'Projects',
    tasks: 'Tasks',
    hr: 'HR',
    employees: 'Employees',
    departments: 'Departments',
    accounting: 'Accounting',
    expenses: 'Expenses',
    reports: 'Reports',
    settings: 'Settings',
    profile: 'Profile',
};

function getBreadcrumbLabel(segment: string): string {
    return pathLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
}

export function Breadcrumbs() {
    const location = useLocation();
    const pathSegments = location.pathname.split('/').filter(Boolean);

    if (pathSegments.length === 0) return null;

    const breadcrumbs: BreadcrumbItem[] = pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const isLast = index === pathSegments.length - 1;
        return {
            label: getBreadcrumbLabel(segment),
            path: isLast ? undefined : path,
        };
    });

    return (
        <nav className="flex items-center gap-1 text-sm mb-4">
            <Link
                to="/dashboard"
                className="flex items-center text-foreground-muted hover:text-foreground transition-colors"
            >
                <Home size={14} />
            </Link>
            {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                    <ChevronRight size={14} className="text-foreground-muted" />
                    {item.path ? (
                        <Link
                            to={item.path}
                            className="text-foreground-muted hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-foreground font-medium">{item.label}</span>
                    )}
                </div>
            ))}
        </nav>
    );
}

export default Breadcrumbs;
