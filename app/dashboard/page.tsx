import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { DashboardStats } from "@/components/dashboard-stats";
import { RecentEvents } from "@/components/recent-events";
import { UpcomingEvents } from "@/components/upcoming-events";
import { QuickActions } from "@/components/quick-actions";

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

  // Fetch dashboard data
  const [totalEvents, myRegistrations, upcomingEvents] = await Promise.all([
    db.event.count({ where: { status: "PUBLISHED" } }),
    db.registration.count({ where: { userId } }),
    db.event.findMany({
      where: {
        status: "PUBLISHED",
        startDate: { gte: new Date() },
      },
      take: 5,
      orderBy: { startDate: "asc" },
      include: {
        organizer: true,
        _count: { select: { registrations: true } },
      },
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your events today.
        </p>
      </div>

      <Suspense fallback={<div>Loading stats...</div>}>
        <DashboardStats
          totalEvents={totalEvents}
          myRegistrations={myRegistrations}
          userRole={user.role}
        />
      </Suspense>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<div>Loading events...</div>}>
          <UpcomingEvents events={upcomingEvents} />
        </Suspense>

        <QuickActions userRole={user.role} />
      </div>

      <Suspense fallback={<div>Loading recent events...</div>}>
        <RecentEvents userId={userId} />
      </Suspense>
    </div>
  );
}
