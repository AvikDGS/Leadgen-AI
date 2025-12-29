
import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "Where does Proxima get its data from?",
      a: "Proxima utilizes Gemini's advanced Search and Google Maps grounding tools to access real-time, live data from the web. We don't use stale databases; every search is fresh."
    },
    {
      q: "How accurate is the owner contact information?",
      a: "Our AI cross-references public records, official websites, and social profiles to extract the most probable decision-maker names and direct phone lines."
    },
    {
      q: "Can I track my sales progress within the app?",
      a: "Yes. Once you add a lead, the Pipeline tab allows you to update deal status (Negotiating, Won, Lost) and record potential revenue values."
    },
    {
      q: "What digital gaps does the AI specifically look for?",
      a: "We analyze website mobile-friendliness, SEO indexing, Google My Business verification, Social Media activity, and Brand Consistency (Graphic Design)."
    }
  ];

  return (
    <section className="space-y-12">
      <div className="text-center space-y-4">
        <h3 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em]">Knowledge Base</h3>
        <h2 className="text-4xl font-extrabold text-white tracking-tight">Frequently Asked</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-8 bg-white/5 border border-white/5 rounded-[2rem] hover:border-purple-500/20 transition-all group">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-purple-500/10 rounded-xl text-purple-400">
                <HelpCircle size={20} />
              </div>
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-white tracking-tight">{faq.q}</h4>
                <p className="text-sm text-slate-500 leading-relaxed font-medium">{faq.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-8">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">
          Need more help? <span className="text-indigo-400 cursor-pointer hover:underline">Contact Neural Support</span>
        </p>
      </div>
    </section>
  );
};
