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

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatStatus(status: string) {
    if (!status) return "Unknown";

    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  function getPaymentStatusClasses(status: string) {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "refunded":
        return "bg-purple-100 text-purple-700";

      case "unpaid":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  function getBookingStatusClasses(status: string) {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-gray-950" />

          <p className="mt-5 text-sm text-gray-600">
            Preparing your receipt...
          </p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6">
        <div className="w-full max-w-lg bg-white p-8 text-center shadow-sm sm:p-10">
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

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Serenity Hotel
          </p>

          <h1 className="mt-4 text-3xl font-semibold text-gray-900">
            Receipt Not Found
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            {error || "We could not find this booking."}
          </p>

          <Link
            href="/my-bookings"
            className="mt-7 inline-flex bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            View My Bookings
          </Link>
        </div>
      </main>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-[#f6f3ee] px-5 py-8 sm:px-6 md:py-12">
        <div className="mx-auto max-w-4xl">
          {/* =====================================================
              ACTION BAR
          ===================================================== */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between print:hidden">
            <Link
              href="/my-bookings"
              className="border border-gray-300 bg-white px-5 py-3 text-center text-sm font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-50"
            >
              ← Back to My Bookings
            </Link>

            <button
              type="button"
              onClick={handlePrint}
              className="bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700"
            >
              Print / Save as PDF
            </button>
          </div>

          {/* =====================================================
              RECEIPT
          ===================================================== */}
          <div className="receipt-container bg-white shadow-sm">
            {/* =================================================
                RECEIPT HEADER
            ================================================= */}
            <header className="border-b border-gray-200 p-7 sm:p-10 md:p-12">
              <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center overflow-hidden">
                      <img
                        src="/logo.png"
                        alt="Serenity Hotel logo"
                        className="h-full w-full object-contain"
                      />
                    </div>

                    <div className="leading-none">
                      <p className="text-xl font-semibold tracking-[0.08em] text-gray-950">
                        SERENITY
                      </p>

                      <p className="mt-1 text-[9px] font-semibold tracking-[0.3em] text-amber-700">
                        HOTEL
                      </p>
                    </div>
                  </div>

                  <p className="mt-7 text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                    Guest Reservation
                  </p>

                  <h1 className="mt-3 text-3xl font-semibold text-gray-950 md:text-4xl">
                    Booking Receipt
                  </h1>

                  <p className="mt-3 max-w-md text-sm leading-6 text-gray-600">
                    Thank you for choosing Serenity Hotel. Please keep this
                    receipt for your records.
                  </p>
                </div>

                <div className="sm:text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                    Booking Reference
                  </p>

                  <p className="mt-2 break-all text-xl font-semibold tracking-wide text-gray-950">
                    {booking.bookingReference}
                  </p>

                  <p className="mt-3 text-xs text-gray-500">
                    Booking date
                  </p>

                  <p className="mt-1 text-sm font-medium text-gray-900">
                    {formatDate(booking.createdAt)}
                  </p>
                </div>
              </div>
            </header>

            {/* =================================================
                STATUS BANNER
            ================================================= */}
            <div
              className={`mx-6 mt-6 p-5 sm:mx-10 md:mx-12 ${
                booking.status === "cancelled"
                  ? "border border-red-200 bg-red-50"
                  : booking.paymentStatus === "paid"
                  ? "border border-green-200 bg-green-50"
                  : "border border-amber-200 bg-amber-50"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    booking.status === "cancelled"
                      ? "bg-red-100 text-red-700"
                      : booking.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {booking.status === "cancelled" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 6l12 12M18 6 6 18"
                      />
                    </svg>
                  ) : booking.paymentStatus === "paid" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m5 12 4 4L19 6"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
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
                    </svg>
                  )}
                </div>

                <div>
                  <p
                    className={`font-semibold ${
                      booking.status === "cancelled"
                        ? "text-red-800"
                        : booking.paymentStatus === "paid"
                        ? "text-green-800"
                        : "text-amber-800"
                    }`}
                  >
                    {booking.status === "cancelled"
                      ? "This booking has been cancelled."
                      : booking.paymentStatus === "paid" &&
                        booking.status === "confirmed"
                      ? "Payment received. Your booking is confirmed."
                      : booking.paymentStatus === "paid" &&
                        booking.status === "completed"
                      ? "Payment received. This booking has been completed."
                      : booking.paymentStatus === "refunded"
                      ? "This payment has been refunded."
                      : "This booking is awaiting payment confirmation."}
                  </p>

                  <p
                    className={`mt-1 text-sm ${
                      booking.status === "cancelled"
                        ? "text-red-700"
                        : booking.paymentStatus === "paid"
                        ? "text-green-700"
                        : "text-amber-700"
                    }`}
                  >
                    Booking status: {formatStatus(booking.status)}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                MAIN CONTENT
            ================================================= */}
            <div className="p-6 sm:p-10 md:p-12">
              {/* =================================================
                  GUEST INFORMATION
              ================================================= */}
              <section>
                <div className="flex items-end justify-between gap-4 border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                      Guest
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-gray-900">
                      Guest Information
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Guest Name
                    </p>

                    <p className="mt-2 font-medium text-gray-900">
                      {booking.guestName}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Email
                    </p>

                    <p className="mt-2 break-all font-medium text-gray-900">
                      {booking.guestEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Phone
                    </p>

                    <p className="mt-2 font-medium text-gray-900">
                      {booking.guestPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Guests
                    </p>

                    <p className="mt-2 font-medium text-gray-900">
                      {booking.guests}{" "}
                      {booking.guests === 1 ? "Guest" : "Guests"}
                    </p>
                  </div>
                </div>
              </section>

              {/* =================================================
                  RESERVATION DETAILS
              ================================================= */}
              <section className="mt-12">
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                    Accommodation
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-gray-900">
                    Reservation Details
                  </h2>
                </div>

                <div className="mt-6 border border-gray-200">
                  <div className="grid gap-0 sm:grid-cols-2">
                    <div className="border-b border-gray-200 p-5 sm:border-r">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Room
                      </p>

                      <p className="mt-2 text-lg font-semibold text-gray-900">
                        {booking.room?.name || "N/A"}
                      </p>
                    </div>

                    <div className="border-b border-gray-200 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Room Type
                      </p>

                      <p className="mt-2 font-medium capitalize text-gray-900">
                        {booking.room?.type || "N/A"}
                      </p>
                    </div>

                    <div className="border-b border-gray-200 p-5 sm:border-r">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Check-in
                      </p>

                      <p className="mt-2 font-medium text-gray-900">
                        {formatDate(booking.checkIn)}
                      </p>
                    </div>

                    <div className="border-b border-gray-200 p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Check-out
                      </p>

                      <p className="mt-2 font-medium text-gray-900">
                        {formatDate(booking.checkOut)}
                      </p>
                    </div>

                    <div className="p-5 sm:border-r">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Number of Nights
                      </p>

                      <p className="mt-2 font-medium text-gray-900">
                        {booking.nights}{" "}
                        {booking.nights === 1 ? "Night" : "Nights"}
                      </p>
                    </div>

                    <div className="p-5">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Room Price / Night
                      </p>

                      <p className="mt-2 font-medium text-gray-900">
                        KSh{" "}
                        {booking.room?.price?.toLocaleString() || "0"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* =================================================
                  PAYMENT INFORMATION
              ================================================= */}
              <section className="mt-12">
                <div className="border-b border-gray-200 pb-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                    Payment
                  </p>

                  <h2 className="mt-2 text-xl font-semibold text-gray-900">
                    Payment Information
                  </h2>
                </div>

                <div className="mt-6">
                  <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Payment Status
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        Current payment state
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${getPaymentStatusClasses(
                        booking.paymentStatus
                      )}`}
                    >
                      {formatStatus(booking.paymentStatus)}
                    </span>
                  </div>

                  {booking.payment ? (
                    <div className="mt-6 grid gap-6 sm:grid-cols-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Transaction Reference
                        </p>

                        <p className="mt-2 break-all font-medium text-gray-900">
                          {booking.payment.transactionReference}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Payment Method
                        </p>

                        <p className="mt-2 font-medium capitalize text-gray-900">
                          {booking.payment.paymentMethod}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Payment Date
                        </p>

                        <p className="mt-2 font-medium text-gray-900">
                          {booking.payment.paidAt
                            ? formatDate(booking.payment.paidAt)
                            : "Not paid"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Amount Paid
                        </p>

                        <p className="mt-2 font-semibold text-gray-900">
                          {booking.payment.currency}{" "}
                          {booking.payment.amount.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-6 border border-amber-200 bg-amber-50 p-5">
                      <p className="text-sm font-semibold text-amber-900">
                        No payment has been recorded for this booking.
                      </p>

                      <p className="mt-1 text-sm leading-6 text-amber-800">
                        Payment information will appear here once a payment
                        has been recorded.
                      </p>
                    </div>
                  )}
                </div>
              </section>

              {/* =================================================
                  TOTAL
              ================================================= */}
              <section className="mt-12 border-t-2 border-gray-950 pt-7">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                      Total Reservation
                    </p>

                    <p className="mt-2 text-lg font-semibold text-gray-900">
                      {booking.nights}{" "}
                      {booking.nights === 1 ? "night" : "nights"}
                    </p>
                  </div>

                  <p className="text-3xl font-semibold text-gray-950">
                    KSh {booking.totalAmount.toLocaleString()}
                  </p>
                </div>
              </section>

              {/* =================================================
                  FOOTER STATUS
              ================================================= */}
              <section className="mt-10 border-t border-gray-200 pt-7">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Booking Status
                    </p>

                    <span
                      className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider ${getBookingStatusClasses(
                        booking.status
                      )}`}
                    >
                      {formatStatus(booking.status)}
                    </span>
                  </div>

                  <div className="sm:text-right">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Booking Date
                    </p>

                    <p className="mt-2 font-medium text-gray-900">
                      {formatDate(booking.createdAt)}
                    </p>
                  </div>
                </div>
              </section>

              {/* =================================================
                  RECEIPT FOOTER
              ================================================= */}
              <footer className="mt-12 border-t border-gray-200 pt-8 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center overflow-hidden">
                  <img
                    src="/logo.png"
                    alt="Serenity Hotel"
                    className="h-full w-full object-contain"
                  />
                </div>

                <p className="mt-4 text-sm font-semibold tracking-[0.12em] text-gray-900">
                  SERENITY HOTEL
                </p>

                <p className="mt-2 text-xs leading-5 text-gray-500">
                  Please keep this receipt for your records.
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  We look forward to welcoming you.
                </p>
              </footer>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        @media print {
          @page {
            margin: 12mm;
          }

          html,
          body {
            background: white !important;
          }

          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .receipt-container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            box-shadow: none !important;
          }

          a {
            text-decoration: none !important;
          }
        }
      `}</style>
    </>
  );
}