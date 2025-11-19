"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useState } from "react";

export default function FloatingAIButton() {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 12 }}
      className="fixed bottom-6 right-6 z-50"
    >
      {/* Tombol utama */}
      <motion.button
        onClick={() => router.push("/xenotimes/analyzer")}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        // className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-400 shadow-[0_0_20px_rgba(255,193,7,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] text-white transition-all duration-300"
        className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-tr from-[#D97706] to-yellow-400 shadow-[0_0_20px_rgba(255,193,7,0.6)] hover:shadow-[0_0_30px_rgba(59,130,246,0.7)] text-white transition-all duration-300"
      >
        <motion.div
          animate={{
            rotate: hovered ? 360 : 0,
            transition: { duration: 0.6 },
          }}
        >
          {hovered ? <Sparkles className="w-7 h-7" /> : <Search className="w-7 h-7" />}
        </motion.div>

        {/* Tooltip */}
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: hovered ? 1 : 0, x: hovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-full mr-3 px-3 py-1.5 backdrop-blur-md bg-white/40 text-white text-sm rounded-md whitespace-nowrap shadow-lg"
        >
          Gunakan AI untuk temukan fakta atau opini
        </motion.span>

        {/* Pulse efek */}
        <span className="absolute inset-0 rounded-full bg-amber-400 opacity-20 animate-ping"></span>
      </motion.button>
    </motion.div>
  );
}
