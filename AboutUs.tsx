import React, { useMemo } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Play, 
  BookOpen, 
  Heart, 
  ShieldCheck, 
  Clock, 
  Target, 
  Users, 
  TrendingUp, 
  Compass, 
  Zap, 
  ShieldAlert, 
  Award, 
  CheckCircle2, 
  ChevronRight, 
  Bookmark, 
  PlusCircle, 
  Lock, 
  Minimize2,
  Tv
} from "lucide-react";
import { Video } from "../types";

interface AboutUsProps {
  videos: Video[];
  onWatchVideo: (youtubeId: string) => void;
  setActiveTab: (tab: string) => void;
}

// 8 "What We Believe" beliefs cards
const BELIEF_CARDS = [
  {
    title: "Life Reality",
    desc: "Seeing life exactly as it is, without illusions, sweet lies, or sugarcoating.",
    icon: ShieldAlert,
    color: "from-red-500/10 to-red-600/5",
    borderColor: "hover:border-red-500/30",
    iconColor: "text-red-500"
  },
  {
    title: "Psychology",
    desc: "Mastering the mechanics of the human mind, cognitive biases, and emotional triggers.",
    icon: Compass,
    color: "from-blue-500/10 to-blue-600/5",
    borderColor: "hover:border-blue-500/30",
    iconColor: "text-blue-500"
  },
  {
    title: "Sanatan Wisdom",
    desc: "Bringing eternal principles of the Bhagavad Gita and ancient rishis into the 21st century.",
    icon: BookOpen,
    color: "from-amber-500/10 to-amber-600/5",
    borderColor: "hover:border-amber-500/30",
    iconColor: "text-amber-500"
  },
  {
    title: "Character Building",
    desc: "Forging inner integrity, respect, truthfulness, and standing unwavering in your values.",
    icon: ShieldCheck,
    color: "from-emerald-500/10 to-emerald-600/5",
    borderColor: "hover:border-emerald-500/30",
    iconColor: "text-emerald-500"
  },
  {
    title: "Self Discipline",
    desc: "Overcoming lazy routines, modern instant-gratification hooks, and mastering cell control.",
    icon: Award,
    color: "from-orange-500/10 to-orange-600/5",
    borderColor: "hover:border-orange-500/30",
    iconColor: "text-orange-500"
  },
  {
    title: "Mindset",
    desc: "Transitioning from a fragile victim mentality to a resilient, active learner's mindset.",
    icon: Target,
    color: "from-cyan-500/10 to-cyan-600/5",
    borderColor: "hover:border-cyan-500/30",
    iconColor: "text-cyan-500"
  },
  {
    title: "Truth",
    desc: "Uncompromising loyalty to reality, raw experience, and objective facts over comforting delusion.",
    icon: Zap,
    color: "from-yellow-500/10 to-yellow-600/5",
    borderColor: "hover:border-yellow-500/30",
    iconColor: "text-yellow-500"
  },
  {
    title: "Personal Growth",
    desc: "Taking absolute accountability for your life, progress, mental balance, and consciousness.",
    icon: TrendingUp,
    color: "from-purple-500/10 to-purple-600/5",
    borderColor: "hover:border-purple-500/30",
    iconColor: "text-purple-500"
  }
];

// Content categories
const CONTENT_CATEGORIES = [
  "Life Reality",
  "Psychology",
  "Moh Maya",
  "Human Behaviour",
  "Relationships",
  "Self Discipline",
  "Mindset",
  "Success",
  "Failure",
  "Character Building",
  "Sanatan Wisdom",
  "Daily Reflection"
];

// Comparison data (Others vs Apna Sooch)
const COMPARISONS = [
  {
    category: "Motivation Style",
    others: "Only motivational quotes.",
    apnaSooch: "Real life understanding."
  },
  {
    category: "Source Depth",
    others: "Only scripture explanation.",
    apnaSooch: "Practical life application."
  },
  {
    category: "Impact Period",
    others: "Temporary motivation.",
    apnaSooch: "Long-term transformation."
  }
];

export default function AboutUs({ videos, onWatchVideo, setActiveTab }: AboutUsProps) {
  // Find latest episode uploaded belonging to 'Life Reality' category or general videos
  const latestRealityEpisode = useMemo(() => {
    // Look for video containing 'reality' or 'सच्चाई' or 'truth'
    const matched = videos.find(v => 
      v.category.toLowerCase().includes("reality") ||
      v.title.toLowerCase().includes("reality") ||
      v.title.toLowerCase().includes("सच्चाई") ||
      v.description.toLowerCase().includes("truth")
    );
    // If not found, use index 0 as latest episode
    return matched || videos[0] || null;
  }, [videos]);

  return (
    <div className="space-y-16 animate-fade-in" id="about-us-root">
      
      {/* 1. PAGE HEADER */}
      <div className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">Philosophical Foundations</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white font-sans">
          About Apna Sooch
        </h1>
        <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
          Understanding life through wisdom, experience and truth.
        </p>
      </div>

      {/* 2. DUAL COLUMN: WHO WE ARE & OUR MISSION (Apple / Notion Grid Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* WHO WE ARE */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-900/40 to-black/60 p-8 md:p-10 shadow-xl backdrop-blur-md flex flex-col justify-between"
        >
          <div className="space-y-4">
            <span className="text-[#D4AF37] font-mono text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> Identity & Philosophy
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Who is Apna Sooch?
            </h2>
            <div className="text-white/70 text-xs md:text-sm leading-relaxed space-y-3.5 font-medium">
              <p>
                Apna Sooch is a platform dedicated to helping people understand the deeper truths of life.
              </p>
              <p className="border-l-2 border-[#D4AF37]/50 pl-3 italic text-white/90">
                We do not simply explain scriptures.
              </p>
              <p>
                We explain how timeless wisdom can be applied in today's real life. Every single video is created to help people become mentally stronger, emotionally balanced and spiritually aware.
              </p>
            </div>
          </div>
          <div className="pt-6 text-white/30 text-[10px] font-mono">ESTABLISHED FOR REAL CHANGE</div>
        </motion.div>

        {/* OUR MISSION */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-900/40 to-black/60 p-8 md:p-10 shadow-xl backdrop-blur-md flex flex-col justify-between"
        >
          <div className="space-y-4">
            <span className="text-[#D4AF37] font-mono text-[10px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5" /> Our North Star
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Our Mission
            </h2>
            <div className="text-white/70 text-xs md:text-sm leading-relaxed space-y-4 font-medium">
              <p className="flex items-start gap-2.5">
                <span className="text-[#D4AF37] text-xs pt-1">✦</span>
                <span>To inspire people to think differently.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="text-[#D4AF37] text-xs pt-1">✦</span>
                <span>To help them overcome fear, attachment, anger, laziness and confusion.</span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="text-[#D4AF37] text-xs pt-1">✦</span>
                <span>To build a disciplined, peaceful and meaningful life using practical wisdom.</span>
              </p>
            </div>
          </div>
          <div className="pt-6 text-white/30 text-[10px] font-mono">RECLAIM YOUR COMPOSURE</div>
        </motion.div>

      </div>

      {/* 3. WHAT WE BELIEVE */}
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Inner Principles</span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">What We Believe</h2>
          <p className="text-white/50 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            These foundational coordinates form the bedrock of everything we stand for and produce.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BELIEF_CARDS.map((belief) => {
            const IconComponent = belief.icon;
            return (
              <motion.div
                key={belief.title}
                whileHover={{ y: -5, scale: 1.01 }}
                className={`relative overflow-hidden rounded-2xl border border-white/5 ${belief.borderColor} bg-gradient-to-br ${belief.color} p-5 md:p-6 flex flex-col justify-between h-48 shadow-lg transition-all duration-300`}
              >
                <div className="space-y-3">
                  <div className={`w-10 h-10 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center ${belief.iconColor}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-black text-white">{belief.title}</h4>
                  <p className="text-white/50 text-xs leading-relaxed line-clamp-3">
                    {belief.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. WHAT MAKES US DIFFERENT (Premium Comparison Cards) */}
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Contrast & Integrity</span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">What Makes Us Different</h2>
          <p className="text-white/50 text-xs md:text-sm max-w-lg mx-auto leading-relaxed">
            Understanding why millions turn to Apna Sooch as their reliable anchor in a chaotic digital noise-sphere.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMPARISONS.map((comp) => (
            <div 
              key={comp.category}
              className="relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/40 p-5 md:p-6 space-y-4 flex flex-col justify-between shadow-xl"
            >
              <div className="space-y-3">
                <span className="text-[10px] font-mono font-bold text-white/35 uppercase tracking-widest block border-b border-white/5 pb-2">
                  {comp.category}
                </span>

                {/* Others row */}
                <div className="space-y-1 py-1">
                  <span className="text-[9px] font-mono bg-white/5 text-white/50 px-2 py-0.5 rounded uppercase font-bold">Others</span>
                  <p className="text-xs text-white/55 font-medium line-clamp-1">{comp.others}</p>
                </div>

                {/* Divider lines */}
                <div className="w-full h-px bg-white/5" />

                {/* Apna Sooch row */}
                <div className="space-y-1 py-1">
                  <span className="text-[9px] font-mono bg-[#D4AF37]/15 text-[#D4AF37] px-2 py-0.5 rounded uppercase font-bold">Apna Sooch</span>
                  <p className="text-sm text-white font-black">{comp.apnaSooch}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[#D4AF37] text-[10px] font-mono font-bold uppercase tracking-wider mt-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Authentic Path
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. OUR CONTENT CATEGORIES */}
      <div className="space-y-5">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Wisdom Syllabus</span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Our Content Categories</h2>
        </div>

        <div className="flex flex-wrap gap-2.5 justify-center max-w-4xl mx-auto">
          {CONTENT_CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="px-4 py-2 bg-white/[0.02] border border-white/5 text-white/80 rounded-xl text-xs font-extrabold tracking-wide hover:border-[#D4AF37]/30 hover:bg-white/[0.04] transition-all cursor-default shadow-md"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>

      {/* 6. FEATURED SERIES SECTION (Dynamic Sync with Real uploads) */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-white/40 flex items-center gap-2 justify-center">
          <Tv className="w-4 h-4 text-[#D4AF37]" />
          <span>Life Reality Featured Series</span>
        </h3>

        <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-950 via-zinc-900/60 to-black p-6 md:p-8 shadow-xl max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
          {/* Left Thumbnail container */}
          <div className="w-full md:w-64 aspect-video rounded-xl overflow-hidden relative bg-black flex-shrink-0 border border-white/5">
            <img
              src={
                latestRealityEpisode 
                  ? `https://img.youtube.com/vi/${latestRealityEpisode.youtubeId}/hqdefault.jpg`
                  : "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=1200"
              }
              alt="Life Reality Series Episode"
              className="w-full h-full object-cover opacity-85 hover:scale-103 transition-all duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 to-transparent flex items-end p-3">
              <span className="text-[10px] font-mono bg-[#D4AF37] text-black font-extrabold px-2 py-0.5 rounded-md">
                EPISODE 01 • LATEST EPISODE
              </span>
            </div>
          </div>

          {/* Right text content area */}
          <div className="flex flex-col justify-between flex-grow space-y-4">
            <div className="space-y-1.5">
              <span className="text-[9px] font-mono text-[#D4AF37] font-black uppercase tracking-widest block">
                Automatic Update Sync
              </span>
              <h4 className="text-base sm:text-lg font-black text-white leading-snug line-clamp-2">
                {latestRealityEpisode ? latestRealityEpisode.title : "जीवन की कड़वी सच्चाई (The Bitter Truth of Life)"}
              </h4>
              <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
                {latestRealityEpisode ? latestRealityEpisode.description : "Our core wisdom documentary syllabus explaining Moh Maya, self identity illusions, and forging self discipline."}
              </p>
            </div>

            {/* Video status and action buttons */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] font-mono text-white/40">
                  <span className="font-bold text-[#D4AF37]">CONTINUE WATCHING</span>
                  <span>95% Completed</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-full" style={{ width: "95%" }} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => latestRealityEpisode && onWatchVideo(latestRealityEpisode.youtubeId)}
                  className="px-6 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-1.5 clickable"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Watch Now
                </button>
                <span className="text-[10px] text-white/35 font-mono">
                  Sync status: Online ✓
                </span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 7. OUR PROMISE (Highlighted Section) */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative overflow-hidden rounded-3xl border border-yellow-500/10 bg-zinc-950/80 p-8 md:p-12 text-center space-y-4 max-w-3xl mx-auto shadow-2xl"
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
        <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest">Our Unbending Promise</span>
        
        <p className="text-base md:text-xl font-medium text-white/95 leading-relaxed max-w-2xl mx-auto italic">
          "Every video is created with honesty, research and genuine intention. Our goal is not to impress people. Our goal is to help people understand themselves and live better."
        </p>
        <div className="text-[10px] text-white/30 font-mono">NO SENSATIONALISM • PURE CONSCIOUSNESS</div>
      </motion.div>

      {/* 8. CALL TO ACTION - LUXURY WIDESCREEN BANNER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-[#D4AF37]/20 bg-gradient-to-r from-zinc-950 via-zinc-900/40 to-zinc-950 p-8 md:p-14 text-center space-y-8 shadow-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.06),transparent_60%)] pointer-events-none" />
        
        <div className="space-y-3.5 relative z-10">
          <span className="text-[#D4AF37] font-mono text-[10px] font-black uppercase tracking-widest block">No algorithms • Just Raw Truth</span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Become Part of Apna Sooch
          </h2>
          <p className="text-white/60 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Align with thousands who choose discipline over lazy comfort, truth over fantasy, and wisdom over mind-flickering distractions.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10 max-w-md mx-auto">
          <a
            href="https://youtube.com/@apnasooch"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-3.5 bg-red-600 hover:bg-white hover:text-black text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 clickable shadow-lg shadow-red-600/10"
          >
            <span>Subscribe</span>
          </a>

          <button
            onClick={() => setActiveTab("community")}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-white hover:text-black text-white font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 clickable"
          >
            <span>Join Community</span>
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-[#D4AF37] hover:text-black text-white border border-white/10 hover:border-transparent font-extrabold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center justify-center gap-2 clickable"
          >
            <span>Latest Videos</span>
          </button>
        </div>
      </motion.div>

    </div>
  );
}
