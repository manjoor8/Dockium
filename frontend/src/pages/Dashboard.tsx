import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
    Activity,
    Cpu,
    MemoryStick as Memory,
    HardDrive,
    Container,
    LayoutDashboard
} from 'lucide-react';
import axios from 'axios';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

interface SystemStats {
    cpu_usage: number;
    memory_total: number;
    memory_used: number;
    disks: Array<{
        total_space: number;
        available_space: number;
    }>;
    os_name: string;
    uptime: number;
}

export default function Dashboard() {
    const [cpuHistory, setCpuHistory] = useState<any[]>([]);

    const { data: stats } = useQuery<SystemStats>({
        queryKey: ['system-stats'],
        queryFn: async () => {
            const res = await axios.get('/api/system/stats');
            return res.data;
        },
        refetchInterval: 3000
    });

    const { data: containers } = useQuery<any[]>({
        queryKey: ['containers-summary'],
        queryFn: async () => {
            const res = await axios.get('/api/containers');
            return res.data;
        },
        refetchInterval: 5000
    });

    useEffect(() => {
        if (stats) {
            setCpuHistory(prev => [
                ...prev.slice(-19),
                { time: new Date().toLocaleTimeString(), value: Math.round(stats.cpu_usage) }
            ]);
        }
    }, [stats]);

    const formatBytes = (bytes: number) => {
        const gb = bytes / (1024 * 1024 * 1024);
        return gb.toFixed(1) + ' GB';
    };

    const mainDisk = stats?.disks[0];
    const diskUsedPercent = mainDisk ? Math.round(((mainDisk.total_space - mainDisk.available_space) / mainDisk.total_space) * 100) : 0;

    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="card group hover:scale-[1.02] transition-all">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-600`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600 uppercase`}>
                        {trend}
                    </span>
                )}
            </div>
            <p className="text-slate-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 dark:text-white">System Overview</h2>
                    <p className="text-slate-500 mt-1">Real-time performance monitoring and Docker daemon status.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 rounded-lg font-bold text-xs uppercase tracking-widest">
                    <Activity className="w-4 h-4" />
                    System Live
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Docker Daemon"
                    value="Connected"
                    icon={Activity}
                    color="emerald"
                    trend="Stable"
                />
                <StatCard
                    title="Running Containers"
                    value={containers?.length || 0}
                    icon={Container}
                    color="primary"
                />
                <StatCard
                    title="CPU Usage"
                    value={(stats?.cpu_usage ? Math.round(stats.cpu_usage) : 0) + '%'}
                    icon={Cpu}
                    color="amber"
                />
                <StatCard
                    title="Memory Usage"
                    value={stats ? `${formatBytes(stats.memory_used)} / ${formatBytes(stats.memory_total)}` : '0GB'}
                    icon={Memory}
                    color="rose"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="font-bold text-lg">CPU Load History</h4>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase">
                            <span className="w-3 h-3 rounded-full bg-primary-500"></span>
                            Usage %
                        </div>
                    </div>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cpuHistory}>
                                <defs>
                                    <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis dataKey="time" hide />
                                <YAxis hide domain={[0, 100]} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorCpu)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="card">
                    <h4 className="font-bold text-lg mb-8">Disk Usage</h4>
                    <div className="flex flex-col items-center justify-center p-4">
                        <div className="relative w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    className="text-slate-100 dark:text-slate-800"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r="70"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    fill="transparent"
                                    strokeDasharray={439.6}
                                    strokeDashoffset={439.6 * (1 - diskUsedPercent / 100)}
                                    className="text-primary-500 transition-all duration-1000 stroke-round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-extrabold">{diskUsedPercent}%</span>
                                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Used</span>
                            </div>
                        </div>
                        <div className="mt-8 space-y-4 w-full">
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-slate-500 font-bold uppercase">Total Volume</p>
                                <p className="text-sm font-bold">{mainDisk ? formatBytes(mainDisk.total_space) : '0GB'}</p>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                <div
                                    className="bg-primary-500 h-full transition-all duration-1000"
                                    style={{ width: `${diskUsedPercent}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-slate-500 font-bold uppercase">Available</p>
                                <p className="text-sm font-bold">{mainDisk ? formatBytes(mainDisk.available_space) : '0GB'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
