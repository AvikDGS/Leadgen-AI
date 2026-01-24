
import React from 'react';
import { BusinessOpportunity } from '../types';
import { 
  MapPin, CheckCircle, Zap, Star, Plus, ShieldCheck, Globe, Instagram, Facebook, Linkedin, Map as MapIcon, Search
} from 'lucide-react';

interface LeadCardProps {
  opportunity: BusinessOpportunity;
  onAddToCRM: (opp: BusinessOpportunity) => void;
  isSaved?: boolean;
  onViewDetails: (opp: BusinessOpportunity) => void;
}

export const LeadCard: React.FC<LeadCardProps> = ({ opportunity, onAddToCRM, isSaved, onViewDetails }) => {
  const isWebsiteMissing = !opportunity.website || 
    opportunity.website.toLowerCase().includes('missing') || 
    opportunity.website === '';

  const gapCount = Object.values(opportunity.needs).filter(n => n).length;
  const rating = Math.min(5, 2.8 + (gapCount * 0.45));

  const getSourceIcon = () => {
    switch (opportunity.leadSource) {
      case 'Google Maps': return <MapIcon size={10} />;
      case 'LinkedIn': return <Linkedin size={10} />;
      case 'Instagram': return <Instagram size={10} />;
      case 'Facebook': return <Facebook size={10} />;
      case 'Yelp': return <Search size={10} />;
      default: return <Globe size={10} />;
    }
  };

  const getSourceColor = () => {
    switch (opportunity.leadSource) {
      case 'Google Maps': return 'bg-green-100 text-green-700 border-green-200';
      case 'LinkedIn': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Instagram': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Facebook': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Yelp': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="group relative bg-white rounded-[2.2rem] p-5 shadow-lg border border-gray-100 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full hover:border-brand-primary/20 bg-white/90 glass">
      
      {/* Card Header Visual */}
      <div 
        onClick={() => onViewDetails(opportunity)}
        className="h-40 md:h-52 bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-[1.8rem] mb-5 flex items-center justify-center relative overflow-hidden cursor-pointer"
      >
        <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[80%]">
          <div className="bg-brand-primary text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/30">
            {opportunity.businessSize}
          </div>
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm ${getSourceColor()}`}>
            {getSourceIcon()}
            {opportunity.leadSource}
          </div>
          {isWebsiteMissing && (
             <div className="bg-red-500 text-white px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-red-500/30">
                Gap
             </div>
          )}
        </div>
        
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md text-brand-primary p-2 rounded-xl shadow-sm">
           <ShieldCheck size={16} />
        </div>

        <div className="opacity-10 group-hover:scale-110 transition-transform duration-1000">
           <Zap size={90} className="text-brand-primary fill-brand-primary" />
        </div>
      </div>

      <div className="flex-1 flex flex-col space-y-3">
        <div className="flex items-start justify-between gap-3">
          <h3 
            onClick={() => onViewDetails(opportunity)}
            className="text-lg md:text-xl font-black text-gray-900 leading-tight truncate flex-1 cursor-pointer group-hover:text-brand-primary transition-colors"
          >
            {opportunity.name}
          </h3>
          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-lg">
            <Star size={12} className="text-brand-primary fill-brand-primary" />
            <span className="text-xs font-black text-gray-900">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
          <MapPin size={12} className="text-brand-primary shrink-0" />
          <span className="truncate">{opportunity.location}</span>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed font-medium bg-gray-50/80 p-3 rounded-2xl italic">
          "{opportunity.analysis}"
        </p>

        <div className="mt-auto pt-5 flex items-center justify-between border-t border-gray-100">
          <div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-0.5">Potent. Value</span>
            <span className="text-xl md:text-2xl font-black text-gray-900 tabular-nums tracking-tighter">
              {opportunity.currencySymbol}{opportunity.potentialValue.toLocaleString()}
            </span>
          </div>
          
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCRM(opportunity); }}
            disabled={isSaved}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl md:rounded-[1.4rem] flex items-center justify-center transition-all duration-300 ${
              isSaved 
              ? 'bg-orange-50 text-brand-primary border-2 border-orange-100 shadow-inner' 
              : 'bg-brand-primary text-white shadow-xl shadow-brand-primary/30 hover:bg-orange-600 active:scale-90 hover:rotate-3'
            }`}
          >
            {isSaved ? <CheckCircle size={22} /> : <Plus size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};
