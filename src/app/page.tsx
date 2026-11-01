"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function Home() {
  const [user, setUser] = useState<{
    displayName: string;
    email: string;
    photoURL?: string;
  } | null>(null);

  return (
    <div className="min-h-screen bg-amber-200 background-blend-mode: normal text-slate-900 flex flex-col justify-between">
      
      {/* --- HERO SECTION CONTAINER --- */}
      <section className="relative w-full h-[85vh] min-height: 600px overflow-hidden shadow-2xl">
        
        {/* Artwork Image constrained to Hero Section only */}
        <Image
          src="/download.jpg"
          alt="EverNear Hero Cover"
          fill
          priority
          className="object-center object-fill z-0 px-5 py-5"
        />

        {/* Floating Transparent Navbar */}
        <Navbar user={user} onLogout={() => setUser(null)} />

        {/* Hero Content Overlay */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-6">
          <div className="text-center bg-slate-950/75 border border-emerald-500/40 p-8 rounded-2xl max-w-xl backdrop-blur-md shadow-2xl">
            <h1 className="text-4xl font-extrabold text-amber-300 mb-3 tracking-tight">
              EverNear Community Hub
            </h1>
            <p className="text-slate-200 text-sm leading-relaxed">
              Community-driven local social service events platform in Dhaka.
            </p>
          </div>
        </div>

      </section>

      {/* --- REST OF THE PAGE (WHITE / LIGHT CANVAS BELOW HERO) --- */}
      <main className="max-w-7xl mx-auto px-6 py-16 w-full">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Upcoming Social Drives</h2>
        <p className="text-slate-600">Events grid content will be loaded here...</p>
      </main>

    </div>
  );
}