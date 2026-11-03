
"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut, Menu, X } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: session } = authClient.useSession();
  const user = session?.user ?? null;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setMenuOpen(false);
          router.refresh();
        },
        onError: (ctx) => {
          console.error("Sign out failed:", ctx.error);
        },
      },
    });
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/all-events", label: "All Events" },
    { href: "/about", label: "About Us" },
    { href: "/newsletter", label: "Newsletter" },
    { href: "/#contact", label: "Contact Us" },
  ];

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-4 md:px-9 py-4 md:py-6 bg-transparent">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative w-10 h-10 overflow-hidden rounded-full border border-[#663744] shrink-0">
            <Image
              src="/logo.jpg"
              alt="EverNear Logo"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>

          <span className="text-lg md:text-xl font-serif font-bold tracking-[0.18em] bg-gradient-to-r from-[#4A2633] via-[#663744] to-[#89515E] bg-clip-text text-transparent whitespace-nowrap">
            EVERNEAR
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden lg:flex items-center justify-center gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[#663744] hover:text-[#A66B78] text-sm font-semibold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* DESKTOP AUTHENTICATION */}
        <div className="hidden lg:flex items-center justify-end">
          {user ? (
            <div className="relative group flex items-center">
              <div className="w-10 h-10 rounded-full bg-[#663744] flex items-center justify-center text-white font-bold text-base shadow border border-[#89515E] cursor-pointer">
                {user.name?.[0]?.toUpperCase() ||
                  user.email?.[0]?.toUpperCase() ||
                  "U"}
              </div>

              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-[#663744]/60 rounded-xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-slate-100">
                <div className="space-y-1 pb-3 border-b border-slate-800">
                  <p className="text-sm font-bold text-[#B78C91] truncate">
                    {user.name || "User"}
                  </p>
                  <p className="text-xs text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>

                <div className="py-2 border-b border-slate-800">
                  <Link
                    href="/profile"
                    className="block w-full py-1.5 px-2 text-xs font-semibold text-slate-200 hover:text-[#B78C91] hover:bg-slate-800 rounded-md transition"
                  >
                    Profile
                  </Link>
                </div>

                <div className="pt-3">
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2 px-3 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="px-4 py-2 text-xs font-bold bg-[#663744] hover:bg-[#89515E] text-white rounded-lg transition shadow"
              >
                Sign In
              </Link>

              <Link
                href="/signUp"
                className="px-4 py-2 text-xs font-bold bg-[#f37196] hover:bg-[#663744]/10 text-[#663744] border border-[#663744]/60 rounded-lg transition shadow"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden p-2 text-[#663744] hover:text-[#A66B78] hover:bg-[#663744]/10 rounded-lg transition"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-4 right-4 mt-2 bg-slate-900 border border-[#663744]/60 rounded-xl shadow-2xl p-5 text-slate-100">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold uppercase tracking-wider text-[#B78C91] hover:text-[#D19BA5] transition-colors duration-300"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="border-t border-slate-700 mt-5 pt-5">
            {user ? (
              <div>
                <p className="text-sm font-bold text-[#B78C91]">
                  {user.name || "User"}
                </p>
                <p className="text-xs text-slate-400 mt-1 break-all">
                  {user.email}
                </p>

                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block mt-4 py-2 px-3 text-sm font-semibold text-[#B78C91] hover:text-[#D19BA5] hover:bg-slate-800 rounded-lg"
                >
                  Profile
                </Link>

                <button
                  onClick={handleSignOut}
                  className="w-full mt-2 py-2.5 px-3 text-sm font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <Link
                  href="/signin"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-xs font-bold bg-[#663744] hover:bg-[#89515E] text-white rounded-lg"
                >
                  Sign In
                </Link>

                <Link
                  href="/signUp"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 text-center px-4 py-2.5 text-xs font-bold bg-[#663744] hover:bg-[#89515E] text-white rounded-lg"
                
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
