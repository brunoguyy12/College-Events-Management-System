"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Users,
  CheckCircle,
  Clock,
  AlertCircle,
  Edit,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

interface EventRegistrationProps {
  event: {
    id: string;
    title: string;
    capacity: number;
    price: number;
    startDate: Date;
    endDate: Date;
    organizerId: string;
    _count: {
      registrations: number;
    };
  };
  userId: string | null;
  userRole: string;
  isRegistered: boolean;
}

export function EventRegistration({
  event,
  userId,
  userRole,
  isRegistered,
}: EventRegistrationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const registrationPercentage =
    (event._count.registrations / event.capacity) * 100;
  const spotsLeft = event.capacity - event._count.registrations;
  const isEventFull = spotsLeft <= 0;
  const isEventPast = new Date(event.endDate) < new Date();
  const isEventRegistrationOver = new Date(event.startDate) < new Date();
  const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN";
  const isEventOwner = userId === event.organizerId;

  const handleRegistration = async () => {
    if (!userId) {
      router.push("/sign-in");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id }),
      });

      if (response.ok) {
        toast({
          title: "Registration Successful!",
          description: "You have been registered for this event.",
        });
        router.refresh();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Registration failed");
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // For organizers/admins - show management options
  if (isOrganizer) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Event Management</span>
            <Badge
              variant={isEventOwner ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              <Users className="h-3 w-3" />
              {isEventOwner ? "Your Event" : "Other Event"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Registration Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Registration Progress</span>
              <span>
                {event._count.registrations} / {event.capacity}
              </span>
            </div>
            <Progress value={registrationPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {spotsLeft > 0 ? `${spotsLeft} spots remaining` : "Event is full"}
            </p>
          </div>

          {/* Event Status */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Event Status</span>
              <Badge variant={isEventPast ? "secondary" : "default"}>
                {isEventPast ? "Completed" : "Active"}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {event._count.registrations} participants registered
            </p>
          </div>

          {/* Management Actions */}
          <div className="space-y-3">
            {isEventOwner ? (
              <>
                <Button asChild className="w-full" size="lg">
                  <Link
                    href={`/events/edit/${event.id}`}
                    className="flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    Edit Event
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full bg-transparent"
                  size="lg"
                >
                  <Link
                    href={`/events/${event.id}/participants`}
                    className="flex items-center gap-2"
                  >
                    <Users className="h-4 w-4" />
                    View Participants ({event._count.registrations})
                  </Link>
                </Button>
              </>
            ) : (
              <Button
                asChild
                variant="outline"
                className="w-full bg-transparent"
                size="lg"
              >
                <Link
                  href={`/events/${event.id}/participants`}
                  className="flex items-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  View Participants ({event._count.registrations})
                </Link>
              </Button>
            )}

            <p className="text-xs text-center text-muted-foreground">
              {isEventOwner
                ? "You can edit this event and manage participants."
                : "You can view participant details as an organizer."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // For students - show registration options

  const getRegistrationStatus = () => {
    if (isEventPast) {
      return {
        status: "past",
        icon: Clock,
        message: "Event has ended",
        variant: "secondary" as const,
      };
    }
    if (isRegistered) {
      return {
        status: "registered",
        icon: CheckCircle,
        message: "You're registered!",
        variant: "default" as const,
      };
    }
    if (isEventFull) {
      return {
        status: "full",
        icon: AlertCircle,
        message: "Event is full",
        variant: "destructive" as const,
      };
    }

    if (isEventRegistrationOver) {
      return {
        status: "registration_over",
        icon: Clock,
        message: "Registration Deadline Passed",
        variant: "secondary" as const,
      };
    }
    return {
      status: "available",
      icon: Users,
      message: "Registration open",
      variant: "default" as const,
    };
  };

  const registrationStatus = getRegistrationStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Registration</span>
          <Badge
            variant={registrationStatus.variant}
            className="flex items-center gap-1"
          >
            <registrationStatus.icon className="h-3 w-3" />
            {registrationStatus.message}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Registration Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Registration Progress</span>
            <span>
              {event._count.registrations} / {event.capacity}
            </span>
          </div>
          <Progress value={registrationPercentage} className="h-2" />
          <p className="text-sm text-muted-foreground">
            {spotsLeft > 0
              ? `${spotsLeft} spots remaining`
              : "No spots available"}
          </p>
        </div>

        {/* Price Info */}
        {event.price > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between">
              <span className="font-medium">Registration Fee</span>
              <span className="text-lg font-bold">₹{event.price}</span>
            </div>
          </div>
        )}

        {/* Registration Button */}
        <div className="space-y-3">
          {!userId ? (
            <Button onClick={handleRegistration} className="w-full" size="lg">
              Sign In to Register
            </Button>
          ) : isRegistered ? (
            <Button disabled className="w-full" size="lg">
              <CheckCircle className="h-4 w-4 mr-2" />
              Already Registered
            </Button>
          ) : isEventRegistrationOver ? (
            <Button disabled className="w-full" size="lg">
              <Clock className="h-4 w-4 mr-2" />
              Registration Closed
            </Button>
          ) : isEventPast ? (
            <Button disabled className="w-full" size="lg">
              <Clock className="h-4 w-4 mr-2" />
              Event Ended
            </Button>
          ) : isEventFull ? (
            <Button disabled className="w-full" size="lg">
              <AlertCircle className="h-4 w-4 mr-2" />
              Event Full
            </Button>
          ) : (
            <Button
              onClick={handleRegistration}
              disabled={isLoading}
              className="w-full"
              size="lg"
            >
              {isLoading
                ? "Registering..."
                : event.price === 0
                  ? "Register for Free"
                  : `Register for ₹${event.price}`}
            </Button>
          )}

          {!isRegistered &&
            !isEventPast &&
            !isEventFull &&
            !isEventRegistrationOver && (
              <p className="text-xs text-center text-muted-foreground">
                By registering, you agree to attend the event and follow the
                guidelines.
              </p>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
