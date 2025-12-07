"use client";

import { useState, useEffect } from "react";
import Navbar from "../layouts/Navbar"; // Sesuaikan path
import Footer from "../layouts/Footer"; // Sesuaikan path
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  BookOpen, 
  HelpCircle, 
  ChevronDown, 
  ShieldCheck, 
  AlertTriangle, 
  Info,
  CheckCircle2,
  FileText,
  Youtube
} from "lucide-react";
import Link from "next/link";

// --- TYPES & DATA ---

const TABS = [
  { id: "tutorial", label: "Tutorial Video", icon: Youtube },
  { id: "guidebook", label: "Panduan Pengguna", icon: BookOpen },
  { id: "indicators", label: "Indikator AI", icon: ShieldCheck },
  { id: "faq", label: "FAQ", icon: HelpCircle },
];

const GUIDEBOOK_STEPS = [
  {
    title: "Langkah 1: Persiapan URL",
    desc: "Salin tautan (URL) berita yang ingin Anda analisis dari browser. Pastikan link berasal dari sumber publik yang dapat diakses.",
    icon: Link,
  },
  {
    title: "Langkah 2: Proses Analisis",
    desc: "Tempel link ke kolom input di halaman utama. Pilih bahasa output (ID/EN) dan klik 'Mulai Analisis'. AI akan membaca konten secara real-time.",
    icon: Play,
  },
  {
    title: "Langkah 3: Membaca Hasil",
    desc: "Hasil akan menampilkan persentase Fakta, Opini, dan Hoaks. Baca rincian 'Deep Analysis' untuk melihat alasan di balik skor tersebut.",
    icon: FileText,
  },
];

const INDICATORS_DATA = [
  {
    type: "Fakta",
    color: "blue",
    desc: "Informasi yang dapat diverifikasi secara objektif melalui data, statistik, atau peristiwa nyata.",
    example: "Contoh: 'Gempa terjadi pada pukul 14.00 WIB.'",
  },
  {
    type: "Opini",
    color: "yellow",
    desc: "Pandangan subjektif penulis, argumen, atau persepsi yang tidak selalu berdasarkan data empiris.",
    example: "Contoh: 'Kebijakan ini tampaknya kurang efektif bagi rakyat.'",
  },
  {
    type: "Hoaks",
    color: "red",
    desc: "Informasi palsu, menyesatkan, atau dimanipulasi dengan sengaja untuk menipu pembaca.",
    example: "Contoh: 'Minum air garam menyembuhkan segala penyakit kronis.'",
  },
];

const FAQS = [
  {
    q: "Apakah hasil analisis AI 100% akurat?",
    a: "Tidak ada AI yang sempurna. Sistem kami menggunakan model bahasa canggih untuk memprediksi pola, namun tetap disarankan untuk memverifikasi ulang dengan sumber terpercaya.",
  },
  {
    q: "Berapa lama proses analisis berlangsung?",
    a: "Biasanya memakan waktu antara 5 hingga 15 detik, tergantung pada panjang artikel dan respons server.",
  },
  {
    q: "Apakah data saya disimpan?",
    a: "Jika Anda login, riwayat analisis akan disimpan untuk memudahkan Anda melihat kembali. Jika tidak login, data tidak disimpan di database kami.",
  },
];

// --- COMPONENTS ---

const SectionHeading = ({ children, icon: Icon }: { children: React.ReactNode; icon?: any }) => (
  <div className="flex items-center gap-3 mb-6">
    {Icon && <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><Icon size={24} /></div>}
    <h2 className="text-2xl md:text-3xl font-bold text-zinc-800">{children}</h2>
  </div>
);

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState("tutorial");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Scroll to section handler
  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-orange-100 via-white to-orange-50 text-zinc-800 pt-28 pb-20 px-4 md:px-8">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto text-center mb-16"
        >
          <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-600 text-sm font-bold tracking-wide uppercase mb-4 inline-block">
            Pusat Bantuan
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent drop-shadow-sm mb-6 py-2">
            Panduan Penggunaan & Edukasi
          </h1>
          <p className="text-zinc-600 text-lg md:text-xl max-w-2xl mx-auto">
            Pelajari cara menggunakan AI News Analyzer secara efektif dan pahami bagaimana kami mendeteksi berita.
          </p>
        </motion.div>

        {/* LAYOUT GRID */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          
          {/* SIDEBAR NAVIGATION (Sticky on Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-32 space-y-2">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2 px-4">Menu Navigasi</p>
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => scrollToSection(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-left ${
                    activeTab === tab.id
                      ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                      : "bg-white text-zinc-600 hover:bg-orange-50 border border-transparent hover:border-orange-200"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.label}
                </button>
              ))}

              {/* <div className="mt-8 p-4 bg-gradient-to-br from-amber-50 to-orange-100 rounded-2xl border border-orange-200">
                <h4 className="font-bold text-orange-800 mb-1">Butuh Bantuan Lebih?</h4>
                <p className="text-xs text-orange-700 mb-3">Hubungi tim support kami jika menemukan kendala.</p>
                <button className="text-xs font-bold text-white bg-orange-500 px-3 py-2 rounded-lg w-full hover:bg-orange-600 transition">
                  Kontak Support
                </button>
              </div> */}
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="lg:col-span-3 space-y-16">

            {/* 1. VIDEO TUTORIAL */}
            <section id="tutorial" className="scroll-mt-32">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="bg-white border border-zinc-200 p-6 md:p-8 rounded-3xl shadow-xl overflow-hidden"
              >
                <SectionHeading icon={Youtube}>Video Tutorial</SectionHeading>
                <p className="text-zinc-600 mb-6">
                  Saksikan panduan visual lengkap tentang cara menggunakan fitur analisis berita melalui video di bawah ini.
                </p>
                
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900 shadow-inner group">
                  <iframe 
                    width="100%" 
                    height="100%" 
                    src="https://www.youtube.com/embed/4rGNE7a9D10?si=GenericParam" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  ></iframe>
                </div>
                <div className="mt-4 flex justify-end">
                   <a 
                     href="https://youtu.be/4rGNE7a9D10" 
                     target="_blank" 
                     className="text-sm font-semibold text-orange-600 hover:underline flex items-center gap-1"
                   >
                     Tonton di YouTube <Play size={14} />
                   </a>
                </div>
              </motion.div>
            </section>

            {/* 2. GUIDEBOOK (Visualized from Drive) */}
            <section id="guidebook" className="scroll-mt-32">
              <SectionHeading icon={BookOpen}>Panduan Penggunaan Cepat</SectionHeading>
              
              <div className="grid md:grid-cols-3 gap-4">
                {GUIDEBOOK_STEPS.map((step, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white p-6 rounded-2xl border border-orange-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white mb-4 shadow-lg shadow-orange-500/20">
                      {/* <step.icon size={24} /> */}
                    </div>
                    <h3 className="font-bold text-lg text-zinc-800 mb-2">{step.title}</h3>
                    <p className="text-sm text-zinc-500 leading-relaxed">{step.desc}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                <Info className="text-orange-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="font-bold text-orange-800 text-sm">Dokumen Lengkap</h4>
                  <p className="text-xs text-orange-700 mt-1 mb-2">
                    Ingin membaca detail teknis dan metodologi lengkap? Unduh dokumen PDF panduan kami.
                  </p>
                  <a 
                    href="https://drive.google.com/file/d/1s5fFxOyY2b3mlzRO0GRuNvUEoNysSA5o/view?usp=drive_link"
                    target="_blank"
                    className="text-xs bg-white border border-orange-300 px-3 py-1.5 rounded-md font-semibold text-orange-700 hover:bg-orange-100 transition inline-flex items-center gap-2"
                  >
                    Buka Google Drive <BookOpen size={12} />
                  </a>
                </div>
              </div>
            </section>

            {/* 3. AI INDICATORS EXPLANATION */}
            <section id="indicators" className="scroll-mt-32">
              <SectionHeading icon={ShieldCheck}>Memahami Indikator AI</SectionHeading>
              <div className="space-y-4">
                {INDICATORS_DATA.map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`border-l-4 p-5 rounded-r-xl bg-white shadow-sm border ${
                      item.color === "blue" ? "border-l-blue-500 border-y-zinc-100 border-r-zinc-100" :
                      item.color === "yellow" ? "border-l-yellow-400 border-y-zinc-100 border-r-zinc-100" :
                      "border-l-red-500 border-y-zinc-100 border-r-zinc-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`w-2 h-2 rounded-full ${
                        item.color === "blue" ? "bg-blue-500" :
                        item.color === "yellow" ? "bg-yellow-400" : "bg-red-500"
                      }`} />
                      <h3 className={`font-bold text-lg ${
                        item.color === "blue" ? "text-blue-600" :
                        item.color === "yellow" ? "text-yellow-600" : "text-red-600"
                      }`}>
                        {item.type}
                      </h3>
                    </div>
                    <p className="text-zinc-600 text-sm mb-2">{item.desc}</p>
                    <p className="text-zinc-400 text-xs italic bg-zinc-50 p-2 rounded inline-block">
                      {item.example}
                    </p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* 4. FAQ */}
            <section id="faq" className="scroll-mt-32">
              <SectionHeading icon={HelpCircle}>Pertanyaan Umum (FAQ)</SectionHeading>
              <div className="space-y-3">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="border border-orange-100 rounded-xl bg-white overflow-hidden shadow-sm">
                    <button
                      onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                      className="w-full flex justify-between items-center p-4 text-left hover:bg-orange-50/50 transition"
                    >
                      <span className="font-semibold text-zinc-700">{faq.q}</span>
                      <ChevronDown 
                        className={`text-orange-400 transition-transform duration-300 ${
                          openFaqIndex === idx ? "rotate-180" : ""
                        }`} 
                      />
                    </button>
                    <AnimatePresence>
                      {openFaqIndex === idx && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-orange-50/30"
                        >
                          <p className="p-4 pt-0 text-sm text-zinc-600 leading-relaxed border-t border-orange-100/50 mt-2">
                            {faq.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        {/* BOTTOM CTA */}
        <div className="mt-20 text-center">
           <h3 className="text-2xl font-bold text-zinc-800 mb-4">Sudah siap mencoba?</h3>
           <Link href="/xenotimes/analyzer">
            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-orange-500/40 transition-all transform hover:-translate-y-1">
                Mulai Analisis Berita Sekarang
            </button>
           </Link>
        </div>

      </main>
      <Footer />
    </>
  );
}