import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Youtube, 
  Heart, 
  Share2, 
  Clock, 
  Eye, 
  Search, 
  X, 
  Sparkles, 
  ArrowLeft,
  ArrowRight,
  TrendingUp,
  Flame,
  Calendar,
  Layers,
  HelpCircle
} from "lucide-react";
import { Short } from "../types";

interface ShortsLibraryProps {
  shorts: Short[];
  bookmarks: string[];
  onBookmarkToggle: (shortId: string) => void;
  isLoading?: boolean;
}

// All requested chips
const CHIP_FILTERS = [
  "All",
  "Life Reality",
  "Psychology",
  "Sanatan",
  "Moh Maya",
  "Mindset",
  "Motivation",
  "Latest",
  "Most Viewed"
];

// Helper to determine category dynamically based on text keywords for smart tagging
const getShortCategory = (title: string): string => {
  const t = title.toLowerCase();
  if (t.includes("ब्रह्मचर्य") || t.includes("brahmacharya") || t.includes("moh") || t.includes("maya") || t.includes("मोह") || t.includes("माया") || t.includes("स्त्री") || t.includes("अट्रैक्शन") || t.includes("attraction")) {
    return "Moh Maya";
  }
  if (t.includes("सनातन") || t.includes("धर्म") || t.includes("sanatan") || t.includes("dharma") || t.includes("krishna") || t.includes("gita") || t.includes("कृष्ण") || t.includes("गीता") || t.includes("shiva") || t.includes("शिव")) {
    return "Sanatan";
  }
  if (t.includes("मन") || t.includes("सोच") || t.includes("mind") || t.includes("brain") || t.includes("विचार") || t.includes("बुद्धि")) {
    return "Mindset";
  }
  if (t.includes("मनोविज्ञान") || t.includes("psychology") || t.includes("साइकोलॉजी") || t.includes("human behavior")) {
    return "Psychology";
  }
  if (t.includes("प्रेरणा") || t.includes("ऊर्जा") || t.includes("शक्ति") || t.includes("motivation") || t.includes("सफलता") || t.includes("success") || t.includes("जीत")) {
    return "Motivation";
  }
  if (t.includes("कठिन") || t.includes("सच्चाई") || t.includes("life") || t.includes("reality") || t.includes("सत्य") || t.includes("समय")) {
    return "Life Reality";
  }
  return "Mindset"; // Default fallback
};

// Helper to convert views string (e.g. "1.2M", "50K", "150K views") to numeric value for sorting
const parseShortViews = (viewsStr: string): number => {
  if (!viewsStr) return 0;
  const clean = viewsStr.toLowerCase().replace(/views|दृश्य/g, "").trim();
  if (clean.includes("m")) {
    return parseFloat(clean) * 1000000;
  }
  if (clean.includes("k")) {
    return parseFloat(clean) * 1000;
  }
  const parsed = parseInt(clean.replace(/,/g, ""));
  return isNaN(parsed) ? 0 : parsed;
};

export default function ShortsLibrary({
  shorts,
  bookmarks,
  onBookmarkToggle,
  isLoading = false
}: ShortsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [sortBy, setSortBy] = useState<"date" | "views">("date");
  const [visibleCount, setVisibleCount] = useState(10);
  const [isLiftingMore, setIsLiftingMore] = useState(false);
  const [activeShortIndex, setActiveShortIndex] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto show a beautiful premium floating glass toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  // Synchronize dynamic active chips with filtering and sorting
  const handleChipClick = (chip: string) => {
    setActiveChip(chip);
    if (chip === "Latest") {
      setSortBy("date");
    } else if (chip === "Most Viewed") {
      setSortBy("views");
    }
  };

  // Get categorized version of all shorts
  const categorizedShorts = useMemo(() => {
    return shorts.map(s => ({
      ...s,
      category: getShortCategory(s.title),
      duration: "0:59", // All shorts are under 1 minute
    }));
  }, [shorts]);

  // Apply filters & search logic
  const processedShorts = useMemo(() => {
    let result = [...categorizedShorts];

    // 1. Search Query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => 
        s.title.toLowerCase().includes(q) || 
        s.category.toLowerCase().includes(q)
      );
    }

    // 2. Category Filters (excluding 'Latest', 'Most Viewed', 'All')
    if (activeChip !== "All" && activeChip !== "Latest" && activeChip !== "Most Viewed") {
      result = result.filter(s => s.category.toLowerCase() === activeChip.toLowerCase());
    }

    // 3. Sorting logic
    if (activeChip === "Most Viewed" || sortBy === "views") {
      result.sort((a, b) => parseShortViews(b.views) - parseShortViews(a.views));
    } else {
      // Default to "Latest": newest upload date first
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    return result;
  }, [categorizedShorts, searchQuery, activeChip, sortBy]);

  // Latest uploaded short highlight for stats overview
  const latestShort = useMemo(() => {
    if (shorts.length === 0) return null;
    const sorted = [...shorts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[0];
  }, [shorts]);

  // Infinite Scroll Trigger
  const handleLoadMore = () => {
    setIsLiftingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 10);
      setIsLiftingMore(false);
    }, 700);
  };

  // Copy share link helper
  const handleShare = (youtubeId: string) => {
    const url = `https://youtube.com/shorts/${youtubeId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => triggerToast("Short Link Copied to Clipboard! 🔗"))
        .catch(() => triggerToast("Failed to copy link."));
    } else {
      triggerToast("Sharing not supported in this browser.");
    }
  };

  // Navigation helpers for Modal Player
  const handleNextShort = () => {
    if (activeShortIndex !== null && activeShortIndex < processedShorts.length - 1) {
      setActiveShortIndex(activeShortIndex + 1);
    } else {
      triggerToast("You've reached the end of the stack!");
    }
  };

  const handlePrevShort = () => {
    if (activeShortIndex !== null && activeShortIndex > 0) {
      setActiveShortIndex(activeShortIndex - 1);
    } else {
      triggerToast("This is the first Short in the stack!");
    }
  };

  const currentPlayingShort = activeShortIndex !== null ? processedShorts[activeShortIndex] : null;

  return (
    <div className="space-y-12 animate-fade-in" id="shorts-library-root">
      
      {/* 1. Page Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/60 via-black to-zinc-950 border border-white/5 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        {/* Cinematic Backdrop Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
              <span className="text-white/80 text-xs font-mono font-bold uppercase tracking-wider">
                {shorts.length} Spiritual Shorts Available
              </span>
            </div>

            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-sans flex items-center gap-2.5">
              <span>Shorts</span>
              <span className="text-xs bg-red-600 text-white font-mono px-2 py-0.5 rounded-md uppercase animate-bounce">
                Hot
              </span>
            </h2>
            <p className="text-white/60 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
              Quick wisdom for everyday life. Master your mind, conquer your desires, and discover ancient truth in under 60 seconds.
            </p>
          </div>

          {/* Quick Metrics & Info Stats Panel */}
          <div className="grid grid-cols-2 gap-4 sm:w-80 flex-shrink-0">
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Total Shorts</span>
              <span className="text-2xl font-black text-[#D4AF37] font-sans">{shorts.length}</span>
            </div>
            
            <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-1">
              <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Latest Release</span>
              <span className="text-xs font-black text-white line-clamp-1" title={latestShort?.title || ""}>
                {latestShort ? latestShort.title : "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Search Input and Custom Horizontal Filters */}
        <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          
          {/* Filters Horizontal Scroller */}
          <div className="flex flex-wrap gap-2 items-center flex-grow">
            {CHIP_FILTERS.map((chip) => {
              const isActive = activeChip === chip;
              return (
                <button
                  key={chip}
                  onClick={() => handleChipClick(chip)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "bg-red-600 text-white shadow-lg shadow-red-600/10 scale-102 font-black"
                      : "bg-zinc-950/70 border border-white/5 text-white/75 hover:text-white hover:border-white/20"
                  } clickable`}
                >
                  <span>{chip}</span>
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80 flex-shrink-0">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500/60 w-4 h-4" />
            <input
              type="text"
              placeholder="Search shorts by keyword or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/90 border border-white/10 hover:border-white/20 focus:border-red-600 rounded-2xl py-3.5 pl-11 pr-10 text-xs text-white placeholder-white/40 focus:ring-1 focus:ring-red-600 outline-none transition-all duration-300"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white p-1 rounded-full transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 2. Vertically Formatted Grid Layout (5 columns on desktop, 4 on tablet, 2 on mobile) */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
            <Flame className="w-4 h-4 text-red-500" />
            <span>{activeChip === "All" ? "Trending Shorts Feed" : `${activeChip} Shorts`}</span>
          </h3>
          <span className="text-[10px] text-white/30 font-mono">
            Showing {Math.min(visibleCount, processedShorts.length)} of {processedShorts.length} Shorts
          </span>
        </div>

        {isLoading ? (
          /* Premium Shimmer Skeleton Grid for 9:16 Aspect ratio */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="bg-zinc-900/30 rounded-2xl border border-white/5 p-3 space-y-4 animate-pulse aspect-[9/16] flex flex-col justify-end">
                <div className="h-4 bg-white/10 rounded-md w-3/4" />
                <div className="h-3 bg-white/5 rounded-md w-1/2" />
              </div>
            ))}
          </div>
        ) : processedShorts.length === 0 ? (
          /* Empty State Illustration with customized search-reset button */
          <div className="text-center py-24 bg-zinc-950/30 border border-white/5 rounded-3xl p-8 max-w-md mx-auto space-y-6">
            <div className="w-20 h-20 bg-red-600/10 rounded-full flex items-center justify-center mx-auto text-red-500">
              <HelpCircle className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-white">No Shorts Available</h4>
              <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
                No Shorts matched your current criteria or query. Reset filters or search parameters to discover more.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setActiveChip("All");
                setSortBy("date");
              }}
              className="px-5 py-2.5 bg-white/5 hover:bg-red-600 text-white font-bold text-xs rounded-xl border border-white/10 hover:border-transparent transition-all duration-300 clickable"
            >
              Show All Shorts
            </button>
          </div>
        ) : (
          /* 5 Columns Grid on desktop, 4 on tablet, 2 on mobile with perfect spacing */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
            {processedShorts.slice(0, visibleCount).map((s, index) => {
              const isBookmarked = bookmarks.includes(s.id);
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.04, 0.4) }}
                  className="group relative aspect-[9/16] rounded-2xl overflow-hidden bg-black border border-white/5 hover:border-red-600/30 shadow-2xl flex flex-col justify-end transition-all duration-500"
                >
                  {/* Aspect Ratio 9:16 Thumbnail */}
                  <img
                    src={`https://img.youtube.com/vi/${s.youtubeId}/maxresdefault.jpg`}
                    alt={s.title}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-103 group-hover:opacity-90 transition-all duration-750 ease-out"
                    onError={(e) => {
                      e.currentTarget.src = `https://img.youtube.com/vi/${s.youtubeId}/hqdefault.jpg`;
                    }}
                  />
                  
                  {/* Visual Premium Card Gradients & Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/30 opacity-100 group-hover:via-black/15 transition-all duration-500 pointer-events-none" />

                  {/* Corner Ribbon Tags (Category & Date) */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1 items-start">
                    <span className="bg-red-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-md">
                      {s.category}
                    </span>
                    {latestShort?.id === s.id && (
                      <span className="bg-[#D4AF37] text-black text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md shadow-md">
                        Latest
                      </span>
                    )}
                  </div>

                  {/* Bookmark Option top right */}
                  <div className="absolute top-3 right-3 z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookmarkToggle(s.id);
                        if (!isBookmarked) {
                          triggerToast("Short saved to your bookmarks! 🔖");
                        } else {
                          triggerToast("Removed Short from bookmarks.");
                        }
                      }}
                      className="p-2 bg-black/60 hover:bg-black/85 border border-white/10 rounded-full text-white hover:text-red-500 transition-colors duration-300 clickable"
                      title={isBookmarked ? "Remove Bookmark" : "Save Short"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isBookmarked ? "fill-red-500 text-red-500" : "text-white"}`} />
                    </button>
                  </div>

                  {/* Action Floating Buttons Overlay - visible on hover or mobile click */}
                  <div className="absolute inset-0 flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 bg-black/60 transition-opacity duration-300 z-20 gap-3.5 p-4">
                    <button
                      onClick={() => setActiveShortIndex(index)}
                      className="w-full py-2.5 bg-red-600 text-white hover:bg-white hover:text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 clickable"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch</span>
                    </button>

                    <a
                      href={`https://youtube.com/shorts/${s.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 clickable"
                    >
                      <Youtube className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                      <span>YouTube</span>
                    </a>

                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => {
                          onBookmarkToggle(s.id);
                          triggerToast(isBookmarked ? "Removed from bookmarks." : "Saved Short! 🔖");
                        }}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white flex items-center justify-center clickable"
                        title="Bookmark"
                      >
                        <Heart className={`w-3.5 h-3.5 ${isBookmarked ? "fill-red-500 text-red-500" : ""}`} />
                      </button>
                      <button
                        onClick={() => handleShare(s.youtubeId)}
                        className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white flex items-center justify-center clickable"
                        title="Share link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Short Title & metadata footer */}
                  <div className="relative z-10 p-4 space-y-2 pointer-events-auto">
                    <h4 className="text-[11px] md:text-xs font-black text-white leading-snug line-clamp-2 select-text">
                      {s.title}
                    </h4>

                    {/* Metadata indicators */}
                    <div className="flex items-center justify-between text-[9px] text-white/50 font-mono border-t border-white/5 pt-2">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#D4AF37]" />
                        <span>{s.views}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-red-500" />
                        <span>{s.date}</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More Button */}
        {processedShorts.length > visibleCount && (
          <div className="text-center pt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLiftingMore}
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:border-red-500/50 rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-102 flex items-center gap-2.5 mx-auto clickable disabled:opacity-50"
            >
              {isLiftingMore ? (
                <>
                  <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <span>Fetching Shorts...</span>
                </>
              ) : (
                <span>Load More Shorts</span>
              )}
            </button>
          </div>
        )}
      </div>

      {/* 3. Interactive Fullscreen YouTube Shorts Modal with Stack Traversal */}
      <AnimatePresence>
        {currentPlayingShort && activeShortIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-6"
            onClick={() => setActiveShortIndex(null)}
          >
            {/* Modal Box */}
            <motion.div
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-sm md:max-w-md aspect-[9/16] max-h-[85vh] bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header inside Modal */}
              <div className="absolute top-0 inset-x-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex items-center justify-between z-50">
                <div className="flex items-center gap-2.5">
                  <span className="bg-red-600 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {currentPlayingShort.category}
                  </span>
                  <span className="text-[10px] text-white/50 font-mono">
                    {activeShortIndex + 1} / {processedShorts.length}
                  </span>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={() => setActiveShortIndex(null)}
                  className="p-1.5 bg-black/50 hover:bg-black border border-white/10 hover:border-white/30 rounded-full text-white transition-all clickable"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* YouTube Shorts Embed Player Container */}
              <div className="flex-grow bg-black relative">
                <iframe
                  key={currentPlayingShort.youtubeId}
                  src={`https://www.youtube.com/embed/${currentPlayingShort.youtubeId}?autoplay=1&loop=1&playlist=${currentPlayingShort.youtubeId}&modestbranding=1&rel=0`}
                  title={currentPlayingShort.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full object-cover border-0"
                />
              </div>

              {/* Title Overlay in Modal Player */}
              <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/95 via-black/80 to-transparent text-white space-y-3 z-40">
                <h4 className="text-xs md:text-sm font-black leading-snug">
                  {currentPlayingShort.title}
                </h4>
                
                {/* View/Likes metadata */}
                <div className="flex items-center justify-between text-[10px] text-white/50 font-mono">
                  <span>👀 {currentPlayingShort.views} views</span>
                  <span>❤️ {currentPlayingShort.likes} likes</span>
                </div>

                {/* Sub Action controls inside Modal */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/5">
                  <button
                    onClick={() => {
                      onBookmarkToggle(currentPlayingShort.id);
                      triggerToast(bookmarks.includes(currentPlayingShort.id) ? "Removed from bookmarks." : "Saved Short! 🔖");
                    }}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 clickable"
                  >
                    <Heart className={`w-3.5 h-3.5 ${bookmarks.includes(currentPlayingShort.id) ? "fill-red-500 text-red-500" : ""}`} />
                    <span>{bookmarks.includes(currentPlayingShort.id) ? "Saved" : "Save"}</span>
                  </button>

                  <button
                    onClick={() => handleShare(currentPlayingShort.youtubeId)}
                    className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 clickable"
                  >
                    <Share2 className="w-3.5 h-3.5 text-blue-400" />
                    <span>Share</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Immersive Navigation Side Controls */}
            <div className="fixed inset-y-0 left-4 md:left-12 flex items-center z-50 pointer-events-none">
              <button
                disabled={activeShortIndex === 0}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevShort();
                }}
                className="w-12 h-12 md:w-14 md:h-14 bg-black/60 hover:bg-black border border-white/10 hover:border-red-500/50 rounded-full flex items-center justify-center text-white transition-all pointer-events-auto disabled:opacity-20 clickable"
                title="Previous Short"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            <div className="fixed inset-y-0 right-4 md:right-12 flex items-center z-50 pointer-events-none">
              <button
                disabled={activeShortIndex === processedShorts.length - 1}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNextShort();
                }}
                className="w-12 h-12 md:w-14 md:h-14 bg-black/60 hover:bg-black border border-white/10 hover:border-red-500/50 rounded-full flex items-center justify-center text-white transition-all pointer-events-auto disabled:opacity-20 clickable"
                title="Next Short"
              >
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating glass Toast alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[99999] max-w-sm rounded-2xl bg-zinc-900/90 border border-red-500/20 p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-red-600/10 flex items-center justify-center text-red-500">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
