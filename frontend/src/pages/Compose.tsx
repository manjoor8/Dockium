import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Terminal, Plus, FileText, Play, Square, RefreshCcw, Folder } from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';

interface ComposeProject {
    name: string;
    status: string;
    config_path: string;
}

export default function Compose() {
    const [isCreating, setIsCreating] = useState(false);
    const [projectPath, setProjectPath] = useState('');

    const { data: projects, isLoading, refetch } = useQuery<ComposeProject[]>({
        queryKey: ['compose-projects'],
        queryFn: async () => {
            const res = await axios.get('/api/compose/projects');
            return res.data;
        }
    });

    const handleAction = async (path: string, action: string) => {
        try {
            await axios.post('/api/compose/action', { project_path: path, action });
            refetch();
        } catch (error) {
            alert(`Failed to ${action} project`);
        }
    };

    const handleAddProject = async () => {
        if (!projectPath) return;
        // In this simple version, adding just means triggering an 'up'
        handleAction(projectPath, 'up');
        setIsCreating(false);
        setProjectPath('');
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Docker Compose</h2>
                    <p className="text-slate-500 mt-1">Manage multi-container applications as single projects.</p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus className="w-5 h-5" />
                    New Project
                </button>
            </div>

            {isCreating && (
                <div className="card border-primary-500/50 bg-primary-500/5 animate-in slide-in-from-top-2">
                    <h4 className="font-bold mb-4">Import Compose Project</h4>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Folder className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Full path to docker-compose.yml"
                                value={projectPath}
                                onChange={(e) => setProjectPath(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none"
                            />
                        </div>
                        <button onClick={handleAddProject} className="btn-primary">Import & Start</button>
                        <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">Cancel</button>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <div className="col-span-full p-12 text-center text-slate-500">Loading projects...</div>
                ) : projects?.length === 0 ? (
                    <div className="col-span-full p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
                        No compose projects found. Try importing one!
                    </div>
                ) : (
                    projects?.map((project) => (
                        <div key={project.name} className="card overflow-hidden !p-0">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-600">
                                            <Terminal className="w-7 h-7" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{project.name}</h3>
                                            <p className="text-[10px] text-slate-400 font-mono mt-1 break-all">{project.config_path}</p>
                                        </div>
                                    </div>
                                    <span className={clsx(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
                                        project.status.toLowerCase().includes('running') ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-500/10 text-slate-500'
                                    )}>
                                        {project.status}
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-100/50 dark:bg-slate-800/30 px-6 py-4 flex items-center justify-between">
                                <button className="text-sm font-semibold text-primary-600 flex items-center gap-2 hover:underline">
                                    <FileText className="w-4 h-4" />
                                    View YAML
                                </button>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleAction(project.config_path, 'up')}
                                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm transition-all text-slate-600 hover:text-emerald-500"
                                    >
                                        <Play className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleAction(project.config_path, 'up')}
                                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm transition-all text-slate-600 hover:text-amber-500"
                                    >
                                        <RefreshCcw className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleAction(project.config_path, 'down')}
                                        className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm transition-all text-slate-600 hover:text-rose-500"
                                    >
                                        <Square className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="card bg-gradient-to-br from-primary-600 to-indigo-700 text-white p-8 flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">Automate with Docker Compose</h3>
                    <p className="text-primary-100 max-w-md">
                        Docker Compose allows you to define and run multi-container applications.
                        Import your existing <span className="font-mono bg-white/10 px-1 rounded">docker-compose.yml</span> files and manage them all in one place.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform relative z-10"
                >
                    Get Started
                </button>
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            </div>
        </div>
    );
}
