// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Separator } from "@/components/ui/separator";
// import {
//   Calendar,
//   MapPin,
//   Users,
//   Clock,
//   Star,
//   IndianRupee,
//   Award,
//   BookOpen,
//   MessageCircle,
// } from "lucide-react";
// import { getDepartmentColor } from "@/lib/departments";
// import Image from "next/image";
// import { getDefaultBanner } from "@/lib/utils";
// import { Prisma } from "@prisma/client";

// export interface Speaker {
//   name: string;
//   bio: string;
//   expertise: string;
//   linkedIn?: string;
// }

// export interface AgendaItem {
//   time: string;
//   title: string;
//   description: string;
//   speaker?: string;
// }

// export interface Prize {
//   position: string;
//   amount: string;
//   description: string;
// }

// export interface FAQ {
//   question: string;
//   answer: string;
// }

// export interface EnhancedEventDetailsProps {
//   event: {
//     id: string;
//     title: string;
//     description: string;
//     category: string;
//     department: string;
//     venue: string;
//     startDate: Date;
//     endDate: Date;
//     capacity: number;
//     price: number;
//     imageUrl: string | null;
//     tags: string[];
//     speakers: Speaker[] | null;
//     agenda: AgendaItem[] | null;
//     prizes: Prize[] | null;
//     rules: string[] | null;
//     requirements: string[] | null;
//     faqs: FAQ[] | null;
//     aiScore: number | null;
//     organizer: {
//       name: string;
//       avatar: string | null;
//     };
//     _count: {
//       registrations: number;
//     };
//   };
// }

// export function EnhancedEventDetails({ event }: EnhancedEventDetailsProps) {
//   const formatDate = (date: Date) => {
//     return new Intl.DateTimeFormat("en-US", {
//       weekday: "long",
//       year: "numeric",
//       month: "long",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(new Date(date));
//   };

//   const duration = Math.ceil(
//     (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
//       (1000 * 60 * 60)
//   );

//   const departmentColor = getDepartmentColor(event.department);
//   const bannerUrl = event.imageUrl || getDefaultBanner(event.category);

//   return (
//     <div className="space-y-6">
//       {/* Hero Banner */}
//       <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
//         <Image
//           src={bannerUrl || "/placeholder.svg"}
//           alt={event.title}
//           fill
//           className="object-cover"
//         />
//         <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
//         <div className="absolute bottom-4 left-4 right-4 text-white">
//           <div className="flex items-center gap-2 mb-2">
//             <Badge
//               variant="secondary"
//               className="bg-white/20 text-white border-white/30"
//             >
//               {event.category}
//             </Badge>
//             <Badge
//               style={{
//                 backgroundColor: departmentColor + "40",
//                 color: "white",
//                 borderColor: departmentColor,
//               }}
//             >
//               {event.department}
//             </Badge>
//             {/* {event.aiScore && (
//               <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
//                 <Star className="h-3 w-3 text-yellow-400" />
//                 <span>{event.aiScore}/100 AI Score</span>
//               </div>
//             )} */}
//           </div>
//           <h1 className="text-2xl md:text-4xl font-bold mb-2">{event.title}</h1>
//           <div className="flex items-center gap-4 text-sm">
//             <div className="flex items-center gap-1">
//               <Calendar className="h-4 w-4" />
//               <span>{new Date(event.startDate).toLocaleDateString()}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <MapPin className="h-4 w-4" />
//               <span>{event.venue}</span>
//             </div>
//             <div className="flex items-center gap-1">
//               <Users className="h-4 w-4" />
//               <span>{event._count.registrations} registered</span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Organizer Info */}
//       <Card>
//         <CardContent className="pt-6">
//           <div className="flex items-center gap-3">
//             <Avatar className="h-12 w-12">
//               <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
//               <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
//             </Avatar>
//             <div>
//               <p className="font-medium">Organized by {event.organizer.name}</p>
//               <p className="text-sm text-muted-foreground">
//                 {event.department}
//               </p>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Event Info Grid */}
//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Calendar className="h-5 w-5" />
//               Date & Time
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div>
//               <p className="font-medium">Start</p>
//               <p className="text-sm text-muted-foreground">
//                 {formatDate(event.startDate)}
//               </p>
//             </div>
//             <div>
//               <p className="font-medium">End</p>
//               <p className="text-sm text-muted-foreground">
//                 {formatDate(event.endDate)}
//               </p>
//             </div>
//             <div className="flex items-center gap-2 text-sm">
//               <Clock className="h-4 w-4" />
//               <span>Duration: {duration} hours</span>
//             </div>
//           </CardContent>
//         </Card>

//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <MapPin className="h-5 w-5" />
//               Location & Details
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3">
//             <div>
//               <p className="font-medium">Venue</p>
//               <p className="text-sm text-muted-foreground">{event.venue}</p>
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <Users className="h-4 w-4" />
//                 <span className="text-sm">
//                   {event._count.registrations} / {event.capacity} registered
//                 </span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <IndianRupee className="h-4 w-4" />
//                 <span className="font-medium">
//                   {event.price === 0 ? "Free" : `₹${event.price}`}
//                 </span>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Description */}
//       <Card>
//         <CardHeader>
//           <CardTitle>About This Event</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p className="text-muted-foreground leading-relaxed">
//             {event.description}
//           </p>
//           {event.tags && event.tags.length > 0 && (
//             <div className="flex flex-wrap gap-2 mt-4">
//               {event.tags.map((tag) => (
//                 <Badge key={tag} variant="outline">
//                   {tag}
//                 </Badge>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Speakers Section */}
//       {event.speakers && event.speakers.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Users className="h-5 w-5" />
//               Speakers
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {event.speakers.map((speaker, index) => (
//               <div key={index} className="p-4 border rounded-lg">
//                 <div className="flex items-start gap-3">
//                   <Avatar className="h-12 w-12">
//                     <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <h4 className="font-medium">{speaker.name}</h4>
//                     <p className="text-sm text-muted-foreground mb-2">
//                       {speaker.expertise}
//                     </p>
//                     <p className="text-sm">{speaker.bio}</p>
//                     {speaker.linkedIn && (
//                       <a
//                         href={speaker.linkedIn}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                         className="text-sm text-blue-600 hover:underline mt-2 inline-block"
//                       >
//                         LinkedIn Profile
//                       </a>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       )}

//       {/* Agenda Section */}
//       {event.agenda && event.agenda.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Clock className="h-5 w-5" />
//               Agenda
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {event.agenda.map((item, index) => (
//               <div key={index} className="flex gap-4">
//                 <div className="w-20 text-sm font-medium text-muted-foreground">
//                   {item.time}
//                 </div>
//                 <div className="flex-1">
//                   <h4 className="font-medium">{item.title}</h4>
//                   {item.speaker && (
//                     <p className="text-sm text-muted-foreground">
//                       by {item.speaker}
//                     </p>
//                   )}
//                   <p className="text-sm mt-1">{item.description}</p>
//                 </div>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       )}

//       {/* Prizes Section */}
//       {event.prizes && event.prizes.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Award className="h-5 w-5" />
//               Prizes
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {event.prizes.map((prize, index) => (
//               <div key={index} className="p-4 border rounded-lg">
//                 <div className="flex items-center justify-between mb-2">
//                   <h4 className="font-medium">{prize.position}</h4>
//                   <Badge variant="secondary">{prize.amount}</Badge>
//                 </div>
//                 <p className="text-sm text-muted-foreground">
//                   {prize.description}
//                 </p>
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       )}

//       {/* Rules Section */}
//       {event.rules && event.rules.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BookOpen className="h-5 w-5" />
//               Rules & Regulations
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {event.rules.map((rule, index) => (
//                 <li key={index} className="flex items-start gap-2 text-sm">
//                   <span className="text-muted-foreground mt-1">•</span>
//                   <span>{rule}</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       )}

//       {/* Requirements Section */}
//       {event.requirements && event.requirements.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <BookOpen className="h-5 w-5" />
//               Prerequisites & Requirements
//             </CardTitle>
//           </CardHeader>
//           <CardContent>
//             <ul className="space-y-2">
//               {event.requirements.map((req, index) => (
//                 <li key={index} className="flex items-start gap-2 text-sm">
//                   <span className="text-muted-foreground mt-1">•</span>
//                   <span>{req}</span>
//                 </li>
//               ))}
//             </ul>
//           </CardContent>
//         </Card>
//       )}

//       {/* FAQs Section */}
//       {event.faqs && event.faqs.length > 0 && (
//         <Card>
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <MessageCircle className="h-5 w-5" />
//               Frequently Asked Questions
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             {event.faqs.map((faq, index) => (
//               <div key={index}>
//                 <h4 className="font-medium mb-2">{faq.question}</h4>
//                 <p className="text-sm text-muted-foreground">{faq.answer}</p>
//                 {index < event.faqs!.length - 1 && (
//                   <Separator className="mt-4" />
//                 )}
//               </div>
//             ))}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  IndianRupee,
  MessageSquare,
  Award,
  BookOpen,
  HelpCircle,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { formatDateForInput, getEventStatus } from "@/lib/timezone";
import { getDepartmentColor } from "@/lib/departments";

interface EventDetailsProps {
  event: {
    id: string;
    title: string;
    description: string;
    category: string;
    department: string;
    venue: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    price: number;
    imageUrl?: string;
    aiScore: number | null;
    speakers?: any[];
    agenda?: any[];
    prizes?: any[];
    rules?: string[];
    requirements?: string[];
    faqs?: any[];
    organizer: {
      name: string;
      avatar?: string;
    };
    _count: {
      registrations: number;
    };
  };
}

interface Feedback {
  id: string;
  rating: number;
  comment?: string;
  user: {
    name: string;
    avatar?: string;
  };
  createdAt: string;
}

export function EnhancedEventDetails({ event }: EventDetailsProps) {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [averageRating, setAverageRating] = useState(0);

  const eventStatus = getEventStatus(event.startDate, event.endDate);
  const isCompleted = eventStatus === "past";

  useEffect(() => {
    if (isCompleted) {
      fetchFeedback();
    }
  }, [event.id, isCompleted]);

  const fetchFeedback = async () => {
    setLoadingFeedback(true);
    try {
      const response = await fetch(`/api/events/${event.id}/feedback`);
      if (response.ok) {
        const data = await response.json();
        setFeedback(data.feedback);
        setAverageRating(data.averageRating);
      }
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const formatDate = (date: Date) => {
    return formatDateForInput(date);
  };

  const duration = Math.ceil(
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
      (1000 * 60 * 60)
  );

  const getStatusBadge = () => {
    switch (eventStatus) {
      case "upcoming":
        return <Badge variant="secondary">Upcoming</Badge>;
      case "ongoing":
        return (
          <Badge
            variant="default"
            className="bg-green-500 hover:bg-green-600 animate-pulse"
          >
            🔴 Live Now
          </Badge>
        );
      case "past":
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary">{event.category}</Badge>
              <Badge
                variant="secondary"
                style={{
                  backgroundColor:
                    getDepartmentColor(event.department as any) + "20",
                  color: getDepartmentColor(event.department as any),
                  borderColor: getDepartmentColor(event.department as any),
                }}
              >
                {event.department.replace(/_/g, " ")}
              </Badge>
              {getStatusBadge()}
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
            <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
            <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">Organized by {event.organizer.name}</p>
            <p className="text-sm text-muted-foreground">Event Organizer</p>
          </div>
        </div>
      </div>

      {/* Event Banner */}
      {event.imageUrl && (
        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
          <img
            src={event.imageUrl || "/placeholder.svg"}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <Tabs defaultValue="details" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          {isCompleted && (
            <TabsTrigger value="feedback">
              Feedback ({feedback.length})
            </TabsTrigger>
          )}
          <TabsTrigger value="info">Info</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
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
                  <p className="text-sm text-muted-foreground">
                    {formatDate(event.startDate)}
                  </p>
                </div>
                <div>
                  <p className="font-medium">End</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(event.endDate)}
                  </p>
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
                    <span className="font-medium">
                      {event.price === 0 ? "Free" : `₹${event.price}`}
                    </span>
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
              <p className="text-muted-foreground leading-relaxed">
                {event.description}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Speakers */}
          {event.speakers && event.speakers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Speakers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.speakers.map((speaker: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{speaker.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {speaker.expertise}
                      </p>
                      <p className="text-sm mt-2">{speaker.bio}</p>
                      {speaker.linkedIn && (
                        <a
                          href={speaker.linkedIn}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 text-sm hover:underline"
                        >
                          LinkedIn Profile
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Agenda */}
          {event.agenda && event.agenda.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Agenda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.agenda.map((item: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge variant="outline">{item.time}</Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{item.title}</h4>
                      {item.speaker && (
                        <p className="text-sm text-muted-foreground">
                          by {item.speaker}
                        </p>
                      )}
                      <p className="text-sm mt-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Prizes */}
          {event.prizes && event.prizes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Prizes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.prizes.map((prize: any, index: number) => (
                  <div key={index} className="flex gap-4 p-4 border rounded-lg">
                    <div className="flex-shrink-0">
                      <Badge variant="secondary">{prize.position}</Badge>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{prize.amount}</h4>
                      <p className="text-sm text-muted-foreground">
                        {prize.description}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {isCompleted && (
          <TabsContent value="feedback" className="space-y-6">
            {/* Feedback Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Event Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold">
                      {averageRating.toFixed(1)}
                    </div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      {renderStars(Math.round(averageRating))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {feedback.length} review{feedback.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Separator orientation="vertical" className="h-16" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      Feedback from participants who attended this event
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Individual Feedback */}
            <div className="space-y-4">
              {loadingFeedback ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="space-y-2">
                          <div className="h-4 bg-muted rounded w-1/4" />
                          <div className="h-3 bg-muted rounded w-full" />
                          <div className="h-3 bg-muted rounded w-3/4" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ) : feedback.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">
                      No feedback yet
                    </h3>
                    <p className="text-muted-foreground text-center">
                      Be the first to share your experience about this event!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                feedback.map((review) => (
                  <Card key={review.id}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={review.user.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback className="text-xs">
                            {review.user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm">
                              {review.user.name}
                            </span>
                            <div className="flex items-center gap-1">
                              {renderStars(review.rating)}
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {formatDateForInput(new Date(review.createdAt))}
                            </span>
                          </div>
                          {review.comment && (
                            <p className="text-sm text-muted-foreground">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        )}

        <TabsContent value="info" className="space-y-6">
          {/* Rules */}
          {event.rules && event.rules.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Rules & Regulations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.rules.map((rule: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {event.requirements && event.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Prerequisites & Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {event.requirements.map((req: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* FAQs */}
          {event.faqs && event.faqs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {event.faqs.map((faq: any, index: number) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-semibold text-sm">{faq.question}</h4>
                    <p className="text-sm text-muted-foreground pl-4 border-l-2 border-muted">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
