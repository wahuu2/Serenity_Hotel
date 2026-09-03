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
          Booking Created
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

        <p className="mt-6 text-sm text-gray-500">
          Your booking is currently pending confirmation.
        </p>

        <Link
          href="/rooms"
          className="mt-8 inline-block rounded-md bg-gray-900 px-8 py-3 font-semibold text-white transition hover:bg-gray-700"
        >
          Back to Rooms
        </Link>

      </div>
    </main>
  );
}