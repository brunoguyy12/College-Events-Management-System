// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { getAuthUser } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { AdminRoleRequests } from "@/components/admin-role-requests";
// import { BreadcrumbNav } from "@/components/breadcrumb-nav";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Shield, Users, Clock, CheckCircle } from "lucide-react";

// export default async function AdminPage() {
//   const { userId } = await auth();

//   if (!userId) {
//     redirect("/sign-in");
//   }

//   const user = await getAuthUser();

//   if (!user || user.role !== "ADMIN") {
//     redirect("/dashboard");
//   }

//   // Fetch role requests and stats
//   const [roleRequests, totalUsers, pendingRequests, processedRequests] =
//     await Promise.all([
//       db.roleRequest.findMany({
//         include: {
//           user: {
//             select: {
//               id: true,
//               name: true,
//               email: true,
//               role: true,
//               avatar: true,
//             },
//           },
//         },
//         orderBy: [{ status: "asc" }, { createdAt: "desc" }],
//       }),
//       db.user.count(),
//       db.roleRequest.count({ where: { status: "PENDING" } }),
//       db.roleRequest.count({ where: { status: { not: "PENDING" } } }),
//     ]);

//   const breadcrumbItems = [
//     { title: "Dashboard", href: "/dashboard" },
//     { title: "Admin Panel" },
//   ];

//   const stats = [
//     {
//       title: "Total Users",
//       value: totalUsers,
//       icon: Users,
//       description: "Registered users",
//     },
//     {
//       title: "Pending Requests",
//       value: pendingRequests,
//       icon: Clock,
//       description: "Awaiting review",
//     },
//     {
//       title: "Processed Requests",
//       value: processedRequests,
//       icon: CheckCircle,
//       description: "Completed reviews",
//     },
//     {
//       title: "Admin Actions",
//       value: roleRequests.filter((req) => req.processedBy === userId).length,
//       icon: Shield,
//       description: "Your processed requests",
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <BreadcrumbNav items={breadcrumbItems} />
//         <div>
//           <h1 className="text-3xl font-bold">Admin Panel</h1>
//           <p className="text-muted-foreground">
//             Manage user roles and platform administration.
//           </p>
//         </div>
//       </div>

//       {/* Stats */}
//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         {stats.map((stat) => (
//           <Card key={stat.title}>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 {stat.title}
//               </CardTitle>
//               <stat.icon className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{stat.value}</div>
//               <p className="text-xs text-muted-foreground">
//                 {stat.description}
//               </p>
//             </CardContent>
//           </Card>
//         ))}
//       </div>

//       {/* Role Requests Management */}
//       <AdminRoleRequests requests={roleRequests} />
//     </div>
//   );
// }

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Users,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  Eye,
  Edit,
} from "lucide-react";
import {
  getDepartmentColor,
  getDepartmentDisplayName,
} from "@/lib/departments";
import Link from "next/link";
import { AdminRoleRequests } from "@/components/admin-role-requests";

export default async function AdminDashboard() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const now = new Date();

  // Get admin statistics
  const [
    totalUsers,
    totalEvents,
    totalRegistrations,
    pendingRoleRequests,
    upcomingEvents,
    ongoingEvents,
    recentRegistrations,
    roleRequests,
  ] = await Promise.all([
    db.user.count(),
    db.event.count(),
    db.registration.count(),
    db.roleRequest.count({ where: { status: "PENDING" } }),
    db.event.findMany({
      where: {
        status: "PUBLISHED",
        startDate: { gt: now },
      },
      include: {
        organizer: {
          select: { name: true, avatar: true },
        },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: "asc" },
      take: 6,
    }),
    db.event.findMany({
      where: {
        status: "PUBLISHED",
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        organizer: {
          select: { name: true, avatar: true },
        },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: "asc" },
      take: 3,
    }),
    db.registration.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, avatar: true } },
        event: { select: { title: true } },
      },
    }),
    db.roleRequest.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            avatar: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Manage and monitor the college event management system
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Registered users on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">
              Events created on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">
              Event registrations made
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRoleRequests}</div>
            <p className="text-xs text-muted-foreground">
              Role upgrade requests
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ongoing Events */}
        {ongoingEvents.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-500" />
                Ongoing Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ongoingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={event.organizer.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {event.organizer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium line-clamp-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor:
                              getDepartmentColor(event.department as any) +
                              "20",
                            color: getDepartmentColor(event.department as any),
                          }}
                        >
                          {getDepartmentDisplayName(event.department as any)}
                        </Badge>
                        <span>{event._count.registrations} registered</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/events/${event.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Upcoming Events */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link href="/events">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No upcoming events scheduled
              </p>
            ) : (
              upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={event.organizer.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {event.organizer.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium line-clamp-1">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor:
                              getDepartmentColor(event.department as any) +
                              "20",
                            color: getDepartmentColor(event.department as any),
                          }}
                        >
                          {getDepartmentDisplayName(event.department as any)}
                        </Badge>
                        <span>
                          {new Date(event.startDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/events/${event.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/events/edit/${event.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Registrations</CardTitle>
        </CardHeader>
        <CardContent>
          {recentRegistrations.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No recent registrations
            </p>
          ) : (
            <div className="space-y-3">
              {recentRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={registration.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {registration.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{registration.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        registered for {registration.event.title}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(registration.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AdminRoleRequests requests={roleRequests} />
    </div>
  );
}
