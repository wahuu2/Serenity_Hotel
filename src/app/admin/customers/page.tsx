"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Customer = {
  _id: string;
  name: string;
  email: string;
  role: "guest" | "admin";
  createdAt: string;
};

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/admin/customers");
        const data = await response.json();

        if (data.success) {
          setCustomers(data.customers);
        } else {
          alert(data.message || "Failed to load customers");
        }
      } catch (error) {
        console.error("Customer fetch error:", error);
        alert("Failed to load customers");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    const searchTerm = search.toLowerCase().trim();

    return customers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm) ||
        customer.email.toLowerCase().includes(searchTerm);

      const matchesRole =
        roleFilter === "all" || customer.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [customers, search, roleFilter]);

  const totalCustomers = customers.length;

  const guestCount = customers.filter(
    (customer) => customer.role === "guest"
  ).length;

  const adminCount = customers.filter(
    (customer) => customer.role === "admin"
  ).length;

  const hasActiveFilters =
    search.trim().length > 0 || roleFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setRoleFilter("all");
  };

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
              Customer Management
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              View registered guests, review customer accounts, and
              manage hotel users from one place.
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
              Customers
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-gray-950 sm:text-3xl">
              All Customers
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              View registered hotel users, identify their account
              roles, and access individual customer profiles.
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Customer Summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {/* Total */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Total
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {loading ? "—" : totalCustomers}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Registered users
            </p>
          </div>

          {/* Guests */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Guests
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {loading ? "—" : guestCount}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Hotel customers
            </p>
          </div>

          {/* Administrators */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Administrators
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {loading ? "—" : adminCount}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              System administrators
            </p>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            {/* Search */}
            <div className="flex-1">
              <label
                htmlFor="customer-search"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
              >
                Search Customers
              </label>

              <div className="relative">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="m20 20-4-4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>

                <input
                  id="customer-search"
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="w-full lg:w-52">
              <label
                htmlFor="role-filter"
                className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
              >
                Filter by Role
              </label>

              <select
                id="role-filter"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-800 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
              >
                <option value="all">All Roles</option>
                <option value="guest">Guests</option>
                <option value="admin">Administrators</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="h-11 rounded-lg border border-gray-300 bg-white px-5 text-sm font-semibold text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
              >
                Clear Filters
              </button>
            )}
          </div>

          {!loading && (
            <div className="mt-5 flex flex-col gap-1 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-900">
                  {filteredCustomers.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900">
                  {customers.length}
                </span>{" "}
                customers
              </p>

              {hasActiveFilters && (
                <p className="text-xs text-gray-400">
                  Search or role filter active
                </p>
              )}
            </div>
          )}
        </div>

        {/* Customers Table */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          {/* Table Header */}
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-950">
              Customer List
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Registered customers and their account information.
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center px-6 py-16">
              <div className="flex items-center gap-3 text-sm text-gray-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-800" />
                Loading customers...
              </div>
            </div>
          ) : filteredCustomers.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="h-5 w-5 text-gray-500"
                  aria-hidden="true"
                >
                  <circle
                    cx="11"
                    cy="11"
                    r="7"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                  <path
                    d="m20 20-4-4"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h4 className="mt-4 text-base font-semibold text-gray-950">
                No customers found
              </h4>

              <p className="mx-auto mt-1 max-w-md text-sm leading-6 text-gray-500">
                No customers match your current search or role filter.
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Clear Filters
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Customer
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Email
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Role
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Registered
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {filteredCustomers.map((customer) => (
                      <tr
                        key={customer._id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        {/* Customer */}
                        <td className="px-6 py-5">
                          <Link
                            href={`/admin/customers/${customer._id}`}
                            className="group flex items-center gap-3"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold uppercase text-gray-600 transition group-hover:bg-gray-950 group-hover:text-white">
                              {customer.name.charAt(0)}
                            </div>

                            <div>
                              <p className="font-semibold text-gray-900 transition group-hover:text-gray-700">
                                {customer.name}
                              </p>

                              <p className="mt-0.5 text-xs text-gray-400">
                                Customer account
                              </p>
                            </div>
                          </Link>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-5">
                          <span className="text-sm text-gray-600">
                            {customer.email}
                          </span>
                        </td>

                        {/* Role */}
                        <td className="px-6 py-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              customer.role === "admin"
                                ? "bg-purple-50 text-purple-700"
                                : "bg-blue-50 text-blue-700"
                            }`}
                          >
                            {customer.role === "admin"
                              ? "Administrator"
                              : "Guest"}
                          </span>
                        </td>

                        {/* Registered */}
                        <td className="px-6 py-5 text-sm text-gray-600">
                          {new Date(
                            customer.createdAt
                          ).toLocaleDateString("en-KE", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-5 text-right">
                          <Link
                            href={`/admin/customers/${customer._id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
                          >
                            View
                            <svg
                              viewBox="0 0 20 20"
                              fill="none"
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            >
                              <path
                                d="M4 10h11M11 6l4 4-4 4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile table hint */}
              <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-center text-xs text-gray-400 md:hidden">
                Swipe horizontally to view all customer details.
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}