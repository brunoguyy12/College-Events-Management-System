import { type NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const admin = await db.user.findUnique({
      where: { id: userId },
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { action, adminNote } = await request.json();

    const roleRequest = await db.roleRequest.findUnique({
      where: { id: params.id },
      include: { user: true },
    });

    if (!roleRequest) {
      return NextResponse.json(
        { error: "Role request not found" },
        { status: 404 }
      );
    }

    if (roleRequest.status !== "PENDING") {
      return NextResponse.json(
        { error: "Role request already processed" },
        { status: 400 }
      );
    }

    // Update the role request
    const updatedRequest = await db.roleRequest.update({
      where: { id: params.id },
      data: {
        status: action === "approve" ? "APPROVED" : "REJECTED",
        processedBy: userId,
        processedAt: new Date(),
      },
    });

    // If approved, update user role in both database and Clerk
    if (action === "approve") {
      // Update in database
      await db.user.update({
        where: { id: roleRequest.userId },
        data: { role: roleRequest.requestedRole as any },
      });

      // Update in Clerk
      const clerk = await clerkClient();
      await clerk.users.updateUserMetadata(roleRequest.userId, {
        publicMetadata: {
          role: roleRequest.requestedRole,
        },
      });
    }

    // Create notification for the user
    await db.notification.create({
      data: {
        userId: roleRequest.userId,
        title: `Role Request ${action === "approve" ? "Approved" : "Rejected"}`,
        message:
          action === "approve"
            ? `Congratulations! Your request for ${roleRequest.requestedRole} role has been approved.`
            : `Your request for ${
                roleRequest.requestedRole
              } role has been rejected.${
                adminNote ? ` Reason: ${adminNote}` : ""
              }`,
        type: "ROLE_REQUEST_UPDATE",
      },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error("Error processing role request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
