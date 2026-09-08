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

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await fetch(
          "/api/admin/restaurant/orders"
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch orders."
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

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold text-gray-900">
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
          <h1 className="text-3xl font-bold text-gray-900">
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
          <h1 className="text-3xl font-bold text-gray-900">
            Restaurant Orders
          </h1>

          <p className="mt-2 text-gray-600">
            View and manage customer restaurant orders.
          </p>
        </div>

        {/* Summary */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
              {orders.length}
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-yellow-600">
              {
                orders.filter(
                  (order) => order.status === "pending"
                ).length
              }
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Preparing
            </p>

            <p className="mt-2 text-3xl font-bold text-blue-600">
              {
                orders.filter(
                  (order) => order.status === "preparing"
                ).length
              }
            </p>
          </div>

          <div className="rounded-lg bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Completed
            </p>

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
                      <td className="px-6 py-5">
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
                      <td className="px-6 py-5">
                        <p className="font-medium text-gray-900">
                          {order.customerName}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.customerEmail}
                        </p>

                        <p className="text-sm text-gray-500">
                          {order.customerPhone}
                        </p>
                      </td>

                      {/* Items */}
                      <td className="px-6 py-5">
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
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900">
                          KSh{" "}
                          {order.totalAmount.toLocaleString()}
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                            order.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : order.status === "confirmed"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "preparing"
                              ? "bg-purple-100 text-purple-700"
                              : order.status === "ready"
                              ? "bg-green-100 text-green-700"
                              : order.status === "completed"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="whitespace-nowrap px-6 py-5 text-sm text-gray-500">
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