import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Save } from 'lucide-react';
import { api } from '../../services/api';
import { PageHeader } from '../../components/layout/PageHeader';

interface ContactFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    companyName: string;
    type: string;
    addressLine1: string;
    city: string;
    country: string;
    notes: string;
}

export function ContactFormPage() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>({
        defaultValues: {
            type: 'CUSTOMER'
        }
    });
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (data: ContactFormData) => {
        try {
            setSubmitting(true);
            await api.post('/contacts', data);
            navigate('/crm/contacts');
        } catch (error) {
            console.error('Failed to create contact:', error);
            // Handle error (toast, etc)
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <PageHeader title="New Contact">
                <button
                    onClick={() => navigate('/crm/contacts')}
                    className="flex items-center gap-2 px-3 py-2 text-foreground-muted hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Cancel
                </button>
            </PageHeader>

            <main className="flex-1 overflow-auto p-6 max-w-3xl mx-auto w-full">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-6">
                        <h3 className="font-semibold text-foreground border-b border-border pb-2">Basic Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">First Name *</label>
                                <input
                                    {...register('firstName', { required: 'First name is required' })}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="e.g. John"
                                />
                                {errors.firstName && <span className="text-xs text-red-400">{errors.firstName.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Last Name *</label>
                                <input
                                    {...register('lastName', { required: 'Last name is required' })}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="e.g. Doe"
                                />
                                {errors.lastName && <span className="text-xs text-red-400">{errors.lastName.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Company Name</label>
                                <input
                                    {...register('companyName')}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="e.g. Acme Corp"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Type</label>
                                <select
                                    {...register('type')}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                >
                                    <option value="CUSTOMER">Customer</option>
                                    <option value="SUPPLIER">Supplier</option>
                                </select>
                            </div>
                        </div>

                        <h3 className="font-semibold text-foreground border-b border-border pb-2 pt-4">Contact Details</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Email</label>
                                <input
                                    type="email"
                                    {...register('email', { pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="john@example.com"
                                />
                                {errors.email && <span className="text-xs text-red-400">{errors.email.message}</span>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Phone</label>
                                <input
                                    {...register('phone')}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Address</label>
                            <input
                                {...register('addressLine1')}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                placeholder="Street Address"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">City</label>
                                <input
                                    {...register('city')}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="City"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Country</label>
                                <input
                                    {...register('country')}
                                    className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                    placeholder="Country"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium text-foreground">Notes</label>
                            <textarea
                                {...register('notes')}
                                rows={4}
                                className="w-full px-3 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                                placeholder="Additional notes..."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {submitting ? 'Saving...' : 'Save Contact'}
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}
