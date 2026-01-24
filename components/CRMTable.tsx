
import React, { useState } from 'react';
import { CRMLead, LeadStatus } from '../types';
import { Trash2, ExternalLink, CheckSquare, Square, FileSpreadsheet, ChevronDown, Check, Circle, Clock, MessageSquare, Trophy, XCircle, MoreVertical, Download, ShoppingBag, Target, Map as MapIcon, Linkedin, Instagram, Facebook, Globe, Search } from 'lucide-react';

interface CRMTableProps {
  leads: CRMLead[];
  onUpdateStatus: (id: string, status: LeadStatus) => void;
  onDelete: (id: string) => void;
  onViewDetails: (lead: CRMLead) => void;
}

export const CRMTable: React.FC<CRMTableProps> = ({ leads, onUpdateStatus, onDelete, onViewDetails }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.size === leads.length ? new Set() : new Set(leads.map(l => l.id)));
  };

  const toggleSelectLead = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  const handleExport = () => {
    const selectedLeads = leads.filter(l => selectedIds.has(l.id));
    if (selectedLeads.length === 0) return;

    const headers = [
      'Name', 
      'Location', 
      'Source',
      'Status', 
      'Potential Revenue', 
      'Phone', 
      'Email', 
      'Owner Name', 
      'Website', 
      'Website Needed', 
      'SEO Needed', 
      'Social Media Needed', 
      'Graphic Design Needed', 
      'GMB Issues Detected',
      'Strategic Audit (Analysis)',
      'Service Recommendation'
    ];

    const rows = selectedLeads.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.location.replace(/"/g, '""')}"`,
      l.leadSource,
      l.status,
      l.dealAmount || 0,
      l.phone || '',
      l.email || '',
      `"${(l.ownerName || '').replace(/"/g, '""')}"`,
      l.website || '',
      l.needs.website ? 'Yes' : 'No',
      l.needs.seo ? 'Yes' : 'No',
      l.needs.socialMedia ? 'Yes' : 'No',
      l.needs.graphicDesign ? 'Yes' : 'No',
      l.needs.gmbIssues ? 'Yes' : 'No',
      `"${l.analysis.replace(/"/g, '""')}"`,
      `"${l.serviceRecommendation.replace(/"/g, '""')}"`
    ].join(','));

    const csvString = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `pipelinex_ai_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Google Maps': return <MapIcon size={14} className="text-green-600" />;
      case 'LinkedIn': return <Linkedin size={14} className="text-blue-600" />;
      case 'Instagram': return <Instagram size={14} className="text-pink-600" />;
      case 'Facebook': return <Facebook size={14} className="text-indigo-600" />;
      case 'Yelp': return <Search size={14} className="text-red-600" />;
      default: return <Globe size={14} className="text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-primary">
            <Target size={20} />
            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Saved Targets</h2>
          </div>
          <p className="text-gray-700 text-xs font-bold uppercase tracking-widest">Active Pipeline: {leads.length} Verified Entities</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedIds.size > 0 && (
            <button 
              onClick={handleExport}
              className="flex-1 md:flex-none px-6 py-4 bg-brand-primary text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-brand-primary/20 active:scale-95"
            >
              <Download size={16} />
              Export Dossiers ({selectedIds.size})
            </button>
          )}
          <button 
            onClick={toggleSelectAll} 
            className="flex-1 md:flex-none px-6 py-4 bg-gray-100 text-gray-700 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-gray-200 hover:bg-gray-200 transition-all active:scale-95"
          >
            {selectedIds.size === leads.length && leads.length > 0 ? 'Clear Selection' : 'Select All Leads'}
          </button>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden space-y-4">
        {leads.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
               <ShoppingBag size={24} />
             </div>
            <p className="text-gray-700 font-black uppercase text-xs tracking-widest">Pipeline Empty</p>
            <p className="text-gray-500 text-[10px] mt-2">Scout new leads to begin tracking</p>
          </div>
        ) : leads.map(lead => (
          <div key={lead.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-start">
              <div onClick={() => onViewDetails(lead)} className="cursor-pointer min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1">
                   {getSourceIcon(lead.leadSource)}
                   <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{lead.leadSource}</span>
                </div>
                <h3 className="text-xl font-black text-gray-900 truncate">{lead.name}</h3>
                <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-0.5 truncate">{lead.location}</p>
              </div>
              <button onClick={() => toggleSelectLead(lead.id)} className={`shrink-0 transition-colors ${selectedIds.has(lead.id) ? 'text-brand-primary' : 'text-gray-300'}`}>
                {selectedIds.has(lead.id) ? <CheckSquare size={24} /> : <Square size={24} />}
              </button>
            </div>
            <div className="flex items-center justify-between gap-4 pt-4 border-t border-gray-50">
              <StatusBadge status={lead.status} onClick={() => {
                const statuses = Object.values(LeadStatus);
                const nextIdx = (statuses.indexOf(lead.status) + 1) % statuses.length;
                onUpdateStatus(lead.id, statuses[nextIdx]);
              }} />
              <div className="flex items-center gap-3">
                 <span className="text-base font-black text-gray-900">{lead.currencySymbol}{lead.dealAmount?.toLocaleString()}</span>
                 <button onClick={() => onDelete(lead.id)} className="p-2 text-gray-400 hover:text-red-600 transition-colors"><Trash2 size={20} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View */}
      <div className="hidden md:block bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden shadow-sm">
        {leads.length === 0 ? (
           <div className="text-center py-32">
             <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
               <ShoppingBag size={32} />
             </div>
             <p className="text-gray-700 font-black uppercase text-sm tracking-[0.3em]">Your pipeline is currently empty</p>
             <p className="text-gray-500 font-bold text-sm mt-4 italic">Start scouting to identify growth-ready business entities.</p>
           </div>
        ) : (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-700 text-[10px] font-black uppercase tracking-[0.2em]">
              <tr>
                <th className="px-8 py-6 w-20 text-center">
                   <button onClick={toggleSelectAll}>
                      {selectedIds.size === leads.length ? <CheckSquare size={20} className="text-brand-primary" /> : <Square size={20} className="text-gray-400" />}
                   </button>
                </th>
                <th className="px-6 py-6">Entity</th>
                <th className="px-6 py-6">Source</th>
                <th className="px-6 py-6">Status</th>
                <th className="px-6 py-6">Value</th>
                <th className="px-6 py-6 text-right pr-12">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {leads.map(lead => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-8 py-7 text-center">
                    <button onClick={() => toggleSelectLead(lead.id)}>
                      {selectedIds.has(lead.id) ? <CheckSquare size={20} className="text-brand-primary" /> : <Square size={20} className="text-gray-300" />}
                    </button>
                  </td>
                  <td className="px-6 py-7">
                    <span onClick={() => onViewDetails(lead)} className="font-black text-gray-900 cursor-pointer hover:text-brand-primary transition-colors block text-base">{lead.name}</span>
                    <p className="text-[10px] text-gray-600 font-bold mt-1 uppercase tracking-widest">{lead.location}</p>
                  </td>
                  <td className="px-6 py-7">
                    <div className="flex items-center gap-2">
                       {getSourceIcon(lead.leadSource)}
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{lead.leadSource}</span>
                    </div>
                  </td>
                  <td className="px-6 py-7">
                    <StatusBadge status={lead.status} onClick={() => {
                       const statuses = Object.values(LeadStatus);
                       const nextIdx = (statuses.indexOf(lead.status) + 1) % statuses.length;
                       onUpdateStatus(lead.id, statuses[nextIdx]);
                    }} />
                  </td>
                  <td className="px-6 py-7 font-black text-gray-900 tabular-nums text-base">{lead.currencySymbol}{lead.dealAmount?.toLocaleString()}</td>
                  <td className="px-6 py-7 text-right pr-12">
                    <button onClick={() => onDelete(lead.id)} className="text-gray-300 hover:text-red-600 transition-colors p-3 rounded-xl hover:bg-red-50">
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

const StatusBadge = ({ status, onClick }: { status: LeadStatus, onClick?: () => void }) => {
  const configs = {
    [LeadStatus.NEW]: { color: 'text-blue-700', bg: 'bg-blue-100/50', border: 'border-blue-200' },
    [LeadStatus.CONTACTED]: { color: 'text-amber-700', bg: 'bg-amber-100/50', border: 'border-amber-200' },
    [LeadStatus.NEGOTIATING]: { color: 'text-purple-700', bg: 'bg-purple-100/50', border: 'border-purple-200' },
    [LeadStatus.WON]: { color: 'text-emerald-700', bg: 'bg-emerald-100/50', border: 'border-emerald-200' },
    [LeadStatus.LOST]: { color: 'text-red-700', bg: 'bg-red-100/50', border: 'border-red-200' },
  };
  const c = configs[status];
  return (
    <button onClick={onClick} className={`px-5 py-2.5 rounded-2xl border ${c.border} ${c.bg} ${c.color} text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:brightness-95 transition-all shadow-sm`}>
       <div className={`w-1.5 h-1.5 rounded-full bg-current`}></div>
       {status}
    </button>
  );
};
