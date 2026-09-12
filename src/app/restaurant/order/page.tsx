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
        const params = new URLSearchParams(window.location.search);
        const selectedItemId = params.get("item");

        const response = await fetch("/api/restaurant/menu");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load menu.");
        }

        const availableItems: MenuItem[] = data.menuItems.filter(
          (item: MenuItem) => item.available
        );

        setMenuItems(availableItems);

        if (selectedItemId) {
          const selectedItem = availableItems.find(
            (item) => item._id === selectedItemId
          );

          if (selectedItem) {
            setCart([
              {
                menuItem: selectedItem,
                quantity: 1,
              },
            ]);
          }
        }
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

    setSuccess("");
    setError("");
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
      currentCart.filter(
        (item) => item.menuItem._id !== menuItemId
      )
    );
  }

  const totalAmount = cart.reduce(
    (total, item) =>
      total + item.menuItem.price * item.quantity,
    0
  );

  const totalItems = cart.reduce(
    (total, item) => total + item.quantity,
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

          customerPhone: phone.trim(),

          items: cart.map((item) => ({
            menuItem: item.menuItem._id,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to place order."
        );
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
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="bg-gray-950 px-6 py-20 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            Serenity Dining
          </p>

          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Preparing the menu...
          </h1>

          <p className="mt-4 text-white/60">
            Please wait while we bring up today&apos;s selections.
          </p>
        </section>

        <div className="mx-auto flex max-w-7xl justify-center px-6 py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-700" />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 text-white sm:py-24">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amber-700/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Serenity Dining
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              Order something
              <br className="hidden sm:block" />
              worth staying for.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Choose from our restaurant menu and enjoy freshly prepared
              favourites with the comfort and warmth of Serenity Hotel.
            </p>
          </div>
        </div>
      </section>

      {/* NOTIFICATIONS */}
      <section className="px-6 pt-8">
        <div className="mx-auto max-w-7xl">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 font-bold">!</span>

                <div>
                  <p className="font-semibold">
                    Something needs your attention
                  </p>

                  <p className="mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="rounded-2xl border border-green-200 bg-green-50 px-5 py-5 text-sm text-green-800">
              <div className="flex items-start gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
                  ✓
                </div>

                <div>
                  <p className="font-semibold">
                    Your order has been placed
                  </p>

                  <p className="mt-1 leading-6">{success}</p>

                  <button
                    type="button"
                    onClick={() => router.push("/restaurant/my-orders")}
                    className="mt-3 font-semibold underline underline-offset-4"
                  >
                    View My Orders
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-10 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          {/* MENU */}
          <section>
            <div className="mb-8 flex items-end justify-between gap-5">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                  From Our Kitchen
                </p>

                <h2 className="mt-2 text-3xl font-semibold">
                  Choose your favourites
                </h2>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  Add as many dishes as you like to your order.
                </p>
              </div>

              {cart.length > 0 && (
                <div className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-sm sm:block">
                  {totalItems}{" "}
                  {totalItems === 1 ? "item" : "items"}
                </div>
              )}
            </div>

            {menuItems.length === 0 ? (
              <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">
                <p className="text-sm font-semibold uppercase tracking-widest text-amber-700">
                  Serenity Dining
                </p>

                <h3 className="mt-3 text-2xl font-semibold">
                  No dishes available
                </h3>

                <p className="mx-auto mt-3 max-w-md leading-7 text-gray-600">
                  There are currently no menu items available. Please check
                  again later.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {menuItems.map((item) => {
                  const cartItem = cart.find(
                    (cartItem) =>
                      cartItem.menuItem._id === item._id
                  );

                  return (
                    <article
                      key={item._id}
                      className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                    >
                      {/* IMAGE */}
                      <div className="relative h-56 overflow-hidden bg-[#e9e2d7]">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-800">
                                Serenity Dining
                              </p>

                              <p className="mt-2 text-sm text-gray-500">
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

                      {/* DETAILS */}
                      <div className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-semibold leading-snug">
                            {item.name}
                          </h3>

                          <span className="shrink-0 text-sm font-bold text-amber-800">
                            KSh {item.price.toLocaleString()}
                          </span>
                        </div>

                        <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-600">
                          {item.description}
                        </p>

                        {cartItem ? (
                          <div className="mt-6 flex items-center justify-between rounded-xl bg-[#f6f3ee] p-2">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item._id)
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-lg font-semibold shadow-sm transition hover:bg-gray-100"
                              aria-label={`Decrease ${item.name} quantity`}
                            >
                              −
                            </button>

                            <div className="text-center">
                              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                                In your order
                              </p>

                              <p className="text-lg font-bold">
                                {cartItem.quantity}
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item._id)
                              }
                              className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-950 text-lg font-semibold text-white transition hover:bg-amber-800"
                              aria-label={`Increase ${item.name} quantity`}
                            >
                              +
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => addToCart(item)}
                            className="mt-6 flex w-full items-center justify-center rounded-full bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-800"
                          >
                            Add to Order
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* ORDER SUMMARY */}
          <aside className="lg:sticky lg:top-28 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
              {/* SUMMARY HEADER */}
              <div className="bg-gray-950 px-6 py-6 text-white">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-300">
                      Your Selection
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold">
                      Your Order
                    </h2>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                    {totalItems}
                  </div>
                </div>
              </div>

              <div className="p-6">
                {cart.length === 0 ? (
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f6f3ee] text-xl">
                      +
                    </div>

                    <h3 className="mt-4 font-semibold text-gray-900">
                      Your order is empty
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-gray-500">
                      Add a dish from the menu to start your order.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {cart.map((item) => (
                      <div
                        key={item.menuItem._id}
                        className="border-b border-gray-200 pb-5 last:border-0 last:pb-0"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.menuItem.name}
                            </h3>

                            <p className="mt-1 text-xs text-gray-500">
                              KSh{" "}
                              {item.menuItem.price.toLocaleString()} each
                            </p>
                          </div>

                          <p className="font-semibold text-gray-900">
                            KSh{" "}
                            {(
                              item.menuItem.price *
                              item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-gray-200 bg-gray-50 p-1">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.menuItem._id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-white"
                              aria-label={`Decrease ${item.menuItem.name} quantity`}
                            >
                              −
                            </button>

                            <span className="w-8 text-center text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.menuItem._id
                                )
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-full text-lg transition hover:bg-white"
                              aria-label={`Increase ${item.menuItem.name} quantity`}
                            >
                              +
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(
                                item.menuItem._id
                              )
                            }
                            className="text-xs font-semibold text-gray-500 transition hover:text-red-600"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* TOTAL */}
                <div className="mt-6 border-t border-gray-200 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-700">
                      Total
                    </span>

                    <span className="text-2xl font-bold text-amber-800">
                      KSh {totalAmount.toLocaleString()}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-gray-500">
                    Final order total based on your selected dishes.
                  </p>
                </div>

                {/* CUSTOMER */}
                <div className="mt-7">
                  <div className="mb-5">
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-700">
                      Guest Details
                    </p>

                    <h3 className="mt-2 text-xl font-semibold">
                      Where should we reach you?
                    </h3>
                  </div>

                  {user ? (
                    <>
                      <div className="mb-4">
                        <label
                          htmlFor="customerName"
                          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Name
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
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="customerEmail"
                          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
                        >
                          Email
                        </label>

                        <input
                          id="customerEmail"
                          type="email"
                          value={
                            user.primaryEmailAddress
                              ?.emailAddress || ""
                          }
                          disabled
                          className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-600 outline-none"
                        />
                      </div>

                      <div className="mb-6">
                        <label
                          htmlFor="phone"
                          className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500"
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
                          placeholder="0712 345 678"
                          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-amber-700 focus:ring-2 focus:ring-amber-700/10"
                        />

                        <p className="mt-2 text-xs text-gray-500">
                          We will use this number if we need to contact you
                          about your order.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={placeOrder}
                        disabled={
                          ordering || cart.length === 0
                        }
                        className="w-full rounded-full bg-gray-950 px-5 py-4 text-sm font-semibold text-white transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {ordering
                          ? "Placing Your Order..."
                          : "Place Order"}
                      </button>

                      <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                        By placing your order, you confirm that the details
                        above are correct.
                      </p>
                    </>
                  ) : (
                    <div className="rounded-2xl bg-[#f6f3ee] p-5 text-center">
                      <p className="text-sm leading-6 text-gray-600">
                        Please sign in to continue with your restaurant order.
                      </p>

                      <button
                        type="button"
                        onClick={() => router.push("/sign-in")}
                        className="mt-4 w-full rounded-full bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-800"
                      >
                        Sign In to Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* BOTTOM MESSAGE */}
      <section className="border-t border-gray-200 bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
            Serenity Hospitality
          </p>

          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl">
            Good food. Warm service. Your way.
          </h2>

          <p className="mt-4 leading-7 text-gray-600">
            Enjoy your meal in our restaurant or order from the comfort of
            your stay at Serenity Hotel.
          </p>

          <button
            type="button"
            onClick={() => router.push("/restaurant/my-orders")}
            className="mt-6 text-sm font-semibold text-gray-900 underline underline-offset-4 transition hover:text-amber-800"
          >
            View My Previous Orders
          </button>
        </div>
      </section>
    </main>
  );
}