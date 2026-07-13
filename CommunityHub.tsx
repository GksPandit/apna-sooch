import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Youtube, 
  Instagram, 
  MessageSquare, 
  Sparkles, 
  Play, 
  Heart, 
  ArrowRight, 
  Clock, 
  Check, 
  Compass, 
  Flame, 
  Bookmark, 
  Users, 
  Award, 
  Layers, 
  BookOpen, 
  TrendingUp, 
  Share2, 
  ChevronRight,
  ShieldAlert,
  Info
} from "lucide-react";
import { Video, CommunityPost, Quote } from "../types";

interface CommunityHubProps {
  community: CommunityPost[];
  videos: Video[];
  dailyQuote: Quote | null;
  loadingCommunity: boolean;
  votedPolls: Record<string, number>;
  onVote: (pollId: string, optionIndex: number) => void;
  onWatchVideo: (youtubeId: string) => void;
}

// 6 Core Community Values
const COMMUNITY_VALUES = [
  {
    title: "Life Reality",
    desc: "Unveiling the truth of existence, breaking illusions, and seeing life as it truly is.",
    color: "from-red-500/10 to-red-600/5",
    borderColor: "hover:border-red-500/30",
    iconColor: "text-red-500",
    icon: Flame,
    tag: "सच्चाई"
  },
  {
    title: "Self Discipline",
    desc: "Mastering the mind, establishing robust habits, and finding freedom through absolute restraint.",
    color: "from-amber-500/10 to-amber-600/5",
    borderColor: "hover:border-amber-500/30",
    iconColor: "text-amber-500",
    icon: Award,
    tag: "अनुशासन"
  },
  {
    title: "Psychology",
    desc: "Understanding human behavior, cognitive traps, and ancient secrets of mental composure.",
    color: "from-blue-500/10 to-blue-600/5",
    borderColor: "hover:border-blue-500/30",
    iconColor: "text-blue-500",
    icon: Compass,
    tag: "मनोविज्ञान"
  },
  {
    title: "Sanatan Wisdom",
    desc: "Drawing timeless, practical lessons from the Bhagavad Gita and ancient spiritual scriptures.",
    color: "from-yellow-500/10 to-yellow-600/5",
    borderColor: "hover:border-yellow-500/30",
    iconColor: "text-yellow-500",
    icon: BookOpen,
    tag: "सनातन ज्ञान"
  },
  {
    title: "Positive Thinking",
    desc: "Cultivating hope, re-framing obstacles as stepping stones, and radiating constructive energy.",
    color: "from-emerald-500/10 to-emerald-600/5",
    borderColor: "hover:border-emerald-500/30",
    iconColor: "text-emerald-500",
    icon: Sparkles,
    tag: "सकारात्मक सोच"
  },
  {
    title: "Personal Growth",
    desc: "Continuous self-evolution, expanding consciousness, and realizing your highest potential.",
    color: "from-purple-500/10 to-purple-600/5",
    borderColor: "hover:border-purple-500/30",
    iconColor: "text-purple-500",
    icon: TrendingUp,
    tag: "आत्म-विकास"
  }
];

export default function CommunityHub({
  community,
  videos,
  dailyQuote,
  loadingCommunity,
  votedPolls,
  onVote,
  onWatchVideo
}: CommunityHubProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeFeedTab, setActiveFeedTab] = useState<"noticeboard" | "polls">("noticeboard");

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // 1. Get latest YouTube upload dynamically
  const latestVideo = useMemo(() => {
    return videos[0] || null;
  }, [videos]);

  // 2. Get a real video from 'Reality of Life' category for the Featured Series: Life Reality - Episode 01
  const lifeRealityEpisode = useMemo(() => {
    const matched = videos.find(v => 
      v.category.toLowerCase().includes("reality") || 
      v.title.toLowerCase().includes("reality") ||
      v.description.toLowerCase().includes("reality")
    );
    return matched || videos[1] || videos[0] || null;
  }, [videos]);

  // 3. Fallback featured quote
  const featuredQuote = useMemo(() => {
    if (dailyQuote) return dailyQuote;
    return {
      text: "जब तक आप अपनी सोच को नहीं बदलते, तब तक आपका जीवन नहीं बदल सकता। असली बदलाव भीतर से शुरू होता है।",
      author: "Apna Sooch"
    };
  }, [dailyQuote]);

  // Filter posts into announcements vs polls for clean categorized noticeboard
  const communityPosts = useMemo(() => {
    return community.filter(p => !p.isPoll);
  }, [community]);

  const communityPolls = useMemo(() => {
    return community.filter(p => p.isPoll);
  }, [community]);

  const handleCopyLink = (link: string, msg: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link)
        .then(() => triggerToast(msg))
        .catch(() => triggerToast("Copy failed"));
    }
  };

  return (
    <div className="space-y-16 animate-fade-in" id="community-hub-root">
      {/* 1. HEADER SECTION (Apple / Notion Style) */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
        >
          <Users className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">Apna Sooch Family Hub</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white font-sans">
          Community
        </h1>
        <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Join thousands of people who are exploring life's deeper truths together.
        </p>
      </div>

      {/* 2. COMMUNITY MISSION & WHY JOIN CARD */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-900/60 via-zinc-950/80 to-black p-8 md:p-12 shadow-2xl backdrop-blur-xl group"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-[#D4AF37]/8 transition-all duration-700" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[#D4AF37] font-mono text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Our Collective Purpose
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
              Why Join Our Community?
            </h2>
            <p className="text-white/70 text-xs md:text-sm leading-relaxed">
              Our community is a beautiful, dedicated sanctuary designed to discuss life, learn from real experiences, and grow together through wisdom and meaningful, high-value conversations. We strive to pull ourselves out of modern distractions, explore spiritual and mental frameworks, and support each other's path of personal growth and self-mastery.
            </p>
          </div>

          <div className="flex-shrink-0 bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-center w-full md:w-64 space-y-2 backdrop-blur-md">
            <span className="text-3xl">🤝</span>
            <h4 className="text-white font-bold text-sm">Become part of the mission</h4>
            <p className="text-white/40 text-[10px] leading-relaxed">No algorithms dictating your beliefs. Just raw, pure wisdom shared among truth seekers.</p>
          </div>
        </div>
      </motion.div>

      {/* 3. JOIN SECTION - 3 PREMIUM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: YouTube Community */}
        <motion.div
          whileHover={{ y: -6 }}
          className="relative group overflow-hidden rounded-2xl border border-white/5 hover:border-red-500/30 bg-zinc-950/40 hover:bg-zinc-950/80 p-6 flex flex-col justify-between h-72 shadow-xl backdrop-blur-xl transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 border border-red-500/10">
              <Youtube className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white group-hover:text-red-500 transition-colors">YouTube Community</h3>
              <p className="text-white/50 text-xs mt-1.5 leading-relaxed">
                Stay updated with interactive polls, text messages, announcements, and visual quotes straight from the creator on our official tab.
              </p>
            </div>
          </div>
          <a
            href="https://youtube.com/@apnasooch/community?si=Hu2bX7JMMf5fMhmm"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-red-600 hover:bg-white text-white hover:text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-1.5 clickable"
          >
            <span>Open Community</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Card 2: WhatsApp Community */}
        <motion.div
          whileHover={{ y: -6 }}
          className="relative group overflow-hidden rounded-2xl border border-white/5 hover:border-emerald-500/30 bg-zinc-950/40 hover:bg-zinc-950/80 p-6 flex flex-col justify-between h-72 shadow-xl backdrop-blur-xl transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-600/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-600/10 flex items-center justify-center text-emerald-500 border border-emerald-500/10">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white group-hover:text-emerald-500 transition-colors">WhatsApp Community</h3>
              <p className="text-white/50 text-xs mt-1.5 leading-relaxed">
                Get morning thoughts, video alerts, and crucial notifications sent directly to your phone. Completely private and premium.
              </p>
            </div>
          </div>
          <a
            href="https://whatsapp.com/channel/0029VbBFNgA89inZldFAjK1c"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-emerald-600 hover:bg-white text-white hover:text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-1.5 clickable"
          >
            <span>Join WhatsApp</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>

        {/* Card 3: Instagram */}
        <motion.div
          whileHover={{ y: -6 }}
          className="relative group overflow-hidden rounded-2xl border border-white/5 hover:border-pink-500/30 bg-zinc-950/40 hover:bg-zinc-950/80 p-6 flex flex-col justify-between h-72 shadow-xl backdrop-blur-xl transition-all duration-500"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-600/5 rounded-full blur-[60px] pointer-events-none" />
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-pink-600/10 to-indigo-600/10 flex items-center justify-center text-pink-500 border border-pink-500/10">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white group-hover:text-pink-500 transition-colors">Instagram</h3>
              <p className="text-white/50 text-xs mt-1.5 leading-relaxed">
                Connect through visually immersive quote sheets, dynamic reels, high-quality carousel wisdom and snippets on Brahmacharya.
              </p>
            </div>
          </div>
          <a
            href="https://instagram.com/brahmcharya_gks"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-indigo-600 hover:opacity-90 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 inline-flex items-center justify-center gap-1.5 clickable"
          >
            <span>Follow Instagram</span>
            <ChevronRight className="w-4 h-4" />
          </a>
        </motion.div>
      </div>

      {/* 4. DUAL COLUMN LAYOUT: INTERACTIVE KNOWLEDGE, UPDATES AND NOTICES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Grid Area (7 cols): Latest Update, Today's Thought, and Featured Series */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* A. LATEST UPDATE SECTION */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>Latest Update</span>
            </h3>

            {latestVideo ? (
              <div className="relative group overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/40 p-4 flex flex-col sm:flex-row gap-5 items-center transition-all duration-300 hover:border-white/10 hover:bg-zinc-950/60">
                <div className="w-full sm:w-44 aspect-video bg-black rounded-xl overflow-hidden relative flex-shrink-0">
                  <img 
                    src={`https://img.youtube.com/vi/${latestVideo.youtubeId}/mqdefault.jpg`} 
                    alt={latestVideo.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                  />
                  <span className="absolute bottom-1.5 right-1.5 bg-black/85 text-[8px] font-mono font-bold text-white px-1.5 py-0.5 rounded">
                    {latestVideo.duration}
                  </span>
                </div>

                <div className="space-y-2 w-full flex-grow flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded font-bold font-mono">
                      {latestVideo.category}
                    </span>
                    <h4 className="text-sm font-black text-white group-hover:text-[#D4AF37] transition-colors line-clamp-2 leading-snug">
                      {latestVideo.title}
                    </h4>
                  </div>
                  
                  <div className="flex items-center justify-between gap-4 pt-1">
                    <span className="text-[10px] text-white/40 font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {latestVideo.date}
                    </span>
                    <button
                      onClick={() => onWatchVideo(latestVideo.youtubeId)}
                      className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition-all flex items-center gap-1 clickable"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" /> Watch
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-28 bg-white/[0.01] border border-white/5 rounded-2xl flex items-center justify-center text-xs text-white/30">
                Loading latest upload...
              </div>
            )}
          </div>

          {/* B. FEATURED SERIES SECTION */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Featured Series</span>
            </h3>

            <div className="relative overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br from-zinc-950 via-zinc-900/60 to-black p-5 flex flex-col md:flex-row gap-6 shadow-xl">
              {/* Left thumbnail */}
              <div className="w-full md:w-56 aspect-video rounded-xl overflow-hidden relative bg-black flex-shrink-0 border border-white/5">
                <img
                  src={
                    lifeRealityEpisode 
                      ? `https://img.youtube.com/vi/${lifeRealityEpisode.youtubeId}/hqdefault.jpg`
                      : "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200"
                  }
                  alt="Life Reality Series"
                  className="w-full h-full object-cover opacity-85 hover:scale-103 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-3">
                  <span className="text-[10px] font-mono bg-red-600 text-white font-extrabold px-2 py-0.5 rounded-md">
                    EPISODE 01
                  </span>
                </div>
              </div>

              {/* Right contents */}
              <div className="flex flex-col justify-between flex-grow space-y-4">
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-[#D4AF37] font-black uppercase tracking-widest">
                    Life Reality Series
                  </span>
                  <h4 className="text-base font-black text-white leading-snug line-clamp-1">
                    {lifeRealityEpisode ? lifeRealityEpisode.title : "जीवन की कड़वी सच्चाई (The Bitter Truth of Life)"}
                  </h4>
                  <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2">
                    {lifeRealityEpisode ? lifeRealityEpisode.description : "An immersive documentary series exploring deep mental illusions, the loop of desires (Moh Maya), and reclaiming your focus."}
                  </p>
                </div>

                {/* Progress Indicators & Buttons */}
                <div className="space-y-3.5 pt-1">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                      <span className="font-bold uppercase tracking-wider text-[#D4AF37]">Continue Watching</span>
                      <span>65% Completed</span>
                    </div>
                    {/* Fake progress bar */}
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#D4AF37] to-red-500 rounded-full" style={{ width: "65%" }} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={() => lifeRealityEpisode && onWatchVideo(lifeRealityEpisode.youtubeId)}
                      className="flex-grow md:flex-initial px-5 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-1.5 clickable"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" /> Watch Now
                    </button>
                    
                    <button
                      onClick={() => triggerToast("Series added to your active list!")}
                      className="p-2.5 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white border border-white/5 hover:border-white/20 rounded-xl transition-all"
                      title="Syllabus Progress Tracker"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* C. TODAY'S THOUGHT */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              <span>Daily Thought</span>
            </h3>

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative p-8 md:p-10 rounded-2xl border border-white/5 bg-gradient-to-tr from-zinc-950 via-zinc-900/40 to-black text-center space-y-4 shadow-xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 text-7xl font-serif text-[#D4AF37]/5 select-none pointer-events-none transform translate-x-4 translate-y-2">“</div>
              <div className="absolute bottom-0 right-0 text-7xl font-serif text-[#D4AF37]/5 select-none pointer-events-none transform -translate-x-4 -translate-y-2">”</div>
              
              <div className="space-y-1">
                <span className="text-[9px] text-[#D4AF37] font-mono font-bold uppercase tracking-widest block">Today's Thought</span>
                <span className="text-white/35 text-[9px] font-mono">Future Ready for Updates</span>
              </div>

              <blockquote className="text-base md:text-lg font-medium text-white/90 leading-relaxed italic max-w-2xl mx-auto">
                "{featuredQuote.text}"
              </blockquote>

              <cite className="block text-xs font-black font-mono text-[#D4AF37] not-italic tracking-wider uppercase">
                — {featuredQuote.author}
              </cite>
            </motion.div>
          </div>

        </div>

        {/* Right Grid Area (5 cols): Interactive Feed Noticeboard & Polls */}
        <div className="lg:col-span-5 space-y-4 self-stretch">
          
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              <span>Announcements & Polls</span>
            </h3>

            {/* Quick selectors */}
            <div className="flex bg-white/[0.03] border border-white/10 rounded-lg p-0.5">
              <button
                onClick={() => setActiveFeedTab("noticeboard")}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition-all ${
                  activeFeedTab === "noticeboard" 
                    ? "bg-[#D4AF37] text-black" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Notices
              </button>
              <button
                onClick={() => setActiveFeedTab("polls")}
                className={`px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-md transition-all ${
                  activeFeedTab === "polls" 
                    ? "bg-[#D4AF37] text-black" 
                    : "text-white/60 hover:text-white"
                }`}
              >
                Polls ({communityPolls.length})
              </button>
            </div>
          </div>

          <div className="bg-[#0b0b0e] border border-white/5 rounded-2xl p-5 md:p-6 space-y-5 h-[580px] overflow-y-auto custom-scrollbar shadow-2xl relative">
            {loadingCommunity ? (
              <div className="space-y-4 py-12 text-center text-white/30 text-xs">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#D4AF37] mx-auto mb-3" />
                Updating community feed...
              </div>
            ) : activeFeedTab === "noticeboard" ? (
              /* Notices tab rendering regular posts */
              communityPosts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-white/40 text-xs space-y-3">
                  <span className="text-2xl">📢</span>
                  <p>No notices available right now.</p>
                </div>
              ) : (
                <div className="space-y-5 divide-y divide-white/5">
                  {communityPosts.map((p, idx) => (
                    <div key={p.id} className={`space-y-3 ${idx > 0 ? "pt-5" : ""}`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-red-600/10 text-[#D4AF37] border border-[#D4AF37]/20 font-black flex items-center justify-center text-xs">
                            AS
                          </div>
                          <div>
                            <h4 className="text-xs font-black text-white flex items-center gap-1.5">
                              {p.author}
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" title="Verified Creator" />
                            </h4>
                            <span className="text-white/40 text-[9px] font-mono">{p.date}</span>
                          </div>
                        </div>

                        <button 
                          onClick={() => handleCopyLink(`https://youtube.com/@apnasooch/community`, "Notice Link Copied! 🔗")}
                          className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-colors"
                          title="Copy notice link"
                        >
                          <Share2 className="w-3 h-3" />
                        </button>
                      </div>

                      <p className="text-white/80 text-xs leading-relaxed whitespace-pre-line font-medium pl-1">
                        {p.content}
                      </p>

                      <div className="flex items-center gap-4 pl-1 text-[10px] text-white/40">
                        <span className="flex items-center gap-1">
                          ❤️ {p.likes || "25K"}
                        </span>
                        <span className="flex items-center gap-1">
                          💬 {p.comments || "800"} comments
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              /* Polls tab rendering interactive polls */
              communityPolls.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-white/40 text-xs space-y-3">
                  <span className="text-2xl">📊</span>
                  <p>No active polls at this time.</p>
                </div>
              ) : (
                <div className="space-y-6 divide-y divide-white/5">
                  {communityPolls.map((p, idx) => (
                    <div key={p.id} className={`space-y-4.5 ${idx > 0 ? "pt-6" : ""}`}>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-black flex items-center justify-center text-xs">
                          📊
                        </div>
                        <div>
                          <h4 className="text-xs font-black text-white flex items-center gap-1">
                            {p.author}
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          </h4>
                          <span className="text-white/40 text-[9px] font-mono">{p.date}</span>
                        </div>
                      </div>

                      <p className="text-white/90 text-xs font-bold leading-relaxed whitespace-pre-line pl-1">
                        {p.content}
                      </p>

                      <div className="space-y-2 pl-1">
                        {p.options?.map((opt, oIndex) => {
                          const hasVoted = votedPolls[p.id] !== undefined;
                          const userVote = votedPolls[p.id] === oIndex;
                          
                          let percent = opt.percentage;
                          if (hasVoted) {
                            percent = userVote ? opt.percentage + 2 : opt.percentage - 1;
                          }

                          return (
                            <button
                              key={opt.text}
                              disabled={hasVoted}
                              onClick={() => onVote(p.id, oIndex)}
                              className={`w-full text-left relative overflow-hidden p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs font-bold ${
                                userVote 
                                  ? "border-[#D4AF37] bg-[#D4AF37]/5" 
                                  : hasVoted 
                                  ? "border-white/5 bg-white/[0.01]" 
                                  : "border-white/10 hover:border-[#D4AF37]/50 bg-transparent"
                              } clickable`}
                            >
                              {hasVoted && (
                                <div 
                                  className="absolute left-0 top-0 bottom-0 bg-[#D4AF37]/10 -z-10 transition-all duration-500" 
                                  style={{ width: `${percent}%` }}
                                />
                              )}
                              
                              <span className="text-white/80">{opt.text}</span>
                              
                              {hasVoted && (
                                <span className="text-[#D4AF37] font-mono font-bold text-[10px]">
                                  {percent}%
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between text-[9px] text-white/35 font-mono px-1">
                        <span>Total votes: {p.totalVotes || "120,000"}</span>
                        <span className="text-[#D4AF37] font-bold">
                          {votedPolls[p.id] !== undefined ? "Vote recorded ✓" : "Cast your vote"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>

      </div>

      {/* 5. COMMUNITY VALUES (6 Premium cards in grid) */}
      <div className="space-y-6">
        <div className="space-y-1.5 text-center">
          <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">The Pillars of Wisdom</span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Community Values</h2>
          <p className="text-white/50 text-xs md:text-sm max-w-xl mx-auto leading-relaxed">
            The fundamental topics we explore, share, and discuss within our community structures daily.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMMUNITY_VALUES.map((val, index) => {
            const IconComponent = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                whileHover={{ y: -4 }}
                className={`relative overflow-hidden rounded-2xl border border-white/5 ${val.borderColor} bg-gradient-to-br ${val.color} p-6 flex flex-col justify-between h-48 shadow-lg transition-all duration-300`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center ${val.iconColor}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] bg-white/5 border border-white/10 text-white/70 px-2 py-0.5 rounded-md font-bold">
                      {val.tag}
                    </span>
                  </div>

                  <h4 className="text-sm font-black text-white">{val.title}</h4>
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                    {val.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 6. CALL TO ACTION - LUXURY WIDESCREEN BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-zinc-950 p-8 md:p-14 text-center space-y-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />
        
        <div className="space-y-3.5 relative z-10">
          <span className="text-[#D4AF37] font-mono text-[10px] font-black uppercase tracking-widest block">No obligations • Pure Wisdom</span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Become a Part of Apna Sooch
          </h2>
          <p className="text-white/60 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Reclaim your attention, level up your life discipline, and align with truth-seekers from across the nation. Join us on our primary platforms today.
          </p>
        </div>

        {/* Triple Action Buttons tray */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10 max-w-xl mx-auto">
          <a
            href="https://youtube.com/@apnasooch"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-white hover:text-black text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 clickable shadow-lg shadow-red-600/10"
          >
            <Youtube className="w-4 h-4" />
            <span>Subscribe on YouTube</span>
          </a>

          <a
            href="https://whatsapp.com/channel/0029VbBFNgA89inZldFAjK1c"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-white hover:text-black text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 clickable shadow-lg shadow-emerald-600/10"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Join WhatsApp</span>
          </a>

          <a
            href="https://instagram.com/brahmcharya_gks"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-white border border-white/10 hover:border-transparent font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 clickable"
          >
            <Instagram className="w-4 h-4" />
            <span>Follow Instagram</span>
          </a>
        </div>
      </motion.div>

      {/* Floating Glass Toast Alert */}
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
