import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Phone, Mail, MoreHorizontal } from 'lucide-react';
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
}

export function ContactsPage() {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await api.get('/contacts');
            setContacts(response.data);
        } catch (error) {
            console.error('Failed to fetch contacts:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredContacts = contacts.filter((contact) =>
        `${contact.firstName} ${contact.lastName} ${contact.companyName || ''}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-auto bg-background">
            <PageHeader title="Contacts" />

            <main className="p-6 max-w-7xl mx-auto">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-muted w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search contacts..."
                            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg hover:bg-card-hover transition-colors text-foreground-muted hover:text-foreground">
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button
                            onClick={() => navigate('/crm/contacts/new')}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Plus className="w-4 h-4" />
                            <span className="font-medium">Add Contact</span>
                        </button>
                    </div>
                </div>

                {/* Contacts List */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-xl border border-border">
                        <div className="w-12 h-12 bg-card-hover rounded-full flex items-center justify-center mx-auto mb-4">
                            <Plus className="w-6 h-6 text-foreground-muted" />
                        </div>
                        <h3 className="text-lg font-medium text-foreground mb-1">No contacts found</h3>
                        <p className="text-foreground-muted mb-4">Get started by creating your first contact.</p>
                        <button
                            onClick={() => navigate('/crm/contacts/new')}
                            className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline transition-all"
                        >
                            Add New Contact
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredContacts.map((contact) => (
                            <div
                                key={contact.id}
                                onClick={() => navigate(`/crm/contacts/${contact.id}`)}
                                className="group bg-card border border-border rounded-xl p-4 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all cursor-pointer"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 flex items-center justify-center text-indigo-400 font-bold border border-indigo-500/20">
                                            {contact.firstName[0]}
                                            {contact.lastName[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground group-hover:text-indigo-400 transition-colors">
                                                {contact.firstName} {contact.lastName}
                                            </h3>
                                            {contact.companyName && (
                                                <p className="text-sm text-foreground-muted">{contact.companyName}</p>
                                            )}
                                        </div>
                                    </div>
                                    <button className="text-foreground-muted hover:text-foreground p-1">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </div>

                                <div className="space-y-2">
                                    {contact.email && (
                                        <div className="flex items-center gap-2 text-sm text-foreground-muted">
                                            <Mail className="w-3.5 h-3.5" />
                                            <span className="truncate">{contact.email}</span>
                                        </div>
                                    )}
                                    {contact.phone && (
                                        <div className="flex items-center gap-2 text-sm text-foreground-muted">
                                            <Phone className="w-3.5 h-3.5" />
                                            <span>{contact.phone}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                                        <span className={`text-xs px-2 py-1 rounded-full border ${contact.type === 'CUSTOMER'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                            }`}>
                                            {contact.type}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
