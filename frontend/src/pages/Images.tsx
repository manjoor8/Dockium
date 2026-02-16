import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Download,
    Trash2,
    Search,
    Layers,
    Calendar,
    Database,
    ExternalLink,
    Play
} from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';

interface DockerImage {
    Id: string;
    RepoTags: string[] | null;
    Created: number;
    Size: number;
    VirtualSize: number;
}

export default function Images() {
    const [search, setSearch] = useState('');

    const { data: images, isLoading } = useQuery<DockerImage[]>({
        queryKey: ['images'],
        queryFn: async () => {
            const res = await axios.get('/api/images');
            return res.data;
        }
    });

    const formatSize = (bytes: number) => {
        const mb = bytes / (1024 * 1024);
        if (mb > 1024) return (mb / 1024).toFixed(2) + ' GB';
        return mb.toFixed(2) + ' MB';
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString();
    };

    const filteredImages = images?.filter(img =>
        img.RepoTags?.some(tag => tag.toLowerCase().includes(search.toLowerCase())) ||
        img.Id.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Images</h2>
                    <p className="text-slate-500 mt-1">Local images available for creating containers.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Pull Image
                </button>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-primary-500/10 text-primary-600 rounded-full text-xs font-bold uppercase">
                            Total: {images?.length || 0}
                        </span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search images..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 outline-none focus:ring-2 ring-primary-500/20 transition-all font-medium"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-slate-500">Loading images...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Repository & Tag</th>
                                <th className="px-6 py-4">Image ID</th>
                                <th className="px-6 py-4 text-center">Size</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredImages.map((img) => (
                                <tr key={img.Id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                                <Layers className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="font-semibold text-slate-800 dark:text-slate-200">
                                                    {img.RepoTags?.[0] || '<none>'}
                                                </div>
                                                <div className="text-xs text-slate-500 font-mono">
                                                    {img.RepoTags?.[1] && `+ ${img.RepoTags.length - 1} more tags`}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="font-mono text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-slate-500">
                                            {img.Id.split(':').pop()?.substring(0, 12)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{formatSize(img.Size)}</span>
                                            <span className="text-[10px] text-slate-500 uppercase tracking-tighter">Compressed</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(img.Created)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 hover:bg-emerald-50 dark:hover:bg-emerald-950/20 rounded-lg text-slate-400 hover:text-emerald-600 title='Run'">
                                                <Play className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-lg text-slate-400 hover:text-rose-600 title='Delete'">
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
