import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Edit, Plus, ArrowLeft } from 'lucide-react';
import { api } from '../../services/api';
import { PageHeader } from '../../components/layout/PageHeader';

interface Contact {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    companyName?: string;
    type: string;
    addressLine1?: string;
    city?: string;
    country?: string;
    notes?: string;
}

interface Activity {
    id: string;
    type: string;
    subject: string;
    activityDate: string;
    description?: string;
    performedBy: {
        firstName: string;
        lastName: string;
    };
}

export function ContactDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState<Contact | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchContactData();
        }
    }, [id]);

    const fetchContactData = async () => {
        try {
            setLoading(true);
            const [contactRes, activitiesRes] = await Promise.all([
                api.get(`/contacts/${id}`),
                api.get(`/activities?contactId=${id}`)
            ]);
            setContact(contactRes.data);
            setActivities(activitiesRes.data);
        } catch (error) {
            console.error('Failed to fetch contact details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (!contact) {
        return <div className="p-6">Contact not found</div>;
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <PageHeader title={`${contact.firstName} ${contact.lastName}`}>
                <div className="flex gap-2">
                    <button
                        onClick={() => navigate('/crm/contacts')}
                        className="flex items-center gap-2 px-3 py-2 text-foreground-muted hover:text-foreground transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-card-hover transition-colors">
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                    </button>
                </div>
            </PageHeader>

            <main className="flex-1 overflow-auto p-6 max-w-7xl mx-auto w-full">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Contact Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-xl text-indigo-400 font-bold border border-indigo-500/20">
                                    {contact.firstName[0]}{contact.lastName[0]}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-foreground">
                                        {contact.firstName} {contact.lastName}
                                    </h2>
                                    <p className="text-foreground-muted">{contact.companyName}</p>
                                    <span className="inline-block mt-2 text-xs px-2 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                                        {contact.type}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {contact.email && (
                                    <div className="flex items-start gap-3">
                                        <Mail className="w-5 h-5 text-foreground-muted mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Email</p>
                                            <a href={`mailto:${contact.email}`} className="text-sm text-indigo-400 hover:underline">
                                                {contact.email}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {contact.phone && (
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-foreground-muted mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Phone</p>
                                            <a href={`tel:${contact.phone}`} className="text-sm text-indigo-400 hover:underline">
                                                {contact.phone}
                                            </a>
                                        </div>
                                    </div>
                                )}
                                {(contact.addressLine1 || contact.city) && (
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-foreground-muted mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-foreground">Address</p>
                                            <p className="text-sm text-foreground-muted whitespace-pre-wrap">
                                                {[contact.addressLine1, contact.city, contact.country].filter(Boolean).join('\n')}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {contact.notes && (
                            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                                <h3 className="font-semibold text-foreground mb-4">Notes</h3>
                                <p className="text-sm text-foreground-muted whitespace-pre-wrap">{contact.notes}</p>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Activity Timeline & Leads */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Activities Section */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-foreground">Recent Activity</h3>
                                <button className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300">
                                    <Plus className="w-4 h-4" />
                                    Log Activity
                                </button>
                            </div>

                            <div className="space-y-6 relative before:absolute before:inset-0 before:left-2.5 before:w-0.5 before:bg-border before:z-0">
                                {activities.length === 0 ? (
                                    <p className="text-foreground-muted text-sm pl-8">No activities recorded yet.</p>
                                ) : (
                                    activities.map((activity) => (
                                        <div key={activity.id} className="relative z-10 pl-8">
                                            <div className="absolute left-0 top-1 w-5 h-5 rounded-full bg-card border-2 border-indigo-500 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                                            </div>
                                            <div className="bg-background/50 rounded-lg p-3 border border-border/50">
                                                <div className="flex justify-between items-start">
                                                    <h4 className="font-medium text-foreground">{activity.subject}</h4>
                                                    <span className="text-xs text-foreground-muted">
                                                        {new Date(activity.activityDate).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-foreground-muted mt-1">{activity.description}</p>
                                                <div className="mt-2 text-xs text-foreground-muted">
                                                    By {activity.performedBy.firstName} {activity.performedBy.lastName}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Leads Section */}
                        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-semibold text-foreground">Deals & Leads</h3>
                                <button className="flex items-center gap-1 text-sm text-indigo-400 hover:text-indigo-300">
                                    <Plus className="w-4 h-4" />
                                    Add Deal
                                </button>
                            </div>
                            <p className="text-foreground-muted text-sm">No deals associated with this contact.</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
