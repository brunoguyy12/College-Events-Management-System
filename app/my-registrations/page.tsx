import { Suspense } from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { StudentEventsGrid } from "@/components/student-events-grid";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Calendar, Clock, CheckCircle } from "lucide-react";
import { db } from "@/lib/db";

export default async function MyRegistrationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const breadcrumbItems = [
    { title: "Events", href: "/events" },
    { title: "My Registrations", href: "/my-registrations" },
  ];

  const [totalRegistered, upcomingEvents, ongoingEvents, attendedEvents] =
    await Promise.all([
      db.registration.count({
        where: {
          userId,
        },
      }),
      db.event.count({
        where: {
          registrations: {
            some: {
              userId,
            },
          },
          startDate: {
            gte: new Date(),
          },
        },
      }),
      db.event.count({
        where: {
          registrations: {
            some: {
              userId,
            },
          },
          startDate: {
            lt: new Date(),
          },
          endDate: {
            gte: new Date(),
          },
        },
      }),
      db.event.count({
        where: {
          registrations: {
            some: {
              userId,
              checkedIn: true,
            },
          },
          endDate: {
            lt: new Date(),
          },
        },
      }),
    ]);

  return (
    <div className="space-y-6">
      <BreadcrumbNav items={breadcrumbItems} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Event Registrations</h1>
          <p className="text-muted-foreground mt-2">
            Track all your registered events and their status
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registered
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistered}</div>
            <p className="text-xs text-muted-foreground">
              All time registrations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Events
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events you're registered for
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Ongoing Events
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ongoingEvents}</div>
            <p className="text-xs text-muted-foreground">Currently happening</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attended</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{attendedEvents}</div>
            <p className="text-xs text-muted-foreground">Events you attended</p>
          </CardContent>
        </Card>
      </div>

      <Suspense fallback={<div>Loading your registrations...</div>}>
        <StudentEventsGrid userId={userId} />
      </Suspense>
    </div>
  );
}
