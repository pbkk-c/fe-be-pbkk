"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import supabase from "@/lib/db";
import Link from "next/link";
import Navbar from "../layouts/Navbar";
import Footer from "../layouts/Footer";
import { useRouter } from "next/navigation";
// import { useRouter } from "next/router";

interface User {
  id: string;
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
      headers: {
        Authorization: `Bearer ${token}`,
      },
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    route.push('/login');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">User not found or not logged in</p>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <Navbar/>
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
          <div className="flex flex-col items-center">
            <img
              src={
                user.user_metadata?.avatar_url ||
                `https://ui-avatars.com/api/?name=${user.email}&background=random`
              }
              alt="avatar"
              className="w-20 h-20 rounded-full border shadow"
            />
            <h2 className="mt-4 text-xl font-semibold text-gray-800">
              {user.user_metadata?.full_name || "User"}
            </h2>
            <p className="text-gray-500">{user.email}</p>

            <div className="mt-6 w-full space-y-4">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">User ID</span>
                <span className="text-gray-500 text-sm truncate max-w-[180px]">
                  {user.id}
                </span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-700">Joined</span>
                <span className="text-gray-500 text-sm">
                  {new Date(user.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Link
              href="/history"
              className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition text-center"
            >
              View History
            </Link>

          <button
  onClick={() => {
    localStorage.removeItem("token"); // hapus token
    window.location.href = "/login"; // redirect
  }}
  className="mt-6 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
>
  Sign Out
</button>
          </div>
        </div>
      </div>
      <Footer />
    </ProtectedRoute>

  );
}
