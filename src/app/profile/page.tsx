"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import supabase from "@/lib/db";
import Link from "next/link";

export default function Home() {
    const user = {
    id: "123e4567-e89b-12d3-a456-426614174000",
    email: "johndoe@example.com",
    full_name: "John Doe",
    created_at: "2025-01-10T12:34:56Z",
    user_metadata: {
      full_name: "John Doe",
      avatar_url: "https://example.com/avatar.jpg",
    },
  };
  // const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   const getUser = async () => {
  //     const { data } = await supabase.auth.getUser();
  //     setUser(data.user);
  //   };
  //   getUser();
  // }, []);

  // if (!user) {
  //   return (
  //     <div className="flex items-center justify-center min-h-screen">
  //       <p className="text-gray-600">Loading profile...</p>
  //     </div>
  //   );
  // }

  
  return (
    <ProtectedRoute>

   <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <div className="flex flex-col items-center">
          <img
            src={`https://ui-avatars.com/api/?name=${user.email}&background=random`}
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
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/login";
            }}
            className="mt-6 w-full py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
