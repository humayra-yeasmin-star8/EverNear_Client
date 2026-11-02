"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EventItem } from "@/types/event";
import { Sparkles, CheckCircle, AlertCircle, Calendar, Clock, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function AllEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  
  // Form state
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch all events on load
  // Fetch all events on load
  const loadEvents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/events`); // ⚠️ Removed /api
      const data = await res.json();
      setEvents(data.data || []); // ⚠️ Extract the 'data' array from your backend response envelope
    } catch (err) {
      console.error("Failed to fetch events:", err);
    } finally {
      setLoading(false); // Make sure this matches your loading state variable name (loadingEvents)
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  // Handle Event Creation Form Submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const eventData = {
      title: formData.get("title"),
      category: formData.get("category"),
      date: formData.get("date"),
      time: formData.get("time"),
      location: formData.get("location"),
      image: formData.get("image"),
      description: formData.get("description"),
      status: "upcoming",
      participantCount: 0,
    };

   try {
      const res = await fetch(`${API_BASE_URL}/events`, { // ⚠️ Removed /api
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });
  

      if (res.ok) {
        setSuccessMessage("Event published successfully!");
        e.currentTarget.reset(); // Clear the form
        loadEvents(); // Refresh the event list automatically
      } else {
        const errData = await res.json();
        setErrorMessage(errData.message || "Failed to publish event.");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setErrorMessage("Network error. Make sure your backend server is running.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-28 space-y-16 w-full">
        {/* Header Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Community Hub
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-amber-300 tracking-tight">
            Explore & Create Events
          </h1>
          <p className="text-sm text-slate-400 max-w-lg mx-auto">
            Browse all community initiatives or list your own upcoming event below.
          </p>
        </div>

        {/* FEEDBACK MESSAGES */}
        {successMessage && (
          <div className="p-4 bg-emerald-950 border border-emerald-500/40 text-emerald-200 rounded-xl text-sm font-medium flex items-center gap-2 shadow max-w-3xl mx-auto">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-950 border border-rose-500/40 text-rose-200 rounded-xl text-sm font-medium flex items-center gap-2 shadow max-w-3xl mx-auto">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* --- CREATE EVENT FORM --- */}
        <div className="bg-slate-900/80 border border-amber-500/30 p-8 rounded-2xl backdrop-blur-md shadow-2xl max-w-3xl mx-auto w-full">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-amber-300">Want to Create an Event?</h3>
            <p className="text-xs text-slate-400 mt-1">Fill out the details below to publish a new community initiative.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                type="text"
                placeholder="Event Title"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <input
                name="category"
                type="text"
                placeholder="Category (e.g. Winter Cloth Drive)"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="date"
                type="text"
                placeholder="Date (e.g. DEC 02, 2026)"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <input
                name="time"
                type="text"
                placeholder="Time (e.g. 02:00 PM)"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <input
                name="location"
                type="text"
                placeholder="Location"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <input
              name="image"
              type="url"
              placeholder="Image URL (Unsplash link)"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />

            <textarea
              name="description"
              placeholder="Event Description..."
              rows={4}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            ></textarea>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg transition shadow-lg text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {submitting ? "Publishing..." : "Publish Event"}
            </button>
          </form>
        </div>

        {/* --- ALL EVENTS LIST SECTION (Underneath the form) --- */}
        <section className="space-y-6">
          <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-amber-300">All Community Initiatives</h2>
            <span className="text-xs text-slate-400 font-semibold">{events.length} Events Total</span>
          </div>

          {loadingEvents ? (
            <p className="text-center text-slate-400 py-10">Loading events...</p>
          ) : events.length === 0 ? (
            <p className="text-center text-slate-500 py-10">No events found. Be the first to create one above!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {events.map((ev) => (
                <div key={ev._id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
                  <div className="relative h-48 w-full">
                    <Image src={ev.image} alt={ev.title} fill className="object-cover" />
                  </div>
                  <div className="p-5 space-y-3 flex-grow">
                    <Badge className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px]">
                      {ev.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-slate-100">{ev.title}</h3>
                    <div className="space-y-1 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-400" /> {ev.date}</div>
                      <div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-emerald-400" /> {ev.location}</div>
                    </div>
                  </div>
                  <div className="p-5 pt-0">
                    <Link href={`/events/${ev._id}`}>
                      <button className="w-full py-2 bg-slate-800 hover:bg-amber-400 hover:text-slate-950 text-amber-300 text-xs font-bold rounded-lg transition">
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}