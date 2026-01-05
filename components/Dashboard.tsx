
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { LogEntry } from '../types';
import { Droplets, Activity, Waves } from 'lucide-react';

interface DashboardProps {
  entries: LogEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  const today = new Date().toLocaleDateString();
  
  const todayEntries = entries.filter(e => 
    new Date(e.timestamp).toLocaleDateString() === today
  );

  const stats = {
    waterTotal: todayEntries.filter(e => e.type === 'water').reduce((sum, e) => sum + e.amount, 0),
    urineTotal: todayEntries.filter(e => e.type === 'urine').reduce((sum, e) => sum + e.amount, 0),
    waterCount: todayEntries.filter(e => e.type === 'water').length,
    urineCount: todayEntries.filter(e => e.type === 'urine').length,
  };

  const balance = stats.waterTotal - stats.urineTotal;
  const balanceColor = balance >= 0 ? 'text-green-500' : 'text-red-500';

  // Prepare data for the last 7 days chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString();
    const dayEntries = entries.filter(e => new Date(e.timestamp).toLocaleDateString() === dateStr);
    return {
      name: d.toLocaleDateString(undefined, { weekday: 'short' }),
      water: dayEntries.filter(e => e.type === 'water').reduce((sum, e) => sum + e.amount, 0),
      urine: dayEntries.filter(e => e.type === 'urine').reduce((sum, e) => sum + e.amount, 0),
    };
  });

  return (
    <div className="space-y-6">
      {/* Today's Summary Cards */}
      <section>
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">今日概覽 ({today})</h2>
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            title="今日飲水" 
            value={stats.waterTotal} 
            unit="ml" 
            count={stats.waterCount}
            color="blue" 
            icon={<Droplets size={20} />} 
          />
          <StatCard 
            title="今日排尿" 
            value={stats.urineTotal} 
            unit="ml" 
            count={stats.urineCount}
            color="amber" 
            icon={<Activity size={20} />} 
          />
        </div>

        <div className="mt-4 p-4 bg-white rounded-3xl border border-slate-100 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-50 text-indigo-500 rounded-2xl">
              <Waves size={20} />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">水份平衡</p>
              <p className={`text-xl font-black ${balanceColor}`}>
                {balance > 0 ? '+' : ''}{balance} <span className="text-xs font-medium opacity-70">ml</span>
              </p>
            </div>
          </div>
          <div className="text-right">
             <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-1000" 
                  style={{ width: `${Math.min(100, Math.max(0, (stats.urineTotal / (stats.waterTotal || 1)) * 100))}%` }}
                />
             </div>
             <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">排出率: {stats.waterTotal ? Math.round((stats.urineTotal / stats.waterTotal) * 100) : 0}%</p>
          </div>
        </div>
      </section>

      {/* Weekly Trends Chart */}
      <section className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-6">近七日趨勢</h2>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#94a3b8', fontSize: 10 }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ 
                  borderRadius: '16px', 
                  border: 'none', 
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px'
                }}
              />
              <Legend verticalAlign="top" align="right" iconType="circle" />
              <Bar dataKey="water" name="飲水" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={12} />
              <Bar dataKey="urine" name="排尿" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Hourly distribution concept placeholder */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-[2.5rem] text-white shadow-xl shadow-slate-200">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold">健康小貼士</h3>
            <p className="text-slate-400 text-sm">基於今日數據的建議</p>
          </div>
        </div>
        <p className="text-slate-300 text-sm leading-relaxed italic">
          「{stats.waterTotal < 1500 ? '今日飲水量偏少，建議在睡前補充足夠的水分以維持新陳代謝。' : '今日飲水狀況良好，請繼續保持穩定的攝入頻率。'}」
        </p>
      </section>
    </div>
  );
};

const StatCard: React.FC<{
  title: string;
  value: number;
  unit: string;
  count: number;
  color: 'blue' | 'amber';
  icon: React.ReactNode;
}> = ({ title, value, unit, count, color, icon }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
    <div className={`absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-${color}-500/5 rounded-full group-hover:scale-110 transition-transform`} />
    <div className={`w-10 h-10 flex items-center justify-center rounded-2xl mb-4 bg-${color}-50 text-${color}-600`}>
      {icon}
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</p>
    <div className="flex items-baseline gap-1 mt-1">
      <h4 className="text-2xl font-black text-slate-800">{value}</h4>
      <span className="text-xs font-bold text-slate-400">{unit}</span>
    </div>
    <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase">次數: {count}</p>
  </div>
);

export default Dashboard;
