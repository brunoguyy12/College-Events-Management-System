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
import { Users, Calendar, UserCheck, TrendingUp } from "lucide-react";

interface AdminAnalyticsProps {
  data: any;
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export function AdminAnalytics({
  data,
  timeRange,
  setTimeRange,
}: AdminAnalyticsProps) {
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
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers}</div>
            <p className="text-xs text-muted-foreground">Platform-wide users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Events Created
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalEvents}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalRegistrations}</div>
            <p className="text-xs text-muted-foreground">Event registrations</p>
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

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentEvents.map((event: any) => (
              <div key={event.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    by {event.organizer.name}
                  </p>
                </div>
                <div className="text-right">
                  <Badge variant="secondary">{event.status}</Badge>
                  <p className="text-sm text-muted-foreground">
                    {event._count.registrations} registrations
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Event Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.categoryStats.map((category: any) => (
              <div
                key={category.category}
                className="flex items-center justify-between"
              >
                <span className="capitalize">
                  {category.category.toLowerCase()}
                </span>
                <div className="flex items-center space-x-2">
                  <Progress
                    value={(category._count.category / data.totalEvents) * 100}
                    className="w-20"
                  />
                  <span className="text-sm font-medium">
                    {category._count.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Organizers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Organizers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.topOrganizers.map((organizer: any, index: number) => (
              <div
                key={organizer.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">#{index + 1}</span>
                  <span>{organizer.name}</span>
                </div>
                <Badge variant="outline">
                  {organizer._count.organizedEvents} events
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
