import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button } from '../../components/common';

export function DashboardPage() {
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        await logout();
        window.location.href = '/login';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            {/* Header */}
            <header className="flex items-center justify-between px-8 py-4 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center gap-3 text-xl font-bold text-slate-50">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-8 h-8 text-indigo-500"
                    >
                        <path d="M12 2L2 7l10 5 10-5-10-5z" />
                        <path d="M2 17l10 5 10-5" />
                        <path d="M2 12l10 5 10-5" />
                    </svg>
                    <span>BizFlow</span>
                </div>
                <div className="flex items-center gap-4">
                    {(user?.role === 'OWNER' || user?.role === 'MANAGER') && (
                        <Link to="/dashboard/team">
                            <Button variant="secondary" size="sm">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Team
                            </Button>
                        </Link>
                    )}
                    <span className="font-medium text-slate-200">
                        {user?.firstName} {user?.lastName}
                    </span>
                    <span className="px-3 py-1 text-xs font-medium uppercase bg-indigo-500/20 text-indigo-300 rounded-full">
                        {user?.role}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                        Sign Out
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-8 py-12">
                {/* Welcome Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-slate-50 tracking-tight mb-4">
                        Welcome to BizFlow, {user?.firstName}! 🎉
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Your authentication is working correctly. This is a placeholder dashboard page.
                        The full dashboard with metrics will be implemented in Phase 2.
                    </p>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                            <span>👤</span> Your Profile
                        </h3>
                        <ul className="space-y-3">
                            <li className="text-slate-400 py-2 border-b border-white/5">
                                <strong className="text-slate-200">Email:</strong> {user?.email}
                            </li>
                            <li className="text-slate-400 py-2 border-b border-white/5">
                                <strong className="text-slate-200">Name:</strong> {user?.firstName} {user?.lastName}
                            </li>
                            <li className="text-slate-400 py-2">
                                <strong className="text-slate-200">Role:</strong> {user?.role}
                            </li>
                        </ul>
                    </div>

                    {/* Phase 1 Complete Card */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                            <span>✅</span> Phase 1 Complete
                        </h3>
                        <ul className="space-y-3">
                            <li className="text-green-400 py-2 border-b border-white/5">✓ User Registration</li>
                            <li className="text-green-400 py-2 border-b border-white/5">✓ User Login</li>
                            <li className="text-green-400 py-2 border-b border-white/5">✓ JWT Authentication</li>
                            <li className="text-green-400 py-2 border-b border-white/5">✓ Token Refresh</li>
                            <li className="text-green-400 py-2 border-b border-white/5">✓ Password Reset Flow</li>
                            <li className="text-green-400 py-2">✓ Protected Routes</li>
                        </ul>
                    </div>

                    {/* Coming Soon Card */}
                    <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-slate-50 mb-4 flex items-center gap-2">
                            <span>🚀</span> Coming in Phase 2
                        </h3>
                        <ul className="space-y-3">
                            <li className="text-slate-400 py-2 border-b border-white/5">◯ Main Layout & Sidebar</li>
                            <li className="text-slate-400 py-2 border-b border-white/5">◯ Dashboard Metrics</li>
                            <li className="text-slate-400 py-2 border-b border-white/5">◯ Recent Activities</li>
                            <li className="text-slate-400 py-2 border-b border-white/5">◯ Quick Stats</li>
                            <li className="text-slate-400 py-2">◯ Dark/Light Theme Toggle</li>
                        </ul>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default DashboardPage;
