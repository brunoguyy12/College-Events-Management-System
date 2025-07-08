"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  venue: string;
  category: string;
  price: number;
  aiScore: number | null;
  organizer: { name: string };
  _count: { registrations: number };
}

interface EventsGridProps {
  events: Event[];
  itemsPerPage?: number;
}

export function EventsGrid({ events, itemsPerPage = 9 }: EventsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold">No events found</h3>
        <p className="text-muted-foreground">
          Try adjusting your search criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentEvents.map((event) => (
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
                  <span>{event._count.registrations} registered</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="text-sm text-muted-foreground">
                    by {event.organizer.name}
                  </p>
                  <p className="font-semibold">
                    {event.price === 0 ? "Free" : `₹${event.price}`}
                  </p>
                </div>
                <Button asChild>
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="w-8 h-8 p-0"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        Showing {startIndex + 1} to {Math.min(endIndex, events.length)} of{" "}
        {events.length} events
      </div>
    </div>
  );
}
