import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/room.model";

export default async function RoomsPage() {
  await connectToDatabase();

  const rooms = await Room.find()
    .sort({ createdAt: -1 })
    .lean();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-900 px-6 py-20 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
          Accommodation
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Our Rooms
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-300">
          Choose from our comfortable rooms and suites designed to
          provide a relaxing and enjoyable stay.
        </p>
      </section>

      {/* Rooms */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        {rooms.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              No Rooms Available
            </h2>

            <p className="mt-3 text-gray-600">
              There are currently no rooms available.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room._id.toString()}
                className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                {/* Image */}
                <div className="flex h-56 items-center justify-center bg-gray-200 text-gray-500">
                  Room Image
                </div>

                {/* Content */}
                <div className="p-6">
                  <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {room.type}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-gray-900">
                    {room.name}
                  </h2>

                  <p className="mt-3 leading-7 text-gray-600">
                    {room.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-bold text-gray-900">
                        KSh {room.price.toLocaleString()}
                      </span>

                      <span className="ml-1 text-sm text-gray-500">
                        / night
                      </span>
                    </div>

                    <span className="text-sm text-gray-500">
                      Up to {room.capacity} guests
                    </span>
                  </div>

                  <Link
                    href={`/rooms/${room._id.toString()}`}
                    className="mt-6 block rounded-md bg-gray-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-gray-700"
                  >
                    View Room
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="bg-white px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Find Your Perfect Room
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Book your stay at Serenity Hotel and enjoy comfort,
          convenience, and exceptional hospitality.
        </p>

        <Link
          href="/contact"
          className="mt-8 inline-block rounded-md bg-gray-900 px-8 py-3 font-semibold text-white transition hover:bg-gray-700"
        >
          Contact Us
        </Link>
      </section>
    </main>
  );
}