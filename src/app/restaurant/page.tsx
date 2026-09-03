import Link from "next/link";

const menuItems = [
  {
    id: 1,
    name: "Beef Burger",
    category: "Main Course",
    price: 950,
    description:
      "Juicy beef patty served with fresh vegetables, cheese, and crispy fries.",
  },
  {
    id: 2,
    name: "Grilled Chicken",
    category: "Main Course",
    price: 1400,
    description:
      "Tender grilled chicken served with seasonal vegetables and a side of potatoes.",
  },
  {
    id: 3,
    name: "Chicken Biryani",
    category: "Main Course",
    price: 1200,
    description:
      "Fragrant basmati rice cooked with tender chicken and aromatic spices.",
  },
  {
    id: 4,
    name: "Vegetable Pasta",
    category: "Main Course",
    price: 1000,
    description:
      "Fresh pasta tossed with seasonal vegetables in a creamy sauce.",
  },
  {
    id: 5,
    name: "Fresh Fruit Juice",
    category: "Drinks",
    price: 350,
    description:
      "Freshly prepared seasonal fruit juice served chilled.",
  },
  {
    id: 6,
    name: "Chocolate Cake",
    category: "Dessert",
    price: 500,
    description:
      "Rich and moist chocolate cake served with a smooth chocolate topping.",
  },
];

export default function RestaurantPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-900 px-6 py-20 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
          Serenity Dining
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          Restaurant & Dining
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-300">
          Enjoy delicious meals, refreshing drinks, and carefully prepared
          dishes from the comfort of Serenity Hotel.
        </p>
      </section>

      {/* Menu */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
            Our Menu
          </p>

          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            Delicious choices for every guest
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item) => (
            <div
              key={item.id}
              className="rounded-xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image Placeholder */}
              <div className="mb-5 flex h-40 items-center justify-center rounded-lg bg-gray-200">
                <span className="text-sm text-gray-500">
                  Food Image
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {item.category}
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-gray-900">
                    {item.name}
                  </h3>
                </div>

                <span className="font-bold text-gray-900">
                  KSh {item.price.toLocaleString()}
                </span>
              </div>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                {item.description}
              </p>

              <Link
                href={`/restaurant/order?item=${item.id}`}
                className="mt-5 block rounded-md bg-gray-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-gray-700"
              >
                Order Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Dining CTA */}
      <section className="bg-white px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Enjoy your meal at Serenity
        </h2>

        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          Whether you are staying with us or simply visiting our restaurant,
          we are ready to serve you.
        </p>

        <Link
          href="/restaurant/order"
          className="mt-7 inline-block rounded-md bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
        >
          Place an Order
        </Link>
      </section>
    </main>
  );
}