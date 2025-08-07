import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find completed events user attended but hasn't given feedback for
    const pendingFeedback = await db.registration.findMany({
      where: {
        userId,
        checkedIn: true, // Only events they actually attended
        feedbackGiven: false, // Haven't given feedback yet
        event: {
          status: "COMPLETED",
          endDate: {
            // Only events completed in the last 7 days
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        event: {
          endDate: "desc",
        },
      },
      take: 3, // Limit to 3 most recent events
    });

    const formattedFeedback = pendingFeedback.map((reg) => ({
      eventId: reg.event.id,
      eventTitle: reg.event.title,
      completedAt: reg.event.endDate,
      organizerName: reg.event.organizer.name,
    }));

    return NextResponse.json({
      pendingFeedback: formattedFeedback,
    });
  } catch (error) {
    console.error("Error fetching pending feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch pending feedback" },
      { status: 500 }
    );
  }
}
