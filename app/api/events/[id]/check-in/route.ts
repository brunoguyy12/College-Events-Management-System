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

    if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
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
        eventId: params.id,
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
    if (registration.checkedIn) {
      return NextResponse.json({
        registration,
        message: "Already checked in",
      });
    }

    // Update check-in status
    const updatedRegistration = await db.registration.update({
      where: { id: registration.id },
      data: { checkedIn: true },
      include: {
        user: true,
        event: true,
      },
    });

    return NextResponse.json({
      registration: updatedRegistration,
      message: "Check-in successful",
    });
  } catch (error) {
    console.error("Error processing check-in:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
