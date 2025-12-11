import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Alert } from '../../components/common';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            await login(data);
            navigate(from, { replace: true });
        } catch (err: any) {
            const message =
                err.response?.data?.message || 'Invalid email or password. Please try again.';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
            {/* Background decoration */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute w-[800px] h-[800px] -top-[400px] -right-[200px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-[80px] animate-pulse" />
                <div className="absolute w-[600px] h-[600px] -bottom-[200px] -left-[200px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl shadow-black/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mb-6 shadow-lg shadow-indigo-500/50">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="w-8 h-8 text-white"
                            >
                                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                                <path d="M2 17l10 5 10-5" />
                                <path d="M2 12l10 5 10-5" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-50 tracking-tight mb-2">Welcome back</h1>
                        <p className="text-slate-400">Sign in to your BizFlow account</p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <div className="mb-6">
                            <Alert variant="error" onClose={() => setError(null)}>
                                {error}
                            </Alert>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="Enter your email"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            showPasswordToggle
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer text-slate-400">
                                <input type="checkbox" className="w-4 h-4 rounded accent-indigo-500" />
                                <span>Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <Button type="submit" fullWidth isLoading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-slate-400">
                        <p>
                            Don't have an account?{' '}
                            <Link to="/register" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
