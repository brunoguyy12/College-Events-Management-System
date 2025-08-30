import { type NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Helper to get CSRF token from cookies (assuming it's set as 'csrfToken')
function getCsrfTokenFromRequest(request: NextRequest) {
  const csrfHeader = request.headers.get("x-csrf-token");
  const csrfCookie = request.cookies.get("csrfToken")?.value;
  if (!csrfHeader || !csrfCookie || csrfHeader !== csrfCookie) {
    return false;
  }
  return true;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // CSRF validation
    if (!getCsrfTokenFromRequest(request)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    const { userId } = await auth();
    const { id } = await params;

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

    const { role } = await request.json();

    // Update in database
    await db.user.update({
      where: { id: id },
      data: { role },
    });

    // Update in Clerk
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(id, {
      publicMetadata: { role },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
