import { useState } from 'react';
import {
    Play,
    Square,
    RotateCw,
    Trash2,
    ExternalLink,
    MoreVertical,
    Terminal as TerminalIcon,
    Search,
    Plus
} from 'lucide-react';
import { clsx } from 'clsx';

export default function Containers() {
    const [view, setView] = useState<'list' | 'grid'>('list');

    const containers = [
        { id: 'c1', name: 'nginx-proxy', status: 'running', image: 'nginx:latest', ip: '172.17.0.2', cpu: '0.2%', memory: '12MB' },
        { id: 'c2', name: 'mongodb-primary', status: 'running', image: 'mongo:6.0', ip: '172.17.0.3', cpu: '1.5%', memory: '256MB' },
        { id: 'c3', name: 'redis-cache', status: 'stopped', image: 'redis:alpine', ip: '-', cpu: '-', memory: '-' },
        { id: 'c4', name: 'api-server-prod', status: 'running', image: 'dockium/api:v1.2', ip: '172.17.0.4', cpu: '4.2%', memory: '128MB' },
    ];

    const StatusBadge = ({ status }: { status: string }) => (
        <span className={clsx(
            "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
            status === 'running' ? "bg-emerald-500/10 text-emerald-600" : "bg-slate-500/10 text-slate-500"
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
                        <StatusBadge status="running" />
                        <StatusBadge status="stopped" />
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Filter containers..."
                                className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Name</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Image</th>
                            <th className="px-6 py-4">IP Address</th>
                            <th className="px-6 py-4">Usage (C/M)</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {containers.map((container) => (
                            <tr key={container.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={clsx(
                                            "w-2 h-2 rounded-full",
                                            container.status === 'running' ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                                        )}></div>
                                        <span className="font-semibold">{container.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge status={container.status} />
                                </td>
                                <td className="px-6 py-4 text-sm font-mono text-slate-500">
                                    {container.image}
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-500">
                                    {container.ip}
                                </td>
                                <td className="px-6 py-4 text-sm">
                                    {container.status === 'running' ? (
                                        <div className="flex gap-2">
                                            <span className="text-amber-600 font-medium">{container.cpu}</span>
                                            <span className="text-blue-600 font-medium">{container.memory}</span>
                                        </div>
                                    ) : "-"}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-600 title='Logs'">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-600 title='Terminal'">
                                            <TerminalIcon className="w-4 h-4" />
                                        </button>
                                        <div className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"></div>
                                        {container.status === 'running' ? (
                                            <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 hover:text-rose-600">
                                                <Square className="w-4 h-4" />
                                            </button>
                                        ) : (
                                            <button className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg text-slate-400 hover:text-emerald-600">
                                                <Play className="w-4 h-4" />
                                            </button>
                                        )}
                                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-600">
                                            <RotateCw className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-sm text-slate-500">
                    <p>Showing 4 containers</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 transition-colors">Previous</button>
                        <button className="px-3 py-1 bg-primary-600 text-white rounded-md">1</button>
                        <button className="px-3 py-1 border border-slate-200 dark:border-slate-800 rounded-md hover:bg-slate-50 transition-colors">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
