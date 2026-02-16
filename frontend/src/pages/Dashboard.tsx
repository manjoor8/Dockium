import { useState, useEffect } from 'react';
import {
    Activity,
    Cpu,
    MemoryStick as Memory,
    HardDrive,
    Container,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';

export default function Dashboard() {
    const [stats, setStats] = useState<any>(null);
    const [cpuHistory, setCpuHistory] = useState<any[]>([]);

    useEffect(() => {
        // Mock WebSocket for demo purposes
        const interval = setInterval(() => {
            const newCpu = Math.floor(Math.random() * 40) + 10;
            setCpuHistory(prev => [...prev.slice(-19), { time: new Date().toLocaleTimeString(), value: newCpu }]);

            setStats({
                dockerStatus: 'Running',
                runningContainers: 12,
                totalMemory: '16GB',
                usedMemory: '4.2GB',
                cpuUsage: newCpu + '%',
                diskUsage: '65%'
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
        <div className="card group">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl bg-${color}-500/10 text-${color}-600`}>
                    <Icon className="w-6 h-6" />
                </div>
                {trend && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-600`}>
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
            <div>
                <h2 className="text-3xl font-bold text-slate-800 dark:text-white">System Overview</h2>
                <p className="text-slate-500 mt-1">Real-time performance monitoring and Docker daemon status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Docker Daemon" value={stats?.dockerStatus} icon={Activity} color="emerald" trend="Online" />
                <StatCard title="Running Containers" value={stats?.runningContainers} icon={Container} color="primary" />
                <StatCard title="CPU Usage" value={stats?.cpuUsage} icon={Cpu} color="amber" />
                <StatCard title="Memory Usage" value={stats?.usedMemory} icon={Memory} color="rose" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* CPU Chart */}
                <div className="lg:col-span-2 card">
                    <div className="flex items-center justify-between mb-8">
                        <h4 className="font-bold text-lg">CPU Load History</h4>
                        <select className="bg-slate-100 dark:bg-slate-800 border-none text-sm rounded-lg px-3 py-1 outline-none">
                            <Option value="1">Last 30 minutes</Option>
                        </select>
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
                                    contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
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

                {/* Disk Usage */}
                <div className="card">
                    <h4 className="font-bold text-lg mb-8">Disk Usage</h4>
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="relative w-48 h-48">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    className="text-slate-100 dark:text-slate-800"
                                />
                                <circle
                                    cx="96"
                                    cy="96"
                                    r="80"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={502.4}
                                    strokeDashoffset={502.4 * (1 - 0.65)}
                                    className="text-primary-500 transition-all duration-1000"
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-extrabold">65%</span>
                                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Used</span>
                            </div>
                        </div>
                        <div className="mt-8 grid grid-cols-2 gap-8 w-full">
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Total Space</p>
                                <p className="text-lg font-bold">500 GB</p>
                            </div>
                            <div>
                                <p className="text-xs text-slate-500 font-medium">Available</p>
                                <p className="text-lg font-bold">175 GB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Option({ children, value }: any) {
    return <option value={value}>{children}</option>;
}
