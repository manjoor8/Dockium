import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Settings as SettingsIcon,
    Moon,
    Sun,
    Monitor,
    Cloud,
    Lock,
    User,
    Bell,
    Database,
    Github,
    History
} from 'lucide-react';
import axios from 'axios';
import { clsx } from 'clsx';

export default function Settings() {
    const [theme, setTheme] = useState('system');
    const [activeSection, setActiveSection] = useState('general');
    const [daemonSocket, setDaemonSocket] = useState('/var/run/docker.sock');

    const { data: serverSettings, refetch } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const res = await axios.get('/api/settings');
            return res.data;
        }
    });

    useEffect(() => {
        if (serverSettings) {
            if (serverSettings.theme) setTheme(serverSettings.theme);
            if (serverSettings.docker_socket) setDaemonSocket(serverSettings.docker_socket);
        }
    }, [serverSettings]);

    const handleSave = async () => {
        try {
            await axios.post('/api/settings', {
                theme,
                docker_socket: daemonSocket
            });
            alert('Settings saved successfully!');
            refetch();
        } catch (error) {
            alert('Failed to save settings');
        }
    };

    const sections = [
        { id: 'general', icon: SettingsIcon, label: 'General' },
        { id: 'account', icon: User, label: 'Account' },
        { id: 'notifications', icon: Bell, label: 'Notifications' },
        { id: 'security', icon: Lock, label: 'Security' },
        { id: 'backup', icon: Database, label: 'Data & Backup' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Settings</h2>
                <p className="text-slate-500 mt-1">Configure your Dockium instance and preferences.</p>
            </div>

            <div className="flex gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-64 space-y-1">
                    {sections.map((section) => (
                        <button
                            key={section.id}
                            onClick={() => setActiveSection(section.id)}
                            className={clsx(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group",
                                activeSection === section.id
                                    ? "bg-white dark:bg-slate-800 shadow-sm text-primary-600 border border-slate-200 dark:border-slate-700"
                                    : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            )}
                        >
                            <section.icon className={clsx("w-5 h-5", activeSection === section.id ? "text-primary-600" : "text-slate-400 group-hover:text-slate-500")} />
                            {section.label}
                        </button>
                    ))}
                </aside>

                {/* Content Area */}
                <div className="flex-1 space-y-6">
                    <div className="card">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Monitor className="w-5 h-5 text-primary-600" />
                            Appearance
                        </h3>

                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { id: 'light', icon: Sun, label: 'Light' },
                                { id: 'dark', icon: Moon, label: 'Dark' },
                                { id: 'system', icon: Monitor, label: 'System' },
                            ].map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setTheme(item.id)}
                                    className={clsx(
                                        "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                                        theme === item.id
                                            ? "border-primary-500 bg-primary-500/5 text-primary-600"
                                            : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700"
                                    )}
                                >
                                    <item.icon className="w-6 h-6" />
                                    <span className="text-sm font-semibold">{item.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <Cloud className="w-5 h-5 text-indigo-600" />
                            Docker Daemon
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-500 mb-2">Daemon Socket Path</label>
                                <input
                                    type="text"
                                    value={daemonSocket}
                                    onChange={(e) => setDaemonSocket(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-lg text-sm outline-none focus:ring-2 ring-primary-500/20"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3">
                        <button className="px-6 py-2 rounded-lg font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="btn-primary">
                            Save Changes
                        </button>
                    </div>

                    <div className="pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between opacity-50">
                        <p className="text-xs font-mono">Dockium v0.1.0-alpha</p>
                        <div className="flex gap-4">
                            <a href="#" className="hover:text-primary-600"><Github className="w-4 h-4" /></a>
                            <a href="#" className="hover:text-primary-600"><History className="w-4 h-4" /></a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
