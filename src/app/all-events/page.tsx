import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import EventsWrapper from "./EventsWrapper";
import { getTokenSer } from "@/lib/getTokenSer";

export default async function AllEventsPage() {
  const requestHeaders = await headers();

  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  if (!session) {
    return <div>Please log in to view events.</div>;
  }

  const token = await getTokenSer();

  return <EventsWrapper token={token || ""} />;
} 