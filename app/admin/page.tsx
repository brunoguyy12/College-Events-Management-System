import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminRoleRequests } from "@/components/admin-role-requests";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Clock, CheckCircle } from "lucide-react";

export default async function AdminPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch role requests and stats
  const [roleRequests, totalUsers, pendingRequests, processedRequests] =
    await Promise.all([
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
      db.user.count(),
      db.roleRequest.count({ where: { status: "PENDING" } }),
      db.roleRequest.count({ where: { status: { not: "PENDING" } } }),
    ]);

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Admin Panel" },
  ];

  const stats = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: Users,
      description: "Registered users",
    },
    {
      title: "Pending Requests",
      value: pendingRequests,
      icon: Clock,
      description: "Awaiting review",
    },
    {
      title: "Processed Requests",
      value: processedRequests,
      icon: CheckCircle,
      description: "Completed reviews",
    },
    {
      title: "Admin Actions",
      value: roleRequests.filter((req) => req.processedBy === userId).length,
      icon: Shield,
      description: "Your processed requests",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BreadcrumbNav items={breadcrumbItems} />
        <div>
          <h1 className="text-3xl font-bold">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage user roles and platform administration.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Requests Management */}
      <AdminRoleRequests requests={roleRequests} />
    </div>
  );
}
