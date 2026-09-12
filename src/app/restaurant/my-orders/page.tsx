"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

type OrderItem = {
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

type Order = {
  _id: string;
  orderReference: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: OrderItem[];
  totalAmount: number;
  status:
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "completed"
    | "cancelled";
  createdAt: string;
};

const statusStyles: Record<Order["status"], string> = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-blue-50 text-blue-800 border-blue-200",
  preparing: "bg-orange-50 text-orange-800 border-orange-200",
  ready: "bg-green-50 text-green-800 border-green-200",
  completed: "bg-emerald-50 text-emerald-800 border-emerald-200",
  cancelled: "bg-red-50 text-red-800 border-red-200",
};

const statusLabels: Record<Order["status"], string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

export default function MyOrdersPage() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    async function fetchOrders() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/restaurant/orders/my-orders"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch your orders."
          );
        }

        setOrders(data.orders || []);
      } catch (err) {
        console.error("Fetch restaurant orders error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch your orders."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || loading) {
    return (
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="bg-gray-950 px-6 py-20 text-center text-white">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
            Serenity Dining
          </p>

          <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">
            Your dining history
          </h1>

          <p className="mt-4 text-white/60">
            Loading your restaurant orders...
          </p>
        </section>

        <div className="flex justify-center px-6 py-20">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-amber-700" />
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee] text-gray-900">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 text-white sm:py-24">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-amber-700/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-300">
              Serenity Dining
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              Your restaurant orders.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Keep track of your meals, order references, and current order
              status in one place.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => router.push("/restaurant")}
                className="rounded-full bg-amber-700 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-800"
              >
                Order Something New
              </button>

              <button
                type="button"
                onClick={() => router.push("/restaurant/order")}
                className="rounded-full border border-white/30 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-white hover:text-gray-950"
              >
                Go to Order Page
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-7xl px-6 py-12 sm:py-16">
        {/* ERROR */}
        {error && (
          <div className="mb-8 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 font-bold">!</span>

              <div>
                <p className="font-semibold">
                  We could not load your orders
                </p>

                <p className="mt-1">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 font-semibold underline underline-offset-4"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY */}
        {!error && orders.length > 0 && (
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Total Orders
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {orders.length}
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Restaurant orders placed
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Active Orders
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {
                  orders.filter(
                    (order) =>
                      order.status !== "completed" &&
                      order.status !== "cancelled"
                  ).length
                }
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Currently being processed
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 sm:col-span-2 lg:col-span-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                Completed
              </p>

              <p className="mt-3 text-3xl font-semibold">
                {
                  orders.filter(
                    (order) => order.status === "completed"
                  ).length
                }
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Meals successfully completed
              </p>
            </div>
          </div>
        )}

        {/* EMPTY STATE */}
        {orders.length === 0 && !error && (
          <div className="rounded-3xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm sm:px-10">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f6f3ee] text-2xl text-amber-700">
              +
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              Serenity Dining
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-gray-900 sm:text-3xl">
              No restaurant orders yet
            </h2>

            <p className="mx-auto mt-4 max-w-md leading-7 text-gray-600">
              You have not placed a restaurant order yet. Explore our menu and
              discover something delicious.
            </p>

            <button
              type="button"
              onClick={() => router.push("/restaurant")}
              className="mt-7 rounded-full bg-gray-950 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-800"
            >
              Browse Restaurant Menu
            </button>
          </div>
        )}

        {/* ORDERS */}
        {orders.length > 0 && (
          <div>
            <div className="mb-7 flex items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-700">
                  Order History
                </p>

                <h2 className="mt-2 text-3xl font-semibold">
                  Your recent orders
                </h2>
              </div>

              <button
                type="button"
                onClick={() => router.push("/restaurant")}
                className="hidden rounded-full border border-gray-900 px-5 py-2.5 text-sm font-semibold transition hover:bg-gray-900 hover:text-white sm:block"
              >
                Order Again
              </button>
            </div>

            <div className="space-y-6">
              {orders.map((order) => (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm"
                >
                  {/* ORDER HEADER */}
                  <div className="border-b border-gray-200 bg-[#fbfaf8] px-6 py-6 sm:px-8">
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                          Order Reference
                        </p>

                        <h3 className="mt-2 text-xl font-bold text-gray-900 sm:text-2xl">
                          {order.orderReference}
                        </h3>

                        <p className="mt-2 text-sm text-gray-500">
                          {new Date(
                            order.createdAt
                          ).toLocaleString("en-KE", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>

                      <span
                        className={`w-fit rounded-full border px-4 py-2 text-sm font-semibold ${
                          statusStyles[order.status]
                        }`}
                      >
                        {statusLabels[order.status]}
                      </span>
                    </div>
                  </div>

                  {/* STATUS MESSAGE */}
                  <div className="px-6 pt-6 sm:px-8">
                    <div
                      className={`rounded-2xl p-4 ${
                        order.status === "cancelled"
                          ? "bg-red-50"
                          : order.status === "completed"
                            ? "bg-emerald-50"
                            : "bg-[#f6f3ee]"
                      }`}
                    >
                      <p className="text-sm font-semibold text-gray-900">
                        {order.status === "pending" &&
                          "Your order has been received."}

                        {order.status === "confirmed" &&
                          "Your order has been confirmed by our team."}

                        {order.status === "preparing" &&
                          "Our kitchen is currently preparing your order."}

                        {order.status === "ready" &&
                          "Your order is ready."}

                        {order.status === "completed" &&
                          "Your order has been completed. We hope you enjoyed your meal."}

                        {order.status === "cancelled" &&
                          "This order has been cancelled."}
                      </p>

                      {order.status !== "cancelled" &&
                        order.status !== "completed" && (
                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            We will keep your order status updated as it moves
                            through our restaurant.
                          </p>
                        )}
                    </div>
                  </div>

                  {/* ORDER ITEMS */}
                  <div className="px-6 py-7 sm:px-8">
                    <div className="mb-5 flex items-center justify-between">
                      <h4 className="text-lg font-semibold">
                        Ordered Items
                      </h4>

                      <span className="text-sm text-gray-500">
                        {order.items.reduce(
                          (total, item) =>
                            total + item.quantity,
                          0
                        )}{" "}
                        items
                      </span>
                    </div>

                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div
                          key={`${order._id}-${index}`}
                          className="flex items-start justify-between gap-5 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >
                          <div className="min-w-0">
                            <p className="font-semibold text-gray-900">
                              {item.name}
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                              KSh {item.price.toLocaleString()} ×{" "}
                              {item.quantity}
                            </p>
                          </div>

                          <p className="shrink-0 font-semibold text-gray-900">
                            KSh {item.subtotal.toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* CUSTOMER + TOTAL */}
                  <div className="grid border-t border-gray-200 md:grid-cols-2">
                    <div className="border-b border-gray-200 px-6 py-6 md:border-b-0 md:border-r sm:px-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Customer Details
                      </p>

                      <div className="mt-4 space-y-2 text-sm">
                        <p className="font-medium text-gray-900">
                          {order.customerName}
                        </p>

                        {order.customerEmail && (
                          <p className="break-all text-gray-500">
                            {order.customerEmail}
                          </p>
                        )}

                        {order.customerPhone && (
                          <p className="text-gray-500">
                            {order.customerPhone}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-6 sm:px-8">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                        Order Total
                      </p>

                      <div className="mt-3 flex items-center justify-between gap-4">
                        <span className="text-sm text-gray-600">
                          Total
                        </span>

                        <span className="text-2xl font-bold text-amber-800">
                          KSh{" "}
                          {order.totalAmount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ORDER ACTION */}
                  <div className="border-t border-gray-200 bg-gray-50 px-6 py-5 sm:px-8">
                    <button
                      type="button"
                      onClick={() => router.push("/restaurant")}
                      className="w-full rounded-full border border-gray-900 px-5 py-3 text-sm font-semibold text-gray-900 transition hover:bg-gray-950 hover:text-white sm:w-auto"
                    >
                      Order Something Else
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* BOTTOM CTA */}
      <section className="bg-gray-950 px-6 py-16 text-center text-white sm:py-20">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">
            Serenity Dining
          </p>

          <h2 className="mt-4 text-3xl font-semibold">
            Ready for another meal?
          </h2>

          <p className="mt-4 leading-7 text-white/65">
            Explore the Serenity menu and find your next favourite dish.
          </p>

          <button
            type="button"
            onClick={() => router.push("/restaurant")}
            className="mt-7 rounded-full bg-amber-700 px-7 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-800"
          >
            Explore Restaurant
          </button>
        </div>
      </section>
    </main>
  );
}