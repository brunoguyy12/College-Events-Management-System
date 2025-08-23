import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await db.registration.findMany({
      where: {
        userId,
      },
      include: {
        event: {
          include: {
            organizer: {
              select: {
                name: true,
                avatar: true,
              },
            },
            _count: {
              select: {
                registrations: true,
              },
            },
          },
        },
      },
      orderBy: {
        event: {
          startDate: "desc",
        },
      },
    });

    const formattedEvents = registrations.map((reg) => ({
      id: reg.event.id,
      title: reg.event.title,
      description: reg.event.description,
      category: reg.event.category,
      department: reg.event.department,
      venue: reg.event.venue,
      startDate: reg.event.startDate,
      endDate: reg.event.endDate,
      capacity: reg.event.capacity,
      price: reg.event.price,
      imageUrl: reg.event.imageUrl,
      organizer: reg.event.organizer,
      registration: {
        id: reg.id,
        qrCode: reg.qrCode,
        checkedIn: reg.checkedIn,
        checkedInAt: reg.checkedInAt,
        status: reg.status,
        feedbackGiven: reg.feedbackGiven,
      },
      _count: reg.event._count,
    }));

    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Error fetching user registrations:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
