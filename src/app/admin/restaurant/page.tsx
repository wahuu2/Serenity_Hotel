"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type MenuItem = {
  _id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
};

const categories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Drinks",
  "Desserts",
];

function formatCategory(category: string) {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

export default function AdminRestaurantPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  const [form, setForm] = useState({
    name: "",
    category: "Breakfast",
    description: "",
    price: "",
    image: "",
    available: true,
  });

  const fetchMenuItems = async () => {
    try {
      const response = await fetch("/api/admin/restaurant/menu");
      const data = await response.json();

      if (data.success) {
        setMenuItems(data.menuItems);
      } else {
        alert(data.message || "Failed to load menu items");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load menu items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      category: "Breakfast",
      description: "",
      price: "",
      image: "",
      available: true,
    });

    setEditingItem(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item: MenuItem) => {
    setEditingItem(item);

    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: String(item.price),
      image: item.image || "",
      available: item.available,
    });

    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      const url = editingItem
        ? `/api/admin/restaurant/menu/${editingItem._id}`
        : "/api/admin/restaurant/menu";

      const method = editingItem ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          description: form.description,
          price: Number(form.price),
          image: form.image,
          available: form.available,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to save menu item");
        return;
      }

      alert(
        editingItem
          ? "Menu item updated successfully"
          : "Menu item created successfully"
      );

      closeForm();

      await fetchMenuItems();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (item: MenuItem) => {
    try {
      const response = await fetch(
        `/api/admin/restaurant/menu/${item._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            available: !item.available,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to update availability");
        return;
      }

      await fetchMenuItems();
    } catch (error) {
      console.error(error);
      alert("Failed to update availability");
    }
  };

  const deleteItem = async (item: MenuItem) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/restaurant/menu/${item._id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to delete menu item");
        return;
      }

      alert("Menu item deleted successfully");

      await fetchMenuItems();
    } catch (error) {
      console.error(error);
      alert("Failed to delete menu item");
    }
  };

  const availableCount = menuItems.filter(
    (item) => item.available
  ).length;

  const unavailableCount = menuItems.filter(
    (item) => !item.available
  ).length;

  const categoryCount = new Set(
    menuItems.map((item) => item.category)
  ).size;

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
              Restaurant Management
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-gray-300 sm:text-base">
              Manage the restaurant menu, item availability, and
              restaurant orders from one place.
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
              Menu Management
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Create, update, and manage the availability of restaurant
              menu items.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <Link
              href="/admin/restaurant/orders"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
            >
              View Restaurant Orders
            </Link>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              <span className="mr-2 text-base">+</span>
              Add Menu Item
            </button>
          </div>
        </div>

        {/* Menu Summary */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Total Items
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {loading ? "—" : menuItems.length}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Menu items
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Available
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {loading ? "—" : availableCount}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Currently available
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Unavailable
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {loading ? "—" : unavailableCount}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Currently unavailable
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
              Categories
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-950">
              {loading ? "—" : categoryCount}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Menu categories
            </p>
          </div>
        </div>

        {/* Add / Edit Form */}
        {showForm && (
          <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700">
                    Menu Item
                  </p>

                  <h3 className="mt-1 text-lg font-semibold text-gray-950">
                    {editingItem
                      ? "Edit Menu Item"
                      : "Add Menu Item"}
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    {editingItem
                      ? "Update the selected menu item."
                      : "Add a new item to the restaurant menu."}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex min-h-10 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 p-5 sm:p-6 md:grid-cols-2"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="menu-name"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
                >
                  Name
                </label>

                <input
                  id="menu-name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Chicken Pilau"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="menu-category"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
                >
                  Category
                </label>

                <select
                  id="menu-category"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}
              <div>
                <label
                  htmlFor="menu-price"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
                >
                  Price (KSh)
                </label>

                <input
                  id="menu-price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  placeholder="850"
                  required
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />
              </div>

              {/* Image */}
              <div>
                <label
                  htmlFor="menu-image"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
                >
                  Image URL
                </label>

                <input
                  id="menu-image"
                  type="text"
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label
                  htmlFor="menu-description"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-gray-500"
                >
                  Description
                </label>

                <textarea
                  id="menu-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the meal..."
                  rows={4}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-950 focus:ring-1 focus:ring-gray-950"
                />
              </div>

              {/* Availability */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 md:col-span-2">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        available: e.target.checked,
                      })
                    }
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-gray-950"
                  />

                  <span>
                    <span className="block text-sm font-semibold text-gray-900">
                      Item is available
                    </span>

                    <span className="mt-0.5 block text-xs leading-5 text-gray-500">
                      Customers can see and order this menu item.
                    </span>
                  </span>
                </label>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-gray-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-white" />
                      Saving...
                    </>
                  ) : editingItem ? (
                    "Update Menu Item"
                  ) : (
                    "Create Menu Item"
                  )}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Menu Section */}
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-5 py-5 sm:px-6">
            <h3 className="text-lg font-semibold text-gray-950">
              Restaurant Menu
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Manage your available food and beverage offerings.
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-800" />
                  Loading menu...
                </div>
              </div>
            ) : menuItems.length === 0 ? (
              <div className="py-16 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  >
                    <path
                      d="M5 4v16M5 4c2 0 3 1.5 3 3s-1 3-3 3M12 4v16M12 4c2 0 3 1.5 3 3s-1 3-3 3M19 4v16"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <p className="mt-4 text-base font-semibold text-gray-950">
                  No Menu Items Found
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Add your first restaurant menu item to get started.
                </p>

                <button
                  type="button"
                  onClick={openAddForm}
                  className="mt-5 rounded-lg bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
                >
                  Add Menu Item
                </button>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((item) => (
                  <article
                    key={item._id}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    {/* Image */}
                    {item.image ? (
                      <div className="relative overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-52 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                        />

                        <div className="absolute left-4 top-4">
                          <span className="inline-flex items-center rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-gray-800 shadow-sm backdrop-blur">
                            {formatCategory(item.category)}
                          </span>
                        </div>

                        <div className="absolute right-4 top-4">
                          <button
                            type="button"
                            onClick={() => toggleAvailability(item)}
                            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
                              item.available
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-red-50 text-red-700 hover:bg-red-100"
                            }`}
                          >
                            <span
                              className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                item.available
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }`}
                            />

                            {item.available
                              ? "Available"
                              : "Unavailable"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative flex h-52 items-center justify-center bg-gray-100 text-gray-400">
                        <div className="text-center">
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="mx-auto h-8 w-8"
                            aria-hidden="true"
                          >
                            <rect
                              x="3"
                              y="4"
                              width="18"
                              height="16"
                              rx="2"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <circle
                              cx="8"
                              cy="9"
                              r="1.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                            />
                            <path
                              d="m4 17 5-5 3 3 2-2 6 5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>

                          <p className="mt-2 text-xs font-medium">
                            No image
                          </p>
                        </div>

                        <div className="absolute left-4 top-4">
                          <span className="inline-flex items-center rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                            {formatCategory(item.category)}
                          </span>
                        </div>

                        <div className="absolute right-4 top-4">
                          <button
                            type="button"
                            onClick={() => toggleAvailability(item)}
                            className={`inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition ${
                              item.available
                                ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                : "bg-red-50 text-red-700 hover:bg-red-100"
                            }`}
                          >
                            <span
                              className={`mr-1.5 h-1.5 w-1.5 rounded-full ${
                                item.available
                                  ? "bg-emerald-500"
                                  : "bg-red-500"
                              }`}
                            />

                            {item.available
                              ? "Available"
                              : "Unavailable"}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <h4 className="text-lg font-semibold tracking-tight text-gray-950">
                          {item.name}
                        </h4>

                        <p className="shrink-0 text-base font-semibold text-gray-950">
                          KSh {item.price.toLocaleString()}
                        </p>
                      </div>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-600">
                        {item.description}
                      </p>

                      {/* Actions */}
                      <div className="mt-5 flex gap-2 border-t border-gray-100 pt-5">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-950 hover:bg-gray-950 hover:text-white"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteItem(item)}
                          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}