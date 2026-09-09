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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-gray-600">
            Loading payment history...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
            Serenity Hotel
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Payment History
          </h1>

          <p className="mt-4 max-w-2xl text-gray-300">
            View your completed payments and transaction
            details.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        {payments.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              No Payments Yet
            </h2>

            <p className="mt-3 text-gray-600">
              You have not completed any payments yet.
            </p>

            <Link
              href="/rooms"
              className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
            >
              Explore Rooms
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b pb-6 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Transaction Reference
                    </p>

                    <p className="mt-1 break-all font-semibold text-gray-900">
                      {payment.transactionReference}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                      payment.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : payment.status === "failed"
                        ? "bg-red-100 text-red-700"
                        : payment.status === "refunded"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {payment.status.charAt(0).toUpperCase() +
                      payment.status.slice(1)}
                  </span>
                </div>

                <div className="grid gap-6 py-6 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Booking Reference
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {payment.booking?.bookingReference ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Room
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {payment.booking?.room?.name ||
                        "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Payment Method
                    </p>

                    <p className="mt-1 font-semibold capitalize text-gray-900">
                      {payment.paymentMethod}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Payment Date
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {payment.paidAt
                        ? new Date(
                            payment.paidAt
                          ).toLocaleDateString(
                            "en-KE",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "Not paid"}
                    </p>
                  </div>
                </div>

                <div className="grid gap-6 border-t pt-6 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Check-in
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {payment.booking?.checkIn
                        ? new Date(
                            payment.booking.checkIn
                          ).toLocaleDateString(
                            "en-KE",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Check-out
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {payment.booking?.checkOut
                        ? new Date(
                            payment.booking.checkOut
                          ).toLocaleDateString(
                            "en-KE",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Amount Paid
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {payment.currency}{" "}
                      {payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {payment.booking?._id && (
                  <div className="mt-6 border-t pt-6">
                    <Link
                      href={`/my-bookings/${payment.booking._id}`}
                      className="inline-block rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                    >
                      View Booking
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}