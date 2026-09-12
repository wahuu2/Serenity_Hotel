"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Booking = {
  _id: string;
  bookingReference: string;
  room: {
    name: string;
    price: number;
  };
  checkIn: string;
  checkOut: string;
  guests: number;
  totalAmount: number;
  status: string;
};

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();

  const bookingId = params.bookingId as string;

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBooking() {
      try {
        const response = await fetch("/api/bookings");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to fetch booking."
          );
        }

        const foundBooking = data.bookings?.find(
          (item: Booking) => item._id === bookingId
        );

        if (!foundBooking) {
          throw new Error("Booking not found.");
        }

        setBooking(foundBooking);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load booking."
        );
      } finally {
        setLoading(false);
      }
    }

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId]);

  const handlePayment = async () => {
    try {
      setPaying(true);
      setError("");

      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookingId,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Payment failed."
        );
      }

      router.push(
        `/payments/success?reference=${data.payment.transactionReference}`
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Payment failed."
      );
    } finally {
      setPaying(false);
    }
  };

  /* =============================================================
      LOADING STATE
  ============================================================= */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-gray-950" />

          <p className="mt-5 text-sm text-gray-600">
            Preparing your payment...
          </p>
        </div>
      </main>
    );
  }

  /* =============================================================
      ERROR / BOOKING NOT FOUND
  ============================================================= */
  if (error || !booking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6 py-12">
        <div className="w-full max-w-lg bg-white p-8 text-center shadow-sm sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Serenity Hotel
          </p>

          <h1 className="mt-4 text-3xl font-semibold text-gray-900">
            Payment unavailable
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            {error || "Booking not found."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/rooms")}
            className="mt-7 bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Return to Rooms
          </button>
        </div>
      </main>
    );
  }

  /* =============================================================
      PAYMENT PAGE
  ============================================================= */
  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* =========================================================
          PAGE HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,130,50,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
              Reservation
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              Complete your payment.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg md:leading-8">
              Review your stay and complete the final step of your Serenity
              Hotel reservation.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          PAYMENT CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:items-start lg:gap-12">
          {/* =====================================================
              LEFT SIDE
          ===================================================== */}
          <div className="space-y-6">
            {/* Booking Reference */}
            <section className="bg-white p-6 shadow-sm sm:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                    Booking Reference
                  </p>

                  <p className="mt-2 text-xl font-semibold tracking-wide text-gray-900">
                    {booking.bookingReference}
                  </p>
                </div>

                <span className="w-fit border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-amber-800">
                  Reservation Created
                </span>
              </div>
            </section>

            {/* Stay Details */}
            <section className="bg-white p-6 shadow-sm sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                  Your Stay
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-gray-900 md:text-3xl">
                  Reservation details
                </h2>
              </div>

              <div className="mt-8">
                <div className="border-b border-gray-200 pb-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Room
                  </p>

                  <h3 className="mt-2 text-xl font-semibold text-gray-900">
                    {booking.room.name}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    KSh {booking.room.price.toLocaleString()} per night
                  </p>
                </div>

                <div className="grid gap-6 py-7 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Check-in
                    </p>

                    <p className="mt-2 font-medium text-gray-900">
                      {new Date(
                        booking.checkIn
                      ).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Check-out
                    </p>

                    <p className="mt-2 font-medium text-gray-900">
                      {new Date(
                        booking.checkOut
                      ).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
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

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Booking Status
                    </p>

                    <p className="mt-2 font-medium capitalize text-gray-900">
                      {booking.status}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white p-6 shadow-sm sm:p-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                  Payment
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-gray-900 md:text-3xl">
                  Choose your payment method
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Complete your reservation using the available payment
                  option.
                </p>
              </div>

              {/* M-Pesa */}
              <div className="mt-7 border border-gray-900 bg-white p-5 sm:p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-gray-950 text-sm font-bold text-white">
                    M
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      M-Pesa
                    </p>

                    <p className="mt-1 text-sm leading-6 text-gray-600">
                      Pay securely using M-Pesa.
                    </p>
                  </div>
                </div>
              </div>

              {/* Development Notice */}
              <div className="mt-5 border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-900">
                  Development payment mode
                </p>

                <p className="mt-1 text-xs leading-5 text-amber-800">
                  This is a simulated payment for the current development
                  version of Serenity Hotel. No real money will be charged.
                </p>
              </div>
            </section>

            {/* Error */}
            {error && (
              <div
                role="alert"
                className="border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
              >
                <p className="font-semibold">
                  Payment could not be completed
                </p>

                <p className="mt-1">
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* =====================================================
              RIGHT SIDE — PAYMENT SUMMARY
          ===================================================== */}
          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden bg-gray-950 text-white shadow-sm">
              {/* Header */}
              <div className="border-b border-white/10 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                  Payment Summary
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  Complete reservation
                </h2>
              </div>

              {/* Summary */}
              <div className="p-6 sm:p-8">
                <div className="border-b border-white/10 pb-7">
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Room
                  </p>

                  <p className="mt-2 text-lg font-semibold text-white">
                    {booking.room.name}
                  </p>
                </div>

                <div className="space-y-5 border-b border-white/10 py-7">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-400">
                      Guests
                    </span>

                    <span className="text-sm font-medium text-white">
                      {booking.guests}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-400">
                      Check-in
                    </span>

                    <span className="text-right text-sm font-medium text-white">
                      {new Date(
                        booking.checkIn
                      ).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-gray-400">
                      Check-out
                    </span>

                    <span className="text-right text-sm font-medium text-white">
                      {new Date(
                        booking.checkOut
                      ).toLocaleDateString("en-KE", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-7">
                  <p className="text-sm text-gray-400">
                    Total amount
                  </p>

                  <p className="mt-2 text-4xl font-semibold text-white">
                    KSh {booking.totalAmount.toLocaleString()}
                  </p>
                </div>

                {/* Pay Button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={paying}
                  className="mt-8 w-full bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-gray-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-gray-400 disabled:text-gray-900"
                >
                  {paying
                    ? "Processing Payment..."
                    : `Pay KSh ${booking.totalAmount.toLocaleString()}`}
                </button>

                <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                  By continuing, you are completing your reservation at
                  Serenity Hotel.
                </p>
              </div>
            </div>

            {/* Trust Note */}
            <div className="mt-5 border border-gray-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Serenity Hotel
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Your reservation details are shown above so you can review
                everything before completing payment.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}