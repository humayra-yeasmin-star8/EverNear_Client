
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

import { EventItem } from "@/types/event";
import { Sparkles, Calendar, MapPin, PlusCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL;

type FilterOption = "default" | "mine" | "interested";

export default function EventsWrapper({
  token,
}: {
  token?: string | null;
}) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [myEventIds, setMyEventIds] = useState<string[]>([]);
  const [interestedEventIds, setInterestedEventIds] = useState<string[]>([]);
  const [filterOption, setFilterOption] = useState<FilterOption>("default");
  const [loadingEvents, setLoadingEvents] = useState(true);


  useEffect(() => {
    let cancelled = false;

    const fetchList = async (path: string, requiresAuth = false) => {
      const headers: HeadersInit = {};

      if (requiresAuth && token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(`${API_BASE_URL}${path}`, {
        headers,
      });

      if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

      const data = await res.json();
      return (Array.isArray(data) ? data : data.data || []) as EventItem[];
    };

    const loadEvents = async () => {
      try {
        const allEvents = await fetchList("/events");

        let creatorEvents: EventItem[] = [];
        let interestedEvents: EventItem[] = [];

        if (token) {
          [creatorEvents, interestedEvents] = await Promise.all([
            fetchList("/events/creator", true).catch(() => [] as EventItem[]),
            fetchList("/events/interested", true).catch(() =>
              fetchList("/events/joined", true).catch(() => [] as EventItem[])
            ),
          ]);
        }

        if (cancelled) return;

        setEvents(allEvents);
        setMyEventIds(creatorEvents.map((event) => event._id));
        setInterestedEventIds(interestedEvents.map((event) => event._id));
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        if (!cancelled) setLoadingEvents(false);
      }
    };

    loadEvents();

    return () => {
      cancelled = true;
    };
  }, [token]);

  const visibleEvents = events.filter((event) => {
    if (filterOption === "mine") return myEventIds.includes(event._id);
    if (filterOption === "interested") return interestedEventIds.includes(event._id);
    return true;
  });

  const emptyMessage =
    filterOption === "mine"
      ? "You haven't created any events yet."
      : filterOption === "interested"
        ? "You haven't joined or shown interest in any events yet."
        : "No community initiatives found yet.";

  return (
    <div className="min-h-scree bg-gradient-to-br from-[#ecce6b] via-[#FDE49A] to-[#F8CE6B] text-gray-950 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-28 space-y-12 w-full flex-1">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-b border-slate-800 pb-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Community Hub
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-amber-800 tracking-tight">
              Explore All Community Initiatives
            </h1>
            <p className="text-sm text-slate-800">
              Browse through all upcoming and past community events hosted across Dhaka.
            </p>
          </div>

          {/* Filter/sort + link to add event */}
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <label
                htmlFor="event-filter"
                className="text-[10px] uppercase tracking-wider font-bold text-slate-800"
              >
                Sort By:
              </label>

              <select
                id="event-filter"
                value={filterOption}
                onChange={(e) => setFilterOption(e.target.value as FilterOption)}
                className="bg-slate-900 border border-slate-700 text-amber-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-amber-400"
              >
                <option value="default">Default</option>
                <option value="mine">My Events</option>
                <option value="interested">Events I&apos;m Interested In</option>
              </select>
            </div>

            <Link
              href="/addEvents"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold rounded-xl transition shadow-lg text-xs uppercase tracking-wider flex items-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" /> Create New Event
            </Link>
          </div>
        </div>

        {/* --- EVENTS GRID SECTION --- */}
        {loadingEvents ? (
          <div className="text-center text-slate-400 py-20 animate-pulse">
            Loading community events...
          </div>
        ) : visibleEvents.length === 0 ? (
          <div className="text-center py-20 space-y-3 bg-slate-900/40 border border-slate-800 rounded-2xl">
            <p className="text-slate-400 text-sm">{emptyMessage}</p>
            {filterOption === "default" && (
              <Link
                href="/addEvents"
                className="inline-block text-amber-300 hover:underline text-xs font-semibold uppercase tracking-wider"
              >
                Be the first to publish one →
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visibleEvents.map((ev) => (
              <div
                key={ev._id}
                className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between hover:border-amber-300/50 transition-all duration-300 group"
              >
                {/* Event Image */}
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={ev.image || "https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=800"}
                    alt={ev.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />

                  {ev.category && (
                    <Badge className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-300 border border-amber-500/30 text-[10px] uppercase font-bold px-2.5 py-1">
                      {ev.category}
                    </Badge>
                  )}
                </div>

                {/* Event Content */}
                <div className="p-6 space-y-3 flex-grow">
                  <h3 className="text-lg font-bold text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {ev.description}
                  </p>

                  <div className="space-y-1.5 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                    {ev.date && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{ev.date} {ev.time ? `• ${ev.time}` : ""}</span>
                      </div>
                    )}
                    {ev.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{ev.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="p-4 bg-slate-950/60 border-t border-slate-800">
                  <Link href={`/events/${ev._id}`}>
                    <button className="w-full py-2.5 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white text-xs font-bold rounded-xl transition uppercase tracking-wider flex items-center justify-center gap-2">
                      View Details & Join
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>


    </div>
  );
}