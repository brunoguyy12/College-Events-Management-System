import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function getUserRole(userId: string) {
  // Fetch user role from the database
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
    },
  });

  if (!user) {
    return {
      role: UserRole.STUDENT, // Default role if user not found
    };
  }

  return {
    role: user.role,
  };
}
