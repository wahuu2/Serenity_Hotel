import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/room.model";

export default async function RoomsPage() {
  await connectToDatabase();

  const rooms = await Room.find()
    .sort({ createdAt: -1 })
    .lean();

  const roomImages = [
    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1200&q=85",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=85",
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* =========================================================
          PAGE HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-24 text-white md:py-32">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=2000&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-gray-950/60" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
              Accommodation
            </p>

            <h1 className="mt-5 text-5xl font-semibold leading-tight md:text-7xl">
              Stay somewhere
              <br />
              that feels right.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-300">
              Discover comfortable rooms and spacious suites designed to give
              you the rest, privacy, and comfort you deserve.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          ROOMS INTRO
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              Choose Your Stay
            </p>

            <h2 className="mt-3 text-3xl font-semibold text-gray-900 md:text-4xl">
              Rooms made for comfort.
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Whether you are travelling alone, with family, or for business,
              find a space that suits your stay at Serenity Hotel.
            </p>
          </div>

          <Link
            href="/rooms"
            className="inline-flex w-fit border-b border-gray-900 pb-1 text-sm font-semibold text-gray-900 transition hover:border-amber-700 hover:text-amber-700"
          >
            Explore rooms →
          </Link>
        </div>
      </section>

      {/* =========================================================
          ROOMS GRID
      ========================================================= */}
      <section className="bg-[#f6f3ee] px-6 py-16 md:py-24">
        <div className="mx-auto max-w-7xl">
          {rooms.length === 0 ? (
            <div className="bg-white px-6 py-16 text-center shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-700">
                Accommodation
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-gray-900">
                No Rooms Available
              </h2>

              <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
                There are currently no rooms available. Please check again
                later or contact us for more information.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Contact Serenity
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rooms.map((room, index) => (
                <article
                  key={room._id.toString()}
                  className="group overflow-hidden bg-white"
                >
                  {/* =================================================
                      ROOM IMAGE
                  ================================================= */}
                  <Link href={`/rooms/${room._id.toString()}`}>
                    <div className="relative h-72 overflow-hidden bg-gray-200">
                      <img
                        src={roomImages[index % roomImages.length]}
                        alt={room.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/10" />

                      <div className="absolute left-5 top-5 bg-white px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-gray-900">
                        {room.type}
                      </div>

                      {!room.available && (
                        <div className="absolute right-5 top-5 bg-red-700 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-white">
                          Unavailable
                        </div>
                      )}
                    </div>
                  </Link>

                  {/* =================================================
                      ROOM CONTENT
                  ================================================= */}
                  <div className="p-7">
                    <div className="flex items-start justify-between gap-4">
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {room.name}
                      </h2>

                      <div className="shrink-0 text-right">
                        <p className="text-lg font-semibold text-gray-900">
                          KSh {room.price.toLocaleString()}
                        </p>

                        <p className="text-xs text-gray-500">
                          per night
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 line-clamp-3 leading-7 text-gray-600">
                      {room.description}
                    </p>

                    {/* Room Details */}
                    <div className="mt-6 flex items-center gap-5 border-y border-gray-200 py-4 text-sm text-gray-600">
                      <span>
                        <span className="font-semibold text-gray-900">
                          Guests:
                        </span>{" "}
                        {room.capacity}
                      </span>

                      <span className="h-4 w-px bg-gray-300" />

                      <span>Comfortable stay</span>
                    </div>

                    {/* =================================================
                        ACTIONS
                    ================================================= */}
                    <div className="mt-6 flex items-center justify-between gap-4">
                      <Link
                        href={`/rooms/${room._id.toString()}`}
                        className="text-sm font-semibold text-gray-900 transition hover:text-amber-700"
                      >
                        View Room →
                      </Link>

                      {room.available ? (
                        <Link
                          href={`/bookings?room=${room._id.toString()}`}
                          className="bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                        >
                          Book Now
                        </Link>
                      ) : (
                        <span className="cursor-not-allowed bg-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-500">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================
          WHY SERENITY
      ========================================================= */}
      <section className="px-6 py-24 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                More Than A Room
              </p>

              <h2 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-gray-900 md:text-5xl">
                Your stay should feel effortless.
              </h2>

              <p className="mt-6 max-w-xl leading-8 text-gray-600">
                From choosing your room to making your reservation, Serenity
                Hotel is designed to make your experience simple and
                comfortable.
              </p>

              <div className="mt-9 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Comfortable spaces
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Rooms designed for rest, privacy, and relaxation.
                  </p>
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Warm hospitality
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Thoughtful service from arrival to departure.
                  </p>
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Dining on site
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Enjoy delicious meals without leaving the hotel.
                  </p>
                </div>

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    Easy booking
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Find your room and make your reservation with ease.
                  </p>
                </div>
              </div>
            </div>

            <div
              className="min-h-[500px] bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=85')",
              }}
            />
          </div>
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

          <h2 className="mt-5 text-4xl font-semibold md:text-5xl">
            Find your place at Serenity.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-300">
            Choose your room, make your reservation, and prepare for a
            comfortable stay.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/rooms"
              className="bg-white px-7 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100"
            >
              Explore Rooms
            </Link>

            <Link
              href="/contact"
              className="border border-white/70 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-900"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}