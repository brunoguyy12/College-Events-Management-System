import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { getImageKitAuthParams } from "@/lib/imagekit"

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const authParams = getImageKitAuthParams()
    return NextResponse.json(authParams)
  } catch (error) {
    console.error("ImageKit auth error:", error)
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 })
  }
}
