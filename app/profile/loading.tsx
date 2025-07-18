import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Breadcrumb and Header Skeleton */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-4" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-96" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview Skeleton */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5" />
                <Skeleton className="h-6 w-32" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <div className="flex items-center gap-2 justify-center">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-6 w-20 mx-auto" />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Skeleton className="h-5 w-32" />
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="space-y-1">
                    <Skeleton className="h-8 w-8 mx-auto" />
                    <Skeleton className="h-3 w-20 mx-auto" />
                  </div>
                  <div className="space-y-1">
                    <Skeleton className="h-8 w-8 mx-auto" />
                    <Skeleton className="h-3 w-20 mx-auto" />
                  </div>
                </div>
                <div className="text-center">
                  <Skeleton className="h-6 w-6 mx-auto" />
                  <Skeleton className="h-3 w-24 mx-auto mt-1" />
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Form Skeleton */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-6 w-40" />
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-32" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              {/* Profile Image */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-32" />
                <div className="flex items-center gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-9 w-32" />
                  </div>
                </div>
              </div>

              {/* Additional Information */}
              <div className="space-y-4">
                <Skeleton className="h-5 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-24 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-3 w-48" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4">
                <Skeleton className="h-10 w-20" />
                <Skeleton className="h-10 w-16" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
