import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Star } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  description: string
  startDate: Date
  venue: string
  category: string
  price: number
  aiScore: number | null
  organizer: { name: string }
  _count: { registrations: number }
}

interface EventsGridProps {
  events: Event[]
}

export function EventsGrid({ events }: EventsGridProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No events found</h3>
        <p className="text-muted-foreground">Try adjusting your search criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <Badge variant="secondary">{event.category}</Badge>
              {event.aiScore && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span>{event.aiScore}/100</span>
                </div>
              )}
            </div>
            <CardTitle className="line-clamp-2">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{new Date(event.startDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{event._count.registrations} registered</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="text-sm text-muted-foreground">by {event.organizer.name}</p>
                <p className="font-semibold">{event.price === 0 ? "Free" : `₹${event.price}`}</p>
              </div>
              <Button asChild>
                <Link href={`/events/${event.id}`}>View Details</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
