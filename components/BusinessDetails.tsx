
import React from 'react';
import { CRMLead, LeadStatus, BusinessOpportunity } from '../types';
import { 
  X, MapPin, Phone, User, Mail, Globe, Calendar, TrendingUp, Activity, 
  Lightbulb, AlertCircle, Briefcase, ChevronLeft, ExternalLink, Map as MapIcon, PlusCircle, CheckCircle, Search, Sparkles, Zap, Shield, Bookmark, Star, ArrowLeft, Instagram, Facebook, Linkedin
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
  isSaved,
  onAddToCRM 
}) => {
  const isCrmLead = (b: BusinessOpportunity | CRMLead): b is CRMLead => 'status' in b;

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-6 overflow-hidden animate-in fade-in duration-300">
      <div className="bg-white w-full h-[95vh] sm:h-auto sm:max-w-4xl sm:max-h-[90vh] rounded-t-[2.5rem] sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative animate-in slide-in-from-bottom-full duration-500">
        
        {/* Header Visual */}
        <div className="h-48 md:h-80 bg-orange-50 shrink-0 relative flex items-center justify-center overflow-hidden">
          <div className="absolute top-4 left-4 flex gap-2">
             <button onClick={onClose} className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-gray-900 active:scale-95"><ArrowLeft size={20} /></button>
          </div>
          <div className="absolute top-4 right-4">
             <button className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-gray-900 active:scale-95"><Bookmark size={20} /></button>
          </div>
          <Zap size={100} className="text-brand-primary opacity-20" />
        </div>

        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 md:space-y-8 bg-white -mt-8 rounded-t-[2.5rem] relative z-10">
          <div className="flex flex-col md:flex-row md:justify-between items-start gap-3">
             <div className="min-w-0 w-full">
                <div className="flex items-center gap-2 mb-2">
                   <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-orange-200">
                      {business.businessSize}
                   </div>
                   <div className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-gray-200 flex items-center gap-1.5">
                     <Search size={10} />
                     {business.leadSource}
                   </div>
                   <div className="flex items-center gap-1 text-[10px] md:text-xs font-black text-gray-700 ml-auto">
                     <Star size={10} className="text-brand-primary fill-brand-primary" />
                     <span>4.9</span>
                   </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight leading-tight truncate">{business.name}</h3>
                <p className="text-xs md:text-sm text-gray-600 font-bold flex items-center gap-1.5 mt-1"><MapPin size={14} className="text-brand-primary" /> {business.location}</p>
             </div>
             <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-2 border-t md:border-none border-gray-100">
                <span className="text-[8px] md:text-[10px] font-black text-gray-500 uppercase tracking-widest block md:mb-1">Potent. Opportunity</span>
                <p className="text-2xl md:text-3xl font-black text-gray-900 tabular-nums">{business.currencySymbol}{business.potentialValue.toLocaleString()}</p>
             </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-base md:text-lg font-black text-gray-900">Analysis</h4>
            <p className="text-xs md:text-sm text-gray-600 leading-relaxed font-bold italic">"{business.analysis}"</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-3">
               <h4 className="text-base md:text-lg font-black text-gray-900">Information</h4>
               <div className="grid grid-cols-1 gap-2 md:gap-3">
                  <DetailItem icon={<Phone size={14} />} label="Phone" value={business.phone || 'N/A'} />
                  <DetailItem icon={<Globe size={14} />} label="Web" value={business.website} href={business.website} />
                  <div className="flex gap-2 pt-2">
                    {business.socialLinks?.linkedin && <SocialLink icon={<Linkedin size={16} />} href={business.socialLinks.linkedin} color="hover:text-blue-600" />}
                    {business.socialLinks?.instagram && <SocialLink icon={<Instagram size={16} />} href={business.socialLinks.instagram} color="hover:text-pink-600" />}
                    {business.socialLinks?.facebook && <SocialLink icon={<Facebook size={16} />} href={business.socialLinks.facebook} color="hover:text-indigo-600" />}
                    {business.socialLinks?.yelp && <SocialLink icon={<Search size={16} />} href={business.socialLinks.yelp} color="hover:text-red-600" />}
                  </div>
               </div>
            </div>
            
            <div className="space-y-3">
               <h4 className="text-base md:text-lg font-black text-gray-900">Identified Gaps</h4>
               <div className="flex flex-wrap gap-2">
                  {Object.entries(business.needs).map(([key, val]) => (
                    <div key={key} className={`px-3 py-2 rounded-xl border text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${val ? 'bg-orange-50 text-orange-700 border-orange-200' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                      {val ? <Zap size={10} className="fill-current" /> : <CheckCircle size={10} />}
                      <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-8 border-t border-gray-50 bg-white flex gap-3 md:gap-4 shrink-0">
          <button 
             onClick={onClose}
             className="px-6 py-4 md:py-5 bg-gray-100 text-gray-700 rounded-2xl md:rounded-3xl text-xs font-black uppercase tracking-widest active:scale-95"
          >
            Back
          </button>
          
          {isCrmLead(business) ? (
            <button 
               onClick={() => onDelete(business.id)}
               className="flex-1 py-4 md:py-5 bg-red-50 text-red-600 rounded-2xl md:rounded-3xl text-xs font-black uppercase tracking-widest active:scale-95 border border-red-100"
            >
              Delete
            </button>
          ) : (
            <button 
               onClick={() => onAddToCRM(business)}
               disabled={isSaved}
               className={`flex-1 py-4 md:py-5 rounded-2xl md:rounded-3xl text-xs font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isSaved ? 'bg-orange-100 text-orange-700' : 'bg-brand-primary text-white shadow-brand-primary/20 hover:bg-orange-600'}`}
            >
              {isSaved ? 'Lead Saved' : 'Add to Pipe'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const SocialLink: React.FC<{ icon: React.ReactNode; href: string; color: string }> = ({ icon, href, color }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={`p-2.5 bg-gray-50 rounded-xl border border-gray-100 text-gray-400 transition-colors ${color} shadow-sm active:scale-90`}>
    {icon}
  </a>
);

const DetailItem: React.FC<{ icon: React.ReactNode; label: string; value?: string; href?: string }> = ({ icon, label, value, href }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
    <div className="text-brand-primary bg-white p-2 rounded-lg shadow-sm">{icon}</div>
    <div className="min-w-0">
      <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest block leading-none mb-0.5">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="text-[10px] font-bold text-gray-900 truncate block hover:text-brand-primary transition-colors">{value || 'N/A'}</a>
      ) : (
        <span className="text-[10px] font-bold text-gray-900 truncate block">{value || 'N/A'}</span>
      )}
    </div>
  </div>
);
