
import React from 'react';
import { Target, Zap, Search, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <Target className="text-brand-primary" size={28} />,
      title: "Set Your Target",
      desc: "Define your niche and location. We'll find local businesses ripe for optimization."
    },
    {
      icon: <Search className="text-blue-500" size={28} />,
      title: "AI Market Scan",
      desc: "Our AI scours Google Maps and social nodes to find valid contact points."
    },
    {
      icon: <Zap className="text-amber-500" size={28} />,
      title: "Spot Gaps",
      desc: "Instantly identify missing websites, poor SEO, or neglected social profiles."
    },
    {
      icon: <ShieldCheck className="text-emerald-500" size={28} />,
      title: "Close Deals",
      desc: "Save your favorites, export them, and start your outreach with high-intent data."
    }
  ];

  return (
    <section className="space-y-12 max-w-7xl mx-auto">
      <div className="text-center space-y-4">
        <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.3em]">The Workflow</h3>
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">How It Works</h2>
        <p className="text-gray-400 font-bold text-lg">Simple steps to 10x your prospecting speed.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((step, idx) => (
          <div key={idx} className="group p-8 bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500 text-center flex flex-col items-center">
            <div className="mb-6 w-16 h-16 bg-gray-50 rounded-3xl flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-primary/5 transition-all">
              {step.icon}
            </div>
            <h4 className="text-xl font-bold text-gray-900 mb-3 tracking-tight">{step.title}</h4>
            <p className="text-sm text-gray-400 leading-relaxed font-bold">{step.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
