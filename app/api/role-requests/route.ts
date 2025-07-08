import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { requestedRole, reason } = await request.json();

    // Check if user already has a pending request
    const existingRequest = await db.roleRequest.findFirst({
      where: {
        userId,
        status: "PENDING",
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: "You already have a pending role request" },
        { status: 400 }
      );
    }

    // Create the role request
    const roleRequest = await db.roleRequest.create({
      data: {
        userId,
        requestedRole,
        reason,
      },
    });

    // Create notification for admins
    const admins = await db.user.findMany({
      where: { role: "ADMIN" },
    });

    await Promise.all(
      admins.map((admin) =>
        db.notification.create({
          data: {
            userId: admin.id,
            title: "New Role Request",
            message: `${userId} has requested ${requestedRole} role`,
            type: "ROLE_REQUEST_UPDATE",
          },
        })
      )
    );

    return NextResponse.json(roleRequest);
  } catch (error) {
    console.error("Error creating role request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const roleRequests = await db.roleRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json(roleRequests);
  } catch (error) {
    console.error("Error fetching role requests:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
