import Link from "next/link";

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-white text-gray-900">
      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative min-h-[680px] overflow-hidden sm:min-h-[720px] lg:min-h-[760px]">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=2000&q=85')",
          }}
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Hero Content */}
        <div className="relative mx-auto flex min-h-[680px] max-w-7xl items-center px-4 pb-36 pt-28 sm:min-h-[720px] sm:px-6 sm:pb-40 sm:pt-32 lg:min-h-[760px] lg:px-8 lg:pb-44">
          <div className="max-w-3xl text-white">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white/80 sm:mb-5 sm:text-sm sm:tracking-[0.35em]">
              Welcome to Serenity Hotel
            </p>

            <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              A place to stay.
              <br />
              A place to belong.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:mt-7 sm:text-lg sm:leading-8 md:text-xl">
              Discover a peaceful stay where warm Kenyan hospitality,
              comfortable accommodation, memorable dining, and thoughtful
              service come together.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row sm:gap-4">
              <Link
                href="/rooms"
                className="inline-flex min-h-12 items-center justify-center rounded-sm bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 sm:px-7"
              >
                Explore Our Rooms
              </Link>

              <Link
                href="/bookings"
                className="inline-flex min-h-12 items-center justify-center rounded-sm border border-white/80 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white hover:text-gray-900 sm:px-7"
              >
                Book Your Stay
              </Link>
            </div>
          </div>
        </div>

    </section>

      {/* =========================================================
          INTRODUCTION
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-32">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 sm:text-sm sm:tracking-[0.25em]">
              The Serenity Experience
            </p>

            <h2 className="mt-3 max-w-xl text-3xl font-semibold leading-tight text-gray-900 sm:mt-4 sm:text-4xl md:text-5xl">
              Hospitality that feels personal.
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:mt-6 sm:text-base sm:leading-8">
              At Serenity Hotel, we believe a memorable stay is about more
              than a room. It is about the welcome you receive, the food you
              enjoy, the comfort you experience, and the little details that
              make you feel at home.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
              Whether you are travelling for business, enjoying a family
              getaway, or simply taking time to rest, Serenity offers a calm
              and welcoming space designed around you.
            </p>

            <Link
              href="/services"
              className="mt-6 inline-flex min-h-10 items-center border-b border-gray-900 pb-1 text-sm font-semibold text-gray-900 transition hover:border-amber-700 hover:text-amber-700 sm:mt-7"
            >
              Discover Serenity
              <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div
              className="h-56 bg-cover bg-center sm:h-72"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=85')",
              }}
            />

            <div
              className="mt-7 h-56 bg-cover bg-center sm:mt-10 sm:h-72"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=85')",
              }}
            />
          </div>
        </div>
      </section>

      {/* =========================================================
          ROOMS
      ========================================================= */}
      <section className="bg-[#f6f3ee] px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 sm:text-sm sm:tracking-[0.25em]">
                Stay With Us
              </p>

              <h2 className="mt-2 text-3xl font-semibold text-gray-900 sm:mt-3 sm:text-4xl md:text-5xl">
                Rooms designed for rest.
              </h2>
            </div>

            <Link
              href="/rooms"
              className="inline-flex min-h-10 items-center text-sm font-semibold text-gray-900 transition hover:text-amber-700"
            >
              View all rooms →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:mt-10 sm:gap-7 md:grid-cols-3">
            {/* Room 1 */}
            <Link
              href="/rooms"
              className="group overflow-hidden bg-white"
            >
              <div className="relative h-60 overflow-hidden sm:h-72">
                <img
                  src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85"
                  alt="Serenity Hotel Deluxe Room"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 sm:text-xs">
                  Accommodation
                </p>

                <h3 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">
                  Deluxe Room
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  A comfortable retreat designed for peaceful nights and
                  relaxing mornings.
                </p>

                <p className="mt-5 text-sm font-semibold text-gray-900">
                  From KES 8,500 / night
                </p>
              </div>
            </Link>

            {/* Room 2 */}
            <Link
              href="/rooms"
              className="group overflow-hidden bg-white"
            >
              <div className="relative h-60 overflow-hidden sm:h-72">
                <img
                  src="https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=1000&q=85"
                  alt="Serenity Hotel Executive Suite"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 sm:text-xs">
                  Accommodation
                </p>

                <h3 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">
                  Executive Suite
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Spacious accommodation with an elevated level of comfort and
                  privacy.
                </p>

                <p className="mt-5 text-sm font-semibold text-gray-900">
                  From KES 12,000 / night
                </p>
              </div>
            </Link>

            {/* Room 3 */}
            <Link
              href="/rooms"
              className="group overflow-hidden bg-white"
            >
              <div className="relative h-60 overflow-hidden sm:h-72">
                <img
                  src="https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=85"
                  alt="Serenity Hotel Family Room"
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
              </div>

              <div className="p-5 sm:p-6">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-700 sm:text-xs">
                  Accommodation
                </p>

                <h3 className="mt-2 text-xl font-semibold text-gray-900 sm:text-2xl">
                  Family Room
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Generous space for families looking for comfort, convenience,
                  and quality time together.
                </p>

                <p className="mt-5 text-sm font-semibold text-gray-900">
                  From KES 15,000 / night
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          RESTAURANT
      ========================================================= */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid overflow-hidden bg-gray-900 lg:grid-cols-2">
            <div
              className="min-h-[280px] bg-cover bg-center sm:min-h-[360px] lg:min-h-[500px]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=85')",
              }}
            />

            <div className="flex items-center px-6 py-12 text-white sm:px-10 sm:py-14 md:px-14">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400 sm:text-sm sm:tracking-[0.25em]">
                  Dining at Serenity
                </p>

                <h2 className="mt-3 text-3xl font-semibold leading-tight sm:mt-4 sm:text-4xl md:text-5xl">
                  Good food. Good moments.
                </h2>

                <p className="mt-5 text-sm leading-7 text-gray-300 sm:mt-6 sm:text-base sm:leading-8">
                  Enjoy delicious meals, refreshing drinks, and a welcoming
                  atmosphere at our restaurant. Whether you are joining us for
                  breakfast, lunch, dinner, or a relaxed evening, there is
                  always something worth enjoying.
                </p>

                <Link
                  href="/restaurant"
                  className="mt-7 inline-flex min-h-11 items-center justify-center border border-white px-5 py-3 text-sm font-semibold transition hover:bg-white hover:text-gray-900 sm:mt-8 sm:px-6"
                >
                  Explore Our Restaurant
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          SERVICES
      ========================================================= */}
      <section className="border-y border-gray-200 px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 sm:text-sm sm:tracking-[0.25em]">
              At Your Service
            </p>

            <h2 className="mt-2 text-3xl font-semibold text-gray-900 sm:mt-3 sm:text-4xl md:text-5xl">
              Everything you need for a comfortable stay.
            </h2>
          </div>

          <div className="mt-10 grid gap-px overflow-hidden border border-gray-200 bg-gray-200 sm:mt-12 md:grid-cols-3">
            <div className="bg-white p-6 sm:p-8">
              <span className="text-xl text-gray-900 sm:text-2xl">
                01
              </span>

              <h3 className="mt-6 text-lg font-semibold sm:mt-8 sm:text-xl">
                Comfortable Accommodation
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                Thoughtfully designed spaces where you can relax, recharge,
                and feel at home.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8">
              <span className="text-xl text-gray-900 sm:text-2xl">
                02
              </span>

              <h3 className="mt-6 text-lg font-semibold sm:mt-8 sm:text-xl">
                Restaurant & Dining
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                Enjoy satisfying meals and refreshments throughout your stay.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8">
              <span className="text-xl text-gray-900 sm:text-2xl">
                03
              </span>

              <h3 className="mt-6 text-lg font-semibold sm:mt-8 sm:text-xl">
                Thoughtful Service
              </h3>

              <p className="mt-3 text-sm leading-7 text-gray-600 sm:text-base">
                From arrival to departure, our services are designed around
                your comfort.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          EXPERIENCE / KENYAN IDENTITY
      ========================================================= */}
      <section className="bg-[#f6f3ee] px-4 py-16 sm:px-6 sm:py-20 md:py-24 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div
              className="min-h-[320px] bg-cover bg-center sm:min-h-[420px] lg:min-h-[500px]"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=85')",
              }}
            />

            <div className="lg:px-10">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-700 sm:text-sm sm:tracking-[0.25em]">
                Feel At Home
              </p>

              <h2 className="mt-3 text-3xl font-semibold leading-tight text-gray-900 sm:mt-4 sm:text-4xl md:text-5xl">
                Warm hospitality, with a distinctly Kenyan spirit.
              </h2>

              <p className="mt-5 text-sm leading-7 text-gray-600 sm:mt-6 sm:text-base sm:leading-8">
                Serenity brings together contemporary comfort and the warmth
                of Kenyan hospitality. From the way we welcome our guests to
                the food we serve, every experience is designed to feel
                genuine, relaxed, and memorable.
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base sm:leading-8">
                Come for the stay. Stay for the experience.
              </p>

              <Link
                href="/contact"
                className="mt-7 inline-flex min-h-11 items-center justify-center bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-800 sm:mt-8 sm:px-7"
              >
                Plan Your Visit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden bg-gray-950 px-4 py-16 text-center text-white sm:px-6 sm:py-20 md:py-28 lg:px-8 lg:py-32">
        <div className="relative mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400 sm:text-sm sm:tracking-[0.3em]">
            Your Serenity Awaits
          </p>

          <h2 className="mt-4 text-3xl font-semibold leading-tight sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl">
            Make your next stay something to remember.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-300 sm:mt-6 sm:text-base sm:leading-8">
            Explore our rooms, discover our dining experience, and find
            everything you need for a comfortable stay.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:mt-9 sm:flex-row sm:gap-4">
            <Link
              href="/rooms"
              className="inline-flex min-h-12 items-center justify-center bg-white px-6 py-3.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-100 sm:px-7"
            >
              Explore Rooms
            </Link>

            <Link
              href="/restaurant"
              className="inline-flex min-h-12 items-center justify-center border border-white/70 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-900 sm:px-7"
            >
              Visit Restaurant
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}