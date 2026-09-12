import Link from "next/link";
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

  const totalBookings = serializedBookings.length;

  const confirmedBookings = serializedBookings.filter(
    (booking) => booking.status === "confirmed"
  ).length;

  const pendingBookings = serializedBookings.filter(
    (booking) => booking.status === "pending"
  ).length;

  const paidBookings = serializedBookings.filter(
    (booking) => booking.paymentStatus === "paid"
  ).length;

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* Page Header */}
      <section className="bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500 sm:text-sm">
              Serenity Hotel
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Manage Bookings
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              View guest reservations, monitor booking statuses, and
              manage hotel stays from one place.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Page Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Reservations
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              All Bookings
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Manage guest reservations and keep track of their
              booking and payment status.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Booking Summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Total
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {totalBookings}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              All reservations
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Confirmed
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {confirmedBookings}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Confirmed stays
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Pending
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {pendingBookings}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Awaiting confirmation
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Paid
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {paidBookings}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Paid reservations
            </p>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-950">
              Reservation List
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Most recent bookings appear first.
            </p>
          </div>

          <div className="p-2 sm:p-4">
            <BookingsTable bookings={serializedBookings} />
          </div>
        </div>
      </section>
    </main>
  );
}