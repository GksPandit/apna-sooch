import React, { useState } from "react";
import { BookOpen, Headphones, Library, GraduationCap, Heart, Users, Globe, Smile, Calendar, Sparkles, Check, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ModuleItem {
  id: string;
  title: string;
  hindiTitle: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
}

export default function FutureReady() {
  const [email, setEmail] = useState("");
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const modules: ModuleItem[] = [
    {
      id: "podcasts",
      title: "Audio Podcast",
      hindiTitle: "अपना सोच पॉडकास्ट",
      description: "संसार की अनकही कहानियाँ, ब्रह्मचर्य के अनुभव और आध्यात्मिक गुरुओं के साथ साक्षात्कार जो आपकी चेतना को जगाएंगे।",
      icon: <Headphones className="w-6 h-6" />,
      badge: "COMING SOON"
    },
    {
      id: "courses",
      title: "Spiritual Courses",
      hindiTitle: "सनातन जीवन शैली कोर्स",
      description: "ब्रह्मचर्य साधना, ध्यान, मानसिक नियंत्रण, और गीता के अध्यायों पर प्रामाणिक, चरण-दर-चरण वैज्ञानिक पाठ।",
      icon: <GraduationCap className="w-6 h-6" />,
      badge: "UNDER DEVELOPMENT"
    },
    {
      id: "books",
      title: "Wisdom E-Books",
      hindiTitle: "ज्ञान ग्रंथ और पुस्तकें",
      description: "हमारे प्राचीन ग्रंथों का आधुनिक जीवन के संदर्भ में सरल सारांश। मुद्रित और डिजिटल संस्करण उपलब्ध होंगे।",
      icon: <Library className="w-6 h-6" />,
      badge: "PLANNED"
    },
    {
      id: "meditation",
      title: "Guided Meditation",
      hindiTitle: "सच्ची ध्यान साधना",
      description: "मन को गहरे स्तर पर शांत करने, मानसिक तनाव को दूर करने और आत्म-निरीक्षण के लिए गाइडेड ऑडियो साधना सत्र।",
      icon: <Smile className="w-6 h-6" />,
      badge: "COMING SOON"
    },
    {
      id: "ngo",
      title: "Seva NGO & NGO",
      hindiTitle: "अपना सोच सेवा संगठन",
      description: "राष्ट्र निर्माण, पर्यावरण संरक्षण और निर्धन जनों की सेवा के लिए एक सक्रिय सामूहिक सेवा केंद्र।",
      icon: <Heart className="w-6 h-6" />,
      badge: "FOUNDATION"
    },
    {
      id: "events",
      title: "Satsang & Events",
      hindiTitle: "लाइव सत्संग एवं सम्मेलन",
      description: "भारत भर में अपना सोच परिवार के सदस्यों का मिलन समारोह, आध्यात्मिक चर्चाएं और लाइव प्रश्नोत्तरी सत्र।",
      icon: <Calendar className="w-6 h-6" />,
      badge: "PLANNED"
    }
  ];

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("कृपया अपना ईमेल दर्ज करें।");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("कृपया एक वैध ईमेल दर्ज करें।");
      return;
    }

    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
      setSelectedModule(null);
    }, 4000);
  };

  return (
    <div className="space-y-12">
      {/* Intro section */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/20 text-xs text-[#D4AF37] font-semibold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-[#FF0000]" />
          Future Roadmap • भविष्य की योजनाएं
        </div>
        <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide">
          अपना सोच डिजिटल साम्राज्य का विस्तार 🚩
        </h3>
        <p className="text-white/60 text-sm md:text-base leading-relaxed">
          हम भारत के सबसे बड़े आध्यात्मिक और चरित्र-निर्माण समुदाय की नींव रख रहे हैं। जल्द ही हम आपके लिए निम्नलिखित विशेष मॉड्यूल लॉन्च कर रहे हैं।
        </p>
      </div>

      {/* Grid Layout (Luxury Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((mod) => (
          <motion.div
            key={mod.id}
            onClick={() => setSelectedModule(mod)}
            whileHover={{ y: -5 }}
            className="cursor-pointer bg-[#111111] border border-white/5 hover:border-[#D4AF37]/30 rounded-2xl p-6 transition-all duration-300 relative overflow-hidden flex flex-col justify-between group shadow-lg"
          >
            {/* Corner glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#D4AF37]/5 rounded-full filter blur-[20px] group-hover:bg-[#FF0000]/10 transition-colors pointer-events-none" />

            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/5 rounded-xl text-[#D4AF37] group-hover:text-white group-hover:bg-[#D4AF37] transition-all duration-300">
                  {mod.icon}
                </div>
                <span className="text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-md bg-white/5 text-white/50 border border-white/5 uppercase">
                  {mod.badge}
                </span>
              </div>

              <h4 className="text-lg font-bold text-white mb-1 group-hover:text-[#D4AF37] transition-colors">
                {mod.hindiTitle}
              </h4>
              <span className="text-white/40 text-xs font-mono block mb-3">{mod.title}</span>
              
              <p className="text-white/60 text-xs leading-relaxed line-clamp-3">
                {mod.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center text-[11px] font-bold text-white/40 group-hover:text-[#D4AF37] transition-colors">
              <span>प्रतीक्षा सूची में शामिल हों</span>
              <span>→</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Dynamic Waitlist Drawer / Modal */}
      <AnimatePresence>
        {selectedModule && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[11000] bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#111111] border border-[#D4AF37]/40 rounded-3xl p-6 md:p-8 overflow-hidden shadow-[0_0_50px_rgba(214,175,55,0.15)]"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => {
                    setSelectedModule(null);
                    setSubscribed(false);
                    setError("");
                  }}
                  className="p-1.5 bg-white/5 hover:bg-white/10 rounded-full text-white/60 hover:text-white transition-all clickable"
                >
                  <Check className="w-5 h-5 rotate-45" />
                </button>
              </div>

              <div className="flex flex-col items-center text-center space-y-4 mt-2">
                <div className="p-4 bg-[#D4AF37]/10 rounded-full text-[#D4AF37]">
                  {selectedModule.icon}
                </div>

                <div>
                  <span className="text-white/40 text-[10px] tracking-widest uppercase font-mono">
                    Roadmap WAITLIST • प्रतीक्षा सूची
                  </span>
                  <h4 className="text-xl font-extrabold text-white mt-1">
                    {selectedModule.hindiTitle}
                  </h4>
                </div>

                <p className="text-white/60 text-xs leading-relaxed max-w-sm">
                  {selectedModule.description}
                </p>

                {subscribed ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full bg-[#1c1c1c] border border-green-500/20 rounded-2xl p-4 flex flex-col items-center space-y-2 mt-4"
                  >
                    <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                      <Check className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-white">सफलतापूर्वक पंजीकृत!</span>
                    <p className="text-[11px] text-white/50">
                      जैसे ही यह फीचर लॉन्च होगा, आपके ईमेल पर आमंत्रण लिंक भेज दिया जाएगा। जय श्री कृष्ण! ❤️
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubscribe} className="w-full space-y-3 mt-4">
                    <div className="space-y-1 text-left">
                      <label className="text-white/50 text-[10px] font-bold uppercase tracking-wider block ml-1">
                        अपना ईमेल दर्ज करें
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="username@email.com"
                        className="w-full bg-[#050505] border border-white/10 focus:border-[#D4AF37]/50 focus:ring-1 focus:ring-[#D4AF37] rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition-all"
                      />
                    </div>

                    {error && (
                      <div className="flex items-center gap-1.5 text-xs text-[#FF0000] justify-center">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                      </div>
                    )}

                    <button
                      type="submit"
                      className="w-full bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-black font-extrabold py-3 rounded-xl text-xs uppercase tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#D4AF37]/10 clickable"
                    >
                      मुझे सूचित करें (Join Waitlist)
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
