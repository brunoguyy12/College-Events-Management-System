"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, UserCheck, TrendingUp } from "lucide-react";

interface OrganizerAnalyticsProps {
  data: any;
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export function OrganizerAnalytics({
  data,
  timeRange,
  setTimeRange,
}: OrganizerAnalyticsProps) {
  const attendanceRate =
    data.totalRegistrations > 0
      ? (data.totalAttendees / data.totalRegistrations) * 100
      : 0;

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-end">
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
            <SelectItem value="365">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Events</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.myEvents.length}</div>
            <p className="text-xs text-muted-foreground">Events created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">Across all events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Attendees
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalAttendees}</div>
            <p className="text-xs text-muted-foreground">Actually attended</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Attendance Rate
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {attendanceRate.toFixed(1)}%
            </div>
            <Progress value={attendanceRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* My Events Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Event Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.myEvents.map((event: any) => {
              const eventAttendanceRate =
                event._count.registrations > 0
                  ? (event.registrations.length / event._count.registrations) *
                    100
                  : 0;

              return (
                <div
                  key={event.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {event.category.toLowerCase()} • {event.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {eventAttendanceRate.toFixed(1)}% attendance
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {event.registrations.length}/{event._count.registrations}{" "}
                      attended
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Category Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.categoryPerformance.map((category: any) => (
              <div
                key={category.category}
                className="flex items-center justify-between"
              >
                <span className="capitalize">
                  {category.category.toLowerCase()}
                </span>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">
                    {category._count.category} events
                  </Badge>
                  {category._avg.aiScore && (
                    <Badge variant="secondary">
                      {category._avg.aiScore.toFixed(1)}% avg attendance
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.upcomingEvents.map((event: any) => (
              <div key={event.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(event.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{event.status}</Badge>
                  <p className="text-sm text-muted-foreground">
                    {event._count.registrations} registered
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
