"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Sparkles, CheckCircle, AlertCircle } from "lucide-react";

export default function AddEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
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
      const res = await fetch("http://localhost:8000/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (res.ok) {
        setSuccessMessage("Event published successfully! Redirecting to events...");
        setTimeout(() => {
          router.push("/all-events");
        }, 1500);
      } else {
        const errData = await res.json();
        setErrorMessage(errData.message || "Failed to publish event.");
      }
    } catch (err) {
      console.error("Error creating event:", err);
      setErrorMessage("Network error. Make sure your backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-28 space-y-10 w-full">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Community Initiative Creator
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-300 tracking-tight">
            Create a New Event
          </h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            Fill out the details below to list your initiative and rally volunteers in Dhaka.
          </p>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="p-4 bg-emerald-950 border border-emerald-500/40 text-emerald-200 rounded-xl text-sm font-medium flex items-center gap-2 shadow">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 bg-rose-950 border border-rose-500/40 text-rose-200 rounded-xl text-sm font-medium flex items-center gap-2 shadow">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-slate-900/80 border border-amber-500/30 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">Event Title</label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Winter Cloth Drive"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">Category</label>
                <input
                  name="category"
                  type="text"
                  placeholder="e.g. Community Support"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">Date</label>
                <input
                  name="date"
                  type="text"
                  placeholder="e.g. DEC 02, 2026"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">Time</label>
                <input
                  name="time"
                  type="text"
                  placeholder="e.g. 02:00 PM"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">Location</label>
                <input
                  name="location"
                  type="text"
                  placeholder="e.g. Gulshan, Dhaka"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">Image URL</label>
              <input
                name="image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">Event Description</label>
              <textarea
                name="description"
                placeholder="Describe the initiative, goals, and how volunteers can help..."
                rows={4}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg transition shadow-lg text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? "Publishing Event..." : "Publish Event"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}