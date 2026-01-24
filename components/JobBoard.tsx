
import React from 'react';
import { JobListing } from '../types';
import { JobCard } from './JobCard';
import { Briefcase, Info, Package } from 'lucide-react';

interface JobBoardProps {
  jobs: JobListing[];
  onSaveJob?: (job: JobListing) => void;
  isJobSaved?: (job: JobListing) => boolean;
  emptyMessage?: string;
}

export const JobBoard: React.FC<JobBoardProps> = ({ jobs, onSaveJob, isJobSaved, emptyMessage }) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-100 rounded-[3rem] text-center space-y-4 shadow-sm">
        <div className="p-6 bg-gray-50 rounded-full text-gray-200">
           <Package size={48} />
        </div>
        <h3 className="text-xl font-black text-gray-900">{emptyMessage || "No listings found"}</h3>
        <p className="text-gray-400 max-w-xs font-bold italic">Refine your search parameters to find available gigs.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-6 py-4 bg-white border border-gray-100 rounded-[2rem] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">
            {jobs.length} Opportunities Located
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
          <Info size={12} /> High-Intent Data Scan Complete
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {jobs.map((job) => (
          <JobCard 
            key={job.id} 
            job={job} 
            onSave={() => onSaveJob?.(job)}
            isSaved={isJobSaved?.(job)}
          />
        ))}
      </div>
    </div>
  );
};
