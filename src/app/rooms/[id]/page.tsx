import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/room.model";
import { notFound } from "next/navigation";

type RoomDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RoomDetailsPage({
  params,
}: RoomDetailsPageProps) {
  const { id } = await params;

  await connectToDatabase();

  const room = await Room.findById(id).lean();

  if (!room) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
            {room.type}
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            {room.name}
          </h1>
        </div>
      </section>

      {/* Room Details */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          {/* Room Information */}
          <div className="lg:col-span-2">
            {/* Image */}
            <div className="flex h-80 items-center justify-center rounded-xl bg-gray-200 text-gray-500">
              Room Image
            </div>

            <div className="mt-8">
              <h2 className="text-3xl font-bold text-gray-900">
                {room.name}
              </h2>

              <p className="mt-4 leading-8 text-gray-600">
                {room.description}
              </p>
            </div>

            {/* Amenities */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Room Amenities
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {room.amenities.map((amenity: string) => (
                  <div
                    key={amenity}
                    className="rounded-lg bg-white p-4 shadow-sm"
                  >
                    <span className="font-medium text-gray-800">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="h-fit rounded-xl bg-white p-8 shadow-sm">
            <p className="text-sm text-gray-500">
              Starting from
            </p>

            <div className="mt-2">
              <span className="text-3xl font-bold text-gray-900">
                KSh {room.price.toLocaleString()}
              </span>

              <span className="ml-1 text-gray-500">
                / night
              </span>
            </div>

            <div className="mt-6 space-y-4 border-t pt-6">
              <div className="flex justify-between">
                <span className="text-gray-500">
                  Capacity
                </span>

                <span className="font-medium text-gray-900">
                  {room.capacity} guests
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-500">
                  Availability
                </span>

                <span
                  className={
                    room.available
                      ? "font-medium text-green-600"
                      : "font-medium text-red-600"
                  }
                >
                  {room.available
                    ? "Available"
                    : "Unavailable"}
                </span>
              </div>
            </div>

            {room.available ? (
              <Link
                href={`/bookings?room=${room._id.toString()}`}
                className="mt-8 block rounded-md bg-gray-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-gray-700"
              >
                Book This Room
              </Link>
            ) : (
              <button
                disabled
                className="mt-8 w-full cursor-not-allowed rounded-md bg-gray-300 px-6 py-3 font-semibold text-gray-500"
              >
                Room Unavailable
              </button>
            )}

            <Link
              href="/rooms"
              className="mt-4 block text-center text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              ← Back to Rooms
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}