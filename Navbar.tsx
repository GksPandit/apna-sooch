import React, { useState } from "react";
import { Search, Bookmark, Menu, X, Sparkles, Sun, Moon, Youtube, Bell } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import BrandLogo from "./BrandLogo";

interface NavbarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSearch: (query: string) => void;
  bookmarksCount: number;
}

export default function Navbar({ activeTab, onTabChange, onSearch, bookmarksCount }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  
  // Custom premium theme toggle state - switches accent accents in dark mode!
  // Mode 1: Sanatan Crimson (#FF0000), Mode 2: Celestial Gold (#D4AF37)
  const [accentTheme, setAccentTheme] = useState<"red" | "gold">("red");

  const menuItems = [
    { id: "home", label: "🏠 Home" },
    { id: "videos", label: "🎥 Videos" },
    { id: "shorts", label: "📱 Shorts" },
    { id: "playlists", label: "📜 Playlists" },
    { id: "community", label: "👥 Community" },
    { id: "gita", label: "🕉️ Daily Wisdom" },
    { id: "reality", label: "🎬 Life Reality" },
    { id: "ai-guide", label: "✨ AI Life Guide" },
    { id: "about", label: "ℹ️ About" },
    { id: "contact", label: "📞 Contact" }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSearch(searchVal);
      setSearchOpen(false);
    }
  };

  const handleTabSelect = (tabId: string) => {
    onTabChange(tabId);
    setMobileMenuOpen(false);
  };

  const toggleAccentTheme = () => {
    const newTheme = accentTheme === "red" ? "gold" : "red";
    setAccentTheme(newTheme);
    // Persist or apply custom root variables if needed
    const root = document.documentElement;
    if (newTheme === "gold") {
      root.style.setProperty("--color-brand-primary", "#D4AF37");
    } else {
      root.style.setProperty("--color-brand-primary", "#FF0000");
    }
  };

  return (
    <nav className="sticky top-0 z-[1000] bg-[#090909]/90 backdrop-blur-md border-b border-white/5 py-3 px-4 sm:px-6 md:px-12 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* LEFT BLOCK: LOGO & BRAND */}
        <div 
          onClick={() => handleTabSelect("home")} 
          className="flex items-center gap-3 cursor-pointer select-none group"
          id="navbar-brand-block"
        >
          <BrandLogo size="sm" animate={true} className="group-hover:scale-105 transition-transform duration-300" />

          <div className="flex flex-col">
            <h1 className="text-sm md:text-base font-extrabold tracking-[0.15em] text-white flex items-center gap-1">
              APNA SOOCH
              <Sparkles className={`w-3 h-3 transition-colors duration-300 ${accentTheme === "red" ? "text-[#FF0000]" : "text-[#D4AF37]"} animate-pulse`} />
            </h1>
            <span className="text-[9px] md:text-[10px] text-[#bdbdbd] group-hover:text-[#D4AF37] transition-colors tracking-[0.25em] font-medium uppercase leading-none">
              @apnasooch
            </span>
          </div>
        </div>

        {/* CENTER BLOCK: DESKTOP NAVIGATION */}
        <div className="hidden lg:flex items-center gap-1 bg-[#161616] p-1 rounded-2xl border border-white/5">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleTabSelect(item.id)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 ${
                activeTab === item.id
                  ? accentTheme === "red"
                    ? "bg-gradient-to-r from-[#FF0000] to-[#b30000] text-white shadow-md shadow-[#FF0000]/20 font-bold scale-[1.02]"
                    : "bg-gradient-to-r from-[#D4AF37] to-[#aa841c] text-black shadow-md shadow-[#D4AF37]/20 font-extrabold scale-[1.02]"
                  : "text-[#bdbdbd] hover:text-white hover:bg-white/5"
              } clickable`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* RIGHT BLOCK: SEARCH, BOOKMARKS, THEME, SUBSCRIBE */}
        <div className="flex items-center gap-1.5 md:gap-2.5">
          
          {/* Animated Glass Search */}
          <div className="relative flex items-center">
            <AnimatePresence>
              {searchOpen && (
                <motion.form
                  onSubmit={handleSearchSubmit}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "220px", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="absolute right-10 z-10"
                >
                  <input
                    type="text"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search videos, shorts, Bhagavad Gita..."
                    className="w-full bg-[#161616]/95 backdrop-blur-md border border-white/10 focus:border-[#D4AF37] text-white text-xs px-3.5 py-2 rounded-full outline-none transition-all pr-8 shadow-xl"
                    autoFocus
                  />
                  {searchVal && (
                    <button 
                      type="button" 
                      onClick={() => setSearchVal("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-2.5 bg-[#161616] hover:bg-[#1f1f1f] text-white/80 rounded-full border border-white/5 transition-all clickable ${searchOpen ? "bg-[#1f1f1f] border-[#D4AF37]/40" : ""}`}
              title="सत्य खोज (Search)"
              id="navbar-search-btn"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* Bookmarks Icon */}
          <button
            onClick={() => handleTabSelect("bookmarks")}
            className={`p-2.5 rounded-full border transition-all relative flex items-center justify-center clickable ${
              activeTab === "bookmarks"
                ? "bg-[#D4AF37]/10 border-[#D4AF37] text-[#D4AF37] shadow-[0_0_15px_rgba(214,175,55,0.2)]"
                : "bg-[#161616] hover:bg-[#1f1f1f] border-white/5 text-white/80"
            }`}
            title="सुरक्षित सूची (Bookmarks)"
            id="navbar-bookmarks-btn"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarksCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF0000] text-white font-mono text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce shadow-lg shadow-[#FF0000]/30">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Premium Theme Toggle (Aesthetic Accent Switcher) */}
          <button
            onClick={toggleAccentTheme}
            className="p-2.5 bg-[#161616] hover:bg-[#1f1f1f] border border-white/5 text-white/80 rounded-full transition-all clickable flex items-center justify-center relative group"
            title={accentTheme === "red" ? "Switch to Golden Aura" : "Switch to Sanatan Crimson"}
            id="navbar-theme-toggle"
          >
            {accentTheme === "red" ? (
              <Moon className="w-4 h-4 text-[#D4AF37] animate-pulse" />
            ) : (
              <Sun className="w-4 h-4 text-[#FF0000] spin-slow" />
            )}
            
            {/* Tooltip hint */}
            <span className="absolute top-12 scale-0 group-hover:scale-100 transition-all duration-200 bg-[#161616] border border-white/10 text-[10px] text-white rounded px-2 py-1 whitespace-nowrap z-50 pointer-events-none">
              Theme: {accentTheme === "red" ? "Sanatan Dark" : "Celestial Dark"}
            </span>
          </button>

          {/* SUBSCRIBE BUTTON */}
          <a
            href="https://youtube.com/@apnasooch?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#FF0000] hover:bg-[#e60000] hover:scale-105 active:scale-95 text-white font-extrabold rounded-full text-xs uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-[#FF0000]/40"
            id="navbar-subscribe-btn"
          >
            <Youtube className="w-3.5 h-3.5 fill-white text-[#FF0000]" />
            <span>Subscribe</span>
          </a>

          {/* Mobile Menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 bg-[#161616] hover:bg-[#1f1f1f] text-white border border-white/5 rounded-full transition-all clickable"
            id="navbar-mobile-menu-trigger"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* MOBILE EXPANDED MENU DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden mt-3 pt-3 border-t border-white/5 flex flex-col gap-1.5 overflow-hidden"
            id="navbar-mobile-drawer"
          >
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabSelect(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                  activeTab === item.id
                    ? accentTheme === "red"
                      ? "bg-[#FF0000] text-white font-bold shadow-lg"
                      : "bg-[#D4AF37] text-black font-extrabold shadow-lg"
                    : "text-[#bdbdbd] hover:text-white hover:bg-white/5"
                } clickable`}
              >
                {item.label}
              </button>
            ))}

            {/* Mobile-only Subscribe Link */}
            <a
              href="https://youtube.com/@apnasooch?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 w-full py-3.5 bg-[#FF0000] text-white font-extrabold rounded-xl text-xs uppercase tracking-widest text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#FF0000]/20"
            >
              <Youtube className="w-4 h-4 fill-white text-[#FF0000]" />
              Subscribe on YouTube
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
