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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <p className="text-gray-600">
            Loading booking...
          </p>
        </div>
      </main>
    );
  }

  if (error || !booking) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
            {error || "Booking not found."}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Serenity Hotel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Complete Your Payment
          </h1>

          <p className="mt-2 text-gray-600">
            Review your booking before completing the payment.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="border-b pb-6">
            <p className="text-sm text-gray-500">
              Booking Reference
            </p>

            <p className="mt-1 text-lg font-semibold text-gray-900">
              {booking.bookingReference}
            </p>
          </div>

          <div className="grid gap-6 py-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-gray-500">
                Room
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {booking.room.name}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Guests
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {booking.guests}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Check-in
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {new Date(
                  booking.checkIn
                ).toLocaleDateString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Check-out
              </p>

              <p className="mt-1 font-semibold text-gray-900">
                {new Date(
                  booking.checkOut
                ).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">
                Total Amount
              </span>

              <span className="text-2xl font-bold text-gray-900">
                KSh{" "}
                {booking.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {error && (
            <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handlePayment}
            disabled={paying}
            className="mt-8 w-full rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {paying
              ? "Processing Payment..."
              : `Pay KSh ${booking.totalAmount.toLocaleString()}`}
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Development payment mode. No real money will be charged.
          </p>
        </div>
      </div>
    </main>
  );
}