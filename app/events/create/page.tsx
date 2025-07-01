import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { CreateEventForm } from "@/components/create-event-form";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function CreateEventPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user) {
    redirect("/sign-in");
  }

  const isOrganizer = user.role === "ORGANIZER" || user.role === "ADMIN";

  if (!isOrganizer) {
    redirect("/dashboard");
  }

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Events", href: "/events" },
    { title: "Create Event" },
  ];

  return (
    // <div className="max-w-2xl mx-auto space-y-6">
    //   <div>
    //     <h1 className="text-3xl font-bold">Create New Event</h1>
    //     <p className="text-muted-foreground">
    //       Use AI-powered suggestions to create the perfect event.
    //     </p>
    //   </div>

    //   <CreateEventForm userId={userId} />
    // </div>

    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <BreadcrumbNav items={breadcrumbItems} />
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="/events" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create New Event</h1>
              <p className="text-muted-foreground">
                Use AI-powered suggestions to create the perfect event.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl">
        <CreateEventForm userId={userId} />
      </div>
    </div>
  );
}
