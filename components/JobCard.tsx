
import React from 'react';
import { JobListing } from '../types';
import { 
  Briefcase, Linkedin, ExternalLink, Calendar, MapPin, 
  DollarSign, Globe, ArrowUpRight, Zap 
} from 'lucide-react';

interface JobCardProps {
  job: JobListing;
}

export const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const getSourceBadge = (source: JobListing['source']) => {
    switch (source) {
      case 'LinkedIn': return 'bg-blue-600/10 text-blue-400 border-blue-600/20';
      case 'Upwork': return 'bg-emerald-600/10 text-emerald-400 border-emerald-600/20';
      case 'Indeed': return 'bg-indigo-600/10 text-indigo-400 border-indigo-600/20';
      case 'Freelancer': return 'bg-sky-600/10 text-sky-400 border-sky-600/20';
      default: return 'bg-slate-600/10 text-slate-400 border-slate-600/20';
    }
  };

  return (
    <div className="group relative bg-[#111116]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 shadow-2xl transition-all duration-500 overflow-hidden flex flex-col h-full">
      <div className="absolute top-6 right-6 z-20">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getSourceBadge(job.source)} flex items-center gap-1.5`}>
          {job.source === 'LinkedIn' && <Linkedin size={12} />}
          {job.source}
        </span>
      </div>

      <div className="p-8 space-y-6 flex-1">
        <div className="space-y-2">
          <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{job.type}</p>
          <h3 className="text-2xl font-extrabold text-white tracking-tight leading-tight group-hover:text-indigo-400 transition-colors">
            {job.title}
          </h3>
          <p className="text-sm text-slate-400 font-bold flex items-center gap-2">
            <Briefcase size={14} className="text-indigo-400" /> {job.company}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
            <MapPin size={12} className="text-indigo-500" /> {job.location}
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
            <Calendar size={12} className="text-amber-500" /> {job.postedDate}
          </div>
          {job.estimatedBudget && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <DollarSign size={12} /> {job.estimatedBudget}
            </div>
          )}
        </div>

        <div className="bg-[#1a1a24]/50 rounded-[2rem] p-6 border border-white/5 shadow-inner">
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 flex items-center gap-2">
             <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
             Project Intelligence
          </p>
          <p className="text-sm text-slate-300 leading-relaxed font-medium line-clamp-4">
            {job.description}
          </p>
        </div>
      </div>

      <div className="p-8 pt-0 mt-auto">
        <a 
          href={job.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-5 bg-white text-black hover:bg-indigo-600 hover:text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all active:scale-95 group/btn"
        >
          View Gig on {job.source}
          <ArrowUpRight size={16} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
        </a>
      </div>
    </div>
  );
};
