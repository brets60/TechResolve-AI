import React from 'react';
import { 
  X, 
  ExternalLink, 
  Sparkles, 
  Clock, 
  Search, 
  CheckCircle2,
  Tv
} from 'lucide-react';
import { VideoTutorial } from '../services/youtubeTutorials';

interface VideoTutorialModalProps {
  tutorial: VideoTutorial;
  onClose: () => void;
  problemTitle?: string;
}

export const VideoTutorialModal: React.FC<VideoTutorialModalProps> = ({
  tutorial,
  onClose,
  problemTitle,
}) => {
  const youtubeUrl = `https://www.youtube.com/watch?v=${tutorial.videoId}`;
  const youtubeSearchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(tutorial.searchQuery)}`;
  const embedUrl = `https://www.youtube.com/embed/${tutorial.videoId}?rel=0&modestbranding=1`;

  return (
    <div 
      className="fixed inset-0 z-50 bg-[#0F172A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-[#FFFFFF] rounded-3xl border border-[#E2E8F0] max-w-3xl w-full p-4 sm:p-7 shadow-2xl relative text-left max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] border border-[#99F6E4] flex items-center justify-center text-[#0F766E] shadow-2xs">
              <Tv className="w-4 h-4 text-[#0F766E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0F766E]">
                  Video Fix Walkthrough
                </span>
                {tutorial.isDirectMatch ? (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#ECFDF5] text-[#15803D] border border-[#BBF7D0] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-[#15803D]" />
                    Verified Fix
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#B45309]" />
                    AI Recommended
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-extrabold text-[#0F172A] leading-tight line-clamp-1">
                {problemTitle || tutorial.title}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-[#64748B] hover:text-[#0F172A] hover:bg-[#FAFAF7] border border-transparent hover:border-[#E2E8F0] transition cursor-pointer shrink-0"
            aria-label="Close video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player (Responsive 16:9 iframe) */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-[#0F172A] border border-[#CBD5E1] shadow-md mb-4">
          <iframe
            src={embedUrl}
            title={tutorial.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Quick Fallback Banner if Embed is Blocked by Browser or Ad-blocker */}
        <div className="flex items-center justify-between flex-wrap gap-2 px-3.5 py-2.5 bg-[#FAFAF7] rounded-xl border border-[#E2E8F0] mb-4 text-xs text-[#64748B]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#15803D] inline-block animate-pulse"></span>
            Having issues playing embedded video?
          </span>
          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-bold text-[#0F766E] hover:text-[#115E59] hover:underline"
          >
            <span>Watch directly on YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Metadata & Creator Info */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#FAFAF7] border border-[#E2E8F0] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-[#0F766E] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              ▶
            </div>
            <div>
              <div className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5">
                <span>{tutorial.channel}</span>
                <span className="text-[10px] text-[#0F766E] bg-[#ECFDF5] border border-[#99F6E4] px-1.5 py-0.2 rounded font-semibold">
                  Verified Tech Creator
                </span>
              </div>
              {tutorial.duration && (
                <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Duration: {tutorial.duration}</span>
                </div>
              )}
            </div>
          </div>

          <a
            href={youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFFFFF] hover:bg-[#ECFDF5] text-[#0F766E] border border-[#E2E8F0] hover:border-[#0F766E] font-bold text-xs transition shadow-2xs cursor-pointer"
          >
            <span>Open in YouTube</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Explanation Summary */}
        <div className="p-3.5 rounded-2xl bg-[#ECFDF5] border border-[#99F6E4] text-xs sm:text-sm text-[#334155] mb-5 leading-relaxed">
          <strong className="text-[#0F766E] block mb-1">💡 What this video demonstrates:</strong>
          <p>{tutorial.summary}</p>
        </div>

        {/* Custom Concern Notice & YouTube Search Option */}
        {!tutorial.isDirectMatch && (
          <div className="p-4 rounded-2xl bg-[#FAFAF7] border border-[#E2E8F0] mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-[#0F172A] flex items-center gap-1.5 mb-0.5">
                <Search className="w-3.5 h-3.5 text-[#0F766E]" />
                <span>Custom Concern Search</span>
              </span>
              <p className="text-xs text-[#64748B]">
                Looking for alternative videos specifically for "<em>{problemTitle || tutorial.searchQuery}</em>"?
              </p>
            </div>

            <a
              href={youtubeSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F766E] hover:bg-[#115E59] text-white font-bold text-xs transition shadow-xs shrink-0 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search YouTube For More</span>
            </a>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] bg-[#FFFFFF] hover:bg-[#FAFAF7] text-[#475569] font-bold text-xs sm:text-sm transition cursor-pointer"
          >
            Close Video
          </button>
        </div>

      </div>
    </div>
  );
};
