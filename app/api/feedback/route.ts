import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId, rating, comment } = await request.json();

    // Create feedback record
    await db.feedback.create({
      data: {
        eventId,
        userId,
        rating,
        comment: comment || null,
      },
    });

    // Mark registration as feedback given
    await db.registration.updateMany({
      where: {
        userId,
        eventId,
      },
      data: {
        feedbackGiven: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
