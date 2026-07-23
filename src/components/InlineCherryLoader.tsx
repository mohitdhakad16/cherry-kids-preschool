import { useState, useEffect } from "react";

export function InlineCherryLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate a continuous loading loop while waiting for images
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) return 0; // Loop back to the start
        const increment = prev < 50 ? 5 : prev < 80 ? 3 : 2;
        return Math.min(prev + increment, 100);
      });
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full py-20">
      {/* Slightly smaller width/height for inline usage */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* SVG CHERRY DRAWING WITH DYNAMIC FILL MASK */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full drop-shadow-md"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* The ClipPath cuts off the colored cherry based on the loading percentage */}
            <clipPath id="cherry-fill-mask-inline">
              <rect x="0" y={100 - progress} width="100" height={progress} className="transition-all duration-75" />
            </clipPath>
          </defs>

          {/* BACKGROUND: Gray / Hollow Unfilled Cherry Outline */}
          <g fill="none" stroke="#d1d5db" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M50,15 Q60,25 65,45" />
            <path d="M50,15 Q35,25 25,48" />
            <path d="M55,18 Q70,12 75,22 Q63,25 55,18 Z" />
            <circle cx="28" cy="65" r="18" />
            <circle cx="68" cy="62" r="18" />
          </g>

          {/* FOREGROUND: Filled Cherry (Visible area controlled by mask) */}
          <g clipPath="url(#cherry-fill-mask-inline)">
            <path d="M50,15 Q60,25 65,45" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M50,15 Q35,25 25,48" fill="none" stroke="#22c55e" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M55,18 Q70,12 75,22 Q63,25 55,18 Z" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5" />
            <circle cx="28" cy="65" r="18" fill="#ff4d6d" />
            <circle cx="68" cy="62" r="18" fill="#ff4d6d" />
            <circle cx="22" cy="57" r="4" fill="#ffffff" opacity="0.6" />
            <circle cx="62" cy="54" r="4" fill="#ffffff" opacity="0.6" />
          </g>
        </svg>
      </div>

      {/* Loading Text details */}
      <div className="mt-4 text-center">
        <h3 className="font-display font-semibold text-lg text-primary tracking-wide animate-pulse">
          Loading Photos...
        </h3>
      </div>
    </div>
  );
}