"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Booking = {
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guests: number;
  nights: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  checkIn: string;
  checkOut: string;
  createdAt: string;
  room: {
    name: string;
    type: string;
    price: number;
  };
  payment: {
    amount: number;
    currency: string;
    paymentMethod: string;
    transactionReference: string;
    status: string;
    paidAt: string | null;
  } | null;
};

type ReceiptPageProps = {
  params: Promise<{
    reference: string;
  }>;
};

export default function BookingReceiptPage({
  params,
}: ReceiptPageProps) {
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooking() {
      try {
        const { reference } = await params;

        const response = await fetch(
          `/api/bookings/${reference}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load booking."
          );
        }

        setBooking(data.booking);
      } catch (error) {
        console.error(
          "Failed to load booking receipt:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load booking receipt."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBooking();
  }, [params]);

  function handlePrint() {
    window.print();
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <p className="text-gray-600">
          Loading booking receipt...
        </p>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-lg rounded-xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">
            Receipt Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "We could not find this booking."}
          </p>

          <Link
            href="/my-bookings"
            className="mt-6 inline-block rounded-md bg-gray-900 px-6 py-3 font-semibold text-white"
          >
            My Bookings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-100 px-6 py-10">
        <div className="mx-auto max-w-3xl">
          {/* Action buttons */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:justify-between print:hidden">
            <Link
              href="/my-bookings"
              className="rounded-md border border-gray-300 bg-white px-5 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back to My Bookings
            </Link>

            <button
              onClick={handlePrint}
              className="rounded-md bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-700"
            >
              Print / Save as PDF
            </button>
          </div>

          {/* Receipt */}
          <div className="receipt-container bg-white p-8 shadow-sm sm:p-12">
            {/* Header */}
            <div className="border-b border-gray-200 pb-8 text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500">
                Serenity Hotel
              </p>

              <h1 className="mt-3 text-3xl font-bold text-gray-900">
                Booking Receipt
              </h1>

              <p className="mt-2 text-sm text-gray-500">
                Thank you for choosing Serenity Hotel
              </p>
            </div>

            {/* Booking reference */}
            <div className="mt-8 rounded-lg bg-gray-50 p-5 text-center">
              <p className="text-sm text-gray-500">
                Booking Reference
              </p>

              <p className="mt-2 text-2xl font-bold tracking-wide text-gray-900">
                {booking.bookingReference}
              </p>
            </div>

            {/* Guest information */}
            <section className="mt-8">
              <h2 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                Guest Information
              </h2>

              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-gray-500">
                    Guest Name
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {booking.guestName}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Email
                  </p>
                  <p className="mt-1 break-all font-medium text-gray-900">
                    {booking.guestEmail}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Phone
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {booking.guestPhone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    Guests
                  </p>
                  <p className="mt-1 font-medium text-gray-900">
                    {booking.guests}
                  </p>
                </div>
              </div>
            </section>

            {/* Room information */}
            <section className="mt-8">
              <h2 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                Reservation Details
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Room
                  </span>

                  <span className="text-right font-medium text-gray-900">
                    {booking.room?.name || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Room Type
                  </span>

                  <span className="text-right font-medium capitalize text-gray-900">
                    {booking.room?.type || "N/A"}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Check-in
                  </span>

                  <span className="text-right font-medium text-gray-900">
                    {new Date(
                      booking.checkIn
                    ).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Check-out
                  </span>

                  <span className="text-right font-medium text-gray-900">
                    {new Date(
                      booking.checkOut
                    ).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Number of Nights
                  </span>

                  <span className="font-medium text-gray-900">
                    {booking.nights}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Room Price / Night
                  </span>

                  <span className="font-medium text-gray-900">
                    KES{" "}
                    {booking.room?.price?.toLocaleString() ||
                      "0"}
                  </span>
                </div>
              </div>
            </section>

            {/* Payment information */}
            <section className="mt-8">
              <h2 className="border-b border-gray-200 pb-3 text-lg font-bold text-gray-900">
                Payment Information
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Payment Status
                  </span>

                  <span className="font-semibold capitalize text-green-600">
                    {booking.paymentStatus}
                  </span>
                </div>

                {booking.payment && (
                  <>
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">
                        Transaction Reference
                      </span>

                      <span className="break-all text-right font-medium text-gray-900">
                        {
                          booking.payment
                            .transactionReference
                        }
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">
                        Payment Method
                      </span>

                      <span className="font-medium capitalize text-gray-900">
                        {booking.payment.paymentMethod}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">
                        Payment Date
                      </span>

                      <span className="font-medium text-gray-900">
                        {booking.payment.paidAt
                          ? new Date(
                              booking.payment.paidAt
                            ).toLocaleDateString(
                              "en-KE",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              }
                            )
                          : "Not paid"}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </section>

            {/* Total */}
            <section className="mt-8 border-t-2 border-gray-900 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total Amount
                </span>

                <span className="text-2xl font-bold text-gray-900">
                  KES{" "}
                  {booking.totalAmount.toLocaleString()}
                </span>
              </div>
            </section>

            {/* Status */}
            <div className="mt-8 flex flex-col gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Booking Status
                </p>

                <p className="mt-1 font-semibold capitalize text-gray-900">
                  {booking.status}
                </p>
              </div>

              <div className="sm:text-right">
                <p className="text-sm text-gray-500">
                  Booking Date
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {new Date(
                    booking.createdAt
                  ).toLocaleDateString("en-KE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-10 border-t border-gray-200 pt-6 text-center">
              <p className="text-sm font-medium text-gray-900">
                Serenity Hotel
              </p>

              <p className="mt-1 text-xs text-gray-500">
                Please keep this receipt for your records.
              </p>

              <p className="mt-1 text-xs text-gray-500">
                We look forward to welcoming you.
              </p>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @media print {
          @page {
            margin: 15mm;
          }

          body {
            background: white !important;
          }

          .receipt-container {
            box-shadow: none !important;
            width: 100% !important;
          }
        }
      `}</style>
    </>
  );
}