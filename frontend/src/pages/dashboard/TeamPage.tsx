import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Alert, Loading } from '../../components/common';
import api from '../../lib/api';

const inviteSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    role: z.enum(['MANAGER', 'EMPLOYEE']),
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface TeamMember {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

interface Invitation {
    id: string;
    email: string;
    role: string;
    createdAt: string;
    expiresAt: string;
    invitedBy: {
        firstName: string;
        lastName: string;
    };
}

export function TeamPage() {
    const { user } = useAuth();
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isInviting, setIsInviting] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InviteFormData>({
        resolver: zodResolver(inviteSchema),
        defaultValues: { role: 'EMPLOYEE' },
    });

    const fetchData = async () => {
        try {
            const [membersRes, invitationsRes] = await Promise.all([
                api.get('/users'),
                api.get('/invitations'),
            ]);
            // Handle both array responses and object responses with users/data property
            const membersData = Array.isArray(membersRes.data) ? membersRes.data : (membersRes.data?.users || membersRes.data?.data || []);
            const invitationsData = Array.isArray(invitationsRes.data) ? invitationsRes.data : (invitationsRes.data?.data || []);
            setMembers(membersData);
            setInvitations(invitationsData);
        } catch (err) {
            console.error('Failed to fetch team data', err);
            setMembers([]);
            setInvitations([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const onInvite = async (data: InviteFormData) => {
        setError(null);
        setIsInviting(true);

        try {
            await api.post('/invitations', data);
            setSuccess(`Invitation sent to ${data.email}`);
            setShowInviteModal(false);
            reset();
            fetchData();
        } catch (err: any) {
            console.error('Invitation error:', err);
            console.error('Response data:', err.response?.data);
            console.error('Status:', err.response?.status);
            setError(err.response?.data?.message || 'Failed to send invitation');
        } finally {
            setIsInviting(false);
        }
    };

    const cancelInvitation = async (id: string) => {
        try {
            await api.delete(`/invitations/${id}`);
            setSuccess('Invitation cancelled');
            fetchData();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to cancel invitation');
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'OWNER':
                return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
            case 'MANAGER':
                return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30';
            default:
                return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center">
                <Loading size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900">
            <div className="p-8 max-w-5xl mx-auto">
                {/* Back Button */}
                <Link to="/dashboard" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-200 mb-6 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Dashboard
                </Link>

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-50">Team</h1>
                        <p className="text-slate-400 mt-1">Manage your organization members</p>
                    </div>
                    {(user?.role === 'OWNER' || user?.role === 'MANAGER') && (
                        <Button onClick={() => setShowInviteModal(true)}>
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            Invite Member
                        </Button>
                    )}
                </div>

                {/* Alerts */}
                {error && (
                    <div className="mb-6">
                        <Alert variant="error" onClose={() => setError(null)}>{error}</Alert>
                    </div>
                )}
                {success && (
                    <div className="mb-6">
                        <Alert variant="success" onClose={() => setSuccess(null)}>{success}</Alert>
                    </div>
                )}

                {/* Team Members */}
                <div className="bg-slate-900/50 backdrop-blur border border-white/10 rounded-xl p-6 mb-6">
                    <h2 className="text-lg font-semibold text-slate-100 mb-4">
                        Members ({members.length})
                    </h2>
                    <div className="space-y-3">
                        {members.map((member) => (
                            <div
                                key={member.id}
                                className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-white/5"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                        {member.firstName[0]}{member.lastName[0]}
                                    </div>
                                    <div>
                                        <p className="text-slate-100 font-medium">
                                            {member.firstName} {member.lastName}
                                            {member.id === user?.id && (
                                                <span className="text-xs text-slate-500 ml-2">(You)</span>
                                            )}
                                        </p>
                                        <p className="text-sm text-slate-400">{member.email}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getRoleBadgeColor(member.role)}`}>
                                    {member.role}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                    <div className="bg-slate-900/50 backdrop-blur border border-white/10 rounded-xl p-6">
                        <h2 className="text-lg font-semibold text-slate-100 mb-4">
                            Pending Invitations ({invitations.length})
                        </h2>
                        <div className="space-y-3">
                            {invitations.map((invitation) => (
                                <div
                                    key={invitation.id}
                                    className="flex items-center justify-between p-4 bg-amber-500/5 rounded-lg border border-amber-500/20"
                                >
                                    <div>
                                        <p className="text-slate-100">{invitation.email}</p>
                                        <p className="text-sm text-slate-400">
                                            Invited as {invitation.role} by {invitation.invitedBy.firstName}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-slate-500">
                                            Expires {new Date(invitation.expiresAt).toLocaleDateString()}
                                        </span>
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => cancelInvitation(invitation.id)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Invite Modal */}
                {showInviteModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-slate-900 border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
                            <h2 className="text-2xl font-bold text-slate-50 mb-2">Invite Team Member</h2>
                            <p className="text-slate-400 mb-6">Send an email invitation to join your organization</p>

                            <form onSubmit={handleSubmit(onInvite)} className="space-y-5">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="colleague@company.com"
                                    error={errors.email?.message}
                                    {...register('email')}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                                    <select
                                        {...register('role')}
                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-lg text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="EMPLOYEE">Employee</option>
                                        <option value="MANAGER">Manager</option>
                                    </select>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        fullWidth
                                        onClick={() => {
                                            setShowInviteModal(false);
                                            reset();
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit" fullWidth isLoading={isInviting}>
                                        Send Invitation
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TeamPage;
