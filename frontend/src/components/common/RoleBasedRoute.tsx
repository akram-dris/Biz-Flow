import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from './Loading';
import type { ReactNode } from 'react';
import type { UserRole } from '../../types';

interface RoleBasedRouteProps {
    children: ReactNode;
    allowedRoles: UserRole[];
    fallbackPath?: string;
}

export function RoleBasedRoute({
    children,
    allowedRoles,
    fallbackPath = '/dashboard',
}: RoleBasedRouteProps) {
    const { user, isLoading, isAuthenticated } = useAuth();

    if (isLoading) {
        return <Loading fullScreen text="Loading..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        // User doesn't have required role, redirect to fallback
        return <Navigate to={fallbackPath} replace />;
    }

    return <>{children}</>;
}

export default RoleBasedRoute;
