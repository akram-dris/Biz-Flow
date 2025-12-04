import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import authService from '../../services/auth.service';
import { Button, Input, Alert } from '../../components/common';

const forgotPasswordSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordPage() {
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            await authService.forgotPassword(data.email);
            setSuccess(true);
        } catch {
            setSuccess(true);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 relative overflow-hidden">
                {/* Background decoration */}
                <div className="fixed inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute w-[800px] h-[800px] -top-[400px] -right-[200px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-[80px] animate-pulse" />
                    <div className="absolute w-[600px] h-[600px] -bottom-[200px] -left-[200px] rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/5 blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl shadow-black/50">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-xl mb-6 shadow-lg shadow-green-500/50">
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
                                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                    <polyline points="22 4 12 14.01 9 11.01" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-slate-50 tracking-tight mb-2">Check your email</h1>
                            <p className="text-slate-400">
                                If an account exists with that email, we've sent you password reset instructions.
                            </p>
                        </div>

                        <Alert variant="info">
                            Didn't receive the email? Check your spam folder or try again with a different email address.
                        </Alert>

                        <div className="mt-6 text-center">
                            <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                                ← Back to sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-50 tracking-tight mb-2">Forgot password?</h1>
                        <p className="text-slate-400">No worries, we'll send you reset instructions.</p>
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

                        <Button type="submit" fullWidth isLoading={isLoading}>
                            Send Reset Link
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                            ← Back to sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
