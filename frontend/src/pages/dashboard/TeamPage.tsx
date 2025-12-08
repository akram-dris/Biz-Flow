import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../hooks/useAuth';
import { Button, Input, Alert, Loading } from '../../components/common';
import { PageHeader, Breadcrumbs } from '../../components/layout';
import api from '../../lib/api';
import {
    Users,
    UserPlus,
    Mail,
    Clock,
    Shield,
    Crown,
    Briefcase,
    X,
    Send,
    MoreVertical,
} from 'lucide-react';

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

const roleConfig = {
    OWNER: {
        icon: Crown,
        label: 'Owner',
        gradient: 'from-amber-500/20 to-orange-500/20',
        border: 'border-amber-500/30',
        text: 'text-amber-400',
        bg: 'bg-amber-500/20',
    },
    MANAGER: {
        icon: Shield,
        label: 'Manager',
        gradient: 'from-indigo-500/20 to-purple-500/20',
        border: 'border-indigo-500/30',
        text: 'text-indigo-400',
        bg: 'bg-indigo-500/20',
    },
    EMPLOYEE: {
        icon: Briefcase,
        label: 'Employee',
        gradient: 'from-slate-500/20 to-gray-500/20',
        border: 'border-slate-500/30',
        text: 'text-slate-400',
        bg: 'bg-slate-500/20',
    },
};

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

    const getRoleConfig = (role: string) => {
        return roleConfig[role as keyof typeof roleConfig] || roleConfig.EMPLOYEE;
    };

    const getInitials = (firstName: string, lastName: string) => {
        return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loading size="lg" />
            </div>
        );
    }

    return (
        <div>
            <Breadcrumbs />
            <PageHeader
                title="Team Management"
                description="Manage your organization members and invitations"
            >
                {(user?.role === 'OWNER' || user?.role === 'MANAGER') && (
                    <Button onClick={() => setShowInviteModal(true)}>
                        <UserPlus size={18} className="mr-2" />
                        Invite Member
                    </Button>
                )}
            </PageHeader>

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

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 backdrop-blur-xl">
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
                    <div className="relative flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-indigo-500/20">
                            <Users size={24} className="text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-foreground-muted text-sm">Total Members</p>
                            <p className="text-2xl font-bold text-foreground">{members.length}</p>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 backdrop-blur-xl">
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
                    <div className="relative flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/20">
                            <Mail size={24} className="text-amber-400" />
                        </div>
                        <div>
                            <p className="text-foreground-muted text-sm">Pending Invites</p>
                            <p className="text-2xl font-bold text-foreground">{invitations.length}</p>
                        </div>
                    </div>
                </div>

                <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 backdrop-blur-xl">
                    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/5 blur-2xl" />
                    <div className="relative flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/20">
                            <Shield size={24} className="text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-foreground-muted text-sm">Managers</p>
                            <p className="text-2xl font-bold text-foreground">
                                {members.filter(m => m.role === 'MANAGER' || m.role === 'OWNER').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Members Section */}
            <div className="rounded-2xl border border-default bg-card/50 backdrop-blur-xl overflow-hidden mb-6">
                <div className="px-6 py-4 border-b border-default flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-indigo-500/20">
                            <Users size={18} className="text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
                            <p className="text-sm text-foreground-muted">{members.length} members in your organization</p>
                        </div>
                    </div>
                </div>

                <div className="divide-y divide-[rgb(var(--border))]">
                    {members.length === 0 ? (
                        <div className="px-6 py-12 text-center">
                            <Users size={48} className="mx-auto text-foreground-muted mb-4 opacity-50" />
                            <p className="text-foreground-muted">No team members yet</p>
                            <p className="text-sm text-foreground-muted mt-1">Invite your first team member to get started</p>
                        </div>
                    ) : (
                        members.map((member) => {
                            const config = getRoleConfig(member.role);
                            const RoleIcon = config.icon;
                            return (
                                <div
                                    key={member.id}
                                    className="px-6 py-4 flex items-center justify-between hover:bg-card-hover transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Avatar */}
                                        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center ${config.border} border`}>
                                            <span className={`text-sm font-semibold ${config.text}`}>
                                                {getInitials(member.firstName, member.lastName)}
                                            </span>
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-foreground">
                                                    {member.firstName} {member.lastName}
                                                </p>
                                                {member.id === user?.id && (
                                                    <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                                                        You
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-foreground-muted">{member.email}</p>
                                        </div>
                                    </div>

                                    {/* Role Badge */}
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
                                            <RoleIcon size={14} className={config.text} />
                                            <span className={`text-sm font-medium ${config.text}`}>
                                                {config.label}
                                            </span>
                                        </div>

                                        {/* Actions dropdown placeholder */}
                                        {user?.role === 'OWNER' && member.id !== user?.id && (
                                            <button className="p-2 rounded-lg hover:bg-card-hover transition-colors text-foreground-muted hover:text-foreground">
                                                <MoreVertical size={18} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Pending Invitations Section */}
            {invitations.length > 0 && (
                <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/5 to-orange-500/5 backdrop-blur-xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-amber-500/20 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-amber-500/20">
                            <Clock size={18} className="text-amber-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-foreground">Pending Invitations</h2>
                            <p className="text-sm text-foreground-muted">{invitations.length} invitations awaiting response</p>
                        </div>
                    </div>

                    <div className="divide-y divide-amber-500/10">
                        {invitations.map((invitation) => {
                            const config = getRoleConfig(invitation.role);
                            const RoleIcon = config.icon;
                            const expiresDate = new Date(invitation.expiresAt);
                            const isExpiringSoon = expiresDate.getTime() - Date.now() < 24 * 60 * 60 * 1000;

                            return (
                                <div
                                    key={invitation.id}
                                    className="px-6 py-4 flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        {/* Pending Avatar */}
                                        <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/30 border-dashed flex items-center justify-center">
                                            <Mail size={20} className="text-amber-400" />
                                        </div>

                                        {/* Info */}
                                        <div>
                                            <p className="font-medium text-foreground">{invitation.email}</p>
                                            <p className="text-sm text-foreground-muted">
                                                Invited by {invitation.invitedBy.firstName} {invitation.invitedBy.lastName}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        {/* Role Badge */}
                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} ${config.border} border`}>
                                            <RoleIcon size={14} className={config.text} />
                                            <span className={`text-sm font-medium ${config.text}`}>
                                                {config.label}
                                            </span>
                                        </div>

                                        {/* Expiration */}
                                        <div className={`text-sm ${isExpiringSoon ? 'text-amber-400' : 'text-foreground-muted'}`}>
                                            Expires {expiresDate.toLocaleDateString()}
                                        </div>

                                        {/* Cancel Button */}
                                        <Button
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => cancelInvitation(invitation.id)}
                                        >
                                            <X size={14} className="mr-1" />
                                            Cancel
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="relative bg-card border border-default rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        {/* Decorative gradient */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none" />

                        <div className="relative p-8">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30">
                                    <UserPlus size={24} className="text-indigo-400" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">Invite Team Member</h2>
                                    <p className="text-sm text-foreground-muted">Send an email invitation</p>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit(onInvite)} className="space-y-5">
                                <Input
                                    label="Email Address"
                                    type="email"
                                    placeholder="colleague@company.com"
                                    error={errors.email?.message}
                                    {...register('email')}
                                />

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Role
                                    </label>
                                    <select
                                        {...register('role')}
                                        className="w-full px-4 py-3 bg-background-secondary border border-default rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                    >
                                        <option value="EMPLOYEE">Employee - Basic access</option>
                                        <option value="MANAGER">Manager - Extended permissions</option>
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
                                        <Send size={16} className="mr-2" />
                                        Send Invitation
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeamPage;
