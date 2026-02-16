import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Layers,
    Download,
    Trash2,
    Search,
    Info,
    ExternalLink,
    Box,
    HardDrive,
    Activity,
    Plus
} from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';

interface DockerImage {
    Id: string;
    RepoTags: string[] | null;
    Size: number;
    Created: number;
}

export default function Images() {
    const [search, setSearch] = useState('');
    const [pullImageName, setPullImageName] = useState('');
    const [isPulling, setIsPulling] = useState(false);

    const { data: images, isLoading, refetch } = useQuery<DockerImage[]>({
        queryKey: ['images'],
        queryFn: async () => {
            const res = await axios.get('/api/images');
            return res.data;
        }
    });

    const handlePull = async () => {
        if (!pullImageName) return;
        setIsPulling(true);
        try {
            await axios.post('/api/images/pull', { image: pullImageName });
            alert('Image pulled successfully!');
            setPullImageName('');
            refetch();
        } catch (error) {
            alert('Failed to pull image');
        } finally {
            setIsPulling(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this image?')) return;
        try {
            await axios.delete(`/api/images/${id}`);
            refetch();
        } catch (error) {
            alert('Failed to delete image');
        }
    };

    const formatBytes = (bytes: number) => {
        const mb = bytes / (1024 * 1024);
        if (mb > 1024) return (mb / 1024).toFixed(2) + ' GB';
        return mb.toFixed(1) + ' MB';
    };

    const filteredImages = images?.filter(img =>
        img.RepoTags?.[0]?.toLowerCase().includes(search.toLowerCase()) ||
        img.Id.toLowerCase().includes(search.toLowerCase())
    ) || [];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Images</h2>
                    <p className="text-slate-500 mt-1">Manage and pull Docker images from registries.</p>
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="e.g. nginx:latest"
                        value={pullImageName}
                        onChange={(e) => setPullImageName(e.target.value)}
                        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none w-64"
                    />
                    <button
                        onClick={handlePull}
                        disabled={isPulling}
                        className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                        <Download className={clsx("w-5 h-5", isPulling && "animate-bounce")} />
                        {isPulling ? 'Pulling...' : 'Pull Image'}
                    </button>
                </div>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-indigo-500/10 text-indigo-600 rounded-full text-xs font-bold uppercase">
                            Total Size: {images ? formatBytes(images.reduce((acc, img) => acc + img.Size, 0)) : '0 MB'}
                        </span>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search images..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm w-64 outline-none"
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="p-12 text-center text-slate-500">Loading images...</div>
                ) : (
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Image Name</th>
                                <th className="px-6 py-4">ID</th>
                                <th className="px-6 py-4">Size</th>
                                <th className="px-6 py-4">Created</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filteredImages.map((img) => (
                                <tr key={img.Id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                                                <Layers className="w-4 h-4" />
                                            </div>
                                            <span className="font-semibold text-sm truncate max-w-xs">{img.RepoTags?.[0] || '<none>'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-mono text-slate-400">{img.Id.substring(7, 19)}</span>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-600 dark:text-slate-300">
                                        {formatBytes(img.Size)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(img.Created * 1000).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-1">
                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-primary-600">
                                                <Info className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(img.Id)}
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
