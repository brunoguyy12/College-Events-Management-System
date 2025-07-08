import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EventDetails } from "@/components/event-details";
import { EventRegistration } from "@/components/event-registration";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface EventPageProps {
  params: {
    id: string;
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { userId } = await auth();
  const user = await getAuthUser();
  const { id: eventID } = await params;

  const event = await db.event.findUnique({
    where: { id: eventID },
    include: {
      organizer: true,
      registrations: userId
        ? {
            where: { userId },
          }
        : false,
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    notFound();
  }

  const isRegistered =
    userId && event.registrations && event.registrations.length > 0;

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Events", href: "/events" },
    { title: event.title },
  ];

  return (
    // <div className="max-w-4xl mx-auto space-y-8">
    //   <EventDetails event={event} />
    //   <EventRegistration
    //     event={event}
    //     userId={userId}
    //     isRegistered={!!isRegistered}
    //   />
    // </div>
    <div className="space-y-6 px-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <BreadcrumbNav items={breadcrumbItems} />
          <Button variant="outline" size="sm" asChild>
            <Link href="/events" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
      </div>

      <div className=" grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <EventDetails event={event} />
        </div>
        <div>
          {/* <EventRegistration
            event={event}
            userId={userId}
            isRegistered={!!isRegistered}
          /> */}
          <EventRegistration
            event={event}
            userId={userId}
            userRole={user?.role || "STUDENT"}
            isRegistered={!!isRegistered}
          />
        </div>
      </div>
    </div>
  );
}
