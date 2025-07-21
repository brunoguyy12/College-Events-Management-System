import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { QRScanner } from "@/components/qr-scanner";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface CheckInPageProps {
  params: {
    id: string;
  };
}

export default async function CheckInPage({ params }: CheckInPageProps) {
  const { userId } = await auth();
  const user = await getAuthUser();
  const { id } = await params;

  if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
    return <div>Access denied. Only organizers can access this page.</div>;
  }

  const event = await db.event.findUnique({
    where: { id: id },
    include: {
      organizer: true,
      _count: { select: { registrations: true } },
    },
  });

  if (!event) {
    notFound();
  }

  // Check if user can manage this event
  const canManage = user.role === "ADMIN" || event.organizerId === userId;

  if (!canManage) {
    return <div>You don't have permission to manage this event.</div>;
  }

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Events", href: "/events" },
    { title: event.title, href: `/events/${event.id}` },
    { title: "Check-in" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <BreadcrumbNav items={breadcrumbItems} />
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/events/${event.id}`}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Event
            </Link>
          </Button>
        </div>
      </div>

      <QRScanner eventId={event.id} eventTitle={event.title} />
    </div>
  );
}
