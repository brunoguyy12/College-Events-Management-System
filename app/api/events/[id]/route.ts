import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    const { id } = await params;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const event = await db.event.findUnique({
      where: { id: id },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user can edit this event
    const canEdit = user.role === "ADMIN" || event.organizerId === userId;

    if (!canEdit) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await request.json();

    const updatedEvent = await db.event.update({
      where: { id: params.id },
      data: {
        title: data.title,
        description: data.description,
        category: data.category,
        department: data.department,
        venue: data.venue,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        capacity: data.capacity,
        price: data.price,
        imageUrl: data.imageUrl,
        tags: data.tags,
        speakers: data.speakers,
        agenda: data.agenda,
        prizes: data.prizes,
        rules: data.rules,
        requirements: data.requirements,
        faqs: data.faqs,
      },
    });

    return NextResponse.json(updatedEvent);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
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
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    // Check if user can delete this event
    const canDelete = user.role === "ADMIN" || event.organizerId === userId;

    if (!canDelete) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Check if event has already ended (past events should not be deleted for analytics)
    const now = new Date();
    if (new Date(event.endDate) < now) {
      return NextResponse.json(
        {
          error:
            "Cannot delete past events. They are kept for analytics purposes.",
        },
        { status: 400 }
      );
    }

    // Delete the event (this will cascade delete registrations and analytics due to onDelete: Cascade)
    await db.event.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
