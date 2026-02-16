import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Play,
    Square,
    RotateCw,
    Trash2,
    ExternalLink,
    Terminal as TerminalIcon,
    Search,
    Plus
} from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';

interface ContainerSummary {
    Id: string;
    Names: string[];
    Image: string;
    State: string;
    Status: string;
    NetworkSettings: {
        Networks: Record<string, { IPAddress: string }>;
    };
}

export default function Containers() {
    const [search, setSearch] = useState('');

    const { data: containers, isLoading, refetch } = useQuery<ContainerSummary[]>({
        queryKey: ['containers'],
        queryFn: async () => {
            const res = await axios.get('/api/containers?all=true');
            return res.data;
        }
    });

    const filteredContainers = containers?.filter(c =>
        c.Names[0].toLowerCase().includes(search.toLowerCase()) ||
        c.Image.toLowerCase().includes(search.toLowerCase())
    ) || [];

    const StatusBadge = ({ status }: { status: string }) => (
        <span className={clsx(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
            status === 'running' ? "bg-emerald-500/10 text-emerald-600" :
                status === 'exited' ? "bg-rose-500/10 text-rose-600" :
                    "bg-slate-500/10 text-slate-500"
        )}>
            {status}
        </span>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Containers</h2>
                    <p className="text-slate-500 mt-1">Manage and monitor all Docker containers on this host.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Container
                </button>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            Real-time Data
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => refetch()}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-600 transition-colors"
                        >
                            <RotateCw className="w-4 h-4" />
                        </button>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter containers..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 outline-none"
                            />
                        </div>
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-slate-500">Loading containers...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Name</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">IP Address</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredContainers.map((container) => {
                                const network = Object.values(container.NetworkSettings.Networks)[0];
                                const ipAddress = network?.IPAddress || '-';

                                return (
                                    <tr key={container.Id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={clsx(
                                                    "w-2 h-2 rounded-full",
                                                    container.State === 'running' ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                                                )}></div>
                                                <span className="font-semibold">{container.Names[0].replace('/', '')}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={container.State} />
                                        </td>
                                        <td className="px-6 py-4 text-sm font-mono text-slate-500 truncate max-w-[200px]">
                                            {container.Image}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            {ipAddress}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-600">
                                                    <ExternalLink className="w-4 h-4" />
                                                </button>
                                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-600">
                                                    <TerminalIcon className="w-4 h-4" />
                                                </button>
                                                <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                                                {container.State === 'running' ? (
                                                    <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 hover:text-rose-600">
                                                        <Square className="w-4 h-4" />
                                                    </button>
                                                ) : (
                                                    <button className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg text-slate-400 hover:text-emerald-600">
                                                        <Play className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 hover:text-rose-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
                    <p>Showing {filteredContainers.length} containers</p>
                </div>
            </div>
        </div>
    );
}
