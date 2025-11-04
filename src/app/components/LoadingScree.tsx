"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

/**
 * LoadingScreen
 * - teks besar "xenotimes" dengan animated gradient text
 * - background gelap soft, centered
 * - respects prefers-reduced-motion
 */

export default function LoadingScreen() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-b from-orange-50 to-white z-50">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col items-center gap-6"
        aria-live="polite"
        role="status"
      >
        <h1
          className="text-5xl sm:text-7xl md:text-8xl font-extrabold tracking-tight leading-none text-center"
          style={{
            // fallback color if gradient not supported
            color: "#FF7A18",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundImage:
              "linear-gradient(90deg, #FF7A18 0%, #FFB347 30%, #FFF5E1 60%, #FFB347 80%, #FF7A18 100%)",
            backgroundSize: "200% 100%",
            animation: "xeno-gradient 3.5s linear infinite",
          }}
        >
          xenotimes
        </h1>

        <div className="flex items-center gap-3">
          {/* <div
            className="w-10 h-2 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={50}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              style={{
                height: "100%",
                width: "60%",
                borderRadius: 9999,
                background:
                  "linear-gradient(90deg, rgba(255,122,24,0.9), rgba(255,179,71,0.9), rgba(255,245,225,0.9))",
                transformOrigin: "left",
                animation: "xeno-bar 1.4s ease-in-out infinite",
              }}
            />
          </div> */}
          <Loader2 className="animate-spin w-6 h-6 text-orange-500" />
          <span className="text-sm md:text-md text-orange-600">Loading{dots}</span>
        </div>
      </motion.div>

      {/* Inline keyframes */}
      <style jsx>{`
        @keyframes xeno-gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes xeno-bar {
          0% {
            transform: translateX(-10%) scaleX(0.85);
            opacity: 0.6;
          }
          50% {
            transform: translateX(0%) scaleX(1);
            opacity: 1;
          }
          100% {
            transform: translateX(10%) scaleX(0.9);
            opacity: 0.7;
          }
        }

        /* respect prefers-reduced-motion */
        @media (prefers-reduced-motion: reduce) {
          :global(h1) {
            animation: none !important;
            background-position: 50% 50% !important;
          }
          :global(div[role="progressbar"] > div) {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
