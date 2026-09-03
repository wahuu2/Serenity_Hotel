import { currentUser } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";

export async function syncUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  await connectToDatabase();

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Clerk user does not have an email address");
  }

  const name =
    [clerkUser.firstName, clerkUser.lastName]
      .filter(Boolean)
      .join(" ") || "Guest User";

  const user = await User.findOneAndUpdate(
    { clerkUserId: clerkUser.id },
    {
      clerkUserId: clerkUser.id,
      name,
      email,
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    }
  );

  return user;
}