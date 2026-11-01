import { EventItem } from "@/types/event";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchEvents(status?: "upcoming" | "completed"): Promise<EventItem[]> {
  const url = status ? `${API_BASE_URL}/events?status=${status}` : `${API_BASE_URL}/events`;
  const res = await fetch(url, { cache: "no-store" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Failed to fetch events");
  return json.data;
}

export async function fetchEventById(id: string): Promise<EventItem> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, { cache: "no-store" });
  const json = await res.json();
  if (!json.success) throw new Error(json.message || "Event not found");
  return json.data;
}

export async function joinEvent(payload: {
  eventId: string;
  userId: string;
  userEmail: string;
  userName: string;
}) {
  const res = await fetch(`${API_BASE_URL}/events/join`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

export async function saveReminder(payload: { eventId: string; userId: string }) {
  const res = await fetch(`${API_BASE_URL}/events/remind`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await res.json();
}