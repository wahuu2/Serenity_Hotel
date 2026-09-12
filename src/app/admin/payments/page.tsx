"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Payment = {
  _id: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  transactionReference: string;
  status: "pending" | "paid" | "failed" | "refunded";
  paidAt: string | null;
  createdAt: string;

  user: {
    _id: string;
    name?: string;
    email?: string;
  };

  booking: {
    _id: string;
    bookingReference: string;
    guestName: string;
    guestEmail: string;
    room: {
      name: string;
      type: string;
      price: number;
    };
    checkIn: string;
    checkOut: string;
    nights: number;
    totalAmount: number;
    status: string;
    paymentStatus: string;
  };
};

function formatStatus(status: string) {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(date: string | null) {
  if (!date) return "Not paid";

  return new Date(date).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getPaymentStatusClasses(status: Payment["status"]) {
  switch (status) {
    case "paid":
      return "border border-green-200 bg-green-50 text-green-700";

    case "failed":
      return "border border-red-200 bg-red-50 text-red-700";

    case "refunded":
      return "border border-purple-200 bg-purple-50 text-purple-700";

    default:
      return "border border-amber-200 bg-amber-50 text-amber-700";
  }
}

function getBookingStatusClasses(status: string) {
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

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/admin/payments");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch payments."
          );
        }

        setPayments(data.payments || []);
      } catch (error) {
        console.error("Failed to fetch admin payments:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load payments."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  const handleStatusChange = async (
    paymentId: string,
    status: Payment["status"]
  ) => {
    try {
      const response = await fetch("/api/admin/payments", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          paymentId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to update payment status."
        );
      }

      setPayments((currentPayments) =>
        currentPayments.map((payment) =>
          payment._id === paymentId
            ? {
                ...payment,
                status: data.payment.status,
                paidAt: data.payment.paidAt,
                booking: {
                  ...payment.booking,
                  paymentStatus:
                    data.payment.booking?.paymentStatus ||
                    payment.booking.paymentStatus,
                  status:
                    data.payment.booking?.status ||
                    payment.booking.status,
                },
              }
            : payment
        )
      );
    } catch (error) {
      console.error(
        "Failed to update payment status:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to update payment status."
      );
    }
  };

  const totalPaid = payments
    .filter((payment) => payment.status === "paid")
    .reduce((total, payment) => total + payment.amount, 0);

  const paidCount = payments.filter(
    (payment) => payment.status === "paid"
  ).length;

  const pendingCount = payments.filter(
    (payment) => payment.status === "pending"
  ).length;

  const failedCount = payments.filter(
    (payment) => payment.status === "failed"
  ).length;

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

            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Payment Management
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
              Monitor customer payments and transaction records.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-800" />
              Loading payments...
            </div>
          </div>
        </section>
      </main>
    );
  }

  /*
   * Error State
   */
  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="relative overflow-hidden bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,130,50,0.16),transparent_35%)]" />

          <div className="relative mx-auto max-w-7xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400 sm:text-xs">
              Serenity Hotel
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Payment Management
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
              Monitor customer payments and transaction records.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
          <div className="border border-red-200 bg-red-50 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center bg-white text-red-600">
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

            <h2 className="mt-4 text-lg font-semibold text-red-900">
              Unable to Load Payments
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <Link
              href="/admin"
              className="mt-6 inline-flex min-h-11 items-center justify-center border border-gray-950 bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Back to Dashboard
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
              Payment Management
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
              Monitor customer payments, transaction records, and
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
              Transactions
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
              Payment Overview
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Review payment activity, booking information, and
              transaction statuses.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center justify-center border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Payment Summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Revenue */}
          <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Total Revenue
                </p>

                <p className="mt-3 text-2xl font-semibold text-gray-900 sm:text-3xl">
                  KSh {totalPaid.toLocaleString()}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f6f3ee] text-amber-700">
                <span className="text-sm font-semibold">
                  KSh
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Successfully paid
            </p>
          </div>

          {/* Paid */}
          <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Paid Payments
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  {paidCount}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-green-50 text-green-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Completed transactions
            </p>
          </div>

          {/* Pending */}
          <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Pending Payments
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  {pendingCount}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-amber-50 text-amber-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="M12 7v5l3 2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Awaiting payment
            </p>
          </div>

          {/* Failed */}
          <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Failed Payments
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  {failedCount}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-red-50 text-red-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M7 7l10 10M17 7 7 17"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Unsuccessful transactions
            </p>
          </div>
        </div>

        {/* Payment List */}
        <section className="mt-10 sm:mt-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Payment Records
            </p>

            <h3 className="mt-2 text-2xl font-semibold text-gray-900">
              Payment Transactions
            </h3>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Customer payments and their associated booking details.
            </p>
          </div>

          <div className="border border-gray-200 bg-white shadow-sm">
            {payments.length === 0 ? (
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
                      height="14"
                      rx="2"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M3 10h18"
                      stroke="currentColor"
                      strokeWidth="1.7"
                    />

                    <path
                      d="M7 15h4"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>

                <h4 className="mt-4 text-base font-semibold text-gray-950">
                  No Payments Found
                </h4>

                <p className="mt-1 text-sm text-gray-500">
                  There are currently no payment records.
                </p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {payments.map((payment) => (
                    <article
                      key={payment._id}
                      className="p-5 transition-colors hover:bg-[#faf9f7] sm:p-6"
                    >
                      {/* Transaction Header */}
                      <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Transaction Reference
                          </p>

                          <p className="mt-2 break-all font-semibold text-gray-900">
                            {payment.transactionReference}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            Created{" "}
                            {formatDate(payment.createdAt)}
                          </p>
                        </div>

                        <span
                          className={`inline-flex w-fit shrink-0 items-center rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusClasses(
                            payment.status
                          )}`}
                        >
                          {formatStatus(payment.status)}
                        </span>
                      </div>

                      {/* Payment Information */}
                      <div className="grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Customer
                          </p>

                          <p className="mt-2 font-semibold text-gray-900">
                            {payment.user?.name || "Unknown"}
                          </p>

                          <p className="mt-1 break-all text-sm text-gray-500">
                            {payment.user?.email || "No email"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Booking Reference
                          </p>

                          <p className="mt-2 font-semibold text-gray-900">
                            {payment.booking?.bookingReference ||
                              "N/A"}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {payment.booking?.guestName || "Guest"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Room
                          </p>

                          <p className="mt-2 font-semibold text-gray-900">
                            {payment.booking?.room?.name || "N/A"}
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            {payment.booking?.room?.type || "Room"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Payment Date
                          </p>

                          <p className="mt-2 font-semibold text-gray-900">
                            {formatDate(payment.paidAt)}
                          </p>

                          <p className="mt-1 text-sm capitalize text-gray-500">
                            {payment.paymentMethod || "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Booking Details */}
                      <div className="grid gap-6 border-t border-gray-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Check-in
                          </p>

                          <p className="mt-2 text-sm font-medium text-gray-900">
                            {payment.booking?.checkIn
                              ? formatDate(payment.booking.checkIn)
                              : "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Check-out
                          </p>

                          <p className="mt-2 text-sm font-medium text-gray-900">
                            {payment.booking?.checkOut
                              ? formatDate(payment.booking.checkOut)
                              : "N/A"}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Amount
                          </p>

                          <p className="mt-2 text-xl font-semibold text-gray-900">
                            {payment.currency}{" "}
                            {payment.amount.toLocaleString()}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Booking Status
                          </p>

                          <span
                            className={`mt-2 inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${getBookingStatusClasses(
                              payment.booking?.status || ""
                            )}`}
                          >
                            {formatStatus(
                              payment.booking?.status || "N/A"
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Payment Controls */}
                      <div className="mt-6 flex flex-col gap-5 border-t border-gray-200 pt-6 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                            Payment Method
                          </p>

                          <p className="mt-2 font-semibold capitalize text-gray-900">
                            {payment.paymentMethod || "N/A"}
                          </p>
                        </div>

                        <div className="w-full sm:w-52">
                          <label
                            htmlFor={`payment-status-${payment._id}`}
                            className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gray-500"
                          >
                            Payment Status
                          </label>

                          <select
                            id={`payment-status-${payment._id}`}
                            value={payment.status}
                            onChange={(event) =>
                              handleStatusChange(
                                payment._id,
                                event.target.value as Payment["status"]
                              )
                            }
                            className="h-11 w-full border border-gray-300 bg-white px-4 text-sm font-semibold text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                          >
                            <option value="pending">
                              Pending
                            </option>

                            <option value="paid">
                              Paid
                            </option>

                            <option value="failed">
                              Failed
                            </option>

                            <option value="refunded">
                              Refunded
                            </option>
                          </select>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-center text-xs text-gray-400 sm:hidden">
                  Payment records are optimized for mobile viewing.
                </div>
              </>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}