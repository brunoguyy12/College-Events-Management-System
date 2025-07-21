import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { uploadToImageKit } from "@/lib/imagekit"

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      console.error("Unauthorized user error")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const folder = formData.get("folder") as string

    if (!file) {
      console.error('No file Provided Error')
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to ImageKit
    const result = await uploadToImageKit(buffer, file.name, folder || "uploads")

    console.log("Result Log: ", result)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
