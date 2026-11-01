"use client";

import React, { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroEventBar from "@/components/HeroEventBar";
import Footer from "@/components/Footer";
import EventCard from "@/components/events/EventCard";
import { Sparkles, Calendar, Heart} from 'lucide-react'

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
        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center pb-24">
          <div className="bg-slate-950/75 border border-emerald-500/40 p-8 rounded-2xl max-w-xl backdrop-blur-md shadow-2xl">
            <h1 className="text-4xl font-extrabold text-amber-300 mb-3 tracking-tight drop-shadow-[0_0_10px_rgba(250,204,21,0.6)]">
              EverNear Community Hub
            </h1>
            <p className="text-slate-200 text-sm leading-relaxed drop-shadow">
              Community-driven local social service events platform in Dhaka. Join us to make a direct impact.
            </p>
          </div>
        </div>

        {/* Floating Bottom Event Details Bar */}
        <HeroEventBar 
          date="NOV 15 - 17, 2026"
          location="Gulshan Community Center, Dhaka"
          joinedCount={142}
          category="Winter Cloth Drive"
        />

      </section>

      <Footer/>


    </div>
  );
}