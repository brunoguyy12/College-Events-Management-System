// import { type NextRequest, NextResponse } from "next/server";
// import { auth } from "@clerk/nextjs/server";
// import { getAuthUser } from "@/lib/auth";
// import { db } from "@/lib/db";

// export async function GET(request: NextRequest) {
//   try {
//     const { userId } = await auth();

//     if (!userId) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     const user = await getAuthUser();

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     const { searchParams } = new URL(request.url);
//     const timeRange = searchParams.get("timeRange") || "30"; // days
//     const startDate = new Date();
//     startDate.setDate(startDate.getDate() - Number.parseInt(timeRange));

//     let analytics = {};

//     if (user.role === "ADMIN") {
//       // Admin Analytics - Platform-wide statistics
//       const [
//         totalUsers,
//         totalEvents,
//         totalRegistrations,
//         totalAttendees,
//         recentEvents,
//         categoryStats,
//         monthlyStats,
//         topOrganizers,
//         userGrowth,
//       ] = await Promise.all([
//         db.user.count(),
//         db.event.count(),
//         db.registration.count(),
//         db.registration.count({ where: { checkedIn: true } }),
//         db.event.findMany({
//           where: { createdAt: { gte: startDate } },
//           include: {
//             organizer: { select: { name: true, email: true } },
//             _count: { select: { registrations: true } },
//           },
//           orderBy: { createdAt: "desc" },
//           take: 10,
//         }),
//         db.event.groupBy({
//           by: ["category"],
//           _count: { category: true },
//           where: { createdAt: { gte: startDate } },
//         }),
//         db.event.groupBy({
//           by: ["createdAt"],
//           _count: { id: true },
//           where: { createdAt: { gte: startDate } },
//           orderBy: { createdAt: "asc" },
//         }),
//         db.user.findMany({
//           where: { role: "ORGANIZER" },
//           include: {
//             _count: { select: { organizedEvents: true } },
//           },
//           orderBy: {
//             organizedEvents: { _count: "desc" },
//           },
//           take: 5,
//         }),
//         db.user.groupBy({
//           by: ["createdAt"],
//           _count: { id: true },
//           where: { createdAt: { gte: startDate } },
//           orderBy: { createdAt: "asc" },
//         }),
//       ]);

//       analytics = {
//         overview: {
//           totalUsers,
//           totalEvents,
//           totalRegistrations,
//           totalAttendees,
//           averageAttendance:
//             totalRegistrations > 0
//               ? (totalAttendees / totalRegistrations) * 100
//               : 0,
//         },
//         recentEvents,
//         categoryStats,
//         monthlyStats,
//         topOrganizers,
//         userGrowth,
//       };
//     } else if (user.role === "ORGANIZER") {
//       // Organizer Analytics - Their events' performance
//       const [
//         myEvents,
//         totalRegistrations,
//         totalAttendees,
//         eventAnalytics,
//         categoryPerformance,
//         monthlyPerformance,
//         upcomingEvents,
//       ] = await Promise.all([
//         db.event.count({ where: { organizerId: userId } }),
//         db.registration.count({
//           where: { event: { organizerId: userId } },
//         }),
//         db.registration.count({
//           where: {
//             event: { organizerId: userId },
//             checkedIn: true,
//           },
//         }),
//         db.event.findMany({
//           where: {
//             organizerId: userId,
//             createdAt: { gte: startDate },
//           },
//           include: {
//             _count: { select: { registrations: true } },
//             registrations: {
//               where: { checkedIn: true },
//               select: { id: true },
//             },
//             analytics: true,
//           },
//           orderBy: { createdAt: "desc" },
//         }),
//         db.event.groupBy({
//           by: ["category"],
//           _count: { category: true },
//           _avg: { aiScore: true },
//           where: {
//             organizerId: userId,
//             createdAt: { gte: startDate },
//           },
//         }),
//         db.event.groupBy({
//           by: ["createdAt"],
//           _count: { id: true },
//           where: {
//             organizerId: userId,
//             createdAt: { gte: startDate },
//           },
//           orderBy: { createdAt: "asc" },
//         }),
//         db.event.findMany({
//           where: {
//             organizerId: userId,
//             startDate: { gte: new Date() },
//             status: "PUBLISHED",
//           },
//           include: {
//             _count: { select: { registrations: true } },
//           },
//           orderBy: { startDate: "asc" },
//           take: 5,
//         }),
//       ]);

//       analytics = {
//         overview: {
//           myEvents,
//           totalRegistrations,
//           totalAttendees,
//           averageAttendance:
//             totalRegistrations > 0
//               ? (totalAttendees / totalRegistrations) * 100
//               : 0,
//         },
//         eventAnalytics: eventAnalytics.map((event) => ({
//           ...event,
//           attendanceRate:
//             event._count.registrations > 0
//               ? (event.registrations.length / event._count.registrations) * 100
//               : 0,
//         })),
//         categoryPerformance,
//         monthlyPerformance,
//         upcomingEvents,
//       };
//     } else {
//       // Student Analytics - Their participation history
//       const [
//         totalRegistrations,
//         totalAttended,
//         registrationHistory,
//         categoryPreferences,
//         upcomingEvents,
//         recentFeedback,
//       ] = await Promise.all([
//         db.registration.count({ where: { userId } }),
//         db.registration.count({
//           where: { userId, checkedIn: true },
//         }),
//         db.registration.findMany({
//           where: {
//             userId,
//             createdAt: { gte: startDate },
//           },
//           include: {
//             event: {
//               select: {
//                 id: true,
//                 title: true,
//                 category: true,
//                 startDate: true,
//                 endDate: true,
//                 venue: true,
//                 organizer: { select: { name: true } },
//               },
//             },
//           },
//           orderBy: { createdAt: "desc" },
//         }),
//         db.registration.groupBy({
//           by: ["eventId"],
//           _count: { id: true },
//           where: { userId },
//           orderBy: { _count: { id: "desc" } },
//         }),
//         db.registration.findMany({
//           where: {
//             userId,
//             event: {
//               startDate: { gte: new Date() },
//               status: "PUBLISHED",
//             },
//           },
//           include: {
//             event: {
//               select: {
//                 id: true,
//                 title: true,
//                 startDate: true,
//                 venue: true,
//                 organizer: { select: { name: true } },
//               },
//             },
//           },
//           orderBy: { event: { startDate: "asc" } },
//           take: 5,
//         }),
//         db.feedback.findMany({
//           where: { userId },
//           include: {
//             event: { select: { title: true } },
//           },
//           orderBy: { createdAt: "desc" },
//           take: 5,
//         }),
//       ]);

//       // Get category preferences
//       const categoryData = await db.event.groupBy({
//         by: ["category"],
//         _count: { category: true },
//         where: {
//           registrations: {
//             some: { userId },
//           },
//         },
//         orderBy: { _count: { category: "desc" } },
//       });

//       analytics = {
//         overview: {
//           totalRegistrations,
//           totalAttended,
//           attendanceRate:
//             totalRegistrations > 0
//               ? (totalAttended / totalRegistrations) * 100
//               : 0,
//           eventsThisMonth: registrationHistory.filter(
//             (r) => new Date(r.createdAt).getMonth() === new Date().getMonth()
//           ).length,
//         },
//         registrationHistory,
//         categoryPreferences: categoryData,
//         upcomingEvents,
//         recentFeedback,
//       };
//     }

//     return NextResponse.json(analytics);
//   } catch (error) {
//     console.error("Error fetching analytics:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch analytics" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { userId } = await auth();
    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get("timeRange") || "30";

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user to check role
    const user = await db.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const daysAgo = Number.parseInt(timeRange);
    const startDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

    if (user.role === "ADMIN") {
      // Admin Analytics
      const [
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalAttendees,
        recentEvents,
        categoryStats,
        topOrganizers,
        userGrowth,
      ] = await Promise.all([
        // Total users
        db.user.count(),

        // Total events
        db.event.count({
          where: {
            createdAt: { gte: startDate },
          },
        }),

        // Total registrations
        db.registration.count({
          where: {
            createdAt: { gte: startDate },
          },
        }),

        // Total attendees (checked-in registrations)
        db.registration.count({
          where: {
            createdAt: { gte: startDate },
            checkedIn: true,
          },
        }),

        // Recent events with organizer
        db.event.findMany({
          where: {
            createdAt: { gte: startDate },
          },
          include: {
            organizer: {
              select: { name: true },
            },
            _count: {
              select: { registrations: true },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        }),

        // Category distribution
        db.event.groupBy({
          by: ["category"],
          where: {
            createdAt: { gte: startDate },
          },
          _count: {
            category: true,
          },
        }),

        // Top organizers
        db.user.findMany({
          where: {
            role: "ORGANIZER",
            organizedEvents: {
              some: {
                createdAt: { gte: startDate },
              },
            },
          },
          include: {
            _count: {
              select: { organizedEvents: true },
            },
          },
          orderBy: {
            organizedEvents: {
              _count: "desc",
            },
          },
          take: 5,
        }),

        // User growth (last 7 days)
        db.user.groupBy({
          by: ["createdAt"],
          where: {
            createdAt: {
              gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            },
          },
          _count: {
            id: true,
          },
        }),
      ]);

      return NextResponse.json({
        role: "ADMIN",
        totalUsers,
        totalEvents,
        totalRegistrations,
        totalAttendees,
        recentEvents,
        categoryStats,
        topOrganizers,
        userGrowth,
      });
    } else if (user.role === "ORGANIZER") {
      // Organizer Analytics
      const [
        myEvents,
        totalRegistrations,
        totalAttendees,
        categoryPerformance,
        upcomingEvents,
      ] = await Promise.all([
        // My events
        db.event.findMany({
          where: {
            organizerId: userId,
            createdAt: { gte: startDate },
          },
          include: {
            _count: {
              select: {
                registrations: true,
              },
            },
            registrations: {
              where: { checkedIn: true },
              select: { id: true },
            },
          },
        }),

        // Total registrations for my events
        db.registration.count({
          where: {
            event: {
              organizerId: userId,
            },
            createdAt: { gte: startDate },
          },
        }),

        // Total attendees for my events
        db.registration.count({
          where: {
            event: {
              organizerId: userId,
            },
            checkedIn: true,
            createdAt: { gte: startDate },
          },
        }),

        // Category performance
        db.event.groupBy({
          by: ["category"],
          where: {
            organizerId: userId,
            createdAt: { gte: startDate },
          },
          _count: {
            category: true,
          },
          _avg: {
            aiScore: true,
          },
        }),

        // Upcoming events
        db.event.findMany({
          where: {
            organizerId: userId,
            startDate: { gt: new Date() },
            status: { in: ["PUBLISHED", "ONGOING"] },
          },
          include: {
            _count: {
              select: { registrations: true },
            },
          },
          orderBy: { startDate: "asc" },
          take: 5,
        }),
      ]);

      return NextResponse.json({
        role: "ORGANIZER",
        myEvents,
        totalRegistrations,
        totalAttendees,
        categoryPerformance,
        upcomingEvents,
      });
    } else {
      // Student Analytics
      const [
        myRegistrations,
        attendedEvents,
        categoryPreferences,
        upcomingEvents,
        recentFeedback,
      ] = await Promise.all([
        // My registrations
        db.registration.findMany({
          where: {
            userId,
            createdAt: { gte: startDate },
          },
          include: {
            event: {
              select: {
                title: true,
                category: true,
                startDate: true,
                status: true,
              },
            },
          },
        }),

        // Events I attended
        db.registration.count({
          where: {
            userId,
            checkedIn: true,
            createdAt: { gte: startDate },
          },
        }),

        // Category preferences
        db.registration.groupBy({
          by: ["eventId"],
          where: {
            userId,
            createdAt: { gte: startDate },
          },
        }),

        // Upcoming registered events
        db.registration.findMany({
          where: {
            userId,
            event: {
              startDate: { gt: new Date() },
              status: { in: ["PUBLISHED", "ONGOING"] },
            },
          },
          include: {
            event: {
              select: {
                title: true,
                startDate: true,
                venue: true,
              },
            },
          },
          orderBy: {
            event: {
              startDate: "asc",
            },
          },
          take: 5,
        }),

        // Recent feedback
        db.feedback.findMany({
          where: {
            userId,
            createdAt: { gte: startDate },
          },
          include: {
            event: {
              select: {
                title: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
          take: 5,
        }),
      ]);

      return NextResponse.json({
        role: "STUDENT",
        myRegistrations,
        attendedEvents,
        categoryPreferences,
        upcomingEvents,
        recentFeedback,
      });
    }
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
