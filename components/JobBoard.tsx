
import React from 'react';
import { JobListing } from '../types';
import { JobCard } from './JobCard';

interface JobBoardProps {
  jobs: JobListing[];
}

export const JobBoard: React.FC<JobBoardProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white/[0.02] border border-white/5 rounded-[3rem] text-center space-y-4">
        <h3 className="text-xl font-bold text-white">No current gigs found</h3>
        <p className="text-slate-500 max-w-sm">Try broadening your search term (e.g., "Web Designer" or "Marketing Freelancer")</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};
