import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { EnhancedEventsGrid } from "@/components/enhanced-events-grid";
import { EventsFilter } from "@/components/events-filter";
import { EventsGridSkeleton } from "@/components/skeletons/events-skeleton";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Calendar, History, Clock } from "lucide-react";
import Link from "next/link";
import { EventsGrid } from "@/components/events-grid";

interface EventsPageProps {
  searchParams: {
    category?: string;
    search?: string;
    date?: string;
    department?: string;
  };
}

export default async function EventsPage({ searchParams }: EventsPageProps) {
  const { userId } = await auth();
  const user = await getAuthUser();

  const { category, search, date, department } = await searchParams;

  // Base filter conditions
  const baseWhere: any = {
    status: { in: ["PUBLISHED", "COMPLETED"] },
  };

  if (category && category !== "all") {
    baseWhere.category = category;
  }

  if (department && department !== "all") {
    baseWhere.department = department;
  }

  if (search) {
    baseWhere.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { venue: { contains: search, mode: "insensitive" } },
    ];
  }

  if (date) {
    const selectedDate = new Date(date);
    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    baseWhere.startDate = {
      gte: selectedDate,
      lt: nextDay,
    };
  }

  const now = new Date();

  // Upcoming events (not ended yet)
  const upcomingEvents = await db.event.findMany({
    where: {
      ...baseWhere,
      endDate: {
        gte: now,
      },
    },
    include: {
      organizer: {
        select: {
          name: true,
          avatar: true,
        },
      },
      _count: { select: { registrations: true } },
      registrations: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
    orderBy: { startDate: "asc" },
  });

  // Ongoing events (started but not ended)
  const ongoingEvents = await db.event.findMany({
    where: {
      ...baseWhere,
      status: { in: ["PUBLISHED", "ONGOING"] },
      startDate: {
        lte: now,
      },
      endDate: {
        gte: now,
      },
    },
    include: {
      organizer: {
        select: {
          name: true,
          avatar: true,
        },
      },
      _count: { select: { registrations: true } },
      registrations: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
    orderBy: { startDate: "asc" },
  });

  // Past events (already ended)
  const pastEvents = await db.event.findMany({
    where: {
      ...baseWhere,
      endDate: {
        lt: now,
      },
    },
    include: {
      organizer: {
        select: {
          name: true,
          avatar: true,
        },
      },
      _count: { select: { registrations: true } },
      registrations: userId
        ? {
            where: { userId },
            select: { id: true },
          }
        : false,
    },
    orderBy: { startDate: "desc" },
  });

  const canCreateEvent =
    user && (user.role === "ORGANIZER" || user.role === "ADMIN");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">College Events</h1>
          <p className="text-muted-foreground">
            Discover and participate in exciting college events
          </p>
        </div>
        {/* {canCreateEvent && (
          <Button asChild>
            <Link href="/events/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
        )} */}
      </div>

      <EventsFilter />

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Ongoing ({ongoingEvents.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Past ({pastEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Suspense fallback={<EventsGridSkeleton />}>
            <EnhancedEventsGrid
              events={upcomingEvents}
              currentUserId={userId}
            />
          </Suspense>
          {upcomingEvents.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                No upcoming events found
              </h3>
              <p className="text-muted-foreground mb-4">
                {search || category || date || department
                  ? "Try adjusting your filters to find more events."
                  : "There are no upcoming events at the moment."}
              </p>
              {canCreateEvent && (
                <Button asChild>
                  <Link href="/events/create">Create the first event</Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="ongoing">
          <Suspense fallback={<EventsGridSkeleton />}>
            <EnhancedEventsGrid
              events={ongoingEvents}
              currentUserId={userId}
              showOngoingBadge={true}
            />
          </Suspense>
          {ongoingEvents.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">No ongoing events</h3>
              <p className="text-muted-foreground">
                {search || category || date || department
                  ? "Try adjusting your filters to find ongoing events."
                  : "There are no events happening right now."}
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          <Suspense fallback={<EventsGridSkeleton />}>
            <EnhancedEventsGrid events={pastEvents} currentUserId={userId} />
          </Suspense>
          {pastEvents.length === 0 && (
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold mb-2">
                No past events found
              </h3>
              <p className="text-muted-foreground">
                {search || category || date || department
                  ? "Try adjusting your filters to find more past events."
                  : "There are no past events to display."}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
