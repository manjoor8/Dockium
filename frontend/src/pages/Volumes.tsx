import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Plus,
    Search,
    Trash2,
    Database,
    FolderOpen,
    Info
} from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';

interface DockerVolume {
    Name: string;
    Driver: string;
    Mountpoint: string;
}

export default function Volumes() {
    const [search, setSearch] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [newVolumeName, setNewVolumeName] = useState('');

    const { data: volumes, isLoading, refetch } = useQuery<DockerVolume[]>({
        queryKey: ['volumes'],
        queryFn: async () => {
            const res = await axios.get('/api/volumes');
            return res.data;
        }
    });

    const handleCreate = async () => {
        if (!newVolumeName) return;
        try {
            await axios.post('/api/volumes', { Name: newVolumeName });
            alert('Volume created successfully!');
            setNewVolumeName('');
            setIsCreating(false);
            refetch();
        } catch (error) {
            alert('Failed to create volume');
        }
    };

    const handleDelete = async (name: string) => {
        if (!confirm('Are you sure you want to delete this volume?')) return;
        try {
            await axios.delete(`/api/volumes/${name}`);
            refetch();
        } catch (error) {
            alert('Failed to delete volume');
        }
    };

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
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    Create Volume
                </button>
            </div>

            {isCreating && (
                <div className="card border-orange-500/50 bg-orange-500/5 animate-in slide-in-from-top-2">
                    <h4 className="font-bold mb-4">New Docker Volume</h4>
                    <div className="flex gap-4">
                        <input
                            type="text"
                            placeholder="Volume Name"
                            value={newVolumeName}
                            onChange={(e) => setNewVolumeName(e.target.value)}
                            className="flex-1 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none"
                        />
                        <button onClick={handleCreate} className="px-5 py-2 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors">Create</button>
                        <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Cancel</button>
                    </div>
                </div>
            )}

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
                                        <div className="flex items-center gap-2 text-xs text-slate-500 font-mono italic truncate max-w-[300px]">
                                            <FolderOpen className="w-3 h-3" />
                                            {vol.Mountpoint}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-600">
                                                <Info className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(vol.Name)}
                                                className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 hover:text-rose-600"
                                            >
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
