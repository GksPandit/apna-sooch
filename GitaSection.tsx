import { useState } from "react";
import { BookOpen, Copy, Share2, Sparkles, Check, X, Maximize2, Minimize2 } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GitaVerse } from "../types";

interface GitaSectionProps {
  verse: GitaVerse | null;
  loading: boolean;
  onRefresh?: () => void;
}

export default function GitaSection({ verse, loading, onRefresh }: GitaSectionProps) {
  const [copied, setCopied] = useState(false);
  const [readingMode, setReadingMode] = useState(false);
  const [fontSize, setFontSize] = useState<"base" | "lg" | "xl">("lg");

  const handleCopy = () => {
    if (!verse) return;
    const textToCopy = `भगवद्गीता - अध्याय ${verse.chapter}, श्लोक ${verse.verse}\n\n${verse.sanskrit}\n\nहिंदी अर्थ: ${verse.hindiMeaning}\n\nअंग्रेजी अर्थ: ${verse.englishMeaning}\n\n- @apnasooch (Official Website)`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (!verse) return;
    if (navigator.share) {
      navigator.share({
        title: `भगवद्गीता श्लोक ${verse.chapter}.${verse.verse}`,
        text: `${verse.sanskrit}\n\nअर्थ: ${verse.hindiMeaning}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      handleCopy();
      alert("श्लोक कॉपी हो गया है! अब आप इसे कहीं भी साझा कर सकते हैं।");
    }
  };

  if (loading || !verse) {
    return (
      <div className="bg-[#161616] border border-white/10 rounded-2xl p-8 animate-pulse flex flex-col items-center justify-center min-h-[300px]">
        <div className="w-12 h-12 rounded-full border border-[#D4AF37]/40 border-t-[#D4AF37] animate-spin mb-4" />
        <p className="text-white/40 text-sm">दैनिक भगवद्गीता श्लोक लोड हो रहा है...</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        id="gita-daily-card"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative bg-gradient-to-b from-[#161616] to-[#090909] border border-[#D4AF37]/30 rounded-3xl p-6 md:p-8 overflow-hidden shadow-[0_10px_45px_rgba(0,0,0,0.6)]"
      >
        {/* Golden glow effect */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full filter blur-[80px] -z-10 pointer-events-none" />
        
        {/* Card Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#D4AF37]/10 rounded-2xl text-[#D4AF37]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[#D4AF37] text-xs font-semibold tracking-[0.2em] uppercase block">
                Verse of the Day • दैनिक गीता ज्ञान
              </span>
              <h3 className="text-xl font-bold text-white tracking-wide">
                अध्याय {verse.chapter}, श्लोक {verse.verse}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setReadingMode(true)}
              title="पठन मोड (Reading Mode)"
              className="p-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all clickable"
            >
              <Maximize2 className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all flex items-center gap-2 text-sm clickable"
            >
              {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              {copied ? "कॉपी हुआ" : "कॉपी करें"}
            </button>
            <button
              onClick={handleShare}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all flex items-center gap-2 text-sm clickable"
            >
              <Share2 className="w-4 h-4" />
              साझा करें
            </button>
          </div>
        </div>

        {/* Sanskrit Verse - Majestic typography */}
        <div className="text-center my-8 relative">
          {/* Accent decoration */}
          <div className="text-white/10 text-8xl absolute -top-8 left-1/2 -translate-x-1/2 font-serif pointer-events-none select-none">
            🚩
          </div>
          <p className="text-2xl md:text-3xl font-bold text-[#D4AF37] leading-relaxed font-serif whitespace-pre-line tracking-wide drop-shadow-[0_2px_15px_rgba(214,175,55,0.3)]">
            {verse.sanskrit}
          </p>
        </div>

        {/* Translations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-6 border-t border-white/5">
          {/* Hindi translation */}
          <div className="space-y-3">
            <h4 className="text-[#D4AF37]/80 text-xs tracking-[0.1em] font-bold uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF0000]" />
              हिंदी अनुवाद (Hindi Meaning)
            </h4>
            <p className="text-white/90 text-base md:text-lg leading-relaxed font-medium">
              {verse.hindiMeaning}
            </p>
          </div>

          {/* English translation */}
          <div className="space-y-3">
            <h4 className="text-white/40 text-xs tracking-[0.1em] font-bold uppercase flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
              English Translation
            </h4>
            <p className="text-white/70 text-sm leading-relaxed">
              {verse.englishMeaning}
            </p>
          </div>
        </div>

        {/* AI Deeper Explanation Section */}
        {verse.aiExplanation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 p-5 md:p-6 bg-[#090909] border border-white/5 rounded-2xl relative overflow-hidden"
          >
            <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
              <Sparkles className="w-36 h-36 text-[#D4AF37]" />
            </div>
            
            <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-[#D4AF37] tracking-wider uppercase">
              <Sparkles className="w-4 h-4 animate-pulse text-[#FF0000]" />
              {verse.isAiGenerated ? "AI विश्लेषित ज्ञान (Spiritual Insight by Gemini)" : "आध्यात्मिक जीवन संदेश (Spiritual Insight)"}
            </div>

            <p className="text-white/80 text-sm md:text-base leading-relaxed whitespace-pre-line">
              {verse.aiExplanation}
            </p>
          </motion.div>
        )}

        {/* Verse Context Footer Tag */}
        <div className="mt-6 flex flex-wrap gap-2 items-center text-xs text-white/40">
          <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5">
            प्रसंग: {verse.context}
          </span>
          <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[#D4AF37]">
            #सनातन_धर्म
          </span>
          <span className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[#FF0000]">
            #भगवद्गीता
          </span>
        </div>
      </motion.div>

      {/* LUXURY IMMERSIVE READING MODE MODAL */}
      <AnimatePresence>
        {readingMode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] bg-[#090909] overflow-y-auto flex items-center justify-center p-4 md:p-8"
          >
            <div className="absolute inset-0 bg-radial-gradient from-[#161616] via-[#090909] to-[#090909]" />
            
            {/* Background glowing particles/fog */}
            <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-[#D4AF37]/5 rounded-full filter blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-[#FF0000]/5 rounded-full filter blur-[150px] pointer-events-none" />

            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#161616] border border-[#D4AF37]/30 rounded-3xl p-6 md:p-12 shadow-[0_0_80px_rgba(214,175,55,0.1)] overflow-hidden z-10"
            >
              {/* Header inside Reading mode */}
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-xl md:text-2xl font-serif text-[#D4AF37]">ॐ</span>
                  <span className="text-white/60 text-xs md:text-sm tracking-widest uppercase">
                    दैनिक पठन साधना • Daily Gita Reading
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* Font Size controls */}
                  <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-lg">
                    <button
                      onClick={() => setFontSize("base")}
                      className={`px-2.5 py-1 text-xs rounded-md transition-all ${fontSize === "base" ? "bg-[#D4AF37] text-black font-semibold" : "text-white/60 hover:text-white"}`}
                    >
                      A
                    </button>
                    <button
                      onClick={() => setFontSize("lg")}
                      className={`px-2.5 py-1 text-sm rounded-md transition-all ${fontSize === "lg" ? "bg-[#D4AF37] text-black font-semibold" : "text-white/60 hover:text-white"}`}
                    >
                      A+
                    </button>
                    <button
                      onClick={() => setFontSize("xl")}
                      className={`px-2.5 py-1 text-base rounded-md transition-all ${fontSize === "xl" ? "bg-[#D4AF37] text-black font-semibold" : "text-white/60 hover:text-white"}`}
                    >
                      A++
                    </button>
                  </div>

                  <button
                    onClick={() => setReadingMode(false)}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all clickable"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main content area */}
              <div className="space-y-10 max-w-3xl mx-auto my-6 text-center">
                {/* Verse number */}
                <span className="text-[#D4AF37] text-sm tracking-widest uppercase font-semibold">
                  अध्याय {verse.chapter}, श्लोक {verse.verse}
                </span>

                {/* Sanskrit */}
                <p 
                  className={`font-serif text-[#D4AF37] leading-relaxed whitespace-pre-line tracking-wider drop-shadow-[0_2px_20px_rgba(214,175,55,0.4)] ${
                    fontSize === "base" ? "text-xl md:text-2xl" : fontSize === "lg" ? "text-2xl md:text-4xl" : "text-3xl md:text-5xl"
                  }`}
                >
                  {verse.sanskrit}
                </p>

                <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />

                {/* Hindi Meaning */}
                <div className="space-y-3">
                  <span className="text-white/40 text-xs tracking-widest uppercase block">हिंदी अर्थ</span>
                  <p 
                    className={`text-white leading-relaxed font-medium mx-auto ${
                      fontSize === "base" ? "text-base md:text-lg" : fontSize === "lg" ? "text-lg md:text-2xl" : "text-xl md:text-3xl"
                    }`}
                  >
                    {verse.hindiMeaning}
                  </p>
                </div>

                {/* English Meaning */}
                <div className="space-y-2 pt-4">
                  <span className="text-white/30 text-xs tracking-widest uppercase block">English Translation</span>
                  <p 
                    className={`text-white/70 leading-relaxed mx-auto max-w-2xl ${
                      fontSize === "base" ? "text-xs md:text-sm" : fontSize === "lg" ? "text-sm md:text-base" : "text-base md:text-lg"
                    }`}
                  >
                    {verse.englishMeaning}
                  </p>
                </div>

                {/* AI Explanation in Reading Mode */}
                {verse.aiExplanation && (
                  <div className="text-left bg-[#090909]/60 border border-white/5 rounded-2xl p-6 md:p-8 mt-12 space-y-4">
                    <span className="text-[#D4AF37] text-xs font-semibold tracking-wider uppercase block flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#FF0000]" />
                      आध्यात्मिक संदेश व जीवन पाठ (Spiritual Essence)
                    </span>
                    <p 
                      className={`text-white/80 leading-relaxed whitespace-pre-line ${
                        fontSize === "base" ? "text-sm" : fontSize === "lg" ? "text-base" : "text-lg"
                      }`}
                    >
                      {verse.aiExplanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Footer inside modal */}
              <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/5 text-white/30 text-xs font-mono">
                <span>जय श्री कृष्ण ❤️</span>
                <span>धर्मो रक्षति रक्षितः</span>
                <span>@apnasooch</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
