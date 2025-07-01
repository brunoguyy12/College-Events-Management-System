"use client";

import Link from "next/link";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MainNav } from "@/components/main-nav";
import { UserNav } from "@/components/user-nav";
import { useUser } from "@clerk/nextjs";

export function SiteHeader() {
  const { user } = useUser();
  const userRole = (user?.publicMetadata?.role as string) || "STUDENT";
  const isOrganizer = userRole === "ORGANIZER" || userRole === "ADMIN";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="h-4 w-4" />
            </div>
            <span className="hidden font-bold sm:inline-block">EventHub</span>
          </Link>
          <MainNav />
        </div>

        <div className="flex items-center gap-4">
          {isOrganizer && (
            <Button asChild size="sm">
              <Link href="/events/create" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline-block">Create Event</span>
              </Link>
            </Button>
          )}
          <UserNav />
        </div>
      </div>
    </header>
  );
}
