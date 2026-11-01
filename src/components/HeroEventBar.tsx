"use client";

import React from "react";
import { Calendar, MapPin, Users, HeartHandshake } from "lucide-react";

interface EventBarProps {
  date?: string;
  location?: string;
  joinedCount?: number;
  category?: string;
}

export default function HeroEventBar({
  date = "NOV 15 - 17, 2026",
  location = "Gulshan Community Center, Dhaka",
  joinedCount = 142,
  category = "Winter Cloth Drive",
}: EventBarProps) {
  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[90%] max-w-6xl bg-slate-950/85 border border-emerald-500/40 rounded-2xl backdrop-blur-md shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-emerald-500/20 text-white z-20 px-8 py-3">
      
      {/* 1. DATE */}
      <div className="flex items-center gap-4 p-5">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-amber-300">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Upcoming Date
          </span>
          <p className="text-sm font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            {date}
          </p>
        </div>
      </div>

      {/* 2. LOCATION */}
      <div className="flex items-center gap-4 p-5">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-amber-300">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Location
          </span>
          <p className="text-sm font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)] truncate max-w-[200px]">
            {location}
          </p>
        </div>
      </div>

      {/* 3. JOINED COUNT */}
      <div className="flex items-center gap-4 p-5">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-amber-300">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Volunteers Joined
          </span>
          <p className="text-sm font-semibold text-amber-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]">
            {joinedCount} People
          </p>
        </div>
      </div>

      {/* 4. CAUSE / CATEGORY (Chosen option) */}
      <div className="flex items-center gap-4 p-5">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-amber-300">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Event Cause
          </span>
          <p className="text-sm font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            {category}
          </p>
        </div>
      </div>

    </div>
  );
}