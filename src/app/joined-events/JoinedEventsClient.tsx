"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { EventItem } from "@/types/event";
import { removeJoinedEventAction } from "@/lib/actions";
import { Calendar, Clock, MapPin, Trash2 } from "lucide-react";
import Swal from "sweetalert2";

interface JoinedEventsClientProps {
  initialEvents: EventItem[];
  fetchError: string | null;
}

export default function JoinedEventsClient({
  initialEvents,
  fetchError,
}: JoinedEventsClientProps) {
  const router = useRouter();

  const [events, setEvents] = useState<EventItem[]>(initialEvents);
  const [sortOption, setSortOption] = useState<"default" | "date" | "time">(
    "default"
  );
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Handle removing a joined event (server action fetches the token itself)
  const handleRemoveJoinedEvent = async (eventId: string) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to remove this event from your joined list?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#b45309",
      cancelButtonColor: "#334155",
      confirmButtonText: "Yes, remove it!",
    });

    if (!confirm.isConfirmed) return;

    setRemovingId(eventId);

    try {
      const data = await removeJoinedEventAction(eventId);

      if (!data.success) {
        throw new Error(data.message || "Could not remove event.");
      }

      // Remove from local state instantly
      setEvents((prev) => prev.filter((ev) => ev._id !== eventId));
      router.refresh();

      Swal.fire({
        icon: "success",
        title: "Removed!",
        text: "Event has been removed from your joined list.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error removing event:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err instanceof Error ? err.message : "Failed to remove event.",
        confirmButtonColor: "#b45309",
      });
    } finally {
      setRemovingId(null);
    }
  };

  // Sort events (derived — React Compiler handles any memoization)
  const sortedEvents = [...events].sort((a, b) => {
    if (sortOption === "date") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }

    if (sortOption === "time") {
      return a.time.localeCompare(b.time);
    }

    return 0;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-6xl mx-auto px-6 py-28 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-amber-300">Joined Events</h1>
            <p className="text-xs text-slate-400 mt-1">
              Events you are currently registered to attend.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-400 font-semibold">
              Sort By:
            </label>

            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(e.target.value as "default" | "date" | "time")
              }
              className="bg-slate-900 border border-slate-700 text-amber-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-amber-400"
            >
              <option value="default">Default</option>
              <option value="date">Event Date</option>
              <option value="time">Time</option>
            </select>
          </div>
        </div>

        {fetchError && (
          <p className="text-red-400 text-sm">{fetchError}</p>
        )}

        {sortedEvents.length === 0 ? (
          <p className="text-slate-400">
            You have not registered for any events yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedEvents.map((ev) => (
              <div
                key={ev._id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4 shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] rounded-md font-bold uppercase">
                      Registered
                    </span>
                    <button
                      onClick={() => handleRemoveJoinedEvent(ev._id)}
                      disabled={removingId === ev._id}
                      className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition disabled:opacity-50"
                      title="Remove from joined events"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <h3 className="text-lg font-bold text-slate-100">
                    {ev.title}
                  </h3>

                  <div className="text-xs text-slate-400 space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-amber-400" />
                      {ev.date}
                    </div>

                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      {ev.time}
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      {ev.location}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

  
    </div>
  );
}
