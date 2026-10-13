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
}

export const KnowledgeView: React.FC<KnowledgeViewProps> = ({ onLaunchInteractive }) => {
  const [allArticles, setAllArticles] = useState<KnowledgeArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  const categories = [
    'All',
    'Battery & Power',
    'Internet & Network',
    'System Performance',
    'Software & Apps',
    'Printers & Devices',
    'Programming & Databases',
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
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Knowledge Base & Interactive Library</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Easy-To-Understand IT Guides
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Search any tech problem. Read through simple solutions, or ask TechResolve AI to guide you through it step-by-step.
        </p>
      </div>

      {/* Search Box */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What problem are you experiencing?"
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-800 placeholder-slate-400 text-sm sm:text-base shadow-xs focus:outline-blue-600 focus:border-blue-600 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
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
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shrink-0 transition ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">
          Loading guides...
        </div>
      ) : filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-slate-600 text-base font-semibold mb-2">No matching guides found.</p>
          <p className="text-xs text-slate-400">Try searching for simpler words like "battery", "wifi", or "slow".</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <div
              key={art.id}
              onClick={() => handleOpenArticle(art.id)}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-blue-400 hover:shadow-md transition cursor-pointer flex flex-col group text-left"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                  {art.category}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {art.estimated_time}
                </span>
              </div>

              <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2 group-hover:text-blue-600 transition leading-snug">
                {art.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-500 line-clamp-3 mb-6 flex-1 leading-relaxed">
                {art.summary}
              </p>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Read guide & fix</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-slate-900/20 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl relative text-left">
            
            {/* Close Button */}
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Category & Time */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {selectedArticle.category}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5" />
                {selectedArticle.estimated_time} read
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              {selectedArticle.title}
            </h2>

            {/* Interactive Troubleshooting CTA Button */}
            <div className="p-4 sm:p-5 rounded-2xl bg-blue-600 text-white mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div>
                <h4 className="font-bold text-base flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-200" />
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
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-blue-700 font-bold text-xs sm:text-sm shadow-xs hover:bg-blue-50 transition shrink-0 cursor-pointer"
              >
                <span>Guide Me Interactively</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Safety Warning */}
            {selectedArticle.safety_warning && (
              <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
                <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Safety Warning: </span>
                  {selectedArticle.safety_warning}
                </div>
              </div>
            )}

            {/* Common Reasons */}
            {selectedArticle.common_causes && selectedArticle.common_causes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
                  Common Reasons It Happens:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                  {selectedArticle.common_causes.map((cause, i) => (
                    <li key={i}>{cause}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Signs to look for */}
            {selectedArticle.signs_to_look_for && selectedArticle.signs_to_look_for.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-2">
                  Signs To Look For:
                </h4>
                <ul className="space-y-1.5 text-xs sm:text-sm text-slate-600 list-disc list-inside">
                  {selectedArticle.signs_to_look_for.map((sign, i) => (
                    <li key={i}>{sign}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step-by-Step Instructions */}
            {selectedArticle.steps && selectedArticle.steps.length > 0 && (
              <div className="mb-8">
                <h4 className="font-bold text-slate-900 text-base mb-3">
                  Step-by-Step Instructions:
                </h4>
                <div className="space-y-4">
                  {selectedArticle.steps.map((st) => (
                    <div key={st.step} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
                      <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-1">
                        <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs">
                          {st.step}
                        </span>
                        <span>{st.title}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-700 pl-7 mb-1.5">
                        {st.instruction}
                      </p>
                      <p className="text-[11px] text-slate-500 pl-7 italic">
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
                <h4 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                  Expected Results:
                </h4>
                <p className="text-xs sm:text-sm text-slate-600">
                  {selectedArticle.expected_results}
                </p>
              </div>
            )}

            {/* When to Contact a Technician */}
            {selectedArticle.technician_trigger && (
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs sm:text-sm text-slate-700">
                <span className="font-bold text-slate-900 block mb-1">When To Contact a Technician:</span>
                {selectedArticle.technician_trigger}
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
