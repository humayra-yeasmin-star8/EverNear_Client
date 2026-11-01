"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EventCard, { EventData } from "@/components/events/EventCard";
import { Sparkles, Calendar, Heart } from "lucide-react";

export default function EventsPage() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/events");
      const json = await res.json();
      if (json.success) {
        setEvents(json.data);
      }
    } catch (err) {
      console.error("Error fetching events from server:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const upcomingEvents = events.filter((e) => e.status === "upcoming");
  const completedEvents = events.filter((e) => e.status === "completed");

  const categories = [
    "All",
    "Community Volunteering",
    "Helping Underprivileged Children",
    "Food Distribution",
    "Tree Plantation",
    "Environmental Cleanup",
  ];

  const filteredUpcoming =
    selectedCategory === "All"
      ? upcomingEvents
      : upcomingEvents.filter((e) => e.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar user={null} onLogout={() => {}} />

      <div className="relative pt-32 pb-20 px-6 border-b border-emerald-500/20 bg-gradient-to-b from-emerald-950/30 to-slate-950">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Together For Greater Good
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            EverNear <span className="text-amber-300">Community Drives</span>
          </h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Discover upcoming volunteering initiatives, sign up to contribute, or read touching memories and real impact stories created by our community volunteers across Dhaka.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-1">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-10 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-3 bg-slate-900/80 p-1.5 rounded-2xl border border-emerald-500/30">
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "upcoming" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-300 hover:text-amber-300"
              }`}
            >
              <Calendar className="w-4 h-4" />
              Upcoming Events ({upcomingEvents.length})
            </button>

            <button
              onClick={() => setActiveTab("completed")}
              className={`px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                activeTab === "completed" ? "bg-emerald-500 text-slate-950 shadow-md" : "text-slate-300 hover:text-amber-300"
              }`}
            >
              <Heart className="w-4 h-4" />
              Memories We have Made ({completedEvents.length})
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20 text-slate-400 animate-pulse">Loading events...</div>
        ) : activeTab === "upcoming" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUpcoming.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {completedEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}