"use client";

import { useEffect, useState } from "react";

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
        const response = await fetch("/api/admin/restaurant/orders");

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

  const getStatusClass = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "preparing":
        return "bg-purple-100 text-purple-700";

      case "ready":
        return "bg-green-100 text-green-700";

      case "completed":
        return "bg-gray-100 text-gray-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Serenity Hotel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Restaurant Orders
          </h1>

          <p className="mt-4 text-gray-600">
            Loading restaurant orders...
          </p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Serenity Hotel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Restaurant Orders
          </h1>

          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
            Serenity Hotel
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            Restaurant Orders
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage customer restaurant orders.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending</p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {
                orders.filter(
                  (order) => order.status === "pending"
                ).length
              }
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Preparing</p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {
                orders.filter(
                  (order) => order.status === "preparing"
                ).length
              }
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Completed</p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {
                orders.filter(
                  (order) => order.status === "completed"
                ).length
              }
            </p>
          </div>
        </div>

        {/* Orders */}
        {orders.length === 0 ? (
          <div className="rounded-lg bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              No restaurant orders yet
            </h2>

            <p className="mt-2 text-gray-500">
              Customer restaurant orders will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Order
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Customer
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Items
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Total
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Date
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="hover:bg-gray-50"
                    >
                      {/* Order */}
                      <td className="px-6 py-5 align-top">
                        <p className="font-semibold text-gray-900">
                          {order.orderReference}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {order.items.length}{" "}
                          {order.items.length === 1
                            ? "item"
                            : "items"}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="px-6 py-5 align-top">
                        <p className="font-medium text-gray-900">
                          {order.customerName}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {order.customerEmail}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.customerPhone}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="px-6 py-5 align-top">
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <p
                              key={`${order._id}-${index}`}
                              className="text-sm text-gray-700"
                            >
                              {item.name} × {item.quantity}
                            </p>
                          ))}
                        </div>
                      </td>

                      {/* Total */}
                      <td className="px-6 py-5 align-top">
                        <p className="font-semibold text-gray-900">
                          KSh{" "}
                          {order.totalAmount.toLocaleString()}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 align-top">
                        <div className="space-y-2">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${getStatusClass(
                              order.status
                            )}`}
                          >
                            {order.status}
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
                                className="w-full rounded-md border border-gray-300 bg-white px-2 py-2 text-xs text-gray-700 outline-none transition focus:border-gray-900 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:opacity-60"
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
                            <p className="text-xs text-gray-500">
                              Updating...
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-6 py-5 align-top text-sm text-gray-500">
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}