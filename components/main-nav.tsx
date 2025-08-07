"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Calendar, Home, Settings, Shield, BarChart3 } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface MainNavProps {
  userRole: string;
}

export function MainNav({ userRole }: MainNavProps) {
  const pathname = usePathname();
  const { user } = useUser();

  const routes = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
      active: pathname === "/dashboard",
    },
    {
      href: "/events",
      label: "Events",
      icon: Calendar,
      active: pathname.startsWith("/events"),
    },
    {
      href: "/calendar",
      label: "Calendar",
      icon: Calendar,
      active: pathname === "/calendar",
    },
    {
      href: "/analytics",
      label: "Analytics",
      icon: BarChart3,
      active: pathname === "/analytics",
    },
  ];

  // Add admin-only routes
  if (userRole === "ADMIN") {
    routes.push({
      href: "/admin",
      label: "Admin",
      icon: Shield,
      active: pathname.startsWith("/admin"),
    });
  }

  routes.push({
    href: "/settings",
    label: "Settings",
    icon: Settings,
    active: pathname === "/settings",
  });

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          <route.icon className="h-4 w-4" />
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
