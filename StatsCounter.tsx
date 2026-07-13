import { useEffect, useState } from "react";
import { Youtube, Users, Eye, PlaySquare } from "lucide-react";
import { motion } from "motion/react";

interface StatsCounterProps {
  subscribers: number;
  views: number;
  videos: number;
}

export default function StatsCounter({ subscribers, views, videos }: StatsCounterProps) {
  const [subCount, setSubCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);
  const [videoCount, setVideoCount] = useState(0);

  useEffect(() => {
    // Count up animations
    const duration = 2000; // 2 seconds
    const steps = 50;
    const stepTime = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      
      // Calculate eased progress
      const progress = step / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Cubic ease out

      setSubCount(Math.floor(easeProgress * subscribers));
      setViewCount(Math.floor(easeProgress * views));
      setVideoCount(Math.floor(easeProgress * videos));

      if (step >= steps) {
        clearInterval(timer);
        setSubCount(subscribers);
        setViewCount(views);
        setVideoCount(videos);
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [subscribers, views, videos]);

  // Format numbers nicely
  const formatNum = (num: number, suffix: string) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + "M+";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K+";
    }
    return num + suffix;
  };

  const statItems = [
    {
      id: "stats-subs",
      label: "सदस्य (Subscribers)",
      value: formatNum(subCount, ""),
      icon: <Users className="w-6 h-6 text-[#D4AF37]" />,
      detail: "Apna Sooch Family members learning truth"
    },
    {
      id: "stats-views",
      label: "कुल दृश्य (Views)",
      value: formatNum(viewCount, ""),
      icon: <Eye className="w-6 h-6 text-[#FF0000]" />,
      detail: "Total wisdom & lesson streams watched"
    },
    {
      id: "stats-videos",
      label: "वीडियोस (Videos)",
      value: videoCount + "+",
      icon: <PlaySquare className="w-6 h-6 text-[#D4AF37]" />,
      detail: "Cinematic, deep truth lessons published"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {statItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1, duration: 0.6 }}
          className="relative bg-[#111111] border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-[#D4AF37]/30 transition-all duration-500 group shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
        >
          {/* Subtle gradient glow on hover */}
          <div className="absolute inset-0 bg-gradient-to-tr from-[#FF0000]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4">
            <span className="text-white/60 text-sm font-medium tracking-wide">
              {item.label}
            </span>
            <div className="p-3 bg-white/5 rounded-xl group-hover:scale-110 transition-transform duration-300">
              {item.icon}
            </div>
          </div>

          <div className="text-3xl font-extrabold font-mono tracking-tight text-white mb-1 drop-shadow-[0_2px_10px_rgba(0,0,0,0.3)]">
            {item.value}
          </div>

          <div className="text-xs text-white/40 group-hover:text-white/60 transition-colors duration-300">
            {item.detail}
          </div>

          {/* Border accent lines */}
          <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-[#FF0000] to-[#D4AF37] group-hover:w-full transition-all duration-700" />
        </motion.div>
      ))}
    </div>
  );
}
