import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar, BarChart3 } from "lucide-react";
import Link from "next/link";

interface QuickActionsProps {
  userRole: string;
}

export function QuickActions({ userRole }: QuickActionsProps) {
  const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN";

  const actions = [
    {
      title: "Browse Events",
      description: "Discover new events",
      icon: Search,
      href: "/events",
      variant: "default" as const,
    },
    {
      title: "My Calendar",
      description: "View your schedule",
      icon: Calendar,
      href: "/calendar",
      variant: "outline" as const,
    },
    ...(isOrganizer
      ? [
          {
            title: "Create Event",
            description: "Start planning",
            icon: Plus,
            href: "/events/create",
            variant: "default" as const,
          },
          {
            title: "View Analytics",
            description: "Check performance",
            icon: BarChart3,
            href: "/analytics",
            variant: "outline" as const,
          },
        ]
      : []),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant={action.variant}
            className="justify-start h-auto p-4"
            asChild
          >
            <Link href={action.href}>
              <div className="flex items-center gap-3">
                <action.icon className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {action.description}
                  </div>
                </div>
              </div>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
