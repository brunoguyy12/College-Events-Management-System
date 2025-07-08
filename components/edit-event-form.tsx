"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  venue: z.string().min(1, "Venue is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
});

type EventFormData = z.infer<typeof eventSchema>;

interface EditEventFormProps {
  event: {
    id: string;
    title: string;
    description: string;
    category: string;
    venue: string;
    startDate: Date;
    endDate: Date;
    capacity: number;
    price: number;
    _count: {
      registrations: number;
    };
  };
  userId: string;
}

export function EditEventForm({ event, userId }: EditEventFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      category: event.category,
      venue: event.venue,
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: new Date(event.endDate).toISOString().slice(0, 16),
      capacity: event.capacity,
      price: event.price,
    },
  });

  const onSubmit = async (data: EventFormData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/events/${event.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event updated successfully!",
        });
        router.push(`/events/${event.id}`);
      } else {
        throw new Error("Failed to update event");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasRegistrations = event._count.registrations > 0;

  return (
    <div className="space-y-6">
      {hasRegistrations && (
        <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">
                This event has {event._count.registrations} registered
                participants. Some changes may affect them.
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Event Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Enter event title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.title.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={form.watch("category")}
                  onValueChange={(value) => form.setValue("category", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SEMINAR">Seminar</SelectItem>
                    <SelectItem value="WORKSHOP">Workshop</SelectItem>
                    <SelectItem value="HACKATHON">Hackathon</SelectItem>
                    <SelectItem value="FEST">Fest</SelectItem>
                    <SelectItem value="CONFERENCE">Conference</SelectItem>
                    <SelectItem value="SPORTS">Sports</SelectItem>
                    <SelectItem value="CULTURAL">Cultural</SelectItem>
                    <SelectItem value="ACADEMIC">Academic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Describe your event..."
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input
                  id="venue"
                  {...form.register("venue")}
                  placeholder="Event venue"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">
                  Capacity
                  {hasRegistrations && (
                    <Badge variant="secondary" className="ml-2">
                      {event._count.registrations} registered
                    </Badge>
                  )}
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  {...form.register("capacity", { valueAsNumber: true })}
                  placeholder="Maximum attendees"
                  min={event._count.registrations} // Can't reduce below current registrations
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date & Time</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  {...form.register("startDate")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date & Time</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  {...form.register("endDate")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (₹)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...form.register("price", { valueAsNumber: true })}
                placeholder="0.00"
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Event"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
