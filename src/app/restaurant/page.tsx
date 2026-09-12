import Link from "next/link";
import { connectToDatabase } from "@/lib/mongodb";
import MenuItem from "@/models/menuItem.model";

export default async function RestaurantPage() {
  await connectToDatabase();

  const menuItems = await MenuItem.find({
    available: true,
  })
    .sort({
      category: 1,
      createdAt: -1,
    })
    .lean();

  const categories = Array.from(
    new Set(menuItems.map((item) => item.category))
  );

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-gray-900">
      {/* HERO */}
      <section className="relative min-h-[520px] overflow-hidden bg-gray-950">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=2000&q=85')",
          }}
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-6 py-20">
          <div className="max-w-3xl text-white">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">
              Serenity Dining
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl md:text-6xl">
              A taste of comfort,
              <br />
              served with warmth.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              Discover thoughtfully prepared dishes, refreshing drinks, and
              warm Kenyan hospitality at Serenity Hotel.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#menu"
                className="rounded-full bg-amber-700 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                Explore Our Menu
              </Link>

              <Link
                href="/restaurant/order"
                className="rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-center text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Order from Restaurant
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRODUCTION */}
      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-24">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              The Serenity Table
            </p>

            <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
              Dining made for slow moments and good company.
            </h2>
          </div>

          <div>
            <p className="text-base leading-8 text-gray-600">
              At Serenity, dining is part of the stay. Our restaurant brings
              together comforting favourites, carefully prepared meals, and
              refreshing drinks in an atmosphere designed for relaxed
              conversations and memorable moments.
            </p>

            <p className="mt-5 text-base leading-8 text-gray-600">
              Whether you are joining us after a long day, enjoying a meal with
              family, or simply stopping by for something delicious, our menu
              has something for every guest.
            </p>
          </div>
        </div>
      </section>

      {/* MENU */}
      <section id="menu" className="bg-white px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                From Our Kitchen
              </p>

              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Explore the menu
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-gray-600">
                Freshly prepared choices for breakfast, lunch, dinner, and
                everything in between.
              </p>
            </div>

            <Link
              href="/restaurant/order"
              className="w-fit rounded-full border border-gray-900 px-6 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-900 hover:text-white"
            >
              View Order Page
            </Link>
          </div>

          {menuItems.length === 0 ? (
            <div className="rounded-2xl border border-gray-200 bg-[#f6f3ee] px-6 py-16 text-center">
              <div className="mx-auto max-w-md">
                <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                  Serenity Dining
                </p>

                <h3 className="mt-3 text-2xl font-semibold text-gray-900">
                  Our menu is being refreshed
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  Our restaurant menu is currently being updated. Please check
                  back shortly.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-16">
              {categories.map((category) => {
                const categoryItems = menuItems.filter(
                  (item) => item.category === category
                );

                return (
                  <div key={category}>
                    <div className="mb-7 flex items-center gap-4">
                      <h3 className="text-2xl font-semibold capitalize">
                        {category}
                      </h3>

                      <div className="h-px flex-1 bg-gray-200" />
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {categoryItems.map((item) => (
                        <article
                          key={item._id.toString()}
                          className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                          {/* IMAGE */}
                          <div className="relative h-60 overflow-hidden bg-gray-100">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center bg-[#e9e2d7]">
                                <div className="text-center">
                                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
                                    Serenity Dining
                                  </p>

                                  <p className="mt-2 text-sm text-gray-600">
                                    Food Image
                                  </p>
                                </div>
                              </div>
                            )}

                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-5">
                              <span className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-gray-800">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          {/* CONTENT */}
                          <div className="p-6">
                            <div className="flex items-start justify-between gap-5">
                              <h4 className="text-xl font-semibold leading-snug text-gray-900">
                                {item.name}
                              </h4>

                              <span className="shrink-0 text-sm font-bold text-amber-800">
                                KSh {item.price.toLocaleString()}
                              </span>
                            </div>

                            <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-600">
                              {item.description}
                            </p>

                            <Link
                              href={`/restaurant/order?item=${item._id.toString()}`}
                              className="mt-6 flex items-center justify-center rounded-full bg-gray-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
                            >
                              Order Now
                            </Link>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* DINING EXPERIENCE */}
      <section className="bg-[#eee8df] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div
              className="min-h-[380px] rounded-3xl bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=85')",
              }}
            />

            <div className="lg:px-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                More Than A Meal
              </p>

              <h2 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl">
                Good food belongs to every good stay.
              </h2>

              <p className="mt-6 leading-8 text-gray-600">
                From a relaxed morning breakfast to an evening meal after a
                busy day, Serenity Dining is designed to make your stay feel
                complete.
              </p>

              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900">
                    Comfortable Dining
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    A relaxed setting for guests, families, and visitors.
                  </p>
                </div>

                <div className="rounded-2xl bg-white p-5">
                  <p className="text-sm font-semibold text-gray-900">
                    Local Hospitality
                  </p>

                  <p className="mt-2 text-sm leading-6 text-gray-600">
                    Warm service inspired by the Kenyan spirit of hospitality.
                  </p>
                </div>
              </div>

              <Link
                href="/restaurant/order"
                className="mt-8 inline-flex rounded-full bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                Place Your Order
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-gray-950 px-6 py-20 text-center text-white sm:py-24">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            Serenity Hotel
          </p>

          <h2 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Your table is waiting.
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-white/70">
            Enjoy a delicious meal, order from the comfort of your room, or
            discover something new from our kitchen.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/restaurant/order"
              className="rounded-full bg-amber-700 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-800"
            >
              Order Now
            </Link>

            <Link
              href="/rooms"
              className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-950"
            >
              Explore Our Rooms
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}