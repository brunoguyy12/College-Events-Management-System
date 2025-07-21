import { Suspense } from "react";
import { db } from "@/lib/db";
import { EventsGrid } from "@/components/events-grid";
import { EventsFilter } from "@/components/events-filter";
import { EventCategory } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { getAuthUser } from "@/lib/auth";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { EventsGridSkeleton } from "@/components/skeletons/events-skeleton";

interface EventsPageProps {
  searchParams: {
    category?: EventCategory;
    search?: string;
    date?: string
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { category: awaitedCategory, search: awaitedSearch, date: awaitedDate } =
    await searchParams;

    const { userId } = await auth()
  const user = await getAuthUser()

  const breadcrumbItems = [{ title: "Dashboard", href: "/dashboard" }, { title: "Events" }]

  // Build filter conditions
  const where: any = {
    status: "PUBLISHED",
    // Only show upcoming events (not completed)
    endDate: {
      gte: new Date(),
    },
  }

  if (awaitedCategory) {
    where.category = awaitedCategory
  }

  if (awaitedSearch) {
    where.OR = [
      { title: { contains: awaitedSearch, mode: "insensitive" } },
      { description: { contains: awaitedSearch, mode: "insensitive" } },
      { venue: { contains: awaitedSearch, mode: "insensitive" } },
    ]
  }

  if (awaitedDate) {
    const selectedDate = new Date(awaitedDate)
    const nextDay = new Date(selectedDate)
    nextDay.setDate(nextDay.getDate() + 1)

    where.startDate = {
      gte: selectedDate,
      lt: nextDay,
    }
  }

  const events = await db.event.findMany({
    where,
    include: {
      organizer: true,
      _count: { select: { registrations: true } },
      registrations: userId ? { where: { userId } } : false,
    },
    orderBy: { startDate: "asc" },
  });

  // const categories = await db.event.findMany({
  //   where: {
  //     status: "PUBLISHED",
  //     endDate: { gte: new Date() },
  //   },
  //   select: { category: true },
  //   distinct: ["category"],
  // })

  // const uniqueCategories = categories.map((c) => c.category).filter(Boolean)

  return (
    <div className="space-y-6 px-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <BreadcrumbNav items={breadcrumbItems} />
      <div>
        <h1 className="text-3xl font-bold">Discover Events</h1>
        <p className="text-muted-foreground">
          Find and register for exciting college events.
        </p>
      </div>
      </div>

      </div>

      <EventsFilter/>

      <Suspense fallback={<EventsGridSkeleton />}>
        <EventsGrid events={events} />
      </Suspense>

      {events.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            {awaitedSearch || awaitedCategory || awaitedDate
              ? "Try adjusting your filters to find more events."
              : "There are no upcoming events at the moment."}
          </p>
          {user && (user.role === "ORGANIZER" || user.role === "ADMIN") && (
            <Button asChild>
              <Link href="/events/create">Create the first event</Link>
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
