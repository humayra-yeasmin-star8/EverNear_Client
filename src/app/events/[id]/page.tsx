"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { EventItem, User } from "@/types/event";
import { fetchEventById, joinEvent, saveReminder } from "@/lib/api";
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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function EventDetailsPage() {
  const { id } = useParams() as { id: string };
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>({
    id: "user_101",
    displayName: "Sarah Jenkins",
    email: "sarah@example.com",
  });

  const [joined, setJoined] = useState(false);
  const [reminded, setReminded] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await fetchEventById(id);
        setEvent(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load event.");
      } finally {
        setLoading(false);
      }
    }
    if (id) loadEvent();
  }, [id]);

  const handleJoin = async () => {
    if (!user || !event) return;
    const res = await joinEvent({
      eventId: event._id,
      userId: user.id,
      userEmail: user.email,
      userName: user.displayName,
    });
    if (res.success) {
      setJoined(true);
      setEvent({ ...event, participantCount: event.participantCount + 1 });
      setMessage("You are registered for this event!");
    } else {
      setMessage(res.message);
    }
  };

  const handleRemind = async () => {
    if (!user || !event) return;
    const res = await saveReminder({ eventId: event._id, userId: user.id });
    if (res.success) {
      setReminded(true);
      setMessage("Reminder added to your profile!");
    } else {
      setMessage(res.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
        <Sparkles className="w-8 h-8 text-amber-600 animate-spin mb-3" />
        <p className="text-sm font-semibold">Loading story details...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-amber-100 flex flex-col items-center justify-center p-6 text-slate-800 font-sans">
        <h2 className="text-2xl font-bold mb-2 text-rose-700">Event Not Found</h2>
        <p className="text-sm text-slate-600 mb-6">{error || "Could not retrieve the event story."}</p>
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
    <Navbar
  user={user}
  onLogin={() => {}}
  onLogout={() => setUser(null)}
/>

      <main className="max-w-5xl mx-auto w-full px-4 py-8 space-y-10">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 hover:text-amber-950 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>

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
                  disabled={joined}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11"
                >
                  <Heart className="w-4 h-4 mr-2 fill-current" />
                  {joined ? "You are Registered" : "I'd Love to Join"}
                </Button>

                <Button
                  onClick={handleRemind}
                  disabled={reminded}
                  variant="outline"
                  className="w-full border-amber-400 text-amber-200 hover:bg-amber-800 hover:text-white font-bold h-11"
                >
                  <Bell className="w-4 h-4 mr-2 text-amber-400" />
                  {reminded ? "Reminder Set" : "Remind Me Later"}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* SECTION G: Back to Events Button */}
        <div className="pt-6 text-center">
          <Link href="/">
            <Button className="bg-amber-900 hover:bg-amber-950 text-amber-100 px-6 font-bold">
              Back to Events
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}