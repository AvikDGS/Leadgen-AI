
import React from 'react';
import { HelpCircle, ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const faqs = [
    {
      q: "Where does the lead data come from?",
      a: "PipelineX AI taps into live Google Maps data and real-time search grounding to ensure you see businesses as they exist today, not stale database records."
    },
    {
      q: "Can I find owner contact info?",
      a: "Yes. Our AI specifically audits digital presence to identify likely decision-makers and unearths phone numbers or emails linked to the business."
    },
    {
      q: "How accurate are the revenue estimates?",
      a: "Estimates are calculated based on business size, location market value, and industry benchmarks verified against live search results."
    },
    {
      q: "Is there an export limit?",
      a: "You can export all leads in your pipeline as a CSV at any time, formatted perfectly for your favorite CRM or cold-email tool."
    }
  ];

  return (
    <section className="space-y-12 max-w-5xl mx-auto pb-20">
      <div className="text-center space-y-4">
        <h3 className="text-xs font-black text-brand-primary uppercase tracking-[0.3em]">Knowledge Base</h3>
        <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">Got Questions?</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-8 bg-white border border-gray-100 rounded-[2rem] hover:border-brand-primary/20 transition-all shadow-sm">
            <div className="flex items-start gap-4">
              <div className="mt-1 p-2 bg-orange-50 rounded-xl text-brand-primary">
                <HelpCircle size={18} />
              </div>
              <div className="space-y-2">
                <h4 className="text-lg font-black text-gray-900 tracking-tight leading-tight">{faq.q}</h4>
                <p className="text-sm text-gray-400 leading-relaxed font-bold">{faq.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="text-center pt-8">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Need more help? <span className="text-brand-primary cursor-pointer hover:underline">Contact Support</span>
        </p>
      </div>
    </section>
  );
};
