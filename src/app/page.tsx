import Link from "next/link";

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[80vh] bg-gray-900">
        <div className="mx-auto flex min-h-[80vh] max-w-7xl items-center px-6 py-20">
          <div className="max-w-2xl text-white">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
              Welcome to Serenity Hotel
            </p>

            <h1 className="text-5xl font-bold leading-tight md:text-7xl">
              Your comfort is our priority.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Experience a relaxing stay with comfortable rooms, exceptional
              hospitality, delicious dining, and quality services.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/rooms"
                className="rounded-md bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-200"
              >
                Explore Rooms
              </Link>

              <Link
                href="/bookings"
                className="rounded-md border border-white px-6 py-3 font-semibold text-white transition hover:bg-white hover:text-gray-900"
              >
                Book Your Stay
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            About Serenity
          </p>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            A comfortable stay, thoughtfully designed.
          </h2>

          <p className="mt-5 leading-7 text-gray-600">
            Serenity Hotel provides a welcoming environment for business
            travelers, families, couples, and guests looking for a peaceful
            place to stay. From comfortable accommodation to dining and hotel
            services, everything is designed with our guests in mind.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-100">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 py-20 md:grid-cols-3">
          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">
              Comfortable Rooms
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Choose from carefully designed rooms equipped for a comfortable
              and relaxing stay.
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">
              Restaurant & Dining
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Enjoy a variety of meals and refreshments from our hotel
              restaurant.
            </p>
          </div>

          <div className="rounded-lg bg-white p-8 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900">
              Quality Services
            </h3>
            <p className="mt-3 leading-7 text-gray-600">
              Access convenient hotel services designed to make your stay
              easier and more enjoyable.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gray-900 px-6 py-20 text-center text-white">
        <h2 className="text-3xl font-bold md:text-4xl">
          Ready to experience Serenity?
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-300">
          Find your perfect room and make your reservation today.
        </p>

        <Link
          href="/rooms"
          className="mt-8 inline-block rounded-md bg-white px-6 py-3 font-semibold text-gray-900 transition hover:bg-gray-200"
        >
          View Available Rooms
        </Link>
      </section>
    </main>
  );
}