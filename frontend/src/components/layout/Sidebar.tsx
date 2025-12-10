import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    FolderKanban,
    UserCircle,
    Calculator,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface SidebarProps {
    isCollapsed: boolean;
    onToggle: () => void;
}

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    roles?: string[];
}

const navItems: NavItem[] = [
    {
        label: 'Dashboard',
        path: '/dashboard',
        icon: <LayoutDashboard size={20} />,
    },
    {
        label: 'CRM',
        path: '/crm',
        icon: <Users size={20} />,
    },
    {
        label: 'Inventory',
        path: '/inventory',
        icon: <Package size={20} />,
    },
    {
        label: 'Sales',
        path: '/sales',
        icon: <ShoppingCart size={20} />,
    },
    {
        label: 'Projects',
        path: '/projects',
        icon: <FolderKanban size={20} />,
    },
    {
        label: 'HR',
        path: '/hr',
        icon: <UserCircle size={20} />,
        roles: ['OWNER', 'MANAGER'],
    },
    {
        label: 'Accounting',
        path: '/accounting',
        icon: <Calculator size={20} />,
        roles: ['OWNER', 'MANAGER'],
    },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
    const { user } = useAuth();
    const location = useLocation();

    const filteredNavItems = navItems.filter((item) => {
        if (!item.roles) return true;
        return item.roles.includes(user?.role || '');
    });

    const isActiveRoute = (path: string) => {
        if (path === '/dashboard') {
            return location.pathname === '/dashboard' || location.pathname === '/dashboard/team';
        }
        return location.pathname.startsWith(path);
    };

    return (
        <aside
            className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar flex flex-col transition-all duration-300 z-40 ${isCollapsed ? 'w-16' : 'w-64'
                }`}
        >
            {/* Logo */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar">
                <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-5 h-5 text-white"
                        >
                            <path d="M12 2L2 7l10 5 10-5-10-5z" />
                            <path d="M2 17l10 5 10-5" />
                            <path d="M2 12l10 5 10-5" />
                        </svg>
                    </div>
                    {!isCollapsed && (
                        <span className="text-lg font-bold text-foreground">BizFlow</span>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 overflow-y-auto">
                <ul className="space-y-1">
                    {filteredNavItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${isActiveRoute(item.path)
                                        ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-400 border border-indigo-500/30'
                                        : 'text-foreground-muted hover:bg-card-hover hover:text-foreground'
                                    } ${isCollapsed ? 'justify-center' : ''}`}
                                title={isCollapsed ? item.label : undefined}
                            >
                                <span className={isActiveRoute(item.path) ? 'text-indigo-400' : ''}>
                                    {item.icon}
                                </span>
                                {!isCollapsed && (
                                    <span className="font-medium">{item.label}</span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Collapse Toggle */}
            <div className="p-2 border-t border-sidebar">
                <button
                    onClick={onToggle}
                    className="flex items-center justify-center w-full p-2 rounded-lg text-foreground-muted hover:bg-card-hover hover:text-foreground transition-colors"
                    title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;
