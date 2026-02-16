import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Network as NetworkIcon,
    Plus,
    Search,
    Trash2,
    Globe,
    Cpu,
    ShieldCheck,
    Box
} from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';

interface DockerNetwork {
    Id: string;
    Name: string;
    Driver: string;
    Scope: string;
    Internal: boolean;
    EnableIPv6: boolean;
}

export default function Networks() {
    const [search, setSearch] = useState('');

    const { data: networks, isLoading } = useQuery<DockerNetwork[]>({
        queryKey: ['networks'],
        queryFn: async () => {
            const res = await axios.get('/api/networks');
            return res.data;
        }
    });

    const filteredNetworks = networks?.filter(net =>
        net.Name.toLowerCase().includes(search.toLowerCase()) ||
        net.Driver.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Networks</h2>
                    <p className="text-slate-500 mt-1">Docker networks facilitate communication between containers.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Network
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full p-12 text-center text-slate-500">Loading networks...</div>
                ) : (
                    filteredNetworks.map((net) => (
                        <div key={net.Id} className="card group hover:scale-[1.02] active:scale-[0.98] transition-all">
                            <div className="flex items-start justify-between mb-4">
                                <div className={clsx(
                                    "p-3 rounded-xl",
                                    net.Driver === 'bridge' ? "bg-blue-500/10 text-blue-600" :
                                        net.Driver === 'host' ? "bg-amber-500/10 text-amber-600" :
                                            "bg-emerald-500/10 text-emerald-600"
                                )}>
                                    <NetworkIcon className="w-6 h-6" />
                                </div>
                                <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 hover:text-rose-600 transition-all">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>

                            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">{net.Name}</h3>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-xs font-mono uppercase tracking-wider">
                                    {net.Driver}
                                </span>
                                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded text-xs font-mono uppercase tracking-wider">
                                    {net.Scope}
                                </span>
                            </div>

                            <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-2">
                                        <ShieldCheck className="w-4 h-4" /> Internal
                                    </span>
                                    <span className={net.Internal ? "text-emerald-500" : "text-slate-400"}>
                                        {net.Internal ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500 flex items-center gap-2">
                                        <Globe className="w-4 h-4" /> IPv6
                                    </span>
                                    <span className={net.EnableIPv6 ? "text-emerald-500" : "text-slate-400"}>
                                        {net.EnableIPv6 ? 'Enabled' : 'Disabled'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
