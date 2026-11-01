"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  const user = session?.user ?? null;

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.refresh();
        },
        onError: (ctx) => {
          console.error("Sign out failed:", ctx.error);
        },
      },
    });
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-50 px-6 md:px-9 py-6 bg-transparent">
      <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">

        {/* LEFT: LOGO */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center gap-3 justify-between">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border border-amber-400">
              <Image src="/logo.jpg" alt="EverNear Logo" fill className="object-cover" />
            </div>
            <span className="text-xl font-extrabold tracking-wider text-amber-300">EVERNEAR</span>
          </Link>
        </div>

        {/* CENTER: NAVIGATION LINKS */}
        <nav className="flex items-center justify-center gap-3 md:gap-7">
          <Link
            href="/"
            className="text-black hover:text-amber-300 text-[10px] md:text-sm font-semibold uppercase tracking-wider transition-colors"
          >
            Home
          </Link>
          <Link
            href="/all-events"
            className="text-black hover:text-amber-300 text-[10px] md:text-sm font-semibold uppercase tracking-wider transition-colors"
          >
            All Events
          </Link>
          <Link
            href="/schedules"
            className="text-black hover:text-amber-300 text-[10px] md:text-sm font-semibold uppercase tracking-wider transition-colors"
          >
            Schedule
          </Link>
          <Link
            href="/about"
            className="text-black hover:text-amber-300 text-[10px] md:text-sm font-semibold uppercase tracking-wider transition-colors"
          >
            About
          </Link>
        </nav>

        {/* RIGHT: AUTHENTICATION */}
        <div className="flex items-center justify-end gap-2">
          {user ? (
            /* Profile Wrapper with Hover Popover */
            <div className="relative group flex items-center">
              {/* Profile Circle / Avatar */}
              <div className="w-10 h-10 rounded-full bg-emerald-700 flex items-center justify-center text-white font-bold text-base shadow border border-amber-300 cursor-pointer">
                {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
              </div>

              {/* Popover Menu (Shows on group hover) */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-slate-900 border border-amber-500/30 rounded-xl shadow-2xl p-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-slate-100">
                <div className="space-y-1 pb-3 border-b border-slate-800">
                  <p className="text-sm font-bold text-amber-300 truncate">{user.name || "User"}</p>
                  <p className="text-xs text-slate-400 truncate">{user.email}</p>
                </div>
                <div className="py-2 border-b border-slate-800 space-y-1">
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 w-full py-1.5 px-2 text-xs font-semibold text-slate-200 hover:bg-slate-800 rounded-md transition"
                  >
                    Profile Settings
                  </Link>
                </div>
                <div className="pt-3">
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2 px-3 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition shadow text-center flex items-center justify-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* Logged Out State: Show Sign In & Sign Up buttons */
            <div className="flex items-center gap-3">
              <Link
                href="/signin"
                className="px-4 py-2 text-xs font-bold bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-lg transition shadow"
              >
                Sign In
              </Link>
              <Link
                href="/signUp"
                className="px-4 py-2 text-xs font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-400/40 rounded-lg transition shadow"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}