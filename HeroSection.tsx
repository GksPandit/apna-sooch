import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { 
  Youtube, 
  CheckCircle2, 
  Play, 
  Heart, 
  Eye, 
  Clock, 
  Calendar, 
  Lock,
  Search,
  Sparkles,
  Tv,
  MessageSquare,
  ArrowRight
} from "lucide-react";
import avatarImg from "../assets/images/apnasooch_avatar_1783877923459.jpg";
import bannerImg from "../assets/images/apnasooch_banner_1783877940325.jpg";
import { ChannelStats, Video } from "../types";

interface HeroSectionProps {
  stats: ChannelStats | null;
  onBrowseVideos: () => void;
  onJoinCommunity: () => void;
  onSearch?: (query: string) => void;
  featuredVideo?: Video | null;
}

// Sub-component for premium count-up stat animation
function AnimatedCounter({ value }: { value: string }) {
  const [displayValue, setDisplayValue] = useState("0");

  useEffect(() => {
    // Parse numeric part and suffix (e.g., 3.35K -> 3.35 and K, 385K+ -> 385 and K+)
    const match = value.match(/^([\d.]+)(.*)$/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const numericPart = parseFloat(match[1]);
    const suffix = match[2] || "";

    if (isNaN(numericPart)) {
      setDisplayValue(value);
      return;
    }

    const duration = 1500; // 1.5 seconds
    const startTime = performance.now();
    let animationFrameId: number;

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic ease out progress
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentNumber = easeProgress * numericPart;

      // Match decimal places of original number
      const originalDecimals = (match[1].split(".")[1] || "").length;
      const formattedNumber = currentNumber.toFixed(originalDecimals);

      setDisplayValue(`${formattedNumber}${suffix}`);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(value); // Force exact target value at the end
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <span>{displayValue}</span>;
}

export default function HeroSection({ stats, onBrowseVideos, onJoinCommunity, onSearch, featuredVideo }: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlayingFeatured, setIsPlayingFeatured] = useState(false);
  const [searchVal, setSearchVal] = useState("");

  // Parallax Scroll Tracking for the Hero background
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 120]);
  const opacityBg = useTransform(scrollY, [0, 500], [1, 0.35]);
  const scaleBg = useTransform(scrollY, [0, 500], [1, 1.12]);

  // Handle stats fallbacks
  const subscribers = stats?.subscribersFormatted || "3.35K";
  const views = stats?.viewsFormatted || "385K+";
  const videos = stats?.videosFormatted || "180";
  const joinedDate = stats?.joinedDate || "Oct 12, 2023";

  // Dynamic channel metadata from API
  const channelName = stats?.channelName || "Apna Sooch";
  const channelDescription = stats?.channelDescription || "हरे कृष्ण ❤️ हरे राम 🚩\nधर्मो रक्षति रक्षितः\nसनातन सत्य का अनुसरण, गीता का ज्ञान और जीवन की वास्तविकता।";
  const profilePicture = stats?.profilePicture || avatarImg;
  const channelBanner = stats?.channelBanner || bannerImg;
  const customUrl = stats?.customUrl || "@apnasooch";

  // Canvas particle effect (Subtle golden glowing particles slowly drifting upwards)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      alpha: number;
      fadeSpeed: number;
    }> = [];

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || 650;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create custom lightweight particles
    const particleCount = 40;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2.2 + 0.6,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: -Math.random() * 0.5 - 0.15, // float upwards slowly
        alpha: Math.random() * 0.55 + 0.1,
        fadeSpeed: Math.random() * 0.003 + 0.001
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        
        // Loop particles when they float off-screen
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
        if (p.x < 0 || p.x > canvas.width) {
          p.speedX *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        
        // Golden glowing amber color palette
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "#D4AF37";
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Live Instant Search submit/keystroke handler
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim() && onSearch) {
      onSearch(searchVal);
    }
  };

  const handleInstantSearch = (val: string) => {
    setSearchVal(val);
    if (onSearch) {
      onSearch(val);
    }
  };

  // Dynamic Featured Episode fallback logic
  const featured: Video = featuredVideo || {
    id: "gita-shakti-1",
    youtubeId: "W9C_CWhMv-s",
    title: "कठिन समय में क्या करें? | Bhagavad Gita Guidance",
    description: "जब जीवन में निराशा और दुख घेर ले, तब अर्जुन की तरह भगवान श्री कृष्ण के इन वचनों को याद करें। जानिए कर्मयोग और मन की शांति का वास्तविक रहस्य।",
    views: "1.2M",
    duration: "14:25",
    date: "2026-06-20",
    category: "Life Reality",
    likes: "85K"
  };

  // Automatically parse Episode number from the title
  let episodeNum = "Episode 01";
  const epMatch = featured.title.match(/(?:Episode|Ep|भाग)\s*([0-9\u0966-\u096f]+)/i);
  if (epMatch) {
    const rawNum = epMatch[1];
    if (rawNum.length === 1 && !isNaN(parseInt(rawNum))) {
      episodeNum = `Episode 0${rawNum}`;
    } else {
      episodeNum = `Episode ${rawNum}`;
    }
  }

  const seriesName = featured.category || "Life Reality";

  return (
    <div className="space-y-12 w-full" id="premium-hero-container">
      
      {/* 1. CINEMATIC HERO BLOCK */}
      <div 
        ref={containerRef}
        className="relative min-h-[580px] lg:min-h-[660px] w-full bg-[#050505] rounded-3xl overflow-hidden border border-white/5 shadow-[0_30px_70px_rgba(0,0,0,0.85)] flex flex-col justify-end"
        id="cinematic-hero-root"
      >
        {/* Parallax Channel Banner Background */}
        <motion.div 
          style={{ y: yBg, opacity: opacityBg, scale: scaleBg }}
          className="absolute inset-0 w-full h-full select-none pointer-events-none z-0"
        >
          <img 
            src={channelBanner} 
            alt={`${channelName} Banner`} 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-[1.02]"
          />
          {/* Netflix & Apple TV inspired dark/vignette gradient overlays for perfect text legibility */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/65 to-transparent" />
          <div className="absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-black/85 to-transparent" />
        </motion.div>

        {/* Slow drifting ambient glowing lights */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Ambient Gold Light Top-Right */}
          <motion.div 
            animate={{ 
              scale: [1, 1.15, 1],
              opacity: [0.15, 0.25, 0.15]
            }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#D4AF37]/20 to-transparent blur-3xl"
          />
          {/* Ambient Red Light Left-Middle */}
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.12, 0.22, 0.12]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-1/4 -left-36 w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-red-600/15 to-transparent blur-3xl"
          />
        </div>

        {/* Subtle golden particles layer */}
        <canvas 
          ref={canvasRef} 
          className="absolute inset-0 pointer-events-none z-10 opacity-80 mix-blend-screen"
        />

        {/* Content Overlay Container */}
        <div className="relative z-20 px-6 sm:px-10 md:px-14 py-12 lg:py-16 w-full space-y-10">
          
          {/* Profile & Info Block */}
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-8 pb-4">
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left max-w-4xl">
              
              {/* Profile Image with Golden Glowing Border & Online Indicator */}
              <motion.div 
                initial={{ scale: 0.92, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7 }}
                className="relative flex-shrink-0"
              >
                {/* Golden ambient blur background */}
                <div className="absolute inset-0 bg-[#D4AF37]/25 rounded-full blur-xl animate-pulse" />
                
                {/* Gold outer gradient ring */}
                <div className="w-[112px] h-[112px] md:w-[152px] md:h-[152px] rounded-full p-1 bg-gradient-to-tr from-[#D4AF37] via-[#fceab2] to-[#b89014] shadow-[0_0_35px_rgba(214,175,55,0.35)] flex items-center justify-center relative">
                  <div className="w-full h-full rounded-full bg-black overflow-hidden p-0.5">
                    <img 
                      src={profilePicture} 
                      alt={`${channelName} Profile`} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover rounded-full select-none"
                    />
                  </div>
                </div>

                {/* Online Indicator Badge with Double Ring Pulsing Effect */}
                <span className="absolute bottom-2 right-2 flex h-5 w-5 z-30">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 border-2 border-[#050505] shadow-lg"></span>
                </span>
              </motion.div>

              {/* Title, Handles, Tagline, Description */}
              <div className="space-y-3.5 self-end">
                <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]">
                    {channelName}
                  </h1>
                  
                  {/* YouTube Gold Verified Badge */}
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-1.5 bg-[#D4AF37] text-black px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-[#D4AF37]/25"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-black fill-black/10" />
                    <span>Verified</span>
                  </motion.div>
                </div>

                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
                  <span className="text-white/80 font-mono text-xs font-bold bg-white/5 px-2.5 py-0.5 rounded-md border border-white/5">
                    {customUrl}
                  </span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                  <span className="text-[#D4AF37] text-xs font-serif italic tracking-wide font-black">
                    KRISHNA ❤️ | BHAGWAT GEETA | अनुश्छेद प्रवाह
                  </span>
                </div>

                {/* Styled Hindi description as requested */}
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed max-w-2xl font-medium drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] whitespace-pre-line">
                  {channelDescription}
                </p>
              </div>
            </div>

            {/* Premium YouTube-Style Action Buttons */}
            <div className="flex flex-wrap gap-3 items-center justify-center w-full lg:w-auto">
              
              {/* SUBSCRIBE BUTTON - Large, Golden sparks, high branding */}
              <a 
                href="https://youtube.com/@apnasooch?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3.5 bg-[#FF0000] hover:bg-[#e60000] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl shadow-red-900/40 hover:scale-[1.03] active:scale-95 group cursor-pointer border border-red-500/20"
              >
                <Youtube className="w-4 h-4 fill-white text-[#FF0000]" />
                <span>🔴 Subscribe</span>
              </a>

              {/* WATCH LATEST VIDEO */}
              <button 
                onClick={() => setIsPlayingFeatured(true)}
                className="flex items-center gap-2 px-6 py-3.5 bg-white text-black hover:bg-[#D4AF37] hover:text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 shadow-xl active:scale-95 group cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current text-black group-hover:scale-110 transition-transform" />
                <span>▶ Watch Latest Video</span>
              </button>

              {/* JOIN COMMUNITY */}
              <button 
                onClick={onJoinCommunity}
                className="flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/15 text-white border border-white/5 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <Heart className="w-4 h-4 text-red-500 fill-red-500/20" />
                <span>❤️ Join Community</span>
              </button>

              {/* WHATSAPP CHANNEL */}
              <a 
                href="https://whatsapp.com/channel/0029VbBFNgA89inZldFAjK1c"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-3.5 bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 border border-emerald-500/20 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 active:scale-95 cursor-pointer"
              >
                <span className="w-4.5 h-4.5 bg-emerald-500/20 rounded-full flex items-center justify-center">🟢</span>
                <span>WhatsApp Channel</span>
              </a>
            </div>

          </div>

          {/* Premium Glassmorphic Stats Grid with Animated Counters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
            
            {/* Stat Card: Subscribers */}
            <div className="relative overflow-hidden p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-red-600/20 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 group">
              <div className="absolute top-0 left-0 h-[2px] w-0 bg-[#FF0000] group-hover:w-full transition-all duration-500" />
              <span className="text-[10px] uppercase text-white/40 tracking-wider font-extrabold block mb-1">Subscribers</span>
              <div className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight">
                <AnimatedCounter value={subscribers} />
              </div>
              <span className="text-[9px] text-white/30 block mt-1.5">Official YouTube Stats</span>
            </div>

            {/* Stat Card: Views */}
            <div className="relative overflow-hidden p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/20 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 group">
              <div className="absolute top-0 left-0 h-[2px] w-0 bg-[#D4AF37] group-hover:w-full transition-all duration-500" />
              <span className="text-[10px] uppercase text-white/40 tracking-wider font-extrabold block mb-1">Total Views</span>
              <div className="text-2xl md:text-3xl font-black text-[#D4AF37] font-mono tracking-tight">
                <AnimatedCounter value={views} />
              </div>
              <span className="text-[9px] text-white/30 block mt-1.5">Wisdom streams</span>
            </div>

            {/* Stat Card: Total Videos */}
            <div className="relative overflow-hidden p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#D4AF37]/20 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 group">
              <div className="absolute top-0 left-0 h-[2px] w-0 bg-white/30 group-hover:w-full transition-all duration-500" />
              <span className="text-[10px] uppercase text-white/40 tracking-wider font-extrabold block mb-1">Total Videos</span>
              <div className="text-2xl md:text-3xl font-black text-white font-mono tracking-tight">
                <AnimatedCounter value={videos} />
              </div>
              <span className="text-[9px] text-white/30 block mt-1.5">Lessons uploaded</span>
            </div>

            {/* Stat Card: Joined Date */}
            <div className="relative overflow-hidden p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/20 hover:bg-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 group">
              <div className="absolute top-0 left-0 h-[2px] w-0 bg-neutral-600 group-hover:w-full transition-all duration-500" />
              <span className="text-[10px] uppercase text-white/40 tracking-wider font-extrabold block mb-1">Joined Date</span>
              <div className="text-sm md:text-base font-black text-white/80 font-mono mt-1 pt-1">
                {joinedDate}
              </div>
              <span className="text-[9px] text-white/30 block mt-1.5">Aura origin</span>
            </div>

          </div>

          {/* 3. SEARCH BAR SECTION (Improved UI, Fully Rounded Glassmorphic Instant Search Widget) */}
          <div className="w-full max-w-2xl mx-auto pt-2" id="hero-glass-search-box">
            <form onSubmit={handleSearchSubmit} className="relative group">
              {/* Outer Golden/Red subtle glowing outline indicator */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#D4AF37]/15 to-red-600/15 rounded-full blur-md opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="relative flex items-center bg-[#111111]/70 backdrop-blur-xl border border-white/10 group-hover:border-white/20 focus-within:border-[#D4AF37]/50 focus-within:ring-2 focus-within:ring-[#D4AF37]/10 rounded-full py-1 pl-1.5 pr-1.5 transition-all">
                <Search className="text-[#D4AF37] w-5 h-5 ml-4 flex-shrink-0" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => handleInstantSearch(e.target.value)}
                  placeholder="ज्ञान की खोज करें... (Search videos, lessons, topics instantly)"
                  className="w-full bg-transparent border-0 text-white placeholder-white/30 text-xs md:text-sm py-3 px-3 outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#aa841c] hover:from-[#f0c950] hover:to-[#c49b25] text-black font-black text-[11px] uppercase tracking-wider rounded-full transition-all shadow-md active:scale-95"
                >
                  खोजें (Search)
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>

      {/* 2. EPISODE HIGHLIGHT SECTION (Located directly below the Hero block) */}
      <div className="w-full" id="premium-episode-highlight">
        <div className="flex items-center justify-between pb-4 border-b border-white/5 mb-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-2.5 w-2.5 rounded-full bg-[#FF0000]" />
            <h3 className="text-lg md:text-xl font-extrabold text-white tracking-wide uppercase font-sans">
              विशेष धारावाहिक • Featured Series
            </h3>
          </div>
          <span className="text-xs text-[#D4AF37] font-black font-mono tracking-widest uppercase bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-3 py-1 rounded-full">
            MUST WATCH
          </span>
        </div>

        {/* Cinematic Netflix-style Landscape Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full bg-gradient-to-br from-[#121212] to-[#080808] border border-white/5 rounded-2xl overflow-hidden p-6 md:p-8 flex flex-col lg:flex-row gap-8 items-center shadow-2xl group"
        >
          {/* Decorative glowing gradient circle */}
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
          
          {/* Episode Thumbnail Container */}
          <div className="w-full lg:w-[45%] aspect-video rounded-xl overflow-hidden bg-black border border-white/10 relative flex-shrink-0 shadow-lg group/thumb">
            <img 
              src={featured.thumbnail || `https://img.youtube.com/vi/${featured.youtubeId}/hqdefault.jpg`} 
              alt={featured.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-85 group-hover/thumb:scale-[1.03] transition-transform duration-700"
            />
            {/* Cinematic overlay vignetting */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            
            {/* Bottom metadata tags */}
            <div className="absolute bottom-3 left-3 flex items-center gap-3 text-[10px] font-bold text-white/95">
              <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/5">
                <Eye className="w-3.5 h-3.5 text-red-500" />
                {featured.views} views
              </span>
              <span className="flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/5">
                <Clock className="w-3.5 h-3.5 text-amber-500" />
                {featured.duration}
              </span>
            </div>

            {/* Floating Live Indicator tag */}
            <span className="absolute top-3 left-3 bg-[#FF0000] text-white font-black uppercase text-[8px] tracking-widest px-2.5 py-1 rounded shadow-md animate-pulse">
              TRENDING #1
            </span>

            {/* Central Play Button Overlay */}
            <button 
              onClick={() => setIsPlayingFeatured(true)}
              className="absolute inset-0 m-auto w-14 h-14 bg-red-600 hover:bg-red-500 text-white flex items-center justify-center rounded-full shadow-2xl scale-95 hover:scale-105 transition-all duration-300 cursor-pointer z-10"
            >
              <Play className="w-6 h-6 fill-white text-red-600 ml-1" />
            </button>
          </div>

          {/* Episode Description & Details Container */}
          <div className="w-full space-y-5 flex-grow text-left">
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-[#D4AF37] text-xs font-black uppercase tracking-wider">{seriesName}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                <span className="bg-white/5 text-white/70 text-[10px] px-2.5 py-0.5 rounded-full font-bold font-mono border border-white/5">
                  {episodeNum}
                </span>
              </div>
              <h4 className="text-xl md:text-2xl font-black text-white tracking-tight leading-snug group-hover:text-[#D4AF37] transition-colors">
                {featured.title}
              </h4>
              <p className="text-xs text-white/50 leading-relaxed max-w-xl line-clamp-3">
                {featured.description}
              </p>
            </div>

            {/* Episode Resume Progress Bar */}
            <div className="space-y-2 max-w-md pt-1">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-[#D4AF37] flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Continue Watching
                </span>
                <span className="text-white/40 font-mono">{episodeNum} / Series</span>
              </div>
              
              {/* Gold & Red premium progress slider */}
              <div className="relative w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 h-full w-[12%] bg-gradient-to-r from-[#FF0000] to-[#D4AF37] rounded-full shadow-lg" />
              </div>
            </div>

            {/* Direct Playback Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button 
                onClick={() => setIsPlayingFeatured(true)}
                className="px-6 py-3 bg-[#FF0000] hover:bg-[#e60000] text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg shadow-red-950/20 active:scale-95 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white text-[#FF0000]" />
                <span>Watch Episode</span>
              </button>
              
              <button 
                onClick={() => setIsPlayingFeatured(true)}
                className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider rounded-xl border border-white/5 transition-all duration-300 active:scale-95 cursor-pointer"
              >
                Continue Watching
              </button>
            </div>

          </div>
        </motion.div>
      </div>

      {/* 3. CINEMATIC MODAL PLAYER */}
      <AnimatePresence>
        {isPlayingFeatured && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 180 }}
              className="relative w-full max-w-5xl bg-[#0d0d0d] rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.85)]"
            >
              {/* Header block of Player */}
              <div className="flex items-center justify-between px-6 py-4 bg-black/80 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="text-[#FF0000] font-bold uppercase text-[10px] tracking-widest animate-pulse flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FF0000] inline-block" /> Streaming Now
                  </span>
                  <span className="text-white/30 font-mono text-xs">|</span>
                  <h2 className="text-xs md:text-sm font-bold text-white truncate max-w-[300px] md:max-w-[450px]">
                    {featured.title}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsPlayingFeatured(false)}
                  className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold uppercase transition-all"
                >
                  Close Player ✕
                </button>
              </div>

              {/* YouTube Responsive iFrame */}
              <div className="relative aspect-video w-full bg-black">
                <iframe 
                  src={`https://www.youtube.com/embed/${featured.youtubeId}?autoplay=1&mute=0&rel=0&showinfo=0&controls=1`}
                  title="Apna Sooch Featured Episode Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>

              {/* Footer metadata block */}
              <div className="px-6 py-4 bg-black/80 flex items-center justify-between gap-4 flex-wrap text-xs text-white/60">
                <div className="flex items-center gap-4 flex-wrap">
                  <span>Channel: <strong className="text-white font-extrabold">{channelName}</strong></span>
                  <span>Views: <strong className="text-white">{featured.views}</strong></span>
                  <span>Likes: <strong className="text-[#D4AF37]">{featured.likes || "120K+"}</strong></span>
                </div>
                <span className="text-[10px] font-serif italic text-[#D4AF37]">
                  "मन ही मनुष्य के बंधन और मोक्ष का कारण है।"
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
