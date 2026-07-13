import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Youtube, 
  Heart, 
  Share2, 
  Clock, 
  Eye, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  Sparkles, 
  BookMarked, 
  ArrowRight,
  Bookmark,
  Calendar,
  X,
  Check,
  AlertCircle
} from "lucide-react";
import { Video } from "../types";

interface VideoLibraryProps {
  videos: Video[];
  bookmarks: string[];
  onBookmarkToggle: (videoId: string) => void;
  onWatchVideo: (youtubeId: string) => void;
  isLoading?: boolean;
}

// Categories list as requested
const FILTER_CATEGORIES = [
  "All",
  "Life Reality",
  "Psychology",
  "Sanatan",
  "Moh Maya",
  "Bhagavad Gita",
  "Mindset",
  "Self Discipline",
  "Motivation"
];

// Helper to convert views string (e.g., "1.2M", "50K", "150K", "2.1M views") to numeric value for sorting
const parseViews = (viewsStr: string): number => {
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

// Helper to check if category matching is successful
const matchCategory = (videoCategory: string, selectedCategory: string, videoTitle: string): boolean => {
  if (selectedCategory === "All") return true;
  
  const vCat = videoCategory.toLowerCase().trim();
  const sCat = selectedCategory.toLowerCase().trim();
  const title = videoTitle.toLowerCase();
  
  if (sCat === "life reality") {
    return vCat.includes("life") || vCat.includes("reality");
  }
  if (sCat === "moh maya") {
    return vCat.includes("brahmacharya") || vCat.includes("moh") || vCat.includes("maya") || title.includes("ब्रह्मचर्य") || title.includes("मोह") || title.includes("माया");
  }
  if (sCat === "sanatan") {
    return vCat.includes("sanatan") || vCat.includes("dharma") || title.includes("सनातन") || title.includes("धर्म");
  }
  if (sCat === "mindset") {
    return vCat.includes("mind") || vCat.includes("science") || title.includes("मन") || title.includes("बुद्धि") || title.includes("सोच");
  }
  if (sCat === "motivation") {
    return vCat.includes("motivation") || title.includes("motivation") || title.includes("प्रेरणा") || title.includes("ऊर्जा") || title.includes("शक्ति") || title.includes("कठिन");
  }
  
  return vCat.includes(sCat) || sCat.includes(vCat);
};

// Helper to parse Episode Badge if applicable
const getEpisodeBadge = (title: string): string | null => {
  const match = title.match(/(?:Episode|Ep|भाग)\s*([0-9\u0966-\u096f]+)/i);
  if (match) {
    const num = match[1];
    return `EPISODE ${num}`;
  }
  return null;
};

export default function VideoLibrary({ 
  videos, 
  bookmarks, 
  onBookmarkToggle, 
  onWatchVideo,
  isLoading = false 
}: VideoLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"Latest" | "Most Viewed" | "Episodes">("Latest");
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLiftingMore, setIsLiftingMore] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Custom interactive dropdown states for sorting
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sorting dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Show a premium dynamic slide toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter and Sort logic
  const processedVideos = useMemo(() => {
    let result = [...videos];

    // 1. Apply category filter
    if (selectedCategory !== "All") {
      result = result.filter(v => matchCategory(v.category, selectedCategory, v.title));
    }

    // 2. Apply search query
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(v => 
        v.title.toLowerCase().includes(q) || 
        v.description.toLowerCase().includes(q) || 
        v.category.toLowerCase().includes(q) ||
        (getEpisodeBadge(v.title)?.toLowerCase() || "").includes(q)
      );
    }

    // 3. Apply sorting
    if (sortBy === "Latest") {
      // Sort by date descending
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "Most Viewed") {
      // Sort by view count descending
      result.sort((a, b) => parseViews(b.views) - parseViews(a.views));
    } else if (sortBy === "Episodes") {
      // Show videos with episodes first, and sort by episode number descending
      result.sort((a, b) => {
        const epA = a.title.match(/(?:Episode|Ep|भाग)\s*([0-9\u0966-\u096f]+)/i);
        const epB = b.title.match(/(?:Episode|Ep|भाग)\s*([0-9\u0966-\u096f]+)/i);
        if (epA && !epB) return -1;
        if (!epA && epB) return 1;
        if (epA && epB) {
          return parseInt(epB[1]) - parseInt(epA[1]);
        }
        return 0;
      });
    }

    return result;
  }, [videos, selectedCategory, searchQuery, sortBy]);

  // Featured video selection: Auto fetch latest uploaded long-form video (first video in general)
  const featuredVideo = useMemo(() => {
    if (videos.length === 0) return null;
    // Standard sorting to grab the latest uploaded long-form
    const sorted = [...videos].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return sorted[0];
  }, [videos]);

  // Reset pagination when filter/search changes
  useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory, searchQuery, sortBy]);

  // Handle load more
  const handleLoadMore = () => {
    setIsLiftingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 8);
      setIsLiftingMore(false);
    }, 800);
  };

  // Copy share link helper
  const handleShare = (videoId: string, title: string) => {
    const url = `https://youtube.com/watch?v=${videoId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => triggerToast("Copied YouTube Link to Clipboard! 🔗"))
        .catch(() => triggerToast("Failed to copy link."));
    } else {
      triggerToast("Sharing not supported in this browser context.");
    }
  };

  return (
    <div className="space-y-12" id="video-library-root">
      
      {/* 1. Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-zinc-900/40 via-black/80 to-zinc-900/40 border border-white/5 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-red-500/5 rounded-full blur-[90px] pointer-events-none" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 z-10">
          <div className="space-y-3.5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
              <span className="text-[#D4AF37] text-xs font-mono font-black uppercase tracking-wider">
                {processedVideos.length} Videos Available
              </span>
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-sans">
              Video <span className="bg-gradient-to-r from-[#D4AF37] via-[#fceab2] to-[#b89014] bg-clip-text text-transparent">Library</span>
            </h2>
            <p className="text-white/60 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
              Watch every Apna Sooch video in one place. Explore absolute reality of mind, ancient wisdom, life guidance and self-mastery.
            </p>
          </div>

          {/* Interactive Search & Filter Controls Panel */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Search Bar */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by title, description, episode..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-950/90 border border-white/10 hover:border-white/25 focus:border-[#D4AF37] rounded-2xl py-3.5 pl-11 pr-10 text-xs text-white placeholder-white/40 focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all duration-300"
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

            {/* Custom Premium Sorting Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center justify-between gap-3 bg-zinc-950/90 hover:bg-zinc-900 border border-white/10 hover:border-white/20 rounded-2xl px-5 py-3.5 text-xs font-bold text-white transition-all duration-300"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#D4AF37]" />
                <span>Sort: {sortBy}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-white/40 transition-transform duration-300 ${isSortOpen ? "rotate-185" : ""}`} />
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2.5 w-48 rounded-2xl bg-zinc-950 border border-white/10 p-2 shadow-2xl z-[500] backdrop-blur-xl"
                  >
                    {(["Latest", "Most Viewed", "Episodes"] as const).map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setSortBy(option);
                          setIsSortOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-medium transition-colors flex items-center justify-between ${
                          sortBy === option 
                            ? "bg-[#D4AF37]/10 text-[#D4AF37] font-bold" 
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span>{option}</span>
                        {sortBy === option && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Categories Horizontal Filter Chips */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap gap-2.5 items-center">
          <span className="text-white/40 text-[10px] font-bold uppercase tracking-wider mr-2">Filters:</span>
          <div className="flex flex-wrap gap-2">
            {FILTER_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 relative overflow-hidden ${
                    isActive
                      ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 scale-102"
                      : "bg-zinc-950/65 border border-white/5 text-white/70 hover:text-white hover:border-white/15"
                  } clickable`}
                >
                  <span>{category}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Featured Video Cinematic Hero */}
      {featuredVideo && selectedCategory === "All" && !searchQuery && (
        <div className="space-y-4" id="premium-featured-banner">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <h3 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Featured Spotlight</h3>
          </div>
          
          <div className="group relative overflow-hidden rounded-3xl bg-black border border-white/10 shadow-2xl hover:border-amber-500/25 transition-all duration-500 flex flex-col lg:flex-row">
            {/* Cinematic Background Backdrop glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-transparent to-red-600/5 pointer-events-none" />
            
            {/* 16:9 Cinematic Thumbnail Container */}
            <div className="w-full lg:w-[55%] aspect-video relative overflow-hidden cursor-pointer flex-shrink-0" onClick={() => onWatchVideo(featuredVideo.youtubeId)}>
              <img
                src={`https://img.youtube.com/vi/${featuredVideo.youtubeId}/maxresdefault.jpg`}
                alt={featuredVideo.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:scale-[1.02] transition-transform duration-750 ease-out"
                onError={(e) => {
                  e.currentTarget.src = `https://img.youtube.com/vi/${featuredVideo.youtubeId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              
              {/* Premium Hover play overlay button */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-[#D4AF37] text-black flex items-center justify-center shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-300">
                  <Play className="w-6 h-6 fill-black ml-1" />
                </div>
              </div>

              {/* Dynamic Badge Overlays */}
              <div className="absolute top-4 left-4 flex gap-2">
                {getEpisodeBadge(featuredVideo.title) && (
                  <span className="bg-[#D4AF37] text-black text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {getEpisodeBadge(featuredVideo.title)}
                  </span>
                )}
                <span className="bg-black/70 border border-white/10 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                  {featuredVideo.category}
                </span>
              </div>

              {/* Views and Duration overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-3">
                <span className="flex items-center gap-1.5 bg-black/70 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-white/90 backdrop-blur-sm">
                  <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{featuredVideo.views} views</span>
                </span>
                <span className="flex items-center gap-1.5 bg-black/70 px-3 py-1.5 rounded-xl border border-white/10 text-xs text-white/90 backdrop-blur-sm">
                  <Clock className="w-3.5 h-3.5 text-red-500" />
                  <span>{featuredVideo.duration}</span>
                </span>
              </div>
            </div>

            {/* Description & metadata text */}
            <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-between flex-grow">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white/40">
                  <span>Long Form Video</span>
                  <span>•</span>
                  <span>{featuredVideo.date}</span>
                </div>

                <h4 className="text-xl md:text-2xl lg:text-3xl font-black text-white leading-snug tracking-tight hover:text-[#D4AF37] transition-colors cursor-pointer" onClick={() => onWatchVideo(featuredVideo.youtubeId)}>
                  {featuredVideo.title}
                </h4>

                <p className="text-xs md:text-sm text-white/50 leading-relaxed max-w-xl">
                  {featuredVideo.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 mt-8">
                <button
                  onClick={() => onWatchVideo(featuredVideo.youtubeId)}
                  className="flex items-center gap-2 px-6 py-3 bg-[#D4AF37] hover:bg-white text-black font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:scale-103 transition-all duration-300 clickable"
                >
                  <Play className="w-4 h-4 fill-black" />
                  <span>Watch Now</span>
                </button>

                <a
                  href={`https://youtube.com/watch?v=${featuredVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 clickable"
                >
                  <Youtube className="w-4 h-4 fill-red-600 text-red-600" />
                  <span>Watch on YouTube</span>
                </a>

                <button
                  onClick={() => onBookmarkToggle(featuredVideo.id)}
                  className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors clickable"
                  title="Bookmark Video"
                >
                  {bookmarks.includes(featuredVideo.id) ? (
                    <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  ) : (
                    <Heart className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Core Videos Grid */}
      <div className="space-y-6" id="video-grid-container">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold uppercase tracking-widest text-white/50">
            {searchQuery || selectedCategory !== "All" ? "Search Results" : "All Episodes & Lectures"}
          </h3>
          <span className="text-xs text-white/30 font-mono">Showing {Math.min(visibleCount, processedVideos.length)} of {processedVideos.length}</span>
        </div>

        {isLoading ? (
          /* Shimmer Skeleton Loaders */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
              <div key={idx} className="bg-zinc-900/30 rounded-2xl border border-white/5 p-3.5 space-y-4 animate-pulse">
                <div className="aspect-video bg-white/5 rounded-xl" />
                <div className="h-4 bg-white/10 rounded-md w-3/4" />
                <div className="h-3 bg-white/5 rounded-md w-1/2" />
                <div className="space-y-1">
                  <div className="h-2 bg-white/5 rounded-md w-full" />
                  <div className="h-2 bg-white/5 rounded-md w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : processedVideos.length === 0 ? (
          /* Empty State Illustration as requested */
          <div className="text-center py-20 bg-zinc-950/40 border border-white/5 rounded-3xl p-8 max-w-lg mx-auto space-y-6">
            <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
              <AlertCircle className="w-10 h-10 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-black text-white">No videos found</h4>
              <p className="text-xs text-white/50 leading-relaxed max-w-sm mx-auto">
                No matching videos found for your search or category selection. Try using different keywords or resetting filters.
              </p>
            </div>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSortBy("Latest");
              }}
              className="px-5 py-2.5 bg-white/5 hover:bg-[#D4AF37] text-white hover:text-black font-bold text-xs rounded-xl border border-white/10 hover:border-transparent transition-all duration-300 clickable"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Responsive Video Grid (4 on desktop, 3 on tablet, 2 on mobile) */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {processedVideos.slice(0, visibleCount).map((v, index) => {
              const isBookmarked = bookmarks.includes(v.id);
              const episodeBadgeText = getEpisodeBadge(v.title);
              
              return (
                <motion.div
                  key={v.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
                  className="group bg-white/[0.02] backdrop-blur-md border border-white/5 hover:border-amber-500/20 hover:bg-white/[0.04] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-500 relative"
                >
                  {/* Thumbnail Wrapper */}
                  <div 
                    className="relative aspect-video bg-black overflow-hidden cursor-pointer"
                    onClick={() => onWatchVideo(v.youtubeId)}
                  >
                    <img 
                      src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`} 
                      alt={v.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 ease-out" 
                    />
                    
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/35 pointer-events-none" />

                    {/* Duration Badge */}
                    <span className="absolute bottom-2.5 right-2.5 bg-black/85 border border-white/5 text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                      {v.duration}
                    </span>

                    {/* Top Corner Badge for Episode (if applicable) */}
                    {episodeBadgeText && (
                      <span className="absolute top-2.5 left-2.5 bg-[#D4AF37] text-black text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-md">
                        {episodeBadgeText}
                      </span>
                    )}

                    {/* Save bookmark inside thumbnail corner */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookmarkToggle(v.id);
                        if (!isBookmarked) {
                          triggerToast("Added to Bookmarks! 🔖");
                        } else {
                          triggerToast("Removed from Bookmarks.");
                        }
                      }}
                      className="absolute top-2.5 right-2.5 p-2 bg-black/60 hover:bg-black/90 border border-white/5 hover:border-[#D4AF37]/40 rounded-full text-white transition-all duration-300 clickable"
                      title={isBookmarked ? "Remove Bookmark" : "Save to Bookmarks"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isBookmarked ? "fill-red-500 text-red-500" : "text-white"}`} />
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 flex-grow flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[#D4AF37] text-[9px] font-black uppercase tracking-wider bg-[#D4AF37]/5 px-2 py-0.5 rounded-md border border-[#D4AF37]/10">
                          {v.category}
                        </span>
                      </div>
                      
                      <h4 
                        onClick={() => onWatchVideo(v.youtubeId)}
                        className="text-xs md:text-sm font-bold text-white leading-snug line-clamp-2 hover:text-[#D4AF37] transition-colors cursor-pointer"
                        title={v.title}
                      >
                        {v.title}
                      </h4>

                      <p className="text-[11px] text-white/55 leading-relaxed line-clamp-2">
                        {v.description}
                      </p>
                    </div>

                    {/* Metadata Footer */}
                    <div className="flex items-center justify-between pt-2.5 border-t border-white/5 text-[10px] text-white/40 font-mono">
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3 text-[#D4AF37]" />
                        <span>{v.views} views</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{v.date}</span>
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Action Buttons Overlay */}
                  <div className="grid grid-cols-4 border-t border-white/5 divide-x divide-white/5">
                    {/* Watch on-site button */}
                    <button
                      onClick={() => onWatchVideo(v.youtubeId)}
                      className="bg-white/[0.01] hover:bg-[#D4AF37] text-white hover:text-black py-2.5 transition-all flex items-center justify-center gap-1.5 clickable col-span-2 text-xs font-bold"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Watch</span>
                    </button>

                    {/* YouTube redirect button */}
                    <a
                      href={`https://youtube.com/watch?v=${v.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white/[0.01] hover:bg-white/10 text-white/75 hover:text-white py-2.5 transition-all flex items-center justify-center clickable"
                      title="Watch on YouTube"
                    >
                      <Youtube className="w-3.5 h-3.5 fill-red-600 text-red-600" />
                    </a>

                    {/* Copy Share Link button */}
                    <button
                      onClick={() => handleShare(v.youtubeId, v.title)}
                      className="bg-white/[0.01] hover:bg-white/10 text-white/75 hover:text-white py-2.5 transition-all flex items-center justify-center clickable"
                      title="Copy Share Link"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Load More Button or Skeleton Simulator */}
        {processedVideos.length > visibleCount && (
          <div className="text-center pt-8">
            <button
              onClick={handleLoadMore}
              disabled={isLiftingMore}
              className="px-8 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:border-[#D4AF37]/50 rounded-2xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 hover:scale-102 flex items-center gap-2.5 mx-auto clickable disabled:opacity-50"
            >
              {isLiftingMore ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin" />
                  <span>Loading More...</span>
                </>
              ) : (
                <>
                  <span>Load More Videos</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Slide Glass Toast Alerts */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-[99999] max-w-sm rounded-2xl bg-zinc-900/90 border border-[#D4AF37]/20 p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3"
          >
            <div className="w-8 h-8 rounded-full bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs font-bold text-white">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
