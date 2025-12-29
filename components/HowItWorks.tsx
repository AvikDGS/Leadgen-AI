
import React from 'react';
import { Target, Zap, Search, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Target className="text-indigo-400" size={32} />,
      title: "Identify Market",
      desc: "Input your target industry and location. Proxima targets high-intent niches with local presence."
    },
    {
      icon: <Search className="text-purple-400" size={32} />,
      title: "Deep Grounding",
      desc: "Our AI scrapes Google Maps & Search to build a profile including owner contact info and GMB links."
    },
    {
      icon: <Zap className="text-amber-400" size={32} />,
      title: "Gap Intelligence",
      desc: "Neural analysis detects missing websites, SEO failures, and unoptimized GMB listings in seconds."
    },
    {
      icon: <ShieldCheck className="text-emerald-400" size={32} />,
      title: "Pipeline Sync",
      desc: "Export verified opportunities directly into the CRM to manage outreach and track potential revenue."
    }
  ];

  return (
    <section className="space-y-12">
      <div className="text-center space-y-4">
        <h3 className="text-xs font-black text-indigo-400 uppercase tracking-[0.3em]">Operational Protocol</h3>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">How the Engine Works</h2>
        <p className="text-slate-500 font-medium">A systematic approach to digital market dominance.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {steps.map((step, idx) => (
          <div key={idx} className="relative group p-8 bg-white/5 border border-white/5 rounded-[2.5rem] hover:bg-white/[0.08] hover:border-indigo-500/30 transition-all duration-500">
            <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#0a0a0c] border border-white/10 rounded-2xl flex items-center justify-center text-xs font-black text-slate-500 group-hover:text-indigo-400 transition-colors">
              0{idx + 1}
            </div>
            <div className="mb-6 p-4 bg-[#0a0a0c] border border-white/5 rounded-2xl w-fit shadow-xl group-hover:scale-110 transition-transform duration-500">
              {step.icon}
            </div>
            <h4 className="text-xl font-bold text-white mb-3 tracking-tight">{step.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
