"use client";

import { useState } from "react";
import Link from "next/link";

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
  paymentStatus: string;
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
      return "border border-green-200 bg-green-50 text-green-700";

    case "completed":
      return "border border-blue-200 bg-blue-50 text-blue-700";

    case "cancelled":
      return "border border-red-200 bg-red-50 text-red-700";

    default:
      return "border border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getPaymentStatusClasses(paymentStatus: string) {
  switch (paymentStatus) {
    case "paid":
      return "border border-green-200 bg-green-50 text-green-700";

    case "refunded":
      return "border border-purple-200 bg-purple-50 text-purple-700";

    default:
      return "border border-amber-200 bg-amber-50 text-amber-700";
  }
}

function formatStatus(status: string) {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function BookingsTable({
  bookings,
}: BookingsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const filteredBookings = bookings.filter((booking) => {
    const searchValue = search.toLowerCase().trim();

    const matchesSearch =
      !searchValue ||
      booking.bookingReference
        .toLowerCase()
        .includes(searchValue) ||
      booking.guestName.toLowerCase().includes(searchValue) ||
      booking.guestEmail.toLowerCase().includes(searchValue);

    const matchesStatus =
      statusFilter === "all" ||
      booking.status === statusFilter;

    const bookingCheckIn = new Date(booking.checkIn)
      .toISOString()
      .split("T")[0];

    const matchesDate =
      !dateFilter || bookingCheckIn === dateFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesDate
    );
  });

  function clearFilters() {
    setSearch("");
    setStatusFilter("all");
    setDateFilter("");
  }

  const hasActiveFilters =
    search ||
    statusFilter !== "all" ||
    dateFilter;

  return (
    <>
      {/* Filters */}
      <div className="border border-gray-200 bg-[#faf9f7] p-4 sm:p-5">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
            Filter Reservations
          </p>

          <p className="mt-1 text-sm text-gray-500">
            Search and filter guest reservations.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_200px_200px_auto]">
          {/* Search */}
          <div>
            <label
              htmlFor="booking-search"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500"
            >
              Search bookings
            </label>

            <input
              id="booking-search"
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Reference, guest name or email..."
              className="min-h-11 w-full border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label
              htmlFor="status-filter"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500"
            >
              Booking status
            </label>

            <select
              id="status-filter"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
              className="min-h-11 w-full border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
            >
              <option value="all">All statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div>
            <label
              htmlFor="date-filter"
              className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-gray-500"
            >
              Check-in date
            </label>

            <input
              id="date-filter"
              type="date"
              value={dateFilter}
              onChange={(event) =>
                setDateFilter(event.target.value)
              }
              className="min-h-11 w-full border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
            />
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="min-h-11 w-full border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex flex-col gap-1 border-b border-gray-200 py-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-gray-500">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {filteredBookings.length}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-gray-900">
            {bookings.length}
          </span>{" "}
          bookings
        </p>

        {hasActiveFilters && (
          <p className="text-xs font-medium text-amber-700">
            Filters are active
          </p>
        )}
      </div>

      {/* Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="border border-gray-200 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-5 w-5 text-gray-500"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.04 6.04a7.5 7.5 0 0 0 10.61 10.61Z"
              />
            </svg>
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-950">
            No matching bookings
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            No reservations match your current search or filters.
            Try changing your search criteria.
          </p>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Clear Filters
            </button>
          )}
        </div>
      ) : (
        <div className="border border-gray-200 bg-white shadow-sm">
          {/* Mobile Scroll Hint */}
          <div className="border-b border-gray-200 bg-[#faf9f7] px-4 py-3 text-xs text-gray-500 sm:hidden">
            Swipe horizontally to view all booking details.
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[1200px] divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Booking
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Guest
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Room
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Stay
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Guests
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Total
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Payment
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredBookings.map((booking) => (
                  <tr
                    key={booking._id}
                    className="transition hover:bg-[#faf9f7]"
                  >
                    {/* Booking */}
                    <td className="whitespace-nowrap px-5 py-5 align-top">
                      <p className="font-semibold text-gray-950">
                        {booking.bookingReference}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Created {formatDate(booking.createdAt)}
                      </p>
                    </td>

                    {/* Guest */}
                    <td className="max-w-[240px] px-5 py-5 align-top">
                      <p className="font-medium text-gray-950">
                        {booking.guestName}
                      </p>

                      <p className="mt-1 truncate text-sm text-gray-500">
                        {booking.guestEmail}
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        {booking.guestPhone}
                      </p>

                      {booking.user && (
                        <p className="mt-2 text-xs text-gray-400">
                          Account:{" "}
                          {booking.user.name ||
                            booking.user.email}
                        </p>
                      )}
                    </td>

                    {/* Room */}
                    <td className="whitespace-nowrap px-5 py-5 align-top">
                      <p className="font-medium text-gray-950">
                        {booking.room?.name || "Unknown Room"}
                      </p>

                      {booking.room?.type && (
                        <p className="mt-1 text-sm text-gray-500">
                          {booking.room.type}
                        </p>
                      )}
                    </td>

                    {/* Stay */}
                    <td className="whitespace-nowrap px-5 py-5 align-top">
                      <p className="text-sm text-gray-700">
                        <span className="text-gray-500">
                          Check-in:
                        </span>{" "}
                        {formatDate(booking.checkIn)}
                      </p>

                      <p className="mt-1 text-sm text-gray-700">
                        <span className="text-gray-500">
                          Check-out:
                        </span>{" "}
                        {formatDate(booking.checkOut)}
                      </p>

                      <p className="mt-2 text-xs font-medium text-gray-500">
                        {booking.nights}{" "}
                        {booking.nights === 1
                          ? "night"
                          : "nights"}
                      </p>
                    </td>

                    {/* Guests */}
                    <td className="whitespace-nowrap px-5 py-5 align-top text-sm text-gray-700">
                      {booking.guests}
                    </td>

                    {/* Total */}
                    <td className="whitespace-nowrap px-5 py-5 align-top">
                      <p className="font-semibold text-gray-950">
                        KSh{" "}
                        {booking.totalAmount.toLocaleString(
                          "en-KE"
                        )}
                      </p>
                    </td>

                    {/* Booking Status */}
                    <td className="whitespace-nowrap px-5 py-5 align-top">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                          booking.status
                        )}`}
                      >
                        {formatStatus(booking.status)}
                      </span>
                    </td>

                    {/* Payment Status */}
                    <td className="whitespace-nowrap px-5 py-5 align-top">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusClasses(
                          booking.paymentStatus
                        )}`}
                      >
                        {formatStatus(
                          booking.paymentStatus
                        )}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="whitespace-nowrap px-5 py-5 align-top">
                      <div className="flex min-w-[130px] flex-col gap-2">
                        <BookingActions
                          bookingId={booking._id}
                          status={booking.status}
                        />

                        <Link
                          href={`/bookings/${booking.bookingReference}/receipt`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-10 items-center justify-center border border-gray-300 bg-white px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
                        >
                          View Receipt
                        </Link>
                      </div>
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