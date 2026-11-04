import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getTokenSer } from "@/lib/getTokenSer";
import ManageEventsClient from "./ManageEventsClient";
import { EventItem } from "@/types/event";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ;

export default async function ManageEventsPage() {
  // verify-protected endpoint: get the JWT server-side
  const token = await getTokenSer();

  if (!token) {
    redirect("/signin");
  }

  // the creator endpoint already scopes results to the token owner, but we
  // also compare `creatorId` in the UI so edit/delete never show for others
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const currentUserId = session?.user?.id ?? null;

  let events: EventItem[] = [];
  let fetchError: string | null = null;

  try {
    const res = await fetch(`${API_BASE_URL}/events/creator`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      throw new Error(result.message || "Failed to fetch user events");
    }

    events = result.data ?? [];
  } catch (error) {
    console.error("Failed to fetch user events:", error);
    fetchError = "Could not load your events. Make sure the backend is running.";
  }

  return (
    <ManageEventsClient
      initialEvents={events}
      fetchError={fetchError}
      currentUserId={currentUserId}
    />
  );
}
