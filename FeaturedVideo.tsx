import { useState } from "react";
import { Play, Eye, Calendar, Clock, Share2, Youtube, ChevronDown, ChevronUp, Bookmark, BookmarkCheck } from "lucide-react";
import { motion } from "motion/react";
import { Video } from "../types";

interface FeaturedVideoProps {
  video: Video | null;
  onBookmarkToggle?: (id: string) => void;
  isBookmarked?: boolean;
}

export default function FeaturedVideo({ video, onBookmarkToggle, isBookmarked = false }: FeaturedVideoProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFullDesc, setShowFullDesc] = useState(false);

  if (!video) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: video.title,
        text: video.description,
        url: `https://www.youtube.com/watch?v=${video.youtubeId}`
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`https://www.youtube.com/watch?v=${video.youtubeId}`);
      alert("वीडियो लिंक कॉपी हो गया है!");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-[#161616] border border-white/10 rounded-3xl overflow-hidden shadow-[0_15px_45px_rgba(0,0,0,0.6)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Visual / Player Stage - Left (7 cols) */}
        <div className="lg:col-span-7 relative bg-[#090909] aspect-video w-full flex items-center justify-center">
          {!isPlaying ? (
            <div className="absolute inset-0 w-full h-full group select-none">
              {/* High-quality video banner fallback cover */}
              <img
                src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
                alt={video.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700 ease-out"
                onError={(e) => {
                  if (!video.thumbnail) {
                    // Fallback if maxresdefault doesn't exist
                    e.currentTarget.src = `https://img.youtube.com/vi/${video.youtubeId}/mqdefault.jpg`;
                  }
                }}
              />
              {/* Play overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none" />
              
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center cursor-pointer clickable group"
              >
                <div className="w-20 h-20 bg-[#FF0000] text-white rounded-full flex items-center justify-center shadow-[0_0_35px_rgba(255,0,0,0.5)] group-hover:scale-110 group-hover:bg-[#FF0000]/90 transition-all duration-300">
                  <Play className="w-8 h-8 fill-white translate-x-0.5" />
                </div>
              </button>

              {/* Category Badge overlay */}
              <span className="absolute top-4 left-4 bg-[#D4AF37] text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                {video.category}
              </span>
            </div>
          ) : (
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              title={video.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )}
        </div>

        {/* Content details - Right (5 cols) */}
        <div className="lg:col-span-5 p-6 md:p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block">
              ★ मुख्य वीडियो (Featured Video)
            </span>
            <h3 className="text-xl md:text-2xl font-bold text-white leading-snug tracking-wide hover:text-[#D4AF37] transition-colors">
              {video.title}
            </h3>

            {/* Meta stats */}
            <div className="flex flex-wrap gap-4 text-xs text-white/50 font-mono">
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4 text-[#FF0000]" />
                {video.views} दृश्य
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-[#D4AF37]" />
                {video.duration} मिनट
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4 text-white/40" />
                {video.date}
              </span>
            </div>

            {/* Description toggle */}
            <div className="space-y-2">
              <p className={`text-white/70 text-sm leading-relaxed ${showFullDesc ? "" : "line-clamp-3"}`}>
                {video.description}
              </p>
              <button
                onClick={() => setShowFullDesc(!showFullDesc)}
                className="text-xs text-[#D4AF37] hover:text-[#D4AF37]/80 font-bold flex items-center gap-1 transition-all clickable"
              >
                {showFullDesc ? (
                  <>
                    विवरण संक्षेप करें <ChevronUp className="w-3 h-3" />
                  </>
                ) : (
                  <>
                    पूरा विवरण पढ़ें <ChevronDown className="w-3 h-3" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/5">
            <button
              onClick={handleShare}
              className="p-2.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-xl transition-all flex items-center gap-2 text-xs clickable"
            >
              <Share2 className="w-4 h-4" />
              शेयर करें
            </button>

            {onBookmarkToggle && (
              <button
                onClick={() => onBookmarkToggle(video.id)}
                className={`p-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  isBookmarked 
                    ? "bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30" 
                    : "bg-white/5 hover:bg-white/10 text-white/80 hover:text-white"
                } clickable`}
              >
                {isBookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {isBookmarked ? "सुरक्षित है" : "बाद में देखें"}
              </button>
            )}

            <a
              href={`https://youtube.com/watch?v=${video.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-[#FF0000] hover:bg-[#FF0000]/90 text-white rounded-xl text-xs font-bold transition-all hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] flex items-center gap-1.5 clickable"
            >
              <Youtube className="w-4.5 h-4.5 fill-white" />
              YouTube पर देखें
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
