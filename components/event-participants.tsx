"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  Search,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Mail,
} from "lucide-react";
import { EventType } from "@/app/events/[id]/participants/page";

interface EventParticipantsProps {
  event: EventType;
  isEventOwner: boolean;
}

export function EventParticipants({
  event,
  isEventOwner,
}: EventParticipantsProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredRegistrations = event.registrations.filter((registration) => {
    const matchesSearch =
      registration.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || registration.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: event.registrations.length,
    confirmed: event.registrations.filter((r) => r.status === "CONFIRMED")
      .length,
    pending: event.registrations.filter((r) => r.status === "PENDING").length,
    checkedIn: event.registrations.filter((r) => r.checkedIn).length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "PENDING":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "CANCELLED":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return "default" as const;
      case "PENDING":
        return "secondary" as const;
      case "CANCELLED":
        return "destructive" as const;
      default:
        return "outline" as const;
    }
  };

  const exportParticipants = () => {
    const csvContent = [
      ["Name", "Email", "Status", "Checked In", "Registration Date"].join(","),
      ...filteredRegistrations.map((reg) =>
        [
          reg.user.name,
          reg.user.email,
          reg.status,
          reg.checkedIn ? "Yes" : "No",
          new Date(reg.createdAt).toLocaleDateString(),
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title}-participants.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Registered
                </p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Confirmed
                </p>
                <p className="text-2xl font-bold">{stats.confirmed}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Checked In
                </p>
                <p className="text-2xl font-bold">{stats.checkedIn}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Capacity
                </p>
                <p className="text-2xl font-bold">{event.capacity}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {Math.round((stats.total / event.capacity) * 100)}% filled
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Participants List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Participants</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={exportParticipants}>
                <Download className="h-4 w-4 mr-1" />
                Export CSV
              </Button>
              {isEventOwner && (
                <Button variant="outline" size="sm">
                  <Mail className="h-4 w-4 mr-1" />
                  Send Update
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search participants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Status</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Participants */}
          <div className="space-y-3">
            {filteredRegistrations.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No participants found matching your criteria.</p>
              </div>
            ) : (
              filteredRegistrations.map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={registration.user.avatar || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {registration.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{registration.user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {registration.user.email}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Registered{" "}
                        {new Date(registration.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={getStatusVariant(registration.status)}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(registration.status)}
                      {registration.status}
                    </Badge>
                    {registration.checkedIn && (
                      <Badge variant="outline" className="text-blue-600">
                        Checked In
                      </Badge>
                    )}
                    <div className="text-xs text-muted-foreground">
                      QR: {registration.qrCode}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
