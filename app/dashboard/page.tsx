import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentEvents } from "@/components/recent-events";
import { UpcomingEvents } from "@/components/upcoming-events";
import { QuickActions } from "@/components/quick-actions";
import { OrganizerEventSlider } from "@/components/organizer-event-slider";

export default async function DashboardPage() {
  const { userId } = await auth();

  // console.log("User ID from auth:", userId);

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user) {
    return;
  }

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";

  // Fetch different data based on user role
  const [totalEvents, myRegistrations, upcomingEvents, myEventsData] =
    await Promise.all([
      db.event.count({ where: { status: "PUBLISHED" } }),
      db.registration.count({ where: { userId } }),
      db.event.findMany({
        where: {
          status: "PUBLISHED",
          startDate: { gte: new Date() },
        },
        take: isOrganizer ? 3 : 5, // Show fewer for organizers to make room for their events
        orderBy: { startDate: "asc" },
        include: {
          organizer: true,
          _count: { select: { registrations: true } },
        },
      }),
      isOrganizer
        ? Promise.all([
            db.event.count({ where: { organizerId: userId } }),
            db.registration.count({
              where: {
                event: { organizerId: userId },
              },
            }),
            db.event.findMany({
              where: {
                organizerId: userId,
                startDate: { gte: new Date() },
              },
              take: 5,
              include: {
                _count: { select: { registrations: true } },
              },
              orderBy: { startDate: "asc" },
            }),
          ])
        : [0, 0, []],
    ]);

  // Ensure we have proper number values, not arrays
  const myEventsCount =
    typeof myEventsData[0] === "number" ? myEventsData[0] : 0;
  const totalParticipants =
    typeof myEventsData[1] === "number" ? myEventsData[1] : 0;
  const myUpcomingEvents = Array.isArray(myEventsData[2])
    ? myEventsData[2]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user.name ? user.name : user.email}!
        </h1>
        <p className="text-muted-foreground">
          {isOrganizer
            ? "Here's an overview of your events and platform activity."
            : "Here's what's happening with your events today."}
        </p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats
          totalEvents={totalEvents}
          myRegistrations={myRegistrations}
          myEventsCount={myEventsCount}
          totalParticipants={totalParticipants}
          userRole={user.role}
        />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        {isOrganizer ? (
          <Suspense fallback={<div>Loading your events...</div>}>
            <OrganizerEventSlider events={myUpcomingEvents} />
          </Suspense>
        ) : (
          <Suspense fallback={<div>Loading events...</div>}>
            <UpcomingEvents events={upcomingEvents} />
          </Suspense>
        )}

        <QuickActions userRole={user.role} />
      </div>

      {!isOrganizer && (
        <Suspense fallback={<div>Loading recent events...</div>}>
          <RecentEvents userId={userId} />
        </Suspense>
      )}
    </div>
  );
}
