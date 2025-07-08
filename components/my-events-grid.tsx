import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Edit, Eye, BarChart3 } from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  venue: string;
  category: string;
  status: string;
  price: number;
  capacity: number;
  _count: { registrations: number };
}

interface MyEventsGridProps {
  events: Event[];
}

export function MyEventsGrid({ events }: MyEventsGridProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h3 className="text-lg font-semibold mb-2">No events created yet</h3>
        <p className="text-muted-foreground mb-4">
          Start by creating your first event to engage with participants.
        </p>
        <Button asChild>
          <Link href="/events/create">Create Your First Event</Link>
        </Button>
      </div>
    );
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PUBLISHED":
        return "default" as const;
      case "DRAFT":
        return "secondary" as const;
      case "COMPLETED":
        return "outline" as const;
      case "CANCELLED":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <Card key={event.id} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <Badge variant={getStatusVariant(event.status)}>
                {event.status}
              </Badge>
              <Badge variant="outline">{event.category}</Badge>
            </div>
            <CardTitle className="line-clamp-2">{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {event.description}
            </p>

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
                <span>
                  {event._count.registrations} / {event.capacity} registered
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div>
                <p className="font-semibold">
                  {event.price === 0 ? "Free" : `₹${event.price}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round(
                    (event._count.registrations / event.capacity) * 100
                  )}
                  % filled
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/events/${event.id}`}
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  View
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/events/edit/${event.id}`}
                  className="flex items-center gap-1"
                >
                  <Edit className="h-3 w-3" />
                  Edit
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link
                  href={`/events/${event.id}/participants`}
                  className="flex items-center gap-1"
                >
                  <BarChart3 className="h-3 w-3" />
                  Stats
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
