import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  return userId;
}

export async function getCurrentUser() {
  const user = await currentUser();
  return user;
}

export async function getAuthUser() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    return null;
  }

  let userDetails;

  const existingUser = await db.user.findFirst({
    where: { id: userId },
  });

  if (!existingUser) {
    const createdUser = await db.user.create({
      data: {
        id: userId,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "",
        avatar: user.imageUrl || "",
        // role: "STUDENT", // Default role, can be changed later
      },
    });

    // console.log("Created new user:", createdUser);
    userDetails = {
      id: createdUser.id,
      email: createdUser.email,
      name: createdUser.name,
      avatar: createdUser.avatar,
      role: createdUser.role, // Keep existing role
    };
  } else {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "",
        avatar: user.imageUrl || "",
        // role: existingUser.role, // Keep existing role
      },
    });
    // console.log("Updated existing user:", updatedUser);
    userDetails = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      role: updatedUser.role, // Keep existing role
    };
  }

  // .catch((error) => {
  //   console.error("Error fetching or creating user:", error);
  //   throw new Error("Failed to fetch or create user");
  // });

  // return {
  //   id: userId,
  //   email: user.emailAddresses[0]?.emailAddress || "",
  //   name: user.fullName || "",
  //   // role: (user.publicMetadata?.role as string) || "STUDENT",
  //   image: user.imageUrl,
  // };

  // console.log("User details:", userDetails);

  return userDetails;
}
