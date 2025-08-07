import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST() {
  try {
    const now = new Date();

    // Find events that should be ONGOING (started but not ended)
    const eventsToStart = await db.event.findMany({
      where: {
        status: "PUBLISHED",
        startDate: {
          lte: now,
        },
        endDate: {
          gt: now,
        },
      },
    });

    // Find events that should be COMPLETED (ended)
    const eventsToComplete = await db.event.findMany({
      where: {
        status: {
          in: ["PUBLISHED", "ONGOING"],
        },
        endDate: {
          lt: now,
        },
      },
      include: {
        registrations: {
          where: {
            status: "CONFIRMED",
          },
        },
        _count: {
          select: {
            registrations: true,
          },
        },
      },
    });

    // Update events to ONGOING
    const startedEvents = [];
    for (const event of eventsToStart) {
      await db.event.update({
        where: { id: event.id },
        data: { status: "ONGOING" },
      });
      startedEvents.push(event);
    }

    // Update events to COMPLETED and calculate analytics
    const completedEvents = [];
    for (const event of eventsToComplete) {
      // Calculate attendance rate
      const totalRegistrations = event._count.registrations;
      const checkedInCount = await db.registration.count({
        where: {
          eventId: event.id,
          checkedIn: true,
        },
      });

      const attendanceRate =
        totalRegistrations > 0
          ? (checkedInCount / totalRegistrations) * 100
          : 0;

      // Update event status
      await db.event.update({
        where: { id: event.id },
        data: {
          status: "COMPLETED",
          // Store final analytics
          aiScore: attendanceRate, // Using aiScore field to store attendance rate for now
        },
      });

      // Create analytics record
      await db.eventAnalytics.upsert({
        where: { eventId: event.id },
        update: {
          totalRegistrations,
          checkedInCount,
          attendanceRate,
          completedAt: now,
        },
        create: {
          eventId: event.id,
          totalRegistrations,
          checkedInCount,
          attendanceRate,
          completedAt: now,
        },
      });

      completedEvents.push(event);
    }

    return NextResponse.json({
      success: true,
      startedEvents: startedEvents.length,
      completedEvents: completedEvents.length,
      message: `Started ${startedEvents.length} events, completed ${completedEvents.length} events`,
    });
  } catch (error) {
    console.error("Auto-completion error:", error);
    return NextResponse.json(
      { error: "Failed to auto-complete events" },
      { status: 500 }
    );
  }
}
