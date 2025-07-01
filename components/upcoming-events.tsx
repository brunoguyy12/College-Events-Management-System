import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import Link from "next/link"

interface Event {
  id: string
  title: string
  startDate: Date
  venue: string
  category: string
  organizer: { name: string }
  _count: { registrations: number }
}

interface UpcomingEventsProps {
  events: Event[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No upcoming events found.</p>
        ) : (
          events.map((event) => (
            <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">{event.title}</h3>
                  <Badge variant="secondary">{event.category}</Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(event.startDate).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.venue}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event._count.registrations} registered
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">by {event.organizer.name}</p>
              </div>
              <Button asChild size="sm">
                <Link href={`/events/${event.id}`}>View</Link>
              </Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
