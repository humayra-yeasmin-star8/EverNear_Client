"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticipantCard from "@/components/events/ParticipantCard";
import EventGallery from "@/components/events/EventGallery";
import { EventData } from "@/components/events/EventCard";
import {
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
  CheckCircle,
  Bookmark,
  Sparkles,
} from "lucide-react";

export default function EventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [joined, setJoined] = useState<boolean>(false);
  const [reminded, setReminded] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:8000/events/${id}`);
        const json = await res.json();
        if (json.success) {
          setEvent(json.data);
        }
      } catch (err) {
        console.error("Failed to load event details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleJoin = async () => {
    if (joined || !event) return;
    try {
      const res = await fetch("http://localhost:8000/events/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          userId: "demo-user-123",
          userEmail: "demo@evernear.org",
          userName: "Community Volunteer",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setJoined(true);
        setEvent({ ...event, participantCount: event.participantCount + 1 });
        showToast("🎉 Thank you! Your interest has been registered for this drive.");
      } else {
        showToast(json.message || "Failed to join event.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error connecting to server.");
    }
  };

  const handleRemind = async () => {
    if (reminded || !event) return;
    try {
      const res = await fetch("http://localhost:8000/events/remind", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          userId: "demo-user-123",
        }),
      });
      const json = await res.json();
      if (json.success) {
        setReminded(true);
        showToast("🔔 Event saved to your reminders list.");
      } else {
        showToast(json.message || "Reminder already saved.");
      }
    } catch (err) {
      console.error(err);
      showToast("Error saving reminder.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="animate-pulse text-amber-300 text-sm">Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center gap-4">
        <p className="text-slate-400">Event details not found.</p>
        <Link href="/events" className="text-amber-300 underline text-sm">
          Back to Events
        </Link>
      </div>
    );
  }

  const isUpcoming = event.status === "upcoming";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar user={null} onLogout={() => {}} />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl shadow-2xl border border-amber-300 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Main Content */}
      <main className="pt-28 pb-16 px-6 max-w-5xl mx-auto w-full flex-1 space-y-10">
        
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-300 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </button>

        {/* Hero Header Banner */}
        <div className="relative w-full h-[380px] rounded-3xl overflow-hidden border border-emerald-500/30 shadow-2xl">
          <Image src={event.image} alt={event.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="absolute bottom-6 left-6 right-6 space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="bg-slate-950/80 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
                {event.category}
              </span>
              <span className="bg-amber-500/20 border border-amber-400 text-amber-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full backdrop-blur-md">
                {event.status}
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Info Meta Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-900/80 border border-emerald-500/30 p-5 rounded-2xl text-xs">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-amber-300" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Date & Time</span>
              <span className="font-semibold text-white">{event.date} ({event.time})</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Location</span>
              <span className="font-semibold text-white truncate">{event.location}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-amber-300" />
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Participants</span>
              <span className="font-semibold text-white">
                {event.participantCount} {isUpcoming ? "Joined" : "Volunteers"}
              </span>
            </div>
          </div>
        </div>

        {/* View Selection: Upcoming vs Completed */}
        {isUpcoming ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6 bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
              <h2 className="text-xl font-bold text-amber-300">About This Drive</h2>
              <p className="text-slate-300 text-sm leading-relaxed">{event.description}</p>
              
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider pt-4">What to Expect</h3>
              <ul className="list-disc list-inside text-xs text-slate-300 space-y-2">
                <li>On-site briefing and volunteer task distribution by lead coordinators</li>
                <li>Hydration and safety materials provided to all participants</li>
                <li>Digital participation appreciation certificate following the drive</li>
              </ul>
            </div>

            <div className="bg-slate-900 border border-emerald-500/40 p-6 rounded-2xl flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white mb-2">Join This Drive</h3>
                <p className="text-xs text-slate-400">Register your participation to help our coordinators organize tools and supplies.</p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleJoin}
                  disabled={joined}
                  className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all ${
                    joined
                      ? "bg-slate-800 text-emerald-400 border border-emerald-500/40"
                      : "bg-emerald-500 hover:bg-emerald-400 text-slate-950"
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  {joined ? "You're Registered!" : "I'd Love to Join"}
                </button>

                <button
                  onClick={handleRemind}
                  disabled={reminded}
                  className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs uppercase tracking-wider border border-slate-700 flex items-center justify-center gap-2 transition-all"
                >
                  <Bookmark className="w-4 h-4" />
                  {reminded ? "Reminder Saved" : "Remind Me Later"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="bg-slate-900/60 border border-emerald-500/30 p-8 rounded-3xl space-y-4">
              <div className="flex items-center gap-2 text-amber-300 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                Our Day Together • Story From The Community
              </div>
              <h2 className="text-2xl font-bold text-white">How We Came Together</h2>
              <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line italic border-l-2 border-emerald-500 pl-4 py-1">
                {(event as any).story || "Sample story detailing the impactful moments, teamwork, and shared experiences from this community event."}
              </p>
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}