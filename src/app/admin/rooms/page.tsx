"use client";

import { useEffect, useState } from "react";

type Room = {
  _id: string;
  name: string;
  type: "Deluxe" | "Suite" | "Family" | "Standard";
  price: number;
  description: string;
  amenities: string[];
  image: string;
  capacity: number;
  available: boolean;
};

const roomTypes = ["Deluxe", "Suite", "Family", "Standard"];

export default function AdminRoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);

  const [form, setForm] = useState({
    name: "",
    type: "Deluxe",
    price: "",
    description: "",
    amenities: "",
    image: "",
    capacity: "",
    available: true,
  });

  const fetchRooms = async () => {
    try {
      const response = await fetch("/api/admin/rooms");

      const data = await response.json();

      if (data.success) {
        setRooms(data.rooms);
      } else {
        alert(data.message || "Failed to load rooms");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      type: "Deluxe",
      price: "",
      description: "",
      amenities: "",
      image: "",
      capacity: "",
      available: true,
    });

    setEditingRoom(null);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (room: Room) => {
    setEditingRoom(room);

    setForm({
      name: room.name,
      type: room.type,
      price: String(room.price),
      description: room.description,
      amenities: room.amenities.join(", "),
      image: room.image || "",
      capacity: String(room.capacity),
      available: room.available,
    });

    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      const payload = {
        name: form.name,
        type: form.type,
        price: Number(form.price),
        description: form.description,
        amenities: form.amenities
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        image: form.image,
        capacity: Number(form.capacity),
        available: form.available,
      };

      const url = editingRoom
        ? `/api/admin/rooms/${editingRoom._id}`
        : "/api/admin/rooms";

      const method = editingRoom ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to save room");
        return;
      }

      alert(editingRoom ? "Room updated successfully" : "Room created successfully");

      setShowForm(false);
      resetForm();

      await fetchRooms();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const toggleAvailability = async (room: Room) => {
    try {
      const response = await fetch(`/api/admin/rooms/${room._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          available: !room.available,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to update availability");
        return;
      }

      await fetchRooms();
    } catch (error) {
      console.error(error);
      alert("Failed to update availability");
    }
  };

  const deleteRoom = async (room: Room) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${room.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/rooms/${room._id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        alert(data.message || "Failed to delete room");
        return;
      }

      alert("Room deleted successfully");

      await fetchRooms();
    } catch (error) {
      console.error(error);
      alert("Failed to delete room");
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Room Management
            </h1>

            <p className="mt-1 text-gray-600">
              Manage Serenity Hotel rooms, prices and availability.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-700"
          >
            + Add Room
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-xl bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                {editingRoom ? "Edit Room" : "Add New Room"}
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

            <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Room Name
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Executive Suite"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Room Type
                </label>

                <select
                  value={form.type}
                  onChange={(e) =>
                    setForm({ ...form, type: e.target.value })
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Price Per Night (KSh)
                </label>

                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                  placeholder="5000"
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Capacity
                </label>

                <input
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({ ...form, capacity: e.target.value })
                  }
                  placeholder="2"
                  required
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
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Describe the room..."
                  rows={4}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Amenities
                </label>

                <input
                  type="text"
                  value={form.amenities}
                  onChange={(e) =>
                    setForm({ ...form, amenities: e.target.value })
                  }
                  placeholder="WiFi, TV, Air Conditioning, Breakfast"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-900"
                />

                <p className="mt-1 text-xs text-gray-500">
                  Separate amenities with commas.
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Image URL
                </label>

                <input
                  type="text"
                  value={form.image}
                  onChange={(e) =>
                    setForm({ ...form, image: e.target.value })
                  }
                  placeholder="https://example.com/room.jpg"
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
                    Room is available for booking
                  </span>
                </label>
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingRoom
                    ? "Update Room"
                    : "Create Room"}
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-gray-600">No rooms found.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Room
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Type
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Price
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Capacity
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Availability
                    </th>

                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-200">
                  {rooms.map((room) => (
                    <tr key={room._id} className="hover:bg-gray-50">
                      <td className="px-6 py-5">
                        <p className="font-semibold text-gray-900">
                          {room.name}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">
                          {room.description}
                        </p>
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        {room.type}
                      </td>

                      <td className="px-6 py-5 font-medium text-gray-900">
                        KSh {room.price.toLocaleString()}
                      </td>

                      <td className="px-6 py-5 text-gray-700">
                        {room.capacity} guest
                        {room.capacity !== 1 ? "s" : ""}
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => toggleAvailability(room)}
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            room.available
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {room.available ? "Available" : "Unavailable"}
                        </button>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openEditForm(room)}
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteRoom(room)}
                            className="rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
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