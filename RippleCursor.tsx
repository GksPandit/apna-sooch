import { useEffect, useState, useRef } from "react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function RippleCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(true);
  const rippleIdRef = useRef(0);

  useEffect(() => {
    // Check if device is mobile/touch
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia("(max-width: 768px)").matches ||
        ("ontouchstart" in window) ||
        (navigator.maxTouchPoints > 0)
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (isMobile) return;

    const moveCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const addRipple = (e: MouseEvent) => {
      const id = rippleIdRef.current++;
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
      
      // Clean up ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id));
      }, 800);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.closest("button") || 
        target.closest("a") || 
        target.classList.contains("clickable");
      setIsHovered(!!isClickable);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("click", addRipple);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("click", addRipple);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer cursor dot following mouse */}
      <div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-[#D4AF37] pointer-events-none z-[9999] transition-transform duration-100 ease-out -translate-x-1/2 -translate-y-1/2"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${isHovered ? 1.5 : 1})`,
          backgroundColor: isHovered ? "rgba(212, 175, 55, 0.1)" : "transparent",
        }}
      />
      {/* Inner precise cursor dot */}
      <div
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-[#FF0000] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 shadow-[0_0_10px_#FF0000]"
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        }}
      />

      {/* Ripple effects on click */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full border-2 border-[#D4AF37]/80 -translate-x-1/2 -translate-y-1/2 animate-ping"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: "50px",
            height: "50px",
            animationDuration: "0.8s",
          }}
        />
      ))}
    </>
  );
}
