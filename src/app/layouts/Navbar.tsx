"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const navItems = [
  { label: "Home", href: "/" },
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

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <header className="w-full border-b border-gray-200 bg-slate-900 text-white">
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
              className="hover:text-[#00A86B] transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side: Profile + Auth */}
        <div className="hidden md:flex items-center space-x-3">
            <Link
              href="/profile"
              className="flex items-center gap-1 text-gray-300 hover:text-[#00A86B] transition"
            >
              <User size={18} />
              <span>Profile</span>
            </Link>

          {!user ? (
            <>
              <Link
                href="/register"
                className="border border-gray-400 text-gray-200 hover:bg-gray-100 hover:text-black px-3 py-1 rounded-md transition"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-white transition"
              >
                Login
              </Link>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white transition"
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
        <div className="md:hidden border-t border-gray-700 bg-slate-900 px-4 py-3 space-y-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block hover:text-[#00A86B] transition"
            >
              {item.label}
            </Link>
          ))}

          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-2 text-gray-300 hover:text-[#00A86B] transition"
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
          )}

          <div className="flex flex-col gap-2 pt-2">
            {!user ? (
              <>
                <Link
                  href="/register"
                  className="border border-gray-400 text-gray-200 hover:bg-gray-100 hover:text-black px-3 py-1 rounded-md text-center transition"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-md text-center text-white transition"
                >
                  Login
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white"
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
