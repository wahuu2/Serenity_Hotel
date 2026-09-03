import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BookingForm from "./BookingForm";

export default async function BookingPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || "";

  const email =
    user.emailAddresses[0]?.emailAddress || "";

  return (
    <BookingForm
      userName={name}
      userEmail={email}
    />
  );
}