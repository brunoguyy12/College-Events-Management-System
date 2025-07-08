"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Home, BarChart3, Bell, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Events",
    href: "/events",
    icon: Calendar,
  },
  {
    title: "Calendar",
    href: "/calendar",
    icon: Calendar,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    title: "Notifications",
    href: "/notifications",
    icon: Bell,
  },
];

export function MainNav() {
  const pathname = usePathname();
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as string) || "STUDENT";
  const isAdmin = userRole === "ADMIN";

  const allNavigationItems = [
    ...navigationItems,
    ...(isAdmin
      ? [
          {
            title: "Admin",
            href: "/admin",
            icon: Shield,
          },
        ]
      : []),
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {/* {navigationItems.map((item) => ( */}
      {allNavigationItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname.startsWith(item.href) ? "default" : "ghost"}
          size="sm"
          asChild
        >
          <Link href={item.href} className="flex items-center gap-2">
            <item.icon className="h-4 w-4" />
            <span className="hidden sm:inline-block">{item.title}</span>
          </Link>
        </Button>
      ))}
    </nav>
  );
}
