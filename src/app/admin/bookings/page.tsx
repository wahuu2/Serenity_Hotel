import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import BookingActions from "./BookingActions";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Booking from "@/models/booking.model";

function getStatusClasses(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-700";

    case "completed":
      return "bg-blue-100 text-blue-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

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
              {bookings.length}{" "}
              {bookings.length === 1
                ? "booking"
                : "bookings"}{" "}
              found
            </p>
          </div>

          <a
            href="/admin"
            className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
          >
            Back to Dashboard
          </a>
        </div>

        {bookings.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <h3 className="text-xl font-semibold text-gray-900">
              No bookings yet
            </h3>

            <p className="mt-2 text-gray-500">
              Guest reservations will appear here once
              they make a booking.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Booking
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Guest
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Room
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Stay
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Guests
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
  Actions
</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {bookings.map((booking) => {
                    const room = booking.room as {
                      name?: string;
                      type?: string;
                    } | null;

                    const bookingUser = booking.user as {
                      name?: string;
                      email?: string;
                    } | null;

                    return (
                      <tr
                        key={booking._id.toString()}
                        className="hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            {booking.bookingReference}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {new Date(
                              booking.createdAt
                            ).toLocaleDateString(
                              "en-KE"
                            )}
                          </p>
                        </td>

                        <td className="px-6 py-5">
                          <p className="font-medium text-gray-900">
                            {booking.guestName}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {booking.guestEmail}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {booking.guestPhone}
                          </p>

                          {bookingUser && (
                            <p className="mt-1 text-xs text-gray-400">
                              Account:{" "}
                              {bookingUser.name ||
                                bookingUser.email}
                            </p>
                          )}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-medium text-gray-900">
                            {room?.name ||
                              "Unknown Room"}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {room?.type || ""}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="text-sm text-gray-700">
                            Check-in:{" "}
                            {new Date(
                              booking.checkIn
                            ).toLocaleDateString(
                              "en-KE"
                            )}
                          </p>

                          <p className="mt-1 text-sm text-gray-700">
                            Check-out:{" "}
                            {new Date(
                              booking.checkOut
                            ).toLocaleDateString(
                              "en-KE"
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.nights}{" "}
                            {booking.nights === 1
                              ? "night"
                              : "nights"}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-700">
                          {booking.guests}
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            KSh{" "}
                            {booking.totalAmount.toLocaleString()}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClasses(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-6 py-5">
  <BookingActions
    bookingId={booking._id.toString()}
    status={booking.status}
  />
</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}