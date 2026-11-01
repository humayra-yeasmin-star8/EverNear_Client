"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { EventItem } from "@/types/event";
import { Calendar, MapPin, Users, HeartHandshake } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  event: EventItem;
}

export default function PreviousEventCard({ event }: Props) {
  // Fallback image if event.image is missing or empty string
  const imageUrl =
    event?.image && event.image.trim() !== ""
      ? event.image
      : "https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&w=800&q=80";

  return (
    <Card className="overflow-hidden flex flex-col justify-between border border-amber-900/20 bg-amber-50/40 backdrop-blur shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative w-full h-52 overflow-hidden bg-slate-900">
        <Image
          src={imageUrl}
          alt={event?.title || "Event image"}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          unoptimized // Prevents Next.js optimization blocks if domains aren't added yet
          className="object-cover opacity-90 group-hover:scale-105 group-hover:opacity-100 transition-all duration-500"
        />
        <div className="absolute top-3 left-3 z-10">
          <Badge className="bg-amber-950/90 text-amber-300 border border-amber-500/30">
            {event?.category || "Completed"}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-5 pb-2">
        <h3 className="text-xl font-bold text-slate-900 group-hover:text-amber-800 transition-colors">
          {event?.title}
        </h3>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-3 text-xs text-slate-700">
        <div className="flex flex-wrap gap-y-1 gap-x-4 text-slate-600">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-700" />
            <span>{event?.date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span className="truncate max-w-[150px]">{event?.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-sky-700" />
            <span>{event?.participantCount ?? event?.expectedAttendees ?? 0} People Joined</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 italic border-l-2 border-amber-600/50 pl-3 py-0.5 leading-relaxed">
          &ldquo;{event?.description}&rdquo;
        </p>
      </CardContent>

      <CardFooter className="p-5 pt-2">
        <Link href={`/events/${event?._id}`} className="w-full">
          <button className="w-full text-xs font-semibold py-2 px-4 rounded-lg bg-amber-900 hover:bg-amber-950 text-amber-100 transition-colors flex items-center justify-center gap-2 shadow">
            <HeartHandshake className="w-4 h-4 text-amber-300" />
            Read Their Story
          </button>
        </Link>
      </CardFooter>
    </Card>
  );
}