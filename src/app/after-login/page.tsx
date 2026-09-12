import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";

export default async function AfterLoginPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  await connectToDatabase();

  const user = await User.findOne({
    clerkUserId: clerkUser.id,
  });

  if (!user) {
    redirect("/");
  }

  if (user.role === "admin") {
    redirect("/admin");
  }

  redirect("/dashboard");
}