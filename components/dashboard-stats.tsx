import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, Star } from "lucide-react";

interface DashboardStatsProps {
  totalEvents: number;
  myRegistrations?: number;
  myEventsCount?: number;
  totalParticipants?: number;
  userRole: string;
}

export function DashboardStats({
  totalEvents,
  myRegistrations = 0,
  myEventsCount = 0,
  totalParticipants = 0,
  userRole,
}: DashboardStatsProps) {
  const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN";

  const studentStats = [
    {
      title: "Total Events",
      value: totalEvents,
      icon: Calendar,
      description: "Active events on platform",
    },
    {
      title: "My Registrations",
      value: myRegistrations,
      icon: Users,
      description: "Events you're registered for",
    },
    {
      title: "Engagement Score",
      value: "85%",
      icon: TrendingUp,
      description: "Your activity level",
    },
    {
      title: "Average Rating",
      value: "4.8",
      icon: Star,
      description: "Event satisfaction score",
    },
  ];

  const organizerStats = [
    {
      title: "Platform Events",
      value: totalEvents,
      icon: Calendar,
      description: "Total events on platform",
    },
    {
      title: "My Events",
      value: myEventsCount,
      icon: Calendar,
      description: "Events you've organized",
    },
    {
      title: "Total Participants",
      value: totalParticipants,
      icon: Users,
      description: "Across all your events",
    },
    {
      title: "Success Rate",
      value: "92%",
      icon: TrendingUp,
      description: "Event completion rate",
    },
  ];

  const stats = isOrganizer ? organizerStats : studentStats;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
