
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { EventItem } from "@/types/event";
import EventDetailsClient from "./EventDetailsClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let currentUserId: string | null = null;

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    currentUserId = session?.user?.id ?? null;
  } catch {
    currentUserId = null;
  }

  let event: EventItem | null = null;
  let error: string | null = null;

  try {
    const res = await fetch(`${API_BASE_URL}/events/${id}`, {
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw new Error(json.message || "Event not found");
    }

    event = json.data;
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to load event.";
  }

  return (
    <EventDetailsClient
      eventId={id}
      initialEvent={event}
      fetchError={error}
      currentUserId={currentUserId}
    />
  );
}
