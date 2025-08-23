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
  Clock,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import {
  getDepartmentColor,
  getDepartmentDisplayName,
} from "@/lib/departments";
import { formatDisplayDate, getEventStatus } from "@/lib/timezone";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Link from "next/link";
import Image from "next/image";
import { getDefaultBanner } from "@/lib/utils";

interface Event {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  venue: string;
  category: string;
  department: string;
  price: number;
  imageUrl: string | null;
  tags: string[];
  aiScore: number | null;
  organizerId: string;
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
  userRole?: string;
  showOngoingBadge?: boolean;
  showActions?: boolean;
}

export function EnhancedEventsGrid({
  events,
  currentUserId,
  userRole,
  showOngoingBadge = false,
  showActions = false,
  itemsPerPage = 9,
}: EnhancedEventsGridProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingEventId, setDeletingEventId] = useState<string | null>(null);
  const { toast } = useToast();

  const totalPages = Math.ceil(events.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvents = events.slice(startIndex, endIndex);

  const handleDeleteEvent = async (eventId: string) => {
    setDeletingEventId(eventId);

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        // Refresh the page to update the events list
        window.location.reload();
      } else {
        throw new Error("Failed to delete event");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setDeletingEventId(null);
    }
  };

  const getStatusBadge = (event: Event) => {
    const status = getEventStatus(
      new Date(event.startDate),
      new Date(event.endDate)
    );

    switch (status) {
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "ongoing":
        return (
          <Badge
            variant="default"
            className="bg-green-500 hover:bg-green-600 animate-pulse"
          >
            🔴 Live
          </Badge>
        );
      case "past":
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const canEditEvent = (event: Event) => {
    return userRole === "ADMIN" || event.organizerId === currentUserId;
  };

  const canDeleteEvent = (event: Event) => {
    const eventStatus = getEventStatus(event.startDate, event.endDate);

    console.log(
      `Can I delete event ${event.title}?`,
      (userRole === "ADMIN" || event.organizerId === currentUserId) &&
        eventStatus !== "past"
    );

    console.log("User Role:", userRole);
    console.log("Event Status:", eventStatus);
    return (
      (userRole === "ADMIN" || event.organizerId === currentUserId) &&
      eventStatus !== "past"
    );
  };

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
          const eventStatus = getEventStatus(event.startDate, event.endDate);

          return (
            <Card
              key={event.id}
              className="overflow-hidden hover:shadow-lg transition-shadow relative"
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
                  {/* {event.aiScore && (
                    <div className="flex items-center gap-1 text-xs bg-white/90 text-black px-2 py-1 rounded">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span>{event.aiScore}/100</span>
                    </div>
                  )} */}
                  {showOngoingBadge && eventStatus === "ongoing" && (
                    <Badge className="bg-green-500 text-white animate-pulse">
                      <Clock className="h-3 w-3 mr-1" />
                      Live
                    </Badge>
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
                    {getDepartmentDisplayName(event.department as any).replace(
                      /_/g,
                      " "
                    )}
                  </Badge>
                  <h3 className="text-white font-semibold text-lg line-clamp-2">
                    {event.title}
                  </h3>
                </div>
              </div>

              <CardContent className="p-4 space-y-4 flex justify-between flex-col h-[calc(100%-12rem)]">
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {event.description}
                  </p>

                  {/* Event Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{formatDisplayDate(event.startDate)}</span>
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
                </div>

                <div className="space-y-2">
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
                      {/* <IndianRupee className="h-3 w-3" /> */}
                      <span className="font-medium text-sm">
                        {event.price === 0 ? "Free" : `₹${event.price}`}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button asChild className="flex-1">
                      <Link href={`/events/${event.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </Button>

                    {showActions && canEditEvent(event) && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/events/edit/${event.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    )}

                    {showActions && canDeleteEvent(event) && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={deletingEventId === event.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Event</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{event.title}"?
                              This action cannot be undone. All registrations
                              and related data will be permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteEvent(event.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Delete Event
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                </div>
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
