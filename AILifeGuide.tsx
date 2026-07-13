import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Send, 
  Volume2, 
  VolumeX, 
  Copy, 
  Share2, 
  Download, 
  Bookmark, 
  Search, 
  History, 
  Trash2, 
  ArrowRight, 
  Mic, 
  MicOff,
  Check,
  ChevronRight,
  Play,
  FileText
} from "lucide-react";
import { REALITY_EPISODES } from "../data/realityEpisodes";

// Structure of AI Answer
interface GuideAnswer {
  shortAnswer: string;
  deepExplanation: string;
  psychology: string;
  reality: string;
  actionSteps: string[];
  dailyPractice: string;
  commonMistakes: string[];
  quote: string;
  finalLesson: string;
  category: string;
  relatedVideos?: any[];
  relatedShorts?: any[];
  relatedEpisode?: any;
  relatedPlaylist?: any;
}

interface ChatHistoryItem {
  id: string;
  question: string;
  timestamp: string;
  answer: GuideAnswer;
}

export default function AILifeGuide({ onWatchVideo }: { onWatchVideo: (youtubeId: string) => void }) {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState<GuideAnswer | null>(null);
  const [history, setHistory] = useState<ChatHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarkedAnswers, setBookmarkedAnswers] = useState<Record<string, boolean>>({});
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  
  // Audio Speech Synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Default preset wisdom questions
  const presetQuestions = [
    { text: "मैं हमेशा दुखी क्यों रहता हूँ?", eng: "Why am i always unhappy?" },
    { text: "ओवरथिंकिंग कैसे रोकें?", eng: "How to stop overthinking?" },
    { text: "लोग साथ क्यों छोड़ देते हैं?", eng: "Why do people leave?" },
    { text: "अनुशासित कैसे बनें?", eng: "How to become disciplined?" },
    { text: "मैं खुद की तुलना दूसरों से क्यों करता हूँ?", eng: "Why do i compare myself?" },
    { text: "मुझे असफलता से डर क्यों लगता है?", eng: "Why am i afraid of failure?" },
    { text: "क्रोध पर नियंत्रण कैसे पाएं?", eng: "How to control anger?" },
    { text: "वासना पर नियंत्रण कैसे पाएं?", eng: "How to control lust?" }
  ];

  // Load history & bookmarks on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("apna_sooch_ai_history");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }

    const savedBookmarks = localStorage.getItem("apna_sooch_ai_bookmarks");
    if (savedBookmarks) {
      try {
        setBookmarkedAnswers(JSON.parse(savedBookmarks));
      } catch (e) {
        console.error(e);
      }
    }

    // Setup speech recognition if available
    const SpeechRecObj = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecObj) {
      const rec = new SpeechRecObj();
      rec.continuous = false;
      rec.lang = "hi-IN";
      rec.interimResults = false;

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setQuestion(transcript);
        }
      };

      rec.onerror = (e: any) => {
        console.error("Speech recognition error", e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      setRecognition(rec);
    }
  }, []);

  // Save history to localStorage
  const saveHistory = (newHistory: ChatHistoryItem[]) => {
    setHistory(newHistory);
    localStorage.setItem("apna_sooch_ai_history", JSON.stringify(newHistory));
  };

  // Toggle bookmark
  const toggleBookmark = (q: string) => {
    const updated = { ...bookmarkedAnswers, [q]: !bookmarkedAnswers[q] };
    setBookmarkedAnswers(updated);
    localStorage.setItem("apna_sooch_ai_bookmarks", JSON.stringify(updated));
  };

  // Trigger TTS voice
  const handleVoiceSpeak = (textToSpeak: string) => {
    if ("speechSynthesis" in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        return;
      }

      // Clean HTML or emojis for smoother TTS reading
      const cleanText = textToSpeak
        .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "")
        .trim();

      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = "hi-IN"; // Hindi Voice
      utterance.rate = 0.85; // Calmer and slower pace
      utterance.pitch = 1.0;

      // Select Hindi voice if available
      const voices = window.speechSynthesis.getVoices();
      const hiVoice = voices.find(v => v.lang.includes("hi-IN") || v.name.toLowerCase().includes("hindi") || v.lang.includes("hi_IN"));
      if (hiVoice) {
        utterance.voice = hiVoice;
      }

      utterance.onend = () => {
        setIsSpeaking(false);
      };

      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      speechUtteranceRef.current = utterance;
      setIsSpeaking(true);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("आपके ब्राउज़र में स्पीच सिंथेसिस सपोर्ट नहीं है।");
    }
  };

  // Clean speaking on unmount
  useEffect(() => {
    return () => {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Trigger Speech Recognition
  const toggleListening = () => {
    if (!recognition) {
      alert("आपके ब्राउज़र में वॉयस इनपुट सपोर्ट नहीं है। कृपया गूगल क्रोम का उपयोग करें।");
      return;
    }

    if (isListening) {
      recognition.stop();
    } else {
      // Cancel speech if active
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      }
      recognition.start();
    }
  };

  // Search or click preset questions
  const handleQuery = async (queryText: string) => {
    if (!queryText.trim()) return;
    
    setLoading(true);
    setCurrentAnswer(null);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      const response = await fetch("/api/ai-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: queryText })
      });

      if (!response.ok) {
        throw new Error("Server error, could not fetch wisdom.");
      }

      const data: GuideAnswer = await response.json();
      setCurrentAnswer(data);

      // Add to history
      const newItem: ChatHistoryItem = {
        id: Date.now().toString(),
        question: queryText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        answer: data
      };

      // Limit to 20 history items
      const updatedHistory = [newItem, ...history.filter(h => h.question.toLowerCase() !== queryText.toLowerCase())].slice(0, 20);
      saveHistory(updatedHistory);

      // Scroll to answer
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);

    } catch (e) {
      console.error(e);
      alert("सनातन गाइड से कनेक्ट करने में त्रुटि हुई। कृपया पुन: प्रयास करें।");
    } finally {
      setLoading(false);
    }
  };

  // Submit search bar question
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuery(question);
  };

  // Select previous question from history
  const selectHistoryItem = (item: ChatHistoryItem) => {
    setCurrentAnswer(item.answer);
    setQuestion(item.question);
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  // Delete single history item
  const deleteHistoryItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = history.filter(h => h.id !== id);
    saveHistory(updated);
  };

  // Clear all history
  const clearAllHistory = () => {
    if (confirm("क्या आप अपना सारा प्रश्न इतिहास मिटाना चाहते हैं?")) {
      saveHistory([]);
    }
  };

  // Copy whole answer to clipboard
  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  // Share response using browser share API
  const shareResponse = (q: string, ans: GuideAnswer) => {
    const text = `अपना सोच AI मार्गदर्शन:\n\nप्रश्न: ${q}\n\nमुख्य उत्तर: ${ans.shortAnswer}\n\nअंतिम सीख: ${ans.finalLesson}\n\nअधिक जानकारी के लिए Apna Sooch पर आएं।`;
    if (navigator.share) {
      navigator.share({
        title: "Apna Sooch AI Guide Guidance",
        text: text,
        url: window.location.href
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(text);
      alert("शेयर लिंक और विवरण क्लिपबोर्ड पर कॉपी हो गया है!");
    }
  };

  // Download complete answer as beautifully formatted txt document
  const downloadTXT = (q: string, ans: GuideAnswer) => {
    const text = `==================================================
APNA SOOCH AI LIFE GUIDE - WISDOM DOCUMENT
==================================================
प्रश्न (Question):
${q}

--------------------------------------------------
1. मुख्य उत्तर (Short Answer):
${ans.shortAnswer}

--------------------------------------------------
2. गहरी व्याख्या (Deep Explanation):
${ans.deepExplanation}

--------------------------------------------------
3. मन का विज्ञान (Psychology):
${ans.psychology}

--------------------------------------------------
4. जीवन की कड़वी सच्चाई (Reality):
${ans.reality}

--------------------------------------------------
5. व्यावहारिक कदम (Action Steps):
${ans.actionSteps.map((step, idx) => `${idx + 1}. ${step}`).join("\n")}

--------------------------------------------------
6. दैनिक अभ्यास (Daily Practice):
${ans.dailyPractice}

--------------------------------------------------
7. सामान्य गलतियाँ (Common Mistakes):
${ans.commonMistakes.map((m, idx) => `${idx + 1}. ${m}`).join("\n")}

--------------------------------------------------
8. सुविचार (Quote):
"${ans.quote}" — Apna Sooch

--------------------------------------------------
9. अंतिम सीख (Final Lesson):
${ans.finalLesson}

==================================================
Tuned with Sanatan Philosophy, Psychology and Truth.
https://apnasooch.in
==================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ApnaSooch_AI_Wisdom_${q.replace(/\s+/g, "_").slice(0, 20)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Filter history based on search bar
  const filteredHistory = history.filter(h => 
    h.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.answer.shortAnswer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div id="ai-guide-container" className="grid grid-cols-1 lg:grid-cols-4 gap-8 min-h-[80vh] relative">
      
      {/* LEFT COLUMN: HISTORY & PRESETS */}
      <div id="ai-sidebar" className="lg:col-span-1 bg-black/40 border border-white/5 rounded-3xl p-5 space-y-6 flex flex-col justify-between max-h-[85vh] overflow-y-auto backdrop-blur-xl">
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h5 className="text-sm font-extrabold text-[#D4AF37] uppercase tracking-wider flex items-center gap-2">
              <History size={16} /> प्रश्न इतिहास • History
            </h5>
            {history.length > 0 && (
              <button 
                onClick={clearAllHistory}
                className="text-[11px] text-white/40 hover:text-red-400 flex items-center gap-1 transition-colors"
                title="इतिहास साफ करें"
              >
                <Trash2 size={12} /> साफ करें
              </button>
            )}
          </div>

          {/* Search History */}
          {history.length > 0 && (
            <div className="relative">
              <input
                type="text"
                placeholder="पिछला प्रश्न खोजें..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111]/80 text-xs text-white placeholder-white/20 pl-8 pr-3 py-2 rounded-xl border border-white/5 focus:border-[#D4AF37]/50 focus:outline-none transition-all"
              />
              <Search size={12} className="absolute left-2.5 top-3 text-white/20" />
            </div>
          )}

          {/* History List */}
          <div className="space-y-2 overflow-y-auto max-h-[40vh] pr-1 custom-scrollbar">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((h) => (
                <div
                  key={h.id}
                  onClick={() => selectHistoryItem(h)}
                  className={`group w-full text-left p-3 rounded-xl border transition-all duration-300 cursor-pointer flex items-center justify-between gap-2 text-xs ${
                    question === h.question 
                      ? "bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]" 
                      : "bg-[#111111]/40 border-white/5 hover:border-white/10 hover:bg-[#111111]/80 text-white/70 hover:text-white"
                  }`}
                >
                  <div className="flex flex-col truncate space-y-0.5">
                    <span className="font-bold truncate leading-tight">{h.question}</span>
                    <span className="text-[9px] text-white/30">{h.timestamp}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => deleteHistoryItem(e, h.id)}
                      className="p-1 text-white/40 hover:text-red-400 rounded transition-colors"
                      title="हटाएं"
                    >
                      <Trash2 size={12} />
                    </button>
                    <ChevronRight size={12} className="text-white/40" />
                  </div>
                </div>
              ))
            ) : history.length > 0 ? (
              <p className="text-[11px] text-white/30 text-center py-4">कोई परिणाम नहीं मिला।</p>
            ) : (
              <p className="text-[11px] text-white/30 text-center py-8">
                कोई पुराना प्रश्न नहीं है। नीचे दिए गए प्रश्नों से शुरुआत करें।
              </p>
            )
          }
          </div>
        </div>

        {/* Preset suggestions in sidebar footer if screen is large */}
        <div className="pt-4 border-t border-white/5 hidden lg:block space-y-2">
          <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">अक्सर पूछे जाने वाले सवाल</p>
          <div className="grid grid-cols-1 gap-1.5 max-h-[220px] overflow-y-auto pr-1">
            {presetQuestions.slice(0, 4).map((pq, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuestion(pq.text);
                  handleQuery(pq.text);
                }}
                className="w-full text-left text-[11px] bg-[#111111]/40 hover:bg-[#D4AF37]/5 border border-white/5 hover:border-[#D4AF37]/20 p-2 rounded-lg text-white/60 hover:text-[#D4AF37] transition-all truncate"
              >
                {pq.text}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: CORE CHAT INTERFACE AND ANSWERS */}
      <div id="ai-main-chat" className="lg:col-span-3 space-y-8 flex flex-col justify-between">
        
        {/* Header Intro */}
        <div className="space-y-3 text-center max-w-2xl mx-auto pb-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-bold px-4 py-1.5 rounded-full border border-[#D4AF37]/20 shadow-md uppercase tracking-widest mx-auto"
          >
            <Sparkles size={14} className="animate-pulse" /> Apna Sooch AI • परम सत्य गाइड
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Ask Anything <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#FFF] to-[#D4AF37]">About Life</span>
          </h2>
          <p className="text-white/50 text-xs md:text-sm max-w-md mx-auto">
            जीवन की उलझनों, मन के रहस्यों, अनुशासन, ब्रह्मचर्य और मनोविज्ञान का यथार्थवादी एवं सनातन समाधान पाएं।
          </p>
        </div>

        {/* Input box form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="bg-[#111111]/90 border border-white/10 rounded-3xl p-4 md:p-5 shadow-2xl relative overflow-hidden backdrop-blur-md max-w-3xl mx-auto w-full"
        >
          {/* Subtle gold decoration bar */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#D4AF37]/40 to-transparent" />
          
          <div className="flex items-center gap-3 bg-[#000]/60 border border-white/5 focus-within:border-[#D4AF37]/40 p-1 px-3 rounded-2xl transition-all">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="जीवन का कोई भी गहरा प्रश्न पूछें (उदा: ओवरथिंकिंग कैसे रोकें?)..."
              disabled={loading}
              className="flex-grow bg-transparent text-white placeholder-white/20 text-sm py-3.5 px-2 focus:outline-none disabled:opacity-50"
            />

            {/* Voice Mic Button */}
            <button
              type="button"
              onClick={toggleListening}
              className={`p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center ${
                isListening 
                  ? "bg-red-500 text-white animate-pulse" 
                  : "bg-white/5 text-white/60 hover:text-white hover:bg-white/10"
              }`}
              title={isListening ? "सुन रहा हूँ... रोकने के लिए क्लिक करें" : "आवाज द्वारा पूछें (Hindi)"}
            >
              {isListening ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-[#D4AF37] hover:bg-[#F3E5AB] disabled:bg-white/5 text-black disabled:text-white/20 p-3 rounded-xl font-bold transition-all flex items-center justify-center shadow-lg"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <Send size={16} />
              )}
            </button>
          </div>

          {/* Quick presets tags row */}
          <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 no-scrollbar text-[11px] text-white/40">
            <span className="whitespace-nowrap font-bold text-[#D4AF37]/60">त्वरित प्रश्न:</span>
            {presetQuestions.map((pq, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuestion(pq.text);
                  handleQuery(pq.text);
                }}
                className="whitespace-nowrap bg-white/5 hover:bg-[#D4AF37]/10 hover:text-white hover:border-[#D4AF37]/20 border border-white/5 px-3 py-1 rounded-full transition-all"
              >
                {pq.text}
              </button>
            ))}
          </div>
        </motion.form>

        {/* Loading container */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-12 space-y-4 bg-black/30 border border-white/5 rounded-3xl p-8 max-w-3xl mx-auto w-full backdrop-blur-md"
            >
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-[#D4AF37]/10 border-t-[#D4AF37] animate-spin" />
                <Sparkles className="absolute inset-0 m-auto text-[#D4AF37] animate-bounce" size={20} />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-white tracking-wide">AI सत्य की खोज कर रहा है...</h4>
                <p className="text-[11px] text-white/40 max-w-xs">
                  "मनुष्य अपने विचारों से बनता है, जैसा वह सोचता है वैसा ही बन जाता है।" • श्रीमद्भगवद्गीता
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Answer card container */}
        <AnimatePresence>
          {currentAnswer && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-[#111111]/80 border border-white/5 rounded-3xl p-6 md:p-8 space-y-8 shadow-2xl relative overflow-hidden max-w-3xl mx-auto w-full backdrop-blur-xl"
            >
              {/* Top Accent Gradient overlay */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-[#D4AF37]/5 to-transparent pointer-events-none" />

              {/* Utility Tools bar: bookmark, tts, copy, download, share */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 relative z-10">
                <span className="text-[10px] bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/20 font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                  Category: {currentAnswer.category}
                </span>

                <div className="flex items-center gap-2">
                  {/* TTS Speaker button */}
                  <button
                    onClick={() => handleVoiceSpeak(`${currentAnswer.shortAnswer}. अंतिम सीख: ${currentAnswer.finalLesson}`)}
                    className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                      isSpeaking
                        ? "bg-[#D4AF37] border-[#D4AF37] text-black shadow-lg"
                        : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    title={isSpeaking ? "आवाज बंद करें" : "उत्तर सुनें (Hindi)"}
                  >
                    {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                  </button>

                  {/* Bookmark button */}
                  <button
                    onClick={() => toggleBookmark(question)}
                    className={`p-2 rounded-xl border transition-all duration-300 flex items-center justify-center ${
                      bookmarkedAnswers[question]
                        ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                        : "bg-white/5 border-white/5 text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    title="बुकमार्क करें"
                  >
                    <Bookmark size={15} fill={bookmarkedAnswers[question] ? "currentColor" : "none"} />
                  </button>

                  {/* Copy Answer button */}
                  <button
                    onClick={() => copyToClipboard(currentAnswer.shortAnswer, "main")}
                    className="p-2 bg-white/5 border border-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                    title="उत्तर कॉपी करें"
                  >
                    {copiedSection === "main" ? <Check size={15} className="text-green-400" /> : <Copy size={15} />}
                  </button>

                  {/* Download PDF/TXT button */}
                  <button
                    onClick={() => downloadTXT(question, currentAnswer)}
                    className="p-2 bg-white/5 border border-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                    title="TXT डाउनलोड करें"
                  >
                    <Download size={15} />
                  </button>

                  {/* Share button */}
                  <button
                    onClick={() => shareResponse(question, currentAnswer)}
                    className="p-2 bg-white/5 border border-white/5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all flex items-center justify-center"
                    title="शेयर करें"
                  >
                    <Share2 size={15} />
                  </button>
                </div>
              </div>

              {/* 1. SHORT ANSWER (MUKHYA UTTAR) */}
              <div className="space-y-3 relative z-10">
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full" /> मुख्य उत्तर • Short Answer
                </h4>
                <p className="text-base font-bold text-white leading-relaxed border-l-2 border-[#D4AF37] pl-3 py-1 bg-white/[0.01]">
                  {currentAnswer.shortAnswer}
                </p>
              </div>

              {/* 2. DEEP EXPLANATION (GAHRI VYAKHYA WITH EXAMPLE) */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white/20 rounded-full" /> गहरी व्याख्या • Deep Insight
                </h4>
                <p className="text-sm text-white/80 leading-relaxed text-justify">
                  {currentAnswer.deepExplanation}
                </p>
              </div>

              {/* TWO COLUMN DETAILS: PSYCHOLOGY AND REALITY */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* 3. PSYCHOLOGY (MANOVIGYAN) */}
                <div className="bg-black/40 border border-white/5 rounded-2xl p-5 space-y-2.5 hover:border-white/10 transition-colors">
                  <h5 className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest flex items-center gap-1.5">
                    🧠 मन का विज्ञान • Psychology
                  </h5>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {currentAnswer.psychology}
                  </p>
                </div>

                {/* 4. REALITY (KARVI SATYATA) */}
                <div className="bg-black/40 border border-[#D4AF37]/10 rounded-2xl p-5 space-y-2.5 hover:border-[#D4AF37]/20 transition-colors">
                  <h5 className="text-[11px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                    ⚡ जीवन का कड़वा सच • Reality Check
                  </h5>
                  <p className="text-xs text-white/70 leading-relaxed">
                    {currentAnswer.reality}
                  </p>
                </div>
              </div>

              {/* 5. ACTION STEPS (KARYAVAHI KADAM) */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-white/40 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white/20 rounded-full" /> तुरंत उठाने वाले कदम • Action Steps
                </h4>
                <div className="grid grid-cols-1 gap-3">
                  {currentAnswer.actionSteps.map((step, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-[#1c1c1c]/50 border border-white/5 rounded-xl p-3.5 flex items-start gap-3 hover:bg-black/40 hover:border-[#D4AF37]/20 transition-all"
                    >
                      <span className="flex-shrink-0 w-6 h-6 bg-[#D4AF37]/10 text-[#D4AF37] text-xs font-mono font-bold rounded-full flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-white/80 leading-relaxed pt-0.5">{step}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* TWO COLUMN BOTTOM: DAILY PRACTICE AND COMMON MISTAKES */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 6. DAILY PRACTICE (DAINIK ABHYAS) */}
                <div className="border border-[#D4AF37]/20 bg-[#D4AF37]/5 rounded-2xl p-5 space-y-2.5 relative">
                  <div className="absolute top-2 right-2 text-xs text-[#D4AF37] font-bold uppercase tracking-wider scale-90 px-2 py-0.5 bg-[#D4AF37]/10 rounded border border-[#D4AF37]/20">Recommended</div>
                  <h5 className="text-[11px] font-bold text-[#D4AF37] uppercase tracking-widest">
                    🧘 दैनिक अभ्यास • Daily Sadhana
                  </h5>
                  <p className="text-xs text-white/80 leading-relaxed">
                    {currentAnswer.dailyPractice}
                  </p>
                </div>

                {/* 7. COMMON MISTAKES (SAMANYA GALTIYAN) */}
                <div className="border border-red-500/10 bg-red-500/[0.02] rounded-2xl p-5 space-y-2.5">
                  <h5 className="text-[11px] font-bold text-red-400 uppercase tracking-widest">
                    ⚠️ सामान्य गलतियाँ • Avoid These
                  </h5>
                  <ul className="text-xs text-white/70 space-y-1.5 pl-4 list-disc">
                    {currentAnswer.commonMistakes.map((mistake, idx) => (
                      <li key={idx} className="leading-relaxed">{mistake}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 8. QUOTE CARD (SUVICHAR) */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#1c1a12] to-[#121212] border border-[#D4AF37]/15 rounded-2xl p-6 text-center shadow-lg">
                <div className="absolute top-2 left-4 text-5xl text-[#D4AF37]/10 font-serif font-extrabold select-none pointer-events-none">“</div>
                <p className="text-sm font-medium text-[#D4AF37] leading-relaxed relative z-10 italic max-w-xl mx-auto">
                  "{currentAnswer.quote}"
                </p>
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-wider mt-2">— Apna Sooch AI</p>
              </div>

              {/* 9. FINAL LESSON (ANTIM SEEKH) */}
              <div className="border-t border-white/5 pt-6 text-center space-y-2">
                <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">अंतिम सीख • Ultimate Truth</span>
                <p className="text-base font-extrabold text-white tracking-wide leading-relaxed bg-[#D4AF37]/5 border border-[#D4AF37]/10 px-5 py-3 rounded-2xl max-w-xl mx-auto">
                  {currentAnswer.finalLesson}
                </p>
              </div>

              {/* 10. RELATED CONTENT (EPISODES, VIDEOS, SHORTS) */}
              <div className="border-t border-white/5 pt-8 space-y-6">
                <h4 className="text-xs font-bold text-[#D4AF37] uppercase tracking-widest text-center">
                  🎬 अनुशंसित सामग्री • Recommeded for You
                </h4>

                {/* Related Episode Card (Netflix style) */}
                {currentAnswer.relatedEpisode && (
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">संबंधित रियलिटी एपिसोड • Related Episode</p>
                    <div className="bg-black/60 rounded-2xl border border-white/5 overflow-hidden flex flex-col md:flex-row hover:border-white/10 transition-all group">
                      <div className="relative aspect-video md:w-56 bg-black flex-shrink-0 overflow-hidden">
                        <img 
                          src={currentAnswer.relatedEpisode.thumbnailImage || "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=600"} 
                          alt={currentAnswer.relatedEpisode.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-500" 
                        />
                        <span className="absolute bottom-2 right-2 bg-black/80 text-[10px] px-1.5 py-0.5 rounded text-[#D4AF37] font-bold">
                          {currentAnswer.relatedEpisode.episodeNumber}
                        </span>
                      </div>
                      <div className="p-4 flex-grow flex flex-col justify-between space-y-2">
                        <div className="space-y-1">
                          <h5 className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                            {currentAnswer.relatedEpisode.title}
                          </h5>
                          <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed">
                            {currentAnswer.relatedEpisode.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-white/30 pt-2 border-t border-white/5">
                          <span>⏱ {currentAnswer.relatedEpisode.readingTime || currentAnswer.relatedEpisode.duration}</span>
                          <button
                            onClick={() => onWatchVideo(currentAnswer.relatedEpisode.videoId)}
                            className="text-[#D4AF37] hover:underline font-bold flex items-center gap-1"
                          >
                            ▶ देखना शुरू करें
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Related Videos & Shorts Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                  
                  {/* Videos */}
                  {currentAnswer.relatedVideos && currentAnswer.relatedVideos.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">संबंधित वीडियो • Related Videos</p>
                      <div className="space-y-3">
                        {currentAnswer.relatedVideos.map((video: any) => (
                          <div 
                            key={video.id}
                            className="bg-black/40 rounded-xl border border-white/5 p-2 flex gap-3 items-center hover:border-white/10 transition-all"
                          >
                            <div className="relative aspect-video w-20 bg-black rounded-lg overflow-hidden flex-shrink-0">
                              <img 
                                src={`https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`} 
                                alt={video.title} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="truncate flex-grow space-y-1">
                              <h6 className="text-[11px] font-bold text-white truncate hover:text-[#D4AF37] cursor-pointer" onClick={() => onWatchVideo(video.youtubeId)}>
                                {video.title}
                              </h6>
                              <div className="flex justify-between items-center text-[9px] text-white/30">
                                <span>{video.views}</span>
                                <button onClick={() => onWatchVideo(video.youtubeId)} className="text-[#D4AF37] font-bold">Watch</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Shorts */}
                  {currentAnswer.relatedShorts && currentAnswer.relatedShorts.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider">संबंधित शॉर्ट्स • Related Shorts</p>
                      <div className="grid grid-cols-2 gap-3">
                        {currentAnswer.relatedShorts.map((short: any) => (
                          <div 
                            key={short.id}
                            className="bg-black/40 rounded-xl border border-white/5 overflow-hidden hover:border-white/10 transition-all flex flex-col justify-between group"
                          >
                            <div className="relative aspect-[9/16] bg-black overflow-hidden">
                              <img 
                                src={`https://img.youtube.com/vi/${short.youtubeId}/mqdefault.jpg`} 
                                alt={short.title} 
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                              <span className="absolute top-2 left-2 bg-[#FF0000]/80 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Short</span>
                            </div>
                            <div className="p-2 space-y-1.5 flex flex-col justify-between flex-grow">
                              <h6 className="text-[10px] font-bold text-white line-clamp-2 leading-tight">
                                {short.title}
                              </h6>
                              <button 
                                onClick={() => onWatchVideo(short.youtubeId)}
                                className="w-full bg-[#D4AF37]/10 hover:bg-[#D4AF37] hover:text-black text-[#D4AF37] font-bold py-1 rounded text-[9px] transition-all"
                              >
                                ▶ देखें ({short.views})
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Bottom anchor for scrolling */}
              <div ref={bottomRef} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
