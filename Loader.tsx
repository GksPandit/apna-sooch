import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import BrandLogo from "./BrandLogo";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 400); // Small delay for ultimate smoothness
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] bg-[#090909] flex flex-col items-center justify-center overflow-hidden select-none">
      {/* Cinematic Fog / Smoke Background effect */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#FF0000] filter blur-[150px] top-1/4 -left-1/4 animate-pulse duration-[6000ms]" />
        <div className="absolute w-[600px] h-[600px] rounded-full bg-[#D4AF37] filter blur-[200px] bottom-1/4 -right-1/4 animate-pulse duration-[8000ms]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md px-6 text-center">
        {/* Glowing Golden Om Logo using unified BrandLogo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-8"
        >
          <BrandLogo size="xl" />
        </motion.div>

        {/* Apna Sooch Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-4xl font-bold tracking-[0.2em] text-[#FFFFFF] mb-2"
        >
          APNA SOOCH
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-[#D4AF37] text-xs tracking-[0.3em] uppercase mb-12 font-medium"
        >
          सत्य की खोज...
        </motion.p>

        {/* Custom Progress bar */}
        <div className="w-64 h-[2px] bg-white/5 rounded-full overflow-hidden relative mb-4">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF0000] to-[#D4AF37]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Progress percent & Mantra */}
        <div className="flex flex-col items-center space-y-2">
          <span className="text-white/40 font-mono text-xs">{progress}%</span>
          <AnimatePresence mode="wait">
            {progress < 40 && (
              <motion.span
                key="m1"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-white/60 text-xs tracking-wider"
              >
                धर्मो रक्षति रक्षितः 🚩
              </motion.span>
            )}
            {progress >= 40 && progress < 80 && (
              <motion.span
                key="m2"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-[#D4AF37]/80 text-xs tracking-wider"
              >
                यदा यदा हि धर्मस्य... ✨
              </motion.span>
            )}
            {progress >= 80 && (
              <motion.span
                key="m3"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="text-white/80 text-xs tracking-wider"
              >
                जय श्री कृष्ण ❤️
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
