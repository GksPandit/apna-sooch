import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Clock, 
  BookOpen, 
  Copy, 
  Share2, 
  Bookmark, 
  BookmarkCheck, 
  Play, 
  Volume2, 
  VolumeX, 
  Check, 
  Compass, 
  Briefcase, 
  Heart, 
  ShieldCheck, 
  Brain, 
  TrendingUp, 
  Zap, 
  MessageSquare,
  HelpCircle,
  Tv
} from "lucide-react";
import { GitaVerse, Video } from "../types";

interface DailyWisdomProps {
  verse: GitaVerse | null;
  loading: boolean;
  videos: Video[];
  onWatchVideo: (youtubeId: string) => void;
}

// Custom curated journal articles mapped to the 5 verses returned from /api/gita/daily
const WISDOM_ARTICLES: Record<string, {
  title: string;
  featuredQuote: string;
  lifeLesson: string;
  realLifeMeaning: string;
  keyTakeaway: string;
  readingTime: string;
  applications: {
    life: string;
    career: string;
    relationships: string;
    discipline: string;
    mentalHealth: string;
    selfGrowth: string;
    decisionMaking: string;
  };
}> = {
  "2_47": {
    title: "The Art of Effortless Action (Nishkama Karma)",
    featuredQuote: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन। मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि॥",
    lifeLesson: "True freedom is the ability to act with absolute focus, completely unburdened by the anxiety of future outcomes.",
    realLifeMeaning: "You own the action, but you do not own the consequence. Anxiety is born the moment you attempt to control what is fundamentally outside your hands.",
    keyTakeaway: "Turn your work into a meditative offering. Focus entirely on the precision of your current step, and surrender the outcome.",
    readingTime: "4 min read",
    applications: {
      life: "Stop living in a future that hasn't happened yet. Align your mind and senses to the immediate physical reality in front of you.",
      career: "Performance anxiety is just greed for the outcome. When you detach from the bonus or promotion, you channel 100% of your intellect into producing masterpieces.",
      relationships: "Stop treating relationships as a transactional ledger. Love and support without expecting constant reciprocal verification.",
      discipline: "True discipline means executing the correct duty even when there is no immediate dopamine hit, applause, or reward in sight.",
      mentalHealth: "Anxiety dissolves when you realize that while you cannot control the winds of fate, you have complete authority over how you steer your sails.",
      selfGrowth: "Shift your identity from a passive consumer to an active contributor. True growth is measured by how much you refine your daily contributions.",
      decisionMaking: "Make choices based on the intrinsic ethical correctness of the action (Dharma), not on speculative convenience or temporary gains."
    }
  },
  "2_62": {
    title: "The Anatomy of Cognitive Overthrow",
    featuredQuote: "ध्यायतो विषयान्पुंसः सङ्गस्तेषूपजायते। सङ्गात्सञ्जायते कामः कामात्क्रोधोऽभिजायते॥",
    lifeLesson: "Uncontrolled contemplation on sensory desires breeds obsession. Obsession triggers frustration, leading to anger, confusion, and total cognitive collapse.",
    realLifeMeaning: "Your mind becomes whatever you feed your attention. Continual exposure to instant-gratification hooks breeds toxic attachment, impatience, and loss of composure.",
    keyTakeaway: "Guard your attention like your life depends on it—because the quality of your consciousness does.",
    readingTime: "5 min read",
    applications: {
      life: "In an era of digital sirens, recognize that ultimate peace does not lie in owning more, but in dominating your attention.",
      career: "Avoid chasing empty status symbols or comparing your path to digital profiles. This contemplation breeds envy, rush, and professional burnout.",
      relationships: "Anger in relations is the byproduct of frustrated expectations and codependent attachments. Shift from ownership to mature appreciation.",
      discipline: "Modern digital algorithms exploit this exact cognitive descent. Counteract by scheduling strict screen-free periods and digital fasts.",
      mentalHealth: "Overthinking is contaminated meditation. When you constantly think about what you lack, you trigger a biological state of stress.",
      selfGrowth: "Implement radical information hygiene. Filter your social circle and news feeds to protect your inner sanctuary.",
      decisionMaking: "Never make a decision when your mind is clouded by frustration or intense desire. Step away, seek silence, and decide in clarity."
    }
  },
  "6_5": {
    title: "The Mind: Your Ultimate Friend or Worst Enemy",
    featuredQuote: "उद्धरेदात्मनात्मानं नात्मानमवसादयेत्। आत्मैव ह्यात्मनो बन्धुरात्मैव रिपुरात्मनः॥",
    lifeLesson: "You are your own savior and your own destroyer. A disciplined mind is your greatest ally; an untrained mind is a hostile agent living within.",
    realLifeMeaning: "No external person can rescue you from your self-sabotaging habits. Complete accountability for your mental state is the first step of self-mastery.",
    keyTakeaway: "Stop waiting for external rescue. Train your mind to serve your intellect rather than obey your impulses.",
    readingTime: "4 min read",
    applications: {
      life: "Shatter the illusion that a perfect circumstance will fix your life. Take absolute responsibility for where you stand today.",
      career: "Your professional capability is bounded by your emotional stability. A mind that panics under criticism or scatters under pressure limits your scale.",
      relationships: "If you cannot self-regulate your emotions, you will project your inner voids onto your partner. Heal your mind to build healthy love.",
      discipline: "Discipline is not self-punishment; it is the ultimate act of self-respect. It is choosing long-term honor over fleeting sensory escapes.",
      mentalHealth: "When destructive self-talk begins, observe it as a symptom of a noisy biological computer, not as an objective definition of your worth.",
      selfGrowth: "Cultivate a taste for solitude. A person who cannot stay peacefully alone with their thoughts is always at the mercy of distractions.",
      decisionMaking: "Train yourself to pause before responding. Decisions made in a split-second emotional surge are almost always deeply flawed."
    }
  },
  "4_7": {
    title: "The Law of Equilibrium and Truth",
    featuredQuote: "यदा यदा हि धर्मस्य ग्लानिर्भवति भारत। अभ्युत्थानमधर्मस्य तदात्मानं सृजाम्यहम्॥",
    lifeLesson: "When chaos and deceit dominate, truth does not perish—it reorganizes, rises, and manifests to re-establish systemic balance.",
    realLifeMeaning: "In periods of deep societal or personal confusion, there is an inherent spiritual intelligence within nature that seeks to restore order and righteousness.",
    keyTakeaway: "Even in the darkest epochs of your life, stay aligned with truth and duty, and you will be carried by the deeper cosmic current.",
    readingTime: "3.5 min read",
    applications: {
      life: "When everything feels chaotic, understand that decay is a natural precursor to renewal. Let the old illusions burn to make way for clarity.",
      career: "Compromising your ethics for short-term profits leaves a hollow foundation. Build your professional empire on unshakeable trust and competence.",
      relationships: "In a world of fast-paced, superficial connections, let your relationships be characterized by uncompromising honesty and depth.",
      discipline: "When your routines crumble, do not sink into self-loathing. Recognize the decay as a natural signal to realign and rebuild.",
      mentalHealth: "Anxiety and mental fatigue are warning lights that your daily habits have deviated from your core values. Re-adjust your behavior.",
      selfGrowth: "Focus on character over personality. Personality is just cosmetic wrapping; character is the unshakeable steel beneath.",
      decisionMaking: "When faced with complex ethical dilemmas, choose the path that preserves your self-respect and integrity over easy exits."
    }
  },
  "3_19": {
    title: "The Freedom of Unattached Excellence",
    featuredQuote: "तस्मादसक्तः सततं कार्यं कर्म समाचर। असक्तो ह्याचरन्कर्म परमाप्नोति पूरुषः॥",
    lifeLesson: "Deliver absolute dedication to your tasks, but remain detached from the egoic need for recognition, control, and ownership.",
    realLifeMeaning: "Profound heights are achieved when we stop letting the ego dictate our efforts. Work done purely as a contribution is fluid, powerful, and flawless.",
    keyTakeaway: "Work for the work itself, not for the mirror. That is the birthplace of pure genius and mental peace.",
    readingTime: "4 min read",
    applications: {
      life: "Transition from asking 'What can I get?' to 'What can I give?'. This single cognitive pivot permanently cures boredom and greed.",
      career: "Treat your profession as an art. Focus deeply on the intricate details and the mastery of your craft rather than public accolades.",
      relationships: "Allow the people you love the freedom to exist without your control. True love supports without holding a lease.",
      discipline: "Dedicate your actions to a purpose greater than yourself. A life lived solely for personal pampering soon decays into weakness.",
      mentalHealth: "Burnout is often not caused by hard work, but by carrying the heavy friction of unresolved expectations and need for validation.",
      selfGrowth: "True maturity is measured by how quiet your ego becomes. Real confidence has no urge to shout or seek applause.",
      decisionMaking: "Filter out personal bias, immediate comfort, or personal prejudice. Ask: 'What serves the highest good in this situation?'"
    }
  }
};

export default function DailyWisdom({ verse, loading, videos, onWatchVideo }: DailyWisdomProps) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  // Journal reflections states
  const [journalInputs, setJournalInputs] = useState({
    learned: "",
    apply: "",
    thinking: ""
  });
  const [isSaved, setIsSaved] = useState(false);

  // Load SpeechSynthesis support
  useEffect(() => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      setSynth(window.speechSynthesis);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Determine current active verse key
  const activeKey = useMemo(() => {
    if (!verse) return "2_47";
    const key = `${verse.chapter}_${verse.verse}`;
    return WISDOM_ARTICLES[key] ? key : "2_47";
  }, [verse]);

  // Current wisdom article (resolved from static curation or generated fallback)
  const article = useMemo(() => {
    const curated = WISDOM_ARTICLES[activeKey];
    if (curated) return curated;

    // High quality dynamic fallback from verse
    const sans = verse?.sanskrit || "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन...";
    const hin = verse?.hindiMeaning || "अपने कर्तव्य कर्मों को सच्चाई और ईमानदारी से करें।";
    const eng = verse?.englishMeaning || "Perform your actions with high integrity and purity of mind.";
    const ctx = verse?.context || "General Wisdom";
    const exp = verse?.aiExplanation || hin;

    return {
      title: ctx || "Living with Absolute Integrity",
      featuredQuote: sans,
      lifeLesson: exp.split(".")[0] + "। " + (exp.split(".")[1] || ""),
      realLifeMeaning: exp || hin,
      keyTakeaway: "Practice radical present-moment focus. Master the impulses of the chattering mind and realign with deep truth.",
      readingTime: "3.5 min read",
      applications: {
        life: `Refuse to let transient, superficial noise dictate your inner state. Anchor your awareness in direct reality.`,
        career: `Dethrone anxiety by focusing exclusively on refining the precision of your current technical task.`,
        relationships: `Express authentic care, respect, and emotional presence without keeping a record of transactions.`,
        discipline: `Establish unyielding rules against cheap dopamine triggers. Reclaim control of your physiological impulses.`,
        mentalHealth: `Recognize that thoughts are transient weather patterns. You are the infinite sky observing them, not the storm.`,
        selfGrowth: `Take absolute personal ownership for your thoughts, language patterns, reactions, and focus.`,
        decisionMaking: `Make your decisions based on timeless principles and long-term honor rather than immediate personal escape.`
      }
    };
  }, [activeKey, verse]);

  // Load and save local journal entries keyed by active verse
  useEffect(() => {
    if (!verse) return;
    setIsSaved(false);
    const key = `apnasooch_journal_${verse.chapter}_${verse.verse}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setJournalInputs(JSON.parse(saved));
    } else {
      setJournalInputs({ learned: "", apply: "", thinking: "" });
    }

    // Check if bookmarked
    const bookmarksStr = localStorage.getItem("apna_sooch_bookmarks");
    if (bookmarksStr) {
      const bArr = JSON.parse(bookmarksStr);
      setBookmarked(bArr.includes(`gita-${verse.chapter}-${verse.verse}`));
    }
  }, [verse]);

  // Handle saving journal entry
  const handleSaveJournal = () => {
    if (!verse) return;
    const key = `apnasooch_journal_${verse.chapter}_${verse.verse}`;
    localStorage.setItem(key, JSON.stringify(journalInputs));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Handle audio listening (Real Speech Synthesis)
  const handleListen = () => {
    if (!synth || !verse) return;

    if (isPlayingAudio) {
      synth.cancel();
      setIsPlayingAudio(false);
      return;
    }

    // Prepare text to read in a clean, professional, paced manner
    const textToRead = `दैनिक विचार। शीर्षक: ${article.title}। जीवन पाठ: ${article.lifeLesson}। निष्कर्ष: ${article.keyTakeaway}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    // Find a premium Hindi or clean voice if possible
    const voices = synth.getVoices();
    const hindiVoice = voices.find(v => v.lang.includes("hi") || v.name.includes("Hindi"));
    if (hindiVoice) {
      utterance.voice = hindiVoice;
    }
    utterance.rate = 0.85; // Calming speed
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setIsPlayingAudio(false);
    };
    utterance.onerror = () => {
      setIsPlayingAudio(false);
    };

    setSpeechUtterance(utterance);
    setIsPlayingAudio(true);
    synth.speak(utterance);
  };

  // Handle copy
  const handleCopy = () => {
    if (!verse) return;
    const text = `🔮 Daily Wisdom - ${article.title}\n\n"${article.featuredQuote}"\n\nLesson: ${article.lifeLesson}\n\nTakeaway: ${article.keyTakeaway}\n\n- @apnasooch`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle share
  const handleShare = () => {
    if (!verse) return;
    if (navigator.share) {
      navigator.share({
        title: `Daily Wisdom: ${article.title}`,
        text: `"${article.featuredQuote}"\n\nLesson: ${article.lifeLesson}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      handleCopy();
    }
  };

  // Handle Bookmark
  const handleBookmarkToggle = () => {
    if (!verse) return;
    const bKey = `gita-${verse.chapter}-${verse.verse}`;
    const bookmarksStr = localStorage.getItem("apna_sooch_bookmarks");
    let bArr = bookmarksStr ? JSON.parse(bookmarksStr) : [];
    
    if (bArr.includes(bKey)) {
      bArr = bArr.filter((k: string) => k !== bKey);
      setBookmarked(false);
    } else {
      bArr.push(bKey);
      setBookmarked(true);
    }
    localStorage.setItem("apna_sooch_bookmarks", JSON.stringify(bArr));
  };

  // Get 3 recommended channel videos
  const recommendedVideos = useMemo(() => {
    if (!videos || videos.length === 0) return [];
    // Filter out potential featured series or pick any 3 relevant ones
    return videos.slice(1, 4);
  }, [videos]);

  // Get featured episode (Life Reality Episode)
  const featuredEpisode = useMemo(() => {
    if (!videos || videos.length === 0) return null;
    const matched = videos.find(v => 
      v.category.toLowerCase().includes("reality") || 
      v.title.toLowerCase().includes("reality") || 
      v.title.toLowerCase().includes("सच्चाई")
    );
    return matched || videos[0];
  }, [videos]);

  if (loading || !verse) {
    return (
      <div className="bg-[#090909] border border-white/5 rounded-3xl p-10 animate-pulse flex flex-col items-center justify-center min-h-[450px] space-y-4">
        <div className="w-10 h-10 rounded-full border-2 border-[#D4AF37]/20 border-t-[#D4AF37] animate-spin" />
        <p className="text-white/40 text-xs font-mono">Opening Wisdom Journal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-14 py-4 max-w-5xl mx-auto" id="daily-wisdom-root">
      
      {/* 1. PAGE HEADER */}
      <div className="text-center space-y-3.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.02] border border-white/5 backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse" />
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#D4AF37]">Premium Life Journal</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white font-sans">
          Daily Wisdom
        </h1>
        <p className="text-white/60 text-xs md:text-sm font-medium">
          One powerful life lesson every day.
        </p>
      </div>

      {/* 2. TODAY'S WISDOM FEATURED CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-zinc-950 to-black p-6 md:p-10 shadow-2xl"
      >
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/5 rounded-full filter blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />

        {/* Card Header Info */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-[#D4AF37] uppercase tracking-widest block">
              Today's Syllabus
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              {article.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 text-[10px] font-mono text-white/45 bg-white/[0.02] px-3 py-1.5 rounded-full border border-white/5">
            <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{article.readingTime}</span>
          </div>
        </div>

        {/* Featured Sanskrit Quote Callout */}
        <div className="py-8 text-center relative max-w-3xl mx-auto space-y-4">
          <div className="text-white/5 text-6xl absolute top-2 left-1/2 -translate-x-1/2 font-serif pointer-events-none select-none">
            ❝
          </div>
          <p className="text-lg sm:text-2xl font-bold text-[#D4AF37] leading-relaxed font-serif tracking-wide whitespace-pre-line relative z-10 pt-4">
            {article.featuredQuote}
          </p>
          <p className="text-white/40 text-[10px] font-mono tracking-wider uppercase">
            — Bhagavad Gita • Chapter {verse.chapter}, Verse {verse.verse}
          </p>
        </div>

        {/* Interactive Quick Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-6 border-t border-white/5">
          <button
            onClick={handleListen}
            className={`px-5 py-2.5 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 clickable ${
              isPlayingAudio 
                ? "bg-red-600 border-transparent text-white animate-pulse" 
                : "bg-white/[0.02] hover:bg-white/5 border-white/10 text-white"
            }`}
          >
            {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isPlayingAudio ? "Stop Listening" : "Listen (AI voice)"}</span>
          </button>

          <button
            onClick={handleCopy}
            className="px-5 py-2.5 bg-white/[0.02] hover:bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 clickable"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? "Copied" : "Copy"}</span>
          </button>

          <button
            onClick={handleShare}
            className="px-5 py-2.5 bg-white/[0.02] hover:bg-white/5 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all duration-300 flex items-center gap-2 clickable"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>

          <button
            onClick={handleBookmarkToggle}
            className={`px-5 py-2.5 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 clickable ${
              bookmarked 
                ? "bg-[#D4AF37]/15 border-[#D4AF37]/30 text-[#D4AF37]" 
                : "bg-white/[0.02] border-white/10 text-white hover:bg-white/5"
            }`}
          >
            {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
          </button>
        </div>

        {/* Beautiful detailed Breakdown Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10 pt-8 border-t border-white/5">
          {/* Life Lesson */}
          <div className="space-y-3 p-5 rounded-2xl bg-white/[0.01] border border-white/5">
            <span className="text-[#D4AF37] font-mono text-[10px] font-bold uppercase tracking-widest block">
              Core Life Lesson
            </span>
            <p className="text-white/95 text-sm sm:text-base leading-relaxed font-bold">
              {article.lifeLesson}
            </p>
          </div>

          {/* Key Takeaway */}
          <div className="space-y-3 p-5 rounded-2xl bg-[#D4AF37]/5 border border-[#D4AF37]/10">
            <span className="text-[#D4AF37] font-mono text-[10px] font-bold uppercase tracking-widest block">
              Key Takeaway
            </span>
            <p className="text-[#D4AF37] text-sm leading-relaxed font-medium">
              {article.keyTakeaway}
            </p>
          </div>
        </div>

        {/* Real-Life Meaning Translation block */}
        <div className="mt-6 p-5 rounded-2xl bg-zinc-900/30 border border-white/5 space-y-3">
          <span className="text-white/30 font-mono text-[10px] font-bold uppercase tracking-widest block">
            Real-Life Meaning
          </span>
          <p className="text-white/80 text-xs sm:text-sm leading-relaxed">
            {article.realLifeMeaning}
          </p>
        </div>

      </motion.div>

      {/* 3. REAL LIFE EXPLANATION (THE LARGEST SECTION) */}
      <div className="space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-[10px] font-mono font-black uppercase tracking-widest text-[#D4AF37]">Practical Syllabus</span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">Real-Life Application</h2>
          <p className="text-white/50 text-xs max-w-md mx-auto">
            Timeless wisdom is worthless unless it is lived. Here is how this coordinates into your daily life channels.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* 1. LIFE */}
          <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Compass className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">Daily Life</h4>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              {article.applications.life}
            </p>
          </div>

          {/* 2. CAREER */}
          <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">Career & Focus</h4>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              {article.applications.career}
            </p>
          </div>

          {/* 3. RELATIONSHIPS */}
          <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                <Heart className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">Relationships</h4>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              {article.applications.relationships}
            </p>
          </div>

          {/* 4. DISCIPLINE */}
          <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">Discipline & Celibacy</h4>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              {article.applications.discipline}
            </p>
          </div>

          {/* 5. MENTAL HEALTH */}
          <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Brain className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">Mental Health</h4>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              {article.applications.mentalHealth}
            </p>
          </div>

          {/* 6. SELF GROWTH */}
          <div className="bg-zinc-950/40 border border-white/5 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white">Self Growth</h4>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              {article.applications.selfGrowth}
            </p>
          </div>

          {/* 7. DECISION MAKING */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-zinc-950/40 border border-white/5 rounded-2xl p-6 space-y-3 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-400">
                <Zap className="w-4 h-4" />
              </div>
              <h4 className="text-sm font-black text-white font-sans">Strategic Decision Making</h4>
            </div>
            <p className="text-white/60 text-xs sm:text-sm leading-relaxed">
              {article.applications.decisionMaking}
            </p>
          </div>

        </div>
      </div>

      {/* 4. OPTIONAL INSPIRATION (Bhagavad Gita Verse in secondary styling) */}
      <div className="bg-zinc-950/20 border border-white/5 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-2 text-white/35 font-mono text-[10px] tracking-widest uppercase">
          <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Scriptural Foundation</span>
        </div>

        <div className="space-y-2 border-l-2 border-[#D4AF37]/25 pl-4">
          <p className="text-[#D4AF37]/90 text-sm italic leading-relaxed font-serif">
            "{verse.sanskrit}"
          </p>
          <div className="space-y-1.5 text-xs text-white/50 pt-2 font-medium">
            <p><strong>Translation:</strong> {verse.hindiMeaning}</p>
            <p className="text-[10px] text-white/40"><strong>Context:</strong> {verse.context}</p>
          </div>
        </div>
      </div>

      {/* 5. TODAY'S REFLECTION INTERACTIVE JOURNAL */}
      <div className="bg-gradient-to-br from-zinc-950 to-zinc-900 border border-white/5 rounded-3xl p-6 md:p-8 max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-4.5 h-4.5" />
            </div>
            <div>
              <span className="text-white/35 text-[9px] font-mono uppercase tracking-widest block">My Conscious Dialogue</span>
              <h3 className="text-base font-black text-white">Today's Reflection</h3>
            </div>
          </div>

          <button
            onClick={handleSaveJournal}
            className="px-4 py-2 bg-emerald-600 hover:bg-white hover:text-black text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all duration-300 clickable"
          >
            {isSaved ? "Saved!" : "Save Entry"}
          </button>
        </div>

        <div className="space-y-4">
          {/* Question 1 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/70 block">
              1. What did you learn today?
            </label>
            <textarea
              value={journalInputs.learned}
              onChange={(e) => {
                setJournalInputs(prev => ({ ...prev, learned: e.target.value }));
                setIsSaved(false);
              }}
              placeholder="Record your thoughts here..."
              className="w-full h-20 bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-white/95 placeholder-white/20 outline-none focus:border-[#D4AF37]/40 transition-colors resize-none"
            />
          </div>

          {/* Question 2 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/70 block">
              2. Where can you apply this in your immediate routine?
            </label>
            <textarea
              value={journalInputs.apply}
              onChange={(e) => {
                setJournalInputs(prev => ({ ...prev, apply: e.target.value }));
                setIsSaved(false);
              }}
              placeholder="Identify specific actions..."
              className="w-full h-20 bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-white/95 placeholder-white/20 outline-none focus:border-[#D4AF37]/40 transition-colors resize-none"
            />
          </div>

          {/* Question 3 */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white/70 block">
              3. How will your thinking change going forward?
            </label>
            <textarea
              value={journalInputs.thinking}
              onChange={(e) => {
                setJournalInputs(prev => ({ ...prev, thinking: e.target.value }));
                setIsSaved(false);
              }}
              placeholder="State your commitment to clarity..."
              className="w-full h-20 bg-black/40 border border-white/10 rounded-xl p-3.5 text-xs sm:text-sm text-white/95 placeholder-white/20 outline-none focus:border-[#D4AF37]/40 transition-colors resize-none"
            />
          </div>
        </div>

        {isSaved && (
          <p className="text-emerald-400 text-[10px] font-mono text-center">
            ✓ Entries stored securely in your local browser journal database.
          </p>
        )}
      </div>

      {/* 6. FEATURED EPISODE (Sync'd with Channel upload) */}
      {featuredEpisode && (
        <div className="space-y-4 max-w-4xl mx-auto">
          <h3 className="text-[10px] font-mono font-black uppercase tracking-widest text-white/40 flex items-center gap-2 justify-center">
            <Tv className="w-4 h-4 text-[#D4AF37]" />
            <span>Featured Episode</span>
          </h3>

          <div className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-zinc-950 via-zinc-900/40 to-black p-5 sm:p-6 shadow-xl flex flex-col md:flex-row gap-5">
            {/* Left Image block */}
            <div className="w-full md:w-56 aspect-video rounded-xl overflow-hidden relative bg-black flex-shrink-0 border border-white/5">
              <img
                src={`https://img.youtube.com/vi/${featuredEpisode.youtubeId}/hqdefault.jpg`}
                alt="Episode thumbnail"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex items-end p-2.5">
                <span className="text-[9px] font-mono bg-[#D4AF37] text-black font-extrabold px-1.5 py-0.5 rounded">
                  EPISODE 01 • LATEST EPISODE
                </span>
              </div>
            </div>

            {/* Right text body */}
            <div className="flex flex-col justify-between flex-grow space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-mono text-[#D4AF37] font-black uppercase tracking-widest block">
                  Life Reality Series
                </span>
                <h4 className="text-sm sm:text-base font-black text-white leading-snug line-clamp-1">
                  {featuredEpisode.title}
                </h4>
                <p className="text-white/50 text-[11px] leading-relaxed line-clamp-2">
                  {featuredEpisode.description}
                </p>
              </div>

              {/* Status and button */}
              <div className="space-y-2.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[9px] font-mono text-white/35">
                    <span className="font-bold text-[#D4AF37]">CONTINUE WATCHING</span>
                    <span>95% Completed</span>
                  </div>
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#D4AF37] to-yellow-500 rounded-full animate-pulse" style={{ width: "95%" }} />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onWatchVideo(featuredEpisode.youtubeId)}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-white text-black font-extrabold text-[10px] uppercase tracking-widest rounded-lg transition-all duration-300 flex items-center gap-1 clickable"
                  >
                    <Play className="w-3 h-3 fill-current" /> Watch Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. RELATED VIDEOS */}
      {recommendedVideos.length > 0 && (
        <div className="space-y-6 max-w-4xl mx-auto pt-4">
          <div className="text-center space-y-1">
            <span className="text-[9px] font-mono font-bold text-white/35 uppercase tracking-widest block">Explore More</span>
            <h3 className="text-lg font-black text-white">Recommended Videos</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommendedVideos.map((vid) => (
              <div
                key={vid.id}
                onClick={() => onWatchVideo(vid.youtubeId)}
                className="group relative overflow-hidden rounded-2xl border border-white/5 bg-zinc-950/40 hover:border-[#D4AF37]/30 transition-all duration-300 flex flex-col justify-between h-56 cursor-pointer shadow-lg"
              >
                {/* Thumbnail image */}
                <div className="w-full h-28 relative overflow-hidden bg-black border-b border-white/5">
                  <img
                    src={`https://img.youtube.com/vi/${vid.youtubeId}/hqdefault.jpg`}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/75 rounded text-[9px] text-white font-mono font-bold">
                    {vid.duration}
                  </div>
                </div>

                {/* Info block */}
                <div className="p-3.5 space-y-1.5 flex-grow flex flex-col justify-between">
                  <h5 className="text-xs font-bold text-white/90 line-clamp-2 leading-snug group-hover:text-[#D4AF37] transition-colors">
                    {vid.title}
                  </h5>

                  <div className="flex items-center justify-between text-[9px] font-mono text-white/40 pt-1">
                    <span>{vid.views} views</span>
                    <span>{vid.date}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
