import Link from "next/link";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    type: "Deluxe",
    price: 8500,
    description:
      "A comfortable room with a spacious interior, modern furnishings, and everything you need for a relaxing stay.",
  },
  {
    id: 2,
    name: "Executive Suite",
    type: "Suite",
    price: 12000,
    description:
      "Enjoy extra space and premium comfort in our elegant executive suite, designed for business and leisure travelers.",
  },
  {
    id: 3,
    name: "Family Room",
    type: "Family",
    price: 15000,
    description:
      "A spacious family-friendly room offering comfortable accommodation for families traveling together.",
  },
];

export default function RoomsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gray-900 px-6 py-20 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
          Accommodation
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Our Rooms
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-300">
          Discover comfortable rooms designed to give you a peaceful and
          memorable stay at Serenity Hotel.
        </p>
      </section>

      {/* Rooms */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Image Placeholder */}
              <div className="flex h-56 items-center justify-center bg-gray-200">
                <span className="text-sm text-gray-500">
                  Room Image
                </span>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {room.type}
                    </p>

                    <h2 className="mt-1 text-2xl font-bold text-gray-900">
                      {room.name}
                    </h2>
                  </div>

                  <p className="font-bold text-gray-900">
                    KSh {room.price.toLocaleString()}
                  </p>
                </div>

                <p className="mt-4 leading-7 text-gray-600">
                  {room.description}
                </p>

                <Link
                  href={`/rooms/${room.id}`}
                  className="mt-6 inline-block rounded-md bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
                >
                  View Room
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}