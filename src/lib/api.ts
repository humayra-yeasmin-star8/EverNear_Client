import { EventItem } from "@/types/event";
import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const getHeaders = (token: string) => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
});

const getAuthToken = async () => {
  const { data, error } = await authClient.$fetch<{ token: string }>("/token");

  if (error || !data?.token) {
    throw new Error("Authentication required.");
  }

  return data.token;
};

// Inside src/lib/api.ts
export async function fetchEvents(status?: string) {
  const url = status
    ? `${API_BASE_URL}/events?status=${encodeURIComponent(status)}`
    : `${API_BASE_URL}/events`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch events");

  const data = await res.json();
  return Array.isArray(data) ? data : data.data || [];
}

export async function fetchEventById(id: string): Promise<EventItem> {
  const token = await getAuthToken();

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
) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/events/join`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function saveReminder(
  payload: { eventId: string; userId: string },
) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/events/remind`, {
    method: "POST",
    headers: getHeaders(token),
    body: JSON.stringify(payload),
  });

  return await res.json();
}

export async function fetchJoinedEvents(): Promise<EventItem[]> {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/events/joined`, {
    headers: getHeaders(token),
    cache: "no-store",
  });

  const data = await res.json();

  if (!res.ok || !data.success) {
    throw new Error(data.message || "Failed to fetch joined events");
  }

  return data.data || [];
}

export async function removeJoinedEvent(eventId: string) {
  const token = await getAuthToken();

  const res = await fetch(`${API_BASE_URL}/events/joined/${eventId}`, {
    method: "DELETE",
    headers: getHeaders(token),
  });

  return await res.json();
}