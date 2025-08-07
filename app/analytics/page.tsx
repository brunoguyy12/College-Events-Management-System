// import { auth } from "@clerk/nextjs/server";
// import { redirect } from "next/navigation";
// import { getAuthUser } from "@/lib/auth";
// import { AdminAnalytics } from "@/components/analytics/admin-analytics";
// import { OrganizerAnalytics } from "@/components/analytics/organizer-analytics";
// import { StudentAnalytics } from "@/components/analytics/student-analytics";
// import { BreadcrumbNav } from "@/components/breadcrumb-nav";

// interface AnalyticsPageProps {
//   searchParams: {
//     timeRange?: string;
//   };
// }

// export default async function AnalyticsPage({
//   searchParams,
// }: AnalyticsPageProps) {
//   const { userId } = await auth();

//   if (!userId) {
//     redirect("/sign-in");
//   }

//   const user = await getAuthUser();

//   if (!user) {
//     redirect("/sign-in");
//   }

//   const breadcrumbItems = [
//     { title: "Dashboard", href: "/dashboard" },
//     { title: "Analytics" },
//   ];

//   const timeRange = searchParams.timeRange || "30";

//   return (
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <BreadcrumbNav items={breadcrumbItems} />
//         <div>
//           <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
//           <p className="text-muted-foreground">
//             {user.role === "ADMIN"
//               ? "Platform-wide analytics and insights"
//               : user.role === "ORGANIZER"
//                 ? "Your events' performance and analytics"
//                 : "Your event participation and activity"}
//           </p>
//         </div>
//       </div>

//       {user.role === "ADMIN" && <AdminAnalytics timeRange={timeRange} />}
//       {user.role === "ORGANIZER" && (
//         <OrganizerAnalytics timeRange={timeRange} />
//       )}
//       {user.role === "STUDENT" && <StudentAnalytics timeRange={timeRange} />}
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { AdminAnalytics } from "@/components/analytics/admin-analytics";
import { OrganizerAnalytics } from "@/components/analytics/organizer-analytics";
import { StudentAnalytics } from "@/components/analytics/student-analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function AnalyticsPage() {
  const { user, isLoaded } = useUser();
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  useEffect(() => {
    if (isLoaded && user) {
      fetchAnalytics();
    }
  }, [isLoaded, user, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?timeRange=${timeRange}`);
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      }
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Failed to load analytics data.</p>
        </CardContent>
      </Card>
    );
  }

  const renderAnalytics = () => {
    switch (analyticsData.role) {
      case "ADMIN":
        return (
          <AdminAnalytics
            data={analyticsData}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        );
      case "ORGANIZER":
        return (
          <OrganizerAnalytics
            data={analyticsData}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        );
      default:
        return (
          <StudentAnalytics
            data={analyticsData}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground">
          {analyticsData.role === "ADMIN" &&
            "Platform-wide analytics and insights"}
          {analyticsData.role === "ORGANIZER" &&
            "Your event performance and metrics"}
          {analyticsData.role === "STUDENT" &&
            "Your participation history and activity"}
        </p>
      </div>

      {renderAnalytics()}
    </div>
  );
}
