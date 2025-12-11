import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Button, Input, Alert, Loading } from '../../components/common';
import api from '../../lib/api';

const acceptInviteSchema = z
    .object({
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        password: z
            .string()
            .min(8, 'Password must be at least 8 characters')
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                'Password must contain at least one uppercase letter, one lowercase letter, and one number'
            ),
        confirmPassword: z.string().min(1, 'Please confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type AcceptInviteFormData = z.infer<typeof acceptInviteSchema>;

interface InvitationInfo {
    email: string;
    role: string;
    organization: {
        name: string;
    };
    invitedBy: {
        firstName: string;
        lastName: string;
    };
}

export function AcceptInvitePage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [invitation, setInvitation] = useState<InvitationInfo | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AcceptInviteFormData>({
        resolver: zodResolver(acceptInviteSchema),
    });

    useEffect(() => {
        if (!token) {
            setError('Invalid invitation link');
            setIsLoading(false);
            return;
        }

        // Validate token
        api.get(`/invitations/validate?token=${token}`)
            .then((res) => {
                setInvitation(res.data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err.response?.data?.message || 'Invalid or expired invitation');
                setIsLoading(false);
            });
    }, [token]);

    const onSubmit = async (data: AcceptInviteFormData) => {
        setError(null);
        setIsSubmitting(true);

        try {
            await api.post('/invitations/accept', {
                token,
                firstName: data.firstName,
                lastName: data.lastName,
                password: data.password,
            });
            setSuccess(true);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <Loading size="lg" />
            </div>
        );
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-50 mb-2">Account Created!</h1>
                    <p className="text-slate-400 mb-6">
                        Welcome to {invitation?.organization.name}! You can now sign in with your email and password.
                    </p>
                    <Button fullWidth onClick={() => navigate('/login')}>
                        Sign In
                    </Button>
                </div>
            </div>
        );
    }

    if (error && !invitation) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl max-w-md text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-xl mb-6 shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-50 mb-2">Invalid Invitation</h1>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <Link to="/login">
                        <Button variant="secondary" fullWidth>
                            Go to Login
                        </Button>
                    </Link>
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

            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl shadow-black/50">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl mb-6 shadow-lg shadow-indigo-500/50">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-slate-50 tracking-tight mb-2">Join {invitation?.organization.name}</h1>
                        <p className="text-slate-400">
                            You've been invited as <span className="text-indigo-400 font-medium">{invitation?.role}</span>
                        </p>
                        <p className="text-slate-500 text-sm mt-1">
                            Invited by {invitation?.invitedBy.firstName} {invitation?.invitedBy.lastName}
                        </p>
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
                        <div className="bg-slate-800/50 rounded-lg p-4 border border-white/5">
                            <p className="text-sm text-slate-400">Email</p>
                            <p className="text-slate-100 font-medium">{invitation?.email}</p>
                        </div>

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
                            label="Password"
                            type="password"
                            placeholder="Create a strong password"
                            showPasswordToggle
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            showPasswordToggle
                            error={errors.confirmPassword?.message}
                            {...register('confirmPassword')}
                        />

                        <Button type="submit" fullWidth isLoading={isSubmitting}>
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

export default AcceptInvitePage;
