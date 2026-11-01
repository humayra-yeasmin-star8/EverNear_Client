"use client";
import { authClient } from "@/lib/auth-client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroEventBar from "@/components/HeroEventBar";
import Footer from "@/components/Footer";
import UpcomingEventCard from "@/components/UpcomingEventCard";
import PreviousEventCard from "@/components/PreviousEventCard";
import { EventItem, User } from "@/types/event";
import { fetchEvents } from "@/lib/api";
import { Sparkles, Calendar, Heart, ShieldAlert } from "lucide-react";
import {signUp} from "@/lib/auth-client"; 

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [completedEvents, setCompletedEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  useEffect(() => {
    async function loadAllEvents() {
      try {
        const [upcomingData, completedData] = await Promise.all([
          fetchEvents("upcoming"),
          fetchEvents("completed"),
        ]);
        setUpcomingEvents(upcomingData);
        setCompletedEvents(completedData);
      } catch (err) {
        console.error("Failed to load events from backend", err);
      } finally{
        setLoading(false);
      }
    }
    loadAllEvents();
  }, []);

  return (
    <div className="min-h-screen bg-amber-200 text-slate-900 flex flex-col justify-between">
      {/* --- HERO SECTION CONTAINER --- */}
      <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden shadow-2xl">
        {/* Artwork Image constrained to Hero Section only */}
        <Image
          src="/download.jpg"
          alt="EverNear Hero Cover"
          fill
          priority
          sizes="100vw"
          className="object-center object-fill z-0 px-5 py-5"
        />

      {/* Floating Transparent Navbar */}
<Navbar 
  user={user} 
  onLogin={() => setUser({ id: "user_101", displayName: "Sarah Jenkins", email: "sarah@example.com" })}
  onLogout={() => setUser(null)} 
/>

{/* SECTION 2: Upcoming Events with ID for smooth scrolling */}
<section id="events-section" className="space-y-8 scroll-mt-24">
  {/* ... upcoming events grid ... */}
</section>

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

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-20 w-full">
        {/* SECTION 2: Upcoming Events */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900 text-amber-200 text-xs font-semibold shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Make a Direct Difference
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Community Events
            </h2>
            <p className="text-sm text-slate-700">
              Explore 10 realistic community initiatives coming up in Dhaka. Click to join or save a reminder.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-amber-300/40 animate-pulse border border-amber-400/30" />
              ))}
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="text-center py-12 bg-amber-100/60 rounded-2xl border border-amber-300 p-6">
              <p className="text-sm font-semibold text-slate-800">No upcoming events found.</p>
              <p className="text-xs text-slate-600 mt-1">Make sure your Express server is running on http://localhost:8000 and seed data is populated.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((evt) => (
                <UpcomingEventCard
                  key={evt._id}
                  event={evt}
                  user={user}
                  onRequireAuth={() => setAuthModalOpen(true)}
                />
              ))}
            </div>
          )}
        </section>

        {/* SECTION 3: Completed Events */}
        <section className="space-y-8 pt-8 border-t border-amber-900/10">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Memories We&apos;ve Made Together
            </h2>
            <p className="text-sm md:text-base text-slate-700 font-medium italic">
              &ldquo;Every event leaves behind a story. Explore the moments, people, and memories that made our community stronger.&rdquo;
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-96 rounded-2xl bg-amber-300/40 animate-pulse border border-amber-400/30" />
              ))}
            </div>
          ) : completedEvents.length === 0 ? (
            <div className="text-center py-12 bg-amber-100/60 rounded-2xl border border-amber-300 p-6">
              <p className="text-sm font-semibold text-slate-800">No past memories found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedEvents.map((evt) => (
                <PreviousEventCard key={evt._id} event={evt} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Auth Prompt Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 text-center shadow-2xl border border-amber-500/40 animate-in zoom-in-95">
            <ShieldAlert className="w-12 h-12 text-amber-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">Sign In Required</h3>
            <p className="text-xs text-slate-600">
              Please sign in or log into your account before registering your interest or saving reminders.
            </p>
            <div className="pt-2 space-y-2">
              <button
                onClick={() => {
                  setUser({
                    id: "user_101",
                    displayName: "Sarah Jenkins",
                    email: "sarah@example.com",
                  });
                  setAuthModalOpen(false);
                }}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow"
              >
                Sign In as Guest Demo
              </button>
              <button
                onClick={() => setAuthModalOpen(false)}
                className="w-full py-2 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

  
    </div>
  );
}