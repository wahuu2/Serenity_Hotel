"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type Customer = {
  _id: string;
  name: string;
  email: string;
  role: "guest" | "admin";
  createdAt: string;
};

type Booking = {
  _id: string;
  bookingReference: string;
  guestName: string;
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
    price?: number;
  } | null;
};

type Statistics = {
  totalBookings: number;
  totalSpent: number;
};

function getStatusClasses(status: string) {
  switch (status) {
    case "confirmed":
      return "bg-emerald-50 text-emerald-700";

    case "completed":
      return "bg-blue-50 text-blue-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-amber-50 text-amber-700";
  }
}

function getPaymentStatusClasses(paymentStatus: string) {
  switch (paymentStatus) {
    case "paid":
      return "bg-emerald-50 text-emerald-700";

    case "refunded":
      return "bg-purple-50 text-purple-700";

    default:
      return "bg-amber-50 text-amber-700";
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

export default function CustomerDetailsPage() {
  const params = useParams();

  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [statistics, setStatistics] = useState<Statistics>({
    totalBookings: 0,
    totalSpent: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!customerId) return;

    const fetchCustomer = async () => {
      try {
        const response = await fetch(
          `/api/admin/customers/${customerId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          setError(
            data.message || "Failed to load customer details."
          );
          return;
        }

        setCustomer(data.customer);
        setBookings(data.bookings);
        setStatistics(data.statistics);
      } catch (error) {
        console.error("Customer details error:", error);

        setError("Failed to load customer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  /* Loading State */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500 sm:text-sm">
              Serenity Hotel
            </p>

            <div className="mt-3 h-10 w-64 animate-pulse rounded-lg bg-gray-800 sm:h-12 sm:w-80" />

            <div className="mt-4 h-5 w-full max-w-xl animate-pulse rounded bg-gray-800" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-center py-10">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-800" />
                Loading customer details...
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  /* Error State */
  if (error || !customer) {
    return (
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500 sm:text-sm">
              Serenity Hotel
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Customer Details
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M12 8v4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="16"
                  r="1"
                  fill="currentColor"
                />
              </svg>
            </div>

            <h1 className="mt-5 text-xl font-semibold text-gray-950">
              Customer Not Found
            </h1>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {error ||
                "The requested customer could not be found."}
            </p>

            <Link
              href="/admin/customers"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Back to Customers
            </Link>
          </div>
        </section>
      </main>
    );
  }

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
              Customer Details
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              Review customer information, booking history, and
              payment activity from one place.
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
              Customer Profile
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              {customer.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Customer account and reservation overview.
            </p>
          </div>

          <Link
            href="/admin/customers"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
          >
            Back to Customers
          </Link>
        </div>

        {/* Customer Information */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gray-950 text-lg font-semibold uppercase text-white">
                  {customer.name.charAt(0)}
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-950 sm:text-xl">
                    {customer.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {customer.email}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex w-fit items-center rounded-full px-3.5 py-1.5 text-xs font-semibold ${
                  customer.role === "admin"
                    ? "bg-purple-50 text-purple-700"
                    : "bg-blue-50 text-blue-700"
                }`}
              >
                {customer.role === "admin"
                  ? "Administrator"
                  : "Guest"}
              </span>
            </div>
          </div>

          <div className="grid gap-0 divide-y divide-gray-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0">
            <div className="px-5 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Email Address
              </p>

              <p className="mt-2 break-all text-sm font-medium text-gray-900">
                {customer.email}
              </p>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-gray-400">
                Registered
              </p>

              <p className="mt-2 text-sm font-medium text-gray-900">
                {formatDate(customer.createdAt)}
              </p>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Total Bookings */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Total Bookings
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-950">
                  {statistics.totalBookings}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Reservations made
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="M7 3v4M17 3v4M3 10h18"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Total Paid */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Total Paid
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-950">
                  KSh {statistics.totalSpent.toLocaleString()}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Paid reservation value
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <span className="text-sm font-bold">
                  KSh
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Booking History */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Section Header */}
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-950">
              Booking History
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              All reservations made by this customer.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="5"
                    width="18"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="M7 3v4M17 3v4M3 10h18"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <p className="mt-4 text-base font-semibold text-gray-950">
                No bookings yet
              </p>

              <p className="mt-1 text-sm text-gray-500">
                This customer has not made any hotel reservations.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Booking
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Room
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Stay
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Total
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Payment
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Receipt
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        {/* Booking */}
                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            {booking.bookingReference}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {booking.guests}{" "}
                            {booking.guests === 1
                              ? "guest"
                              : "guests"}
                          </p>
                        </td>

                        {/* Room */}
                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-medium text-gray-900">
                            {booking.room?.name ||
                              "Unknown Room"}
                          </p>

                          {booking.room?.type && (
                            <p className="mt-1 text-sm text-gray-500">
                              {booking.room.type}
                            </p>
                          )}
                        </td>

                        {/* Stay */}
                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="text-sm text-gray-700">
                            {formatDate(booking.checkIn)}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            to {formatDate(booking.checkOut)}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {booking.nights}{" "}
                            {booking.nights === 1
                              ? "night"
                              : "nights"}
                          </p>
                        </td>

                        {/* Total */}
                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            KSh{" "}
                            {booking.totalAmount.toLocaleString()}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                              booking.status
                            )}`}
                          >
                            {formatStatus(booking.status)}
                          </span>
                        </td>

                        {/* Payment */}
                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusClasses(
                              booking.paymentStatus
                            )}`}
                          >
                            {formatStatus(
                              booking.paymentStatus
                            )}
                          </span>
                        </td>

                        {/* Receipt */}
                        <td className="whitespace-nowrap px-6 py-5 text-right">
                          <Link
                            href={`/bookings/${booking.bookingReference}/receipt`}
                            target="_blank"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
                          >
                            View Receipt

                            <svg
                              viewBox="0 0 20 20"
                              fill="none"
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            >
                              <path
                                d="M4 10h11M11 6l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-center text-xs text-gray-400 md:hidden">
                Swipe horizontally to view the complete booking history.
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}