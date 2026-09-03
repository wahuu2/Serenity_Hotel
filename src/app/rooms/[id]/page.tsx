import Link from "next/link";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    type: "Deluxe",
    price: 8500,
    description:
      "A comfortable room with a spacious interior, modern furnishings, and everything you need for a relaxing stay.",
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "Smart TV",
      "Private Bathroom",
      "Room Service",
      "Breakfast Included",
    ],
  },
  {
    id: 2,
    name: "Executive Suite",
    type: "Suite",
    price: 12000,
    description:
      "Enjoy extra space and premium comfort in our elegant executive suite, designed for business and leisure travelers.",
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "Smart TV",
      "Private Bathroom",
      "Mini Bar",
      "Breakfast Included",
    ],
  },
  {
    id: 3,
    name: "Family Room",
    type: "Family",
    price: 15000,
    description:
      "A spacious family-friendly room offering comfortable accommodation for families traveling together.",
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "Smart TV",
      "Private Bathroom",
      "Extra Beds",
      "Breakfast Included",
    ],
  },
];

type RoomDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function RoomDetailsPage({
  params,
}: RoomDetailsPageProps) {
  const { id } = await params;

  const room = rooms.find((room) => room.id === Number(id));

  if (!room) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Room Not Found
          </h1>

          <p className="mt-3 text-gray-600">
            The room you are looking for does not exist.
          </p>

          <Link
            href="/rooms"
            className="mt-6 inline-block rounded-md bg-gray-900 px-6 py-3 font-semibold text-white"
          >
            Back to Rooms
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Room Image */}
      <section className="bg-gray-200">
        <div className="mx-auto flex h-[400px] max-w-7xl items-center justify-center">
          <span className="text-gray-500">Room Image</span>
        </div>
      </section>

      {/* Room Details */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Main Information */}
          <div className="lg:col-span-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              {room.type}
            </p>

            <h1 className="mt-2 text-4xl font-bold text-gray-900 md:text-5xl">
              {room.name}
            </h1>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              {room.description}
            </p>

            {/* Amenities */}
            <div className="mt-10">
              <h2 className="text-2xl font-bold text-gray-900">
                Room Amenities
              </h2>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {room.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="rounded-lg border bg-white p-4 text-gray-700"
                  >
                    ✓ {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="h-fit rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">Starting from</p>

            <p className="mt-1 text-3xl font-bold text-gray-900">
              KSh {room.price.toLocaleString()}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              per night
            </p>

            <div className="my-6 border-t" />

            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check-in
                </label>

                <input
                  type="date"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check-out
                </label>

                <input
                  type="date"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <Link
                href={`/bookings?room=${room.id}`}
                className="block w-full rounded-md bg-gray-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-gray-700"
              >
                Book This Room
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}