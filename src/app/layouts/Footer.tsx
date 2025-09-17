import Link from "next/link";

const categories = [
  { label: "Politics", href: "/politics" },
  { label: "World", href: "/world" },
  { label: "Economy", href: "/economy" },
  { label: "Science", href: "/science" },
  { label: "Sports", href: "/sports" },
];

const links = [
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
];

export default function Footer() {
  return (
    <footer className="mt-10 border-t border-gray-200 bg-black text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-10 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Logo + Deskripsi */}
        <div>
          <h2 className="text-2xl font-extrabold text-white">NEWSLETTER</h2>
          <p className="mt-3 text-sm text-gray-400">
            Your trusted source for the latest updates in politics, economy,
            science, and more.
          </p>
        </div>

        {/* Kategori */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Categories</h3>
          <ul className="space-y-2 text-sm">
            {categories.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-green-400 transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Links tambahan */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-white">Company</h3>
          <ul className="space-y-2 text-sm">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-green-400 transition"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-700 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} Newsletter. All rights reserved.
      </div>
    </footer>
  );
}
