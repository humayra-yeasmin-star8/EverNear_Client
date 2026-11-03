import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getTokenSer } from "@/lib/getTokenSer";
import { EventItem } from "@/types/event";
import EventDetailsClient from "./EventDetailsClient";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export default async function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  
  const token = await getTokenSer();
  // if (!token) {
  //   redirect("/signin");
  // }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUserId = "6aea1023e12702a044201947";

  let event: EventItem | null = null;
  let error: string | null = null;

  try {
    // GET /events/:id is public on the backend (no verify middleware)
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
