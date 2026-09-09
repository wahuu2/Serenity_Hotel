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
        `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/bookings/${reference}`,
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
      console.error("Failed to load booking confirmation:", error);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-xl bg-white p-8 shadow-sm sm:p-10">
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
              ✓
            </div>

            <h1 className="mt-6 text-3xl font-bold text-gray-900">
              Booking Confirmation
            </h1>

            <p className="mt-3 text-gray-600">
              Your reservation details are shown below.
            </p>
          </div>

          {booking ? (
            <div className="mt-8 space-y-6">
              <div className="rounded-lg bg-gray-50 p-5 text-center">
                <p className="text-sm text-gray-500">
                  Booking Reference
                </p>

                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {booking.bookingReference}
                </p>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Guest Details
                </h2>

                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium text-gray-900">
                      {booking.guestName}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-gray-900">
                      {booking.guestEmail}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium text-gray-900">
                      {booking.guestPhone}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Number of Guests
                    </p>
                    <p className="font-medium text-gray-900">
                      {booking.guests}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Booking Details
                </h2>

                <div className="mt-3 grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Number of Nights
                    </p>
                    <p className="font-medium text-gray-900">
                      {booking.nights}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Booking Status
                    </p>
                    <p className="font-medium capitalize text-gray-900">
                      {booking.status}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>
                    <p className="font-medium text-gray-900">
                      KES {booking.totalAmount.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Payment Status
                    </p>
                    <p className="font-medium capitalize text-gray-900">
                      {booking.paymentStatus}
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Payment Details
                </h2>

                {booking.payment ? (
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-sm text-gray-500">
                        Amount Paid
                      </p>
                      <p className="font-medium text-gray-900">
                        {booking.payment.currency}{" "}
                        {booking.payment.amount.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Payment Method
                      </p>
                      <p className="font-medium capitalize text-gray-900">
                        {booking.payment.paymentMethod}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Transaction Reference
                      </p>
                      <p className="font-medium text-gray-900">
                        {booking.payment.transactionReference}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">
                        Payment Status
                      </p>
                      <p className="font-medium capitalize text-green-600">
                        {booking.payment.status}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 rounded-lg bg-yellow-50 p-4">
                    <p className="text-sm text-yellow-800">
                      Payment has not been recorded for this booking yet.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-8 rounded-lg bg-yellow-50 p-5 text-center">
              <p className="text-yellow-800">
                We could not load your booking confirmation.
              </p>

              {reference && (
                <p className="mt-2 text-sm text-yellow-700">
                  Booking Reference: {reference}
                </p>
              )}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/my-bookings"
              className="rounded-md bg-gray-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-gray-700"
            >
              My Bookings
            </Link>

            <Link
              href="/rooms"
              className="rounded-md border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Browse Rooms
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}