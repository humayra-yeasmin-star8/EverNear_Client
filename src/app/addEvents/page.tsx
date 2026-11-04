
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Swal from "sweetalert2";
import { Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function AddEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const minDate = [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, "0"),
    String(tomorrow.getDate()).padStart(2, "0"),
  ].join("-");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const dateValue = String(formData.get("date") || "");

    if (!dateValue) {
      Swal.fire({
        icon: "error",
        title: "Required Field",
        text: "Please select an event date.",
        confirmButtonColor: "#b45309",
      });
      return;
    }

    const selectedDate = new Date(`${dateValue}T00:00:00`);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (
      Number.isNaN(selectedDate.getTime()) ||
      selectedDate <= currentDate
    ) {
      Swal.fire({
        icon: "error",
        title: "Invalid Date",
        text: "Past dates and today's date are not allowed. Please select a future date.",
        confirmButtonColor: "#b45309",
      });
      return;
    }

    const eventData = {
      title: String(formData.get("title")),
      category: String(formData.get("category")),
      date: dateValue,
      time: String(formData.get("time")),
      location: String(formData.get("location")),
      image: String(formData.get("image")),
      description: String(formData.get("description")),
      status: "upcoming",
      participantCount: 0,
    };

    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        throw new Error("You must be logged in to create an event.");
      }

      const token = data.token;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/events`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(eventData),
        }
      );

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to publish event.");
      }

      setSuccessMessage("Event published successfully!");
      form.reset();

      setTimeout(() => {
        router.push("/manage-events");
      }, 1500);
    } catch (err) {
      console.error("Error creating event:", err);
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating the event."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 py-28 space-y-10 w-full">
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

        <div className="bg-slate-900/80 border border-amber-500/30 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Event Title
                </label>
                <input
                  name="title"
                  type="text"
                  placeholder="e.g. Winter Cloth Drive"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Category
                </label>
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
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Date
                </label>
                <input
                  name="date"
                  type="date"
                  min={minDate}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Time
                </label>
                <input
                  name="time"
                  type="text"
                  placeholder="e.g. 02:00 PM"
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Location
                </label>
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
              <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                Image URL
              </label>
              <input
                name="image"
                type="url"
                placeholder="https://images.unsplash.com/..."
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                Event Description
              </label>
              <textarea
                name="description"
                placeholder="Describe the initiative, goals, and how volunteers can help..."
                rows={4}
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg transition shadow-lg text-sm uppercase tracking-wider disabled:opacity-50 cursor-pointer"
            >
              {loading ? "Publishing Event..." : "Publish Event"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
