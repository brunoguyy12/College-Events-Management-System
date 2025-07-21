import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { sendRegistrationConfirmationEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { eventId } = await request.json()

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required" }, { status: 400 })
    }

    // Check if event exists and is not full
    const event = await db.event.findUnique({
      where: { id: eventId },
      include: {
        _count: { select: { registrations: true } },
      },
    })

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 })
    }

    if (event.status !== "PUBLISHED") {
      return NextResponse.json({ error: "Event is not available for registration" }, { status: 400 })
    }

    if (event.capacity && event._count.registrations >= event.capacity) {
      return NextResponse.json({ error: "Event is full" }, { status: 400 })
    }

    // Check if user is already registered
    const existingRegistration = await db.registration.findFirst({
      where: {
        eventId,
        userId,
      },
    })

    if (existingRegistration) {
      return NextResponse.json({ error: "Already registered for this event" }, { status: 400 })
    }

    // Get user details
    const user = await db.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Generate unique QR code
    const qrCode = `REG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    // Create registration
    const registration = await db.registration.create({
      data: {
        eventId,
        userId,
        qrCode,
        status: "CONFIRMED",
        checkedIn: false,
      },
      include: {
        event: true,
        user: true,
      },
    })

    // Send confirmation email with QR code
    try {
      await sendRegistrationConfirmationEmail({
        userEmail: user.email,
        userName: user.name || user.email,
        eventTitle: event.title,
        eventDate: event.startDate,
        eventVenue: event.venue,
        qrCode: registration.qrCode,
        registrationId: registration.id,
        eventId: event.id,
      })
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError)
      // Don't fail the registration if email fails
    }

    return NextResponse.json({
      message: "Registration successful",
      registration: {
        id: registration.id,
        qrCode: registration.qrCode,
        status: registration.status,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
