"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Calendar,
  Users,
  Star,
  UserPlus,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { formatDateForInput } from "@/lib/timezone";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  read: boolean;
  createdAt: string;
  data?: any;
  event?: {
    id: string;
    title: string;
  };
}

interface NotificationsListProps {
  userId: string;
  userRole: string;
}

export function NotificationsList({
  userId,
  userRole,
}: NotificationsListProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notifications");
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(
        `/api/notifications/${notificationId}/read`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        setNotifications(
          notifications.map((n) =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch("/api/notifications/mark-all-read", {
        method: "PATCH",
      });

      if (response.ok) {
        setNotifications(notifications.map((n) => ({ ...n, read: true })));
        toast({
          title: "Success",
          description: "All notifications marked as read",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "EVENT_REMINDER":
        return <Clock className="h-4 w-4" />;
      case "EVENT_UPDATE":
        return <Calendar className="h-4 w-4" />;
      case "NEW_REGISTRATION":
        return <Users className="h-4 w-4" />;
      case "FEEDBACK_RECEIVED":
        return <Star className="h-4 w-4" />;
      case "ROLE_REQUEST":
        return <UserPlus className="h-4 w-4" />;
      case "EVENT_CREATED":
        return <Calendar className="h-4 w-4" />;
      case "EVENT_DELETED":
        return <Trash2 className="h-4 w-4" />;
      case "USER_REGISTERED":
        return <UserPlus className="h-4 w-4" />;
      case "CHECK_IN_REMINDER":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "URGENT":
        return "bg-red-500";
      case "HIGH":
        return "bg-orange-500";
      case "MEDIUM":
        return "bg-blue-500";
      case "LOW":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const filterNotifications = (
    notifications: Notification[],
    filter: string
  ) => {
    switch (filter) {
      case "unread":
        return notifications.filter((n) => !n.read);
      case "high-priority":
        return notifications.filter(
          (n) => n.priority === "HIGH" || n.priority === "URGENT"
        );
      case "events":
        return notifications.filter(
          (n) =>
            n.type.includes("EVENT") ||
            n.type === "NEW_REGISTRATION" ||
            n.type === "CHECK_IN_REMINDER"
        );
      default:
        return notifications;
    }
  };

  const filteredNotifications = filterNotifications(notifications, activeTab);
  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Your Notifications</h2>
          {unreadCount > 0 && (
            <Badge variant="secondary">{unreadCount} unread</Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" onClick={markAllAsRead}>
            <CheckCircle className="h-4 w-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
          <TabsTrigger value="unread">
            Unread ({filterNotifications(notifications, "unread").length})
          </TabsTrigger>
          <TabsTrigger value="high-priority">
            Priority (
            {filterNotifications(notifications, "high-priority").length})
          </TabsTrigger>
          <TabsTrigger value="events">
            Events ({filterNotifications(notifications, "events").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No notifications</h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === "all"
                    ? "You're all caught up! No notifications to show."
                    : `No ${activeTab.replace("-", " ")} notifications found.`}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`cursor-pointer transition-colors ${
                    !notification.read ? "bg-blue-50 border-blue-200" : ""
                  }`}
                  onClick={() =>
                    !notification.read && markAsRead(notification.id)
                  }
                >
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              {notification.message}
                            </p>
                            {notification.event && (
                              <p className="text-xs text-blue-600 mt-2">
                                Related to: {notification.event.title}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div
                              className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}
                              title={`${notification.priority} priority`}
                            />
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full" />
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-xs text-muted-foreground">
                            {formatDateForInput(
                              new Date(notification.createdAt)
                            )}
                          </span>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {notification.type
                                .replace(/_/g, " ")
                                .toLowerCase()}
                            </Badge>
                            {notification.priority === "URGENT" && (
                              <Badge variant="destructive" className="text-xs">
                                Urgent
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
