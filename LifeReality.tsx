import React, { useState, useEffect, useRef } from "react";
import { 
  Play, 
  Search, 
  Bookmark, 
  Share2, 
  CheckCircle, 
  ChevronLeft, 
  ChevronRight, 
  Image as ImageIcon, 
  Quote as QuoteIcon, 
  Eye, 
  Clock, 
  Calendar, 
  Copy, 
  Check, 
  ArrowLeft, 
  Tv, 
  Activity, 
  Compass, 
  Sparkles, 
  BookmarkCheck,
  ExternalLink,
  Volume2,
  BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { RealityEpisode } from "../data/realityEpisodes";

interface LifeRealityProps {
  bookmarks: string[];
  onBookmarkToggle: (videoId: string) => void;
  episodes: RealityEpisode[];
  isLoading?: boolean;
}

export default function LifeReality({ bookmarks, onBookmarkToggle, episodes, isLoading = false }: LifeRealityProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  const [activeEpisodeId, setActiveEpisodeId] = useState<string | null>(null);
  const [copiedQuoteText, setCopiedQuoteText] = useState<string | null>(null);
  const [sharedEpisodeId, setSharedEpisodeId] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  
  // Progress states stored in local storage
  const [watchedEpisodes, setWatchedEpisodes] = useState<string[]>([]);
  const [episodeProgress, setEpisodeProgress] = useState<Record<string, number>>({});

  // Available Filter Tags
  const filterTags = [
    "All",
    "Reality",
    "Mindset",
    "Psychology",
    "Discipline",
    "Brahmacharya",
    "Life Lessons",
    "Motivation",
    "Sanatan Wisdom"
  ];

  // Load progress and continue watching states from localStorage
  useEffect(() => {
    try {
      const storedWatched = localStorage.getItem("apna_sooch_reality_watched");
      if (storedWatched) {
        setWatchedEpisodes(JSON.parse(storedWatched));
      }
      
      const storedProgress = localStorage.getItem("apna_sooch_reality_progress");
      if (storedProgress) {
        setEpisodeProgress(JSON.parse(storedProgress));
      }
    } catch (e) {
      console.error("Failed to load progress from localStorage", e);
    }
  }, []);

  // Listen for active episode redirection from Home page
  useEffect(() => {
    const redirectId = localStorage.getItem("apna_sooch_reality_active_id");
    if (redirectId) {
      setActiveEpisodeId(redirectId);
      localStorage.removeItem("apna_sooch_reality_active_id");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [episodes]);

  // Set episode as completed
  const handleToggleCompleted = (episodeId: string) => {
    setWatchedEpisodes(prev => {
      let updated;
      if (prev.includes(episodeId)) {
        updated = prev.filter(id => id !== episodeId);
      } else {
        updated = [...prev, episodeId];
      }
      localStorage.setItem("apna_sooch_reality_watched", JSON.stringify(updated));
      return updated;
    });
  };

  // Set progress for an episode
  const handleProgressChange = (episodeId: string, progress: number) => {
    setEpisodeProgress(prev => {
      const updated = { ...prev, [episodeId]: progress };
      localStorage.setItem("apna_sooch_reality_progress", JSON.stringify(updated));
      return updated;
    });

    // If progress is near complete (e.g. > 90%), auto-mark as completed
    if (progress >= 95 && !watchedEpisodes.includes(episodeId)) {
      handleToggleCompleted(episodeId);
    }
  };

  // Copy Quote Helper
  const handleCopyQuote = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedQuoteText(text);
    setTimeout(() => setCopiedQuoteText(null), 2000);
  };

  // Share Episode Helper
  const handleShareEpisode = (episode: RealityEpisode) => {
    const shareText = `Watch Episode ${episode.episodeNumber}: "${episode.title}" on Apna Sooch - "${episode.subtitle}" https://www.youtube.com/watch?v=${episode.videoId}`;
    navigator.clipboard.writeText(shareText);
    setSharedEpisodeId(episode.id);
    setTimeout(() => setSharedEpisodeId(null), 2500);
  };

  // Filtering and searching logic
  const filteredEpisodes = episodes.filter(episode => {
    const matchesSearch = 
      episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.episodeNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      episode.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = selectedTag === "All" || episode.tags.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const activeEpisode = episodes.find(ep => ep.id === activeEpisodeId) || null;

  // Calculate Season Stats
  const totalEpisodes = episodes.length;
  const completedCount = watchedEpisodes.filter(id => episodes.some(ep => ep.id === id)).length;
  const seasonProgressPercentage = totalEpisodes > 0 ? Math.round((completedCount / totalEpisodes) * 100) : 0;
  
  // Find "Continue Watching" candidate (latest incomplete episode with some progress, or default to Episode 1)
  const lastInProgressEpisode = episodes.find(ep => !watchedEpisodes.includes(ep.id) && (episodeProgress[ep.id] || 0) > 0) || episodes[0];

  return (
    <div id="life-reality-page" className="w-full min-h-screen bg-[#050505] text-white py-6 px-4 md:px-12 selection:bg-[#D4AF37] selection:text-black transition-all duration-300">
      
      {/* Lightbox Modal for gallery viewing */}
      <AnimatePresence>
        {lightboxIndex !== null && activeEpisode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md"
            onClick={() => setLightboxIndex(null)}
          >
            <button 
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors p-2 text-xl"
              onClick={() => setLightboxIndex(null)}
            >
              ✕ Close
            </button>
            <div className="max-w-4xl max-h-[80vh] flex flex-col items-center justify-center relative" onClick={e => e.stopPropagation()}>
              <img 
                src={activeEpisode.gallery[lightboxIndex].url} 
                alt={activeEpisode.gallery[lightboxIndex].caption} 
                className="max-w-full max-h-[70vh] rounded-xl border border-white/10 shadow-[0_20px_50px_rgba(212,175,55,0.15)] object-contain"
                referrerPolicy="no-referrer"
              />
              <p className="text-[#D4AF37] font-mono text-xs mt-4 uppercase tracking-widest">
                Scene {lightboxIndex + 1} of {activeEpisode.gallery.length}
              </p>
              <p className="text-white/80 font-sans text-center max-w-xl text-sm md:text-base mt-2">
                {activeEpisode.gallery[lightboxIndex].caption}
              </p>

              {/* Navigation within lightbox */}
              <button 
                className="absolute left-[-50px] top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white hidden md:block"
                onClick={() => setLightboxIndex(prev => prev !== null ? (prev - 1 + activeEpisode.gallery.length) % activeEpisode.gallery.length : null)}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button 
                className="absolute right-[-50px] top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all text-white hidden md:block"
                onClick={() => setLightboxIndex(prev => prev !== null ? (prev + 1) % activeEpisode.gallery.length : null)}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!activeEpisodeId ? (
          /* ========================================================================= */
          /*                       EPISODE LIST / DASHBOARD VIEW                      */
          /* ========================================================================= */
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-10"
          >
            {/* Header section with brand identity */}
            <div className="text-center space-y-4 pt-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/5 border border-[#D4AF37]/25 text-xs font-mono text-[#D4AF37] tracking-widest uppercase">
                <Tv className="w-3.5 h-3.5 animate-pulse" /> Documentaries
              </div>
              <h1 className="text-4xl md:text-6xl font-sans font-extrabold tracking-tight bg-gradient-to-r from-white via-white/95 to-[#D4AF37] bg-clip-text text-transparent">
                Life Reality
              </h1>
              <p className="text-white/60 text-sm md:text-lg max-w-2xl mx-auto font-sans leading-relaxed">
                Every episode reveals one truth that can change your thinking. Connect with the ultimate realities of existence through cinematic wisdom.
              </p>
            </div>

            {/* Premium Stats bar - OTT style progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-2xl bg-[#0c0c0c]/80 border border-white/5 backdrop-blur-md">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-white/55">
                  <span>SEASON 1 PROGRESS</span>
                  <span className="text-[#D4AF37]">{seasonProgressPercentage}% COMPLETED</span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div 
                    className="h-full bg-[#D4AF37] transition-all duration-700 ease-out" 
                    style={{ width: `${seasonProgressPercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-white/45 font-mono">
                  <span>{completedCount} of {totalEpisodes} Episodes Watched</span>
                  <span>Season 1</span>
                </div>
              </div>

              <div className="border-t md:border-t-0 md:border-x border-white/5 py-4 md:py-0 md:px-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-white/45 font-mono uppercase tracking-wider">Series Status</p>
                  <p className="text-lg font-sans font-bold text-white mt-1 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37]" /> Active Season
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-[11px] font-bold">
                    HD | 4K
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <p className="text-xs text-white/45 font-mono uppercase tracking-wider mb-2">Continue Watching</p>
                {lastInProgressEpisode && (
                  <button
                    onClick={() => setActiveEpisodeId(lastInProgressEpisode.id)}
                    className="group flex items-center gap-3 text-left p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D4AF37]/30 transition-all text-sm duration-300 clickable"
                  >
                    <div className="w-16 h-10 rounded bg-white/10 overflow-hidden relative flex-shrink-0">
                      <img 
                        src={lastInProgressEpisode.thumbnailImage} 
                        alt={lastInProgressEpisode.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-white font-sans font-semibold text-xs truncate leading-snug">
                        {lastInProgressEpisode.title}
                      </p>
                      <p className="text-white/45 text-[10px] font-mono mt-0.5">
                        {lastInProgressEpisode.episodeNumber} • {episodeProgress[lastInProgressEpisode.id] || 0}% watched
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </div>

            {/* Search & Filter Matrix */}
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Inputs */}
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search episode, topic, keywords..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0c0c0c]/90 border border-white/5 hover:border-white/10 focus:border-[#D4AF37]/50 focus:outline-none font-sans text-sm text-white transition-all placeholder:text-white/35"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/45 hover:text-white text-xs font-mono"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Filter Description or Quick Info */}
                <span className="text-xs font-mono text-white/45">
                  Showing {filteredEpisodes.length} of {totalEpisodes} documentary episodes
                </span>
              </div>

              {/* Tag scroll list */}
              <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
                {filterTags.map(tag => {
                  const isActive = selectedTag === tag;
                  return (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                      className={`px-4 py-1.5 rounded-full text-xs font-sans font-medium transition-all flex-shrink-0 clickable ${
                        isActive
                          ? "bg-[#D4AF37] text-black shadow-[0_4px_12px_rgba(212,175,55,0.25)] font-semibold"
                          : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Episodes Bento Grid */}
            {filteredEpisodes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredEpisodes.map((episode, idx) => {
                  const isWatched = watchedEpisodes.includes(episode.id);
                  const progress = episodeProgress[episode.id] || 0;
                  const isBookmarked = bookmarks.includes(episode.videoId);

                  return (
                    <motion.div
                      key={episode.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: idx * 0.05 }}
                      className="group flex flex-col bg-[#0b0b0b]/90 border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4AF37]/35 hover:shadow-[0_12px_30px_rgba(212,175,55,0.05)] transition-all duration-300"
                    >
                      {/* Image Thumbnail Container */}
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-neutral-900">
                        <img
                          src={episode.thumbnailImage}
                          alt={episode.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-60" />

                        {/* Badges Overlay */}
                        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                          <span className="px-2.5 py-1 text-[10px] font-bold font-mono tracking-widest bg-black/80 rounded border border-white/10 text-[#D4AF37]">
                            {episode.episodeNumber}
                          </span>
                          {episode.isLatest && (
                            <span className="px-2.5 py-1 text-[10px] font-bold font-mono tracking-widest bg-[#D4AF37] rounded text-black flex items-center gap-1">
                              <Sparkles className="w-3 h-3 fill-black" /> LATEST
                            </span>
                          )}
                          {isWatched && (
                            <span className="px-2.5 py-1 text-[10px] font-bold font-mono tracking-widest bg-[#10B981] rounded text-white flex items-center gap-0.5">
                              ✓ COMPLETED
                            </span>
                          )}
                        </div>

                        {/* Duration Overlay */}
                        <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/85 text-[10px] font-mono font-medium text-white/90">
                          {episode.duration}
                        </div>

                        {/* Embedded Play Button Overlay on Hover */}
                        <button 
                          onClick={() => setActiveEpisodeId(episode.id)}
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all bg-black/55 backdrop-blur-[2px] duration-300"
                        >
                          <div className="p-4 rounded-full bg-[#D4AF37] text-black shadow-lg scale-90 group-hover:scale-100 transition-transform">
                            <Play className="w-6 h-6 fill-black" />
                          </div>
                        </button>
                      </div>

                      {/* Info and Metadata */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[11px] text-white/45 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" /> {episode.publishDate}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5" /> {episode.views} Views
                            </span>
                          </div>

                          <h3 
                            onClick={() => setActiveEpisodeId(episode.id)}
                            className="text-lg font-sans font-bold text-white group-hover:text-[#D4AF37] transition-colors cursor-pointer leading-snug line-clamp-1"
                          >
                            {episode.title}
                          </h3>

                          <p className="text-white/55 text-xs font-sans leading-relaxed line-clamp-2">
                            {episode.description}
                          </p>
                        </div>

                        {/* Progress Bar within card */}
                        {progress > 0 && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] font-mono text-white/45">
                              <span>VIEWING PROGRESS</span>
                              <span>{progress}%</span>
                            </div>
                            <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                              <div className="h-full bg-[#D4AF37]" style={{ width: `${progress}%` }} />
                            </div>
                          </div>
                        )}

                        {/* Card bottom triggers */}
                        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2.5">
                          <button
                            onClick={() => setActiveEpisodeId(episode.id)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black transition-all text-xs font-bold font-sans clickable"
                          >
                            <Play className="w-3.5 h-3.5 fill-current" /> Watch Episode
                          </button>

                          <button
                            onClick={() => {
                              setActiveEpisodeId(episode.id);
                              // Simple timeout to let the page scroll or set active state before script is focused
                            }}
                            className="inline-flex items-center justify-center p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all text-xs font-sans tooltip"
                            title="Read Script Narrations"
                          >
                            <BookOpen className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => onBookmarkToggle(episode.videoId)}
                            className={`p-2 rounded-xl border transition-all ${
                              isBookmarked
                                ? "bg-[#D4AF37]/10 border-[#D4AF37]/35 text-[#D4AF37]"
                                : "bg-white/5 border-transparent hover:bg-white/10 text-white/55 hover:text-white"
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 space-y-3 rounded-2xl bg-white/5 border border-white/5">
                <Compass className="w-12 h-12 text-[#D4AF37] mx-auto animate-pulse" />
                <h3 className="text-lg font-sans font-bold">No episodes found</h3>
                <p className="text-white/45 text-sm max-w-md mx-auto">
                  Try adjusting your search filters or clear your current query to see all available documentary series.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedTag("All");
                  }}
                  className="px-5 py-2 mt-2 rounded-xl bg-[#D4AF37] text-black text-xs font-bold font-sans hover:bg-[#D4AF37]/90 transition-all clickable"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </motion.div>
        ) : (
          /* ========================================================================= */
          /*                     EPISODE DETAILS / THEATRE VIEW                        */
          /* ========================================================================= */
          <motion.div
            key="details"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="max-w-7xl mx-auto space-y-10"
          >
            {/* Navigation back and header metadata */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
              <button
                onClick={() => {
                  setActiveEpisodeId(null);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors font-sans text-sm tracking-wide py-2 clickable"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Episodes
              </button>

              <div className="flex items-center gap-2.5">
                <span className="px-2.5 py-1 text-xs font-bold font-mono tracking-widest bg-white/5 rounded text-white border border-white/5">
                  {activeEpisode.season}
                </span>
                <span className="px-2.5 py-1 text-xs font-bold font-mono tracking-widest bg-[#D4AF37]/10 rounded text-[#D4AF37] border border-[#D4AF37]/25">
                  {activeEpisode.episodeNumber}
                </span>
                {watchedEpisodes.includes(activeEpisode.id) && (
                  <span className="px-2.5 py-1 text-xs font-bold font-mono tracking-widest bg-[#10B981]/15 rounded text-[#10B981] border border-[#10B981]/30">
                    ✓ WATCHED
                  </span>
                )}
              </div>
            </div>

            {/* Cinematic Hero Details Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Video player & Primary commands */}
              <div className="lg:col-span-8 space-y-6">
                {/* Embedded YouTube Player with Premium Box Shadow */}
                <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_15px_40px_rgba(0,0,0,0.8)]">
                  <iframe
                    src={`https://www.youtube.com/embed/${activeEpisode.videoId}?autoplay=1&rel=0&modestbranding=1`}
                    title={activeEpisode.title}
                    className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Sub-Player details panel */}
                <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-4 text-xs font-mono text-white/55">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#D4AF37]" /> {activeEpisode.duration} Duration
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-[#D4AF37]" /> {activeEpisode.views} Views
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" /> {activeEpisode.publishDate}
                    </span>
                  </div>

                  {/* Bookmark, completed and YouTube buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleCompleted(activeEpisode.id)}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold font-sans transition-all ${
                        watchedEpisodes.includes(activeEpisode.id)
                          ? "bg-[#10B981] text-white"
                          : "bg-white/5 hover:bg-white/10 text-white/80 border border-white/5"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" /> 
                      {watchedEpisodes.includes(activeEpisode.id) ? "Mark Incomplete" : "Mark Watched"}
                    </button>

                    <button
                      onClick={() => onBookmarkToggle(activeEpisode.videoId)}
                      className={`p-2 rounded-lg border transition-all ${
                        bookmarks.includes(activeEpisode.videoId)
                          ? "bg-[#D4AF37]/15 border-[#D4AF37]/45 text-[#D4AF37]"
                          : "bg-white/5 border-transparent hover:bg-white/10 text-white/70"
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${bookmarks.includes(activeEpisode.videoId) ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => handleShareEpisode(activeEpisode)}
                      className={`inline-flex items-center justify-center p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/5 text-white/70 transition-all text-xs font-mono`}
                    >
                      {sharedEpisodeId === activeEpisode.id ? (
                        <span className="text-[#D4AF37] font-sans font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Copied
                        </span>
                      ) : (
                        <Share2 className="w-4 h-4" />
                      )}
                    </button>

                    <a
                      href={`https://www.youtube.com/watch?v=${activeEpisode.videoId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D4AF37] text-black font-sans text-xs font-bold hover:bg-[#D4AF37]/90 transition-all shadow-[0_4px_12px_rgba(212,175,55,0.25)]"
                    >
                      Open YouTube <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Continue Watching Simulator for the user */}
                <div className="space-y-2 p-5 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-white/55 font-mono uppercase tracking-wider flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-[#D4AF37]" /> Simulate Viewing Progress
                    </p>
                    <span className="text-xs text-[#D4AF37] font-mono">{episodeProgress[activeEpisode.id] || 0}% watched</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={episodeProgress[activeEpisode.id] || 0}
                    onChange={e => handleProgressChange(activeEpisode.id, parseInt(e.target.value))}
                    className="w-full accent-[#D4AF37] bg-white/10 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-[10px] text-white/35 font-mono">
                    Slide the progress bar to save your continue watching timestamp to localStorage. Reaching 95% marks the episode as complete automatically.
                  </p>
                </div>
              </div>

              {/* Right Column: Mini Metadata, Rating & Subtitle */}
              <div className="lg:col-span-4 space-y-6">
                <div className="p-6 rounded-2xl bg-[#0c0c0c]/90 border border-white/5 space-y-5">
                  <div className="space-y-1">
                    <p className="text-xs font-mono text-[#D4AF37] tracking-widest uppercase">NOW PLAYING</p>
                    <h2 className="text-2xl font-sans font-extrabold text-white leading-tight">
                      {activeEpisode.title}
                    </h2>
                  </div>

                  <p className="text-white/80 font-sans font-medium text-xs leading-relaxed italic border-l-2 border-[#D4AF37]/50 pl-3">
                    {activeEpisode.subtitle}
                  </p>

                  <p className="text-white/60 text-xs font-sans leading-relaxed">
                    {activeEpisode.description}
                  </p>

                  <div className="border-t border-white/5 pt-4 space-y-3.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45 font-mono uppercase">EPISODE ID</span>
                      <span className="text-white font-mono font-bold">{activeEpisode.id}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45 font-mono uppercase">RATING</span>
                      <span className="text-[#D4AF37] font-mono font-bold">★ {activeEpisode.rating || "9.8"}/10</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45 font-mono uppercase">READING TIME</span>
                      <span className="text-white font-mono">{activeEpisode.readingTime}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-white/45 font-mono uppercase">TAGS / GENRES</span>
                      <div className="flex flex-wrap gap-1 justify-end max-w-[200px]">
                        {activeEpisode.tags.map(t => (
                          <span key={t} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] font-sans font-medium text-white/70">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full Script Narrations */}
            <div className="p-6 md:p-8 rounded-2xl bg-[#0b0b0b]/95 border border-white/5 space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-sans font-extrabold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#D4AF37]" /> COMPLETE NARRATION SCRIPT
                  </h3>
                  <p className="text-xs text-white/45 font-sans">
                    Read the complete transcript of the documentary. Sentences of deep insight are highlighted.
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#D4AF37]/10 text-[#D4AF37] font-mono text-xs font-bold">
                    <Clock className="w-3.5 h-3.5" /> {activeEpisode.readingTime}
                  </span>
                </div>
              </div>

              {/* Narrations Layout */}
              <div className="space-y-5 font-serif text-sm md:text-base text-white/80 leading-relaxed max-w-4xl">
                {activeEpisode.scriptParagraphs.map((para, pIdx) => {
                  // Check if any highlighted sentences exist in this paragraph, and wrap them in custom marks
                  let renderText: React.ReactNode = para;
                  
                  activeEpisode.highlightedSentences.forEach((highlight) => {
                    if (para.includes(highlight)) {
                      const parts = para.split(highlight);
                      renderText = (
                        <span>
                          {parts[0]}
                          <mark className="bg-[#D4AF37]/15 text-[#D4AF37] border-b border-[#D4AF37]/45 px-1 rounded-sm font-semibold transition-all hover:bg-[#D4AF37]/25">
                            {highlight}
                          </mark>
                          {parts[1]}
                        </span>
                      );
                    }
                  });

                  return (
                    <p key={pIdx} className="indent-4 md:indent-8">
                      {renderText}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* KEY LESSONS MATRIX (Grid layout separating Truth, Reality, Psychology, etc.) */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-sans font-extrabold text-white flex items-center gap-2">
                  <Activity className="w-5 h-5 text-[#D4AF37]" /> KEY SPIRITUAL & PSYCHOLOGICAL MATRIX
                </h3>
                <p className="text-xs text-white/45 font-sans">
                  Deep wisdom extracted across the core operational pillars of human existence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Truth Card */}
                <div className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-2 hover:border-[#D4AF37]/30 transition-all">
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">01 • TRUTH (सत्य)</span>
                  <h4 className="text-base font-sans font-bold text-white">The Ultimate Truth</h4>
                  <p className="text-xs text-white/60 font-sans leading-relaxed">{activeEpisode.lessons.truth}</p>
                </div>

                {/* 2. Reality Card */}
                <div className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-2 hover:border-[#D4AF37]/30 transition-all">
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">02 • REALITY (यथार्थ)</span>
                  <h4 className="text-base font-sans font-bold text-white">The Bitter Reality</h4>
                  <p className="text-xs text-white/60 font-sans leading-relaxed">{activeEpisode.lessons.reality}</p>
                </div>

                {/* 3. Psychology Card */}
                <div className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-2 hover:border-[#D4AF37]/30 transition-all">
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">03 • PSYCHOLOGY (मनोविज्ञान)</span>
                  <h4 className="text-base font-sans font-bold text-white">The Mind Mechanics</h4>
                  <p className="text-xs text-white/60 font-sans leading-relaxed">{activeEpisode.lessons.psychology}</p>
                </div>

                {/* 4. Discipline Card */}
                <div className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-2 hover:border-[#D4AF37]/30 transition-all">
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">04 • DISCIPLINE (अनुशासन)</span>
                  <h4 className="text-base font-sans font-bold text-white">Self-Discipline Rule</h4>
                  <p className="text-xs text-white/60 font-sans leading-relaxed">{activeEpisode.lessons.discipline}</p>
                </div>

                {/* 5. Mindset Card */}
                <div className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-2 hover:border-[#D4AF37]/30 transition-all">
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">05 • MINDSET (दृष्टिकोण)</span>
                  <h4 className="text-base font-sans font-bold text-white">The Wise Mindset</h4>
                  <p className="text-xs text-white/60 font-sans leading-relaxed">{activeEpisode.lessons.mindset}</p>
                </div>

                {/* 6. Action Card */}
                <div className="p-5 rounded-2xl bg-[#0b0b0b] border border-white/5 space-y-2 hover:border-[#D4AF37]/30 transition-all">
                  <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase font-bold">06 • ACTION (कर्म)</span>
                  <h4 className="text-base font-sans font-bold text-white">Practical Duty</h4>
                  <p className="text-xs text-white/60 font-sans leading-relaxed">{activeEpisode.lessons.action}</p>
                </div>
              </div>
            </div>

            {/* EPISODE GALLERY - sequential screenshots used in the documentary */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-sans font-extrabold text-white flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#D4AF37]" /> EPISODE VISUAL GALLERY
                </h3>
                <p className="text-xs text-white/45 font-sans">
                  The chronological sequence of beautiful, high-definition scenes representing key conceptual metaphors in this episode. Click to open full-screen.
                </p>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                {activeEpisode.gallery.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className="group flex-shrink-0 w-64 md:w-80 space-y-2.5 cursor-pointer"
                  >
                    <div className="relative aspect-[16/10] rounded-xl overflow-hidden border border-white/10 bg-neutral-900 group-hover:border-[#D4AF37]/50 transition-all duration-300">
                      <img
                        src={img.url}
                        alt={img.caption}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-3 py-1.5 rounded-lg bg-[#D4AF37] text-black text-xs font-bold font-sans">
                          Zoom Image
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white/70">
                        Scene {index + 1}
                      </div>
                    </div>
                    <p className="text-xs font-sans text-white/55 leading-relaxed line-clamp-2">
                      {img.caption}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* POWER QUOTES (Extracted beautiful quote cards allowing Copy, Share, Save) */}
            <div className="space-y-6">
              <div className="space-y-1">
                <h3 className="text-xl font-sans font-extrabold text-white flex items-center gap-2">
                  <QuoteIcon className="w-5 h-5 text-[#D4AF37]" /> POWERFUL WISDOM QUOTES
                </h3>
                <p className="text-xs text-white/45 font-sans">
                  Extract and download or save the most heavy-hitting quotes from this documentary episode.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeEpisode.quotes.map((quote, qIdx) => {
                  const isCopied = copiedQuoteText === quote.text;
                  return (
                    <div 
                      key={qIdx}
                      className="p-6 rounded-2xl bg-[#0a0a0a] border border-white/5 relative flex flex-col justify-between space-y-4 hover:border-[#D4AF37]/25 transition-all group shadow-md"
                    >
                      <QuoteIcon className="absolute top-4 right-4 w-10 h-10 text-white/[0.02] group-hover:text-white/[0.05] transition-colors" />
                      <p className="text-sm md:text-base font-serif text-white/85 leading-relaxed italic">
                        "{quote.text}"
                      </p>
                      
                      <div className="flex items-center justify-between border-t border-white/5 pt-3">
                        <span className="text-[10px] font-mono tracking-wider text-white/45 uppercase">
                          — {quote.author}
                        </span>

                        <div className="flex items-center gap-1.5">
                          {/* Copy trigger */}
                          <button
                            onClick={() => handleCopyQuote(quote.text)}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs"
                            title="Copy Quote"
                          >
                            {isCopied ? (
                              <Check className="w-3.5 h-3.5 text-[#D4AF37]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {/* Share trigger */}
                          <button
                            onClick={() => {
                              const shareContent = `"${quote.text}" — ${quote.author} (Apna Sooch - Life Reality Episode ${activeEpisode.episodeNumber})`;
                              navigator.clipboard.writeText(shareContent);
                              setCopiedQuoteText(quote.text);
                              setTimeout(() => setCopiedQuoteText(null), 2000);
                            }}
                            className="p-1.5 rounded bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all text-xs"
                            title="Share Quote"
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PREVIOUS & NEXT EPISODE NAVIGATION */}
            <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Previous Episode */}
              {episodes.findIndex(ep => ep.id === activeEpisode.id) > 0 ? (
                <button
                  onClick={() => {
                    const prevIdx = episodes.findIndex(ep => ep.id === activeEpisode.id) - 1;
                    setActiveEpisodeId(episodes[prevIdx].id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group w-full sm:w-auto flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D4AF37]/30 text-left transition-all clickable"
                >
                  <ChevronLeft className="w-5 h-5 text-white/65 group-hover:text-[#D4AF37] transition-colors" />
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold">PREVIOUS EPISODE</span>
                    <p className="text-xs font-sans font-bold text-white mt-0.5 max-w-[200px] truncate">
                      {episodes[episodes.findIndex(ep => ep.id === activeEpisode.id) - 1].title}
                    </p>
                  </div>
                </button>
              ) : (
                <div className="w-1" /> // Spacer
              )}

              {/* Next Episode */}
              {episodes.findIndex(ep => ep.id === activeEpisode.id) < episodes.length - 1 ? (
                <button
                  onClick={() => {
                    const nextIdx = episodes.findIndex(ep => ep.id === activeEpisode.id) + 1;
                    setActiveEpisodeId(episodes[nextIdx].id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="group w-full sm:w-auto flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#D4AF37]/30 text-right transition-all clickable"
                >
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold">NEXT EPISODE</span>
                    <p className="text-xs font-sans font-bold text-white mt-0.5 max-w-[200px] truncate">
                      {episodes[episodes.findIndex(ep => ep.id === activeEpisode.id) + 1].title}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/65 group-hover:text-[#D4AF37] transition-colors" />
                </button>
              ) : (
                <div className="group w-full sm:w-auto flex items-center justify-between gap-4 p-4 rounded-xl bg-white/5 border border-white/5 text-right opacity-40">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37]">NEXT EPISODE</span>
                    <p className="text-xs font-sans font-semibold text-white mt-0.5">Stay tuned for next Ep!</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
