import Link from "next/link";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/room.model";

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

  const roomImage =
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1800&q=90";

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* =========================================================
          ROOM HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-gray-950">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${roomImage}')`,
          }}
        />

        <div className="absolute inset-0 bg-black/60" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-6 pb-16 pt-32 md:min-h-[600px] md:pb-20">
          <div className="max-w-4xl text-white">
            <Link
              href="/rooms"
              className="mb-8 inline-flex text-sm font-medium text-white/80 transition hover:text-white"
            >
              ← Back to Rooms
            </Link>

            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              {room.type}
            </p>

            <h1 className="mt-4 text-5xl font-semibold leading-tight md:text-7xl">
              {room.name}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
              A comfortable and thoughtfully designed space for a peaceful
              stay at Serenity Hotel.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          ROOM CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-24">
        <div className="grid gap-14 lg:grid-cols-[1fr_380px]">
          {/* =====================================================
              MAIN ROOM INFORMATION
          ===================================================== */}
          <div>
            {/* Room Image */}
            <div className="overflow-hidden bg-gray-100">
              <img
                src={roomImage}
                alt={room.name}
                className="h-[420px] w-full object-cover md:h-[560px]"
              />
            </div>

            {/* Room Introduction */}
            <div className="mt-12">
              <div className="flex flex-col justify-between gap-5 border-b border-gray-200 pb-7 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                    Your Stay
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold text-gray-900 md:text-4xl">
                    {room.name}
                  </h2>
                </div>

                <div className="sm:text-right">
                  <p className="text-2xl font-semibold text-gray-900">
                    KSh {room.price.toLocaleString()}
                  </p>

                  <p className="text-sm text-gray-500">per night</p>
                </div>
              </div>

              <p className="mt-7 max-w-3xl text-base leading-8 text-gray-600">
                {room.description}
              </p>
            </div>

            {/* Room Details */}
            <div className="mt-12 border-y border-gray-200 py-8">
              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Room Type
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    {room.type}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Guest Capacity
                  </p>

                  <p className="mt-2 font-semibold text-gray-900">
                    Up to {room.capacity} guests
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Availability
                  </p>

                  <p
                    className={
                      room.available
                        ? "mt-2 font-semibold text-green-700"
                        : "mt-2 font-semibold text-red-600"
                    }
                  >
                    {room.available ? "Available" : "Currently Unavailable"}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                AMENITIES
            ================================================= */}
            <div className="mt-14">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                Comfort & Convenience
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                Room amenities
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-gray-600">
                Everything you need for a comfortable and relaxing stay.
              </p>

              <div className="mt-8 grid gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:grid-cols-2">
                {room.amenities.map((amenity: string) => (
                  <div
                    key={amenity}
                    className="bg-white p-5 transition hover:bg-[#f6f3ee]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-8 w-8 items-center justify-center border border-gray-300 text-sm text-gray-700">
                        ✓
                      </span>

                      <span className="font-medium text-gray-900">
                        {amenity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                HOTEL EXPERIENCE
            ================================================= */}
            <div className="mt-16 bg-[#f6f3ee] p-8 md:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                The Serenity Experience
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                More than a room.
              </h2>

              <p className="mt-5 leading-8 text-gray-600">
                Your stay at Serenity Hotel comes with more than comfortable
                accommodation. Enjoy access to our restaurant, thoughtful hotel
                services, and warm Kenyan hospitality throughout your visit.
              </p>

              <div className="mt-7 flex flex-col gap-4 sm:flex-row">
                <Link
                  href="/restaurant"
                  className="inline-flex w-fit border border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
                >
                  Explore Our Restaurant
                </Link>

                <Link
                  href="/services"
                  className="inline-flex w-fit border-b border-gray-900 px-1 py-3 text-sm font-semibold text-gray-900 transition hover:border-amber-700 hover:text-amber-700"
                >
                  View Hotel Services →
                </Link>
              </div>
            </div>
          </div>

          {/* =====================================================
              BOOKING CARD
          ===================================================== */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="border border-gray-200 bg-white p-7 shadow-sm md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                Reserve Your Stay
              </p>

              <h2 className="mt-4 text-2xl font-semibold text-gray-900">
                {room.name}
              </h2>

              <div className="mt-6 border-y border-gray-200 py-6">
                <p className="text-sm text-gray-500">
                  Starting from
                </p>

                <div className="mt-2">
                  <span className="text-3xl font-semibold text-gray-900">
                    KSh {room.price.toLocaleString()}
                  </span>

                  <span className="ml-1 text-sm text-gray-500">
                    / night
                  </span>
                </div>
              </div>

              {/* Booking Details */}
              <div className="space-y-5 py-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Capacity
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {room.capacity} guests
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Room type
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    {room.type}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-500">
                    Status
                  </span>

                  <span
                    className={
                      room.available
                        ? "text-sm font-semibold text-green-700"
                        : "text-sm font-semibold text-red-600"
                    }
                  >
                    {room.available ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              {/* Booking Action */}
              {room.available ? (
                <Link
                  href={`/bookings?room=${room._id.toString()}`}
                  className="block bg-gray-900 px-6 py-4 text-center text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-gray-800"
                >
                  Book This Room
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed bg-gray-200 px-6 py-4 text-sm font-semibold uppercase tracking-wider text-gray-500"
                >
                  Room Unavailable
                </button>
              )}

              <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                Select your dates and complete your reservation on the booking
                page.
              </p>
            </div>

            {/* Restaurant Reminder */}
            <div className="mt-5 border border-gray-200 bg-[#f6f3ee] p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Dining at Serenity
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Make your stay even better with delicious meals and
                refreshments from our hotel restaurant.
              </p>

              <Link
                href="/restaurant"
                className="mt-4 inline-flex text-sm font-semibold text-gray-900 transition hover:text-amber-700"
              >
                Explore the restaurant →
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="bg-gray-950 px-6 py-24 text-center text-white md:py-28">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Your Stay Starts Here
          </p>

          <h2 className="mt-5 text-4xl font-semibold leading-tight md:text-5xl">
            Ready to experience Serenity?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-300">
            Reserve your room and enjoy comfortable accommodation, dining,
            thoughtful service, and warm Kenyan hospitality.
          </p>

          <Link
            href={
              room.available
                ? `/bookings?room=${room._id.toString()}`
                : "/rooms"
            }
            className="mt-8 inline-flex bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
          >
            {room.available ? "Book This Room" : "Explore Other Rooms"}
          </Link>
        </div>
      </section>
    </main>
  );
}