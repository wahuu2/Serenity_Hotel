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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <p className="text-gray-600">
            Loading payments...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
                Serenity Hotel
              </p>

              <h1 className="mt-2 text-3xl font-bold text-gray-900">
                Payment Management
              </h1>

              <p className="mt-2 text-gray-600">
                Monitor customer payments and transaction records.
              </p>
            </div>

            <Link
              href="/admin"
              className="w-fit rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Revenue
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              KSh {totalPaid.toLocaleString()}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Paid Payments
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {paidCount}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending Payments
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Failed Payments
            </p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {failedCount}
            </p>
          </div>
        </div>

        {/* Payments */}
        {payments.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              No Payments Found
            </h2>

            <p className="mt-2 text-gray-600">
              There are currently no payment records.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {payments.map((payment) => (
              <div
                key={payment._id}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                {/* Payment Header */}
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

                {/* Payment Details */}
                <div className="grid gap-6 py-6 md:grid-cols-2 lg:grid-cols-4">
                  <div>
                    <p className="text-sm text-gray-500">
                      Customer
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {payment.user?.name || "Unknown"}
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      {payment.user?.email || "No email"}
                    </p>
                  </div>

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
                      {payment.booking?.room?.name || "N/A"}
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
                          ).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "Not paid"}
                    </p>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid gap-6 border-t pt-6 md:grid-cols-3">
                  <div>
                    <p className="text-sm text-gray-500">
                      Check-in
                    </p>

                    <p className="mt-1 font-medium text-gray-900">
                      {payment.booking?.checkIn
                        ? new Date(
                            payment.booking.checkIn
                          ).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
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
                          ).toLocaleDateString("en-KE", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      {payment.currency}{" "}
                      {payment.amount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mt-6 border-t pt-6">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
                        Booking Status
                      </p>

                      <p className="mt-1 font-semibold capitalize text-gray-900">
                        {payment.booking?.status || "N/A"}
                      </p>
                    </div>

                    <div>
  <p className="text-sm text-gray-500">
    Payment Status
  </p>

  <select
    value={payment.status}
    onChange={(event) =>
      handleStatusChange(
        payment._id,
        event.target.value as Payment["status"]
      )
    }
    className="mt-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 outline-none focus:border-gray-500"
  >
    <option value="pending">Pending</option>
    <option value="paid">Paid</option>
    <option value="failed">Failed</option>
    <option value="refunded">Refunded</option>
  </select>
</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}