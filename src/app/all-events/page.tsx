import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EventsWrapper from "./EventsWrapper";

export default async function AllEventsPage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return <div>Please log in to view events.</div>;
  }

  const token = await auth.api.getToken({
    headers: requestHeaders,
  });

  return <EventsWrapper token={token?.token || ""} />;
} 