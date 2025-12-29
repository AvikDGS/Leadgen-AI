
import React, { useState, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { SearchBox } from './components/SearchBox';
import { FilterBar, FilterState } from './components/FilterBar';
import { LeadCard } from './components/LeadCard';
import { CRMTable } from './components/CRMTable';
import { Dashboard } from './components/Dashboard';
import { HowItWorks } from './components/HowItWorks';
import { FAQ } from './components/FAQ';
import { BusinessDetails } from './components/BusinessDetails';
import { JobBoard } from './components/JobBoard';
import { BusinessOpportunity, CRMLead, LeadStatus, JobListing } from './types';
import { findLeads, findJobs } from './services/geminiService';
import { Search, Database, LayoutDashboard, Loader2, Sparkles, FilterX, Briefcase, Globe } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'jobs' | 'crm' | 'dashboard'>('search');
  
  // Independent queries for separate segments
  const [intelQuery, setIntelQuery] = useState('');
  const [jobsQuery, setJobsQuery] = useState('');
  
  const [isSearchingIntel, setIsSearchingIntel] = useState(false);
  const [isSearchingJobs, setIsSearchingJobs] = useState(false);
  
  // Independent results to allow simultaneous state persistence
  const [searchResults, setSearchResults] = useState<BusinessOpportunity[]>([]);
  const [jobsResults, setJobsResults] = useState<JobListing[]>([]);
  
  const [crmLeads, setCrmLeads] = useState<CRMLead[]>([]);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | undefined>();
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessOpportunity | CRMLead | null>(null);
  
  const [filters, setFilters] = useState<FilterState>({
    minRevenue: 0,
    gapIntensity: '',
    leadQuality: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('leadgen_crm_proxima_v1');
    if (saved) setCrmLeads(JSON.parse(saved));

    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
      (err) => console.log("Location denied", err)
    );
  }, []);

  useEffect(() => {
    localStorage.setItem('leadgen_crm_proxima_v1', JSON.stringify(crmLeads));
  }, [crmLeads]);

  const handleIntelSearch = async (q: string) => {
    setIsSearchingIntel(true);
    setIntelQuery(q);
    try {
      const result = await findLeads(q, userLocation);
      setSearchResults(result.leads);
      const resultsRef = document.getElementById('results-section');
      if (resultsRef) resultsRef.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("Intelligence scan failed. Check API connectivity.");
    } finally {
      setIsSearchingIntel(false);
    }
  };

  const handleJobsSearch = async (q: string) => {
    setIsSearchingJobs(true);
    setJobsQuery(q);
    try {
      const result = await findJobs(q);
      setJobsResults(result.jobs);
      const resultsRef = document.getElementById('results-section');
      if (resultsRef) resultsRef.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error(error);
      alert("Job scouting failed. Check API connectivity.");
    } finally {
      setIsSearchingJobs(false);
    }
  };

  const filteredResults = useMemo(() => {
    return searchResults.filter(lead => {
      if (filters.minRevenue > 0 && lead.estimatedRevenue < filters.minRevenue) return false;
      const gapCount = Object.values(lead.needs).filter(n => n).length;
      if (filters.gapIntensity === 'High' && gapCount < 3) return false;
      if (filters.gapIntensity === 'Medium' && (gapCount < 2 || gapCount > 3)) return false;
      if (filters.gapIntensity === 'Low' && gapCount > 2) return false;
      const qualityScore = (lead.estimatedRevenue / 100000) + (gapCount * 2);
      if (filters.leadQuality === 'A-Tier' && qualityScore < 15) return false;
      if (filters.leadQuality === 'B-Tier' && (qualityScore < 8 || qualityScore >= 15)) return false;
      return true;
    });
  }, [searchResults, filters]);

  const addToCRM = (opp: BusinessOpportunity) => {
    const isAlreadySaved = crmLeads.some(l => l.id === opp.id || (l.name === opp.name && l.location === opp.location));
    if (isAlreadySaved) return;

    const newLead: CRMLead = {
      ...opp,
      status: LeadStatus.NEW,
      notes: '',
      createdAt: new Date().toISOString(),
      dealAmount: opp.potentialValue
    };
    setCrmLeads(prev => [newLead, ...prev]);
  };

  const updateLeadStatus = (id: string, status: LeadStatus, amount?: number) => {
    const updated = crmLeads.map(l => l.id === id ? { ...l, status, dealAmount: amount ?? l.dealAmount } : l);
    setCrmLeads(updated);
    if (selectedBusiness && selectedBusiness.id === id) {
        const item = updated.find(l => l.id === id);
        if (item) setSelectedBusiness(item);
    }
  };

  const deleteLead = (id: string) => {
    if (confirm("Permanently archive this lead?")) {
      setCrmLeads(prev => prev.filter(l => l.id !== id));
      if (selectedBusiness?.id === id) setSelectedBusiness(null);
    }
  };

  const isLeadSaved = (lead: BusinessOpportunity) => {
    return crmLeads.some(l => l.id === lead.id || (l.name === lead.name && l.location === lead.location));
  };

  return (
    <Layout>
      <div className="flex flex-col min-h-screen">
        {/* Navigation Bar matching requested visual style */}
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
          <nav className="bg-[#0a0a0c]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] px-8 py-4 flex items-center justify-between shadow-2xl shadow-indigo-500/10">
            <div className="flex items-center space-x-4 cursor-pointer" onClick={() => setActiveTab('search')}>
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Sparkles size={24} className="text-white fill-white/20" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tighter">Proxima</h1>
            </div>
            
            <div className="hidden md:flex bg-black/40 p-1 rounded-[1.5rem] border border-white/5 gap-1">
              <NavButton 
                active={activeTab === 'search'} 
                onClick={() => setActiveTab('search')} 
                icon={<Search size={18} />} 
                label="Intelligence" 
              />
              <NavButton 
                active={activeTab === 'jobs'} 
                onClick={() => setActiveTab('jobs')} 
                icon={<Briefcase size={18} />} 
                label="Current Jobs" 
              />
              <NavButton 
                active={activeTab === 'crm'} 
                onClick={() => setActiveTab('crm')} 
                icon={<Database size={18} />} 
                label="Pipeline" 
              />
              <NavButton 
                active={activeTab === 'dashboard'} 
                onClick={() => setActiveTab('dashboard')} 
                icon={<LayoutDashboard size={18} />} 
                label="Insights" 
              />
            </div>

            <div className="flex items-center">
              <span className="text-[10px] font-black text-indigo-300 bg-indigo-500/5 px-6 py-2.5 rounded-2xl border border-indigo-500/20 uppercase tracking-[0.2em] shadow-inner">
                V5.4 MULTI-SCOUT
              </span>
            </div>
          </nav>
        </div>

        <main className="flex-1 pt-32 pb-20 px-4 md:px-8">
          {/* Intelligence Segment (Lead Gen) */}
          {activeTab === 'search' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-8">
                <div className="inline-flex items-center space-x-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-1.5 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase">
                  <span>PROSPECT INTELLIGENCE</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-none">
                  Precision Prospecting <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                    Deep-Web Analysis
                  </span>
                </h2>
                <div className="space-y-4">
                  <SearchBox 
                    onSearch={handleIntelSearch} 
                    isLoading={isSearchingIntel} 
                    placeholder="Search Sector (e.g. Netherlands Cafes)..."
                  />
                  <FilterBar 
                    filters={filters} 
                    setFilters={setFilters} 
                    resultsCount={filteredResults.length}
                  />
                </div>
              </div>

              <div id="results-section" className="scroll-mt-32">
                {(isSearchingIntel || searchResults.length > 0) && (
                  <div className="space-y-12 py-10">
                    {isSearchingIntel ? <LoadingState title="Indexing Market Clusters..." /> : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
                        {filteredResults.map((lead) => (
                          <LeadCard 
                            key={lead.id} 
                            opportunity={lead} 
                            onAddToCRM={addToCRM} 
                            isSaved={isLeadSaved(lead)}
                            onViewDetails={(biz) => setSelectedBusiness(biz)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
                {!isSearchingIntel && searchResults.length === 0 && <HowItWorks />}
              </div>
            </div>
          )}

          {/* Current Jobs Segment (Job Scouting) */}
          {activeTab === 'jobs' && (
            <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
              <div className="text-center space-y-8">
                <div className="inline-flex items-center space-x-2 bg-purple-500/10 border border-purple-500/20 px-4 py-1.5 rounded-full text-purple-400 text-xs font-bold tracking-widest uppercase">
                  <span>REAL-TIME JOB SCOUT</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-none">
                  Current Openings <br /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-rose-400">
                    LinkedIn & Global Boards
                  </span>
                </h2>
                <SearchBox 
                  onSearch={handleJobsSearch} 
                  isLoading={isSearchingJobs} 
                  placeholder="Search Jobs (e.g. Freelance Marketing, SEO Specialist)..."
                />
              </div>

              <div id="results-section" className="scroll-mt-32">
                {(isSearchingJobs || jobsResults.length > 0) && (
                  <div className="space-y-12 py-10">
                    {isSearchingJobs ? <LoadingState title="Scraping Global Job Boards..." /> : <JobBoard jobs={jobsResults} />}
                  </div>
                )}
                {!isSearchingJobs && jobsResults.length === 0 && <FAQ />}
              </div>
            </div>
          )}

          {activeTab === 'crm' && (
            <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
              <CRMTable leads={crmLeads} onUpdateStatus={updateLeadStatus} onDelete={deleteLead} onViewDetails={(biz) => setSelectedBusiness(biz)} />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto animate-in fade-in duration-500">
              <Dashboard leads={crmLeads} />
            </div>
          )}
        </main>

        {selectedBusiness && (
          <BusinessDetails 
            business={selectedBusiness} 
            onClose={() => setSelectedBusiness(null)}
            onDelete={deleteLead}
            onUpdateStatus={updateLeadStatus}
            isSaved={isLeadSaved(selectedBusiness)}
            onAddToCRM={addToCRM}
          />
        )}
      </div>
    </Layout>
  );
};

const LoadingState = ({ title }: { title?: string }) => (
  <div className="flex flex-col items-center justify-center py-32 space-y-6">
    <div className="relative">
      <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-20 animate-pulse"></div>
      <Loader2 className="animate-spin text-indigo-400 relative z-10" size={64} />
    </div>
    <div className="space-y-2 text-center">
      <p className="text-xl font-bold text-white tracking-tight animate-pulse">{title || "Neural Scraper Active..."}</p>
      <p className="text-slate-500 text-sm italic font-medium">Extracting validated links and cross-referencing multi-platform data</p>
    </div>
  </div>
);

const NavButton: React.FC<{ active: boolean; onClick: () => void; icon: React.ReactNode; label: string }> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick} 
    className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 ${
      active 
      ? 'bg-indigo-600/20 text-indigo-400 shadow-inner border border-indigo-500/20' 
      : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
    }`}
  >
    {icon}
    <span className="font-bold text-sm whitespace-nowrap">{label}</span>
  </button>
);

export default App;
