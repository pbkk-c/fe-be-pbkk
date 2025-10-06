"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const navItems = [
  { label: "Politics", href: "/politics" },
  { label: "World", href: "/world" },
  { label: "Economy", href: "/economy" },
  { label: "Science", href: "/science" },
  { label: "Sports", href: "/sports" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const supabase = createClientComponentClient();

  useEffect(() => {
  const getUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    setUser(user);
  };

  // pertama kali ambil user
  getUser();

  // listen perubahan auth
  const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  // cleanup listener
  return () => {
    listener.subscription.unsubscribe();
  };
}, [supabase]);


  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <header className="w-full border-b border-gray-200 bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/" className="text-2xl font-extrabold tracking-tight">
          XenoTimes
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hover:text-green-400 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          {!user ? (
            <>
              <Link
                href="/register"
                className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-white"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-white"
              >
                Login
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white"
            >
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded-md p-2 hover:bg-gray-800"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-700 bg-black px-4 py-3 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block hover:text-green-400 transition"
            >
              {item.label}
            </Link>
          ))}

          <div className="flex flex-col gap-2 pt-2">
            {!user ? (
              <>
                <Link
                  href="/register"
                  className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-center text-white"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-md text-center text-white"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
