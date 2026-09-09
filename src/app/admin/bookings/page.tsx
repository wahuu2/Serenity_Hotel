import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Booking from "@/models/booking.model";

import BookingsTable from "./BookingsTable";

export default async function AdminBookingsPage() {
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

  if (user.role !== "admin") {
    redirect("/");
  }

  const bookings = await Booking.find()
    .populate("room", "name type price")
    .populate("user", "name email")
    .sort({ createdAt: -1 })
    .lean();

  const serializedBookings = bookings.map((booking) => ({
  _id: booking._id.toString(),
  bookingReference: booking.bookingReference,
  guestName: booking.guestName,
  guestEmail: booking.guestEmail,
  guestPhone: booking.guestPhone,
  checkIn: booking.checkIn.toISOString(),
  checkOut: booking.checkOut.toISOString(),
  guests: booking.guests,
  nights: booking.nights,
  totalAmount: booking.totalAmount,
  status: booking.status,
  paymentStatus: booking.paymentStatus,
  createdAt: booking.createdAt.toISOString(),
  room: booking.room
    ? {
        name: (booking.room as any).name,
        type: (booking.room as any).type,
      }
    : null,
  user: booking.user
    ? {
        name: (booking.user as any).name,
        email: (booking.user as any).email,
      }
    : null,
}));

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 px-6 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
            Serenity Hotel
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Manage Bookings
          </h1>

          <p className="mt-4 max-w-2xl text-gray-300">
            View and manage all guest reservations from one
            place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              All Bookings
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Manage guest reservations and booking statuses.
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
          >
            Back to Dashboard
          </a>
        </div>

        <BookingsTable bookings={serializedBookings} />
      </section>
    </main>
  );
}