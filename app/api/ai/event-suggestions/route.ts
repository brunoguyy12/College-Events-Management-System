import { type NextRequest, NextResponse } from "next/server"
import { generateEventSchedulingSuggestions } from "@/lib/ai-utils"

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const suggestions = await generateEventSchedulingSuggestions({
      title: data.title,
      category: data.category,
      expectedAttendees: data.expectedAttendees,
      duration: data.duration,
    })

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Error generating AI suggestions:", error)
    return NextResponse.json({ error: "Failed to generate suggestions" }, { status: 500 })
  }
}
