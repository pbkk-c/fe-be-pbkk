"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
  };
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const route = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const res = await fetch("/api/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data);
      } else {
        console.error("Failed to fetch user");
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading profile...
      </div>
    );

  if (!user) {
    route.push("/login");
    return null;
  }

  return (
    <ProtectedRoute>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100 flex flex-col items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8 flex flex-col md:flex-row gap-8 border border-orange-100"
        >
          {/* Avatar + Basic Info */}
          <div className="flex flex-col items-center md:w-1/3">
            <img
              src={
                user.user_metadata?.avatar_url ||
                `https://ui-avatars.com/api/?name=${user.email}&background=random`
              }
              alt="avatar"
              className="w-28 h-28 rounded-full border-4 border-orange-200 shadow-md"
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-800 text-center">
              {user.user_metadata?.full_name || "User"}
            </h2>
            <p className="text-sm text-gray-500 text-center">{user.email}</p>
          </div>

          {/* Detail Info */}
          <div className="flex-1 flex flex-col justify-center">
            <h3 className="text-lg font-bold text-orange-700 mb-4">
              Akun Informasi
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">User Email</span>
                <span className="text-gray-500 text-sm truncate max-w-[180px]">
                  {user.email}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Bergabung</span>
                <span className="text-gray-500 text-sm">
                  {new Date(user.created_at).toLocaleDateString("id-ID")}
                </span>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/history"
                className="w-full sm:w-1/2 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-500 transition text-center font-medium"
              >
                Riwayat Aktivitas
              </Link>
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.href = "/login";
                }}
                className="w-full sm:w-1/2 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition font-medium"
              >
                Keluar
              </button>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Floating Button */}
      <motion.button
        onClick={() => route.push("/analyzer")}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-orange-600 hover:bg-orange-700 text-white shadow-lg flex items-center justify-center relative group"
      >
        <Search className="w-6 h-6" />
        <span className="absolute right-full mr-3 px-3 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          Gunakan AI untuk analisis fakta & opini
        </span>
        <span className="absolute inset-0 rounded-full bg-orange-500 blur-lg opacity-30 group-hover:opacity-50 transition-opacity duration-300" />
      </motion.button>

      <Footer />
    </ProtectedRoute>
  );
}
