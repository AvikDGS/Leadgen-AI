
import React from 'react';
import { DollarSign, Zap, Target, Filter, ChevronDown, Award } from 'lucide-react';

export interface FilterState {
  minRevenue: number;
  gapIntensity: string; // 'High' | 'Medium' | 'Low'
  leadQuality: string; // 'A-Tier' | 'B-Tier' | 'C-Tier'
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resultsCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, resultsCount }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="bg-white/[0.03] border border-white/10 backdrop-blur-xl rounded-[2.5rem] p-6 shadow-2xl relative overflow-hidden group">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-indigo-500/10 blur-[80px] rounded-full group-hover:bg-indigo-500/20 transition-all duration-700"></div>
        
        <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
          <div className="flex items-center gap-3 pr-6 border-r border-white/10 h-10 shrink-0">
            <Filter size={18} className="text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] leading-none">Filter</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{resultsCount} Targets</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 flex-1">
            {/* 1. Necessary: Company Revenue */}
            <FilterSelect 
              icon={<DollarSign size={14} className="text-emerald-400" />}
              label="Company Revenue"
              value={filters.minRevenue}
              options={[
                { label: "Any Revenue", value: 0 },
                { label: "> $100k /yr", value: 100000 },
                { label: "> $500k /yr", value: 500000 },
                { label: "> $1M /yr", value: 1000000 },
                { label: "> $5M /yr", value: 5000000 },
              ]}
              onChange={(v) => setFilters({ ...filters, minRevenue: Number(v) })}
            />

            {/* 2. AI Thinking: Digital Gap Intensity (Urgency) */}
            <FilterSelect 
              icon={<Zap size={14} className="text-amber-400" />}
              label="Gap Intensity"
              value={filters.gapIntensity}
              options={[
                { label: "All Intensities", value: "" },
                { label: "Critical Gaps", value: "High" },
                { label: "Moderate Needs", value: "Medium" },
                { label: "Fine-tuning", value: "Low" },
              ]}
              onChange={(v) => setFilters({ ...filters, gapIntensity: v })}
            />

            {/* 3. AI Thinking: Lead Quality (AI Scoring) */}
            <FilterSelect 
              icon={<Award size={14} className="text-indigo-400" />}
              label="Lead Quality"
              value={filters.leadQuality}
              options={[
                { label: "Any Tier", value: "" },
                { label: "A-Tier (Hot)", value: "A-Tier" },
                { label: "B-Tier (Warm)", value: "B-Tier" },
              ]}
              onChange={(v) => setFilters({ ...filters, leadQuality: v })}
            />
          </div>

          <button 
            onClick={() => setFilters({ minRevenue: 0, gapIntensity: '', leadQuality: '' })}
            className="px-6 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 hover:text-white hover:bg-white/10 transition-all uppercase tracking-widest"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterSelect: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  value: any; 
  options: { label: string; value: any }[]; 
  onChange: (v: any) => void;
}> = ({ icon, label, value, options, onChange }) => {
  return (
    <div className="flex flex-col gap-1.5 group/select">
      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest ml-1">{label}</span>
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 group-hover/select:opacity-100 transition-opacity">
          {icon}
        </div>
        <select 
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-black/40 border border-white/5 rounded-xl pl-9 pr-10 py-2.5 text-xs font-bold text-white outline-none focus:border-indigo-500/50 appearance-none cursor-pointer min-w-[150px] transition-all hover:bg-white/5"
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value} className="bg-[#0a0a0c] text-white">
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
          <ChevronDown size={14} />
        </div>
      </div>
    </div>
  );
};
