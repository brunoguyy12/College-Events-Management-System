"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CheckCircle,
  Users,
  TrendingUp,
  Calendar,
  AlertTriangle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventCompletionProps {
  event: {
    id: string;
    title: string;
    status: string;
    endDate: Date;
    capacity: number;
    _count: {
      registrations: number;
    };
  };
  checkedInCount: number;
  isEventOwner: boolean;
}

export function EventCompletion({
  event,
  checkedInCount,
  isEventOwner,
}: EventCompletionProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const isEventEnded = new Date() > new Date(event.endDate);
  const isCompleted = event.status === "COMPLETED";
  const attendanceRate =
    event._count.registrations > 0
      ? (checkedInCount / event._count.registrations) * 100
      : 0;

  const handleCompleteEvent = async () => {
    if (!isEventOwner) return;

    setIsCompleting(true);
    try {
      const response = await fetch(`/api/events/${event.id}/complete`, {
        method: "POST",
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Event Completed",
          description: `${event.title} has been marked as completed with ${data.analytics.attendanceRate.toFixed(1)}% attendance.`,
        });
        router.refresh();
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to complete event");
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to complete event",
        variant: "destructive",
      });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Event Status</span>
          <Badge
            variant={
              isCompleted ? "default" : isEventEnded ? "secondary" : "outline"
            }
            className="flex items-center gap-1"
          >
            {isCompleted ? (
              <>
                <CheckCircle className="h-3 w-3" />
                Completed
              </>
            ) : isEventEnded ? (
              <>
                <Calendar className="h-3 w-3" />
                Ended
              </>
            ) : (
              <>
                <TrendingUp className="h-3 w-3" />
                Ongoing
              </>
            )}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Event Statistics */}
        <div className="grid gap-4 md:grid-cols-3">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-primary/10 rounded-full">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <p className="text-2xl font-bold">{event._count.registrations}</p>
            <p className="text-sm text-muted-foreground">Registered</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-secondary/10 rounded-full">
              <CheckCircle className="h-4 w-4 text-secondary" />
            </div>
            <p className="text-2xl font-bold">{checkedInCount}</p>
            <p className="text-sm text-muted-foreground">Attended</p>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-accent/10 rounded-full">
              <TrendingUp className="h-4 w-4 text-accent" />
            </div>
            <p className="text-2xl font-bold">{attendanceRate.toFixed(1)}%</p>
            <p className="text-sm text-muted-foreground">Attendance</p>
          </div>
        </div>

        {/* Attendance Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Attendance Rate</span>
            <span>
              {checkedInCount} / {event._count.registrations}
            </span>
          </div>
          <Progress value={attendanceRate} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {attendanceRate >= 80
              ? "Excellent attendance!"
              : attendanceRate >= 60
                ? "Good attendance"
                : "Consider improving engagement for future events"}
          </p>
        </div>

        {/* Event Completion Actions */}
        {isEventOwner && (
          <div className="space-y-4">
            {!isEventEnded && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Event is still ongoing. You can complete it after the end
                  time.
                </AlertDescription>
              </Alert>
            )}

            {isEventEnded && !isCompleted && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Event has ended. You can now mark it as completed to finalize
                  analytics.
                </AlertDescription>
              </Alert>
            )}

            {isCompleted && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Event has been completed. Analytics have been finalized.
                </AlertDescription>
              </Alert>
            )}

            {isEventEnded && !isCompleted && (
              <Button
                onClick={handleCompleteEvent}
                disabled={isCompleting}
                className="w-full"
                size="lg"
              >
                {isCompleting ? "Completing..." : "Mark Event as Completed"}
              </Button>
            )}
          </div>
        )}

        {/* Event Timeline */}
        <div className="pt-4 border-t">
          <h4 className="font-medium mb-3">Event Timeline</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span>Event Date:</span>
              <span>{new Date(event.endDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Status:</span>
              <span
                className={
                  isCompleted
                    ? "text-green-600"
                    : isEventEnded
                      ? "text-orange-600"
                      : "text-blue-600"
                }
              >
                {isCompleted ? "Completed" : isEventEnded ? "Ended" : "Ongoing"}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
