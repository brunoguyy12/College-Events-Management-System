import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
// import { EditEventForm } from "@/components/edit-event-form";
import {
  EnhancedEditEventForm,
  EnhancedEditEventFormProps,
} from "@/components/enhanced-event-form-edit";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditEventPageProps {
  params: {
    id: string;
  };
}

export default async function EditEventPage({ params }: EditEventPageProps) {
  const { userId } = await auth();
  const { id } = await params;

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const event = await db.event.findUnique({
    where: { id: id },
    include: {
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    notFound();
  }

  // Check if user can edit this event
  if (event.organizerId !== userId && user.role !== "ADMIN") {
    redirect("/events");
  }

  const breadcrumbItems = [
    // { title: "Dashboard", href: "/dashboard" },
    { title: "Events", href: "/events" },
    { title: event.title, href: `/events/${event.id}` },
    { title: "Edit", href: `/events/edit/${event.id}` },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/events/${event.id}`}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Event
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Edit Event</h1>
              <p className="text-muted-foreground">
                Update your event details and settings.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        {/* <EditEventForm event={event} userId={userId} /> */}
        <EnhancedEditEventForm
          event={event as EnhancedEditEventFormProps["event"]}
          userId={userId}
        />
      </div>
    </div>
  );
}
