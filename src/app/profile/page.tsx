"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { authClient } from "@/lib/auth-client";
import {
  LayoutDashboard,
  User as UserIcon,
  Mail,
  Sparkles,
  Edit3,
  ListPlus,
  BookmarkCheck,
  Sun,
  Moon
} from "lucide-react";
import Swal from "sweetalert2";

export default function ProfileDashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [updating, setUpdating] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [imgError, setImgError] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light" | null;
    const initialTheme = savedTheme || "dark";

    document.documentElement.classList.toggle("dark", initialTheme === "dark");

    const frame = requestAnimationFrame(() => setTheme(initialTheme));
    return () => cancelAnimationFrame(frame);
  }, []);

  // Function to toggle between dark and light mode system-wide
  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-amber-300 font-medium">
        Loading dashboard...
      </div>
    );
  }

  const currentUser = session.user;
  const hasValidImage = currentUser.image && currentUser.image.trim() !== "" && !imgError;

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const nameValue = String(new FormData(e.currentTarget).get("name") || "");

      const { error } = await authClient.updateUser({
        name: nameValue,
      });

      if (error) {
        Swal.fire({
          icon: "error",
          title: "Update Failed",
          text: error.message || "Could not update profile.",
          confirmButtonColor: "#b45309",
        });
      } else {
        Swal.fire({
          icon: "success",
          title: "Profile Updated!",
          text: "Your changes have been saved to the database.",
          timer: 2000,
          showConfirmButton: false,
        });
        router.refresh();
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
        confirmButtonColor: "#b45309",
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-between relative bg-yellow-800">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-[2px]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        <Navbar />

        {/* Outer Dashboard Shell */}
        <div className="flex flex-1 pt-20">
          
          {/* --- LEFT HOVER-TO-EXPAND SIDEBAR NAV --- */}
          <aside className="group w-20 hover:w-64 bg-gradient-to-br from-[#073911] via-[#03241f] to-[#011810] border-r border-slate-800/80 backdrop-blur-md flex flex-col py-8 transition-all duration-300 ease-in-out shrink-0 z-20 overflow-hidden shadow-2xl hidden md:flex">
            <div className="flex items-center gap-4 px-5 mb-8 whitespace-nowrap">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <span className="text-sm font-extrabold text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Dashboard Menu
              </span>
            </div>

            <nav className="flex flex-col space-y-2 px-3">
              <a href="/profile" className="flex items-center gap-4 p-3 bg-emerald-800 text-amber-300 rounded-xl transition whitespace-nowrap">
                <UserIcon className="w-5 h-5 shrink-0" />
                <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">My Profile</span>
              </a>
              <a href="/create-event" className="flex items-center gap-4 p-3 text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 rounded-xl transition whitespace-nowrap">
                <Sparkles className="w-5 h-5 shrink-0" />
                <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">Create Event</span>
              </a>
              <a href="/manage-events" className="flex items-center gap-4 p-3 text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 rounded-xl transition whitespace-nowrap">
                <ListPlus className="w-5 h-5 shrink-0" />
                <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">Manage Events</span>
              </a>
              <a href="/joined-events" className="flex items-center gap-4 p-3 text-slate-400 hover:text-amber-300 hover:bg-slate-800/60 rounded-xl transition whitespace-nowrap">
                <BookmarkCheck className="w-5 h-5 shrink-0" />
                <span className="text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">Joined Events</span>
              </a>
            </nav>
          </aside>

          {/* --- MAIN CONTENT AREA --- */}
          <main className="flex-1 max-w-6xl mx-auto px-6 py-10 space-y-10 w-full z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800/80 pb-6 gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-amber-300">
                  Welcome, {currentUser.name || "User"}
                </h1>
                <p className="text-xs text-white mt-0.5">Manage your account settings and preferences</p>
              </div>

              {/* Theme Toggle Button */}
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-amber-500/40 bg-slate-900/90 hover:bg-slate-800 text-amber-300 text-xs font-bold transition-all shadow-md w-fit"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-amber-300" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {/* Profile Details Card Box */}
            <div className="bg-gradient-to-br from-[#00130b] via-[#012914] to-[#011310] border-amber-500/30 rounded-2xl p-8 backdrop-blur-md shadow-2xl space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-amber-400 bg-emerald-800 flex items-center justify-center text-white text-xl font-bold shadow-lg shrink-0">
                    {hasValidImage ? (
                      <Image 
                        src={currentUser.image!} 
                        alt={currentUser.name || "User"} 
                        fill 
                        sizes="64px" 
                        className="object-cover" 
                        onError={() => setImgError(true)}
                      />
                    ) : (
                      <span>{currentUser.name?.[0]?.toUpperCase() || "U"}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">{currentUser.name || "Community Member"}</h3>
                    <p className="text-xs text-slate-400">{currentUser.email}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      key={currentUser.name || ""}
                      defaultValue={currentUser.name || ""}
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</label>
                    <input
                      type="email"
                      value={currentUser.email}
                      readOnly
                      className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:border-amber-400 opacity-70"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-sm font-bold text-slate-200">My Email Address</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-200">{currentUser.email}</p>
                        <p className="text-[11px] text-slate-500">Connected Account</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" /> {updating ? "Saving Changes..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}