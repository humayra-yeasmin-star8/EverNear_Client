import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const DB_NAME = "event-db";
const COLLECTION = "newsletter_subscribers";

let clientPromise: Promise<MongoClient> | null = null;

function getClient() {
  if (!clientPromise) {
    clientPromise = new MongoClient(process.env.MONGODB_URI as string).connect();
  }
  return clientPromise;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Please enter your email address." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "That doesn't look like a valid email address." },
        { status: 400 }
      );
    }

    const client = await getClient();
    const db = client.db(DB_NAME);

    // Make sure one email can never be stored twice.
    await db.collection(COLLECTION).createIndex({ email: 1 }, { unique: true });

    try {
      await db.collection(COLLECTION).insertOne({
        email,
        subscribedAt: new Date(),
      });

      return NextResponse.json(
        { success: true, message: "You're subscribed! See you every Tuesday. 💌" },
        { status: 201 }
      );
    } catch (error) {
      // Duplicate key = already subscribed, still a happy path for the user.
      if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code?: number }).code === 11000
      ) {
        return NextResponse.json(
          { success: true, message: "You're already on the list — no worries!" },
          { status: 200 }
        );
      }
      throw error;
    }
  } catch (error) {
    console.error("Newsletter subscription failed:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong on our side. Please try again." },
      { status: 500 }
    );
  }
}
