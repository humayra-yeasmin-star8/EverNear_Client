"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

import { EventItem } from "@/types/event";
import {
  joinEventAction,
  saveReminderAction,
  updateEventAction,
  deleteEventAction,
} from "@/lib/actions";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Heart,
  Bell,
  CheckCircle,
  Quote,
  Sparkles,
  Award,
  Pencil,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";

interface EventDetailsClientProps {
  eventId: string;
  initialEvent: EventItem | null;
  fetchError: string | null;
  currentUserId: string | null;
}

export default function EventDetailsClient({
  eventId,
  initialEvent,
  fetchError,
  currentUserId,
}: EventDetailsClientProps) {
  const router = useRouter();
  const [event, setEvent] = useState<EventItem | null>(initialEvent);
  const [joined, setJoined] = useState(false);
  const [reminded, setReminded] = useState(false);
  const [joining, setJoining] = useState(false);
  const [reminding, setReminding] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    category: "",
    image: "",
    location: "",
    date: "",
    time: "",
  });

  const handleJoin = async () => {
    if (!event) return;

    setJoining(true);

    try {
      // server action: hits POST /events/join with the token from getTokenSer()
      const data = await joinEventAction(eventId);

      if (data.success) {
        setJoined(true);
        setEvent({ ...event, participantCount: event.participantCount + 1 });
        router.refresh();
        setMessage("You are registered for this event!");
      } else {
        setMessage(data.message || "Failed to join event.");
      }
    } catch {
      setMessage("Error connecting to server.");
    } finally {
      setJoining(false);
    }
  };

  const handleRemind = async () => {
    if (!event) return;

    setReminding(true);

    try {
      // server action: hits POST /events/remind with the token from getTokenSer()
      const data = await saveReminderAction(eventId);

      if (data.success) {
        setReminded(true);
        router.refresh();
        setMessage("Reminder added to your profile!");
      } else {
        setMessage(data.message || data.error || "Failed to save reminder.");
      }
    } catch {
      setMessage("Error connecting to server.");
    } finally {
      setReminding(false);
    }
  };

  
  const isOwner = Boolean(currentUserId) && event?.creatorId === currentUserId;

  const startEditing = () => {
    if (!event) return;

    setEditForm({
      title: event.title ?? "",
      description: event.description ?? "",
      category: event.category ?? "",
      image: event.image ?? "",
      location: event.location ?? "",
      date: event.date ?? "",
      time: event.time ?? "",
    });
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!event || !isOwner) {
      Swal.fire("Not allowed", "You can only edit events you created.", "error");
      return;
    }

    setSaving(true);

    try {
      const data = await updateEventAction(eventId, editForm);

      if (!data.success) {
        throw new Error(data.message || "Failed to update event.");
      }

      
      setEvent({
        ...event,
        ...editForm,
        category: editForm.category as EventItem["category"],
      });
      setIsEditing(false);
      router.refresh();

      Swal.fire({
        icon: "success",
        title: "Event Updated!",
        text: "The event details have been updated.",
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error updating event:", err);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err instanceof Error ? err.message : "Failed to update event.",
        confirmButtonColor: "#b45309",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!event) return;

    if (!isOwner) {
      Swal.fire("Not allowed", "You can only delete events you created.", "error");
      return;
    }

    const confirm = await Swal.fire({
      title: "Delete Event?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#475569",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    setDeleting(true);

    try {
      const data = await deleteEventAction(eventId);

      if (!data.success) {
        throw new Error(data.message || "Failed to delete event.");
      }

      router.push("/all-events");
      router.refresh();
    } catch (err) {
      console.error("Error deleting event:", err);
      Swal.fire({
        icon: "error",
        title: "Delete Failed",
        text: err instanceof Error ? err.message : "Failed to delete event.",
        confirmButtonColor: "#b45309",
      });
      setDeleting(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
        <h2 className="text-2xl font-bold mb-2 text-rose-700">Event Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">
          {fetchError || "Could not retrieve the event story."}
        </p>
        <Link href="/">
          <Button variant="outline" className="gap-2 border-slate-400">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Button>
        </Link>
      </div>
    );
  }

  const isCompleted = event.status === "completed";

  return (
    <div className="min-h-screen bg-amber-200 text-slate-900 flex flex-col justify-between">
      <Navbar />

      <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-10">
        {/* Back button + owner-only actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          

          {isOwner && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-900 hover:bg-amber-950 text-amber-100 text-xs font-bold shadow transition"
              >
                <Pencil className="w-4 h-4" />
                Edit Event
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow transition disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" />
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          )}
        </div>

        {/* SECTION A: Hero Section */}
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-amber-900/30">
          <Image src={event.image} alt={event.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent p-8 flex flex-col justify-end text-white">
            <div className="flex items-center gap-3 mb-3">
              <Badge
                className={
                  isCompleted ? "bg-amber-600 text-white" : "bg-emerald-600 text-white"
                }
              >
                {isCompleted ? "Completed Event Story" : "Upcoming Event"}
              </Badge>
              <Badge variant="outline" className="border-amber-400 text-amber-300">
                {event.category}
              </Badge>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
              {event.title}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-slate-200">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-400" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <span>{event.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-sky-400" />
                <span>{event.participantCount} Participants</span>
              </div>
            </div>
          </div>
        </div>

        {message && (
          <div className="p-4 bg-emerald-900 text-emerald-100 rounded-xl text-sm font-medium flex items-center gap-2 shadow">
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        {/* COMPLETED EVENT SPECIFIC LAYOUT */}
        {isCompleted ? (
          <div className="space-y-12">
            {/* SECTION B: About This Event */}
            <section className="bg-white/90 backdrop-blur rounded-2xl p-8 border border-amber-900/10 shadow-lg space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-amber-600" />
                About This Event
              </h2>
              <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                {event.aboutText ||
                  "This event was organized by EverNear volunteers to bring practical support and joy directly into the heart of our community. Through collaboration, we aimed to address immediate needs while fostering a supportive network."}
              </p>
            </section>

            {/* SECTION C: Our Day Together (Storytelling) */}
            <section className="bg-amber-900 text-amber-50 rounded-2xl p-8 shadow-xl space-y-4 relative overflow-hidden">
              <Quote className="absolute right-4 bottom-4 w-32 h-32 text-amber-800/30 pointer-events-none" />
              <div className="inline-block px-3 py-1 bg-amber-800/80 rounded-full text-xs font-semibold text-amber-200">
                Sample Community Narrative *
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-amber-200">
                {event.storyHeading || "Our Day Together: A Heartfelt Story"}
              </h2>
              <div className="prose prose-invert max-w-none text-amber-100 text-sm md:text-base leading-relaxed space-y-4">
                <p>
                  {event.storyText ||
                    "Early in the morning, under a crisp sky, our team of dedicated community members gathered to prepare for the day. Conversations flowed effortlessly as volunteers unloaded supplies, arranged stations, and welcomed early arrivals. By mid-day, laughter and warmth filled the atmosphere, creating lasting bonds between neighbors of all ages."}
                </p>
              </div>
              <p className="text-xs text-amber-300/70 italic border-t border-amber-800 pt-3">
                * Note: Sample story created for demonstration purposes until full community logs are published.
              </p>
            </section>

            {/* SECTION D: Meet the People */}
            {event.samplePeople && event.samplePeople.length > 0 && (
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    The People Who Made It Special
                  </h2>
                  <p className="text-xs text-slate-600">
                    Sample volunteer reflections & perspectives.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {event.samplePeople.map((person) => (
                    <div
                      key={person.id}
                      className="bg-white/95 rounded-xl p-6 border border-slate-200 shadow-md space-y-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-slate-200 shrink-0">
                          <Image src={person.avatar} alt={person.name} fill className="object-cover" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{person.name}</h4>
                          <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                            {person.role}
                          </span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 italic leading-relaxed">
                        &ldquo;{person.reflection}&rdquo;
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION E: The Impact We Made */}
            {event.impactStats && event.impactStats.length > 0 && (
              <section className="bg-white/90 backdrop-blur rounded-2xl p-8 border border-slate-200 shadow-lg space-y-6">
                <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-600" />
                  The Impact We Made
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {event.impactStats.map((stat, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-50 p-4 rounded-xl text-center border border-amber-200/60"
                    >
                      <div className="text-2xl md:text-3xl font-extrabold text-amber-900">
                        {stat.value}
                      </div>
                      <div className="text-xs font-semibold text-slate-600 mt-1">
                        {stat.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* SECTION F: Event Gallery */}
            {event.gallery && event.gallery.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-2xl font-extrabold text-slate-900">Event Moments</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {event.gallery.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative h-44 rounded-xl overflow-hidden shadow border border-slate-200"
                    >
                      <Image src={imgUrl} alt={`Moments ${i + 1}`} fill className="object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          /* UPCOMING EVENT SPECIFIC LAYOUT */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8 bg-white/95 rounded-2xl p-8 border border-slate-200 shadow-lg">
              <div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">Event Overview</h2>
                <p className="text-sm text-slate-700 leading-relaxed">{event.description}</p>
              </div>

              {event.objectives && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">Objectives</h3>
                  <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                    {event.objectives.map((obj, index) => (
                      <li key={index}>{obj}</li>
                    ))}
                  </ul>
                </div>
              )}

              {event.whatToExpect && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">What Participants Will Do</h3>
                  <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                    {event.whatToExpect.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {event.whoCanJoin && (
                <div>
                  <h3 className="text-base font-bold text-slate-900 mb-1">Who Can Participate</h3>
                  <p className="text-xs text-slate-700">{event.whoCanJoin}</p>
                </div>
              )}
            </div>

            {/* CTA Sticky Sidebar */}
            <div className="bg-amber-900 text-amber-50 rounded-2xl p-6 border border-amber-950 shadow-xl space-y-6 h-fit">
              <div>
                <h3 className="text-lg font-bold text-amber-200">Join This Event</h3>
                <p className="text-xs text-amber-100/80 mt-1">
                  Be a part of positive change in Dhaka.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  onClick={handleJoin}
                  disabled={joined || joining}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
                >
                  <Heart className="w-4 h-4 mr-2 fill-current" />
                  {joined ? "You are Registered" : joining ? "Joining..." : "I'd Love to Join"}
                </Button>

                <Button
                  onClick={handleRemind}
                  disabled={reminded || reminding}
                  variant="outline"
                  className="w-full border-amber-400 text-amber-200 hover:bg-amber-800 hover:text-white font-bold h-11"
                >
                  <Bell className="w-4 h-4 mr-2 text-amber-400" />
                  {reminded ? "Reminder Set" : reminding ? "Saving..." : "Remind Me Later"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION G: Back to Events Button */}
        <div className="pt-6 text-center">
          <Link href="/all-events">
            <Button className="bg-amber-900 hover:bg-amber-950 text-amber-100 px-6 font-bold">
              Back to Events
            </Button>
          </Link>
        </div>
      </main>

      {/* Owner-only Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-amber-300">Edit Event</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                    Title
                  </label>
                  <input
                    type="text"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, category: e.target.value }))
                    }
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                    Date
                  </label>
                  <input
                    type="text"
                    value={editForm.date}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, date: e.target.value }))
                    }
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                    Time
                  </label>
                  <input
                    type="text"
                    value={editForm.time}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, time: e.target.value }))
                    }
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                    Location
                  </label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Image URL
                </label>
                <input
                  type="url"
                  value={editForm.image}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, image: e.target.value }))
                  }
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-200 uppercase tracking-wider">
                  Description
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, description: e.target.value }))
                  }
                  rows={4}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
    </div>
  );
}
