import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Alert } from '../../components/common';

const registerSchema = z
    .object({
        organizationName: z.string().min(2, 'Business name must be at least 2 characters'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        email: z.string().email('Please enter a valid email address'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            ),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
        acceptTerms: z.boolean().refine((val) => val === true, {
            message: 'You must accept the terms and conditions',
        }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type RegisterFormData = z.infer<typeof registerSchema>;

function PasswordStrength({ password }: { password: string }) {
    const getStrength = () => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/\d/.test(password)) strength++;
        if (/[^a-zA-Z0-9]/.test(password)) strength++;
        return strength;
    };

    const strength = getStrength();
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'];
    const textColors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-emerald-500'];

    if (!password) return null;

    return (
        <div className="flex items-center gap-3 mt-2">
            <div className="flex gap-1 flex-1">
                {[1, 2, 3, 4, 5].map((level) => (
                    <div
                        key={level}
                        className={`h-1 flex-1 rounded ${level <= strength ? colors[strength - 1] : 'bg-white/10'} transition-colors`}
                    />
                ))}
            </div>
            <span className={`text-xs font-medium whitespace-nowrap ${textColors[strength - 1] || 'text-slate-500'}`}>
                {labels[strength - 1] || 'Too Short'}
            </span>
        </div>
    );
}

export function RegisterPage() {
    const navigate = useNavigate();
    const { register: registerUser } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            acceptTerms: false,
        },
    });

    const password = watch('password', '');

    const onSubmit = async (data: RegisterFormData) => {
        setError(null);
        setIsLoading(true);

        try {
            await registerUser({
                organizationName: data.organizationName,
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            });
            navigate('/dashboard', { replace: true });
        } catch (err: any) {
            const message =
                err.response?.data?.message || 'Registration failed. Please try again.';
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

            <div className="relative z-10 w-full max-w-lg">
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
                        <h1 className="text-3xl font-bold text-slate-50 tracking-tight mb-2">Create an account</h1>
                        <p className="text-slate-400">Get started with BizFlow today</p>
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
                            label="Business Name"
                            placeholder="Acme Corporation"
                            error={errors.organizationName?.message}
                            {...register('organizationName')}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="First Name"
                                placeholder="John"
                                error={errors.firstName?.message}
                                {...register('firstName')}
                            />
                            <Input
                                label="Last Name"
                                placeholder="Doe"
                                error={errors.lastName?.message}
                                {...register('lastName')}
                            />
                        </div>

                        <Input
                            label="Email"
                            type="email"
                            placeholder="john.doe@example.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <div>
                            <Input
                                label="Password"
                                type="password"
                                placeholder="Create a strong password"
                                showPasswordToggle
                                error={errors.password?.message}
                                {...register('password')}
                            />
                            <PasswordStrength password={password} />
                        </div>

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            showPasswordToggle
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        <label className="flex items-start gap-2 cursor-pointer text-slate-400 text-sm leading-relaxed">
                            <input type="checkbox" className="w-4 h-4 mt-0.5 rounded accent-indigo-500" {...register('acceptTerms')} />
                            <span>
                                I agree to the{' '}
                                <a href="/terms" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>
                        {errors.acceptTerms && (
                            <span className="text-xs text-red-500 -mt-3">{errors.acceptTerms.message}</span>
                        )}

                        <Button type="submit" fullWidth isLoading={isLoading}>
                            Create Account
                        </Button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 pt-6 border-t border-white/10 text-center text-sm text-slate-400">
                        <p>
                            Already have an account?{' '}
                            <Link to="/login" className="text-indigo-400 font-medium hover:text-indigo-300 transition-colors">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
