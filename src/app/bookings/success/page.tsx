import Link from "next/link";

type BookingSuccessPageProps = {
  searchParams: Promise<{
    reference?: string;
  }>;
};

export default async function BookingSuccessPage({
  searchParams,
}: BookingSuccessPageProps) {
  const { reference } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-lg rounded-xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
          ✓
        </div>

        <h1 className="mt-6 text-3xl font-bold text-gray-900">
          Booking Confirmation
        </h1>

        <p className="mt-4 text-gray-600">
          Your reservation has been successfully created.
        </p>

        {reference && (
          <div className="mt-6 rounded-lg bg-gray-50 p-5">
            <p className="text-sm text-gray-500">
              Booking Reference
            </p>

            <p className="mt-2 text-xl font-bold text-gray-900">
              {reference}
            </p>
          </div>
        )}

        <div className="mt-6 rounded-lg border border-gray-200 p-5 text-left">
          <p className="text-sm font-semibold text-gray-900">
            What happens next?
          </p>

          <p className="mt-2 text-sm leading-6 text-gray-600">
            Your booking details have been saved successfully.
            Once payment is completed, your booking confirmation
            will contain your payment and reservation details.
          </p>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/my-bookings"
            className="rounded-md bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
          >
            My Bookings
          </Link>

          <Link
            href="/rooms"
            className="rounded-md border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Browse Rooms
          </Link>
        </div>
      </div>
    </main>
  );
}