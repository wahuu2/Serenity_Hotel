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
  booking: {
    _id: string;
    bookingReference: string;
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

function formatDate(date: string | null) {
  if (!date) return "Not paid";

  return new Date(date).toLocaleDateString("en-KE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatStatus(status: Payment["status"]) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusStyles(status: Payment["status"]) {
  switch (status) {
    case "paid":
      return "border-green-200 bg-green-50 text-green-700";

    case "failed":
      return "border-red-200 bg-red-50 text-red-700";

    case "refunded":
      return "border-yellow-200 bg-yellow-50 text-yellow-700";

    default:
      return "border-gray-200 bg-gray-50 text-gray-700";
  }
}

export default function MyPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPayments() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/payments");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch payment history."
          );
        }

        setPayments(data.payments || []);
      } catch (error) {
        console.error("Failed to fetch payments:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load payment history."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  const paidPayments = payments.filter(
    (payment) => payment.status === "paid"
  );

  const totalPaid = paidPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="bg-gray-950 px-6 py-20 text-white">
          <div className="mx-auto max-w-6xl">
            <div className="h-3 w-32 animate-pulse rounded-full bg-white/10" />
            <div className="mt-5 h-12 w-72 animate-pulse rounded-lg bg-white/10" />
            <div className="mt-5 h-5 max-w-xl animate-pulse rounded bg-white/10" />
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-12">
          <div className="space-y-5">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-64 animate-pulse rounded-3xl bg-white shadow-sm"
              />
            ))}
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="bg-gray-950 px-6 py-20 text-white">
          <div className="mx-auto max-w-6xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              Serenity Hotel
            </p>

            <h1 className="mt-4 text-4xl font-semibold md:text-5xl">
              Payment History
            </h1>
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-xl text-red-600">
              !
            </div>

            <h2 className="mt-5 text-2xl font-semibold text-gray-950">
              Unable to load payments
            </h2>

            <p className="mt-3 leading-7 text-red-700">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-7 rounded-full bg-gray-950 px-7 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Try Again
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Serenity Hotel
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">
            Your payment history.
          </h1>

          <p className="mt-5 max-w-2xl leading-7 text-gray-300">
            Keep track of your hotel payments, transaction references, and
            reservation details in one place.
          </p>
        </div>
      </section>

      {/* Summary */}
      {payments.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pt-10 md:pt-12">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Payments</p>

              <p className="mt-2 text-3xl font-semibold text-gray-950">
                {payments.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Recorded transactions
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Successful Payments</p>

              <p className="mt-2 text-3xl font-semibold text-gray-950">
                {paidPayments.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Completed transactions
              </p>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
              <p className="text-sm text-gray-500">Total Paid</p>

              <p className="mt-2 text-3xl font-semibold text-gray-950">
                KSh {totalPaid.toLocaleString()}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Across successful payments
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Payment History */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        {payments.length === 0 ? (
          <div className="rounded-[2rem] border border-black/5 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-2xl text-amber-700">
              KSh
            </div>

            <h2 className="mt-6 text-2xl font-semibold text-gray-950">
              No payments yet
            </h2>

            <p className="mx-auto mt-3 max-w-md leading-7 text-gray-600">
              Once you complete a hotel booking payment, your transaction
              details will appear here.
            </p>

            <Link
              href="/rooms"
              className="mt-7 inline-flex rounded-full bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Explore Rooms
            </Link>
          </div>
        ) : (
          <div>
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Transactions
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-gray-950">
                  Recent payments
                </h2>
              </div>

              <Link
                href="/my-bookings"
                className="text-sm font-semibold text-gray-700 transition hover:text-amber-700"
              >
                View My Bookings →
              </Link>
            </div>

            <div className="space-y-6">
              {payments.map((payment) => (
                <article
                  key={payment._id}
                  className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm"
                >
                  {/* Payment Header */}
                  <div className="border-b border-gray-100 px-6 py-6 md:px-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                          Transaction Reference
                        </p>

                        <p className="mt-2 break-all font-semibold text-gray-950">
                          {payment.transactionReference}
                        </p>

                        <p className="mt-2 text-sm text-gray-500">
                          {formatDate(payment.paidAt)}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-4 py-1.5 text-sm font-semibold ${getStatusStyles(
                          payment.status
                        )}`}
                      >
                        {formatStatus(payment.status)}
                      </span>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="px-6 py-7 md:px-8">
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                          Booking
                        </p>

                        <p className="mt-2 font-semibold text-gray-950">
                          {payment.booking?.bookingReference || "N/A"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                          Room
                        </p>

                        <p className="mt-2 font-semibold text-gray-950">
                          {payment.booking?.room?.name || "N/A"}
                        </p>

                        {payment.booking?.room?.type && (
                          <p className="mt-1 text-sm text-gray-500">
                            {payment.booking.room.type}
                          </p>
                        )}
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                          Payment Method
                        </p>

                        <p className="mt-2 font-semibold capitalize text-gray-950">
                          {payment.paymentMethod}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                          Amount Paid
                        </p>

                        <p className="mt-2 text-xl font-semibold text-gray-950">
                          {payment.currency}{" "}
                          {payment.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Stay Details */}
                    {payment.booking && (
                      <div className="mt-8 rounded-2xl bg-[#f6f3ee] p-5">
                        <div className="grid gap-5 sm:grid-cols-3">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                              Check-in
                            </p>

                            <p className="mt-2 font-medium text-gray-950">
                              {formatDate(payment.booking.checkIn)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                              Check-out
                            </p>

                            <p className="mt-2 font-medium text-gray-950">
                              {formatDate(payment.booking.checkOut)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
                              Stay
                            </p>

                            <p className="mt-2 font-medium text-gray-950">
                              {payment.booking.nights}{" "}
                              {payment.booking.nights === 1
                                ? "night"
                                : "nights"}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-7 flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-500">
                          Booking total
                        </p>

                        <p className="mt-1 font-semibold text-gray-950">
                          {payment.currency}{" "}
                          {payment.booking?.totalAmount?.toLocaleString() ||
                            payment.amount.toLocaleString()}
                        </p>
                      </div>

                      <Link
                        href="/my-bookings"
                        className="inline-flex justify-center rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
                      >
                        View My Bookings
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Bottom CTA */}
      <section className="bg-white px-6 py-16 text-center md:py-20">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
          Serenity Hotel
        </p>

        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-gray-950">
          Ready for your next stay?
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
          Explore our rooms and discover a comfortable stay designed around
          you.
        </p>

        <Link
          href="/rooms"
          className="mt-7 inline-flex rounded-full bg-gray-950 px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          Explore Rooms
        </Link>
      </section>
    </main>
  );
}