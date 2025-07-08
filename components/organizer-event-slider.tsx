"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Users,
  Eye,
  Edit,
} from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  startDate: Date;
  venue: string;
  capacity: number;
  _count: { registrations: number };
}

interface OrganizerEventSliderProps {
  events: Event[];
}

export function OrganizerEventSlider({ events }: OrganizerEventSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground mb-4">No upcoming events</p>
          <Button asChild>
            <Link href="/events/create">Create Your First Event</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const currentEvent = events[currentIndex];

  const nextEvent = () => {
    setCurrentIndex((prev) => (prev + 1) % events.length);
  };

  const prevEvent = () => {
    setCurrentIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>My Upcoming Events</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} of {events.length}
            </span>
            {events.length > 1 && (
              <div className="flex gap-1">
                <Button variant="outline" size="sm" onClick={prevEvent}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={nextEvent}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">
              {currentEvent.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {new Date(currentEvent.startDate).toLocaleDateString()} at{" "}
              {currentEvent.venue}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">
                {currentEvent._count.registrations} / {currentEvent.capacity}{" "}
                registered
              </span>
            </div>
            <Badge variant="outline">
              {Math.round(
                (currentEvent._count.registrations / currentEvent.capacity) *
                  100
              )}
              % filled
            </Badge>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/events/${currentEvent.id}`}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                View
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/events/edit/${currentEvent.id}`}
                className="flex items-center gap-1"
              >
                <Edit className="h-3 w-3" />
                Edit
              </Link>
            </Button>
          </div>
        </div>

        <div className="pt-2 border-t">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            asChild
          >
            <Link href="/events/my-events">View All My Events</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
