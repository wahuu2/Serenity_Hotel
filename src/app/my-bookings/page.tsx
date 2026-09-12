"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Room = {
  name: string;
  type: string;
  price: number;
};

type Booking = {
  _id: string;
  room: Room;
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
  bookingReference: string;
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/bookings");
        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message || "Failed to fetch your bookings."
          );
          return;
        }

        setBookings(data.bookings || []);
      } catch (error) {
        console.error("Fetch bookings error:", error);

        setError(
          "Something went wrong while fetching your bookings."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBookings();
  }, []);

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function getStatusClasses(status: string) {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  function getPaymentStatusClasses(paymentStatus: string) {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "refunded":
        return "bg-purple-100 text-purple-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  function formatStatus(status: string) {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* =========================================================
          PAGE HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,130,50,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
              Guest Area
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              Your reservations.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg md:leading-8">
              View your stays, check reservation details, and access your
              booking receipts from one place.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-16 lg:px-8">
        {/* =======================================================
            LOADING
        ======================================================= */}
        {loading && (
          <div className="bg-white p-10 text-center shadow-sm sm:p-14">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-gray-950" />

            <p className="mt-5 text-sm text-gray-600">
              Loading your reservations...
            </p>
          </div>
        )}

        {/* =======================================================
            ERROR
        ======================================================= */}
        {!loading && error && (
          <div className="mx-auto max-w-2xl border border-red-200 bg-red-50 p-7 text-center sm:p-10">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v4"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 17h.01"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.3 3.84 2.98 16.5A2 2 0 0 0 4.72 19.5h14.56a2 2 0 0 0 1.74-3L13.7 3.84a2 2 0 0 0-3.4 0Z"
                />
              </svg>
            </div>

            <h2 className="mt-5 text-xl font-semibold text-red-900">
              Unable to load bookings
            </h2>

            <p className="mt-2 text-sm leading-6 text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 bg-gray-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        {/* =======================================================
            EMPTY STATE
        ======================================================= */}
        {!loading && !error && bookings.length === 0 && (
          <div className="mx-auto max-w-2xl bg-white p-8 text-center shadow-sm sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-amber-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-7 w-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 10.5 12 3l9 7.5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 9.75V21h13.5V9.75"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 21v-6h6v6"
                />
              </svg>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
              Serenity Hotel
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-gray-900">
              No reservations yet.
            </h2>

            <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
              Your future stays will appear here. Explore our rooms and find
              a comfortable place for your next visit.
            </p>

            <Link
              href="/rooms"
              className="mt-7 inline-flex bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Explore Rooms
            </Link>
          </div>
        )}

        {/* =======================================================
            BOOKINGS
        ======================================================= */}
        {!loading && !error && bookings.length > 0 && (
          <>
            {/* Summary */}
            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                  Your Stays
                </p>

                <h2 className="mt-3 text-3xl font-semibold text-gray-900 md:text-4xl">
                  Your reservations
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {bookings.length}{" "}
                  {bookings.length === 1
                    ? "reservation"
                    : "reservations"}{" "}
                  found in your account.
                </p>
              </div>

              <Link
                href="/rooms"
                className="inline-flex w-fit border border-gray-900 bg-white px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-950 hover:text-white"
              >
                Book Another Stay
              </Link>
            </div>

            {/* Booking Cards */}
            <div className="space-y-6">
              {bookings.map((booking) => (
                <article
                  key={booking._id}
                  className="overflow-hidden bg-white shadow-sm"
                >
                  {/* =================================================
                      BOOKING HEADER
                  ================================================= */}
                  <div className="border-b border-gray-200 p-6 sm:p-8">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                          Booking Reference
                        </p>

                        <p className="mt-2 break-all text-xl font-semibold tracking-wide text-gray-900">
                          {booking.bookingReference}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wider ${getStatusClasses(
                          booking.status
                        )}`}
                      >
                        {formatStatus(booking.status)}
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      BOOKING DETAILS
                  ================================================= */}
                  <div className="p-6 sm:p-8">
                    {/* Room */}
                    <div className="border-b border-gray-200 pb-7">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                        Accommodation
                      </p>

                      <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <h3 className="text-2xl font-semibold text-gray-900">
                            {booking.room?.name || "Room"}
                          </h3>

                          <p className="mt-1 text-sm text-amber-700">
                            {booking.room?.type || "Accommodation"}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xs text-gray-500">
                            Room rate
                          </p>

                          <p className="mt-1 font-semibold text-gray-900">
                            KSh{" "}
                            {booking.room?.price?.toLocaleString() ||
                              "0"}{" "}
                            <span className="text-xs font-normal text-gray-500">
                              / night
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="grid gap-6 border-b border-gray-200 py-7 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Check-in
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                          {formatDate(booking.checkIn)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Check-out
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                          {formatDate(booking.checkOut)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Duration
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                          {booking.nights}{" "}
                          {booking.nights === 1
                            ? "Night"
                            : "Nights"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Guests
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                          {booking.guests}{" "}
                          {booking.guests === 1
                            ? "Guest"
                            : "Guests"}
                        </p>
                      </div>
                    </div>

                    {/* Guest + Total */}
                    <div className="grid gap-6 border-b border-gray-200 py-7 md:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Guest
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                          {booking.guestName}
                        </p>

                        <p className="mt-1 break-all text-sm text-gray-500">
                          {booking.guestEmail}
                        </p>
                      </div>

                      <div className="md:text-right">
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Total Amount
                        </p>

                        <p className="mt-2 text-2xl font-semibold text-gray-950">
                          KSh{" "}
                          {booking.totalAmount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Payment + Actions */}
                    <div className="flex flex-col gap-5 pt-7 lg:flex-row lg:items-center lg:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Payment Status
                        </p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${getPaymentStatusClasses(
                            booking.paymentStatus
                          )}`}
                        >
                          {formatStatus(
                            booking.paymentStatus
                          )}
                        </span>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row">
                        <Link
                          href={`/bookings/${booking.bookingReference}/receipt`}
                          className="border border-gray-300 px-5 py-3 text-center text-sm font-semibold text-gray-900 transition hover:border-gray-900 hover:bg-gray-50"
                        >
                          View Receipt
                        </Link>

                        {booking.paymentStatus !== "paid" &&
                          booking.status !== "cancelled" && (
                            <Link
                              href={`/payments/${booking._id}`}
                              className="bg-gray-950 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-amber-700"
                            >
                              Complete Payment
                            </Link>
                          )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {/* Bottom CTA */}
            <section className="mt-10 bg-gray-950 p-7 text-white sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                Serenity Hotel
              </p>

              <div className="mt-3 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold">
                    Planning another stay?
                  </h2>

                  <p className="mt-2 max-w-xl text-sm leading-6 text-gray-300">
                    Discover another room and continue your Serenity Hotel
                    experience.
                  </p>
                </div>

                <Link
                  href="/rooms"
                  className="w-fit bg-white px-6 py-3.5 text-sm font-semibold text-gray-950 transition hover:bg-amber-400"
                >
                  Explore Rooms
                </Link>
              </div>
            </section>
          </>
        )}
      </section>
    </main>
  );
}