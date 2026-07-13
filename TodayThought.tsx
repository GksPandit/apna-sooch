import { useState, useEffect } from "react";
import { Sparkles, RefreshCw, Share2, Quote, BookOpen, Heart, Bookmark, Eye, BookmarkCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Quote as QuoteType } from "../types";

interface TodayThoughtProps {
  initialQuote: QuoteType | null;
  loading: boolean;
  onRefreshQuote: (category: string) => void;
  onWatchVideo?: () => void;
}

export default function TodayThought({ initialQuote, loading, onRefreshQuote, onWatchVideo }: TodayThoughtProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(142);
  const [isLiked, setIsLiked] = useState(false);

  const tabs = [
    { id: "general", label: "सामान्य" },
    { id: "gita", label: "गीता दर्शन" },
    { id: "brahmacharya", label: "ब्रह्मचर्य" },
    { id: "reality", label: "जीवन सत्य" }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    onRefreshQuote(activeTab);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  useEffect(() => {
    // Fetch initial quote when tab changes
    onRefreshQuote(activeTab);
  }, [activeTab]);

  const handleShare = () => {
    if (!initialQuote) return;
    if (navigator.share) {
      navigator.share({
        title: "आज का सुविचार - Apna Sooch",
        text: `"${initialQuote.text}"\n\n- ${initialQuote.author}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`"${initialQuote.text}"\n\n- ${initialQuote.author} @apnasooch`);
      alert("सुविचार कॉपी हो गया है!");
    }
  };

  const handleLike = () => {
    if (isLiked) {
      setLikes(prev => prev - 1);
    } else {
      setLikes(prev => prev + 1);
    }
    setIsLiked(!isLiked);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#161616] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
    >
      {/* Background decoration */}
      <div className="absolute top-0 left-0 w-48 h-48 bg-[#FF0000]/5 rounded-full filter blur-[60px] pointer-events-none" />
      <div className="absolute -right-6 -bottom-6 opacity-[0.02] text-white pointer-events-none select-none">
        <Quote className="w-64 h-64 rotate-180" />
      </div>

      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#FF0000]/10 rounded-xl text-[#FF0000]">
            <Quote className="w-5 h-5" />
          </div>
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-[0.25em] block">Daily Thoughts</span>
            <h3 className="text-lg font-bold text-white tracking-wide">आज का सुविचार (Thought of the Day)</h3>
          </div>
        </div>

        {/* Dynamic Refresh / AI trigger */}
        <button
          onClick={handleRefresh}
          disabled={loading || isRefreshing}
          className="self-start sm:self-auto flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 clickable"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          नवीन विचार प्राप्त करें (AI Generate)
        </button>
      </div>

      {/* Tabs navigation */}
      <div className="flex flex-wrap gap-2 mb-6 bg-white/5 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
              activeTab === tab.id
                ? "bg-[#D4AF37] text-black shadow-lg"
                : "text-white/60 hover:text-white hover:bg-white/5"
            } clickable`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Quote Display Container */}
      <div className="min-h-[140px] flex flex-col justify-between py-2 relative">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading-thought"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col space-y-3 py-6"
            >
              <div className="h-4 bg-white/5 rounded-full w-full animate-pulse" />
              <div className="h-4 bg-white/5 rounded-full w-5/6 animate-pulse" />
              <div className="h-4 bg-white/5 rounded-full w-2/3 animate-pulse" />
            </motion.div>
          ) : (
            <motion.div
              key={initialQuote ? initialQuote.text : "empty"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="space-y-4"
            >
              {/* If generated dynamically */}
              {initialQuote?.isAiGenerated && (
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-[10px] text-[#D4AF37] uppercase font-bold tracking-wider">
                  <Sparkles className="w-3 h-3 text-[#FF0000]" />
                  AI विचार (Gemini)
                </div>
              )}

              {/* Text Quote */}
              <p className="text-xl md:text-2xl font-bold text-white leading-relaxed tracking-wide italic font-serif">
                "{initialQuote?.text}"
              </p>

              {/* Author signature */}
              <div className="flex items-center gap-2 pt-2 justify-end">
                <span className="w-6 h-[1px] bg-[#D4AF37]" />
                <span className="text-[#D4AF37] text-sm font-semibold tracking-widest uppercase">
                  {initialQuote?.author || "Apna Sooch"}
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons Footer */}
      <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
        {/* Social engagement */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-110 active:scale-95 ${
              isLiked ? "text-[#FF0000]" : "text-white/40 hover:text-white/80"
            } clickable`}
          >
            <Heart className={`w-4.5 h-4.5 ${isLiked ? "fill-[#FF0000]" : ""}`} />
            <span>{likes}</span>
          </button>

          <button
            onClick={() => setIsBookmarked(!isBookmarked)}
            className={`flex items-center gap-1.5 text-xs font-semibold transition-all hover:scale-110 active:scale-95 ${
              isBookmarked ? "text-[#D4AF37]" : "text-white/40 hover:text-white/80"
            } clickable`}
            title={isBookmarked ? "सुविचार सुरक्षित है" : "सुविचार सुरक्षित करें"}
          >
            {isBookmarked ? <BookmarkCheck className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
            <span>{isBookmarked ? "सुरक्षित" : "सुरक्षित करें"}</span>
          </button>
        </div>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all flex items-center gap-2 text-xs clickable"
          >
            <Share2 className="w-4 h-4" />
            शेयर करें
          </button>

          {onWatchVideo && (
            <button
              onClick={onWatchVideo}
              className="px-4 py-2.5 bg-[#FF0000] hover:bg-[#FF0000]/90 text-white rounded-xl text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] flex items-center gap-1.5 clickable"
            >
              <Eye className="w-4 h-4" />
              पूरा वीडियो देखें
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
