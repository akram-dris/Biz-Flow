import { useState, useEffect } from 'react';
import { Plus, GripVertical } from 'lucide-react';
import { api } from '../../services/api';
import { PageHeader } from '../../components/layout/PageHeader';

interface Lead {
    id: string;
    title: string;
    stage: string;
    dealValue?: number;
    contact: {
        firstName: string;
        lastName: string;
    };
}

const STAGES = [
    { id: 'NEW', label: 'New Lead', color: 'bg-blue-500' },
    { id: 'QUALIFIED', label: 'Qualified', color: 'bg-purple-500' },
    { id: 'PROPOSAL', label: 'Proposal', color: 'bg-amber-500' },
    { id: 'WON', label: 'Won', color: 'bg-emerald-500' },
    { id: 'LOST', label: 'Lost', color: 'bg-red-500' },
];

export function LeadsPage() {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLeads();
    }, []);

    const fetchLeads = async () => {
        try {
            const response = await api.get('/leads');
            setLeads(response.data);
        } catch (error) {
            console.error('Failed to fetch leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLeadsByStage = (stage: string) => leads.filter((l) => l.stage === stage);

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden">
            <PageHeader title="Pipeline">
                <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-500 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0">
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Add Lead</span>
                </button>
            </PageHeader>

            <main className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                {loading ? (
                    <div className="flex justify-center items-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
                    </div>
                ) : (
                    <div className="flex gap-6 h-full min-w-[1200px]">
                        {STAGES.map((stage) => (
                            <div key={stage.id} className="flex-1 min-w-[280px] flex flex-col h-full bg-card/30 rounded-xl border border-border/50">
                                <div className="p-4 border-b border-border/50 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                                        <h3 className="font-semibold text-foreground">{stage.label}</h3>
                                    </div>
                                    <span className="text-xs text-foreground-muted bg-card border border-border px-2 py-0.5 rounded-full">
                                        {getLeadsByStage(stage.id).length}
                                    </span>
                                </div>

                                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                                    {getLeadsByStage(stage.id).map((lead) => (
                                        <div key={lead.id} className="bg-card border border-border p-3 rounded-lg shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing group">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-medium text-foreground">{lead.title}</h4>
                                                <GripVertical className="text-foreground-muted w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </div>
                                            <p className="text-sm text-foreground-muted mb-3">
                                                {lead.contact.firstName} {lead.contact.lastName}
                                            </p>
                                            {lead.dealValue && (
                                                <div className="text-sm font-semibold text-emerald-400">
                                                    ${Number(lead.dealValue).toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    ))}

                                    {getLeadsByStage(stage.id).length === 0 && (
                                        <div className="flex flex-col items-center justify-center py-8 text-foreground-muted border border-dashed border-border rounded-lg">
                                            <span className="text-sm">No leads</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
