"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Users,
  Star,
  ChevronLeft,
  ChevronRight,
  IndianRupee,
} from "lucide-react";
import { getDepartmentColor } from "@/lib/departments";
import Link from "next/link";
import Image from "next/image";
import { getDefaultBanner } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  venue: string;
  category: string;
  department: string;
  price: number;
  imageUrl: string | null;
  tags: string[];
  aiScore: number | null;
  organizer: {
    name: string;
    avatar: string | null;
  };
  _count: { registrations: number };
}

interface EnhancedEventsGridProps {
  events: Event[];
  currentUserId?: string | null;
  itemsPerPage?: number;
}

export function EnhancedEventsGrid({
  events,
  currentUserId,
  itemsPerPage = 9,
}: EnhancedEventsGridProps) {
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
        {currentEvents.map((event) => {
          const departmentColor = getDepartmentColor(event.department);
          const bannerUrl = event.imageUrl || getDefaultBanner(event.category);

          return (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Event Banner */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={bannerUrl || "/placeholder.svg"}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="secondary" className="bg-white/90 text-black">
                    {event.category}
                  </Badge>
                  {event.aiScore && (
                    <div className="flex items-center gap-1 text-xs bg-white/90 text-black px-2 py-1 rounded">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{event.aiScore}/100</span>
                    </div>
                  )}
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <Badge
                    style={{
                      backgroundColor: departmentColor + "90",
                      color: "white",
                      borderColor: departmentColor,
                    }}
                    className="mb-2"
                  >
                    {event.department}
                  </Badge>
                  <h3 className="text-white font-semibold text-lg line-clamp-2">
                    {event.title}
                  </h3>
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="line-clamp-1">{event.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{event._count.registrations} registered</span>
                  </div>
                </div>

                {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {event.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {event.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{event.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Organizer & Price */}
                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={event.organizer.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback className="text-xs">
                        {event.organizer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-muted-foreground">
                      {event.organizer.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-3 w-3" />
                    <span className="font-medium text-sm">
                      {event.price === 0 ? "Free" : `₹${event.price}`}
                    </span>
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
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
