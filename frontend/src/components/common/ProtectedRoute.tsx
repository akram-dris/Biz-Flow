import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Loading } from './Loading';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <Loading fullScreen text="Loading..." />;
    }

    if (!isAuthenticated) {
        // Redirect to login, but save the attempted URL
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return <>{children}</>;
}

export default ProtectedRoute;
