import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, Clock, Plus, Eye } from "lucide-react";
import Link from "next/link";

interface UpcomingEventsCalendarProps {
  userEvents: any[];
  organizedEvents: any[];
  allUpcomingEvents: any[];
  isOrganizer: boolean;
}

export function UpcomingEventsCalendar({
  userEvents,
  organizedEvents,
  allUpcomingEvents,
  isOrganizer,
}: UpcomingEventsCalendarProps) {
  const now = new Date();

  const upcomingRegistered = userEvents
    .filter((reg) => new Date(reg.event.startDate) > now)
    .slice(0, 5);

  const upcomingOrganized = organizedEvents
    .filter((event) => new Date(event.startDate) > now)
    .slice(0, 5);

  const suggestedEvents = allUpcomingEvents
    .filter(
      (event) =>
        !userEvents.some((reg) => reg.event.id === event.id) &&
        event.organizerId !== (isOrganizer ? userEvents[0]?.userId : null)
    )
    .slice(0, 3);

  const formatEventTime = (date: Date) => {
    const eventDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (eventDate.toDateString() === today.toDateString()) {
      return `Today at ${eventDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else if (eventDate.toDateString() === tomorrow.toDateString()) {
      return `Tomorrow at ${eventDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    } else {
      return eventDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* My Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              My Upcoming Events
            </span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/events">
                <Eye className="h-4 w-4 mr-1" />
                View All
              </Link>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingRegistered.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No upcoming events</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 bg-transparent"
                asChild
              >
                <Link href="/events">Browse Events</Link>
              </Button>
            </div>
          ) : (
            upcomingRegistered.map((reg) => (
              <div key={reg.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {reg.event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      {formatEventTime(reg.event.startDate)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {reg.event.venue}
                    </div>
                  </div>
                  <Badge
                    variant={
                      reg.status === "CONFIRMED" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {reg.status}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  asChild
                >
                  <Link href={`/events/${reg.event.id}`}>View Details</Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Organizer Events */}
      {isOrganizer && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                My Events
              </span>
              <Button variant="outline" size="sm" asChild>
                <Link href="/events/create">
                  <Plus className="h-4 w-4 mr-1" />
                  Create
                </Link>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingOrganized.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No upcoming events</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 bg-transparent"
                  asChild
                >
                  <Link href="/events/create">Create Event</Link>
                </Button>
              </div>
            ) : (
              upcomingOrganized.map((event) => (
                <div key={event.id} className="p-3 border rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm line-clamp-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Clock className="h-3 w-3" />
                        {formatEventTime(event.startDate)}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Users className="h-3 w-3" />
                        {event._count.registrations} registered
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Organizer
                    </Badge>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full bg-transparent"
                    asChild
                  >
                    <Link href={`/events/${event.id}`}>Manage Event</Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Suggested Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Discover Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {suggestedEvents.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No new events to discover</p>
            </div>
          ) : (
            suggestedEvents.map((event) => (
              <div key={event.id} className="p-3 border rounded-lg space-y-2">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">
                      {event.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                      <Clock className="h-3 w-3" />
                      {formatEventTime(event.startDate)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {event._count.registrations} registered
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {event.category}
                  </Badge>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full bg-transparent"
                  asChild
                >
                  <Link href={`/events/${event.id}`}>Learn More</Link>
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
