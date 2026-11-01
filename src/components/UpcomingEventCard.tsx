
"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EventItem, User } from "@/types/event";
import { joinEvent, saveReminder } from "@/lib/api";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Bell,
  Heart,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Props {
  event: EventItem;
  user: User | null;
  onRequireAuth: () => void;
}

export default function UpcomingEventCard({
  event,
  user,
  onRequireAuth,
}: Props) {
  const [joined, setJoined] = useState(false);
  const [reminded, setReminded] = useState(false);
  const [count, setCount] = useState(event.participantCount || 0);

  const [toastMsg, setToastMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const [loadingAction, setLoadingAction] = useState<
    "join" | "remind" | null
  >(null);

  const showToast = (
    type: "success" | "error",
    text: string
  ) => {
    setToastMsg({ type, text });
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Validate event image URL
  const getImageUrl = (image?: string) => {
    if (!image || typeof image !== "string") {
      return "/event-placeholder.png";
    }

    const trimmedImage = image.trim();

    if (trimmedImage.startsWith("/")) {
      return trimmedImage;
    }

    try {
      const url = new URL(trimmedImage);

      if (url.protocol === "https:" || url.protocol === "http:") {
        return trimmedImage;
      }

      return "/event-placeholder.png";
    } catch {
      return "/event-placeholder.png";
    }
  };

  const [imageSrc, setImageSrc] = useState(() =>
    getImageUrl(event.image)
  );

  const handleJoin = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    if (joined) return;

    setLoadingAction("join");

    try {
      const res = await joinEvent({
        eventId: event._id,
        userId: user.id,
        userEmail: user.email,
        userName: user.displayName,
      });

      if (res.success) {
        setJoined(true);
        setCount((prev) => prev + 1);
        showToast("success", "You've successfully joined this event!");
      } else {
        showToast(
          "error",
          res.message || "Failed to join event."
        );
      }
    } catch {
      showToast("error", "Error connecting to server.");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleRemind = async () => {
    if (!user) {
      onRequireAuth();
      return;
    }

    if (reminded) return;

    setLoadingAction("remind");

    try {
      const res = await saveReminder({
        eventId: event._id,
        userId: user.id,
      });

      if (res.success) {
        setReminded(true);
        showToast("success", "Reminder saved for this event!");
      } else {
        showToast(
          "error",
          res.message || "Failed to save reminder."
        );
      }
    } catch {
      showToast("error", "Error connecting to server.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <Card className="relative overflow-hidden flex flex-col justify-between border border-slate-200/80 bg-white/95 backdrop-blur shadow-lg hover:shadow-xl transition-all duration-300 group">

      {/* Toast Overlay */}
      {toastMsg && (
        <div
          className={`absolute top-3 left-3 right-3 z-30 p-3 rounded-lg text-xs font-semibold flex items-center gap-2 shadow-md animate-in fade-in slide-in-from-top-2 ${
            toastMsg.type === "success"
              ? "bg-emerald-900 text-emerald-100 border border-emerald-500"
              : "bg-rose-900 text-rose-100 border border-rose-500"
          }`}
        >
          {toastMsg.type === "success" ? (
            <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}

          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Header Image & Badges */}
      <div className="relative w-full h-48 overflow-hidden bg-slate-100">
        <Image
          src={imageSrc}
          alt={event.title || "Event image"}
          fill
          onError={() => setImageSrc("/event-placeholder.png")}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white shadow font-medium">
            Upcoming
          </Badge>

          <Badge
            variant="secondary"
            className="bg-slate-900/80 text-amber-300 backdrop-blur"
          >
            {event.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <CardHeader className="p-5 pb-2">
        <h3 className="text-xl font-bold text-slate-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
          {event.title}
        </h3>

        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
          {event.description}
        </p>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-2 text-xs text-slate-700">
        <div className="flex items-center gap-2 text-slate-600">
          <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{event.date}</span>

          <Clock className="w-4 h-4 text-amber-600 shrink-0 ml-2" />
          <span>{event.time}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-600">
          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="truncate">{event.location}</span>
        </div>

        <div className="flex items-center gap-2 text-slate-600 pt-1">
          <Users className="w-4 h-4 text-sky-600 shrink-0" />

          <span>
            <strong className="text-slate-900 font-semibold">
              {count}
            </strong>{" "}
            participating
            {event.expectedParticipants
              ? ` (Expected: ${event.expectedParticipants})`
              : ""}
          </span>
        </div>
      </CardContent>

      {/* Footer CTA Actions */}
      <CardFooter className="p-5 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 bg-slate-50/50">
        <Button
          onClick={handleJoin}
          disabled={joined || loadingAction === "join"}
          className={`w-full text-xs font-medium h-9 ${
            joined
              ? "bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-100"
              : "bg-emerald-700 hover:bg-emerald-800 text-white"
          }`}
        >
          <Heart className="w-3.5 h-3.5 mr-1 fill-current" />
          {loadingAction === "join"
            ? "Joining..."
            : joined
              ? "Joined!"
              : "I'd Love to Join"}
        </Button>

        <Button
          onClick={handleRemind}
          disabled={reminded || loadingAction === "remind"}
          variant="outline"
          className={`w-full text-xs font-medium h-9 ${
            reminded
              ? "bg-amber-100 text-amber-900 border-amber-300"
              : "border-slate-300 text-slate-800 hover:bg-slate-100"
          }`}
        >
          <Bell className="w-3.5 h-3.5 mr-1 text-amber-600" />
          {loadingAction === "remind"
            ? "Saving..."
            : reminded
              ? "Saved"
              : "Remind Me"}
        </Button>

        <div className="col-span-2 pt-1 text-center">
          <Link
            href={`/events/${event._id}`}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 hover:underline inline-flex items-center gap-1"
          >
            View Details &rarr;
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
