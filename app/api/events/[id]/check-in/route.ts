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

    const { id } = await params;


    const user = await getAuthUser();

    if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { qrCode } = await request.json();

    if (!qrCode) {
      return NextResponse.json(
        { error: "QR code is required" },
        { status: 400 }
      );
    }

    // Find the registration
    const registration = await db.registration.findFirst({
      where: {
        qrCode,
        eventId: id,
      },
      include: {
        user: true,
        event: true,
      },
    }); 

    if (!registration) {
      return NextResponse.json(
        { error: "Registration not found or invalid QR code" },
        { status: 404 }
      );
    }

    // Check if already checked in
    // if (registration.checkedIn) {
    //   return NextResponse.json({
    //     registration,
    //     message: "Already checked in",
    //   });
    // }

    // Check if user can manage this event
    const canManage = user.role === "ADMIN" || registration.event.organizerId === userId

    if (!canManage) {
      return NextResponse.json({ error: "Permission denied" }, { status: 403 })
    }



    // Update check-in status if not already checked in
    if (!registration.checkedIn) {
    const updatedRegistration = await db.registration.update({
      where: { id: registration.id },
      data: { checkedIn: true },
    });
  }

    return NextResponse.json({
      success: true,
      registration: {
        id: registration.id,
        qrCode: registration.qrCode,
        checkedIn: true,
        user: {
          name: registration.user.name || registration.user.email,
          email: registration.user.email,
          avatar: registration.user.avatar,
        },
        event: {
          title: registration.event.title,
          startDate: registration.event.startDate,
          venue: registration.event.venue,
        },
      },
    });
  } catch (error) {
    console.error("Check-in error:", error)
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 })
  }
}
