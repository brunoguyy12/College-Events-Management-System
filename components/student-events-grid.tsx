// "use client";

// import { useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   Calendar,
//   MapPin,
//   Users,
//   Clock,
//   CheckCircle,
//   QrCode,
//   IndianRupee,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";
// import { getDepartmentColor } from "@/lib/departments";
// import { formatDisplayDate, getEventStatus } from "@/lib/timezone";
// import Link from "next/link";
// import Image from "next/image";
// import { getDefaultBanner } from "@/lib/utils";

// interface Registration {
//   id: string;
//   qrCode: string;
//   checkedIn: boolean;
//   checkedInAt: Date | null;
//   createdAt: Date;
//   event: {
//     id: string;
//     title: string;
//     description: string;
//     startDate: Date;
//     endDate: Date;
//     venue: string;
//     category: string;
//     department: string;
//     price: number;
//     imageUrl: string | null;
//     tags: string[];
//     organizer: {
//       name: string;
//       avatar: string | null;
//     };
//     _count: { registrations: number };
//   };
// }

// interface StudentEventsGridProps {
//   registrations: Registration[];
//   title: string;
//   emptyMessage: string;
//   showOngoingBadge?: boolean;
//   showAttendanceStatus?: boolean;
//   itemsPerPage?: number;
// }

// export function StudentEventsGrid({
//   registrations,
//   title,
//   emptyMessage,
//   showOngoingBadge = false,
//   showAttendanceStatus = false,
//   itemsPerPage = 9,
// }: StudentEventsGridProps) {
//   const [currentPage, setCurrentPage] = useState(1);

//   const totalPages = Math.ceil(registrations.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const currentRegistrations = registrations.slice(startIndex, endIndex);

//   if (registrations.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <h3 className="text-lg font-semibold mb-2">{title}</h3>
//         <p className="text-muted-foreground mb-4">{emptyMessage}</p>
//         <Button asChild>
//           <Link href="/events">Browse Events</Link>
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {currentRegistrations.map((registration) => {
//           const { event } = registration;
//           const departmentColor = getDepartmentColor(event.department as any);
//           const bannerUrl = event.imageUrl || getDefaultBanner(event.category);
//           const eventStatus = getEventStatus(event.startDate, event.endDate);

//           return (
//             <Card
//               key={registration.id}
//               className="overflow-hidden hover:shadow-lg transition-shadow"
//             >
//               {/* Event Banner */}
//               <div className="relative h-48 overflow-hidden">
//                 <Image
//                   src={bannerUrl || "/placeholder.svg"}
//                   alt={event.title}
//                   fill
//                   className="object-cover"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

//                 {/* Status Badges */}
//                 <div className="absolute top-3 left-3 flex gap-2">
//                   <Badge variant="secondary" className="bg-white/90 text-black">
//                     {event.category}
//                   </Badge>
//                   {showOngoingBadge && eventStatus === "ongoing" && (
//                     <Badge className="bg-green-500 text-white animate-pulse">
//                       <Clock className="h-3 w-3 mr-1" />
//                       Live
//                     </Badge>
//                   )}
//                   {showAttendanceStatus && registration.checkedIn && (
//                     <Badge className="bg-green-500 text-white">
//                       <CheckCircle className="h-3 w-3 mr-1" />
//                       Attended
//                     </Badge>
//                   )}
//                 </div>

//                 {/* Registration Date */}
//                 <div className="absolute top-3 right-3">
//                   <Badge
//                     variant="secondary"
//                     className="bg-white/90 text-black text-xs"
//                   >
//                     Registered:{" "}
//                     {new Date(registration.createdAt).toLocaleDateString()}
//                   </Badge>
//                 </div>

//                 <div className="absolute bottom-3 left-3 right-3">
//                   <Badge
//                     style={{
//                       backgroundColor: departmentColor + "90",
//                       color: "white",
//                       borderColor: departmentColor,
//                     }}
//                     className="mb-2"
//                   >
//                     {event.department.replace(/_/g, " ")}
//                   </Badge>
//                   <h3 className="text-white font-semibold text-lg line-clamp-2">
//                     {event.title}
//                   </h3>
//                 </div>
//               </div>

//               <CardContent className="p-4 space-y-4">
//                 <p className="text-sm text-muted-foreground line-clamp-2">
//                   {event.description}
//                 </p>

//                 {/* Event Details */}
//                 <div className="space-y-2 text-sm">
//                   <div className="flex items-center gap-2">
//                     <Calendar className="h-4 w-4 text-muted-foreground" />
//                     <span>{formatDisplayDate(event.startDate)}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <MapPin className="h-4 w-4 text-muted-foreground" />
//                     <span className="line-clamp-1">{event.venue}</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <Users className="h-4 w-4 text-muted-foreground" />
//                     <span>{event._count.registrations} registered</span>
//                   </div>
//                 </div>

//                 {/* Tags */}
//                 {event.tags && event.tags.length > 0 && (
//                   <div className="flex flex-wrap gap-1">
//                     {event.tags.slice(0, 3).map((tag) => (
//                       <Badge key={tag} variant="outline" className="text-xs">
//                         {tag}
//                       </Badge>
//                     ))}
//                     {event.tags.length > 3 && (
//                       <Badge variant="outline" className="text-xs">
//                         +{event.tags.length - 3}
//                       </Badge>
//                     )}
//                   </div>
//                 )}

//                 {/* Organizer & Price */}
//                 <div className="flex items-center justify-between pt-2 border-t">
//                   <div className="flex items-center gap-2">
//                     <Avatar className="h-6 w-6">
//                       <AvatarImage
//                         src={event.organizer.avatar || "/placeholder.svg"}
//                       />
//                       <AvatarFallback className="text-xs">
//                         {event.organizer.name.charAt(0)}
//                       </AvatarFallback>
//                     </Avatar>
//                     <span className="text-xs text-muted-foreground">
//                       {event.organizer.name}
//                     </span>
//                   </div>
//                   <div className="flex items-center gap-1">
//                     {/* <IndianRupee className="h-3 w-3" /> */}
//                     <span className="font-medium text-sm">
//                       {event.price === 0 ? "Free" : `₹${event.price}`}
//                     </span>
//                   </div>
//                 </div>

//                 {/* Action Buttons */}
//                 <div className="flex gap-2">
//                   <Button asChild className="flex-1">
//                     <Link href={`/events/${event.id}`}>View Details</Link>
//                   </Button>
//                   {eventStatus === "ongoing" && (
//                     <Button asChild variant="outline">
//                       <Link
//                         href={`/events/${event.id}/check-in?verify=${registration.qrCode}`}
//                       >
//                         <QrCode className="h-4 w-4 mr-2" />
//                         Check In
//                       </Link>
//                     </Button>
//                   )}
//                 </div>

//                 {/* Check-in Status */}
//                 {showAttendanceStatus && (
//                   <div className="text-center text-sm">
//                     {registration.checkedIn ? (
//                       <div className="flex items-center justify-center gap-2 text-green-600">
//                         <CheckCircle className="h-4 w-4" />
//                         <span>
//                           Checked in on{" "}
//                           {new Date(
//                             registration.checkedInAt!
//                           ).toLocaleDateString()}
//                         </span>
//                       </div>
//                     ) : eventStatus === "past" ? (
//                       <div className="text-muted-foreground">
//                         Did not attend
//                       </div>
//                     ) : null}
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           );
//         })}
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="flex items-center justify-center space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//           >
//             <ChevronLeft className="h-4 w-4" />
//             Previous
//           </Button>

//           <div className="flex items-center space-x-1">
//             {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//               <Button
//                 key={page}
//                 variant={currentPage === page ? "default" : "outline"}
//                 size="sm"
//                 onClick={() => setCurrentPage(page)}
//                 className="w-8 h-8 p-0"
//               >
//                 {page}
//               </Button>
//             ))}
//           </div>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//             }
//             disabled={currentPage === totalPages}
//           >
//             Next
//             <ChevronRight className="h-4 w-4" />
//           </Button>
//         </div>
//       )}

//       <div className="text-center text-sm text-muted-foreground">
//         Showing {startIndex + 1} to {Math.min(endIndex, registrations.length)}{" "}
//         of {registrations.length} registrations
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Calendar,
  MapPin,
  Users,
  ExternalLink,
  QrCode,
  Star,
} from "lucide-react";
import Link from "next/link";
import { formatDateForInput, getEventStatus } from "@/lib/timezone";
import { getDepartmentColor } from "@/lib/departments";
import { getDefaultBanner } from "@/lib/utils";

interface StudentEvent {
  id: string;
  title: string;
  description: string;
  category: string;
  department: string;
  venue: string;
  startDate: string;
  endDate: string;
  capacity: number;
  price: number;
  imageUrl?: string;
  organizer: {
    name: string;
    avatar?: string;
  };
  registration: {
    id: string;
    qrCode: string;
    checkedIn: boolean;
    checkedInAt?: string;
    status: string;
    feedbackGiven?: boolean;
  };
  _count: {
    registrations: number;
  };
}

interface StudentEventsGridProps {
  userId: string;
}

export function StudentEventsGrid({ userId }: StudentEventsGridProps) {
  const [events, setEvents] = useState<StudentEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    fetchMyRegistrations();
  }, []);

  const fetchMyRegistrations = async () => {
    try {
      const response = await fetch("/api/registrations/my-events");
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Error fetching registrations:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (event: StudentEvent) => {
    const status = getEventStatus(
      new Date(event.startDate),
      new Date(event.endDate)
    );
    const now = new Date();
    const startDate = new Date(event.startDate);

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
        return event.registration.checkedIn ? (
          <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
            ✓ Attended
          </Badge>
        ) : (
          <Badge variant="outline">Missed</Badge>
        );
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const filterEvents = (events: StudentEvent[], filter: string) => {
    const now = new Date();

    switch (filter) {
      case "upcoming":
        return events.filter((event) => new Date(event.startDate) > now);
      case "ongoing":
        return events.filter((event) => {
          const start = new Date(event.startDate);
          const end = new Date(event.endDate);
          return now >= start && now <= end;
        });
      case "past":
        return events.filter((event) => new Date(event.endDate) < now);
      default:
        return events;
    }
  };

  const filteredEvents = filterEvents(events, activeTab);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <div className="h-48 bg-muted rounded-t-lg" />
            <CardContent className="p-4">
              <div className="h-4 bg-muted rounded mb-2" />
              <div className="h-3 bg-muted rounded mb-4" />
              <div className="flex gap-2">
                <div className="h-6 bg-muted rounded flex-1" />
                <div className="h-6 bg-muted rounded w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({events.length})</TabsTrigger>
          <TabsTrigger value="upcoming">
            Upcoming ({filterEvents(events, "upcoming").length})
          </TabsTrigger>
          <TabsTrigger value="ongoing">
            Ongoing ({filterEvents(events, "ongoing").length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({filterEvents(events, "past").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredEvents.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {activeTab === "all"
                    ? "You haven't registered for any events yet."
                    : `No ${activeTab} events found.`}
                </p>
                <Link href="/events">
                  <Button>Browse Events</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div
                      className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center"
                      style={{
                        backgroundImage: event.imageUrl
                          ? `url(${event.imageUrl})`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {!event.imageUrl && (
                        <div className="text-white text-center">
                          <Calendar className="h-12 w-12 mx-auto mb-2" />
                          <p className="font-semibold">{event.category}</p>
                        </div>
                      )}
                    </div>
                    <div className="absolute top-2 right-2 flex gap-2">
                      {getStatusBadge(event)}
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor:
                            getDepartmentColor(event.department as any) + "20",
                          color: getDepartmentColor(event.department as any),
                          borderColor: getDepartmentColor(
                            event.department as any
                          ),
                        }}
                      >
                        {event.department.replace(/_/g, " ")}
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Avatar className="h-6 w-6">
                          <AvatarImage
                            src={event.organizer.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {event.organizer.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{event.organizer.name}</span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {formatDateForInput(new Date(event.startDate))}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>{event.venue}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          <span>
                            {event._count.registrations} / {event.capacity}{" "}
                            registered
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Link href={`/events/${event.id}`} className="flex-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full bg-transparent"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </Link>

                        {getEventStatus(
                          new Date(event.startDate),
                          new Date(event.endDate)
                        ) === "ongoing" && (
                          <Link
                            href={`/events/${event.id}/check-in?verify=${event.registration.qrCode}`}
                          >
                            <Button
                              size="sm"
                              className="bg-green-500 hover:bg-green-600"
                            >
                              <QrCode className="h-4 w-4 mr-2" />
                              Check In
                            </Button>
                          </Link>
                        )}

                        {getEventStatus(
                          new Date(event.startDate),
                          new Date(event.endDate)
                        ) === "past" &&
                          event.registration.checkedIn &&
                          !event.registration.feedbackGiven && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-yellow-500 text-yellow-600 bg-transparent"
                            >
                              <Star className="h-4 w-4 mr-2" />
                              Feedback
                            </Button>
                          )}
                      </div>

                      {event.registration.checkedIn && (
                        <div className="text-xs text-green-600 bg-green-50 p-2 rounded">
                          ✓ Checked in on{" "}
                          {formatDateForInput(
                            new Date(event.registration.checkedInAt!)
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
