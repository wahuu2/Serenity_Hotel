const services = [
  {
    id: 1,
    name: "Room Service",
    description:
      "Enjoy delicious meals, drinks, and refreshments delivered directly to your room whenever you need them.",
  },
  {
    id: 2,
    name: "Housekeeping",
    description:
      "Our housekeeping team keeps your room clean, comfortable, and welcoming throughout your stay.",
  },
  {
    id: 3,
    name: "Laundry Service",
    description:
      "Professional laundry and ironing services are available to make longer stays easier and more convenient.",
  },
  {
    id: 4,
    name: "Airport Transfers",
    description:
      "Travel comfortably with convenient airport pickup and drop-off services arranged around your schedule.",
  },
  {
    id: 5,
    name: "Conference & Events",
    description:
      "Host meetings, conferences, celebrations, and private events in flexible spaces designed for memorable occasions.",
  },
  {
    id: 6,
    name: "24/7 Front Desk",
    description:
      "Our front desk team is available around the clock to assist with requests, directions, recommendations, and more.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-24 text-white md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Hotel Services
          </p>

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Thoughtful service,
            <span className="block text-amber-400">from arrival to departure.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            At Serenity Hotel, every detail is designed to make your stay
            comfortable, convenient, and genuinely relaxing.
          </p>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-[1fr_1.4fr] md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              Stay with ease
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
              More than a room.
              <span className="block">A complete hotel experience.</span>
            </h2>
          </div>

          <p className="max-w-2xl text-base leading-8 text-gray-600">
            Whether you are travelling for business, enjoying a weekend away,
            attending an event, or simply taking time to rest, our services are
            here to make your experience smoother from the moment you arrive.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto max-w-6xl px-6 pb-20 md:pb-28">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.id}
              className="group rounded-3xl border border-black/5 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl md:p-8"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-950 text-sm font-semibold text-white transition group-hover:bg-amber-700">
                  {String(service.id).padStart(2, "0")}
                </div>

                <span className="text-xs font-medium uppercase tracking-[0.2em] text-gray-400">
                  Serenity
                </span>
              </div>

              <h2 className="mt-8 text-xl font-semibold text-gray-950">
                {service.name}
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {service.description}
              </p>

              <div className="mt-7 h-px w-12 bg-amber-600 transition-all duration-300 group-hover:w-20" />
            </article>
          ))}
        </div>
      </section>

      {/* Hospitality Experience */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div className="overflow-hidden rounded-[2rem] bg-gray-900">
              <div className="flex min-h-[380px] items-end bg-[linear-gradient(to_top,rgba(0,0,0,0.75),rgba(0,0,0,0.05)),url('https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center p-8 md:min-h-[480px] md:p-10">
                <div className="max-w-md text-white">
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
                    Kenyan Hospitality
                  </p>

                  <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
                    Warm service, thoughtful details.
                  </h2>

                  <p className="mt-4 leading-7 text-gray-200">
                    From a warm welcome at the front desk to a comfortable
                    evening in your room, we believe hospitality should feel
                    personal.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                Your comfort matters
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
                Everything you need,
                <span className="block">close at hand.</span>
              </h2>

              <p className="mt-6 leading-8 text-gray-600">
                Serenity Hotel combines practical hotel services with the warmth
                of genuine Kenyan hospitality. Our goal is simple: give you
                fewer things to worry about and more time to enjoy your stay.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-6 border-y border-gray-200 py-7">
                <div>
                  <p className="text-2xl font-semibold text-gray-950">24/7</p>
                  <p className="mt-1 text-sm text-gray-500">Front desk support</p>
                </div>

                <div>
                  <p className="text-2xl font-semibold text-gray-950">6+</p>
                  <p className="mt-1 text-sm text-gray-500">Guest services</p>
                </div>
              </div>

              <a
                href="/contact"
                className="mt-8 inline-flex items-center rounded-full bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                Contact the Hotel
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Dining Highlight */}
      <section className="bg-[#f6f3ee]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="rounded-[2rem] bg-gray-950 px-7 py-12 text-center text-white md:px-12 md:py-16">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
              Stay • Dine • Relax
            </p>

            <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-semibold md:text-4xl">
              Make your stay a little more memorable.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-300">
              Discover comfortable rooms, enjoy a meal at our restaurant, and
              let our team take care of the details.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <a
                href="/rooms"
                className="rounded-full bg-amber-700 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-600"
              >
                Explore Rooms
              </a>

              <a
                href="/restaurant"
                className="rounded-full border border-white/20 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-950"
              >
                Visit Our Restaurant
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 text-center md:py-24">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
          Your stay starts here
        </p>

        <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-gray-950 md:text-4xl">
          Ready to experience Serenity?
        </h2>

        <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
          Book your stay and enjoy comfortable accommodation, thoughtful
          services, and warm hospitality.
        </p>

        <a
          href="/rooms"
          className="mt-8 inline-flex rounded-full bg-gray-950 px-8 py-4 text-sm font-semibold text-white transition hover:bg-amber-700"
        >
          Book Your Stay
        </a>
      </section>
    </main>
  );
}