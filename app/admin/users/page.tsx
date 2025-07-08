import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { UserManagement } from "@/components/user-management";
import { BreadcrumbNav } from "@/components/breadcrumb-nav";

export default async function AdminUsersPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const users = await db.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const breadcrumbItems = [
    { title: "Dashboard", href: "/dashboard" },
    { title: "Admin", href: "/admin" },
    { title: "User Management" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <BreadcrumbNav items={breadcrumbItems} />
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage user roles and permissions across the platform.
          </p>
        </div>
      </div>

      <UserManagement users={users} currentUserId={userId} />
    </div>
  );
}
