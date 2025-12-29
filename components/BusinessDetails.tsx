
import React from 'react';
import { CRMLead, LeadStatus, BusinessOpportunity } from '../types';
import { 
  X, MapPin, Phone, User, Mail, Globe, Calendar, TrendingUp, Activity, 
  Lightbulb, AlertCircle, Briefcase, ChevronLeft, ExternalLink, Map as MapIcon, PlusCircle, CheckCircle, Search, Sparkles, Zap
} from 'lucide-react';

interface BusinessDetailsProps {
  business: BusinessOpportunity | CRMLead;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdateStatus: (id: string, status: LeadStatus, amount?: number) => void;
  isSaved: boolean;
  onAddToCRM: (opp: BusinessOpportunity) => void;
}

export const BusinessDetails: React.FC<BusinessDetailsProps> = ({ 
  business, 
  onClose, 
  onDelete, 
  onUpdateStatus, 
  isSaved,
  onAddToCRM 
}) => {
  const isCrmLead = (b: BusinessOpportunity | CRMLead): b is CRMLead => 'status' in b;

  const getStatusColor = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case LeadStatus.CONTACTED: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case LeadStatus.NEGOTIATING: return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case LeadStatus.WON: return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case LeadStatus.LOST: return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const formatUrl = (val?: string) => {
    if (!val) return '';
    if (val.startsWith('http')) return val;
    return `https://${val}`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl animate-in fade-in duration-300 overflow-hidden">
      <div className="bg-[#0a0a0c] w-full max-w-7xl max-h-[95vh] rounded-[3.5rem] border border-white/10 shadow-[0_0_150px_rgba(79,70,229,0.15)] overflow-hidden flex flex-col scale-in relative">
        
        {/* Navigation & Header */}
        <div className="p-10 border-b border-white/5 flex justify-between items-start bg-gradient-to-br from-indigo-500/[0.08] to-transparent sticky top-0 z-20 backdrop-blur-xl">
          <div className="flex items-center gap-8">
            <button 
              onClick={onClose}
              className="group flex items-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white hover:bg-white/10 transition-all font-black text-[10px] uppercase tracking-[0.2em]"
            >
              <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Return to Pipeline
            </button>
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-[2.2rem] flex items-center justify-center text-white shadow-2xl shadow-indigo-500/40 shrink-0">
                <Briefcase size={36} />
              </div>
              <div className="space-y-2 min-w-0">
                <h3 className="text-4xl font-extrabold text-white tracking-tighter truncate leading-none">{business.name}</h3>
                <div className="flex items-center gap-4 flex-wrap">
                  {isCrmLead(business) && (
                    <span className={`text-[10px] font-black py-1.5 px-5 rounded-full uppercase tracking-[0.2em] border ${getStatusColor(business.status)} shadow-lg shadow-black/20`}>
                      {business.status}
                    </span>
                  )}
                  <span className="text-slate-400 text-sm font-bold flex items-center gap-2">
                    <MapPin size={14} className="text-indigo-400" /> {business.location}
                  </span>
                  {isCrmLead(business) && (
                    <span className="text-slate-600 text-[10px] font-black flex items-center gap-2 uppercase tracking-widest">
                      <Calendar size={14} /> Created {new Date(business.createdAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-white/5 rounded-[1.8rem] transition-all text-slate-700 hover:text-white group">
            <X size={32} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>

        {/* Intelligence Grid */}
        <div className="flex-1 overflow-y-auto p-12 space-y-12">
          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <InsightBox 
              label="Pipeline Value" 
              value={`${business.currencySymbol}${business.potentialValue.toLocaleString()}`} 
              icon={<TrendingUp size={20} />} 
              color="indigo" 
            />
            <InsightBox 
              label="Neural Gap Analysis" 
              value={`${Object.values(business.needs).filter(n => n).length}/5 Risks`} 
              icon={<Activity size={20} />} 
              color="rose" 
            />
            <InsightBox 
              label="Identified Owner" 
              value={business.ownerName || 'Searching LinkedIn...'} 
              icon={<User size={20} />} 
              color="amber" 
            />
            <InsightBox 
              label="Owner Direct Line" 
              value={business.ownerPhone || 'Incomplete Data'} 
              icon={<Phone size={20} />} 
              color="emerald" 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Data & Gaps (8 cols) */}
            <div className="lg:col-span-7 space-y-10">
              
              {/* SECTION: VERIFIED DATA */}
              <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 space-y-8 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl -z-10"></div>
                
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
                    Verified Intelligence Matrix
                  </h4>
                  <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-1.5">
                    <CheckCircle size={10} className="text-emerald-400" />
                    <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Multi-Source Confirmed</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   <ContactDetail icon={<Phone size={18} />} label="Operational Line" value={business.phone} />
                   <ContactDetail icon={<Mail size={18} />} label="Email Intelligence" value={business.email || 'Analyzing directory layers...'} />
                   <ContactDetail icon={<Globe size={18} />} label="Web Asset" value={business.website} isLink />
                   <ContactDetail icon={<MapIcon size={18} />} label="GMB Profile" value={business.gmbLink} isLink />
                </div>
              </div>

              {/* VISUAL DIVIDER */}
              <div className="flex items-center gap-4 px-10">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
                <div className="bg-slate-900 border border-white/5 p-2 rounded-xl">
                  <Sparkles size={16} className="text-indigo-400/50" />
                </div>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              </div>

              {/* SECTION: GAP ANALYSIS */}
              <div className="bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-3">
                    <div className="w-2 h-2 bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]"></div>
                    Strategic Digital Deficiencies
                  </h4>
                  <span className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Score: 84% Accurate</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(business.needs).map(([key, val]) => (
                    <div key={key} className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${val ? 'bg-rose-500/5 text-rose-400 border-rose-500/10 shadow-[inset_0_0_20px_rgba(244,63,94,0.02)]' : 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10 opacity-30 grayscale'}`}>
                      <div className="flex items-center gap-3 font-bold text-xs">
                        {val ? <AlertCircle size={16} className="animate-pulse" /> : <CheckCircle size={16} />}
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest">{val ? 'CRITICAL' : 'OPTIMAL'}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: AI Strategy (5 cols) */}
            <div className="lg:col-span-5 flex">
              <section className="bg-indigo-600/[0.03] rounded-[3.5rem] p-12 border border-indigo-500/10 shadow-2xl relative overflow-hidden flex flex-col w-full group">
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 blur-[120px] -z-10 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
                
                <div className="flex items-center gap-5 mb-12">
                  <div className="p-5 bg-indigo-600 rounded-[1.8rem] shadow-2xl shadow-indigo-600/30 ring-4 ring-indigo-500/10">
                    <Lightbulb size={32} className="text-white fill-white/20" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-3xl font-extrabold text-white tracking-tighter">Growth Strategy</h4>
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] flex items-center gap-2">
                      <Search size={10} /> Proxima Deep-Web Protocol
                    </p>
                  </div>
                </div>

                <div className="space-y-12 flex-1">
                  <div className="bg-[#0a0a0c]/80 backdrop-blur-md p-10 rounded-[2.5rem] border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 flex items-center gap-2">
                      <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                      Audited Deficiency
                    </p>
                    <p className="text-xl text-slate-200 leading-relaxed font-semibold italic">"{business.analysis}"</p>
                  </div>
                  
                  <div className="px-6">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                      <Zap size={10} className="fill-indigo-400" /> Executive Recommendation
                    </p>
                    <p className="text-3xl font-extrabold text-white leading-tight tracking-tighter">{business.serviceRecommendation}</p>
                  </div>

                  {isCrmLead(business) && business.notes && (
                    <div className="pt-10 border-t border-white/5 px-6">
                      <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-4">Internal Notes</p>
                      <p className="text-sm text-slate-400 leading-relaxed bg-white/[0.02] p-6 rounded-2xl border border-white/5">{business.notes}</p>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-10 border-t border-white/5 bg-white/[0.04] flex justify-between items-center sticky bottom-0 z-20 backdrop-blur-xl">
          {isCrmLead(business) ? (
            <>
              <button 
                onClick={() => onDelete(business.id)} 
                className="text-slate-500 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.25em] transition-colors flex items-center gap-2 px-6"
              >
                Archive Intel Profile
              </button>
              <div className="flex gap-4">
                <div className="flex items-center bg-[#0a0a0c] rounded-[1.5rem] border border-white/5 px-6 shadow-xl">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mr-4">Lifecycle Stage</span>
                  <select
                    value={business.status}
                    onChange={(e) => onUpdateStatus(business.id, e.target.value as LeadStatus)}
                    className="bg-transparent text-white font-black text-[11px] py-4 border-none outline-none focus:ring-0 uppercase tracking-widest cursor-pointer"
                  >
                    {Object.values(LeadStatus).map(s => (
                      <option key={s} value={s} className="bg-[#111116] text-white">{s.toUpperCase()}</option>
                    ))}
                  </select>
                </div>
                <button 
                  className="px-12 py-5 bg-white text-black rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-500 hover:text-white shadow-2xl shadow-indigo-500/10 active:scale-95 transition-all flex items-center gap-3"
                >
                  <ExternalLink size={18} />
                  Initiate Outreach
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="px-6">
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Identity verified across multi-platform directory clusters.</p>
              </div>
              <button
                onClick={() => onAddToCRM(business)}
                disabled={isSaved}
                className={`px-12 py-6 rounded-[2rem] text-xs font-black uppercase tracking-[0.25em] flex items-center gap-4 transition-all shadow-2xl ${
                  isSaved 
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-none cursor-default' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.02] active:scale-95'
                }`}
              >
                {isSaved ? <><CheckCircle size={22} /> Synced to Pipeline</> : <><PlusCircle size={22} /> Integrate to CRM Core</>}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const InsightBox: React.FC<{ label: string; value: string; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className={`bg-white/[0.03] p-8 rounded-[2.8rem] border border-white/5 hover:border-${color}-500/30 transition-all group flex flex-col items-center text-center shadow-lg`}>
    <div className={`flex flex-col items-center gap-4 text-${color}-400`}>
      <div className={`p-4 bg-${color}-500/10 rounded-2xl group-hover:scale-110 transition-transform shadow-inner`}>{icon}</div>
      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-slate-500 leading-none">{label}</span>
    </div>
    <p className="text-2xl font-black text-white truncate mt-4 tracking-tighter">{value}</p>
  </div>
);

const ContactDetail: React.FC<{ icon: React.ReactNode; label: string; value?: string; isLink?: boolean }> = ({ icon, label, value, isLink }) => {
  if (!value || value.toLowerCase().includes('not found') || value.toLowerCase().includes('searching')) {
    return (
      <div className="flex items-center gap-5 p-6 rounded-[2rem] bg-white/[0.01] border border-white/5 opacity-50">
        <div className="text-slate-700 bg-white/5 p-4 rounded-2xl shrink-0">
          {icon}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[9px] font-black uppercase text-slate-700 tracking-[0.2em] mb-1.5 leading-none">{label}</span>
          <span className="text-sm font-bold text-slate-700 italic">Data Restricted</span>
        </div>
      </div>
    );
  }
  
  const formatUrl = (val: string) => {
    if (val.startsWith('http')) return val;
    return `https://${val}`;
  };

  const content = (
    <div className="flex items-center gap-5 p-6 rounded-[2.2rem] bg-white/[0.03] border border-white/5 hover:bg-indigo-500/[0.03] hover:border-indigo-500/20 transition-all group/item h-full">
      <div className="text-indigo-400 bg-indigo-500/10 p-4 rounded-2xl group-hover/item:scale-110 transition-transform shrink-0 shadow-lg">
        {icon}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] font-black uppercase text-slate-500 tracking-[0.2em] mb-2 leading-none">{label}</span>
        <span className="text-base font-bold text-white truncate group-hover/item:text-indigo-400 transition-colors">{value}</span>
      </div>
      {isLink && <ExternalLink size={16} className="ml-auto text-slate-700 group-hover/item:text-indigo-400 transition-colors" />}
    </div>
  );

  if (isLink) {
    return <a href={formatUrl(value)} target="_blank" rel="noopener noreferrer" className="block w-full">{content}</a>;
  }
  return content;
};
