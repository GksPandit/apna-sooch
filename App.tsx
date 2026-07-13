import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Youtube, 
  MessageSquare, 
  Send, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Eye, 
  Bookmark, 
  Search, 
  Calendar, 
  User, 
  MapPin, 
  ChevronRight, 
  Check, 
  Heart, 
  ArrowUp,
  Instagram,
  Compass,
  AlertCircle
} from "lucide-react";

// Types
import { Video, Short, Playlist, Quote, GitaVerse, ChannelStats, CommunityPost } from "./types";

// Components
import Loader from "./components/Loader";
import RippleCursor from "./components/RippleCursor";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import StatsCounter from "./components/StatsCounter";
import TodayThought from "./components/TodayThought";
import GitaSection from "./components/GitaSection";
import FeaturedVideo from "./components/FeaturedVideo";
import FutureReady from "./components/FutureReady";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";
import VideoLibrary from "./components/VideoLibrary";
import ShortsLibrary from "./components/ShortsLibrary";
import PlaylistsLibrary from "./components/PlaylistsLibrary";
import CommunityHub from "./components/CommunityHub";
import AboutUs from "./components/AboutUs";
import DailyWisdom from "./components/DailyWisdom";
import LifeReality from "./components/LifeReality";
import AILifeGuide from "./components/AILifeGuide";
import ContactCenter from "./components/ContactCenter";
import bannerImg from "./assets/images/apnasooch_banner_1783877940325.jpg";
import { syncEpisodesWithPlaylist, RealityEpisode } from "./data/realityEpisodes";

export default function App() {
  const [showLoader, setShowLoader] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Data states
  const [stats, setStats] = useState<ChannelStats | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [shorts, setShorts] = useState<Short[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [community, setCommunity] = useState<CommunityPost[]>([]);
  const [dailyGita, setDailyGita] = useState<GitaVerse | null>(null);
  const [dailyQuote, setDailyQuote] = useState<Quote | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [realityEpisodes, setRealityEpisodes] = useState<RealityEpisode[]>([]);
  
  // Loading & Action states
  const [loading, setLoading] = useState({
    stats: true,
    videos: true,
    shorts: true,
    playlists: true,
    community: true,
    gita: true,
    quote: true,
    reality: true
  });

  const [contactForm, setContactForm] = useState({ name: "", email: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactError, setContactError] = useState("");
  const [contactSubmitting, setContactSubmitting] = useState(false);
  
  const [activeVideoPlayer, setActiveVideoPlayer] = useState<string | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [votedPolls, setVotedPolls] = useState<Record<string, number>>({});

  // Cycle Subtitles in Hero
  const subtitles = [
    "सत्य की खोज...",
    "जीवन का वास्तविक अर्थ...",
    "भगवद्गीता की शिक्षाएं...",
    "मोह माया से मुक्ति...",
    "सनातन ज्ञान..."
  ];
  const [subtitleIndex, setSubtitleIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Back to Top trigger
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initial loads
  useEffect(() => {
    // Load bookmarks from local storage
    const savedBookmarks = localStorage.getItem("apna_sooch_bookmarks");
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    // Fetch API Data
    const loadAllData = async () => {
      try {
        // Fetch stats
        const statsRes = await fetch("/api/youtube/stats");
        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
      } catch (e) {
        console.error("Stats fetch error:", e);
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }

      try {
        // Fetch videos
        const videosRes = await fetch("/api/youtube/videos");
        if (videosRes.ok) {
          const videosData = await videosRes.json();
          // Overwrite the first video to represent the main episode "Dukhi Insaan Kabhi Gareeb Nahi Hota"
          const enhancedVideos = videosData.map((v: any, index: number) => {
            if (index === 0) {
              return {
                ...v,
                title: "Dukhi Insaan Kabhi Gareeb Nahi Hota | Episode 01",
                description: "क्या दुख वास्तव में एक अभिशाप है, या यह हमारी आत्मा को तराशने का एक दैवीय माध्यम है? जानिए क्यों एक दुखी इंसान कभी भी मानसिक या आध्यात्मिक रूप से गरीब नहीं हो सकता। जीवन की इस परम सच्चाई का गहरा विश्लेषण।",
                thumbnail: bannerImg
              };
            }
            return v;
          });
          setVideos(enhancedVideos);
        }
      } catch (e) {
        console.error("Videos fetch error:", e);
      } finally {
        setLoading(prev => ({ ...prev, videos: false }));
      }

      try {
        // Fetch shorts
        const shortsRes = await fetch("/api/youtube/shorts");
        if (shortsRes.ok) {
          const shortsData = await shortsRes.json();
          setShorts(shortsData);
        }
      } catch (e) {
        console.error("Shorts fetch error:", e);
      } finally {
        setLoading(prev => ({ ...prev, shorts: false }));
      }

      try {
        // Fetch playlists
        const playlistsRes = await fetch("/api/youtube/playlists");
        if (playlistsRes.ok) {
          const playlistsData = await playlistsRes.json();
          setPlaylists(playlistsData);
        }
      } catch (e) {
        console.error("Playlists fetch error:", e);
      } finally {
        setLoading(prev => ({ ...prev, playlists: false }));
      }

      try {
        // Fetch community
        const communityRes = await fetch("/api/youtube/community");
        if (communityRes.ok) {
          const communityData = await communityRes.json();
          setCommunity(communityData);
        }
      } catch (e) {
        console.error("Community fetch error:", e);
      } finally {
        setLoading(prev => ({ ...prev, community: false }));
      }

      try {
        // Fetch Life Reality Playlist
        const realityRes = await fetch("/api/youtube/life-reality-playlist");
        if (realityRes.ok) {
          const realityData = await realityRes.json();
          const synced = syncEpisodesWithPlaylist(realityData);
          setRealityEpisodes(synced);
        } else {
          // Fallback to static
          setRealityEpisodes(syncEpisodesWithPlaylist([]));
        }
      } catch (e) {
        console.error("Life Reality fetch error, using fallback:", e);
        setRealityEpisodes(syncEpisodesWithPlaylist([]));
      } finally {
        setLoading(prev => ({ ...prev, reality: false }));
      }

      try {
        // Fetch Daily Gita
        const gitaRes = await fetch("/api/gita/daily");
        if (gitaRes.ok) {
          const gitaData = await gitaRes.json();
          setDailyGita(gitaData);
        }
      } catch (e) {
        console.error("Gita fetch error:", e);
      } finally {
        setLoading(prev => ({ ...prev, gita: false }));
      }
    };

    loadAllData();

    // Dynamic 15-minute background refresh to satisfy requirements
    const intervalId = setInterval(() => {
      loadAllData();
    }, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch / Generate new quotes (supports Gemini on backend)
  const refreshQuote = async (category: string) => {
    setLoading(prev => ({ ...prev, quote: true }));
    try {
      const quoteRes = await fetch(`/api/quotes/daily?category=${category}&refresh=true`);
      if (quoteRes.ok) {
        const quoteData = await quoteRes.json();
        setDailyQuote(quoteData);
      }
    } catch (e) {
      console.error("Quote fetch error:", e);
    } finally {
      setLoading(prev => ({ ...prev, quote: false }));
    }
  };

  // Search trigger from Navbar
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setActiveTab("videos"); // Open videos tab to display matches
  };

  // Toggle Bookmark
  const handleBookmarkToggle = (videoId: string) => {
    setBookmarks((prev) => {
      let updated;
      if (prev.includes(videoId)) {
        updated = prev.filter((id) => id !== videoId);
      } else {
        updated = [...prev, videoId];
      }
      localStorage.setItem("apna_sooch_bookmarks", JSON.stringify(updated));
      return updated;
    });
  };

  // Track Life Reality Watched & Progress for Continue Watching
  const [realityWatched, setRealityWatched] = useState<string[]>([]);
  const [realityProgress, setRealityProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const watched = localStorage.getItem("apna_sooch_reality_watched");
    const progress = localStorage.getItem("apna_sooch_reality_progress");
    if (watched) {
      try { setRealityWatched(JSON.parse(watched)); } catch (e) {}
    }
    if (progress) {
      try { setRealityProgress(JSON.parse(progress)); } catch (e) {}
    }
  }, [activeTab]);

  // Contact Form handler
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");
    setContactSuccess("");
    setContactSubmitting(true);

    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactError("कृपया सभी खाली स्थान भरें।");
      setContactSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });
      const data = await res.json();
      if (res.ok) {
        setContactSuccess(data.message);
        setContactForm({ name: "", email: "", message: "" });
      } else {
        setContactError(data.error || "संदेश भेजने में त्रुटि हुई।");
      }
    } catch (err) {
      setContactError("सर्वर से संपर्क करने में असमर्थ। कृपया पुनः प्रयास करें।");
    } finally {
      setContactSubmitting(false);
    }
  };

  // Handle Poll Voting locally
  const handleVote = (pollId: string, optionIndex: number) => {
    if (votedPolls[pollId] !== undefined) return; // Allow only 1 vote
    setVotedPolls(prev => ({ ...prev, [pollId]: optionIndex }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col justify-between selection:bg-[#D4AF37] selection:text-black">
      
      {/* Intro Loader Screen */}
      <AnimatePresence>
        {showLoader && (
          <Loader onComplete={() => setShowLoader(false)} />
        )}
      </AnimatePresence>

      {!showLoader && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col min-h-screen pb-24 lg:pb-0"
        >
          {/* Custom Cursor */}
          <RippleCursor />

          {/* Premium Glass Header */}
          <Navbar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
            onSearch={handleSearch}
            bookmarksCount={bookmarks.length}
          />

          {/* Core Content View Switcher */}
          <main className="flex-grow py-8 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto w-full">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: CINEMATIC HOME */}
              {activeTab === "home" && (
                <motion.div
                  key="home-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-16"
                >
                  {/* Cinematic YouTube Premium Hero Section */}
                  <HeroSection 
                    stats={stats} 
                    onBrowseVideos={() => setActiveTab("videos")}
                    onJoinCommunity={() => setActiveTab("community")}
                    onSearch={handleSearch}
                    featuredVideo={videos[0] || null}
                  />

                  {/* Two columns: Daily Quote + Daily Gita */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Today's Quote Section */}
                    <TodayThought 
                      initialQuote={dailyQuote} 
                      loading={loading.quote} 
                      onRefreshQuote={refreshQuote}
                      onWatchVideo={() => setActiveTab("videos")}
                    />

                    {/* Today's Gita Section */}
                    <GitaSection 
                      verse={dailyGita} 
                      loading={loading.gita} 
                    />
                  </div>

                  {/* AI Life Guide Quick CTA */}
                  <div className="bg-gradient-to-r from-[#1c1a12] via-[#111111] to-[#121212] border border-[#D4AF37]/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none" />
                    <div className="space-y-3 relative z-10 text-center md:text-left">
                      <div className="inline-flex items-center gap-1.5 bg-[#D4AF37]/10 text-[#D4AF37] text-[10px] font-bold px-3 py-1 rounded-full border border-[#D4AF37]/20 uppercase tracking-widest">
                        <Sparkles size={11} className="animate-pulse" /> Apna Sooch AI Guide
                      </div>
                      <h3 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
                        Need Guidance? <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-white">Ask Apna Sooch AI</span>
                      </h3>
                      <p className="text-xs text-white/50 max-w-xl leading-relaxed">
                        जीवन की उलझनों, मन के रहस्यों, चिंता, अनुशासन या ब्रह्मचर्य से जुड़े कठिन प्रश्नों का गहरा, मनोवैज्ञानिक और यथार्थवादी समाधान तुरंत पाएं।
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab("ai-guide")}
                      className="bg-[#D4AF37] hover:bg-[#F3E5AB] active:scale-95 text-black font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-lg flex items-center gap-2 flex-shrink-0 clickable relative z-10"
                    >
                      <span>Ask AI Now</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>

                  {/* Spotlight Featured Video */}
                  <div className="space-y-6">
                    <h4 className="text-lg md:text-xl font-bold text-white tracking-wide border-l-4 border-[#FF0000] pl-3">
                      विशेष प्रस्तुति • Featured Content
                    </h4>
                    <FeaturedVideo 
                      video={videos[0] || null} 
                      onBookmarkToggle={handleBookmarkToggle}
                      isBookmarked={bookmarks.includes(videos[0]?.id || "")}
                    />
                  </div>

                  {/* Slider of Popular/Trending Videos */}
                  <div className="space-y-6">
                    <h4 className="text-lg md:text-xl font-bold text-white tracking-wide border-l-4 border-[#D4AF37] pl-3 flex items-center justify-between">
                      <span>लोकप्रिय एवं चर्चित ज्ञान • Popular Videos</span>
                      <button 
                        onClick={() => setActiveTab("videos")} 
                        className="text-xs text-[#D4AF37] hover:underline"
                      >
                        सभी देखें →
                      </button>
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {videos.slice(1, 4).map((v) => (
                        <div
                          key={v.id}
                          className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5 hover:border-white/10 transition-all duration-300 flex flex-col justify-between group shadow-md"
                        >
                          <div className="relative aspect-video bg-black overflow-hidden">
                            <img 
                              src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} 
                              alt={v.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 ease-out" 
                            />
                            <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                              {v.duration}
                            </span>
                          </div>
                          
                          <div className="p-4 space-y-3">
                            <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">{v.category}</span>
                            <h5 className="text-sm font-bold text-white leading-snug line-clamp-2 hover:text-[#D4AF37] transition-colors">
                              {v.title}
                            </h5>
                            
                            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px] text-white/40">
                              <span>{v.views} दृश्य</span>
                              <span>{v.date}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setActiveVideoPlayer(v.youtubeId);
                            }}
                            className="w-full bg-white/5 hover:bg-[#FF0000] hover:text-white text-white/80 py-2.5 text-xs font-bold transition-all border-t border-white/5 flex items-center justify-center gap-1.5 clickable"
                          >
                            ▶ वीडियो देखें
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Netflix-Style "Life Reality" Playlist Row */}
                  <div className="space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full filter blur-3xl pointer-events-none" />
                    
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-l-4 border-[#D4AF37] pl-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold uppercase bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/20">DOCUMENTARY SERIES</span>
                        </div>
                        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-wide mt-1">
                          Life Reality
                        </h2>
                        <p className="text-xs text-white/50">
                          A documentary-style journey into the truth of life.
                        </p>
                      </div>
                      <button 
                        onClick={() => setActiveTab("reality")} 
                        className="text-xs text-[#D4AF37] font-bold bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 px-4 py-2 rounded-xl transition-all self-start sm:self-auto clickable"
                      >
                        पूरा सीरीज देखें • View Full Series →
                      </button>
                    </div>

                    {/* Continue Watching Panel (if active progress exists) */}
                    {(() => {
                      const inProgressEp = realityEpisodes.find(
                        ep => !realityWatched.includes(ep.id) && (realityProgress[ep.id] || 0) > 0
                      );
                      if (!inProgressEp) return null;

                      const progressPercent = Math.round(realityProgress[inProgressEp.id] || 0);

                      return (
                        <div className="bg-gradient-to-r from-[#14120c] to-[#0d0d0d] border border-[#D4AF37]/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
                          <div className="flex items-center gap-4 w-full md:w-auto">
                            <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
                              <img 
                                src={inProgressEp.thumbnailImage} 
                                alt={inProgressEp.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute bottom-0 left-0 h-1 bg-[#D4AF37]" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <div>
                              <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] font-bold">CONTINUE WATCHING</span>
                              <h4 className="text-sm font-bold text-white mt-0.5">{inProgressEp.episodeNumber}: {inProgressEp.title}</h4>
                              <p className="text-[11px] text-white/40">{progressPercent}% complete • {inProgressEp.duration}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              // We open the Life Reality tab and trigger the active episode!
                              setActiveTab("reality");
                              // Set local storage item for LifeReality.tsx to pick it up on mount
                              localStorage.setItem("apna_sooch_reality_active_id", inProgressEp.id);
                            }}
                            className="w-full md:w-auto bg-[#D4AF37] hover:bg-[#F3E5AB] text-black text-xs font-bold px-5 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 clickable"
                          >
                            ▶ Resume Episode
                          </button>
                        </div>
                      );
                    })()}

                    {/* Horizontal Netflix Scroll Row */}
                    <div className="relative group">
                      <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-[#D4AF37]/20 scrollbar-track-white/5 flex gap-6 snap-x snap-mandatory">
                        {loading.reality ? (
                          // Premium skeleton loading
                          Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="min-w-[280px] md:min-w-[360px] aspect-video bg-white/5 rounded-2xl animate-pulse border border-white/5" />
                          ))
                        ) : (
                          realityEpisodes.map((ep) => {
                            const isWatched = realityWatched.includes(ep.id);
                            const progress = realityProgress[ep.id] || 0;

                            return (
                              <div
                                key={ep.id}
                                className="min-w-[280px] md:min-w-[360px] snap-start bg-[#111111]/80 backdrop-blur-md rounded-2xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                              >
                                <div className="relative aspect-video bg-black overflow-hidden">
                                  <img 
                                    src={ep.thumbnailImage} 
                                    alt={ep.title}
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 ease-out" 
                                  />
                                  
                                  {/* Badges */}
                                  <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
                                    <span className="bg-black/80 backdrop-blur-sm text-[#D4AF37] text-[10px] font-mono px-2.5 py-0.5 rounded-md font-bold border border-[#D4AF37]/20 uppercase">
                                      {ep.episodeNumber}
                                    </span>
                                    {isWatched && (
                                      <span className="bg-[#4ADE80]/90 backdrop-blur-sm text-black text-[9px] font-bold px-2 py-0.5 rounded-md uppercase self-start">
                                        ✓ COMPLETED
                                      </span>
                                    )}
                                  </div>

                                  <span className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-sm text-white text-[10px] font-mono px-2 py-0.5 rounded-md font-medium border border-white/10">
                                    {ep.duration}
                                  </span>

                                  {/* Dynamic progress bar if in progress */}
                                  {!isWatched && progress > 0 && (
                                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                                      <div className="h-full bg-[#D4AF37]" style={{ width: `${progress}%` }} />
                                    </div>
                                  )}
                                </div>
                                
                                <div className="p-4 space-y-2 flex-grow flex flex-col justify-between">
                                  <div>
                                    <h3 className="text-sm md:text-base font-extrabold text-white leading-snug line-clamp-1 group-hover:text-[#D4AF37] transition-colors">
                                      {ep.title}
                                    </h3>
                                    <p className="text-[11px] text-white/55 line-clamp-2 mt-1 leading-relaxed">
                                      {ep.description}
                                    </p>
                                  </div>
                                  
                                  <div className="flex items-center justify-between pt-3 border-t border-white/5 text-[10px] font-mono text-white/40">
                                    <span>{ep.views} views</span>
                                    <span>{ep.publishDate}</span>
                                  </div>
                                </div>

                                <button
                                  onClick={() => {
                                    setActiveTab("reality");
                                    // Save selection for LifeReality component
                                    localStorage.setItem("apna_sooch_reality_active_id", ep.id);
                                  }}
                                  className="w-full bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] py-3 text-xs font-bold transition-all border-t border-white/5 flex items-center justify-center gap-1.5 clickable"
                                >
                                  ▶ Watch Episode
                                </button>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Future Modules Roadmap / Bento */}
                  <FutureReady />
                </motion.div>
              )}

              {/* TAB 2: VIDEOS PAGE */}
              {activeTab === "videos" && (
                <motion.div
                  key="videos-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <VideoLibrary 
                    videos={videos} 
                    bookmarks={bookmarks} 
                    onBookmarkToggle={handleBookmarkToggle} 
                    onWatchVideo={setActiveVideoPlayer} 
                    isLoading={loading.videos}
                  />
                </motion.div>
              )}

              {/* TAB 3: SHORTS PAGE */}
              {activeTab === "shorts" && (
                <motion.div
                  key="shorts-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <ShortsLibrary
                    shorts={shorts}
                    bookmarks={bookmarks}
                    onBookmarkToggle={handleBookmarkToggle}
                    isLoading={loading.shorts}
                  />
                </motion.div>
              )}

              {/* TAB 4: PLAYLISTS PAGE */}
              {activeTab === "playlists" && (
                <motion.div
                  key="playlists-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <PlaylistsLibrary
                    playlists={playlists}
                    videos={videos}
                    bookmarks={bookmarks}
                    onBookmarkToggle={handleBookmarkToggle}
                    isLoading={loading.playlists}
                  />
                </motion.div>
              )}

              {/* TAB 5: COMMUNITY PAGE */}
              {activeTab === "community" && (
                <motion.div
                  key="community-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <CommunityHub
                    community={community}
                    videos={videos}
                    dailyQuote={dailyQuote}
                    loadingCommunity={loading.community}
                    votedPolls={votedPolls}
                    onVote={handleVote}
                    onWatchVideo={setActiveVideoPlayer}
                  />
                </motion.div>
              )}

              {/* TAB 6: DEDICATED DAILY WISDOM */}
              {activeTab === "gita" && (
                <motion.div
                  key="gita-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <DailyWisdom
                    verse={dailyGita}
                    loading={loading.gita}
                    videos={videos}
                    onWatchVideo={setActiveVideoPlayer}
                  />
                </motion.div>
              )}

               {/* TAB 6B: LIFE REALITY */}
              {activeTab === "reality" && (
                <motion.div
                  key="reality-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <LifeReality
                    bookmarks={bookmarks}
                    onBookmarkToggle={handleBookmarkToggle}
                    episodes={realityEpisodes}
                    isLoading={loading.reality}
                  />
                </motion.div>
              )}

              {/* TAB 6C: AI LIFE GUIDE */}
              {activeTab === "ai-guide" && (
                <motion.div
                  key="ai-guide-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <AILifeGuide
                    onWatchVideo={setActiveVideoPlayer}
                  />
                </motion.div>
              )}

              {/* TAB 7: ABOUT PAGE */}
              {activeTab === "about" && (
                <motion.div
                  key="about-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <AboutUs
                    videos={videos}
                    onWatchVideo={setActiveVideoPlayer}
                    setActiveTab={setActiveTab}
                  />
                </motion.div>
              )}

              {/* TAB 8: CONTACT PAGE */}
              {activeTab === "contact" && (
                <motion.div
                  key="contact-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                >
                  <ContactCenter />
                </motion.div>
              )}

              {/* TAB 9: BOOKMARKS / SURAKSHIT VIDEOS */}
              {activeTab === "bookmarks" && (
                <motion.div
                  key="bookmarks-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-8"
                >
                  <div className="pb-4 border-b border-white/5">
                    <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-wide">
                      सुरक्षित वीडियो ग्रंथ • Bookmarks
                    </h2>
                    <p className="text-white/40 text-xs md:text-sm">
                      आपके द्वारा बाद में देखने के लिए संजोए गए महत्वपूर्ण वीडियो।
                    </p>
                  </div>

                  {bookmarks.length === 0 ? (
                    <div className="text-center py-24 bg-[#111111] rounded-3xl border border-white/5 space-y-4 max-w-xl mx-auto">
                      <div className="text-4xl">🔖</div>
                      <h4 className="text-base font-bold text-white">कोई वीडियो सुरक्षित नहीं है</h4>
                      <p className="text-white/50 text-xs max-w-xs mx-auto">
                        वीडियो लाइब्रेरी में जाकर ज्ञानवर्धक व्याख्यानों को सुरक्षित करें ताकि आप उन्हें कभी भी पुनः देख सकें।
                      </p>
                      <button
                        onClick={() => setActiveTab("videos")}
                        className="px-5 py-2.5 bg-[#D4AF37] text-black text-xs font-bold rounded-xl hover:scale-105 active:scale-95 transition-all clickable"
                      >
                        वीडियो लाइब्रेरी देखें
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {videos
                        .filter((v) => bookmarks.includes(v.id))
                        .map((v) => (
                          <div
                            key={v.id}
                            className="bg-[#111111] rounded-2xl overflow-hidden border border-white/5 hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col justify-between group shadow-lg"
                          >
                            <div className="relative aspect-video bg-black overflow-hidden">
                              <img 
                                src={`https://img.youtube.com/vi/${v.youtubeId}/mqdefault.jpg`} 
                                alt={v.title}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500 ease-out" 
                              />
                              <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                                {v.duration}
                              </span>
                              
                              <button
                                onClick={() => handleBookmarkToggle(v.id)}
                                className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-red-600 rounded-full text-white transition-all clickable"
                                title="सुरक्षित सूची से निकालें"
                              >
                                <XIcon className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            
                            <div className="p-4 space-y-2 flex-grow">
                              <span className="text-[#D4AF37] text-[10px] font-bold uppercase tracking-wider">{v.category}</span>
                              <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">
                                {v.title}
                              </h4>
                            </div>

                            <button
                              onClick={() => setActiveVideoPlayer(v.youtubeId)}
                              className="w-full bg-[#FF0000] hover:bg-[#FF0000]/90 text-white py-2.5 text-xs font-bold transition-all flex items-center justify-center gap-1.5 clickable"
                            >
                              ▶ अभी देखें
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </main>

          {/* Premium Footer with brand identity */}
          <Footer activeTab={activeTab} onTabChange={setActiveTab} />

          {/* iOS / Android Responsive Bottom Navigation */}
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Floating Back to Top Button */}
          <AnimatePresence>
            {showBackToTop && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="fixed bottom-24 lg:bottom-6 right-6 z-[990] w-12 h-12 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all clickable"
                title="ऊपर जाएं"
              >
                <ArrowUp className="w-5 h-5 stroke-[2.5]" />
              </motion.button>
            )}
          </AnimatePresence>

          {/* Absolute Centered Video Theater Player Overlay */}
          <AnimatePresence>
            {activeVideoPlayer && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[12000] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
              >
                <div className="absolute inset-0" onClick={() => setActiveVideoPlayer(null)} />
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="relative w-full max-w-4xl aspect-video bg-black rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl z-10"
                >
                  <button
                    onClick={() => setActiveVideoPlayer(null)}
                    className="absolute -top-12 right-0 p-2 text-white/60 hover:text-white flex items-center gap-1.5 font-bold text-xs bg-white/5 hover:bg-white/10 rounded-full transition-all clickable"
                  >
                    <span>बंद करें (Close)</span> <XIcon className="w-4 h-4" />
                  </button>

                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${activeVideoPlayer}?autoplay=1&rel=0`}
                    title="Apna Sooch Player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      )}

    </div>
  );
}

// Inline Icon Fallback to keep setup extremely clean
function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}
