// import { notFound } from "next/navigation";
// import { auth } from "@clerk/nextjs/server";
// import { getAuthUser } from "@/lib/auth";
// import { db } from "@/lib/db";
// import { QRScanner } from "@/components/qr-scanner";
// import { BreadcrumbNav } from "@/components/breadcrumb-nav";
// import { Button } from "@/components/ui/button";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";

// interface CheckInPageProps {
//   params: {
//     id: string;
//   }
//   searchParams: {
//     verify?: string
//   }
// }

// export default async function CheckInPage({ params, searchParams }: CheckInPageProps) {
//   const { userId } = await auth();
//   const user = await getAuthUser();
//   const { id } = await params;
//   const { verify: qrCode } = await searchParams;

//   if(!userId || !user) {
//     return <div>Please log in to access this page.</div>;
//   }

//   if (user.role !== "ORGANIZER" && user.role !== "ADMIN") {
//     return <div>Access denied. Only organizers can access this page.</div>;
//   }

//   const event = await db.event.findUnique({
//     where: { id: id },
//     include: {
//       organizer: true,
//       _count: { select: { registrations: true } },
//     },
//   });

//   if (!event) {
//     notFound();
//   }

//   // Check if user can manage this event
//   const canManage = user.role === "ADMIN" || event.organizerId === userId;

//   if (!canManage) {
//     return <div>You don't have permission to manage this event.</div>;
//   }

//   const breadcrumbItems = [
//     { title: "Dashboard", href: "/dashboard" },
//     { title: "Events", href: "/events" },
//     { title: event.title, href: `/events/${event.id}` },
//     { title: "Check-in" },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div className="space-y-2">
//           <BreadcrumbNav items={breadcrumbItems} />
//           <Button variant="outline" size="sm" asChild>
//             <Link
//               href={`/events/${event.id}`}
//               className="flex items-center gap-2"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back to Event
//             </Link>
//           </Button>
//         </div>
//       </div>

//       <QRScanner eventId={event.id} eventTitle={event.title} />
//     </div>
//   );
// }


import { Suspense } from "react"
import { db } from "@/lib/db"
import { auth } from "@clerk/nextjs/server"
import { getAuthUser } from "@/lib/auth"
import { CheckInContent } from "@/components/check-in-content"
import { QRScanner } from "@/components/qr-scanner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { BreadcrumbNav } from "@/components/breadcrumb-nav"

interface CheckInPageProps {
  params: {
    id: string
  }
  searchParams: {
    verify?: string
  }
}

export default async function CheckInPage({ params, searchParams }: CheckInPageProps) {
  const {id : eventId} = await params;
  const { verify: qrCode } = await searchParams;
  const { userId } = await auth()
  const user = await getAuthUser()

  // Get event details
  const event = await db.event.findUnique({
    where: { id: eventId },
    include: {
      organizer: true,
      _count: { select: { registrations: true } },
    },
  })

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Event Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">The requested event could not be found.</p>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // If verify parameter is provided, show check-in result
  if (qrCode) {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <CheckInContent eventId={eventId} qrCode={qrCode} />
      </Suspense>
    )
  }

  // If no verify parameter, show scanner for organizers/admins
  if (!user || (user.role !== "ORGANIZER" && user.role !== "ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Only organizers and administrators can access the check-in scanner.
            </p>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Check if user can manage this event
  const canManage = user.role === "ADMIN" || event.organizerId === userId

  if (!canManage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Permission Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">You don't have permission to manage this event.</p>
            <Button asChild>
              <Link href="/events">Browse Events</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Events", href: "/events" },
    { title: event.title, href: `/events/${event.id}` },
    { title: "Check-in Scanner" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <BreadcrumbNav items={breadcrumbItems} />
          <Button variant="outline" size="sm" asChild>
            <Link href={`/events/${event.id}`} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Event
            </Link>
          </Button>
        </div>
      </div>

      <QRScanner eventId={event.id} eventTitle={event.title} />
    </div>
  )
}
