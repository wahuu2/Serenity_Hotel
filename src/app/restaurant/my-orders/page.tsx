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
      <main className="min-h-screen bg-gray-50 px-6 py-16">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </main>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">
            My Restaurant Orders
          </h1>

          <p className="mt-2 text-gray-600">
            View your restaurant orders and their current status.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 && !error && (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No orders yet
            </h2>

            <p className="mt-2 text-gray-600">
              You have not placed any restaurant orders yet.
            </p>

            <button
              onClick={() => router.push("/restaurant")}
              className="mt-6 rounded-lg bg-black px-6 py-3 font-medium text-white transition hover:bg-gray-800"
            >
              Browse Restaurant Menu
            </button>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="rounded-xl bg-white p-6 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-center">
                <div>
                  <p className="text-sm text-gray-500">
                    Order Reference
                  </p>

                  <h2 className="text-lg font-bold text-gray-900">
                    {order.orderReference}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-sm font-semibold capitalize ${
                    order.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : order.status === "confirmed"
                        ? "bg-blue-100 text-blue-700"
                        : order.status === "preparing"
                          ? "bg-orange-100 text-orange-700"
                          : order.status === "ready"
                            ? "bg-green-100 text-green-700"
                            : order.status === "completed"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="py-5">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Ordered Items
                </h3>

                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${order._id}-${index}`}
                      className="flex items-center justify-between gap-4 border-b pb-3 last:border-b-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          KSh {item.price.toLocaleString()} ×{" "}
                          {item.quantity}
                        </p>
                      </div>

                      <p className="font-semibold text-gray-900">
                        KSh {item.subtotal.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-5">
                <span className="font-semibold text-gray-700">
                  Total
                </span>

                <span className="text-xl font-bold text-gray-900">
                  KSh {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}