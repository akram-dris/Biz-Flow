import {
    createContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import type { User, LoginRequest, RegisterRequest } from '../types';
import authService from '../services/auth.service';
import { getAccessToken } from '../lib/api';

export interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    register: (userData: RegisterRequest) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (user: User) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is authenticated on mount
    useEffect(() => {
        const checkAuth = async () => {
            const token = getAccessToken();
            if (!token) {
                setIsLoading(false);
                return;
            }

            try {
                const currentUser = await authService.getCurrentUser();
                setUser(currentUser);
            } catch (error) {
                console.error('Failed to get current user:', error);
                // Token might be invalid, let the interceptor handle refresh
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = useCallback(async (credentials: LoginRequest) => {
        const response = await authService.login(credentials);
        setUser(response.user);
    }, []);

    const register = useCallback(async (userData: RegisterRequest) => {
        const response = await authService.register(userData);
        setUser(response.user);
    }, []);

    const logout = useCallback(async () => {
        await authService.logout();
        setUser(null);
    }, []);

    const updateUser = useCallback((updatedUser: User) => {
        setUser(updatedUser);
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
