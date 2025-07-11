'use client'

// components/ComingSoon.jsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Construction } from "lucide-react";
import { usePathname } from "next/navigation";
import { BreadcrumbNav } from "./breadcrumb-nav";

export default function ComingSoon() {
  const pathname = usePathname();

  const breadcrumbItems = [{ title: "Dashboard", href: "/dashboard" }, { title: `${pathname}` }]
  return (
    <main className=" flex flex-col gap-4">
      <BreadcrumbNav items={breadcrumbItems} />
      <section className="min-h-[400px] flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Construction className="h-6 w-6 text-muted-foreground" />
            <CardTitle>Page Under Construction</CardTitle>
          </div>
          <Badge variant="secondary" className="mt-2 w-fit">
            Coming Soon
          </Badge>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-muted-foreground">
              We&apos;re working hard to bring you this page!
            </p>
            <p className="text-sm">
              This feature is currently in development and will be available
              soon. Check back later for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </section>
    </main>
  );
}