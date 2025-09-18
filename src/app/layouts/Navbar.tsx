"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search } from "lucide-react";

const navItems = [
  { label: "Politics", href: "/politics" },
  { label: "World", href: "/world" },
  { label: "Economy", href: "/economy" },
  { label: "Science", href: "/science" },
  { label: "Sports", href: "/sports" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

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

        {/* Search Bar */}
        <div className="hidden md:flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search..."
            className="rounded-md px-3 py-1 text-black focus:outline-none"
          />
          <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-white flex items-center">
            <Search size={16} />
          </button>
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
          <div className="flex items-center space-x-2 pt-2">
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md px-3 py-1 text-black focus:outline-none"
            />
            <button className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded-md text-white flex items-center">
              <Search size={16} />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
