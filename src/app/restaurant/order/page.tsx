"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
};

type CartItem = {
  menuItem: MenuItem;
  quantity: number;
};

export default function RestaurantOrderPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchMenu() {
      try {
        const response = await fetch("/api/restaurant/menu");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load menu.");
        }

        setMenuItems(
          data.menuItems.filter((item: MenuItem) => item.available)
        );
      } catch (error) {
        console.error(error);
        setError("Failed to load the restaurant menu.");
      } finally {
        setLoading(false);
      }
    }

    fetchMenu();
  }, []);

  function addToCart(item: MenuItem) {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.menuItem._id === item._id
      );

      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.menuItem._id === item._id
            ? {
                ...cartItem,
                quantity: cartItem.quantity + 1,
              }
            : cartItem
        );
      }

      return [
        ...currentCart,
        {
          menuItem: item,
          quantity: 1,
        },
      ];
    });
  }

  function decreaseQuantity(menuItemId: string) {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.menuItem._id === menuItemId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  function increaseQuantity(menuItemId: string) {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.menuItem._id === menuItemId
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  }

  function removeFromCart(menuItemId: string) {
    setCart((currentCart) =>
      currentCart.filter((item) => item.menuItem._id !== menuItemId)
    );
  }

  const totalAmount = cart.reduce(
    (total, item) => total + item.menuItem.price * item.quantity,
    0
  );

  async function placeOrder() {
    setError("");
    setSuccess("");

    if (!isLoaded) {
      return;
    }

    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (cart.length === 0) {
      setError("Please add at least one item to your order.");
      return;
    }

    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    setOrdering(true);

    try {
      const response = await fetch("/api/restaurant/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName:
            user.fullName ||
            user.firstName ||
            "Guest Customer",

          customerEmail:
            user.primaryEmailAddress?.emailAddress || "",

          customerPhone: phone,

          items: cart.map((item) => ({
            menuItem: item.menuItem._id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to place order.");
      }

      setCart([]);
      setPhone("");

      setSuccess(
        `Order placed successfully. Your order reference is ${data.order.orderReference}.`
      );
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to place your order."
      );
    } finally {
      setOrdering(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <p className="text-center text-gray-600">
            Loading restaurant menu...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Order From Our Restaurant
          </h1>

          <p className="mt-3 text-gray-600">
            Choose your favourite meals and place your order.
          </p>
        </div>

        {error && (
          <div className="mx-auto mb-6 max-w-4xl rounded-lg bg-red-100 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mx-auto mb-6 max-w-4xl rounded-lg bg-green-100 px-4 py-3 text-green-700">
            {success}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* MENU */}
          <section className="lg:col-span-2">
            <h2 className="mb-5 text-2xl font-semibold text-gray-900">
              Menu
            </h2>

            {menuItems.length === 0 ? (
              <div className="rounded-xl bg-white p-8 text-center shadow">
                <p className="text-gray-600">
                  No menu items are currently available.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {menuItems.map((item) => (
                  <div
                    key={item._id}
                    className="overflow-hidden rounded-xl bg-white shadow"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-48 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-48 items-center justify-center bg-gray-200 text-gray-500">
                        No image
                      </div>
                    )}

                    <div className="p-5">
                      <div className="mb-2 flex items-start justify-between gap-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                          {item.name}
                        </h3>

                        <span className="whitespace-nowrap font-semibold text-green-700">
                          KSh {item.price.toLocaleString()}
                        </span>
                      </div>

                      <p className="mb-2 text-sm font-medium text-gray-500">
                        {item.category}
                      </p>

                      <p className="mb-5 text-sm text-gray-600">
                        {item.description}
                      </p>

                      <button
                        type="button"
                        onClick={() => addToCart(item)}
                        className="w-full rounded-lg bg-gray-900 px-4 py-3 font-medium text-white transition hover:bg-gray-700"
                      >
                        Add to Order
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ORDER SUMMARY */}
          <aside className="h-fit rounded-xl bg-white p-6 shadow">
            <h2 className="mb-6 text-2xl font-semibold text-gray-900">
              Your Order
            </h2>

            {cart.length === 0 ? (
              <p className="mb-6 text-gray-500">
                Your order is empty.
              </p>
            ) : (
              <div className="mb-6 space-y-5">
                {cart.map((item) => (
                  <div
                    key={item.menuItem._id}
                    className="border-b pb-5"
                  >
                    <div className="flex justify-between gap-3">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {item.menuItem.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          KSh{" "}
                          {item.menuItem.price.toLocaleString()} each
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          removeFromCart(item.menuItem._id)
                        }
                        className="text-sm text-red-600 hover:underline"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            decreaseQuantity(item.menuItem._id)
                          }
                          className="h-8 w-8 rounded border text-lg"
                        >
                          -
                        </button>

                        <span className="w-5 text-center">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            increaseQuantity(item.menuItem._id)
                          }
                          className="h-8 w-8 rounded border text-lg"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-semibold">
                        KSh{" "}
                        {(
                          item.menuItem.price * item.quantity
                        ).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mb-6 flex items-center justify-between border-t pt-5">
              <span className="text-lg font-semibold">
                Total
              </span>

              <span className="text-xl font-bold text-green-700">
                KSh {totalAmount.toLocaleString()}
              </span>
            </div>

            {user ? (
              <>
                <div className="mb-4">
                  <label
                    htmlFor="customerName"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Customer
                  </label>

                  <input
                    id="customerName"
                    type="text"
                    value={
                      user.fullName ||
                      user.firstName ||
                      "Guest Customer"
                    }
                    disabled
                    className="w-full rounded-lg border bg-gray-100 px-4 py-3 text-gray-600"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="customerEmail"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>

                  <input
                    id="customerEmail"
                    type="email"
                    value={
                      user.primaryEmailAddress?.emailAddress || ""
                    }
                    disabled
                    className="w-full rounded-lg border bg-gray-100 px-4 py-3 text-gray-600"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="phone"
                    className="mb-2 block text-sm font-medium text-gray-700"
                  >
                    Phone Number
                  </label>

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(event.target.value)
                    }
                    placeholder="0712345678"
                    className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-900"
                  />
                </div>

                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={ordering || cart.length === 0}
                  className="w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {ordering
                    ? "Placing Order..."
                    : "Place Order"}
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => router.push("/sign-in")}
                className="w-full rounded-lg bg-gray-900 px-4 py-3 font-semibold text-white transition hover:bg-gray-700"
              >
                Sign In to Order
              </button>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
}