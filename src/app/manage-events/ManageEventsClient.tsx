"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { EventItem } from "@/types/event";
import { deleteEventAction, updateEventAction } from "@/lib/actions";
import Swal from "sweetalert2";
import { Trash2, Edit3, Calendar, MapPin, ExternalLink } from "lucide-react";
import Link from "next/link";

interface ManageEventsClientProps {
  initialEvents: EventItem[];
  fetchError: string | null;
  currentUserId: string | null;
}

export default function ManageEventsClient({
  initialEvents,
  fetchError,
  currentUserId,
}: ManageEventsClientProps) {
  const router = useRouter();

  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Only the creator of an event may edit or delete it.
  const isOwner = (event: EventItem) =>
    Boolean(currentUserId) && event.creatorId === currentUserId;

  // Delete event (server action fetches the token itself)
  const handleDelete = async (eventId: string) => {
    const target = events.find((ev) => ev._id === eventId);

    if (!target || !isOwner(target)) {
      Swal.fire("Not allowed", "You can only delete events you created.", "error");
      return;
    }

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
      setDeletingId(eventId);

      try {
        const data = await deleteEventAction(eventId);

        if (!data.success) {
          throw new Error(data.message || "Failed to delete event");
        }

        setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
        router.refresh();

        Swal.fire("Deleted!", "Your event has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Could not delete event.", "error");
      } finally {
        setDeletingId(null);
      }
    }
  };

  // Update event (server action fetches the token itself)
  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingEvent) return;

    if (!isOwner(editingEvent)) {
      Swal.fire("Not allowed", "You can only edit events you created.", "error");
      return;
    }

    setUpdating(true);

    try {
      const data = await updateEventAction(editingEvent._id, {
        title: editingEvent.title,
        description: editingEvent.description,
        category: editingEvent.category,
        image: editingEvent.image,
        location: editingEvent.location,
        date: editingEvent.date,
        time: editingEvent.time,
      });

      if (!data.success) {
        throw new Error(data.message || "Failed to update event");
      }

      setEvents((prev) =>
        prev.map((ev) => (ev._id === editingEvent._id ? editingEvent : ev))
      );

      setEditingEvent(null);
      router.refresh();

      Swal.fire("Updated!", "Event updated successfully.", "success");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update event.", "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-28 w-full space-y-8">
        <h1 className="text-3xl font-bold text-amber-300">Manage My Events</h1>

        {fetchError && (
          <p className="text-red-400 text-sm">{fetchError}</p>
        )}

        {events.length === 0 ? (
          <p className="text-slate-400">
            You haven&apos;t created any events yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((ev) => (
              <div
                key={ev._id}
                className="bg-slate-900 border border-slate-800 p-6 rounded-xl space-y-4 shadow"
              >
                <h3 className="text-xl font-bold text-slate-100">{ev.title}</h3>

                <div className="text-xs text-slate-400 space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>
                      {ev.date} at {ev.time}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    {ev.location}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <Link
                    href={`/events/${ev._id}`}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-slate-700"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    View Details
                  </Link>

                  {isOwner(ev) && (
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingEvent(ev)}
                        className="px-3 py-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-amber-500/30"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(ev._id)}
                        disabled={deletingId === ev._id}
                        className="px-3 py-1.5 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-red-500/30 disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        {deletingId === ev._id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Modal */}
        {editingEvent && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-lg w-full space-y-4">
              <h3 className="text-lg font-bold text-amber-300">Edit Event</h3>

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
                    disabled={updating}
                    className="px-4 py-2 bg-amber-400 text-slate-950 rounded text-xs font-bold disabled:opacity-50"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

  
    </div>
  );
}
