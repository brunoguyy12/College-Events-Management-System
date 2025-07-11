"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Calendar, MapPin, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  venue: z.string().min(1, "Venue is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
})

type EventFormData = z.infer<typeof eventSchema>

interface CreateEventFormProps {
  userId: string
}

export function CreateEventForm({ userId }: CreateEventFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<any>(null)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      venue: "",
      startDate: "",
      endDate: "",
      capacity: 50,
      price: 0,
    },
  })

  const generateAISuggestions = async () => {
    const formData = form.getValues()
    if (!formData.title || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in title and category first to get AI suggestions.",
        variant: "destructive",
      })
      return
    }

    setIsGeneratingAI(true)
    try {
      const response = await fetch("/api/ai/event-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          expectedAttendees: formData.capacity,
          duration: 2, // Default 2 hours
        }),
      })

      if (response.ok) {
        const suggestions = await response.json()
        setAiSuggestions(suggestions)
        toast({
          title: "AI Suggestions Generated",
          description: "Check out the AI-powered recommendations below!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingAI(false)
    }
  }

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          organizerId: userId,
          aiScore: aiSuggestions?.overallScore,
          aiSuggestions: aiSuggestions ? JSON.stringify(aiSuggestions.suggestions) : null,
        }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event created successfully!",
        })
        router.push("/my-events")
      } else {
        throw new Error("Failed to create event")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input id="title" {...form.register("title")} placeholder="Enter event title" />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select onValueChange={(value) => form.setValue("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEMINAR">Seminar</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="HACKATHON">Hackathon</SelectItem>
                    <SelectItem value="FEST">Fest</SelectItem>
                    <SelectItem value="CONFERENCE">Conference</SelectItem>
                    <SelectItem value="SPORTS">Sports</SelectItem>
                    <SelectItem value="CULTURAL">Cultural</SelectItem>
                    <SelectItem value="ACADEMIC">Academic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe your event..."
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input id="venue" {...form.register("venue")} placeholder="Event venue" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  {...form.register("capacity", { valueAsNumber: true })}
                  placeholder="Maximum attendees"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input id="startDate" type="datetime-local" {...form.register("startDate")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time</Label>
                <Input id="endDate" type="datetime-local" {...form.register("endDate")} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={generateAISuggestions}
                disabled={isGeneratingAI}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                {isGeneratingAI ? "Generating..." : "Get AI Suggestions"}
              </Button>

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Creating..." : "Create Event"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {aiSuggestions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-500" />
              AI-Powered Suggestions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Recommended Time Slots
              </h3>
              <div className="grid gap-2 md:grid-cols-2">
                {aiSuggestions.suggestedTimes?.map((time: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {time.day} at {time.time}
                      </span>
                      <Badge variant="secondary">{time.score}% match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{time.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Venue Recommendations
              </h3>
              <div className="grid gap-2 md:grid-cols-2">
                {aiSuggestions.venueRecommendations?.map((venue: any, index: number) => (
                  <div key={index} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{venue.venue}</span>
                      <Badge variant="secondary">{venue.score}% match</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Users className="h-3 w-3" />
                      Capacity: {venue.capacity}
                    </div>
                    <p className="text-sm text-muted-foreground">{venue.suitability}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">General Suggestions</h3>
              <ul className="space-y-1">
                {aiSuggestions.suggestions?.map((suggestion: string, index: number) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-green-500 mt-1">•</span>
                    {suggestion}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Overall AI Score</span>
                <Badge variant="default" className="text-lg px-3 py-1">
                  {aiSuggestions.overallScore}/100
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Based on timing, venue suitability, and expected engagement
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
