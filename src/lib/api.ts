import { authClient } from "@/lib/auth-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ;

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