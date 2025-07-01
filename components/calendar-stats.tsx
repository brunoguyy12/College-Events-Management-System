import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, TrendingUp, Clock } from "lucide-react";

interface CalendarStatsProps {
  userEvents: any[];
  organizedEvents: any[];
  isOrganizer: boolean;
}

export function CalendarStats({
  userEvents,
  organizedEvents,
  isOrganizer,
}: CalendarStatsProps) {
  const now = new Date();

  const upcomingUserEvents = userEvents.filter(
    (reg) => new Date(reg.event.startDate) > now
  ).length;

  const pastUserEvents = userEvents.filter(
    (reg) => new Date(reg.event.startDate) <= now
  ).length;

  const upcomingOrganizedEvents = organizedEvents.filter(
    (event) => new Date(event.startDate) > now
  ).length;

  const totalRegistrations = organizedEvents.reduce(
    (sum, event) => sum + event._count.registrations,
    0
  );

  const stats = isOrganizer
    ? [
        {
          title: "My Registrations",
          value: upcomingUserEvents,
          icon: Calendar,
          description: "Upcoming events I'm attending",
        },
        {
          title: "Events Organized",
          value: upcomingOrganizedEvents,
          icon: Users,
          description: "My upcoming events",
        },
        {
          title: "Total Registrations",
          value: totalRegistrations,
          icon: TrendingUp,
          description: "Across all my events",
        },
        {
          title: "Events Attended",
          value: pastUserEvents,
          icon: Clock,
          description: "Completed events",
        },
      ]
    : [
        {
          title: "Upcoming Events",
          value: upcomingUserEvents,
          icon: Calendar,
          description: "Events I'm registered for",
        },
        {
          title: "Events Attended",
          value: pastUserEvents,
          icon: Clock,
          description: "Completed events",
        },
        {
          title: "This Month",
          value: userEvents.filter((reg) => {
            const eventDate = new Date(reg.event.startDate);
            return (
              eventDate.getMonth() === now.getMonth() &&
              eventDate.getFullYear() === now.getFullYear()
            );
          }).length,
          icon: TrendingUp,
          description: "Events this month",
        },
        {
          title: "Total Registered",
          value: userEvents.length,
          icon: Users,
          description: "All time registrations",
        },
      ];

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
