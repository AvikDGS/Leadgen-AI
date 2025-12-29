
import React from 'react';
import { BusinessOpportunity } from '../types';
import { 
  MapPin, Phone, Globe, User, AlertCircle, PlusCircle, ArrowRight, 
  Map as MapIcon, ShieldCheck, CheckCircle, UserCheck, Search, 
  GlobeLock, Mail, BadgeCheck, Zap, Briefcase, Linkedin, Star 
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
    opportunity.website.toLowerCase().includes('not found') ||
    opportunity.website === '';

  const isEmailMissing = !opportunity.email || 
    opportunity.email.toLowerCase().includes('not found') || 
    opportunity.email.toLowerCase().includes('missing');

  return (
    <div className="group relative bg-[#111116]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 hover:border-indigo-500/30 shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1 flex flex-col h-full">
      {/* Verification Badge */}
      <div className="absolute top-6 right-6 z-20 flex gap-2">
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 backdrop-blur-md">
          <BadgeCheck size={12} />
          Multi-Platform Verified
        </div>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="p-8 relative z-10 space-y-6 flex-1">
        <div className="flex justify-between items-start">
          <div className="space-y-2 pr-4 min-w-0">
            <h3 
              onClick={() => onViewDetails(opportunity)}
              className="text-2xl font-extrabold text-white tracking-tight leading-tight cursor-pointer hover:text-indigo-400 transition-colors truncate block"
              title={opportunity.name}
            >
              {opportunity.name}
            </h3>
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500 font-semibold flex items-center gap-2 truncate">
                <MapPin size={16} className="text-indigo-400 shrink-0" /> {opportunity.location}
              </p>
              <div className="flex gap-1">
                <Linkedin size={12} className="text-slate-600" />
                <Star size={12} className="text-slate-600" />
                <Briefcase size={12} className="text-slate-600" />
              </div>
            </div>
          </div>
        </div>

        {/* DECISION MAKER HIGHLIGHT SECTION */}
        <div className="bg-[#1a1a24]/50 rounded-[2.5rem] p-6 border border-white/5 shadow-[inset_0_0_40px_rgba(0,0,0,0.2)]">
          <div className="flex items-center gap-4 mb-5">
             <div className="p-3.5 bg-indigo-500/20 rounded-[1.2rem] text-indigo-400 shadow-xl shadow-indigo-500/10">
               <UserCheck size={26} />
             </div>
             <div className="min-w-0">
               <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em] mb-1 flex items-center gap-2">
                 Executive Identity <Linkedin size={10} className="text-indigo-500" />
               </p>
               <h4 className="text-white font-bold text-xl leading-tight truncate">
                 {opportunity.ownerName && opportunity.ownerName !== 'Not Found' ? opportunity.ownerName : 'Extracting Identity...'}
               </h4>
             </div>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-2xl border border-white/5 group/line">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover/line:bg-indigo-500/20 transition-colors">
                  <Phone size={14} />
                </div>
                <span className="text-xs font-bold text-slate-400">Owner Direct:</span>
              </div>
              <span className="text-xs font-black text-white">
                {opportunity.ownerPhone && opportunity.ownerPhone !== 'Not Found' ? opportunity.ownerPhone : 'Securing Number...'}
              </span>
            </div>

            <div className={`flex items-center justify-between p-4 rounded-2xl border ${isWebsiteMissing ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'} transition-all`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${isWebsiteMissing ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                  {isWebsiteMissing ? <GlobeLock size={14} /> : <Globe size={14} />}
                </div>
                <span className={`text-xs font-bold ${isWebsiteMissing ? 'text-red-300' : 'text-emerald-300'}`}>Deep-Web Domain:</span>
              </div>
              <span className={`text-xs font-black ${isWebsiteMissing ? 'text-red-400' : 'text-emerald-400 underline underline-offset-4'}`}>
                {isWebsiteMissing ? 'DOMAIN NOT FOUND' : (
                   <a href={opportunity.website?.startsWith('http') ? opportunity.website : `https://${opportunity.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                      Verify Link <ArrowRight size={10} />
                   </a>
                )}
              </span>
            </div>

            {!isEmailMissing && (
              <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
                    <Mail size={14} />
                  </div>
                  <span className="text-xs font-bold text-emerald-300">Verified Email:</span>
                </div>
                <span className="text-xs font-black text-white truncate max-w-[150px]" title={opportunity.email}>
                  {opportunity.email}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm font-medium">
          <ContactItem icon={<Star size={16} />} label="Yelp / Directories" value="Audit Complete" />
          <ContactItem icon={<Briefcase size={16} />} label="Hiring Data" value="Checked" />
          <div className="flex items-center gap-3 text-emerald-400 bg-emerald-500/5 px-4 py-3 rounded-2xl border border-emerald-500/10">
            <ShieldCheck size={18} />
            <span className="text-[10px] font-black uppercase tracking-widest">Directory Verified</span>
          </div>
          <div className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-4 py-3 rounded-2xl text-[10px] font-black flex items-center justify-center shadow-inner shrink-0 uppercase tracking-widest">
            {opportunity.currencySymbol}{opportunity.potentialValue.toLocaleString()} VALUE
          </div>
        </div>

        <div className="space-y-3 bg-white/5 p-6 rounded-[2rem] border border-white/5 cursor-pointer hover:bg-white/[0.08] transition-all" onClick={() => onViewDetails(opportunity)}>
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Cross-Platform Insight</h4>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed font-medium line-clamp-2">
            "{opportunity.analysis}"
          </p>
        </div>
      </div>

      <div className="p-8 pt-0 relative z-10 flex justify-between items-center bg-gradient-to-t from-[#0a0a0c]/80 to-transparent">
        <div className="flex-1 pr-4">
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-1">Strategic Pitch</span>
          <p className="text-xs text-slate-400 font-bold leading-snug truncate">{opportunity.serviceRecommendation}</p>
        </div>
        <button
          onClick={() => onAddToCRM(opportunity)}
          disabled={isSaved}
          className={`px-8 py-4 rounded-[1.5rem] text-sm font-black flex items-center gap-2 transition-all shadow-xl group/btn shrink-0 ${
            isSaved 
            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default' 
            : 'bg-white text-black hover:bg-indigo-500 hover:text-white active:scale-95'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle size={18} />
              <span>Saved</span>
            </>
          ) : (
            <>
              <PlusCircle size={18} />
              <span>Pipeline</span>
              <ArrowRight size={14} className="opacity-0 group-hover/btn:opacity-100 transition-opacity translate-x-1" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const ContactItem: React.FC<{ icon: React.ReactNode; label?: string; value?: string; isLink?: boolean }> = ({ icon, label, value, isLink }) => {
  if (!value || value.toLowerCase().includes('not found') || value.toLowerCase().includes('missing')) return null;
  
  const formatUrl = (val: string) => {
    let clean = val.trim();
    if (clean.startsWith('http://') || clean.startsWith('https://')) return clean;
    return `https://${clean}`;
  };

  const content = (
    <div className="flex items-center gap-3 text-slate-400 hover:text-slate-200 transition-colors group/item p-3 bg-white/5 rounded-2xl border border-white/5 h-full">
      <div className="p-2 bg-white/5 rounded-xl text-indigo-400 shrink-0 group-hover/item:bg-indigo-500/20 transition-colors">{icon}</div>
      <div className="min-w-0 flex flex-col">
        {label && <span className="text-[8px] font-black uppercase text-slate-600 tracking-tighter leading-none mb-1">{label}</span>}
        <span className="truncate text-xs font-bold">{value}</span>
      </div>
    </div>
  );

  if (isLink) {
    return <a href={formatUrl(value)} target="_blank" rel="noopener noreferrer" className="block min-w-0">{content}</a>;
  }
  return content;
};
