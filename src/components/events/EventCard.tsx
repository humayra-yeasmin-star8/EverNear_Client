"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Users, ArrowRight } from "lucide-react";

export interface EventData {
  _id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  location: string;
  date: string;
  time: string;
  status: "upcoming" | "completed";
  expectedParticipants?: number;
  participantCount: number;
}

interface EventCardProps {
  event: EventData;
}

export default function EventCard({ event }: EventCardProps) {
  const isUpcoming = event.status === "upcoming";

  return (
    <div className="group bg-slate-900/90 border border-emerald-500/30 rounded-2xl overflow-hidden hover:border-amber-300/60 hover:shadow-2xl hover:shadow-emerald-500/10 transition-all duration-300 flex flex-col justify-between">
      
      {/* Top Image & Badge Header */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {event.category}
        </span>

        {/* Status Badge */}
        <span
          className={`absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full backdrop-blur-md border ${
            isUpcoming
              ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
              : "bg-amber-500/20 border-amber-400 text-amber-300"
          }`}
        >
          {isUpcoming ? "Upcoming" : "Completed"}
        </span>
      </div>

      {/* Card Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-2">
            {event.title}
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
            {event.description}
          </p>
        </div>

        {/* Event Details (Date, Location, Participants) */}
        <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate">{event.date} • {event.time}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>

          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-300 shrink-0" />
            <span>
              {isUpcoming
                ? `${event.participantCount} / ${event.expectedParticipants || 100} Joined`
                : `${event.participantCount} Volunteers Participated`}
            </span>
          </div>
        </div>
      </div>

      {/* Footer Action Bar */}
      <div className="p-4 bg-slate-950/60 border-t border-slate-800 flex items-center justify-between gap-3">
        <Link
          href={`/events/${event._id}`}
          className="w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-emerald-800/40 border border-emerald-500/30 text-white hover:text-amber-300 font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          {isUpcoming ? "View Details & Join" : "Read Their Story"}
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}