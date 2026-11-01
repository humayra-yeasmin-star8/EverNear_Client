
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface EventItem {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  image: string;
  status: string;
  participantCount?: number;
}

interface User {
  id: string;
  displayName: string;
  email: string;
  photoURL?: string;
}

export default function AllEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
    const [user, setUser] = useState<User | null>(null);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    image: "",
    expectedAttendees: 30,
    status: "upcoming",
  });

  // Fetch all events from Express server
  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch("http://localhost:8000/events");

        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }

        const result = await response.json();

        if (result.success && Array.isArray(result.data)) {
          setEvents(result.data);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  // Handle event form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (result.success) {
        alert("Event created successfully!");

        setFormData({
          title: "",
          description: "",
          date: "",
          time: "",
          location: "",
          category: "",
          image: "",
          expectedAttendees: 30,
          status: "upcoming",
        });

        // Fetch updated events
        const updatedResponse = await fetch("http://localhost:8000/events");
        const updatedResult = await updatedResponse.json();

        if (updatedResult.success && Array.isArray(updatedResult.data)) {
          setEvents(updatedResult.data);
        }
      } else {
        alert(result.message || "Failed to create event.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Something went wrong while creating the event.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar
        user={user}
        onLogin={() => {}}
        onLogout={() => setUser(null)}
      />

      <main className="max-w-7xl mx-auto px-6 pt-32 pb-16 space-y-16">

        {/* HEADER SECTION */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-black text-amber-300">
            Explore & Create Events
          </h1>

          <p className="text-slate-400 text-sm">
            Browse all community initiatives or list your own upcoming event below.
          </p>
        </div>

        {/* CREATE EVENT FORM */}
        <section className="bg-slate-900 border border-emerald-500/30 p-8 rounded-2xl shadow-xl max-w-3xl mx-auto">
          <h2 className="text-xl font-bold text-amber-300 mb-6">
            Want to Create an Event?
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
                className="bg-slate-800 border-slate-700 text-white"
              />

              <Input
                type="text"
                placeholder="Category (e.g. Winter Cloth Drive)"
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                type="text"
                placeholder="Date (e.g. DEC 02, 2026)"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
                required
                className="bg-slate-800 border-slate-700 text-white"
              />

              <Input
                type="text"
                placeholder="Time (e.g. 02:00 PM)"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
                required
                className="bg-slate-800 border-slate-700 text-white"
              />

              <Input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
                className="bg-slate-800 border-slate-700 text-white"
              />
            </div>

            <Input
              type="text"
              placeholder="Image URL (Unsplash link)"
              value={formData.image}
              onChange={(e) =>
                setFormData({ ...formData, image: e.target.value })
              }
              required
              className="bg-slate-800 border-slate-700 text-white"
            />

            <textarea
              placeholder="Event Description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              required
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 rounded-md p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-300"
            />

            <Button
              type="submit"
              className="w-full bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold py-3"
            >
              Publish Event
            </Button>
          </form>
        </section>

        {/* EVENTS LIST */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold border-b border-slate-800 pb-3 text-amber-300">
            All Available Events
          </h2>

          {loading ? (
            <p className="text-center text-slate-400">
              Loading events...
            </p>
          ) : events.length === 0 ? (
            <p className="text-center text-slate-400 py-10">
              No events available yet. Create your first event above!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3"
                >
                  <h3 className="text-lg font-bold text-amber-200">
                    {event.title}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="text-xs text-slate-300 font-medium">
                    📍 {event.location}
                  </div>

                  <div className="text-xs text-amber-400 font-semibold">
                    📅 {event.date} at {event.time}
                  </div>

                  <div className="text-xs text-slate-400">
                    Category: {event.category}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
