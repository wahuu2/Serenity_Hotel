"use client";

import { useState } from "react";

import BookingActions from "./BookingActions";

type Booking = {
  _id: string;
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  room: {
    name?: string;
    type?: string;
  } | null;
  user: {
    name?: string;
    email?: string;
  } | null;
};

type BookingsTableProps = {
  bookings: Booking[];
};

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

export default function BookingsTable({
  bookings,
}: BookingsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBookings = bookings.filter((booking) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      booking.bookingReference
        .toLowerCase()
        .includes(searchValue) ||
      booking.guestName
        .toLowerCase()
        .includes(searchValue) ||
      booking.guestEmail
        .toLowerCase()
        .includes(searchValue);

    const matchesStatus =
      statusFilter === "all" ||
      booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="mb-6 grid gap-4 md:grid-cols-[1fr_220px]">
        <div>
          <label
            htmlFor="booking-search"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Search bookings
          </label>

          <input
            id="booking-search"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reference, guest name or email..."
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
          />
        </div>

        <div>
          <label
            htmlFor="status-filter"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Filter by status
          </label>

          <select
            id="status-filter"
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
            }
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-500">
        Showing {filteredBookings.length} of{" "}
        {bookings.length} bookings
      </p>

      {filteredBookings.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-gray-900">
            No matching bookings
          </h3>

          <p className="mt-2 text-gray-500">
            Try changing your search or status filter.
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
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-5">
                      <p className="font-semibold text-gray-900">
                        {booking.bookingReference}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(
                          booking.createdAt
                        ).toLocaleDateString("en-KE")}
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

                      {booking.user && (
                        <p className="mt-1 text-xs text-gray-400">
                          Account:{" "}
                          {booking.user.name ||
                            booking.user.email}
                        </p>
                      )}
                    </td>

                    <td className="whitespace-nowrap px-6 py-5">
                      <p className="font-medium text-gray-900">
                        {booking.room?.name ||
                          "Unknown Room"}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {booking.room?.type || ""}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-6 py-5">
                      <p className="text-sm text-gray-700">
                        Check-in:{" "}
                        {new Date(
                          booking.checkIn
                        ).toLocaleDateString("en-KE")}
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        Check-out:{" "}
                        {new Date(
                          booking.checkOut
                        ).toLocaleDateString("en-KE")}
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
                        bookingId={booking._id}
                        status={booking.status}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}