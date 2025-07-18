import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/profile-form";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, Shield } from "lucide-react";
import humanize from "humanparser";

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get First name and Last name from the Name
  // const [firstName, lastName] = user.name ? user.name.split(" ") : ["", ""];
  const { firstName, middleName, lastName } = humanize.parseName(
    user.name || ""
  );
  const userDetails = {
    ...user,
    firstName: `${firstName} ${middleName || ""}` || null,
    lastName: lastName || null,
  };

  // Ensure user exists in database and get additional info
  const dbUser = await db.user.upsert({
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
    include: {
      _count: {
        select: {
          organizedEvents: true,
          registrations: true,
          feedback: true,
        },
      },
    },
  });

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Profile" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BreadcrumbNav items={breadcrumbItems} />
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your account information and preferences.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user.avatar || "/placeholder.svg"}
                    alt={user.name || "User"}
                  />
                  <AvatarFallback className="text-2xl">
                    {user.name
                      ? user.name.charAt(0).toUpperCase()
                      : user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {user.name || "Complete your profile"}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                  <Badge
                    variant="default"
                    className="flex items-center gap-1 w-fit mx-auto"
                  >
                    <Shield className="h-3 w-3" />
                    {user.role}
                  </Badge>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <h4 className="font-medium">Account Statistics</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-primary-600">
                      {dbUser._count.registrations}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Events Joined
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-bold text-secondary-600">
                      {dbUser._count.organizedEvents}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Events Created
                    </div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-accent-600">
                    {dbUser._count.feedback}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Feedback Given
                  </div>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Joined {new Date(dbUser.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form */}
        <div className="lg:col-span-2">
          <ProfileForm user={userDetails} dbUser={dbUser} />
        </div>
      </div>
    </div>
  );
}
