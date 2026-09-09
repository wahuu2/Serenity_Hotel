"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();

  const reference =
    searchParams.get("reference") || "Not available";

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <span className="text-3xl text-green-600">
              ✓
            </span>
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Serenity Hotel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Payment Successful
          </h1>

          <p className="mt-3 text-gray-600">
            Your payment has been successfully processed and
            your booking has been confirmed.
          </p>

          <div className="mt-8 rounded-lg bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Transaction Reference
            </p>

            <p className="mt-2 break-all font-semibold text-gray-900">
              {reference}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/my-bookings"
              className="rounded-lg bg-black px-6 py-3 font-semibold text-white transition hover:bg-gray-800"
            >
              View My Bookings
            </Link>

            <Link
              href="/"
              className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}