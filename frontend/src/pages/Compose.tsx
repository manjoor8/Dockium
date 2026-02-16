import { Terminal, Plus, FileText, Play, Square, RefreshCcw } from 'lucide-react';

export default function Compose() {
    const projects = [
        { name: 'Microservices Demo', status: 'running', containers: 5, services: 3, path: '/home/user/demo' },
        { name: 'Monitoring Stack', status: 'paused', containers: 3, services: 3, path: '/opt/monitoring' },
        { name: 'Internal Wiki', status: 'stopped', containers: 2, services: 2, path: '/srv/wiki' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Docker Compose</h2>
                    <p className="text-slate-500 mt-1">Manage multi-container applications as single projects.</p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    New Project
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {projects.map((project) => (
                    <div key={project.name} className="card overflow-hidden !p-0">
                        <div className="p-6">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-primary-500/10 flex items-center justify-center text-primary-600">
                                        <Terminal className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{project.name}</h3>
                                        <p className="text-xs text-slate-500 font-mono mt-1">{project.path}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${project.status === 'running' ? 'bg-emerald-500/10 text-emerald-600' :
                                        project.status === 'paused' ? 'bg-amber-500/10 text-amber-600' :
                                            'bg-slate-500/10 text-slate-500'
                                    }`}>
                                    {project.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                    <p className="text-xs text-slate-500 mb-1">Services</p>
                                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{project.services}</p>
                                </div>
                                <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                    <p className="text-xs text-slate-500 mb-1">Containers</p>
                                    <p className="text-xl font-bold text-slate-800 dark:text-slate-100">{project.containers}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-100/50 dark:bg-slate-800/30 px-6 py-4 flex items-center justify-between">
                            <button className="text-sm font-semibold text-primary-600 flex items-center gap-2 hover:underline">
                                <FileText className="w-4 h-4" />
                                View YAML
                            </button>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm transition-all text-slate-600 hover:text-emerald-500">
                                    <Play className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm transition-all text-slate-600 hover:text-amber-500">
                                    <RefreshCcw className="w-4 h-4" />
                                </button>
                                <button className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-lg shadow-sm transition-all text-slate-600 hover:text-rose-500">
                                    <Square className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="card bg-gradient-to-br from-primary-600 to-indigo-700 text-white p-8 flex items-center justify-between overflow-hidden relative">
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2">Automate with Docker Compose</h3>
                    <p className="text-primary-100 max-w-md">
                        Docker Compose allows you to define and run multi-container applications.
                        Import your existing <span className="font-mono bg-white/10 px-1 rounded">docker-compose.yml</span> files and manage them all in one place.
                    </p>
                </div>
                <button className="bg-white text-primary-600 px-6 py-3 rounded-xl font-bold shadow-xl hover:scale-105 transition-transform relative z-10">
                    Get Started
                </button>
                <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
            </div>
        </div>
    );
}
