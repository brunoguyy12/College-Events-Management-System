"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface CalendarViewProps {
  userEvents: any[];
  organizedEvents: any[];
  isOrganizer: boolean;
}

export function CalendarView({
  userEvents,
  organizedEvents,
  isOrganizer,
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Get events for the current month
  const getEventsForDate = (day: number) => {
    const targetDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const dateStr = targetDate.toDateString();

    const registeredEvents = userEvents.filter(
      (reg) => new Date(reg.event.startDate).toDateString() === dateStr
    );

    const organizedEventsForDate = organizedEvents.filter(
      (event) => new Date(event.startDate).toDateString() === dateStr
    );

    return { registeredEvents, organizedEventsForDate };
  };

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-muted"></div>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const { registeredEvents, organizedEventsForDate } =
        getEventsForDate(day);
      const hasEvents =
        registeredEvents.length > 0 || organizedEventsForDate.length > 0;
      const isToday =
        new Date().toDateString() ===
        new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          day
        ).toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-muted p-1 ${
            isToday ? "bg-primary/5 border-primary" : ""
          }`}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? "text-primary" : ""
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {registeredEvents.slice(0, 2).map((reg, idx) => (
              <div
                key={idx}
                className="text-xs bg-blue-100 text-blue-800 px-1 py-0.5 rounded truncate"
              >
                {reg.event.title}
              </div>
            ))}
            {organizedEventsForDate.slice(0, 2).map((event, idx) => (
              <div
                key={idx}
                className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded truncate"
              >
                📅 {event.title}
              </div>
            ))}
            {registeredEvents.length + organizedEventsForDate.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{registeredEvents.length + organizedEventsForDate.length - 2}{" "}
                more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("prev")}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth("next")}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-0 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="h-8 flex items-center justify-center font-medium text-sm border border-muted bg-muted/50"
            >
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0">{renderCalendarDays()}</div>

        <div className="flex items-center gap-4 mt-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>Registered Events</span>
          </div>
          {isOrganizer && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-100 rounded"></div>
              <span>My Events</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
