"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const reference =
    searchParams.get("reference") || "Not available";

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* =========================================================
          HERO / CONFIRMATION
      ========================================================= */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 text-white md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,130,50,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Success Icon */}
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-amber-400/30 bg-amber-400/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-400 text-gray-950">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m5 12 4 4L19 6"
                />
              </svg>
            </div>
          </div>

          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
            Serenity Hotel
          </p>

          <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
            Your stay is confirmed.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-300 md:text-lg md:leading-8">
            Thank you for choosing Serenity Hotel. Your payment has been
            successfully processed and your reservation is confirmed.
          </p>
        </div>
      </section>

      {/* =========================================================
          CONFIRMATION CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-3xl px-5 py-10 sm:px-6 md:py-16">
        <div className="bg-white shadow-sm">
          {/* Confirmation Header */}
          <div className="border-b border-gray-200 p-6 sm:p-8 md:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center bg-amber-50 text-amber-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 3.75h9l3.75 3.75v9l-3.75 3.75h-9L3.75 16.5v-9L7.5 3.75Z"
                  />
                </svg>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  Payment Complete
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-gray-900">
                  Reservation successfully confirmed
                </h2>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Keep your transaction reference below for your records.
                </p>
              </div>
            </div>
          </div>

          {/* Transaction Reference */}
          <div className="p-6 sm:p-8 md:p-10">
            <div className="border border-gray-200 bg-[#f6f3ee] p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                Transaction Reference
              </p>

              <p className="mt-3 break-all text-lg font-semibold tracking-wide text-gray-900 sm:text-xl">
                {reference}
              </p>

              <p className="mt-3 text-xs leading-5 text-gray-500">
                This reference confirms your payment and may be useful when
                contacting Serenity Hotel about your reservation.
              </p>
            </div>

            {/* Next Steps */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                What&apos;s Next
              </p>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="border border-gray-200 p-5">
                  <p className="text-sm font-semibold text-gray-900">
                    01. View booking
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Check your reservation details from your bookings.
                  </p>
                </div>

                <div className="border border-gray-200 p-5">
                  <p className="text-sm font-semibold text-gray-900">
                    02. Prepare
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Keep your booking details ready for your stay.
                  </p>
                </div>

                <div className="border border-gray-200 p-5">
                  <p className="text-sm font-semibold text-gray-900">
                    03. Enjoy
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    We look forward to welcoming you to Serenity Hotel.
                  </p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/my-bookings"
                className="flex-1 bg-gray-950 px-6 py-4 text-center text-sm font-semibold uppercase tracking-[0.1em] text-white transition hover:bg-amber-700"
              >
                View My Bookings
              </Link>

              <Link
                href="/"
                className="flex-1 border border-gray-300 px-6 py-4 text-center text-sm font-semibold text-gray-900 transition hover:border-gray-900 hover:bg-gray-50"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Hotel Message */}
        <div className="mt-6 border border-gray-200 bg-white p-6 text-center sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Serenity Hotel
          </p>

          <h2 className="mt-3 text-xl font-semibold text-gray-900">
            A warm welcome awaits you.
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600">
            Comfortable rooms, thoughtful service, good food, and genuine
            Kenyan hospitality — we look forward to making your stay memorable.
          </p>
        </div>
      </section>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6">
          <div className="text-center">
            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-gray-300 border-t-gray-950" />

            <p className="mt-5 text-sm text-gray-600">
              Confirming your payment...
            </p>
          </div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}