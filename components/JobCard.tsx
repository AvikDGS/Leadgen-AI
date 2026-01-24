
import React from 'react';
import { JobListing } from '../types';
import { Briefcase, Linkedin, Calendar, MapPin, DollarSign, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

interface JobCardProps {
  job: JobListing;
  onSave?: () => void;
  isSaved?: boolean;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onSave, isSaved }) => {
  return (
    <div className="group relative bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <span className="px-3 py-1 bg-orange-50 text-brand-primary border border-orange-100 rounded-full text-[10px] font-black uppercase tracking-widest">
          {job.source}
        </span>
        
        <button 
          onClick={(e) => { e.preventDefault(); onSave?.(); }}
          className={`p-2.5 rounded-2xl transition-all active:scale-90 ${
            isSaved 
            ? 'bg-brand-primary text-white' 
            : 'bg-gray-50 text-gray-300 hover:text-brand-primary'
          }`}
        >
          <Heart size={18} className={isSaved ? 'fill-current' : ''} />
        </button>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <div>
           <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest block mb-1">{job.type}</span>
           <h3 className="text-xl font-black text-gray-900 tracking-tight leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
            {job.title}
          </h3>
        </div>

        <p className="text-sm text-gray-400 font-bold flex items-center gap-2">
           {job.company}
        </p>

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400">
            <MapPin size={12} className="text-brand-primary" /> {job.location}
          </div>
          {job.estimatedBudget && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-500 rounded-xl text-[10px] font-black uppercase tracking-widest">
              <DollarSign size={12} /> {job.estimatedBudget}
            </div>
          )}
        </div>

        <p className="text-xs text-gray-400 leading-relaxed font-medium line-clamp-3 italic bg-gray-50/50 p-4 rounded-2xl">
          "{job.description}"
        </p>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50">
        <a 
          href={job.sourceUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full py-4 bg-brand-primary text-white rounded-2xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-brand-primary/20"
        >
          View Listing
          <ArrowUpRight size={14} />
        </a>
      </div>
    </div>
  );
};
