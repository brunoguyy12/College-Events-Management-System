import { type NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth"
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { EventCategory } from "@prisma/client";

export async function POST(request: NextRequest) {
  try {
    // const session = await getServerSession(authOptions)
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    const event = await db.event.create({
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        venue: data.venue,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        capacity: data.capacity,
        price: data.price,
        organizerId: data.organizerId,
        aiScore: data.aiScore,
        aiSuggestions: data.aiSuggestions,
        status: "PUBLISHED",
      },
    });

    // Create analytics record
    await db.eventAnalytics.create({
      data: {
        eventId: event.id,
        completedAt: new Date(0),
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const events = await db.event.findMany({
      where: {
        status: "PUBLISHED",
        ...(category && { category: category as EventCategory }),
        ...(search && {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ],
        }),
      },
      include: {
        organizer: true,
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
