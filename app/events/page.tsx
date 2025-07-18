import { Suspense } from "react";
import { db } from "@/lib/db";
import { EventsGrid } from "@/components/events-grid";
import { EventsFilter } from "@/components/events-filter";
import { EventCategory } from "@prisma/client";

interface EventsPageProps {
  searchParams: {
    category?: EventCategory;
    search?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { category: awaitedCategory, search: awaitedSearch } =
    await searchParams;

  const events = await db.event.findMany({
    where: {
      status: "PUBLISHED",
      endDate: {
        gte: new Date(), // Only show events that haven't ended yet
      },
      ...(awaitedCategory && { category: awaitedCategory }),
      ...(awaitedSearch && {
        OR: [
          { title: { contains: awaitedSearch, mode: "insensitive" } },
          { description: { contains: awaitedSearch, mode: "insensitive" } },
        ],
      }),
    },
    include: {
      organizer: true,
      _count: { select: { registrations: true } },
    },
    orderBy: { startDate: "asc" },
  });

  return (
    <div className="space-y-6 px-6">
      <div>
        <h1 className="text-3xl font-bold">Discover Events</h1>
        <p className="text-muted-foreground">
          Find and register for exciting college events.
        </p>
      </div>

      <EventsFilter />

      <Suspense fallback={<div>Loading events...</div>}>
        <EventsGrid events={events} />
      </Suspense>
    </div>
  );
}
