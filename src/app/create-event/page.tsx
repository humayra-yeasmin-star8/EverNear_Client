"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

import { authClient } from "@/lib/auth-client";
import { createEventAction } from "@/lib/actions";
import Swal from "sweetalert2";
import { Sparkles } from "lucide-react";

const initialForm = {
  title: "",
  category: "",
  date: "",
  time: "",
  location: "",
  image: "",
  description: "",
};

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  // Protect route: Redirect to signin if unauthenticated
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/signin");
    }
  }, [session, isPending, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!session?.user) return;

    setLoading(true);

    try {
      // server action: hits POST /events with the token from getTokenSer()
      const data = await createEventAction(form);

      if (data.success) {
        setForm(initialForm);
        Swal.fire({
          icon: "success",
          title: "Event Published!",
          text: "Your initiative has been published successfully.",
          timer: 2000,
          showConfirmButton: false,
        });
        router.push("/manage-events");
      } else {
        Swal.fire({
          icon: "error",
          title: "Submission Failed",
          text: data.message || "Failed to create event.",
          confirmButtonColor: "#b45309",
        });
      }
    } catch (err) {
      console.error("Error creating event:", err);
      Swal.fire({
        icon: "error",
        title: "Network Error",
        text: "Could not reach the server. Make sure backend is running.",
        confirmButtonColor: "#b45309",
      });
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Checking authentication...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-3xl mx-auto px-6 py-28 w-full space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Host an Initiative
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-amber-300">Create an Event</h1>
        </div>

        <div className="bg-slate-900/80 border border-amber-500/30 p-8 rounded-2xl backdrop-blur-md shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                type="text"
                placeholder="Event Title"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <input
                name="category"
                value={form.category}
                onChange={handleChange}
                type="text"
                placeholder="Category (e.g. Winter Cloth Drive)"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="date"
                value={form.date}
                onChange={handleChange}
                type="text"
                placeholder="Date (e.g. DEC 02, 2026)"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <input
                name="time"
                value={form.time}
                onChange={handleChange}
                type="text"
                placeholder="Time (e.g. 02:00 PM)"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                type="text"
                placeholder="Location"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              type="url"
              placeholder="Image URL (Unsplash link)"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Event Description..."
              rows={4}
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-400"
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-lg transition shadow-lg text-sm uppercase tracking-wider disabled:opacity-50"
            >
              {loading ? "Publishing..." : "Publish Event"}
            </button>
          </form>
        </div>
      </main>

      
    </div>
  );
}