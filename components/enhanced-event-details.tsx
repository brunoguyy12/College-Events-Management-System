import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Star,
  IndianRupee,
  Award,
  BookOpen,
  MessageCircle,
} from "lucide-react";
import { getDepartmentColor } from "@/lib/departments";
import Image from "next/image";
import { getDefaultBanner } from "@/lib/utils";
import { Prisma } from "@prisma/client";

interface Speaker {
  name: string;
  bio: string;
  expertise: string;
  linkedIn?: string;
}

interface AgendaItem {
  time: string;
  title: string;
  description: string;
  speaker?: string;
}

interface Prize {
  position: string;
  amount: string;
  description: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface EnhancedEventDetailsProps {
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
    imageUrl: string | null;
    tags: string[];
    speakers: Speaker[] | null;
    agenda: AgendaItem[] | null;
    prizes: Prize[] | null;
    rules: string[] | null;
    requirements: string[] | null;
    faqs: FAQ[] | null;
    aiScore: number | null;
    organizer: {
      name: string;
      avatar: string | null;
    };
    _count: {
      registrations: number;
    };
  };
}

export function EnhancedEventDetails({ event }: EnhancedEventDetailsProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const duration = Math.ceil(
    (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) /
      (1000 * 60 * 60)
  );

  const departmentColor = getDepartmentColor(event.department);
  const bannerUrl = event.imageUrl || getDefaultBanner(event.category);

  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
        <Image
          src={bannerUrl || "/placeholder.svg"}
          alt={event.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="secondary"
              className="bg-white/20 text-white border-white/30"
            >
              {event.category}
            </Badge>
            <Badge
              style={{
                backgroundColor: departmentColor + "40",
                color: "white",
                borderColor: departmentColor,
              }}
            >
              {event.department}
            </Badge>
            {event.aiScore && (
              <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded">
                <Star className="h-3 w-3 text-yellow-400" />
                <span>{event.aiScore}/100 AI Score</span>
              </div>
            )}
          </div>
          <h1 className="text-2xl md:text-4xl font-bold mb-2">{event.title}</h1>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.startDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{event._count.registrations} registered</span>
            </div>
          </div>
        </div>
      </div>

      {/* Organizer Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={event.organizer.avatar || "/placeholder.svg"} />
              <AvatarFallback>{event.organizer.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Organized by {event.organizer.name}</p>
              <p className="text-sm text-muted-foreground">
                {event.department}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Info Grid */}
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
          {event.tags && event.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {event.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Speakers Section */}
      {event.speakers && event.speakers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Speakers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.speakers.map((speaker, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-start gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{speaker.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{speaker.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {speaker.expertise}
                    </p>
                    <p className="text-sm">{speaker.bio}</p>
                    {speaker.linkedIn && (
                      <a
                        href={speaker.linkedIn}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                      >
                        LinkedIn Profile
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Agenda Section */}
      {event.agenda && event.agenda.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Agenda
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.agenda.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="w-20 text-sm font-medium text-muted-foreground">
                  {item.time}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{item.title}</h4>
                  {item.speaker && (
                    <p className="text-sm text-muted-foreground">
                      by {item.speaker}
                    </p>
                  )}
                  <p className="text-sm mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Prizes Section */}
      {event.prizes && event.prizes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Prizes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.prizes.map((prize, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{prize.position}</h4>
                  <Badge variant="secondary">{prize.amount}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {prize.description}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Rules Section */}
      {event.rules && event.rules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Rules & Regulations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {event.rules.map((rule, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Requirements Section */}
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
              {event.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span className="text-muted-foreground mt-1">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* FAQs Section */}
      {event.faqs && event.faqs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {event.faqs.map((faq, index) => (
              <div key={index}>
                <h4 className="font-medium mb-2">{faq.question}</h4>
                <p className="text-sm text-muted-foreground">{faq.answer}</p>
                {index < event.faqs!.length - 1 && (
                  <Separator className="mt-4" />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
