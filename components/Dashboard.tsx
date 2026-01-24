
import React from 'react';
import { CRMLead, LeadStatus } from '../types';
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
  
  const COLORS = ['#f9a825', '#ffcc80', '#2d2d2d', '#4caf50', '#f44336'];

  return (
    <div className="space-y-8 mt-12 md:mt-0 pb-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Total Leads" value={leads.length} />
        <StatCard label="Pipeline Value" value={`$${(totalValue / 1000).toFixed(1)}k`} />
        <StatCard label="Closed Deals" value={`$${(wonValue / 1000).toFixed(1)}k`} />
        <StatCard label="Success Rate" value={`${leads.length > 0 ? (leads.filter(l => l.status === LeadStatus.WON).length / leads.length * 100).toFixed(0) : 0}%`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-8">Pipeline Stages</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9e9e9e', fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9e9e9e', fontWeight: 700 }} />
                <Tooltip cursor={{ fill: '#fafafa' }} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }} />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center justify-center space-y-6">
           <div className="w-40 h-40 rounded-full border-[12px] border-orange-50 flex flex-col items-center justify-center relative">
              <div className="absolute inset-0 border-[12px] border-brand-primary rounded-full" style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', transform: 'rotate(45deg)' }}></div>
              <span className="text-3xl font-black text-gray-900">75%</span>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Goal</span>
           </div>
           <p className="text-center text-sm font-bold text-gray-500">You are on track to hitting your monthly growth targets.</p>
           <button className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold text-xs shadow-lg shadow-brand-primary/20">Review Plan</button>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div className="bg-white p-6 rounded-[2rem] border border-gray-100 text-center space-y-1 shadow-sm">
    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest block">{label}</span>
    <p className="text-2xl font-black text-gray-900 truncate">{value}</p>
  </div>
);
