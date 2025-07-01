import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CalendarView } from "@/components/calendar-view";
import { UpcomingEventsCalendar } from "@/components/upcoming-events-calendar";
import { CalendarStats } from "@/components/calendar-stats";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default async function CalendarPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Ensure user exists in database
  await db.user.upsert({
    where: { id: userId },
    update: {
      email: user.email,
      name: user.name,
      role: user.role as any,
    },
    create: {
      id: userId,
      email: user.email,
      name: user.name,
      role: user.role as any,
    },
  });

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";

  // Fetch calendar data based on user role
  const [userEvents, organizedEvents, allUpcomingEvents] = await Promise.all([
    // Events user is registered for
    db.registration.findMany({
      where: { userId },
      include: {
        event: {
          include: {
            organizer: true,
            _count: { select: { registrations: true } },
          },
        },
      },
      orderBy: { event: { startDate: "asc" } },
    }),
    // Events user organized (if organizer)
    isOrganizer
      ? db.event.findMany({
          where: { organizerId: userId },
          include: {
            _count: { select: { registrations: true } },
          },
          orderBy: { startDate: "asc" },
        })
      : [],
    // All upcoming events for discovery
    db.event.findMany({
      where: {
        status: "PUBLISHED",
        startDate: { gte: new Date() },
      },
      take: 10,
      include: {
        organizer: true,
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: "asc" },
    }),
  ]);

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Calendar" },
  ];

  return (
    <div className="space-y-6 px-6">
      <div className="space-y-2">
        <BreadcrumbNav items={breadcrumbItems} />
        <div>
          <h1 className="text-3xl font-bold">My Calendar</h1>
          <p className="text-muted-foreground">
            {isOrganizer
              ? "Manage your events and track your registrations"
              : "Keep track of your registered events and discover new ones"}
          </p>
        </div>
      </div>

      <CalendarStats
        userEvents={userEvents}
        organizedEvents={organizedEvents}
        isOrganizer={isOrganizer}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CalendarView
            userEvents={userEvents}
            organizedEvents={organizedEvents}
            isOrganizer={isOrganizer}
          />
        </div>
        <div>
          <UpcomingEventsCalendar
            userEvents={userEvents}
            organizedEvents={organizedEvents}
            allUpcomingEvents={allUpcomingEvents}
            isOrganizer={isOrganizer}
          />
        </div>
      </div>
    </div>
  );
}
