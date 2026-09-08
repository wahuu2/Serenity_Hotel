"use client";

import { useEffect, useState } from "react";

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

      setShowForm(false);
      resetForm();

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

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500">
              Serenity Hotel
            </p>

            <h1 className="mt-2 text-3xl font-bold text-gray-900">
              Restaurant Management
            </h1>

            <p className="mt-1 text-gray-600">
              Manage restaurant menu items and availability.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-700"
          >
            + Add Menu Item
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingItem ? "Edit Menu Item" : "Add Menu Item"}
              </h2>

              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-2"
            >
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Name
                </label>

                <input
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Price (KSh)
                </label>

                <input
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Image URL
                </label>

                <input
                  type="text"
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
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
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.available}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        available: e.target.checked,
                      })
                    }
                    className="h-4 w-4"
                  />

                  <span className="text-sm font-medium text-gray-700">
                    Item is available
                  </span>
                </label>
              </div>

              <div className="flex gap-3 md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingItem
                    ? "Update Menu Item"
                    : "Create Menu Item"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Menu */}
        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            Loading menu...
          </div>
        ) : menuItems.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">
              No menu items found.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {menuItems.map((item) => (
              <div
                key={item._id}
                className="overflow-hidden rounded-xl bg-white shadow-sm"
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-52 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-52 items-center justify-center bg-gray-100 text-gray-400">
                    No image
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {item.category}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleAvailability(item)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        item.available
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {item.available
                        ? "Available"
                        : "Unavailable"}
                    </button>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-gray-600">
                    {item.description}
                  </p>

                  <p className="mt-5 text-lg font-bold text-gray-900">
                    KSh {item.price.toLocaleString()}
                  </p>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => openEditForm(item)}
                      className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteItem(item)}
                      className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}