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
      return "bg-green-100 text-green-700";

    case "completed":
      return "bg-blue-100 text-blue-700";

    case "cancelled":
      return "bg-red-100 text-red-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function getPaymentStatusClasses(
  paymentStatus: string
) {
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

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

export default function CustomerDetailsPage() {
  const params = useParams();

  const customerId = params.id as string;

  const [customer, setCustomer] =
    useState<Customer | null>(null);

  const [bookings, setBookings] = useState<Booking[]>(
    []
  );

  const [statistics, setStatistics] =
    useState<Statistics>({
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
            data.message ||
              "Failed to load customer details."
          );
          return;
        }

        setCustomer(data.customer);
        setBookings(data.bookings);
        setStatistics(data.statistics);
      } catch (error) {
        console.error(
          "Customer details error:",
          error
        );

        setError(
          "Failed to load customer details."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [customerId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            Loading customer details...
          </div>
        </div>
      </main>
    );
  }

  if (error || !customer) {
    return (
      <main className="min-h-screen bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <h1 className="text-xl font-semibold text-gray-900">
              Customer Not Found
            </h1>

            <p className="mt-2 text-gray-600">
              {error ||
                "The requested customer could not be found."}
            </p>

            <Link
              href="/admin/customers"
              className="mt-6 inline-block rounded-md bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to Customers
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-gray-500">
              Serenity Hotel
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Customer Details
            </h1>
          </div>

          <Link
            href="/admin/customers"
            className="rounded-md border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
          >
            Back to Customers
          </Link>
        </div>

        {/* Customer Information */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {customer.name}
              </h2>

              <p className="mt-2 text-gray-600">
                {customer.email}
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Registered on{" "}
                {new Date(
                  customer.createdAt
                ).toLocaleDateString("en-KE")}
              </p>
            </div>

            <span
              className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                customer.role === "admin"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {customer.role === "admin"
                ? "Administrator"
                : "Guest"}
            </span>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Bookings
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {statistics.totalBookings}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Paid
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              KSh{" "}
              {statistics.totalSpent.toLocaleString()}
            </p>
          </div>
        </section>

        {/* Booking History */}
        <section>
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Booking History
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              All bookings made by this customer.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="rounded-xl bg-white p-10 text-center shadow-sm">
              <p className="text-gray-600">
                This customer has no bookings yet.
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
                        Room
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Stay
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Total
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Payment
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Receipt
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        className="hover:bg-gray-50"
                      >
                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            {booking.bookingReference}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {booking.guests}{" "}
                            {booking.guests === 1
                              ? "guest"
                              : "guests"}
                          </p>
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
                            {new Date(
                              booking.checkIn
                            ).toLocaleDateString(
                              "en-KE"
                            )}
                          </p>

                          <p className="mt-1 text-sm text-gray-700">
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

                        <td className="whitespace-nowrap px-6 py-5">
                          <p className="font-semibold text-gray-900">
                            KSh{" "}
                            {booking.totalAmount.toLocaleString()}
                          </p>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                              booking.status
                            )}`}
                          >
                            {formatStatus(
                              booking.status
                            )}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusClasses(
                              booking.paymentStatus
                            )}`}
                          >
                            {formatStatus(
                              booking.paymentStatus
                            )}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-6 py-5">
                          <Link
                            href={`/bookings/${booking.bookingReference}/receipt`}
                            target="_blank"
                            className="rounded-md border border-gray-300 px-3 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-900 hover:text-gray-900"
                          >
                            View Receipt
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}