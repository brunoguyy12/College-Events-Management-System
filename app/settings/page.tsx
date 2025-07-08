import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { RoleRequestForm } from "@/components/role-request-form";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

export default async function SettingsPage() {
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

  // Get existing role request
  const existingRequest = await db.roleRequest.findFirst({
    where: {
      userId,
      status: { in: ["PENDING", "REJECTED"] },
    },
    orderBy: { createdAt: "desc" },
  });

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Settings" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BreadcrumbNav items={breadcrumbItems} />
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and permissions.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Current Role */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Current Role
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <Badge variant="default" className="text-lg px-3 py-1">
                {user.role}
              </Badge>
            </div>

            <div className="space-y-2 text-sm">
              <h4 className="font-medium">Current Permissions:</h4>
              <ul className="space-y-1 text-muted-foreground">
                {user.role === "STUDENT" && (
                  <>
                    <li>• Browse and register for events</li>
                    <li>• View personal calendar</li>
                    <li>• Provide event feedback</li>
                  </>
                )}
                {user.role === "ORGANIZER" && (
                  <>
                    <li>• All student permissions</li>
                    <li>• Create and manage events</li>
                    <li>• View event analytics</li>
                    <li>• Manage event registrations</li>
                  </>
                )}
                {user.role === "ADMIN" && (
                  <>
                    <li>• All organizer permissions</li>
                    <li>• Manage user roles</li>
                    <li>• Platform administration</li>
                    <li>• System-wide analytics</li>
                  </>
                )}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Role Request */}
        <RoleRequestForm
          userId={userId}
          currentRole={user.role}
          existingRequest={existingRequest}
        />
      </div>
    </div>
  );
}
