import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
    Menu,
    Search,
    Bell,
    Sun,
    Moon,
    User,
    Settings,
    LogOut,
    Users,
    ChevronDown,
} from 'lucide-react';

interface NavbarProps {
    onMenuToggle: () => void;
}

export function Navbar({ onMenuToggle }: NavbarProps) {
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const getUserInitials = () => {
        if (!user) return 'U';
        return `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();
    };

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-card/80 backdrop-blur-xl border-b border-default">
            {/* Left Section */}
            <div className="flex items-center gap-4">
                <button
                    onClick={onMenuToggle}
                    className="p-2 rounded-lg text-foreground-muted hover:bg-card-hover hover:text-foreground transition-colors lg:hidden"
                >
                    <Menu size={20} />
                </button>

                {/* Search */}
                <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-background-secondary rounded-lg border border-default">
                    <Search size={18} className="text-foreground-muted" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-foreground-muted w-48 lg:w-64"
                    />
                </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg text-foreground-muted hover:bg-card-hover hover:text-foreground transition-colors"
                    title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>

                {/* Notifications */}
                <button
                    className="relative p-2 rounded-lg text-foreground-muted hover:bg-card-hover hover:text-foreground transition-colors"
                    title="Notifications"
                >
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* User Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-card-hover transition-colors"
                    >
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-sm font-medium">
                            {getUserInitials()}
                        </div>
                        <div className="hidden md:block text-left">
                            <p className="text-sm font-medium text-foreground">
                                {user?.firstName} {user?.lastName}
                            </p>
                            <p className="text-xs text-foreground-muted capitalize">
                                {user?.role?.toLowerCase()}
                            </p>
                        </div>
                        <ChevronDown size={16} className="text-foreground-muted hidden md:block" />
                    </button>

                    {/* Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-default shadow-xl overflow-hidden">
                            <div className="p-3 border-b border-default">
                                <p className="text-sm font-medium text-foreground">
                                    {user?.firstName} {user?.lastName}
                                </p>
                                <p className="text-xs text-foreground-muted">{user?.email}</p>
                            </div>
                            <div className="p-1">
                                <Link
                                    to="/profile"
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-foreground-muted hover:bg-card-hover hover:text-foreground rounded-lg transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <User size={16} />
                                    Profile
                                </Link>
                                {(user?.role === 'OWNER' || user?.role === 'MANAGER') && (
                                    <Link
                                        to="/dashboard/team"
                                        className="flex items-center gap-3 px-3 py-2 text-sm text-foreground-muted hover:bg-card-hover hover:text-foreground rounded-lg transition-colors"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        <Users size={16} />
                                        Team Management
                                    </Link>
                                )}
                                <Link
                                    to="/settings"
                                    className="flex items-center gap-3 px-3 py-2 text-sm text-foreground-muted hover:bg-card-hover hover:text-foreground rounded-lg transition-colors"
                                    onClick={() => setIsDropdownOpen(false)}
                                >
                                    <Settings size={16} />
                                    Settings
                                </Link>
                            </div>
                            <div className="p-1 border-t border-default">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                >
                                    <LogOut size={16} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;
