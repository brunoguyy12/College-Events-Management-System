import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = await db.event.findUnique({
      where: { id: params.id },
      include: {
        registrations: {
          include: { user: true },
        },
        _count: { select: { registrations: true } },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user can complete this event
    const canComplete = user.role === "ADMIN" || event.organizerId === userId;

    if (!canComplete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if event has already ended
    if (new Date() < new Date(event.endDate)) {
      return NextResponse.json(
        { error: "Cannot complete event before end date" },
        { status: 400 }
      );
    }

    // Update event status to completed
    const updatedEvent = await db.event.update({
      where: { id: params.id },
      data: { status: "COMPLETED" },
    });

    // Calculate and update analytics
    const checkedInCount = event.registrations.filter(
      (r) => r.checkedIn
    ).length;
    const totalRegistrations = event._count.registrations;

    await db.eventAnalytics.upsert({
      where: { eventId: params.id },
      update: {
        totalRegistrations,
        totalAttendees: checkedInCount,
        updatedAt: new Date(),
      },
      create: {
        eventId: params.id,
        totalRegistrations,
        totalAttendees: checkedInCount,
      },
    });

    return NextResponse.json({
      event: updatedEvent,
      analytics: {
        totalRegistrations,
        totalAttendees: checkedInCount,
        attendanceRate:
          totalRegistrations > 0
            ? (checkedInCount / totalRegistrations) * 100
            : 0,
      },
    });
  } catch (error) {
    console.error("Error completing event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
