
import React, { useState, useEffect } from 'react';
import { Search, Sparkles, Loader2 } from 'lucide-react';

interface SearchBoxProps {
  onSearch: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

const LOADING_MESSAGES = [
  "Mapping location coordinates...",
  "Indexing LinkedIn professional profiles...",
  "Scouring Yelp & Yellow Pages directories...",
  "Analyzing Job Boards for hiring signals...",
  "Detecting GMB optimization gaps...",
  "Locating decision-makers & direct lines...",
  "Verifying website status & SEO scores...",
  "Cross-referencing multi-platform data...",
  "Generating ROI intelligence report..."
];

export const SearchBox: React.FC<SearchBoxProps> = ({ onSearch, isLoading, placeholder }) => {
  const [query, setQuery] = useState('');
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isLoading) {
      interval = window.setInterval(() => {
        setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) onSearch(query.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 rounded-[2rem] blur transition duration-1000 ${isLoading ? 'opacity-100 animate-pulse' : 'opacity-25 group-focus-within:opacity-75'}`}></div>
        
        <div className="relative flex items-center">
          <div className={`absolute left-6 transition-colors duration-300 ${isLoading ? 'text-indigo-400' : 'text-slate-500'}`}>
            <Search size={22} />
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder || "Search Target Market (e.g. Dubai Hotels)..."}
            className={`w-full pl-16 pr-44 py-6 bg-[#0a0a0c] border rounded-[2rem] shadow-2xl outline-none transition-all text-xl text-white font-semibold placeholder:text-slate-700 placeholder:font-medium ${
              isLoading 
                ? 'border-indigo-500/50 cursor-wait' 
                : 'border-white/10 focus:border-indigo-500'
            }`}
            disabled={isLoading}
          />

          {isLoading && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2rem]">
              <div className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent skew-x-12 animate-[scan_2s_infinite]"></div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="absolute right-3 px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800/80 disabled:text-slate-500 text-white rounded-[1.5rem] font-black flex items-center space-x-2 transition-all shadow-xl active:scale-95 group/btn overflow-hidden"
          >
            <div className="relative z-10 flex items-center gap-2">
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  <span className="tracking-tight uppercase text-xs">Scanning</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} className="fill-white/20 transition-transform group-hover/btn:rotate-12" />
                  <span className="uppercase text-xs tracking-[0.1em]">Analyze</span>
                </>
              )}
            </div>
            
            {!isLoading && (
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
            )}
          </button>
        </div>
      </form>

      <div className={`h-6 overflow-hidden transition-opacity duration-500 ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
        <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.25em] text-center flex items-center justify-center gap-3">
          <span className="inline-block w-8 h-[1px] bg-indigo-500/30"></span>
          <span className="animate-in slide-in-from-bottom-2 duration-500">
            {LOADING_MESSAGES[messageIndex]}
          </span>
          <span className="inline-block w-8 h-[1px] bg-indigo-500/30"></span>
        </p>
      </div>

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(400%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
};
