import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Network, Plus, Search, Trash2, Globe, Shield, Zap, Info } from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';

interface DockerNetwork {
    Id: string;
    Name: string;
    Driver: string;
    Scope: string;
}

export default function Networks() {
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newNetworkName, setNewNetworkName] = useState('');

    const { data: networks, isLoading, refetch } = useQuery<DockerNetwork[]>({
        queryKey: ['networks'],
        queryFn: async () => {
            const res = await axios.get('/api/networks');
            return res.data;
        }
    });

    const handleCreate = async () => {
        if (!newNetworkName) return;
        try {
            await axios.post('/api/networks', { Name: newNetworkName, Driver: 'bridge' });
            alert('Network created successfully!');
            setNewNetworkName('');
            setIsCreating(false);
            refetch();
        } catch (error) {
            alert('Failed to create network');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this network?')) return;
        try {
            await axios.delete(`/api/networks/${id}`);
            refetch();
        } catch (error) {
            alert('Failed to delete network');
        }
    };

    const filteredNetworks = networks?.filter(net =>
        net.Name.toLowerCase().includes(search.toLowerCase()) ||
        net.Driver.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Networks</h2>
                    <p className="text-slate-500 mt-1">Manage virtual networks for container communication.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Network
                </button>
            </div>

            {isCreating && (
                <div className="card border-primary-500/50 bg-primary-500/5 animate-in slide-in-from-top-2">
                    <h4 className="font-bold mb-4">New Bridge Network</h4>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Network Name"
                            value={newNetworkName}
                            onChange={(e) => setNewNetworkName(e.target.value)}
                            className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none"
                        />
                        <button onClick={handleCreate} className="btn-primary">Create</button>
                        <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full p-12 text-center text-slate-500">Loading networks...</div>
                ) : (
                    filteredNetworks.map((net) => (
                        <div key={net.Id} className="card group hover:scale-[1.02] transition-all">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                                        <Globe className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{net.Name}</h3>
                                        <span className="text-xs text-slate-500 font-mono uppercase tracking-widest">{net.Id.substring(0, 12)}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(net.Id)}
                                    className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Shield className="w-4 h-4" />
                                        <span>Driver</span>
                                    </div>
                                    <span className="font-bold text-slate-800 dark:text-slate-100">{net.Driver}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                                        <Zap className="w-4 h-4" />
                                        <span>Scope</span>
                                    </div>
                                    <span className="font-bold text-slate-800 dark:text-slate-100 uppercase text-xs">{net.Scope}</span>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
                                <Info className="w-4 h-4" />
                                Network Details
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
