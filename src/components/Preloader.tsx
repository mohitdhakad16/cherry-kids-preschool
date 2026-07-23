import { useState, useEffect } from "react";

export function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 1. Simulate the loading filling effect smoothly
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Increment faster at the beginning, slower at the end
        const increment = prev < 50 ? 5 : prev < 80 ? 2 : 1;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    // 2. Hide loader only when progress is 100% AND window window has fully completed loading
    const handlePageLoad = () => {
      setProgress(100);
    };

    if (document.readyState === "complete") {
      handlePageLoad();
    } else {
      window.addEventListener("load", handlePageLoad);
    }

    // 3. Fade out animation timeline
    let timeoutId: NodeJS.Timeout;
    if (progress === 100) {
      timeoutId = setTimeout(() => {
        setIsVisible(false);
      }, 600); // Gives time for the fade transition to complete
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener("load", handlePageLoad);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [progress]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-cream transition-opacity duration-500 ease-in-out ${
        progress === 100 ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* SVG CHERRY DRAWING WITH DYNAMIC FILL MASK */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* The ClipPath cuts off the colored cherry based on the loading percentage */}
            <clipPath id="cherry-fill-mask">
              <rect x="0" y={100 - progress} width="100" height={progress} transition-all="true" className="duration-200" />
            </clipPath>
          </defs>

          {/* BACKGROUND: Gray / Hollow Unfilled Cherry Outline */}
          <g fill="none" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            {/* Stem & Leaf */}
            <path d="M50,15 Q60,25 65,45" />
            <path d="M50,15 Q35,25 25,48" />
            <path d="M55,18 Q70,12 75,22 Q63,25 55,18 Z" />
            {/* The twin cherries outlines */}
            <circle cx="28" cy="65" r="18" />
            <circle cx="68" cy="62" r="18" />
          </g>

          {/* FOREGROUND: Filled Cherry (Visible area controlled by mask) */}
          <g clipPath="url(#cherry-fill-mask)">
            {/* Green Stem & Leaf */}
            <path d="M50,15 Q60,25 65,45" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M50,15 Q35,25 25,48" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M55,18 Q70,12 75,22 Q63,25 55,18 Z" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5" />
            
            {/* Bright Red/Primary Colored Cherries */}
            <circle cx="28" cy="65" r="18" fill="#ff4d6d" />
            <circle cx="68" cy="62" r="18" fill="#ff4d6d" />
            
            {/* Cute glossy highlights */}
            <circle cx="22" cy="57" r="4" fill="#ffffff" opacity="0.6" />
            <circle cx="62" cy="54" r="4" fill="#ffffff" opacity="0.6" />
          </g>
        </svg>
      </div>

      {/* Loading Text details */}
      <div className="mt-4 text-center">
        <h3 className="font-display font-bold text-xl text-primary tracking-wide">
          Cherry Kids Preschool
        </h3>
      </div>
    </div>
  );
}