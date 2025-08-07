import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await request.json();

    // Mark that feedback modal was shown (even if not submitted)
    await db.registration.updateMany({
      where: {
        userId,
        eventId,
      },
      data: {
        feedbackShown: true,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error marking feedback as shown:", error);
    return NextResponse.json(
      { error: "Failed to mark feedback as shown" },
      { status: 500 }
    );
  }
}
