import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, MapPin, Users, Clock, Star, IndianRupee } from "lucide-react"

interface EventDetailsProps {
  event: {
    id: string
    title: string
    description: string
    category: string
    venue: string
    startDate: Date
    endDate: Date
    capacity: number
    price: number
    aiScore: number | null
    organizer: {
      name: string
    }
    _count: {
      registrations: number
    }
  }
}

export function EventDetails({ event }: EventDetailsProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date))
  }

  const duration = Math.ceil(
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60),
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{event.category}</Badge>
              {event.aiScore && (
                <div className="flex items-center gap-1 text-sm">
                  <Star className="h-3 w-3 text-yellow-500" />
                  <span>{event.aiScore}/100 AI Score</span>
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold">{event.title}</h1>
          </div>
        </div>

        {/* Organizer Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Organized by {event.organizer.name}</p>
            <p className="text-sm text-muted-foreground">Event Organizer</p>
          </div>
        </div>
      </div>

      {/* Event Info Cards */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Date & Time
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">Start</p>
              <p className="text-sm text-muted-foreground">{formatDate(event.startDate)}</p>
            </div>
            <div>
              <p className="font-medium">End</p>
              <p className="text-sm text-muted-foreground">{formatDate(event.endDate)}</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Duration: {duration} hours</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-medium">Venue</p>
              <p className="text-sm text-muted-foreground">{event.venue}</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span className="text-sm">
                  {event._count.registrations} / {event.capacity} registered
                </span>
              </div>
              <div className="flex items-center gap-1">
                <IndianRupee className="h-4 w-4" />
                <span className="font-medium">{event.price === 0 ? "Free" : `₹${event.price}`}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About This Event</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground leading-relaxed">{event.description}</p>
        </CardContent>
      </Card>
    </div>
  )
}
