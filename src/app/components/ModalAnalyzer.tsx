"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnalyzerPromoModal() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // ✅ Cek apakah user sudah pernah lihat modal (disimpan di localStorage)
    const hasSeen = localStorage.getItem("hasSeenAnalyzerPromo");
    if (!hasSeen) {
      setTimeout(() => setIsOpen(true), 800); // delay biar muncul smooth
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // localStorage.setItem("hasSeenAnalyzerPromo", "true");
  };

  const handleGoToAnalyzer = () => {
    localStorage.setItem("hasSeenAnalyzerPromo", "true");
    router.push("/xenotimes/analyzer");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-[90%] text-center border border-orange-200"
          >
            {/* Tombol Close */}
            <button
              onClick={handleClose}
              className="absolute top-3 right-3 text-zinc-500 hover:text-orange-500 transition"
            >
              <X size={22} />
            </button>

            {/* Heading */}
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent mb-4">
              🔍 Try Our Fact, Hoax & Opinion Analyzer!
            </h2>

            <p className="text-zinc-600 mb-6">
              Discover whether a news article is based on facts, opinions, or hoaxes.
              Our AI-powered analyzer helps you verify online information instantly.
            </p>

            {/* Tombol Aksi */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleClose}
                className="px-5 py-2.5 rounded-xl border border-orange-300 text-orange-600 font-semibold hover:bg-orange-50 transition-all duration-200"
              >
                Close
              </button>
              <button
                onClick={handleGoToAnalyzer}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-md hover:scale-105 transition-transform duration-200"
              >
                Go to Analyzer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
