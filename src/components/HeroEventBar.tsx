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
  location = "Gulshan Community Center, Dhaka",
  joinedCount = 142,
  category = "Winter Cloth Drive",
}: EventBarProps) {
  
  // Helper to dynamically calculate today's date range (e.g., "NOV 03 - 05, 2026")
  const getDynamicDate = () => {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + 2); // 3-day event window

    const options: Intl.DateTimeFormatOptions = { month: "short", day: "2-digit" };
    const startStr = today.toLocaleDateString("en-US", options).toUpperCase();
    const endStr = endDate.getDate();
    const year = today.getFullYear();

    return `${startStr} - ${endStr}, ${year}`;
  };

  const dynamicDate = getDynamicDate();

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl bg-slate-950/85 border border-emerald-500/40 rounded-2xl backdrop-blur-md shadow-2xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-emerald-500/20 text-white z-20 px-8 py-3">
      
      {/* 1. DYNAMIC DATE */}
      <div className="flex items-center gap-4 p-5">
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-amber-300">
          <Calendar className="w-6 h-6" />
        </div>
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
            Active Today
          </span>
          <p className="text-sm font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]">
            {dynamicDate}
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

      {/* 4. CAUSE / CATEGORY */}
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