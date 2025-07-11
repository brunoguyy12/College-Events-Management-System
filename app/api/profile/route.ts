import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"

export async function PATCH(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { name, bio, skills, interests } = await request.json()

    // Update user in database
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        skills: skills || [],
        interests: interests || [],
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
