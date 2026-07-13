import { Home, PlaySquare, Film, BookOpen, User, BookMarked, MessageSquare, Tv, Sparkles } from "lucide-react";

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: "home", label: "होम", icon: <Home className="w-5 h-5" /> },
    { id: "videos", label: "वीडियो", icon: <PlaySquare className="w-5 h-5" /> },
    { id: "reality", label: "Reality", icon: <Tv className="w-5 h-5" /> },
    { id: "ai-guide", label: "AI Guide", icon: <Sparkles className="w-5 h-5" /> },
    { id: "gita", label: "Daily Wisdom", icon: <BookOpen className="w-5 h-5" /> },
    { id: "about", label: "परिचय", icon: <User className="w-5 h-5" /> }
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-[999] bg-[#161616]/95 backdrop-blur-lg border border-white/10 py-2.5 px-3 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] flex items-center justify-around">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3.5 rounded-xl transition-all duration-300 clickable ${
              isActive 
                ? "text-[#D4AF37] scale-105" 
                : "text-white/45 hover:text-white/75"
            }`}
          >
            <div className={`transition-transform duration-300 ${isActive ? "scale-110 drop-shadow-[0_0_8px_#D4AF37]" : ""}`}>
              {tab.icon}
            </div>
            <span className="text-[10px] font-bold tracking-wide leading-none uppercase">
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
