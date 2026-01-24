
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout.tsx';
import { SearchBox } from './components/SearchBox.tsx';
import { FilterBar, FilterState } from './components/FilterBar.tsx';
import { LeadCard } from './components/LeadCard.tsx';
import { CRMTable } from './components/CRMTable.tsx';
import { Dashboard } from './components/Dashboard.tsx';
import { HowItWorks } from './components/HowItWorks.tsx';
import { FAQ } from './components/FAQ.tsx';
import { BusinessDetails } from './components/BusinessDetails.tsx';
import { JobBoard } from './components/JobBoard.tsx';
import { Logo } from './components/Logo.tsx';
import { BusinessOpportunity, CRMLead, LeadStatus, JobListing } from './types.ts';
import { findLeads, findJobs } from './services/geminiService.ts';
import { 
  Database, 
  Loader2, 
  Briefcase, 
  Map as MapIcon, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  BarChart3, 
  LayoutGrid, 
  User, 
  Info, 
  Bell,
  Sparkles,
  TrendingUp,
  Globe
} from 'lucide-react';

const ITEMS_PER_PAGE = 24;

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'jobs' | 'crm' | 'dashboard'>('search');
  const [isSearchingIntel, setIsSearchingIntel] = useState(false);
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  const [searchResults, setSearchResults] = useState<BusinessOpportunity[]>([]);
  const [jobsResults, setJobsResults] = useState<JobListing[]>([]);
  const [savedJobs, setSavedJobs] = useState<JobListing[]>([]);
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessOpportunity | CRMLead | null>(null);
  const [filters, setFilters] = useState<FilterState>({ 
    minRevenue: 0, 
    gapIntensity: '', 
    leadQuality: '', 
    location: '', 
    leadStatus: '',
    businessSize: ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const savedLeads = localStorage.getItem('pipelinex_ai_crm_v1');
    if (savedLeads) {
      try {
        setCrmLeads(JSON.parse(savedLeads));
      } catch (e) {
        console.error("Failed to parse saved leads", e);
      }
    }
    const savedGigs = localStorage.getItem('pipelinex_ai_saved_gigs_v1');
    if (savedGigs) {
      try {
        setSavedJobs(JSON.parse(savedGigs));
      } catch (e) {
        console.error("Failed to parse saved gigs", e);
      }
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => console.log("Location access limited", err)
    );
  }, []);

  useEffect(() => {
    localStorage.setItem('pipelinex_ai_crm_v1', JSON.stringify(crmLeads));
  }, [crmLeads]);

  useEffect(() => {
    localStorage.setItem('pipelinex_ai_saved_gigs_v1', JSON.stringify(savedJobs));
  }, [savedJobs]);

  const handleIntelSearch = async (q: string) => {
    setIsSearchingIntel(true);
    setCurrentPage(1);
    try {
      const result = await findLeads(q, userLocation);
      setSearchResults(result.leads);
      setFilters({ minRevenue: 0, gapIntensity: '', leadQuality: '', location: '', leadStatus: '', businessSize: '' });
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearchingIntel(false);
    }
  };

  const handleJobsSearch = async (q: string) => {
    setIsSearchingJobs(true);
    setCurrentPage(1);
    try {
      const result = await findJobs(q);
      setJobsResults(result.jobs);
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSearchingJobs(false);
    }
  };

  const applyFilters = (lead: BusinessOpportunity | CRMLead) => {
    if (filters.minRevenue > 0 && lead.estimatedRevenue < filters.minRevenue) return false;
    const gapCount = Object.values(lead.needs).filter(n => n).length;
    if (filters.gapIntensity === 'High' && gapCount < 3) return false;
    if (filters.gapIntensity === 'Medium' && (gapCount < 2 || gapCount >= 3)) return false;
    if (filters.gapIntensity === 'Low' && gapCount > 1) return false;
    if (filters.location && !lead.location.toLowerCase().includes(filters.location.toLowerCase())) return false;
    if (filters.businessSize && lead.businessSize !== filters.businessSize) return false;
    const qualityScore = (lead.estimatedRevenue / 100000) + (gapCount * 2);
    if (filters.leadQuality === 'A-Tier' && qualityScore < 15) return false;
    if (filters.leadQuality === 'B-Tier' && (qualityScore < 8 || qualityScore >= 15)) return false;
    if ('status' in lead && filters.leadStatus && lead.status !== filters.leadStatus) return false;
    return true;
  };

  const filteredResults = useMemo(() => searchResults.filter(applyFilters), [searchResults, filters]);
  const filteredCrmLeads = useMemo(() => crmLeads.filter(applyFilters), [crmLeads, filters]);

  const paginatedLeads = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResults.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredResults, currentPage]);

  const totalPages = Math.ceil(filteredResults.length / ITEMS_PER_PAGE);

  const addToCRM = (opp: BusinessOpportunity) => {
    if (crmLeads.some(l => l.id === opp.id || (l.name === opp.name && l.location === opp.location))) return;
    const newLead: CRMLead = { ...opp, status: LeadStatus.NEW, notes: '', createdAt: new Date().toISOString(), dealAmount: opp.potentialValue };
    setCrmLeads(prev => [newLead, ...prev]);
  };

  const toggleSaveJob = (job: JobListing) => {
    setSavedJobs(prev => {
      const isSaved = prev.some(j => j.id === job.id || j.sourceUrl === job.sourceUrl);
      return isSaved ? prev.filter(j => j.id !== job.id && j.sourceUrl !== job.sourceUrl) : [job, ...prev];
    });
  };

  const isJobSaved = (job: JobListing) => savedJobs.some(j => j.id === job.id || j.sourceUrl === job.sourceUrl);
  const isLeadSaved = (lead: BusinessOpportunity) => crmLeads.some(l => l.id === lead.id || (l.name === lead.name && l.location === lead.location));

  return (
    <Layout>
      <div className="flex flex-col min-h-screen bg-brand-bg relative overflow-hidden">
        
        {/* Market Pulse Ticker */}
        <div className="bg-brand-accent/95 backdrop-blur-sm text-white py-2 overflow-hidden z-[90]">
          <div className="flex animate-marquee whitespace-nowrap">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center gap-12 px-6">
                <PulseItem icon={<TrendingUp size={14}/>} text="AI Market Scans up 42% this week" />
                <PulseItem icon={<Globe size={14}/>} text="Trending Niche: Boutique Dental Labs (SEO Gap)" />
                <PulseItem icon={<Sparkles size={14}/>} text="Newly Discovered: 1,200+ leads in Pacific NW" />
                <PulseItem icon={<Zap size={14}/>} text="System: High Accuracy Grounding Latency <2s" />
              </div>
            ))}
          </div>
        </div>

        <div className="absolute top-24 left-[-10%] w-[40%] h-[40%] bg-brand-primary/10 blur-[120px] rounded-full animate-blob pointer-events-none"></div>
        <div className="absolute bottom-24 right-[-10%] w-[40%] h-[40%] bg-orange-200/20 blur-[120px] rounded-full animate-blob animation-delay-2000 pointer-events-none"></div>
        
        <header className="md:hidden sticky top-0 left-0 right-0 z-[70] glass border-b border-gray-100 px-5 py-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2.5" onClick={() => setActiveTab('search')}>
            <Logo size={32} className="shadow-lg shadow-black/10 rounded-lg" />
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">PipelineX AI</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-gray-600 hover:text-brand-primary transition-colors">
              <Bell size={20} />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center overflow-hidden">
              <User size={16} className="text-gray-700" />
            </div>
          </div>
        </header>

        <header className="hidden md:block sticky top-0 left-0 right-0 z-[70] glass border-b border-gray-100 h-20 shadow-sm">
          <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-8">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('search')}>
              <Logo size={40} className="shadow-lg shadow-black/10 rounded-xl group-hover:scale-105 transition-transform duration-500" />
              <div>
                <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">PipelineX AI</h1>
                <p className="text-[10px] font-bold text-gray-700 uppercase tracking-widest">Growth Intelligence</p>
              </div>
            </div>

            <nav className="flex items-center space-x-1">
              <NavButton active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<LayoutGrid size={18} />} label="Lead Scout" />
              <NavButton active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<Briefcase size={18} />} label="Gig Boards" />
              <NavButton active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} icon={<Database size={18} />} label="Pipeline" />
              <NavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<BarChart3 size={18} />} label="Analytics" />
            </nav>

            <div className="flex items-center gap-4">
              <button className="bg-brand-primary hover:bg-orange-600 text-white px-6 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all shadow-md active:scale-95 glow-on-hover">
                Admin Console
              </button>
            </div>
          </div>
        </header>

        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-[80] glass border-t border-gray-100 flex justify-around items-center px-2 py-3 pb-safe-offset-4 shadow-[0_-8px_24px_rgba(0,0,0,0.06)]">
          <MobileNavButton active={activeTab === 'search'} onClick={() => setActiveTab('search')} icon={<LayoutGrid size={24} />} label="Lead Scout" />
          <MobileNavButton active={activeTab === 'jobs'} onClick={() => setActiveTab('jobs')} icon={<Briefcase size={24} />} label="Gig Boards" />
          <MobileNavButton active={activeTab === 'crm'} onClick={() => setActiveTab('crm')} icon={<Database size={24} />} label="Pipeline" />
          <MobileNavButton active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<BarChart3 size={24} />} label="Analytics" />
        </nav>

        <main className="flex-1 pb-32 md:pb-12 px-4 sm:px-6 md:px-8 relative">
          {activeTab === 'search' && (
            <div className="max-w-[1400px] mx-auto space-y-6 md:space-y-12 animate-reveal">
              <div className="space-y-6 md:space-y-10 mt-12 md:mt-24 max-w-4xl mx-auto">
                <div className="flex flex-col items-center justify-center gap-4 text-center">
                   <div className="inline-flex items-center justify-center space-x-2 bg-orange-100 text-orange-900 px-4 py-2 rounded-full text-[10px] md:text-xs font-black border border-orange-200 shadow-sm animate-float">
                      <Sparkles size={14} className="text-brand-primary" />
                      <span className="uppercase tracking-widest">{userLocation ? 'Live Intelligence Stream' : 'Awaiting Location Sync'}</span>
                   </div>
                </div>

                <div className="text-center space-y-4 md:space-y-6">
                  <h2 className="text-4xl md:text-8xl font-black text-gray-900 tracking-tight leading-tight">
                    <span className="md:inline">Discovery </span>
                    <span className="text-brand-primary drop-shadow-sm">Growth Gaps.</span>
                  </h2>
                  <p className="text-gray-700 font-bold text-base md:text-2xl max-w-3xl mx-auto leading-relaxed px-4 md:px-0 opacity-80">
                    High-precision AI lead scouting. We find businesses with missing websites, weak SEO, or neglected social nodes instantly.
                  </p>
                </div>

                <div className="space-y-6">
                  <SearchBox type="leads" onSearch={handleIntelSearch} isLoading={isSearchingIntel} placeholder="Target Niche + Location (e.g. HVAC Dallas)" />
                  <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">Quick Search:</span>
                    {['Plumbers NY', 'Dentists FL', 'HVAC Dallas', 'SEO Audit', 'Digital Gap'].map((tag) => (
                      <button key={tag} onClick={() => handleIntelSearch(tag)} className="px-3 py-1.5 bg-white border border-gray-100 rounded-full text-[10px] font-bold text-gray-600 hover:border-brand-primary hover:text-brand-primary transition-all active:scale-95 shadow-sm">
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="stagger-item animate-reveal" style={{animationDelay: '0.2s'}}>
                    <FilterBar filters={filters} setFilters={setFilters} allLeads={searchResults} filteredCount={filteredResults.length} />
                  </div>
                )}
              </div>
              
              <div id="results-section" className="scroll-mt-48 min-h-[400px]">
                {(isSearchingIntel || searchResults.length > 0) && (
                  <div className="space-y-8">
                    {isSearchingIntel ? <LoadingState title="Analyzing Markets..." /> : (
                      <>
                        <div className="flex items-center justify-between px-2 border-b border-gray-100 pb-4 stagger-item">
                           <div>
                             <h3 className="text-lg md:text-xl font-black text-gray-900">Intelligence Briefing</h3>
                             <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">Verified Digital Vulnerabilities</p>
                           </div>
                           <div className="flex items-center gap-2 text-[10px] font-black text-brand-primary bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 uppercase tracking-widest shadow-sm">
                             <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
                             {filteredResults.length} Active Targets
                           </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
                          {paginatedLeads.map((lead, idx) => (
                            <div key={lead.id} className="stagger-item" style={{ animationDelay: `${idx * 0.04}s` }}>
                              <LeadCard opportunity={lead} onAddToCRM={addToCRM} isSaved={isLeadSaved(lead)} onViewDetails={(biz) => setSelectedBusiness(biz)} />
                            </div>
                          ))}
                        </div>

                        {totalPages > 1 && (
                          <div className="flex items-center justify-center gap-4 py-12">
                            <PaginationButton onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} icon={<ChevronLeft size={20}/>} />
                            <span className="text-sm font-black text-gray-900 tabular-nums bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">{currentPage} / {totalPages}</span>
                            <PaginationButton onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} icon={<ChevronRight size={20}/>} />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                )}
                {!isSearchingIntel && searchResults.length === 0 && (
                  <div className="space-y-32 py-12 animate-reveal">
                    <HowItWorks />
                    <FAQ />
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'jobs' && (
            <div className="max-w-[1400px] mx-auto space-y-12 animate-reveal mt-12">
              <div className="text-center space-y-6">
                <h2 className="text-5xl md:text-8xl font-black text-gray-900 tracking-tight">Gig <span className="text-brand-primary">Boards</span></h2>
                <SearchBox type="jobs" onSearch={handleJobsSearch} isLoading={isSearchingJobs} placeholder="Skill or Gig Type (e.g. SEO Auditor)" />
              </div>
              <div id="results-section">
                {isSearchingJobs ? <LoadingState title="Aggregating Gigs..." /> : <JobBoard jobs={jobsResults} onSaveJob={toggleSaveJob} isJobSaved={isJobSaved} />}
              </div>
            </div>
          )}

          {activeTab === 'crm' && (
            <div className="max-w-7xl mx-auto space-y-8 animate-reveal pb-12 mt-12">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Lead Pipeline</h2>
                <p className="text-gray-600 font-bold text-sm uppercase tracking-widest">Managed High-Conversion Entities</p>
              </div>
              <FilterBar filters={filters} setFilters={setFilters} allLeads={crmLeads} filteredCount={filteredCrmLeads.length} showStatusFilter={true} />
              <CRMTable leads={filteredCrmLeads} onUpdateStatus={(id, s) => setCrmLeads(crmLeads.map(l => l.id === id ? { ...l, status: s } : l))} onDelete={(id) => setCrmLeads(crmLeads.filter(l => l.id !== id))} onViewDetails={(biz) => setSelectedBusiness(biz)} />
            </div>
          )}
          
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto animate-reveal space-y-8 pb-12 mt-12">
              <div className="space-y-2">
                <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tight">Analytics</h2>
                <p className="text-gray-600 font-bold text-sm uppercase tracking-widest">Performance Dashboard</p>
              </div>
              <Dashboard leads={crmLeads} />
            </div>
          )}
        </main>

        {selectedBusiness && (
          <BusinessDetails 
            business={selectedBusiness} 
            onClose={() => setSelectedBusiness(null)}
            onDelete={(id) => { setCrmLeads(crmLeads.filter(l => l.id !== id)); setSelectedBusiness(null); }}
            onUpdateStatus={(id, s) => { 
              const updated = crmLeads.map(l => l.id === id ? { ...l, status: s } : l); 
              setCrmLeads(updated); 
              if (selectedBusiness.id === id) setSelectedBusiness({ ...selectedBusiness, status: s } as any); 
            }}
            isSaved={isLeadSaved(selectedBusiness)}
            onAddToCRM={addToCRM}
          />
        )}
      </div>
    </Layout>
  );
};

const PulseItem = ({ icon, text }: { icon: React.ReactNode, text: string }) => (
  <div className="flex items-center gap-3">
    <span className="text-brand-primary">{icon}</span>
    <span className="text-[10px] font-black uppercase tracking-widest">{text}</span>
  </div>
);

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center space-x-2 px-6 py-3 rounded-2xl transition-all duration-500 font-black text-sm ${
      active 
      ? 'bg-orange-100 text-orange-900 border border-orange-200 shadow-sm scale-105' 
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-transparent'
    }`}
  >
    <span className={active ? 'text-brand-primary' : 'text-gray-500'}>{icon}</span>
    <span>{label}</span>
  </button>
);

const MobileNavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex flex-col items-center flex-1 py-1 transition-all duration-300 ${active ? 'text-brand-primary scale-110' : 'text-gray-500'}`}>
    <div className={`p-2.5 transition-all ${active ? 'bg-orange-100/50 rounded-2xl' : ''}`}>{icon}</div>
    <span className="text-[9px] font-black uppercase tracking-tight leading-none mt-1 text-center">{label}</span>
  </button>
);

const PaginationButton = ({ onClick, disabled, icon }: { onClick: () => void, disabled: boolean, icon: React.ReactNode }) => (
  <button 
    onClick={onClick} 
    disabled={disabled}
    className="w-12 h-12 flex items-center justify-center bg-white border border-gray-100 text-gray-800 disabled:opacity-20 rounded-2xl active:scale-95 shadow-lg shadow-black/5 hover:border-brand-primary transition-all transition-transform"
  >
    {icon}
  </button>
);

const LoadingState = ({ title }: { title: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-32 space-y-8 animate-reveal">
      <div className="relative">
        <div className="w-24 h-24 bg-brand-primary/10 rounded-full flex items-center justify-center animate-pulse">
          <Loader2 className="animate-spin text-brand-primary" size={48} />
        </div>
        <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full"></div>
      </div>
      <div className="text-center space-y-3">
        <p className="text-3xl md:text-5xl font-black text-gray-900 animate-pulse tracking-tighter uppercase italic">{title}</p>
        <p className="text-gray-500 font-bold text-xs tracking-[0.3em] uppercase">Grounding Layers Active • Verifying Pins</p>
      </div>
    </div>
  );
};

export default App;
