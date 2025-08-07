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
import { Calendar, UserCheck, Star, TrendingUp } from "lucide-react";

interface StudentAnalyticsProps {
  data: any;
  timeRange: string;
  setTimeRange: (range: string) => void;
}

export function StudentAnalytics({
  data,
  timeRange,
  setTimeRange,
}: StudentAnalyticsProps) {
  const attendanceRate =
    data.myRegistrations.length > 0
      ? (data.attendedEvents / data.myRegistrations.length) * 100
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
            <CardTitle className="text-sm font-medium">
              Events Registered
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.myRegistrations.length}
            </div>
            <p className="text-xs text-muted-foreground">Total registrations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Events Attended
            </CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.attendedEvents}</div>
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Feedback Given
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {data.recentFeedback.length}
            </div>
            <p className="text-xs text-muted-foreground">Reviews submitted</p>
          </CardContent>
        </Card>
      </div>

      {/* My Registrations */}
      <Card>
        <CardHeader>
          <CardTitle>My Event History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.myRegistrations.map((registration: any) => (
              <div
                key={registration.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{registration.event.title}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {registration.event.category.toLowerCase()} •{" "}
                    {new Date(
                      registration.event.startDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <Badge
                    variant={registration.checkedIn ? "default" : "secondary"}
                  >
                    {registration.checkedIn ? "Attended" : "Registered"}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {registration.event.status}
                  </p>
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
            {data.upcomingEvents.map((registration: any) => (
              <div
                key={registration.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{registration.event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(
                      registration.event.startDate
                    ).toLocaleDateString()}{" "}
                    • {registration.event.venue}
                  </p>
                </div>
                <Badge variant="outline">Registered</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>My Recent Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentFeedback.map((feedback: any) => (
              <div
                key={feedback.id}
                className="flex items-center justify-between"
              >
                <div>
                  <p className="font-medium">{feedback.event.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {feedback.comment
                      ? feedback.comment.substring(0, 50) + "..."
                      : "No comment"}
                  </p>
                </div>
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
