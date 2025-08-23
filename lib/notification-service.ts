import { db } from "@/lib/db";
import { sendEventUpdateEmail } from "@/lib/email";

export interface CreateNotificationData {
  userId: string;
  eventId?: string;
  type: string;
  title: string;
  message: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  data?: any;
  sendEmail?: boolean;
}

export async function createNotification(data: CreateNotificationData) {
  try {
    // Create notification in database
    const notification = await db.notification.create({
      data: {
        userId: data.userId,
        eventId: data.eventId,
        type: data.type as any,
        title: data.title,
        message: data.message,
        priority: data.priority || "MEDIUM",
        data: data.data,
      },
      include: {
        user: true,
        event: true,
      },
    });

    // Send email if requested and for high priority notifications
    if (
      data.sendEmail ||
      data.priority === "HIGH" ||
      data.priority === "URGENT"
    ) {
      try {
        await sendEventUpdateEmail(
          notification.user.email,
          notification.user.name,
          notification.event?.title || "System Notification",
          notification.message
        );

        // Mark email as sent
        await db.notification.update({
          where: { id: notification.id },
          data: { emailSent: true },
        });
      } catch (emailError) {
        console.error("Failed to send notification email:", emailError);
      }
    }

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

// Helper functions for specific notification types
export async function notifyEventReminder(
  userId: string,
  eventId: string,
  minutesBefore: number
) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { title: true, startDate: true },
  });

  if (!event) return;

  return createNotification({
    userId,
    eventId,
    type: "EVENT_REMINDER",
    title: "Event Starting Soon",
    message: `"${event.title}" starts in ${minutesBefore} minutes!`,
    priority: "HIGH",
    sendEmail: true,
  });
}

export async function notifyNewRegistration(
  organizerId: string,
  eventId: string,
  userName: string
) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { title: true },
  });

  if (!event) return;

  return createNotification({
    userId: organizerId,
    eventId,
    type: "NEW_REGISTRATION",
    title: "New Event Registration",
    message: `${userName} registered for "${event.title}"`,
    priority: "MEDIUM",
  });
}

export async function notifyFeedbackReceived(
  organizerId: string,
  eventId: string,
  rating: number
) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { title: true },
  });

  if (!event) return;

  return createNotification({
    userId: organizerId,
    eventId,
    type: "FEEDBACK_RECEIVED",
    title: "New Event Feedback",
    message: `Received ${rating}-star feedback for "${event.title}"`,
    priority: "MEDIUM",
  });
}

export async function notifyRoleRequest(
  adminId: string,
  userName: string,
  requestedRole: string
) {
  return createNotification({
    userId: adminId,
    type: "ROLE_REQUEST",
    title: "New Role Request",
    message: `${userName} requested ${requestedRole} role`,
    priority: "HIGH",
    sendEmail: true,
  });
}

export async function notifyEventCreated(
  adminId: string,
  eventId: string,
  organizerName: string
) {
  const event = await db.event.findUnique({
    where: { id: eventId },
    select: { title: true },
  });

  if (!event) return;

  return createNotification({
    userId: adminId,
    eventId,
    type: "EVENT_CREATED",
    title: "New Event Created",
    message: `${organizerName} created "${event.title}"`,
    priority: "MEDIUM",
  });
}

export async function notifyEventDeleted(
  adminId: string,
  eventTitle: string,
  organizerName: string
) {
  return createNotification({
    userId: adminId,
    type: "EVENT_DELETED",
    title: "Event Deleted",
    message: `${organizerName} deleted "${eventTitle}"`,
    priority: "MEDIUM",
    sendEmail: true,
  });
}

export async function notifyUserRegistered(
  adminId: string,
  userName: string,
  userEmail: string
) {
  return createNotification({
    userId: adminId,
    type: "USER_REGISTERED",
    title: "New User Registration",
    message: `${userName} (${userEmail}) joined the platform`,
    priority: "LOW",
  });
}
