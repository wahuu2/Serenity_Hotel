const services = [
  {
    id: 1,
    name: "Room Service",
    description:
      "Enjoy delicious meals, drinks, and refreshments delivered directly to your room.",
  },
  {
    id: 2,
    name: "Housekeeping",
    description:
      "Our housekeeping team keeps your room clean, comfortable, and ready throughout your stay.",
  },
  {
    id: 3,
    name: "Laundry Service",
    description:
      "Professional laundry and ironing services are available to make your stay more convenient.",
  },
  {
    id: 4,
    name: "Airport Transfers",
    description:
      "Travel comfortably with our convenient airport pickup and drop-off services.",
  },
  {
    id: 5,
    name: "Conference & Events",
    description:
      "Host meetings, conferences, celebrations, and private events in our flexible event spaces.",
  },
  {
    id: 6,
    name: "24/7 Front Desk",
    description:
      "Our front desk team is available around the clock to assist you with your needs.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-900 px-6 py-20 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
          Our Services
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Services Designed for Your Comfort
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-300">
          At Serenity Hotel, we provide convenient and reliable services
          designed to make your stay comfortable and enjoyable.
        </p>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div
              key={service.id}
              className="rounded-xl bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                {service.id}
              </div>

              <h2 className="mt-6 text-xl font-bold text-gray-900">
                {service.name}
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white px-6 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Ready to Experience Serenity?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          Book your room today and enjoy comfortable accommodation,
          delicious dining, and quality hotel services.
        </p>

        <a
          href="/rooms"
          className="mt-8 inline-block rounded-md bg-gray-900 px-8 py-3 font-semibold text-white transition hover:bg-gray-700"
        >
          Explore Our Rooms
        </a>
      </section>
    </main>
  );
}