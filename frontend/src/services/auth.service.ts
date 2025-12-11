import api, { setTokens, clearTokens } from '../lib/api';
import type {
    User,
    LoginRequest,
    RegisterRequest,
} from '../types';

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface MessageResponse {
    message: string;
}

export const authService = {
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/register', data);
        const { accessToken, refreshToken, user } = response.data;
        setTokens(accessToken, refreshToken);
        return { accessToken, refreshToken, user };
    },

    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>('/auth/login', data);
        const { accessToken, refreshToken, user } = response.data;
        setTokens(accessToken, refreshToken);
        return { accessToken, refreshToken, user };
    },

    async logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
            try {
                await api.post('/auth/logout', { refreshToken });
            } catch (error) {
                // Ignore logout errors, just clear tokens
                console.error('Logout error:', error);
            }
        }
        clearTokens();
    },

    async forgotPassword(email: string): Promise<MessageResponse> {
        const response = await api.post<MessageResponse>('/auth/forgot-password', {
            email,
        });
        return response.data;
    },

    async resetPassword(
        token: string,
        newPassword: string
    ): Promise<MessageResponse> {
        const response = await api.post<MessageResponse>('/auth/reset-password', {
            token,
            newPassword,
        });
        return response.data;
    },

    async getCurrentUser(): Promise<User> {
        const response = await api.get<User>('/users/me');
        return response.data;
    },

    async updateProfile(data: Partial<User>): Promise<User> {
        const response = await api.patch<User>('/users/me', data);
        return response.data;
    },

    async changePassword(
        currentPassword: string,
        newPassword: string
    ): Promise<MessageResponse> {
        const response = await api.patch<MessageResponse>('/users/me/password', {
            currentPassword,
            newPassword,
        });
        return response.data;
    },
};

export default authService;
