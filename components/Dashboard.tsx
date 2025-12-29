
import React from 'react';
import { CRMLead, LeadStatus, BusinessOpportunity } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Target, CheckCircle, Users, Activity } from 'lucide-react';

interface DashboardProps {
  leads: CRMLead[];
}

export const Dashboard: React.FC<DashboardProps> = ({ leads }) => {
  const statusCounts = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.values(LeadStatus).map(status => ({
    name: status,
    value: statusCounts[status] || 0
  }));

  const totalValue = leads.reduce((sum, l) => sum + (l.dealAmount || 0), 0);
  const wonValue = leads.filter(l => l.status === LeadStatus.WON).reduce((sum, l) => sum + (l.dealAmount || 0), 0);
  const winRate = leads.length > 0 ? (leads.filter(l => l.status === LeadStatus.WON).length / leads.length) * 100 : 0;

  const COLORS = ['#6366f1', '#f59e0b', '#8b5cf6', '#10b981', '#ef4444'];

  return (
    <div className="space-y-10 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard icon={<Users className="text-blue-400" />} label="Database Size" value={leads.length} />
        <StatCard icon={<TrendingUp className="text-indigo-400" />} label="Pipeline" value={`$${totalValue.toLocaleString()}`} />
        <StatCard icon={<CheckCircle className="text-emerald-400" />} label="Captured" value={`$${wonValue.toLocaleString()}`} />
        <StatCard icon={<Target className="text-pink-400" />} label="Efficiency" value={`${winRate.toFixed(1)}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-[#111116]/60 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] shadow-2xl">
          <h3 className="text-xl font-extrabold text-white mb-8 flex items-center gap-3">
            <Activity size={20} className="text-indigo-400" /> Pipeline Flow
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#64748b', fontWeight: 800 }} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }} 
                  contentStyle={{ backgroundColor: '#111116', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', color: '#fff' }} 
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#111116]/60 backdrop-blur-xl border border-white/5 p-10 rounded-[3rem] shadow-2xl">
          <h3 className="text-xl font-extrabold text-white mb-8">Intelligence Distribution</h3>
          <div className="grid grid-cols-2 gap-6">
            <CircularProgress leads={leads} label="Website Dev" field="website" color="#6366f1" />
            <CircularProgress leads={leads} label="SEO Mastery" field="seo" color="#10b981" />
            <CircularProgress leads={leads} label="Social Reach" field="socialMedia" color="#f59e0b" />
            <CircularProgress leads={leads} label="Brand Gaps" field="graphicDesign" color="#ec4899" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="bg-[#111116]/80 border border-white/5 p-8 rounded-[2rem] flex flex-col items-center text-center space-y-3 shadow-xl hover:border-indigo-500/30 transition-all duration-500">
    <div className="p-4 bg-white/5 rounded-2xl mb-2">{icon}</div>
    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</p>
    <p className="text-3xl font-black text-white tracking-tight">{value}</p>
  </div>
);

const CircularProgress: React.FC<{ leads: CRMLead[]; label: string; field: keyof BusinessOpportunity['needs']; color: string }> = ({ leads, label, field, color }) => {
  const count = leads.filter(l => l.needs[field]).length;
  const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;
  
  return (
    <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="relative z-10 flex flex-col items-center">
        <div className="relative w-16 h-16 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
            <circle cx="32" cy="32" r="28" stroke={color} strokeWidth="6" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * percentage) / 100} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
          </svg>
          <span className="absolute text-[10px] font-black text-white">{percentage.toFixed(0)}%</span>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center">{label}</p>
        <p className="text-[10px] text-slate-600 font-black mt-1 uppercase">{count} GAPS FOUND</p>
      </div>
    </div>
  );
};
