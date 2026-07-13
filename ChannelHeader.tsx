import React from "react";
import { Youtube, CheckCircle2, Pencil, Users, BarChart3, ChevronRight } from "lucide-react";
import { motion } from "motion/react";
import avatarImg from "../assets/images/apnasooch_avatar_1783877923459.jpg";

interface ChannelHeaderProps {
  subscribersCount?: string;
  videosCount?: string;
}

export default function ChannelHeader({ subscribersCount = "3.35K", videosCount = "180+" }: ChannelHeaderProps) {
  const avatarSrc = avatarImg;

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-[0_15px_40px_rgba(0,0,0,0.1)] relative text-[#0f0f0f] font-sans p-6 sm:p-8 space-y-6"
      id="channel-header-component"
    >
      {/* 1. Top Subscription Strip (Replicating Image 0) */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-gray-100 gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          {/* Circular Channel Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-0.5 bg-gray-100 shadow-sm">
              <img 
                src={avatarSrc} 
                alt="Apna Sooch Channel Avatar" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-full select-none"
              />
            </div>
            {/* Online Pulse status dot */}
            <div className="absolute bottom-1 right-1 bg-green-500 w-3.5 h-3.5 rounded-full border-2 border-white shadow-md animate-pulse" />
          </div>

          {/* Title and Sanskrit Tagline (Matches Image 0 & 1 perfectly) */}
          <div className="space-y-1">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 flex-wrap">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0f0f0f] tracking-tight leading-none">
                Apna Sooch
              </h2>
              <div className="flex items-center gap-0.5 bg-red-50 border border-red-100 px-2 py-0.5 rounded-full text-[9px] text-[#FF0000] font-black uppercase tracking-wider">
                <CheckCircle2 className="w-3 h-3 text-[#FF0000] fill-white" />
                <span>Verified</span>
              </div>
            </div>

            {/* Tagline: Exact color match and styling */}
            <p className="text-xs sm:text-sm font-bold text-[#b45309] tracking-wide leading-relaxed font-serif">
              KRISHNA❤️ | BHAGWAT GEETA | अनुगच्छतु प्रवाहं
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-gray-500 font-semibold flex-wrap">
              <span>@apnasooch</span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="flex items-center gap-1">
                {subscribersCount} subscribers <ChevronRight className="w-3 h-3 text-gray-400 inline" />
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300" />
              <span>{videosCount} videos</span>
            </div>
          </div>
        </div>

        {/* Subscribe Action Button (Matches Image 0) */}
        <div className="flex-shrink-0 w-full md:w-auto text-center">
          <a
            href="https://youtube.com/@apnasooch?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF0000] hover:bg-[#e60000] active:scale-95 text-white font-black text-sm uppercase tracking-widest rounded-2xl transition-all duration-300 shadow-md shadow-red-200 group w-full sm:w-auto"
          >
            <Youtube className="w-4 h-4 fill-white text-[#FF0000] group-hover:scale-110 transition-transform" />
            <span>Subscribe</span>
          </a>
        </div>
      </div>

      {/* 2. Middle Info Block (Replicating Image 1 details) */}
      <div className="space-y-4">
        {/* Sanskrit and Hindi description line (Matches Image 1 description exactly) */}
        <div className="bg-[#f9f9f9] border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">✨</span>
            <p className="text-xs sm:text-sm text-gray-700 font-medium leading-relaxed">
              हरे_कृष्णा✨हरे राम✨🚩 धर्मो रक्षति रक्षितः🚩सनातन
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Mini avatar stack like Image 1 */}
            <div className="flex -space-x-2 overflow-hidden">
              <img className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover" src={avatarSrc} alt="avatar member" />
              <div className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-[#D4AF37] text-white flex items-center justify-center text-[8px] font-bold">AS</div>
            </div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Community</span>
          </div>
        </div>

        {/* 3. Action Pills Block (Replicating Image 1 YouTube Studio pills) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {/* Analytics Pill */}
          <button
            onClick={() => {
              const el = document.getElementById("youtube-stats-section");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f2f2f2] hover:bg-[#e6e6e6] active:scale-95 text-[#0f0f0f] font-bold text-sm rounded-xl border border-gray-200/40 transition-all cursor-pointer"
          >
            <BarChart3 className="w-4 h-4 text-gray-700" />
            <span>Analytics</span>
          </button>

          {/* Edit Channel Pill */}
          <a
            href="https://studio.youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f2f2f2] hover:bg-[#e6e6e6] active:scale-95 text-[#0f0f0f] font-bold text-sm rounded-xl border border-gray-200/40 transition-all text-center"
          >
            <Pencil className="w-4 h-4 text-gray-700" />
            <span>Edit channel</span>
          </a>

          {/* Community Pill */}
          <a
            href="https://youtube.com/@apnasooch/community"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-3 bg-[#f2f2f2] hover:bg-[#e6e6e6] active:scale-95 text-[#0f0f0f] font-bold text-sm rounded-xl border border-gray-200/40 transition-all text-center"
          >
            <Users className="w-4 h-4 text-gray-700" />
            <span>Community</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
