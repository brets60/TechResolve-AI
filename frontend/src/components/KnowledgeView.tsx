import React, { useState, useEffect } from 'react';
import { 
  Search, 
  BookOpen, 
  Clock, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  HelpCircle, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  X
} from 'lucide-react';
import { KnowledgeArticle, TroubleshootingSession } from '../types';
import { api } from '../api';

interface KnowledgeViewProps {
  onLaunchInteractive: (articleId: string) => void;
  onStartCustomProblem?: (problem: string, category: string) => void;
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({ 
  onLaunchInteractive, 
  onStartCustomProblem 
}) => {
  const [allArticles, setAllArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const categories = [
    'All',
    '⚡ Hackathon & Dev Skills',
    'Audio & Sound',
    'Battery & Power',
    'Cooling & Thermal',
    'Display & Monitors',
    'Internet & Network',
    'Printers & Devices',
    'Programming & Databases',
    'Security & Accounts',
    'Software & Apps',
    'Storage & Files',
    'System Performance',
    'Windows Repair & BSOD',
  ];

  // Fetch all articles once on mount
  useEffect(() => {
    let isMounted = true;
    api.getKnowledgeArticles().then((data) => {
      if (isMounted) {
        setAllArticles(data);
        setLoading(false);
      }
    }).catch((err) => {
      console.error(err);
      if (isMounted) setLoading(false);
    });
    return () => { isMounted = false; };
  }, []);

  // Filter in memory for instant (0ms) keystroke response
  const filteredArticles = React.useMemo(() => {
    return allArticles.filter((art) => {
      if (selectedCategory !== 'All' && art.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          art.title.toLowerCase().includes(q) ||
          art.summary.toLowerCase().includes(q) ||
          art.category.toLowerCase().includes(q) ||
          (art.tags && art.tags.some((t: string) => t.toLowerCase().includes(q)))
        );
      }
      return true;
    });
  }, [allArticles, selectedCategory, searchQuery]);

  const handleOpenArticle = async (articleId: string) => {
    setModalLoading(true);
    try {
      const full = await api.getKnowledgeArticle(articleId);
      setSelectedArticle(full);
    } catch (err) {
      console.error(err);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ECFDF5] text-[#0F766E] text-xs font-bold uppercase tracking-wider mb-3 border border-[#99F6E4] shadow-2xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Interactive IT Knowledge Library</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
          <span className="text-[#0F172A]">Easy-To-Understand </span>
          <span className="text-[#0F766E]">IT Guides</span>
        </h1>
        <p className="text-[#64748B] text-sm sm:text-base leading-relaxed">
          Search 39 master solutions covering all 35 common PC & laptop problems, computer overheating, networking, audio, and code. Read simple fixes, or let TechResolve AI guide you step-by-step.
        </p>
      </div>

      {/* Search Box */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative bg-[#FFFFFF] rounded-2xl p-1.5 shadow-xs border border-[#E2E8F0] focus-within:ring-2 focus-within:ring-[#0F766E] focus-within:border-[#0F766E] transition-all">
          <Search className="w-5 h-5 text-[#0F766E] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides: e.g. 'audio', 'wifi', 'port in use', 'full disk'..."
            className="w-full pl-12 pr-16 py-3 text-[#0F172A] placeholder-[#94A3B8] text-sm sm:text-base outline-none bg-transparent font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-[#FAFAF7] hover:bg-[#F1F5F9] text-[#0F172A] px-2 py-1 rounded-lg font-bold transition cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shrink-0 transition cursor-pointer active:scale-95 ${
              selectedCategory === cat
                ? 'bg-[#0F766E] text-white shadow-xs'
                : 'bg-[#FFFFFF] border border-[#E2E8F0] text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAFAF7]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#64748B]">
          Loading guides...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-[#FFFFFF] rounded-3xl border border-[#E2E8F0] p-8 sm:p-10 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#0F766E] text-white flex items-center justify-center mx-auto mb-4 shadow-xs">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#0F172A] mb-2">
            {searchQuery ? `Can't find a guide for "${searchQuery}"?` : "No articles found in this category"}
          </h3>
          <p className="text-sm text-[#64748B] mb-6 leading-relaxed max-w-md mx-auto">
            Don't worry! TechResolve AI can diagnose any IT, hardware, network, software, or developer concern and walk you through the fix step-by-step.
          </p>
          <button
            onClick={() => {
              if (onStartCustomProblem) {
                onStartCustomProblem(
                  searchQuery.trim() || 'General Computer Troubleshooting',
                  selectedCategory !== 'All' ? selectedCategory : 'General'
                );
              }
            }}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-sm shadow-sm transition cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span>Launch AI Troubleshooter for This Problem</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((art) => (
              <div
                key={art.id}
                onClick={() => handleOpenArticle(art.id)}
                className="bg-[#FFFFFF] rounded-2xl p-6 card-hover-lift border border-[#E2E8F0] hover:border-[#14B8A6] transition cursor-pointer flex flex-col group text-left shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#0F766E] bg-[#ECFDF5] px-2.5 py-0.5 rounded-md border border-[#99F6E4]">
                    {art.category}
                  </span>
                  <span className="text-xs text-[#64748B] flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-[#64748B]" />
                    {art.estimated_time}
                  </span>
                </div>

                <h3 className="font-extrabold text-[#0F172A] text-base sm:text-lg mb-2 group-hover:text-[#0F766E] transition leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#64748B] line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {art.summary}
                </p>

                <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-bold text-[#0F766E]">
                  <span>Read guide & fix</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Any Other Concern AI Banner */}
          {onStartCustomProblem && (
            <div className="mt-12 bg-[#ECFDF5] rounded-2xl border border-[#99F6E4] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-xs">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFFFF] text-[#0F766E] border border-[#99F6E4] text-xs font-semibold mb-2 shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#0F766E]" />
                  <span>Universal AI Diagnostic</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#0F172A]">
                  Have a specific concern not listed above?
                </h4>
                <p className="text-xs sm:text-sm text-[#334155] max-w-xl">
                  TechResolve AI can analyze any unique computer, mobile, gaming, or coding problem and guide you step-by-step.
                </p>
              </div>
              <button
                onClick={() => onStartCustomProblem('Help me diagnose a technical problem', selectedCategory !== 'All' ? selectedCategory : 'General')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs sm:text-sm shadow-xs transition shrink-0 cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-white" />
                <span>Ask TechResolve AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#FFFFFF] border border-[#E2E8F0] rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-xl relative text-left text-[#0F172A]">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category & Time */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E] bg-[#ECFDF5] px-3 py-1 rounded-full border border-[#99F6E4]">
                {selectedArticle.category}
              </span>
              <span className="text-xs text-[#64748B] flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {selectedArticle.estimated_time} read
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight mb-4">
              {selectedArticle.title}
            </h2>

            {/* Interactive Troubleshooting CTA Button */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#0F766E] text-white mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div>
                <h4 className="font-bold text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-white" />
                  <span>Prefer step-by-step guidance?</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#CCFBF1]">
                  TechResolve AI can walk you through this exact fix one step at a time.
                </p>
              </div>

              <button
                onClick={() => {
                  const id = selectedArticle.id;
                  setSelectedArticle(null);
                  onLaunchInteractive(id);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FFFFFF] hover:bg-[#ECFDF5] text-[#0F766E] font-bold text-xs sm:text-sm shadow-xs transition shrink-0 cursor-pointer"
              >
                <span>Guide Me Interactively</span>
                <ArrowRight className="w-4 h-4 text-[#0F766E]" />
              </button>
            </div>

            {/* Safety Warning */}
            {selectedArticle.safety_warning && (
              <div className="mb-6 p-4 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] text-xs sm:text-sm flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Safety Warning: </span>
                  <span className="text-[#B45309]">{selectedArticle.safety_warning}</span>
                </div>
              </div>
            )}

            {/* Common Reasons */}
            {selectedArticle.common_causes && selectedArticle.common_causes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-[#0F172A] text-sm sm:text-base mb-2">
                  Common Reasons It Happens:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#475569] list-disc list-inside">
                  {selectedArticle.common_causes.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Signs to look for */}
            {selectedArticle.signs_to_look_for && selectedArticle.signs_to_look_for.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-[#0F172A] text-sm sm:text-base mb-2">
                  Signs To Look For:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#475569] list-disc list-inside">
                  {selectedArticle.signs_to_look_for.map((sign, i) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step-by-Step Instructions */}
            {selectedArticle.steps && selectedArticle.steps.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold text-[#0F172A] text-base mb-3">
                  Step-by-Step Instructions:
                </h4>
                <div className="space-y-4">
                  {selectedArticle.steps.map((st) => (
                    <div key={st.step} className="p-4 rounded-xl border border-[#E2E8F0] bg-[#FAFAF7]">
                      <div className="flex items-center gap-2 font-bold text-[#0F172A] text-sm mb-1">
                        <span className="w-5 h-5 rounded-full bg-[#0F766E] text-white flex items-center justify-center text-xs font-bold">
                          {st.step}
                        </span>
                        <span>{st.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#475569] pl-7 mb-1.5 leading-relaxed">
                        {st.instruction}
                      </p>
                      <p className="text-[11px] text-[#64748B] pl-7 italic">
                        Why: {st.why}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expected Results */}
            {selectedArticle.expected_results && (
              <div className="mb-6">
                <h4 className="font-bold text-[#0F172A] text-sm sm:text-base mb-1">
                  Expected Results:
                </h4>
                <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
                  {selectedArticle.expected_results}
                </p>
              </div>
            )}

            {/* When to Contact a Technician */}
            {selectedArticle.technician_trigger && (
              <div className="p-4 rounded-xl bg-[#FEF3C7]/40 border border-[#FDE68A] text-xs sm:text-sm text-[#B45309]">
                <span className="font-bold text-[#B45309] block mb-1">When To Contact a Technician:</span>
                {selectedArticle.technician_trigger}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
