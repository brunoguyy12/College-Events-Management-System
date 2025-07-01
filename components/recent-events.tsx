import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { db } from "@/lib/db"

interface RecentEventsProps {
  userId: string
}

export async function RecentEvents({ userId }: RecentEventsProps) {
  const recentRegistrations = await db.registration.findMany({
    where: { userId },
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      event: {
        include: {
          organizer: true,
        },
      },
    },
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {recentRegistrations.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No recent activity found.</p>
        ) : (
          <div className="space-y-4">
            {recentRegistrations.map((registration) => (
              <div key={registration.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{registration.event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Registered on {new Date(registration.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant={registration.status === "CONFIRMED" ? "default" : "secondary"}>
                  {registration.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
