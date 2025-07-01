import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, TrendingUp, Star } from "lucide-react"

interface DashboardStatsProps {
  totalEvents: number
  myRegistrations: number
  userRole: string
}

export function DashboardStats({ totalEvents, myRegistrations, userRole }: DashboardStatsProps) {
  const stats = [
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
  ]

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
  )
}
