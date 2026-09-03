"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

const menuItems = [
  {
    id: 1,
    name: "Beef Burger",
    price: 950,
  },
  {
    id: 2,
    name: "Grilled Chicken",
    price: 1400,
  },
  {
    id: 3,
    name: "Chicken Biryani",
    price: 1200,
  },
  {
    id: 4,
    name: "Vegetable Pasta",
    price: 1000,
  },
  {
    id: 5,
    name: "Fresh Fruit Juice",
    price: 350,
  },
  {
    id: 6,
    name: "Chocolate Cake",
    price: 500,
  },
];

function OrderForm() {
  const searchParams = useSearchParams();

  const itemId = Number(searchParams.get("item"));

  const selectedItem = menuItems.find(
    (item) => item.id === itemId
  );

  const [quantity, setQuantity] = useState(1);
  const [roomNumber, setRoomNumber] = useState("");
  const [notes, setNotes] = useState("");

  const total = useMemo(() => {
    return selectedItem ? selectedItem.price * quantity : 0;
  }, [selectedItem, quantity]);

  if (!selectedItem) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Select a Menu Item
          </h1>

          <p className="mt-3 text-gray-600">
            Please select a food item before placing an order.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-900 px-6 py-16 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
          Serenity Dining
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Place Your Order
        </h1>
      </section>

      {/* Order Section */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          
          {/* Form */}
          <div className="rounded-xl bg-white p-8 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Order Details
            </h2>

            <p className="mt-2 text-gray-600">
              You selected{" "}
              <span className="font-semibold text-gray-900">
                {selectedItem.name}
              </span>
              .
            </p>

            {/* Quantity */}
            <div className="mt-8">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Quantity
              </label>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) =>
                      Math.max(1, current - 1)
                    )
                  }
                  className="h-11 w-11 rounded-md border text-xl font-semibold hover:bg-gray-100"
                >
                  −
                </button>

                <span className="flex h-11 w-16 items-center justify-center rounded-md border font-semibold">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setQuantity((current) => current + 1)
                  }
                  className="h-11 w-11 rounded-md border text-xl font-semibold hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* Room Number */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Room Number
              </label>

              <input
                type="text"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 204"
                className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Special Instructions */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Special Instructions
              </label>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests?"
                rows={4}
                className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              disabled={!roomNumber}
              className="mt-8 w-full rounded-md bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Place Order
            </button>
          </div>

          {/* Order Summary */}
          <div className="h-fit rounded-xl bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Order Summary
            </h2>

            <div className="mt-6 space-y-5">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Item
                </span>

                <span className="font-medium text-gray-900">
                  {selectedItem.name}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Price
                </span>

                <span className="font-medium text-gray-900">
                  KSh {selectedItem.price.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Quantity
                </span>

                <span className="font-medium text-gray-900">
                  {quantity}
                </span>
              </div>

              <div className="border-t pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-gray-900">
                    KSh {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}

export default function OrderPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-gray-600">
            Loading order details...
          </p>
        </main>
      }
    >
      <OrderForm />
    </Suspense>
  );
}