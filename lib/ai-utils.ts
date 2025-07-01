import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"

// AI-powered event scheduling
export async function generateEventSchedulingSuggestions(eventData: {
  title: string
  category: string
  expectedAttendees: number
  duration: number
}) {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      suggestedTimes: z.array(
        z.object({
          day: z.string(),
          time: z.string(),
          reason: z.string(),
          score: z.number().min(0).max(100),
        }),
      ),
      venueRecommendations: z.array(
        z.object({
          venue: z.string(),
          capacity: z.number(),
          suitability: z.string(),
          score: z.number().min(0).max(100),
        }),
      ),
      overallScore: z.number().min(0).max(100),
      suggestions: z.array(z.string()),
    }),
    prompt: `Analyze this event and provide scheduling suggestions:
    
    Event: ${eventData.title}
    Category: ${eventData.category}
    Expected Attendees: ${eventData.expectedAttendees}
    Duration: ${eventData.duration} hours
    
    Consider factors like:
    - Optimal times for student attendance
    - Venue capacity requirements
    - Event type suitability
    - Academic calendar considerations
    
    Provide practical recommendations with scoring.`,
  })

  return object
}

// AI-powered participant matching
export async function generateParticipantMatches(
  participants: Array<{
    id: string
    name: string
    skills: string[]
    interests: string[]
  }>,
) {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      teams: z.array(
        z.object({
          members: z.array(z.string()),
          compatibility: z.number().min(0).max(100),
          strengths: z.array(z.string()),
          reasoning: z.string(),
        }),
      ),
      recommendations: z.array(z.string()),
    }),
    prompt: `Create optimal team matches for these participants:
    
    ${participants
      .map((p) => `${p.name}: Skills: ${p.skills.join(", ")}, Interests: ${p.interests.join(", ")}`)
      .join("\n")}
    
    Create balanced teams of 3-4 people with complementary skills and shared interests.
    Focus on creating diverse, well-rounded teams.`,
  })

  return object
}

// AI-powered feedback analysis
export async function analyzeFeedback(feedbackText: string) {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: z.object({
      sentiment: z.enum(["POSITIVE", "NEGATIVE", "NEUTRAL"]),
      sentimentScore: z.number().min(-1).max(1),
      topics: z.array(z.string()),
      keyInsights: z.array(z.string()),
      actionableItems: z.array(z.string()),
    }),
    prompt: `Analyze this event feedback:
    
    "${feedbackText}"
    
    Extract sentiment, key topics, insights, and actionable improvements.`,
  })

  return object
}
