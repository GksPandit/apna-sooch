import React from "react";
import avatarImg from "../assets/images/apnasooch_avatar_1783877923459.jpg";

interface BrandLogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  animate?: boolean;
  className?: string;
}

export default function BrandLogo({ size = "md", animate = true, className = "" }: BrandLogoProps) {
  // Dimensions based on size prop
  const sizeClasses = {
    xs: "w-8 h-8 text-xl",
    sm: "w-10 h-10 text-2xl",
    md: "w-12 h-12 text-3xl",
    lg: "w-24 h-24 text-5xl",
    xl: "w-32 h-32 text-6xl",
  };

  const ringPaddings = {
    xs: "p-0.5",
    sm: "p-0.5",
    md: "p-1",
    lg: "p-2",
    xl: "p-3",
  };

  const omFontSizes = {
    xs: "text-base",
    sm: "text-lg md:text-xl",
    md: "text-2xl",
    lg: "text-4xl",
    xl: "text-6xl",
  };

  return (
    <div 
      className={`relative flex items-center justify-center rounded-full bg-[#161616] border border-[#D4AF37]/30 shadow-[0_0_15px_rgba(214,175,55,0.15)] overflow-hidden select-none ${sizeClasses[size]} ${className}`}
      id={`brand-logo-${size}`}
    >
      {/* Outer spinning dash border */}
      {animate && (
        <div 
          className="absolute inset-0 rounded-full border border-dashed border-[#D4AF37]/40 animate-spin" 
          style={{ animationDuration: size === "xs" || size === "sm" ? "18s" : "12s" }} 
        />
      )}
      
      {/* Inner spinning reverse border */}
      {animate && (
        <div 
          className="absolute inset-1 rounded-full border border-[#FF0000]/30 animate-spin" 
          style={{ animationDuration: "20s", animationDirection: "reverse" }} 
        />
      )}

      {/* Red gradient glow background layer */}
      <div className="absolute inset-0.5 rounded-full bg-gradient-to-tr from-[#FF0000]/20 via-black/40 to-[#D4AF37]/10" />

      {/* Core Symbol container */}
      <div className={`relative z-10 flex items-center justify-center w-full h-full rounded-full bg-radial-gradient from-black/80 to-[#161616] overflow-hidden ${ringPaddings[size]}`}>
        <img 
          src={avatarImg} 
          alt="Apna Sooch Logo" 
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
    </div>
  );
}
