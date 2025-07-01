import {
  Calendar,
  Home,
  Users,
  BarChart3,
  Settings,
  Plus,
  Bell,
} from "lucide-react";
import { useUser, SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserRole } from "@/Permissions/user";

const navigationItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Events",
    url: "/events",
    icon: Calendar,
  },
  {
    title: "Participants",
    url: "/participants",
    icon: Users,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    url: "/notifications",
    icon: Bell,
  },
];

const organizerItems = [
  {
    title: "Create Event",
    url: "/events/create",
    icon: Plus,
  },
  {
    title: "My Events",
    url: "/events/my-events",
    icon: Calendar,
  },
];

export async function AppSidebar() {
  // const { user } = useUser()
  // const userRole = (user?.publicMetadata?.role as string) || "STUDENT"
  // const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN"

  const { userId } = await auth();
  if (!userId) {
    return null; // or redirect to sign-in page
  }

  const user = await currentUser();

  const userRole = (await getUserRole(userId)).role;
  const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">EventHub</h2>
            <p className="text-xs text-muted-foreground">College Events</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isOrganizer && (
          <SidebarGroup>
            <SidebarGroupLabel>Organizer Tools</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {organizerItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4">
        {user && (
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.imageUrl || "/placeholder.svg"} />
                <AvatarFallback>
                  {user.fullName?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.fullName}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole.toLowerCase()}
                </p>
              </div>
            </div>
            <SignOutButton>
              <Button variant="outline" size="sm" className="w-full">
                Sign Out
              </Button>
            </SignOutButton>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
