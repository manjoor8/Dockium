import { Routes, Route, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Box,
    Layers,
    Network,
    HardDrive,
    Terminal,
    Settings,
    Bell,
    Search,
    User
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Containers from './pages/Containers';
import { clsx } from 'clsx';

function App() {
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
        { label: 'Containers', icon: Box, path: '/containers' },
        { label: 'Images', icon: Layers, path: '/images' },
        { label: 'Networks', icon: Network, path: '/networks' },
        { label: 'Volumes', icon: HardDrive, path: '/volumes' },
        { label: 'Docker Compose', icon: Terminal, path: '/compose' },
        { label: 'Settings', icon: Settings, path: '/settings' },
    ];

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950">
            {/* Sidebar */}
            <aside className="w-64 glass border-r border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-indigo-600 bg-clip-text text-transparent">
                        Dockium
                    </h1>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={clsx(
                                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                                location.pathname === item.path
                                    ? "bg-primary-500/10 text-primary-600 shadow-sm"
                                    : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                        >
                            <item.icon className={clsx("w-5 h-5", location.pathname === item.path ? "text-primary-600" : "text-slate-400 group-hover:text-slate-600")} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-200 dark:border-slate-800 m-4 rounded-xl bg-slate-100/50 dark:bg-slate-800/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
                            AD
                        </div>
                        <div>
                            <p className="text-sm font-semibold">Admin</p>
                            <p className="text-xs text-slate-500">Administrator</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <header className="h-16 glass border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 z-10">
                    <div className="flex items-center gap-4 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-lg w-96">
                        <Search className="w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search containers, images..."
                            className="bg-transparent border-none outline-none text-sm w-full"
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg relative">
                            <Bell className="w-5 h-5 text-slate-500" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                        </button>
                        <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                            <User className="w-5 h-5 text-slate-500" />
                        </button>
                    </div>
                </header>

                {/* Page Area */}
                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/containers" element={<Containers />} />
                        {/* Fallback */}
                        <Route path="*" element={<div className="flex items-center justify-center h-full">Coming Soon</div>} />
                    </Routes>
                </div>
            </main>
        </div>
    );
}

export default App;
