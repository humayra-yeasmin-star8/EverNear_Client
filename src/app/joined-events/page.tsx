import { redirect } from "next/navigation";
import { getTokenSer } from "@/lib/getTokenSer";
import JoinedEventsClient from "./JoinedEventsClient";
import { EventItem } from "@/types/event";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ;

export default async function JoinedEventsPage() {
  // verify-protected endpoint: get the JWT server-side
  const token = await getTokenSer();

  if (!token) {
    redirect("/signin");
  }

  let events: EventItem[] = [];
  let fetchError: string | null = null;

  try {
    const res = await fetch(`${API_BASE_URL}/events/joined`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch joined events");
    }

    events = result.data ?? [];
  } catch (error) {
    console.error("Failed to fetch joined events:", error);
    fetchError = "Could not load your joined events.";
  }

  return <JoinedEventsClient initialEvents={events} fetchError={fetchError} />;
}
