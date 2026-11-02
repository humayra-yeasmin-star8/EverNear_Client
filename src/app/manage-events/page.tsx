"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { authClient } from "@/lib/auth-client";
import { EventItem } from "@/types/event";
import Swal from "sweetalert2";
import { Trash2, Edit3, Calendar, MapPin } from "lucide-react";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default function ManageEventsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  // Fetch user's created events (Fixed route path & data.data extraction)
  // Fetch user's created events
  const fetchUserEvents = async (userId: string) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/events/creator/${userId}`
      );

      if (!res.ok) {
        throw new Error("Failed to fetch user events");
      }

      const data = await res.json();
      setEvents(data.data || []);
    } catch (err) {
      console.error("Failed to fetch user events:", err);
    } finally {
      setLoading(false);
    }
  };

  // Protect route and fetch events
  useEffect(() => {
    if (isPending) return;

    if (!session) {
      router.push("/signin");
      setLoading(false);
      return;
    }

    if (session.user) {
      fetchUserEvents(session.user.id);
    }
  }, [session, isPending, router]);

  // Delete event
  const handleDelete = async (eventId: string) => {
    const result = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
          method: "DELETE",
        });

        if (!res.ok) {
          throw new Error("Failed to delete event");
        }

        setEvents((prev) => prev.filter((ev) => ev._id !== eventId));

        Swal.fire(
          "Deleted!",
          "Your event has been deleted.",
          "success"
        );
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Could not delete event.", "error");
      }
    }
  };

  // Update event
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingEvent) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/events/${editingEvent._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editingEvent),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to update event");
      }

      setEvents((prev) =>
        prev.map((ev) =>
          ev._id === editingEvent._id ? editingEvent : ev
        )
      );

      setEditingEvent(null);

      Swal.fire(
        "Updated!",
        "Event updated successfully.",
        "success"
      );
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update event.", "error");
    }
  };

  if (isPending || loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-300">
        Loading managed events...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-28 w-full space-y-8">
        <h1 className="text-3xl font-bold text-amber-300">
          Manage My Events
        </h1>

        {events.length === 0 ? (
          <p className="text-slate-400">
            You haven't created any events yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 shadow"
              >
                <h3 className="text-xl font-bold text-slate-100">
                  {ev.title}
                </h3>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>{ev.date} at {ev.time}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {ev.location}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => setEditingEvent(ev)}
                    className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-amber-500/30"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(ev._id)}
                    className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-red-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-4">
              <h3 className="text-lg font-bold text-amber-300">
                Edit Event
              </h3>

              <form onSubmit={handleUpdate} className="space-y-3">
                <input
                  type="text"
                  value={editingEvent.title}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      title: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-sm text-slate-100"
                />

                <input
                  type="text"
                  value={editingEvent.location}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      location: e.target.value,
                    })
                  }
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-sm text-slate-100"
                />

                <textarea
                  value={editingEvent.description}
                  onChange={(e) =>
                    setEditingEvent({
                      ...editingEvent,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded text-sm text-slate-100"
                />

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded text-xs font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-400 text-slate-950 rounded text-xs font-bold"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}