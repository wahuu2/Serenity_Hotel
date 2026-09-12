import Link from "next/link";

type BookingSuccessPageProps = {
  searchParams: Promise<{
    reference?: string;
  }>;
};

type BookingData = {
  bookingReference: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guests: number;
  nights: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  payment: {
    amount: number;
    currency: string;
    paymentMethod: string;
    transactionReference: string;
    status: string;
    paidAt: string | null;
  } | null;
};

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessPageProps) {
  const { reference } = await searchParams;

  let booking: BookingData | null = null;

  if (reference) {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/api/bookings/${reference}`,
        {
          cache: "no-store",
        }
      );

      if (response.ok) {
        const data = await response.json();

        if (data.success) {
          booking = data.booking;
        }
      }
    } catch (error) {
      console.error(
        "Failed to load booking confirmation:",
        error
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* =========================================================
          HERO
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
            Your booking is confirmed.
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-300 md:text-lg md:leading-8">
            Thank you for choosing Serenity Hotel. Your reservation has been
            successfully processed and your stay is now confirmed.
          </p>
        </div>
      </section>

      {/* =========================================================
          BOOKING CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-5xl px-5 py-10 sm:px-6 md:py-16 lg:px-8">
        {booking ? (
          <div className="space-y-6">
            {/* =====================================================
                BOOKING REFERENCE
            ===================================================== */}
            <section className="bg-white p-6 shadow-sm sm:p-8 md:p-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                    Reservation Confirmed
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold text-gray-900 md:text-3xl">
                    Booking reference
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Keep this reference for your records and when contacting
                    Serenity Hotel.
                  </p>
                </div>

                <div className="border border-amber-200 bg-amber-50 px-5 py-4 sm:min-w-[240px] sm:text-right">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                    Reference
                  </p>

                  <p className="mt-2 break-all text-lg font-semibold tracking-wide text-gray-900">
                    {booking.bookingReference}
                  </p>
                </div>
              </div>
            </section>

            {/* =====================================================
                GUEST DETAILS
            ===================================================== */}
            <section className="bg-white p-6 shadow-sm sm:p-8 md:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                  Guest
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                  Guest details
                </h2>
              </div>

              <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Full Name
                  </p>

                  <p className="mt-2 font-medium text-gray-900">
                    {booking.guestName}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email Address
                  </p>

                  <p className="mt-2 break-all font-medium text-gray-900">
                    {booking.guestEmail}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Phone Number
                  </p>

                  <p className="mt-2 font-medium text-gray-900">
                    {booking.guestPhone}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Number of Guests
                  </p>

                  <p className="mt-2 font-medium text-gray-900">
                    {booking.guests}{" "}
                    {booking.guests === 1 ? "Guest" : "Guests"}
                  </p>
                </div>
              </div>
            </section>

            {/* =====================================================
                BOOKING DETAILS
            ===================================================== */}
            <section className="bg-white p-6 shadow-sm sm:p-8 md:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                  Reservation
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                  Booking details
                </h2>
              </div>

              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <div className="border border-gray-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Number of Nights
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    {booking.nights}{" "}
                    {booking.nights === 1 ? "Night" : "Nights"}
                  </p>
                </div>

                <div className="border border-gray-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Booking Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-600" />

                    <p className="font-semibold capitalize text-gray-900">
                      {booking.status}
                    </p>
                  </div>
                </div>

                <div className="border border-gray-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total Amount
                  </p>

                  <p className="mt-2 text-lg font-semibold text-gray-900">
                    KSh {booking.totalAmount.toLocaleString()}
                  </p>
                </div>

                <div className="border border-gray-200 p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Payment Status
                  </p>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green-600" />

                    <p className="font-semibold capitalize text-gray-900">
                      {booking.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* =====================================================
                PAYMENT DETAILS
            ===================================================== */}
            <section className="bg-white p-6 shadow-sm sm:p-8 md:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                  Payment
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-gray-900">
                  Payment details
                </h2>
              </div>

              {booking.payment ? (
                <div className="mt-8">
                  {/* Payment Status Banner */}
                  <div className="border border-green-200 bg-green-50 p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-700">
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
                      </div>

                      <div>
                        <p className="font-semibold text-green-900">
                          Payment successfully recorded
                        </p>

                        <p className="mt-1 text-sm leading-6 text-green-800">
                          Your payment has been linked to this reservation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-6 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Amount Paid
                      </p>

                      <p className="mt-2 font-semibold text-gray-900">
                        {booking.payment.currency}{" "}
                        {booking.payment.amount.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Payment Method
                      </p>

                      <p className="mt-2 font-semibold capitalize text-gray-900">
                        {booking.payment.paymentMethod}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Transaction Reference
                      </p>

                      <p className="mt-2 break-all font-semibold text-gray-900">
                        {booking.payment.transactionReference}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Payment Status
                      </p>

                      <p className="mt-2 font-semibold capitalize text-green-600">
                        {booking.payment.status}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-8 border border-amber-200 bg-amber-50 p-5">
                  <p className="font-semibold text-amber-900">
                    Payment information is not available yet.
                  </p>

                  <p className="mt-1 text-sm leading-6 text-amber-800">
                    Your booking has been created, but the payment record has
                    not been returned yet.
                  </p>
                </div>
              )}
            </section>

            {/* =====================================================
                NEXT STEPS
            ===================================================== */}
            <section className="bg-gray-950 p-6 text-white shadow-sm sm:p-8 md:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                Your Stay
              </p>

              <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
                We look forward to welcoming you.
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
                Your reservation is complete. You can view your bookings at
                any time or continue exploring what Serenity Hotel has to
                offer.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/my-bookings"
                  className="bg-white px-6 py-3.5 text-center text-sm font-semibold text-gray-950 transition hover:bg-amber-400"
                >
                  View My Bookings
                </Link>

                <Link
                  href="/restaurant"
                  className="border border-white/30 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-gray-950"
                >
                  Explore Restaurant
                </Link>

                <Link
                  href="/"
                  className="border border-white/30 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-gray-950"
                >
                  Back to Home
                </Link>
              </div>
            </section>
          </div>
        ) : (
          /* =======================================================
             BOOKING NOT FOUND
          ======================================================= */
          <div className="mx-auto max-w-2xl bg-white p-8 text-center shadow-sm sm:p-10">
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
              Confirmation unavailable
            </h1>

            <p className="mx-auto mt-4 max-w-lg leading-7 text-gray-600">
              We could not load your booking confirmation at this time.
              Please check your booking reference or view your bookings.
            </p>

            {reference && (
              <div className="mt-7 border border-gray-200 bg-[#f6f3ee] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Booking Reference
                </p>

                <p className="mt-2 break-all font-semibold text-gray-900">
                  {reference}
                </p>
              </div>
            )}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/my-bookings"
                className="bg-gray-950 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                View My Bookings
              </Link>

              <Link
                href="/rooms"
                className="border border-gray-300 px-6 py-3.5 text-center text-sm font-semibold text-gray-900 transition hover:border-gray-900"
              >
                Browse Rooms
              </Link>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}