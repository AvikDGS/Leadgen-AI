
import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Zap, Target, Globe, Shield, Sparkles } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
  type?: 'leads' | 'jobs';
}

const LOADING_MESSAGES = [
  "Connecting to Google Search Grounding...",
  "Synchronizing Maps Data...",
  "Auditing SEO Profiles...",
  "Verifying Digital Gaps...",
  "Synthesizing Contact Info...",
  "Mapping Revenue Nodes...",
  "Finalizing Growth Intel..."
];

const DISCOVERY_LOGS = [
  "Layer 0: Neural Network Synced",
  "Layer 1: Google Grounding Active",
  "Layer 2: Local Map Nodes Identified",
  "Layer 3: Cross-Platform Verification Ready"
];

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading, placeholder }) => {
  const [query, setQuery] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [logIndex, setLogIndex] = useState(0);
  const logIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle focus behavior for "immediate start" feel
  useEffect(() => {
    if (isFocused && !isLoading) {
      logIntervalRef.current = window.setInterval(() => {
        setLogIndex(prev => (prev + 1) % DISCOVERY_LOGS.length);
      }, 1500);
    } else {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
      setLogIndex(0);
    }
    return () => {
      if (logIntervalRef.current) clearInterval(logIntervalRef.current);
    };
  }, [isFocused, isLoading]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4 relative">
      
      {/* Top AI Badge - only visible when focused or loading */}
      <div className={`flex justify-center transition-all duration-500 overflow-hidden ${isFocused || isLoading ? 'h-8 opacity-100 mb-2' : 'h-0 opacity-0'}`}>
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-accent text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-lg animate-pulse">
          <Sparkles size={12} className="text-brand-primary" />
          {isLoading ? 'Processing Intelligence' : 'Ready for Discovery'}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="relative z-20 group">
        <div className={`relative flex items-center bg-white border rounded-[1.6rem] overflow-hidden shadow-xl shadow-black/5 transition-all duration-500 bg-white/95 backdrop-blur-sm ${
          isFocused ? 'ring-4 ring-brand-primary/20 border-brand-primary/50' : 'border-gray-100'
        }`}>
          
          {/* Decorative Inner Border */}
          <div className="absolute inset-0 border border-white/50 rounded-[1.6rem] pointer-events-none"></div>

          <div className="pl-6 text-gray-400 transition-colors flex items-center justify-center">
            {isLoading ? (
              <Loader2 className="animate-spin text-brand-primary" size={20} />
            ) : (
              <div className={`relative transition-colors ${isFocused ? 'text-brand-primary' : ''}`}>
                <Search size={20} className="relative z-10" />
                <div className={`absolute inset-0 bg-brand-primary/20 blur-lg rounded-full animate-pulse-slow transition-opacity ${isFocused ? 'opacity-100' : 'opacity-0'}`}></div>
              </div>
            )}
          </div>
          
          <input
            type="text"
            value={query}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || "Search market..."}
            className="w-full bg-transparent px-4 py-4 md:py-5 text-base md:text-lg text-gray-900 font-bold outline-none placeholder:text-gray-300 placeholder:font-semibold"
            disabled={isLoading}
          />

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="mr-2 px-6 md:px-8 py-2.5 md:py-3.5 bg-gradient-to-r from-brand-primary to-orange-500 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl md:rounded-[1rem] font-black text-[10px] md:text-xs uppercase tracking-[0.15em] transition-all hover:scale-[1.02] active:scale-95 disabled:from-gray-100 disabled:to-gray-100 disabled:text-gray-300 shadow-lg shadow-brand-primary/20 flex items-center gap-2 group/btn"
          >
            {isLoading ? (
              <Zap size={14} className="animate-pulse" />
            ) : (
              <>
                <span className="hidden sm:inline">Search Discovery</span>
                <span className="sm:hidden">Search</span>
                <Target size={14} className="group-hover/btn:rotate-90 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Live AI Status Logs */}
      {(isLoading || isFocused) && (
        <div className="flex flex-col items-center space-y-3 animate-reveal">
          <div className="flex items-center gap-3 bg-white/50 backdrop-blur-md px-5 py-2 rounded-2xl border border-gray-100 shadow-sm transition-all">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-orange-500 animate-ping' : 'bg-brand-primary animate-pulse'}`}></div>
            <p className="text-[10px] font-black text-gray-700 tracking-[0.2em] uppercase opacity-80">
              {isLoading ? LOADING_MESSAGES[messageIndex] : DISCOVERY_LOGS[logIndex]}
            </p>
          </div>
          
          <div className="w-48 h-1 bg-gray-100 rounded-full overflow-hidden relative">
             <div className={`h-full bg-brand-primary rounded-full transition-all duration-300 ${isLoading ? 'w-full animate-[shimmer_1.5s_infinite]' : 'w-1/3'}`}></div>
          </div>

          {!isLoading && isFocused && (
            <div className="flex items-center gap-4 text-[9px] font-bold text-gray-400 uppercase tracking-widest pt-1">
               <div className="flex items-center gap-1"><Globe size={12} /> Google Search Grounding</div>
               <div className="flex items-center gap-1"><Shield size={12} /> Maps Node Sync</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
