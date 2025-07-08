import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EventParticipants } from "@/components/event-participants";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EventParticipantsPageProps {
  params: {
    id: string;
  };
}

export type EventType = Awaited<ReturnType<typeof db.event.findUnique>> & {
  organizer: any;
  registrations: Array<{
    user: {
      id: string;
      name: string;
      email: string;
      avatar: string | null;
    };
    [key: string]: any;
  }>;
};

export default async function EventParticipantsPage({
  params,
}: EventParticipantsPageProps) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";

  if (!isOrganizer) {
    redirect("/events");
  }

  const event = await db.event.findUnique({
    where: { id: params.id },
    include: {
      organizer: true,
      registrations: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!event) {
    notFound();
  }

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Events", href: "/events" },
    { title: event.title, href: `/events/${event.id}` },
    { title: "Participants" },
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
              <h1 className="text-3xl font-bold">Event Participants</h1>
              <p className="text-muted-foreground">
                Manage registrations for {event.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <EventParticipants
        event={event}
        isEventOwner={event.organizerId === userId}
      />
    </div>
  );
}
