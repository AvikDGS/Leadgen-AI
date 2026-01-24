
import React, { useMemo } from 'react';
import { LeadStatus, BusinessOpportunity, CRMLead } from '../types';
import { X, Filter, MapPin, Zap, BarChart3, RotateCcw } from 'lucide-react';

export interface FilterState {
  minRevenue: number;
  gapIntensity: string;
  leadQuality: string;
  location: string;
  leadStatus?: string;
  businessSize?: string;
}

interface FilterBarProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  allLeads: (BusinessOpportunity | CRMLead)[];
  filteredCount: number;
  showStatusFilter?: boolean;
}

// Fixed: Moved FilterPill outside of the main component and defined proper types.
// This resolves TypeScript errors where the 'key' prop was not recognized in the inline component definition.
interface FilterPillProps {
  active: boolean;
  onClick: () => void;
  label: string;
  icon?: React.ReactNode;
}

const FilterPill: React.FC<FilterPillProps> = ({ active, onClick, label, icon }) => (
  <button
    onClick={onClick}
    className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
      active 
      ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105' 
      : 'bg-white border-gray-100 text-gray-500 hover:border-brand-primary/40 hover:text-brand-primary'
    }`}
  >
    {icon}
    {label}
  </button>
);

export const FilterBar: React.FC<FilterBarProps> = ({ filters, setFilters, allLeads, filteredCount, showStatusFilter }) => {
  const dynamicOptions = useMemo(() => {
    if (allLeads.length === 0) return { locations: [], sizes: [] };
    
    const locations = Array.from(new Set(allLeads.map(l => {
      const parts = l.location.split(',');
      return parts[parts.length - 1].trim(); // Get state or country
    }))).filter(Boolean).sort();

    const sizes = Array.from(new Set(allLeads.map(l => l.businessSize))).filter(Boolean);
    
    return { locations, sizes };
  }, [allLeads]);

  const hasActiveFilters = !!(filters.location || filters.gapIntensity || filters.leadQuality || filters.leadStatus || filters.businessSize || filters.minRevenue > 0);

  const clearFilters = () => {
    setFilters({
      minRevenue: 0,
      gapIntensity: '',
      leadQuality: '',
      location: '',
      leadStatus: '',
      businessSize: ''
    });
  };

  return (
    <div className="w-full space-y-4 py-2">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2 text-gray-900">
          <Filter size={14} className="text-brand-primary" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Refine Intelligence</span>
          <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-md">{filteredCount} Results</span>
        </div>
        {hasActiveFilters && (
          <button 
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-[9px] font-black text-brand-primary uppercase tracking-widest hover:opacity-70 transition-opacity"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-3">
        {/* Locations */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1 mask-fade-right">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 shrink-0">
             <MapPin size={12} className="text-gray-400" />
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Region</span>
          </div>
          {dynamicOptions.locations.map(loc => (
            <FilterPill 
              key={loc}
              label={loc}
              active={filters.location === loc}
              onClick={() => setFilters({...filters, location: filters.location === loc ? '' : loc})}
            />
          ))}
        </div>

        {/* Opportunity Types */}
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 shrink-0">
             <Zap size={12} className="text-gray-400" />
             <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gap</span>
          </div>
          {['High', 'Medium', 'Low'].map(gap => (
            <FilterPill 
              key={gap}
              label={`${gap} Intensity`}
              active={filters.gapIntensity === gap}
              onClick={() => setFilters({...filters, gapIntensity: filters.gapIntensity === gap ? '' : gap})}
            />
          ))}
          <div className="w-px h-6 bg-gray-100 mx-2 shrink-0" />
          {['Boutique', 'Growth', 'Enterprise'].map(size => (
            <FilterPill 
              key={size}
              label={size}
              active={filters.businessSize === size}
              onClick={() => setFilters({...filters, businessSize: filters.businessSize === size ? '' : size})}
            />
          ))}
        </div>

        {/* Status (Optional for CRM) */}
        {showStatusFilter && (
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-1">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100 shrink-0">
               <BarChart3 size={12} className="text-gray-400" />
               <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</span>
            </div>
            {Object.values(LeadStatus).map(status => (
              <FilterPill 
                key={status}
                label={status}
                active={filters.leadStatus === status}
                onClick={() => setFilters({...filters, leadStatus: filters.leadStatus === status ? '' : status})}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
