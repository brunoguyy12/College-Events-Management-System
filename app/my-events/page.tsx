import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { MyEventsGrid } from "@/components/my-events-grid";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function MyEventsPage() {
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
    redirect("/dashboard");
  }

  const events = await db.event.findMany({
    where: { organizerId: userId },
    include: {
      _count: { select: { registrations: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Events", href: "/events" },
    { title: "My Events" },
  ];

  return (
    <div className="space-y-6 px-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <BreadcrumbNav items={breadcrumbItems} />
          <div>
            <h1 className="text-3xl font-bold">My Events</h1>
            <p className="text-muted-foreground">
              Manage and track your organized events.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/events/create" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <MyEventsGrid events={events} />
    </div>
  );
}
