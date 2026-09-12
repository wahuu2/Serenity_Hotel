"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

function formatStatus(status: string) {
  if (!status) return "Unknown";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-KE", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status: Order["status"]) {
  switch (status) {
    case "pending":
      return "bg-amber-50 text-amber-700";

    case "confirmed":
      return "bg-blue-50 text-blue-700";

    case "preparing":
      return "bg-purple-50 text-purple-700";

    case "ready":
      return "bg-emerald-50 text-emerald-700";

    case "completed":
      return "bg-gray-100 text-gray-700";

    case "cancelled":
      return "bg-red-50 text-red-700";

    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function AdminRestaurantOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(
          "/api/admin/restaurant/orders"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch restaurant orders."
          );
        }

        setOrders(data.orders || []);
      } catch (error) {
        console.error(error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to fetch restaurant orders."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, []);

  const updateOrderStatus = async (
    orderId: string,
    status: Order["status"]
  ) => {
    try {
      setUpdatingOrderId(orderId);

      const response = await fetch(
        `/api/admin/restaurant/orders/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to update order status.");
        return;
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === orderId
            ? {
                ...order,
                status: data.order.status,
              }
            : order
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const preparingOrders = orders.filter(
    (order) => order.status === "preparing"
  ).length;

  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500 sm:text-sm">
              Serenity Hotel
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Restaurant Orders
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              View and manage customer restaurant orders.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="rounded-2xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-800" />
              Loading restaurant orders...
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f6f3ee]">
        <section className="bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500 sm:text-sm">
              Serenity Hotel
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Restaurant Orders
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              View and manage customer restaurant orders.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white text-red-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-6 w-6"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="1.7"
                />

                <path
                  d="M12 8v4"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                />

                <circle
                  cx="12"
                  cy="16"
                  r="1"
                  fill="currentColor"
                />
              </svg>
            </div>

            <h2 className="mt-4 text-lg font-semibold text-red-900">
              Unable to Load Restaurant Orders
            </h2>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <Link
              href="/admin/restaurant"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              Back to Restaurant
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* Page Header */}
      <section className="bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-amber-500 sm:text-sm">
              Serenity Hotel
            </p>

            <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
              Restaurant Orders
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              View customer restaurant orders and manage their
              preparation status from one place.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-12">
        {/* Page Heading */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Restaurant
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              Order Management
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Monitor incoming orders, track preparation progress, and
              update order statuses.
            </p>
          </div>

          <Link
            href="/admin/restaurant"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
          >
            Back to Restaurant
          </Link>
        </div>

        {/* Order Summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Total Orders
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-950">
                  {totalOrders}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  All restaurant orders
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M6 4h12v16H6z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M9 8h6M9 12h6M9 16h4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Pending */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Pending
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-950">
                  {pendingOrders}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Awaiting confirmation
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="8.5"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="M12 7v5l3 2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Preparing */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Preparing
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-950">
                  {preparingOrders}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Currently being prepared
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="M6 7h12M7 4h10v16H7z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M10 11h4M10 15h4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                  Completed
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-950">
                  {completedOrders}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Successfully completed
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    d="m5 12 4 4L19 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Orders */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-950">
              Restaurant Orders
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Customer orders and their current preparation status.
            </p>
          </div>

          {orders.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                >
                  <path
                    d="M6 4h12v16H6z"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M9 8h6M9 12h6M9 16h4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h4 className="mt-4 text-base font-semibold text-gray-950">
                No Restaurant Orders Yet
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                Customer restaurant orders will appear here.
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Order
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Items
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Total
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Status
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order) => (
                      <tr
                        key={order._id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        {/* Order */}
                        <td className="whitespace-nowrap px-6 py-5 align-top">
                          <p className="font-semibold text-gray-950">
                            {order.orderReference}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {order.items.length}{" "}
                            {order.items.length === 1
                              ? "item"
                              : "items"}
                          </p>
                        </td>

                        {/* Customer */}
                        <td className="px-6 py-5 align-top">
                          <div className="flex items-start gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold uppercase text-gray-600">
                              {order.customerName.charAt(0)}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900">
                                {order.customerName}
                              </p>

                              <p className="mt-1 max-w-[220px] truncate text-sm text-gray-500">
                                {order.customerEmail}
                              </p>

                              <p className="text-sm text-gray-500">
                                {order.customerPhone}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Items */}
                        <td className="px-6 py-5 align-top">
                          <div className="max-w-[240px] space-y-1.5">
                            {order.items.map((item, index) => (
                              <div
                                key={`${order._id}-${index}`}
                                className="flex items-start justify-between gap-4"
                              >
                                <p className="text-sm text-gray-700">
                                  {item.name}
                                </p>

                                <span className="shrink-0 text-xs font-semibold text-gray-400">
                                  ×{item.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="whitespace-nowrap px-6 py-5 align-top">
                          <p className="font-semibold text-gray-950">
                            KSh{" "}
                            {order.totalAmount.toLocaleString()}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-5 align-top">
                          <div className="space-y-3">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                                order.status
                              )}`}
                            >
                              {formatStatus(order.status)}
                            </span>

                            {order.status !== "completed" &&
                              order.status !== "cancelled" && (
                                <select
                                  value={order.status}
                                  disabled={
                                    updatingOrderId === order._id
                                  }
                                  onChange={(e) =>
                                    updateOrderStatus(
                                      order._id,
                                      e.target.value as Order["status"]
                                    )
                                  }
                                  className="h-10 w-40 rounded-lg border border-gray-300 bg-white px-3 text-xs font-semibold text-gray-800 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
                                >
                                  <option value="pending">
                                    Pending
                                  </option>

                                  <option value="confirmed">
                                    Confirmed
                                  </option>

                                  <option value="preparing">
                                    Preparing
                                  </option>

                                  <option value="ready">
                                    Ready
                                  </option>

                                  <option value="completed">
                                    Completed
                                  </option>

                                  <option value="cancelled">
                                    Cancelled
                                  </option>
                                </select>
                              )}

                            {updatingOrderId === order._id && (
                              <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span className="h-3 w-3 animate-spin rounded-full border-2 border-gray-200 border-t-gray-700" />
                                Updating...
                              </div>
                            )}
                          </div>
                        </td>

                        {/* Date */}
                        <td className="whitespace-nowrap px-6 py-5 align-top text-sm text-gray-600">
                          {formatDate(order.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-center text-xs text-gray-400 md:hidden">
                Swipe horizontally to view the complete order details.
              </div>
            </>
          )}
        </section>
      </section>
    </main>
  );
}