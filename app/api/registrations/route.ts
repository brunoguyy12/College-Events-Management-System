import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { sendRegistrationConfirmationEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { eventId } = await request.json();

    // Check if event exists and has capacity
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } }, organizer: true },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    if (event._count.registrations >= event.capacity) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 });
    }

    // Check if user is already registered
    const existingRegistration = await db.registration.findUnique({
      where: {
        userId_eventId: {
          userId,
          eventId,
        },
      },
    });

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Already registered" },
        { status: 400 }
      );
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create registration
    const registration = await db.registration.create({
      data: {
        userId,
        eventId,
        qrCode: nanoid(12),
        status: "CONFIRMED",
      },
    });

    // Send confirmation email
    try {
      await sendRegistrationConfirmationEmail({
        userEmail: user.email,
        userName: user.name || user.email,
        eventTitle: event.title,
        eventDate: event.startDate,
        eventVenue: event.venue,
        qrCode: registration.qrCode,
        registrationId: registration.id,
      });
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the registration if email fails
    }

    return NextResponse.json(registration);
  } catch (error) {
    console.error("Error creating registration:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
