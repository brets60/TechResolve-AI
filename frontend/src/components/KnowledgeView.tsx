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
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#151F32] text-[#22D3EE] text-xs font-bold uppercase tracking-wider mb-3 border border-[#334155] shadow-xs">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Interactive IT Knowledge Library</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
          <span className="text-[#F8FAFC]">Easy-To-Understand </span>
          <span className="text-[#22D3EE]">IT Guides</span>
        </h1>
        <p className="text-[#CBD5E1] text-sm sm:text-base leading-relaxed">
          Search 39 master solutions covering all 35 common PC & laptop problems, computer overheating, networking, audio, and code. Read simple fixes, or let TechResolve AI guide you step-by-step.
        </p>
      </div>

      {/* Search Box */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative bg-[#151F32] rounded-2xl p-1.5 shadow-md border border-[#334155] focus-within:ring-2 focus-within:ring-[#2563EB] focus-within:border-[#2563EB] transition-all">
          <Search className="w-5 h-5 text-[#22D3EE] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search guides: e.g. 'audio', 'wifi', 'port in use', 'full disk'..."
            className="w-full pl-12 pr-16 py-3 text-[#F8FAFC] placeholder-[#94A3B8] text-sm sm:text-base outline-none bg-transparent font-medium"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs bg-[#1E293B] hover:bg-[#334155] text-[#CBD5E1] px-2 py-1 rounded-lg font-bold transition"
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
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'bg-[#151F32] border border-[#334155] text-[#CBD5E1] hover:text-[#F8FAFC] hover:bg-[#1E293B]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-12 text-[#94A3B8]">
          Loading guides...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="bg-[#151F32] rounded-3xl border border-[#334155] p-8 sm:p-10 text-center max-w-xl mx-auto shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-[#2563EB] text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-[#F8FAFC] mb-2">
            {searchQuery ? `Can't find a guide for "${searchQuery}"?` : "No articles found in this category"}
          </h3>
          <p className="text-sm text-[#CBD5E1] mb-6 leading-relaxed max-w-md mx-auto">
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
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-sm shadow-md transition cursor-pointer active:scale-98"
          >
            <Sparkles className="w-4 h-4 text-[#22D3EE]" />
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
                className="bg-[#151F32] rounded-2xl p-6 card-hover-lift border border-[#334155] hover:border-[#2563EB] transition cursor-pointer flex flex-col group text-left shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#22D3EE] bg-[#1E293B] px-2.5 py-0.5 rounded-md border border-[#334155]">
                    {art.category}
                  </span>
                  <span className="text-xs text-[#94A3B8] flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-[#94A3B8]" />
                    {art.estimated_time}
                  </span>
                </div>

                <h3 className="font-extrabold text-[#F8FAFC] text-base sm:text-lg mb-2 group-hover:text-[#22D3EE] transition leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#CBD5E1] line-clamp-3 mb-6 flex-1 leading-relaxed">
                  {art.summary}
                </p>

                <div className="pt-4 border-t border-[#334155] flex items-center justify-between text-xs font-bold text-[#22D3EE]">
                  <span>Read guide & fix</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>

          {/* Any Other Concern AI Banner */}
          {onStartCustomProblem && (
            <div className="mt-12 bg-[#151F32] rounded-2xl border border-[#334155] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left shadow-sm">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1E293B] text-[#22D3EE] border border-[#334155] text-xs font-semibold mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#22D3EE]" />
                  <span>Universal AI Diagnostic</span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-[#F8FAFC]">
                  Have a specific concern not listed above?
                </h4>
                <p className="text-xs sm:text-sm text-[#CBD5E1] max-w-xl">
                  TechResolve AI can analyze any unique computer, mobile, gaming, or coding problem and guide you step-by-step.
                </p>
              </div>
              <button
                onClick={() => onStartCustomProblem('Help me diagnose a technical problem', selectedCategory !== 'All' ? selectedCategory : 'General')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold text-xs sm:text-sm shadow-xs transition shrink-0 cursor-pointer active:scale-98"
              >
                <Sparkles className="w-4 h-4 text-[#22D3EE]" />
                <span>Ask TechResolve AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-[#0B1120]/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#1E293B] border border-[#334155] rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative text-left text-[#F8FAFC]">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#334155] transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category & Time */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#22D3EE] bg-[#151F32] px-3 py-1 rounded-full border border-[#334155]">
                {selectedArticle.category}
              </span>
              <span className="text-xs text-[#94A3B8] flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {selectedArticle.estimated_time} read
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight mb-4">
              {selectedArticle.title}
            </h2>

            {/* Interactive Troubleshooting CTA Button */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[#2563EB] text-white mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h4 className="font-bold text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#22D3EE]" />
                  <span>Prefer step-by-step guidance?</span>
                </h4>
                <p className="text-xs sm:text-sm text-blue-100">
                  TechResolve AI can walk you through this exact fix one step at a time.
                </p>
              </div>

              <button
                onClick={() => {
                  const id = selectedArticle.id;
                  setSelectedArticle(null);
                  onLaunchInteractive(id);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#151F32] hover:bg-[#0B1120] text-white font-bold text-xs sm:text-sm border border-[#334155] transition shrink-0 cursor-pointer"
              >
                <span>Guide Me Interactively</span>
                <ArrowRight className="w-4 h-4 text-[#22D3EE]" />
              </button>
            </div>

            {/* Safety Warning */}
            {selectedArticle.safety_warning && (
              <div className="mb-6 p-4 rounded-xl bg-[#FBBF24]/10 border border-[#FBBF24]/30 text-[#FBBF24] text-xs sm:text-sm flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-[#FBBF24] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Safety Warning: </span>
                  <span className="text-[#CBD5E1]">{selectedArticle.safety_warning}</span>
                </div>
              </div>
            )}

            {/* Common Reasons */}
            {selectedArticle.common_causes && selectedArticle.common_causes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-[#F8FAFC] text-sm sm:text-base mb-2">
                  Common Reasons It Happens:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#CBD5E1] list-disc list-inside">
                  {selectedArticle.common_causes.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Signs to look for */}
            {selectedArticle.signs_to_look_for && selectedArticle.signs_to_look_for.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-[#F8FAFC] text-sm sm:text-base mb-2">
                  Signs To Look For:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-[#CBD5E1] list-disc list-inside">
                  {selectedArticle.signs_to_look_for.map((sign, i) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step-by-Step Instructions */}
            {selectedArticle.steps && selectedArticle.steps.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold text-[#F8FAFC] text-base mb-3">
                  Step-by-Step Instructions:
                </h4>
                <div className="space-y-4">
                  {selectedArticle.steps.map((st) => (
                    <div key={st.step} className="p-4 rounded-xl border border-[#334155] bg-[#151F32]">
                      <div className="flex items-center gap-2 font-bold text-[#F8FAFC] text-sm mb-1">
                        <span className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs">
                          {st.step}
                        </span>
                        <span>{st.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-[#CBD5E1] pl-7 mb-1.5">
                        {st.instruction}
                      </p>
                      <p className="text-[11px] text-[#94A3B8] pl-7 italic">
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
                <h4 className="font-bold text-[#F8FAFC] text-sm sm:text-base mb-1">
                  Expected Results:
                </h4>
                <p className="text-xs sm:text-sm text-[#CBD5E1]">
                  {selectedArticle.expected_results}
                </p>
              </div>
            )}

            {/* When to Contact a Technician */}
            {selectedArticle.technician_trigger && (
              <div className="p-4 rounded-xl bg-[#0B1120] border border-[#334155] text-xs sm:text-sm text-[#CBD5E1]">
                <span className="font-bold text-[#FBBF24] block mb-1">When To Contact a Technician:</span>
                {selectedArticle.technician_trigger}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
