import { db } from "@/lib/db";

export async function getUserRole(userId: string) {
  // Fetch user role from the database
  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return {
    role: user.role,
  };
}
