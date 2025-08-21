import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, History, CheckCircle } from "lucide-react";
import { StudentEventsGrid } from "@/components/student-events-grid";

export default async function MyRegistrationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const now = new Date();

  // Get all registrations with event details
  const registrations = await db.registration.findMany({
    where: { userId },
    include: {
      event: {
        include: {
          organizer: {
            select: {
              name: true,
              avatar: true,
            },
          },
          _count: { select: { registrations: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Categorize events
  const upcomingRegistrations = registrations.filter(
    (reg) => new Date(reg.event.startDate) > now
  );

  const ongoingRegistrations = registrations.filter(
    (reg) =>
      new Date(reg.event.startDate) <= now && new Date(reg.event.endDate) >= now
  );

  const pastRegistrations = registrations.filter(
    (reg) => new Date(reg.event.endDate) < now
  );

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Events", href: "/events" },
    { title: "My Registrations" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BreadcrumbNav items={breadcrumbItems} />
        <div>
          <h1 className="text-3xl font-bold">My Event Registrations</h1>
          <p className="text-muted-foreground">
            Track and manage your registered events
          </p>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="upcoming" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Upcoming ({upcomingRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="ongoing" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Ongoing ({ongoingRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="past" className="flex items-center gap-2">
            <History className="h-4 w-4" />
            Past ({pastRegistrations.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            All ({registrations.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <StudentEventsGrid
            registrations={upcomingRegistrations}
            title="Upcoming Events"
            emptyMessage="You haven't registered for any upcoming events yet."
          />
        </TabsContent>

        <TabsContent value="ongoing">
          <StudentEventsGrid
            registrations={ongoingRegistrations}
            title="Ongoing Events"
            emptyMessage="You don't have any ongoing events."
            showOngoingBadge={true}
          />
        </TabsContent>

        <TabsContent value="past">
          <StudentEventsGrid
            registrations={pastRegistrations}
            title="Past Events"
            emptyMessage="You haven't attended any events yet."
            showAttendanceStatus={true}
          />
        </TabsContent>

        <TabsContent value="all">
          <StudentEventsGrid
            registrations={registrations}
            title="All Registered Events"
            emptyMessage="You haven't registered for any events yet."
            showAttendanceStatus={true}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
