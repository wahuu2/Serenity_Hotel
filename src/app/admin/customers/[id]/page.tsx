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

  /*
   * Loading State
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="relative overflow-hidden bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,130,50,0.16),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400 sm:text-xs">
              Serenity Hotel
            </p>

            <div className="mt-4 h-9 w-64 animate-pulse bg-gray-800 sm:h-12 sm:w-80" />

            <div className="mt-4 h-5 w-full max-w-xl animate-pulse bg-gray-800" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-center py-12">
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

  /*
   * Error State
   */
  if (error || !customer) {
    return (
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="relative overflow-hidden bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,130,50,0.16),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400 sm:text-xs">
              Serenity Hotel
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Customer Details
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
              Review customer information and reservation history.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center bg-red-50 text-red-600">
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

            <h2 className="mt-5 text-xl font-semibold text-gray-950">
              Customer Not Found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              {error ||
                "The requested customer could not be found."}
            </p>

            <Link
              href="/admin/customers"
              className="mt-6 inline-flex min-h-11 items-center justify-center border border-gray-950 bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
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
      <section className="relative overflow-hidden bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,130,50,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400 sm:text-xs">
              Serenity Hotel
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Customer Details
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
              Review customer information, booking history, and
              payment activity from one place.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* Page Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Customer Profile
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
              {customer.name}
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              Customer account and reservation overview.
            </p>
          </div>

          <Link
            href="/admin/customers"
            className="inline-flex min-h-11 items-center justify-center border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
          >
            Back to Customers
          </Link>
        </div>

        {/* Customer Information */}
        <section className="mt-8 border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-gray-950 text-lg font-semibold uppercase text-white">
                  {customer.name.charAt(0)}
                </div>

                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-gray-950 sm:text-xl">
                    {customer.name}
                  </h3>

                  <p className="mt-1 break-all text-sm text-gray-500">
                    {customer.email}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex w-fit items-center rounded-full border px-3.5 py-1.5 text-xs font-semibold ${
                  customer.role === "admin"
                    ? "border-purple-200 bg-purple-50 text-purple-700"
                    : "border-blue-200 bg-blue-50 text-blue-700"
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
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                Email Address
              </p>

              <p className="mt-2 break-all text-sm font-medium text-gray-900">
                {customer.email}
              </p>
            </div>

            <div className="px-5 py-5 sm:px-6">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
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
          <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Total Bookings
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  {statistics.totalBookings}
                </p>

                <p className="mt-4 text-xs text-gray-500">
                  Reservations made
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f6f3ee] text-amber-700">
                <span className="text-sm font-semibold">
                  BK
                </span>
              </div>
            </div>
          </div>

          {/* Total Paid */}
          <div className="bg-gray-950 p-5 text-white shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                  Total Paid
                </p>

                <p className="mt-3 text-2xl font-semibold sm:text-3xl">
                  KSh {statistics.totalSpent.toLocaleString()}
                </p>

                <p className="mt-4 text-xs text-gray-500">
                  Paid reservation value
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-amber-400/10 text-amber-400">
                <span className="text-sm font-semibold">
                  KSh
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Booking History */}
        <section className="mt-10 sm:mt-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Reservations
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-gray-900">
              Booking History
            </h3>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              All reservations made by this customer.
            </p>
          </div>

          <div className="border border-gray-200 bg-white shadow-sm">
            {bookings.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center bg-gray-100">
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
                <div className="border-b border-gray-200 bg-[#faf9f7] px-4 py-3 text-xs text-gray-500 md:hidden">
                  Swipe horizontally to view the complete booking
                  history.
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                          Booking
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                          Room
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                          Stay
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                          Total
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                          Payment
                        </th>

                        <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                          Receipt
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                      {bookings.map((booking) => (
                        <tr
                          key={booking._id}
                          className="transition-colors hover:bg-[#faf9f7]"
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
                              rel="noopener noreferrer"
                              className="inline-flex min-h-9 items-center gap-1.5 border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
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
              </>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}