import { EventItem } from "@/types/event";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

export async function fetchEvents(
  token: string,
  status?: "upcoming" | "completed"
): Promise<EventItem[]> {
  const url = status
    ? `${API_BASE_URL}/events?status=${status}`
    : `${API_BASE_URL}/events`;

  const res = await fetch(url, {
    headers: getHeaders(token),
    cache: "no-store",
  });

  const json = await res.json();

  console.log("Fetch events response:", json);

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Failed to fetch events");
  }

  return json.data;
}

export async function fetchEventById(
  id: string,
  token: string
): Promise<EventItem> {
  const res = await fetch(`${API_BASE_URL}/events/${id}`, {
    headers: getHeaders(token),
    cache: "no-store",
  });

  const json = await res.json();

  if (!res.ok || !json.success) {
    throw new Error(json.message || "Event not found");
  }

  return json.data;
}

export async function joinEvent(
  payload: {
    eventId: string;
    userId: string;
    userEmail: string;
    userName: string;
  },
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/events/join`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function saveReminder(
  payload: { eventId: string; userId: string },
  token: string
) {
  const res = await fetch(`${API_BASE_URL}/events/remind`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  return await res.json();
}