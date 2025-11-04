"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import ProtectedRoute from "../components/ProtectedRoute";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import FloatingAIButton from "../home/components/FloatingButton";
import LoadingScreen from "../components/LoadingScree";

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

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    route.push("/login");
    return null;
  }

  return (
    <>
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
              <h3 className="text-lg font-bold text-orange-700 mb-4">Akun Informasi</h3>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-gray-700">User Email</span>
                  <span className="text-gray-500 text-sm truncate max-w-[180px]">{user.email}</span>
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
                  className="w-full sm:w-1/2 py-2 bg-white border border-red-500 text-red-500 rounded-lg hover:bg-red-700 hover:text-white transition font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </motion.div>
        </main>

        {/* Floating Button */}

        <FloatingAIButton />
        <Footer />
      </ProtectedRoute>
    </>
  );
}
