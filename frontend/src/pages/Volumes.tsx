import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    HardDrive,
    Plus,
    Search,
    Trash2,
    Database,
    FolderOpen,
    Info,
    Calendar
} from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';

interface DockerVolume {
    Name: string;
    Driver: string;
    Mountpoint: string;
    CreatedAt?: string;
}

export default function Volumes() {
    const [search, setSearch] = useState('');

    const { data: volumes, isLoading } = useQuery<DockerVolume[]>({
        queryKey: ['volumes'],
        queryFn: async () => {
            const res = await axios.get('/api/volumes');
            return res.data;
        }
    });

    const filteredVolumes = volumes?.filter(vol =>
        vol.Name.toLowerCase().includes(search.toLowerCase()) ||
        vol.Driver.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Volumes</h2>
                    <p className="text-slate-500 mt-1">Manage persistent storage for your Docker containers.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Volume
                </button>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold uppercase">
                            Active: {volumes?.length || 0}
                        </span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search volumes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 outline-none"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-slate-500">Loading volumes...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Volume Name</th>
                                <th className="px-6 py-4">Driver</th>
                                <th className="px-6 py-4">Mountpoint</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredVolumes.map((vol) => (
                                <tr key={vol.Name} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-orange-600">
                                                <Database className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-sm truncate max-w-xs">{vol.Name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-slate-500 font-mono">
                                            {vol.Driver}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono italic">
                                            <FolderOpen className="w-3 h-3" />
                                            {vol.Mountpoint}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-600">
                                                <Info className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 hover:text-rose-600">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
