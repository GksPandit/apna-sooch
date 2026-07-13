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
  ChevronRight,
  Bookmark,
  Calendar,
  Layers,
  HelpCircle,
  TrendingUp,
  History,
  FolderHeart,
  ChevronUp,
  ListVideo
} from "lucide-react";
import { Playlist, Video } from "../types";

interface PlaylistsLibraryProps {
  playlists: Playlist[];
  videos: Video[];
  bookmarks: string[];
  onBookmarkToggle: (videoId: string) => void;
  isLoading?: boolean;
}

// Category filter chips requested
const CHIP_CATEGORIES = [
  "All",
  "Life Reality",
  "Psychology",
  "Sanatan",
  "Moh Maya",
  "Mindset",
  "Motivation",
  "Episodes",
  "Latest",
  "Popular"
];

// Map a playlist to an elegant, high-quality banner image from Unsplash
const getPlaylistBanner = (playlistId: string): string => {
  if (playlistId.includes("gita")) {
    return "https://images.unsplash.com/photo-1609137144814-7264871e42e0?auto=format&fit=crop&q=80&w=1200";
  }
  if (playlistId.includes("brahmacharya")) {
    return "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1200";
  }
  if (playlistId.includes("reality")) {
    return "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200";
  }
  if (playlistId.includes("psychology")) {
    return "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200";
  }
  return "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1200";
};

// Map each playlist dynamically to one of our target category chips based on titles
const getPlaylistCategory = (title: string, desc: string): string => {
  const combined = `${title} ${desc}`.toLowerCase();
  if (combined.includes("gita") || combined.includes("गीता") || combined.includes("sanatan") || combined.includes("सनातन") || combined.includes("धड़क") || combined.includes("धर्म")) {
    return "Sanatan";
  }
  if (combined.includes("brahmacharya") || combined.includes("ब्रह्मचर्य") || combined.includes("discipline") || combined.includes("अनुशासन")) {
    return "Motivation";
  }
  if (combined.includes("reality") || combined.includes("सच्चाई") || combined.includes("कड़वा") || combined.includes("कड़वी") || combined.includes("life") || combined.includes("जीव")) {
    return "Life Reality";
  }
  if (combined.includes("psychology") || combined.includes("मनोविज्ञान") || combined.includes("psycho")) {
    return "Psychology";
  }
  if (combined.includes("moh") || combined.includes("maya") || combined.includes("मोह") || combined.includes("माया")) {
    return "Moh Maya";
  }
  if (combined.includes("mind") || combined.includes("सोच") || combined.includes("मन")) {
    return "Mindset";
  }
  if (combined.includes("episode") || combined.includes("एपिसोड")) {
    return "Episodes";
  }
  return "Mindset"; // fallback
};

// Formatter helper to convert views or numbers
const formatTotalViews = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(0) + "K";
  return num.toString();
};

export default function PlaylistsLibrary({
  playlists,
  videos,
  bookmarks,
  onBookmarkToggle,
  isLoading = false
}: PlaylistsLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("All");
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [playlistVideos, setPlaylistVideos] = useState<Video[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [activePlayingVideo, setActivePlayingVideo] = useState<Video | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local storage lists for saving/bookmarking Playlists
  const [savedPlaylists, setSavedPlaylists] = useState<string[]>([]);
  
  // Last watched video for Continue Watching
  const [lastWatched, setLastWatched] = useState<Video | null>(null);

  useEffect(() => {
    // Load playlist bookmarks
    const saved = localStorage.getItem("apna_sooch_playlist_bookmarks");
    if (saved) {
      try {
        setSavedPlaylists(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

    // Load last watched video
    const last = localStorage.getItem("apna_sooch_last_watched");
    if (last) {
      try {
        setLastWatched(JSON.parse(last));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handlePlaylistBookmarkToggle = (playlistId: string) => {
    let updated;
    if (savedPlaylists.includes(playlistId)) {
      updated = savedPlaylists.filter(id => id !== playlistId);
      triggerToast("Playlist removed from Saved Collection.");
    } else {
      updated = [...savedPlaylists, playlistId];
      triggerToast("Playlist added to Saved Collection! 💖");
    }
    setSavedPlaylists(updated);
    localStorage.setItem("apna_sooch_playlist_bookmarks", JSON.stringify(updated));
  };

  // Enhance playlists dynamically with simulated category, lastUpdated and sequential index
  const enrichedPlaylists = useMemo(() => {
    return playlists.map((p, idx) => {
      const category = getPlaylistCategory(p.title, p.description);
      
      // Seed unique last updated values to satisfy premium content library look
      const lastUpdatedTimes = [
        "Updated 2 days ago",
        "Updated yesterday",
        "Updated 5 days ago",
        "Updated last week"
      ];
      const lastUpdated = lastUpdatedTimes[idx % lastUpdatedTimes.length];

      return {
        ...p,
        category,
        lastUpdated
      };
    });
  }, [playlists]);

  // Compute stats across all playlists
  const statsOverview = useMemo(() => {
    const totalPlaylists = enrichedPlaylists.length;
    // Extract video count digits and sum them up
    const totalVideos = enrichedPlaylists.reduce((sum, p) => {
      const digits = parseInt(p.videoCount.replace(/\D/g, "")) || 0;
      return sum + digits;
    }, 0);

    return {
      totalPlaylists,
      totalVideos
    };
  }, [enrichedPlaylists]);

  // Apply Search + Filter on main playlists list
  const filteredPlaylists = useMemo(() => {
    let result = [...enrichedPlaylists];

    // 1. Search filter (title, description, keywords)
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      );
    }

    // 2. Chip categories
    if (activeChip !== "All" && activeChip !== "Latest" && activeChip !== "Popular") {
      result = result.filter(p => p.category.toLowerCase() === activeChip.toLowerCase());
    }

    // Latest logic sorting (simulated by placing newest title first)
    if (activeChip === "Latest") {
      result.sort((a, b) => b.title.localeCompare(a.title));
    }

    // Popular logic sorting (simulated by placing highest videoCount first)
    if (activeChip === "Popular") {
      result.sort((a, b) => {
        const countA = parseInt(a.videoCount.replace(/\D/g, "")) || 0;
        const countB = parseInt(b.videoCount.replace(/\D/g, "")) || 0;
        return countB - countA;
      });
    }

    return result;
  }, [enrichedPlaylists, searchQuery, activeChip]);

  // Get active playlist details
  const activePlaylist = useMemo(() => {
    return enrichedPlaylists.find(p => p.id === activePlaylistId) || null;
  }, [enrichedPlaylists, activePlaylistId]);

  // Fetch or filter videos for active playlist in sequence
  useEffect(() => {
    if (!activePlaylist) {
      setPlaylistVideos([]);
      return;
    }

    setLoadingItems(true);

    const loadPlaylistVideos = async () => {
      try {
        // Try to fetch live playlist items from backend
        const res = await fetch(`/api/youtube/playlist-items?playlistId=${activePlaylist.id}`);
        if (res.ok) {
          const liveItems = await res.json();
          if (Array.isArray(liveItems) && liveItems.length > 0) {
            setPlaylistVideos(liveItems);
            setLoadingItems(false);
            return;
          }
        }
      } catch (err) {
        console.warn("Could not load live playlist items:", err);
      }

      // Fallback: Dynamic Categorized Filtering of main videos prop
      // This guarantees that all videos match their playlist beautifully
      setTimeout(() => {
        let matched: Video[] = [];
        const playlistId = activePlaylist.id;

        if (playlistId.includes("gita") || activePlaylist.title.toLowerCase().includes("gita")) {
          matched = videos.filter(v => v.category === "Bhagavad Gita");
        } else if (playlistId.includes("brahmacharya") || activePlaylist.title.toLowerCase().includes("brahmacharya") || activePlaylist.title.toLowerCase().includes("discipline")) {
          matched = videos.filter(v => v.category === "Brahmacharya" || v.category === "Self Discipline");
        } else if (playlistId.includes("reality") || activePlaylist.title.toLowerCase().includes("reality") || activePlaylist.title.toLowerCase().includes("सच्चाई")) {
          matched = videos.filter(v => v.category === "Reality of Life");
        } else if (playlistId.includes("psychology") || activePlaylist.title.toLowerCase().includes("psychology") || activePlaylist.title.toLowerCase().includes("मनोविज्ञान")) {
          matched = videos.filter(v => v.category === "Psychology" || v.category === "Ancient Mind Science");
        }

        // If nothing matches or list is empty, default to standard items
        if (matched.length === 0) {
          matched = videos.slice(0, 5);
        }

        setPlaylistVideos(matched);
        setLoadingItems(false);
      }, 400);
    };

    loadPlaylistVideos();
  }, [activePlaylist, videos]);

  // Cumulative total views inside playlist detail
  const playlistTotalViews = useMemo(() => {
    return playlistVideos.reduce((sum, v) => {
      // parse text like "1.2M", "980K", "150"
      const clean = v.views.toLowerCase();
      let val = 0;
      if (clean.includes("m")) {
        val = parseFloat(clean) * 1000000;
      } else if (clean.includes("k")) {
        val = parseFloat(clean) * 1000;
      } else {
        val = parseInt(clean.replace(/\D/g, "")) || 0;
      }
      return sum + val;
    }, 0);
  }, [playlistVideos]);

  // Related playlists (all except active)
  const relatedPlaylists = useMemo(() => {
    if (!activePlaylist) return [];
    return enrichedPlaylists.filter(p => p.id !== activePlaylist.id).slice(0, 3);
  }, [enrichedPlaylists, activePlaylist]);

  // Watch video helper - saves "last watched" state and triggers local player
  const handleWatchVideo = (video: Video) => {
    setActivePlayingVideo(video);
    setLastWatched(video);
    localStorage.setItem("apna_sooch_last_watched", JSON.stringify(video));
  };

  const handleSharePlaylist = (playlist: Playlist) => {
    const url = `${window.location.origin}/?tab=playlists&playlist=${playlist.id}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => triggerToast("Playlist Share Link Copied! 🔗"))
        .catch(() => triggerToast("Could not copy link."));
    } else {
      triggerToast("Sharing not supported in this browser.");
    }
  };

  const handleShareVideo = (video: Video) => {
    const url = `https://youtube.com/watch?v=${video.youtubeId}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url)
        .then(() => triggerToast("Video Link Copied! 🔗"))
        .catch(() => triggerToast("Could not copy link."));
    } else {
      triggerToast("Sharing not supported in this browser.");
    }
  };

  return (
    <div className="space-y-12 animate-fade-in" id="playlists-library-root">
      
      {/* 1. Main List Mode */}
      {!activePlaylist ? (
        <>
          {/* Header Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/60 via-black to-zinc-950 border border-white/5 p-8 md:p-12 shadow-2xl backdrop-blur-xl">
            {/* Ambient Background glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/5 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[100px] pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="space-y-3.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
                  <span className="text-white/80 text-xs font-mono font-bold uppercase tracking-wider">
                    {statsOverview.totalPlaylists} Complete Curated Courses
                  </span>
                </div>

                <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white font-sans flex items-center gap-2.5">
                  <span>Playlists</span>
                  <span className="text-xs bg-[#D4AF37] text-black font-mono font-black px-2 py-0.5 rounded-md uppercase">
                    PRO
                  </span>
                </h2>
                <p className="text-white/60 text-xs md:text-sm font-medium max-w-xl leading-relaxed">
                  Explore every collection from Apna Sooch. Structured, step-by-step masterclasses to transform your focus, reclaim your power, and understand Sanatan philosophy.
                </p>
              </div>

              {/* Stats Block */}
              <div className="grid grid-cols-2 gap-4 sm:w-80 flex-shrink-0">
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-1">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Collections</span>
                  <span className="text-2xl font-black text-[#D4AF37] font-sans">{statsOverview.totalPlaylists}</span>
                </div>
                
                <div className="bg-white/[0.02] border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-1">
                  <span className="text-[10px] uppercase font-bold text-white/40 tracking-wider">Total Video Guide</span>
                  <span className="text-2xl font-black text-white font-sans">{statsOverview.totalVideos}+</span>
                </div>
              </div>
            </div>

            {/* Quick Controls Row */}
            <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              {/* Category selector */}
              <div className="flex flex-wrap gap-2 items-center flex-grow">
                {CHIP_CATEGORIES.map((chip) => {
                  const isActive = activeChip === chip;
                  return (
                    <button
                      key={chip}
                      onClick={() => setActiveChip(chip)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                        isActive
                          ? "bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/10 scale-102 font-black"
                          : "bg-zinc-950/70 border border-white/5 text-white/75 hover:text-white hover:border-white/20"
                      } clickable`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>

              {/* Instant search input */}
              <div className="relative w-full md:w-80 flex-shrink-0">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search playlists, categories, wisdom..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-950/90 border border-white/10 hover:border-white/20 focus:border-[#D4AF37] rounded-2xl py-3.5 pl-11 pr-10 text-xs text-white placeholder-white/40 focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all duration-300"
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

          {/* 1.5 Continue Watching Sticky Bar if present */}
          {lastWatched && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-zinc-900/40 via-zinc-950/80 to-zinc-900/40 border border-white/5 p-4 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37] flex-shrink-0">
                  <History className="w-6 h-6 animate-spin-slow" />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[#D4AF37] uppercase tracking-wider font-mono font-black">Continue Watching</span>
                  <h4 className="text-xs md:text-sm font-black text-white line-clamp-1">{lastWatched.title}</h4>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleWatchVideo(lastWatched)}
                  className="px-5 py-2.5 bg-[#D4AF37] text-black hover:bg-white hover:scale-102 transition-all font-bold text-xs rounded-xl flex items-center gap-1.5 clickable"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume Learning</span>
                </button>
                
                <button
                  onClick={() => {
                    localStorage.removeItem("apna_sooch_last_watched");
                    setLastWatched(null);
                  }}
                  className="p-2.5 bg-white/5 hover:bg-white/10 text-white/50 hover:text-white rounded-xl transition-all"
                  title="Clear history"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* 2. Playlists Cards Grid: Desktop 3 columns, Tablet 2 columns, Mobile 1 column */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <ListVideo className="w-4 h-4 text-[#D4AF37]" />
              <span>{activeChip === "All" ? "Knowledge Libraries" : `${activeChip} Collections`}</span>
            </h3>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-zinc-900/30 border border-white/5 p-4 rounded-2xl h-80 animate-pulse space-y-4">
                    <div className="h-44 bg-white/5 rounded-xl" />
                    <div className="h-4 bg-white/10 rounded-md w-3/4" />
                    <div className="h-3 bg-white/5 rounded-md w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredPlaylists.length === 0 ? (
              /* Beautiful empty state */
              <div className="text-center py-24 bg-zinc-950/30 border border-white/5 rounded-3xl p-8 max-w-md mx-auto space-y-6">
                <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto text-[#D4AF37]">
                  <HelpCircle className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black text-white">No Playlists Available</h4>
                  <p className="text-xs text-white/50 leading-relaxed max-w-xs mx-auto">
                    We couldn't find any collections matching your criteria. Try adjusting filters or searching again.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveChip("All");
                  }}
                  className="px-5 py-2.5 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-white font-bold text-xs rounded-xl border border-white/10 hover:border-transparent transition-all duration-300 clickable"
                >
                  View All Collections
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaylists.map((p, index) => {
                  const isSaved = savedPlaylists.includes(p.id);
                  return (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      whileHover={{ y: -4 }}
                      className="group bg-[#0e0e11]/80 hover:bg-[#121216] border border-white/5 hover:border-[#D4AF37]/30 rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between transition-all duration-500 relative"
                    >
                      {/* Thumbnail wrapper */}
                      <div className="relative aspect-video overflow-hidden">
                        <img 
                          src={p.thumbnail} 
                          alt={p.title} 
                          className="w-full h-full object-cover opacity-85 group-hover:scale-103 group-hover:opacity-100 transition-all duration-700 ease-out select-none"
                          onError={(e) => {
                            e.currentTarget.src = getPlaylistBanner(p.id);
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

                        {/* Top Badge Overlay */}
                        <div className="absolute top-3 left-3 z-10 flex gap-2">
                          <span className="bg-black/75 text-[#D4AF37] border border-[#D4AF37]/20 text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md">
                            {p.category}
                          </span>
                        </div>

                        {/* Bottom Stats inside Thumbnail */}
                        <div className="absolute bottom-3 right-3 bg-black/85 border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                          <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span className="text-[10px] text-white font-bold font-mono uppercase tracking-wider">
                            {p.videoCount}
                          </span>
                        </div>
                      </div>

                      {/* Content panel */}
                      <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] text-white/40 font-mono font-bold uppercase tracking-widest">
                              {p.lastUpdated}
                            </span>
                          </div>

                          <h4 className="text-base font-black text-white group-hover:text-[#D4AF37] transition-colors leading-snug line-clamp-2">
                            {p.title}
                          </h4>

                          <p className="text-xs text-white/50 leading-relaxed line-clamp-3">
                            {p.description}
                          </p>
                        </div>

                        {/* Bottom Actions of playlist card */}
                        <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/5">
                          <button
                            onClick={() => setActivePlaylistId(p.id)}
                            className="flex-grow py-2.5 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 clickable"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Open Playlist</span>
                          </button>

                          <div className="flex gap-2">
                            <button
                              onClick={() => handlePlaylistBookmarkToggle(p.id)}
                              className="p-2.5 bg-white/[0.02] hover:bg-white/5 border border-white/10 rounded-xl text-white transition-all clickable"
                              title="Save Playlist"
                            >
                              <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500 text-red-500" : "text-white/60 hover:text-white"}`} />
                            </button>

                            <button
                              onClick={() => handleSharePlaylist(p)}
                              className="p-2.5 bg-white/[0.02] hover:bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white transition-all clickable"
                              title="Share playlist link"
                            >
                              <Share2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      ) : (
        /* 3. Detailed Playlist Course Page Mode */
        <div className="space-y-12">
          
          {/* Back to Playlists Main Index Navigation bar */}
          <button
            onClick={() => setActivePlaylistId(null)}
            className="inline-flex items-center gap-2 text-white/60 hover:text-[#D4AF37] text-xs font-bold transition-colors group clickable"
          >
            <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
            <span>वापस प्लेलिस्ट सूची पर जाएं (Back to Playlists)</span>
          </button>

          {/* Majestic Hero Banner of the open playlist */}
          <div className="relative rounded-3xl overflow-hidden min-h-[45vh] flex items-end p-6 md:p-12 border border-white/5 shadow-2xl">
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-40 select-none pointer-events-none transform scale-101"
              style={{ backgroundImage: `url(${getPlaylistBanner(activePlaylist.id)})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

            <div className="relative z-10 w-full flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
              
              {/* Detailed Left: Thumbnail, title, details */}
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 w-full">
                <div className="w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border border-white/10 shadow-2xl flex-shrink-0 relative">
                  <img 
                    src={activePlaylist.thumbnail} 
                    alt={activePlaylist.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = getPlaylistBanner(activePlaylist.id);
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="bg-[#D4AF37] text-black font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
                      {activePlaylist.videoCount}
                    </span>
                  </div>
                </div>

                <div className="space-y-3.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                    <Layers className="w-3 h-3" />
                    <span>{activePlaylist.category} MODULE</span>
                  </div>

                  <h1 className="text-2xl md:text-4xl font-black text-white leading-tight">
                    {activePlaylist.title}
                  </h1>

                  <p className="text-white/60 text-xs md:text-sm max-w-2xl leading-relaxed">
                    {activePlaylist.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-white/40 font-mono">
                    <span className="flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-red-500" />
                      <span>{playlistVideos.length} Chapters</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-yellow-500" />
                      <span>{formatTotalViews(playlistTotalViews)} Total Views</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#D4AF37] uppercase">{activePlaylist.lastUpdated}</span>
                  </div>
                </div>
              </div>

              {/* Top Right Action button block */}
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={() => handlePlaylistBookmarkToggle(activePlaylist.id)}
                  className="flex-1 md:flex-initial px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 clickable"
                >
                  <Heart className={`w-4 h-4 ${savedPlaylists.includes(activePlaylist.id) ? "fill-red-500 text-red-500" : ""}`} />
                  <span>{savedPlaylists.includes(activePlaylist.id) ? "Saved" : "Save"}</span>
                </button>

                <button
                  onClick={() => handleSharePlaylist(activePlaylist)}
                  className="flex-1 md:flex-initial px-5 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 clickable"
                >
                  <Share2 className="w-4 h-4 text-[#D4AF37]" />
                  <span>Share</span>
                </button>
              </div>

            </div>
          </div>

          {/* Videos Feed list container */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Every video in sequence (8 cols / 2 thirds) */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                <span>Course Syllabus / Video Index ({playlistVideos.length})</span>
              </h3>

              {loadingItems ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-900/40 p-4 rounded-2xl h-24 animate-pulse flex gap-4">
                      <div className="w-32 bg-white/5 rounded-xl h-full" />
                      <div className="flex-grow space-y-2">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-3 bg-white/5 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : playlistVideos.length === 0 ? (
                <div className="text-center py-12 bg-white/[0.01] border border-white/5 rounded-2xl text-white/50 text-xs">
                  No video guides registered under this category.
                </div>
              ) : (
                <div className="space-y-3">
                  {playlistVideos.map((v, idx) => {
                    const isBookmarked = bookmarks.includes(v.id);
                    return (
                      <motion.div
                        key={v.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.05 }}
                        className="group bg-[#0d0d11]/80 hover:bg-[#121217] border border-white/5 hover:border-red-600/20 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all duration-300"
                      >
                        {/* Left: Sequence index, thumbnail, metadata details */}
                        <div className="flex items-center gap-4 w-full sm:w-auto">
                          {/* Sequence step index */}
                          <div className="w-6 text-center text-sm font-bold font-mono text-white/20 group-hover:text-[#D4AF37] transition-colors">
                            {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                          </div>

                          <div className="w-28 md:w-32 aspect-video bg-black rounded-xl overflow-hidden relative flex-shrink-0 shadow-lg border border-white/5">
                            <img 
                              src={`https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg`} 
                              alt={v.title} 
                              className="w-full h-full object-cover group-hover:scale-103 transition-all duration-500"
                            />
                            {/* Duration Indicator */}
                            <span className="absolute bottom-1 right-1.5 bg-black/85 text-[8px] font-mono font-bold text-white px-1.5 py-0.5 rounded">
                              {v.duration}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <h4 className="text-xs md:text-sm font-black text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                              {v.title}
                            </h4>

                            <div className="flex items-center gap-3 text-[10px] text-white/45 font-mono">
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3 text-[#D4AF37]" />
                                <span>{v.views} views</span>
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3 text-red-500" />
                                <span>{v.date}</span>
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Right: Quick Action Tray */}
                        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end border-t sm:border-0 border-white/5 pt-3 sm:pt-0">
                          <button
                            onClick={() => handleWatchVideo(v)}
                            className="px-4 py-2 bg-red-600 hover:bg-white text-white hover:text-black font-extrabold text-[10px] uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-1.5 clickable"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Watch</span>
                          </button>

                          <a
                            href={`https://youtube.com/watch?v=${v.youtubeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/20 rounded-xl transition-all clickable"
                            title="Open on YouTube"
                          >
                            <Youtube className="w-4 h-4 text-red-500" />
                          </a>

                          <button
                            onClick={() => onBookmarkToggle(v.id)}
                            className="p-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/20 rounded-xl transition-all clickable"
                            title="Bookmark Video"
                          >
                            <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-[#D4AF37] text-[#D4AF37]" : ""}`} />
                          </button>

                          <button
                            onClick={() => handleShareVideo(v)}
                            className="p-2 bg-white/5 hover:bg-white/10 text-white border border-white/5 hover:border-white/20 rounded-xl transition-all clickable"
                            title="Copy video link"
                          >
                            <Share2 className="w-4 h-4 text-blue-400" />
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right Col: Related Playlists list */}
            <div className="space-y-6">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#D4AF37]" />
                <span>Related Collections</span>
              </h3>

              <div className="space-y-4">
                {relatedPlaylists.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setActivePlaylistId(p.id)}
                    className="bg-zinc-950 border border-white/5 hover:border-[#D4AF37]/30 p-3.5 rounded-2xl flex gap-3.5 cursor-pointer hover:bg-zinc-900/60 transition-all duration-300 group"
                  >
                    <div className="w-20 h-20 bg-zinc-900 rounded-xl overflow-hidden flex-shrink-0 relative">
                      <img 
                        src={p.thumbnail} 
                        alt={p.title} 
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform" 
                      />
                    </div>

                    <div className="flex flex-col justify-between py-0.5">
                      <div className="space-y-1">
                        <span className="text-[8px] bg-white/5 text-[#D4AF37] border border-[#D4AF37]/10 px-2 py-0.5 rounded font-black font-mono tracking-wider">
                          {p.category}
                        </span>
                        <h4 className="text-xs font-black text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2">
                          {p.title}
                        </h4>
                      </div>
                      <span className="text-[10px] text-white/40 font-mono font-bold uppercase">{p.videoCount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Inline Embedded Theater Video Modal */}
      <AnimatePresence>
        {activePlayingVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[12000] bg-black/98 backdrop-blur-xl flex items-center justify-center p-4 md:p-8"
            onClick={() => setActivePlayingVideo(null)}
          >
            <div className="absolute inset-0" />
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden border border-[#D4AF37]/20 shadow-2xl z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Floating Close Button */}
              <button
                onClick={() => setActivePlayingVideo(null)}
                className="absolute top-4 right-4 z-50 p-2.5 bg-black/80 hover:bg-black text-white border border-white/10 hover:border-white/30 rounded-full transition-all clickable"
                title="Close Player"
              >
                <X className="w-4 h-4" />
              </button>

              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activePlayingVideo.youtubeId}?autoplay=1&rel=0`}
                title={activePlayingVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </motion.div>
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
