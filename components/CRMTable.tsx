
import React, { useState, useRef, useEffect } from 'react';
import { CRMLead, LeadStatus } from '../types';
import { 
  Trash2, ExternalLink, CheckSquare, Square, 
  FileSpreadsheet, ChevronDown, Check, 
  Circle, Clock, MessageSquare, Trophy, XCircle 
} from 'lucide-react';

interface CRMTableProps {
  leads: CRMLead[];
  onUpdateStatus: (id: string, status: LeadStatus, amount?: number) => void;
  onDelete: (id: string) => void;
  onViewDetails: (lead: CRMLead) => void;
}

export const CRMTable: React.FC<CRMTableProps> = ({ leads, onUpdateStatus, onDelete, onViewDetails }) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelectAll = () => {
    if (selectedIds.size === leads.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(leads.map(l => l.id)));
    }
  };

  const toggleSelectLead = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const exportToCSV = () => {
    const targets = leads.filter(l => selectedIds.has(l.id));
    if (targets.length === 0) {
      alert("Please select at least one lead to export.");
      return;
    }

    const headers = [
      "Business Name", "Location", "Owner Name", "Owner Phone", "Email", 
      "Website", "GMB Link", "Status", "Potential Revenue", "Gap Analysis", "Created At"
    ];

    const rows = targets.map(l => [
      `"${l.name.replace(/"/g, '""')}"`,
      `"${l.location.replace(/"/g, '""')}"`,
      `"${(l.ownerName || 'N/A').replace(/"/g, '""')}"`,
      `"${(l.ownerPhone || 'N/A').replace(/"/g, '""')}"`,
      `"${(l.email || 'N/A').replace(/"/g, '""')}"`,
      `"${(l.website || 'N/A').replace(/"/g, '""')}"`,
      `"${(l.gmbLink || 'N/A').replace(/"/g, '""')}"`,
      l.status,
      l.dealAmount || 0,
      `"${l.analysis.replace(/"/g, '""')}"`,
      new Date(l.createdAt).toLocaleDateString()
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Proxima_Leads_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-[#111116]/60 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 shadow-2xl overflow-hidden mt-10">
      <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-indigo-500/[0.02] to-transparent">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            Active Pipeline
            <span className="bg-indigo-500/10 px-3 py-1 rounded-lg border border-indigo-500/20 text-indigo-400 font-black text-[10px] uppercase tracking-widest">
              {leads.length} Entities
            </span>
          </h2>
          <p className="text-slate-500 text-sm font-medium mt-1">Batch process and lifecycle management core</p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          {selectedIds.size > 0 && (
            <button 
              onClick={exportToCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-black px-6 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.15em] transition-all shadow-xl shadow-emerald-500/10 active:scale-95 group"
            >
              <FileSpreadsheet size={16} className="group-hover:rotate-12 transition-transform" />
              Export Selected ({selectedIds.size})
            </button>
          )}
          <div className="bg-[#0a0a0c] p-1.5 rounded-2xl border border-white/5 flex items-center gap-1">
             <button 
              onClick={toggleSelectAll}
              className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
             >
               {selectedIds.size === leads.length ? 'Deselect All' : 'Select All'}
             </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto overflow-y-visible">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/5 text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-8 py-5 w-16">
                <button onClick={toggleSelectAll} className="p-1 hover:text-indigo-400 transition-colors">
                  {selectedIds.size === leads.length && leads.length > 0 ? <CheckSquare size={18} className="text-indigo-500" /> : <Square size={18} />}
                </button>
              </th>
              <th className="px-8 py-5">Entity & Origin</th>
              <th className="px-8 py-5">Decision Maker Intel</th>
              <th className="px-8 py-5">Lifecycle Stage</th>
              <th className="px-8 py-5">Est. Revenue</th>
              <th className="px-8 py-5 text-right">Ops</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {leads.map((lead) => (
              <tr key={lead.id} className={`group transition-all ${selectedIds.has(lead.id) ? 'bg-indigo-500/5' : 'hover:bg-white/[0.02]'}`}>
                <td className="px-8 py-6">
                  <button 
                    onClick={() => toggleSelectLead(lead.id)}
                    className={`p-1 transition-colors ${selectedIds.has(lead.id) ? 'text-indigo-500' : 'text-slate-700 hover:text-slate-500'}`}
                  >
                    {selectedIds.has(lead.id) ? <CheckSquare size={18} /> : <Square size={18} />}
                  </button>
                </td>
                <td className="px-8 py-6">
                  <button 
                    onClick={() => onViewDetails(lead)}
                    className="text-lg font-bold text-white hover:text-indigo-400 transition-colors flex items-center gap-2 text-left"
                  >
                    {lead.name}
                    <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{lead.location}</p>
                </td>
                <td className="px-8 py-6">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5">
                      <span className="w-1 h-1 bg-indigo-500 rounded-full"></span>
                      {lead.ownerName || 'Extracting...'}
                    </p>
                    <p className="text-[10px] text-slate-500 font-medium">
                      {lead.ownerPhone || lead.phone || 'No direct line'}
                    </p>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <StatusDropdown 
                    status={lead.status} 
                    onChange={(newStatus) => onUpdateStatus(lead.id, newStatus)} 
                  />
                </td>
                <td className="px-8 py-6">
                  <p className="text-lg font-bold text-white tracking-tight">{lead.currencySymbol}{lead.dealAmount?.toLocaleString()}</p>
                  <p className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Calculated</p>
                </td>
                <td className="px-8 py-6 text-right">
                  <button onClick={() => onDelete(lead.id)} className="p-3 text-slate-700 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={6} className="px-8 py-32 text-center text-slate-600 font-bold text-xl opacity-50 italic">
                  Pipeline empty. Prospect for intelligence to populate.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface StatusDropdownProps {
  status: LeadStatus;
  onChange: (status: LeadStatus) => void;
}

const StatusDropdown: React.FC<StatusDropdownProps> = ({ status, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getStatusConfig = (s: LeadStatus) => {
    switch (s) {
      case LeadStatus.NEW: return { color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: <Circle size={12} /> };
      case LeadStatus.CONTACTED: return { color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: <MessageSquare size={12} /> };
      case LeadStatus.NEGOTIATING: return { color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: <Clock size={12} /> };
      case LeadStatus.WON: return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: <Trophy size={12} /> };
      case LeadStatus.LOST: return { color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: <XCircle size={12} /> };
      default: return { color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20', icon: <Circle size={12} /> };
    }
  };

  const current = getStatusConfig(status);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border ${current.bg} ${current.border} ${current.color} hover:brightness-125 transition-all w-36 shadow-lg shadow-black/20`}
      >
        <div className="flex items-center gap-2">
          {current.icon}
          <span className="text-[9px] font-black uppercase tracking-widest">{status}</span>
        </div>
        <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-[#111116] border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[60] overflow-hidden backdrop-blur-3xl animate-in fade-in zoom-in-95 duration-200">
          <div className="p-2 space-y-1">
            {Object.values(LeadStatus).map((option) => {
              const cfg = getStatusConfig(option);
              const isSelected = option === status;
              return (
                <button
                  key={option}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all group ${
                    isSelected ? 'bg-white/5 text-white' : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`${cfg.color} ${cfg.bg} p-1.5 rounded-lg border ${cfg.border} group-hover:scale-110 transition-transform`}>
                      {cfg.icon}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">{option}</span>
                  </div>
                  {isSelected && <Check size={14} className="text-indigo-400" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
