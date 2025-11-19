"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import clsx from "clsx";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Home", href: "/xenotimes" },
  { label: "Politic", href: "/xenotimes/politic" },
  { label: "Economy", href: "/xenotimes/economy" },
  { label: "Science", href: "/xenotimes/science" },
  { label: "Sports", href: "/xenotimes/sports" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const supabase = createClientComponentClient();

  const router = useRouter();

  // ✅ Fetch user
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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

  // ✅ Check token (localStorage)
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUser(null);
    router.push("/xenotimes/login");
  };

  return (
    <header
      className={clsx(
        "fixed w-full z-50 transition-all duration-500 backdrop-blur-md",
        scrolled
          ? "bg-black/80 shadow-md border-b border-black/40 py-2"
          : "bg-black/80 shadow-md border-b border-black/40 py-4"
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

        {/* === Desktop Buttons === */}
        <div className="hidden md:flex items-center space-x-3">
          {isLoggedIn ? (
            <>
              <Link
                href="/xenotimes/profile"
                className="bg-amber-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-amber-400 transition-all"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="border-2 border-red-500 text-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/xenotimes/register"
                className="px-4 py-1.5 rounded-md border border-amber-500 text-amber-400 hover:bg-amber-500 hover:text-black transition-all duration-300 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
              >
                Register
              </Link>
              <Link
                href="/xenotimes/login"
                className="px-4 py-1.5 rounded-md bg-amber-500 text-black font-semibold hover:bg-amber-400 transition-all duration-300"
              >
                Login
              </Link>
            </>
          )}
        </div>

        {/* === Mobile Toggle === */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden rounded-md p-2 text-gray-200 hover:bg-black/50 transition"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* === Mobile Dropdown (MATCHES DESKTOP) === */}
      <div
        className={clsx(
          "md:hidden overflow-hidden transition-all duration-500 ease-in-out bg-black/90 backdrop-blur-md border-t border-black/40",
          isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-6 py-5 flex flex-col gap-4 text-gray-200">
          {/* Nav Items */}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className="block text-lg font-medium hover:text-amber-400 transition"
            >
              {item.label}
            </Link>
          ))}

          {/* Divider */}
          <hr className="border-amber-500/30 my-2" />

          {/* Auth Buttons (match desktop) */}
          <div className="flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <Link
                  href="/xenotimes/profile"
                  onClick={() => setIsOpen(false)}
                  className="text-center bg-amber-500 text-black font-semibold py-2 rounded-lg hover:bg-amber-400 transition"
                >
                  Profile
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="text-center border-2 border-red-500 text-red-500 font-semibold py-2 rounded-lg hover:bg-red-500 hover:text-white transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/xenotimes/register"
                  onClick={() => setIsOpen(false)}
                  className="text-center border border-amber-500 text-amber-400 font-semibold py-2 rounded-lg hover:bg-amber-500 hover:text-black transition-all duration-300 shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                >
                  Register
                </Link>
                <Link
                  href="/xenotimes/login"
                  onClick={() => setIsOpen(false)}
                  className="text-center bg-amber-500 text-black font-semibold py-2 rounded-lg hover:bg-amber-400 transition-all duration-300"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
