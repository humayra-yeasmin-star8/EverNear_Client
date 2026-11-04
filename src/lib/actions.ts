"use server";

import { revalidatePath } from "next/cache";
import { getTokenSer } from "./getTokenSer";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ;

// every endpoint below is protected by the backend's `verify` middleware,
// so each action fetches the JWT server-side instead of on the client
const authJsonHeaders = async () => {
  const token = await getTokenSer();

  if (!token) {
    return null;
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

// POST /events  (verify) — used by the create-event form
export async function createEventAction(eventData: {
  title: string;
  category: string;
  date: string;
  time: string;
  location: string;
  image: string;
  description: string;
}) {
  const headers = await authJsonHeaders();

  if (!headers) {
    return { success: false, message: "Please sign in to create an event." };
  }

  const res = await fetch(`${API_BASE_URL}/events`, {
    method: "POST",
    headers,
    body: JSON.stringify(eventData),
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    return {
      success: false,
      message: result.message || "Failed to create event.",
    };
  }

  revalidatePath("/manage-events");
  revalidatePath("/all-events");
  revalidatePath("/");

  return { success: true };
}

// DELETE /events/:id  (verify) — used by manage-events
export async function deleteEventAction(eventId: string) {
  const headers = await authJsonHeaders();

  if (!headers) {
    return { success: false, message: "Please sign in first." };
  }

  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "DELETE",
    headers,
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    return {
      success: false,
      message: result.message || "Failed to delete event.",
    };
  }

  revalidatePath("/manage-events");
  revalidatePath("/all-events");
  revalidatePath("/");
  revalidatePath(`/events/${eventId}`);

  return { success: true };
}

// PUT /events/:id  (verify) — used by the manage-events edit modal
export async function updateEventAction(
  eventId: string,
  eventData: {
    title: string;
    description: string;
    category: string;
    image: string;
    location: string;
    date: string;
    time: string;
  }
) {
  const headers = await authJsonHeaders();

  if (!headers) {
    return { success: false, message: "Please sign in first." };
  }

  const res = await fetch(`${API_BASE_URL}/events/${eventId}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(eventData),
  });

  const result = await res.json();

  if (!res.ok || !result.success) {
    return {
      success: false,
      message: result.message || "Failed to update event.",
    };
  }

  revalidatePath("/manage-events");
  revalidatePath("/all-events");
  revalidatePath("/");
  revalidatePath(`/events/${eventId}`);

  return { success: true };
}

// POST /events/join  (verify) — the backend reads the user from the token,
// so no userId/userEmail/userName needs to be sent
export async function joinEventAction(eventId: string) {
  const headers = await authJsonHeaders();

  if (!headers) {
    return { success: false, message: "Please sign in to join this event." };
  }

  const res = await fetch(`${API_BASE_URL}/events/join`, {
    method: "POST",
    headers,
    body: JSON.stringify({ eventId }),
  });

  const result = await res.json();

  if (res.ok && result.success) {
    revalidatePath("/joined-events");
    revalidatePath("/all-events");
  }

  return result;
}

// POST /events/remind  (verify)
export async function saveReminderAction(eventId: string) {
  const headers = await authJsonHeaders();

  if (!headers) {
    return { success: false, message: "Please sign in first." };
  }

  const res = await fetch(`${API_BASE_URL}/events/remind`, {
    method: "POST",
    headers,
    body: JSON.stringify({ eventId }),
  });

  const result = await res.json();

  if (res.ok && result.success) {
    revalidatePath("/all-events");
  }

  return result;
}

// DELETE /events/joined/:eventId  (verify) — used by joined-events
export async function removeJoinedEventAction(eventId: string) {
  const headers = await authJsonHeaders();

  if (!headers) {
    return { success: false, message: "Please sign in first." };
  }

  const res = await fetch(`${API_BASE_URL}/events/joined/${eventId}`, {
    method: "DELETE",
    headers,
  });

  const result = await res.json();

  if (res.ok && result.success) {
    revalidatePath("/joined-events");
    revalidatePath("/all-events");
  }

  return result;
}
