import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function EventsGridSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 9 }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-6 w-full" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="space-y-1">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export function EventsPageSkeleton() {
  return (
    <div className="space-y-6 px-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Filter Skeleton */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-20" />
            <Skeleton className="h-10 w-16" />
          </div>
        </div>
      </div>

      {/* Events Grid Skeleton */}
      <EventsGridSkeleton />
    </div>
  );
}
