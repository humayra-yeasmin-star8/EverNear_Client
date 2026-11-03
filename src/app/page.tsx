"use client";
import confetti from "canvas-confetti";
import { authClient } from "@/lib/auth-client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import HeroEventBar from "@/components/HeroEventBar";
import Footer from "@/components/Footer";
import UpcomingEventCard from "@/components/UpcomingEventCard";
import PreviousEventCard from "@/components/PreviousEventCard";
import { EventItem } from "@/types/event";
import { fetchEvents } from "@/lib/api";
import { Sparkles, ShieldAlert } from "lucide-react";

export default function Home() {
  const handleDonateClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }, // Triggers near the middle-lower section
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6'], // Matching festive colors
    });
  };
  const { data: session } = authClient.useSession();

  // Dynamically map session user to navbar format
  const user = session?.user
    ? {
        id: session.user.id,
        displayName: session.user.name || "User",
        email: session.user.email,
      }
    : null;

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
      } finally {
        setLoading(false);
      }
    }
    loadAllEvents();
  }, []);

  return (
    <div className="min-h-screen bg-amber-200 text-slate-900 flex flex-col justify-between">
      {/* --- HERO SECTION CONTAINER --- */}
      <section className="relative w-full h-[85vh] min-h-[600px] overflow-hidden shadow-2xl">
        {/* Hero Cover Image using object-cover to prevent stretching */}
        <Image
          src="/download.jpg"
          alt="EverNear Hero Cover"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center z-0"
        />

        {/* Floating Transparent Navbar */}
        <Navbar />

        {/* Hero Content Overlay */}
        <section className="text-center space-y-4 py-8 px-5 md:px-11 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
  <h1 className="text-3xl md:text-5xl font-serif italic font-extrabold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent tracking-wide drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)]">
    &ldquo;Bringing hearts closer, one shared moment at a time.&rdquo;
  </h1>
</section>
        

        {/* Floating Bottom Event Details Bar */}
        {upcomingEvents.length > 0 && (
  <HeroEventBar
    date={upcomingEvents[0].date || "NOV 18, 2026"}
    location={upcomingEvents[0].location || "Mirpur 10 Community Center, Dhaka"}
    joinedCount={upcomingEvents[0].participantCount || 42}
    category={upcomingEvents[0].category || "Food Distribution"}
  />
)}
      </section>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="max-w-7xl mx-auto px-4 py-16 space-y-20 w-full">
        {/* SECTION 2: Upcoming Events */}
        <section id="events-section" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-900 text-amber-200 text-xs font-semibold shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Make a Direct Difference
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              Upcoming Community Events
            </h2>
            <p className="text-sm text-slate-700">
              Explore realistic community initiatives coming up in Dhaka. Click to join or save a reminder.
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
              <p className="text-xs text-slate-600 mt-1">
                Make sure your backend server is running and seed data is populated.
              </p>
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
        <section className="max-w-md mx-auto px-15 py-9 rounded-4xl bg-white/80 dark:bg-slate-900/80 border border-amber-400/30 backdrop-blur-md shadow-xl text-center space-y-3 transition-colors duration-300">
          {/* Animated Emoji Icon */}
          <div className="w-20 h-14 mx-auto rounded-full bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-3xl shadow-inner animate-bounce">
            🤝
          </div>

          {/* Text Content */}
          <h3 className="text-xl font-black text-amber-600 dark:text-amber-300 uppercase tracking-wide">
            Keep Donating 🎁
          </h3>

          <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Your generosity fuels our community events and brings unforgettable moments closer to everyone.
          </p>

          {/* Action Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleDonateClick}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-500 text-slate-950 rounded-xl shadow-lg transition-transform active:scale-95 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Donate Now</span>
              <span>💖</span>
            </button>
          </div>
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
              <a
                href="/signin"
                className="block w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition shadow"
              >
                Go to Sign In
              </a>
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

     <Footer />
    </div>
  );
}
  