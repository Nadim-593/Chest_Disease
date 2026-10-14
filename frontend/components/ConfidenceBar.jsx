"use client";

import { useEffect, useRef } from "react";

export default function ConfidenceBar({ confidence, colorClass = "from-sky-400 to-sky-600" }) {
  const barRef = useRef(null);
  const clampedValue = Math.min(100, Math.max(0, confidence || 0));

  useEffect(() => {
    if (barRef.current) {
      // Trigger animation by setting width after mount
      barRef.current.style.width = "0%";
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (barRef.current) {
            barRef.current.style.width = `${clampedValue}%`;
          }
        });
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [clampedValue]);

  return (
    <div
      className="relative h-3 bg-slate-200 rounded-full overflow-hidden"
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Confidence: ${clampedValue.toFixed(2)}%`}
    >
      <div
        ref={barRef}
        className={`h-full bg-gradient-to-r ${colorClass} rounded-full transition-all duration-1000 ease-out`}
        style={{ width: "0%" }}
      />
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}
