"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, User } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import clsx from "clsx";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Politic", href: "/politic" },
  { label: "Economy", href: "/economy" },
  { label: "Science", href: "/science" },
  { label: "Sports", href: "/sports" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClientComponentClient();

    const [isLoggedIn, setIsLoggedIn] = useState(false);

    
    // ✅ Fetch user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, [supabase]);

  // ✅ Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // const handleLogout = async () => {
  //   await supabase.auth.signOut();
  //   setUser(null);
  //   window.location.href = "/login";
  // };
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token); // true kalau token ada
    console.log("Token:", token); // Debug: cek token di console
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <header
    className={clsx(
      "fixed w-full z-50 transition-all duration-500 backdrop-blur-md",
        scrolled
          ? "bg-slate-900/80 shadow-md border-b border-slate-700/40 py-2"
          : "bg-slate-900/80 shadow-md border-b border-slate-700/40 py-4"
      )}
    >
      <div className="mx-auto flex max-w-[90%] items-center justify-between px-4">
        {/* === Logo === */}
        <Link
          href="/"
          className="text-2xl font-extrabold tracking-tight text-white hover:text-amber-400 transition"
        >
          XenoTimes
        </Link>

        {/* === Desktop Nav === */}
        <nav className="hidden md:flex space-x-6 text-sm font-medium">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative group text-gray-200 hover:text-white transition"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-amber-500 transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* === Right Side === */}
        <div className="hidden md:flex items-center space-x-3">
                       {isLoggedIn ? (
          <>
            <Link
              href="/profile"
              className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-400 transition-all"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-transparent border-2 border-red-500 text-red-500 font-semibold px-4 py-2 rounded-lg font-medium hover:bg-red-500 hover:text-white transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <>
           <Link
                href="/register"
                className="px-4 py-1.5 rounded-md border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black transition-all duration-300 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-md bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-all duration-300"
              >
                Login
              </Link>
              </>
        )}
          {/* {user ? (
            <>
              <Link
                href="/profile"
                className="flex items-center gap-1 text-gray-200 hover:text-amber-400 transition"
              >
                <User size={18} />
                <span>Profile</span>
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white transition-all duration-300"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-md border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black transition-all duration-300 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
              >
                Register
              </Link>
              <Link
                href="/login"
                className="px-4 py-1.5 rounded-md bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-all duration-300"
              >
                Login
              </Link>
            </>
          )} */}
        </div>

        {/* === Mobile Toggle === */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded-md p-2 text-gray-200 hover:bg-slate-800 transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === Mobile Dropdown === */}
      <div
        className={clsx(
          "md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-slate-900/90 backdrop-blur-md border-t border-slate-700/40",
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 py-4 flex flex-col gap-3 text-gray-200">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block hover:text-amber-400 transition"
            >
              {item.label}
            </Link>
          ))}

          {user && (
            <Link
              href="/profile"
              className="flex items-center gap-2 text-gray-300 hover:text-amber-400 transition"
            >
              <User size={18} />
              <span>Profile</span>
            </Link>
          )}

          <div className="flex flex-col gap-2 pt-2">
             {isLoggedIn ? (
          <>
            <Link href="/profile" className="font-semibold">
              Profile
            </Link>
            <button onClick={handleLogout} className="text-red-500 font-semibold">
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="font-semibold">
            Login
          </Link>
        )}
            {/* {!user ? (
              <>
                <Link
                  href="/register"
                  className="border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black px-3 py-1 rounded-md text-center transition"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="bg-amber-500 hover:bg-amber-400 px-3 py-1 rounded-md text-center text-black font-semibold transition"
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
            )} */}
          </div>
        </div>
      </div>
    </header>
  );
}
