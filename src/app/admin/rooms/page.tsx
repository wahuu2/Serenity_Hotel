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

  const closeForm = () => {
    setShowForm(false);
    resetForm();
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

      alert(
        editingRoom
          ? "Room updated successfully"
          : "Room created successfully"
      );

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

  const totalRooms = rooms.length;

  const availableRooms = rooms.filter(
    (room) => room.available
  ).length;

  const unavailableRooms = rooms.filter(
    (room) => !room.available
  ).length;

  const roomTypeCount = new Set(
    rooms.map((room) => room.type)
  ).size;

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* =====================================================
          ADMIN HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-gray-950 px-4 py-12 text-white sm:px-6 sm:py-16 lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,130,50,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-amber-400 sm:text-xs">
              Serenity Hotel
            </p>

            <h1 className="mt-4 text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
              Room Management
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
              Manage hotel rooms, prices, availability, and
              accommodation details from one place.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          DASHBOARD CONTENT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        {/* ===================================================
            PAGE INTRO
        =================================================== */}

        <div className="mb-7 flex flex-col gap-5 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Accommodation
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
              Hotel Rooms
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Add, edit, remove, and manage the availability of
              Serenity Hotel rooms.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href="/admin"
              className="inline-flex min-h-11 items-center justify-center border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-800 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
            >
              Back to Dashboard
            </a>

            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex min-h-11 items-center justify-center bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
            >
              + Add Room
            </button>
          </div>
        </div>

        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total Rooms */}

          <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Total Rooms
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  {loading ? "—" : totalRooms}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#f6f3ee] text-amber-700">
                <span className="text-sm font-semibold">
                  RM
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              All rooms registered in the system
            </p>
          </div>

          {/* Available Rooms */}

          <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Available Rooms
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  {loading ? "—" : availableRooms}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-green-50 text-green-700">
                <span className="text-sm font-semibold">
                  AV
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              {unavailableRooms > 0
                ? `${unavailableRooms} currently unavailable`
                : "All rooms currently available"}
            </p>
          </div>

          {/* Unavailable Rooms */}

          <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Unavailable
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  {loading ? "—" : unavailableRooms}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-red-50 text-red-700">
                <span className="text-sm font-semibold">
                  UN
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Rooms currently unavailable for booking
            </p>
          </div>

          {/* Room Types */}

          <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  Room Types
                </p>

                <p className="mt-3 text-3xl font-semibold text-gray-900">
                  {loading ? "—" : roomTypeCount}
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-blue-50 text-blue-700">
                <span className="text-sm font-semibold">
                  TY
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs text-gray-500">
              Accommodation categories
            </p>
          </div>
        </div>

        {/* ===================================================
            ADD / EDIT ROOM
        =================================================== */}

        {showForm && (
          <section className="mt-8 border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-6 flex flex-col gap-4 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                  {editingRoom ? "Room Update" : "Room Setup"}
                </p>

                <h2 className="mt-2 text-xl font-semibold text-gray-900">
                  {editingRoom ? "Edit Room" : "Add New Room"}
                </h2>

                <p className="mt-1 text-sm text-gray-600">
                  {editingRoom
                    ? "Update the room information below."
                    : "Add a new accommodation option to the hotel."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="inline-flex min-h-10 items-center justify-center border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid gap-5 md:grid-cols-2"
            >
              {/* Room Name */}

              <div>
                <label
                  htmlFor="room-name"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gray-500"
                >
                  Room Name
                </label>

                <input
                  id="room-name"
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Executive Suite"
                  required
                  className="h-11 w-full border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              {/* Room Type */}

              <div>
                <label
                  htmlFor="room-type"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gray-500"
                >
                  Room Type
                </label>

                <select
                  id="room-type"
                  value={form.type}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      type: e.target.value,
                    })
                  }
                  className="h-11 w-full border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                >
                  {roomTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price */}

              <div>
                <label
                  htmlFor="room-price"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gray-500"
                >
                  Price Per Night (KSh)
                </label>

                <input
                  id="room-price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      price: e.target.value,
                    })
                  }
                  placeholder="5000"
                  required
                  className="h-11 w-full border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              {/* Capacity */}

              <div>
                <label
                  htmlFor="room-capacity"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gray-500"
                >
                  Guest Capacity
                </label>

                <input
                  id="room-capacity"
                  type="number"
                  min="1"
                  value={form.capacity}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      capacity: e.target.value,
                    })
                  }
                  placeholder="2"
                  required
                  className="h-11 w-full border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              {/* Description */}

              <div className="md:col-span-2">
                <label
                  htmlFor="room-description"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gray-500"
                >
                  Description
                </label>

                <textarea
                  id="room-description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe the room..."
                  rows={4}
                  required
                  className="w-full border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              {/* Amenities */}

              <div className="md:col-span-2">
                <label
                  htmlFor="room-amenities"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gray-500"
                >
                  Amenities
                </label>

                <input
                  id="room-amenities"
                  type="text"
                  value={form.amenities}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      amenities: e.target.value,
                    })
                  }
                  placeholder="WiFi, TV, Air Conditioning, Breakfast"
                  className="h-11 w-full border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Separate amenities with commas.
                </p>
              </div>

              {/* Image */}

              <div className="md:col-span-2">
                <label
                  htmlFor="room-image"
                  className="mb-2 block text-xs font-semibold uppercase tracking-[0.15em] text-gray-500"
                >
                  Image URL
                </label>

                <input
                  id="room-image"
                  type="text"
                  value={form.image}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      image: e.target.value,
                    })
                  }
                  placeholder="https://example.com/room.jpg"
                  className="h-11 w-full border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                />
              </div>

              {/* Availability */}

              <div className="md:col-span-2">
                <div className="border border-gray-200 bg-[#f6f3ee] p-4">
                  <label className="flex cursor-pointer items-center gap-3">
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

                  <p className="mt-2 pl-7 text-xs text-gray-500">
                    Guests can book this room when availability is enabled.
                  </p>
                </div>
              </div>

              {/* Form Actions */}

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end md:col-span-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="min-h-11 border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex min-h-11 items-center justify-center gap-2 bg-gray-950 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving && (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-500 border-t-white" />
                  )}

                  {saving
                    ? "Saving..."
                    : editingRoom
                    ? "Update Room"
                    : "Create Room"}
                </button>
              </div>
            </form>
          </section>
        )}

        {/* ===================================================
            ROOM INVENTORY
        =================================================== */}

        <div className="mt-10 sm:mt-12">
          <div className="mb-6">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
              Inventory
            </p>

            <h2 className="mt-2 text-2xl font-semibold text-gray-900">
              Hotel room inventory
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Review your rooms, pricing, capacity, and current
              booking availability.
            </p>
          </div>

          {loading ? (
            <div className="border border-gray-200 bg-white p-8 text-center shadow-sm">
              <div className="flex items-center justify-center gap-3 text-sm text-gray-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-gray-800" />
                Loading rooms...
              </div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="border border-gray-200 bg-white p-8 text-center shadow-sm">
              <p className="text-base font-semibold text-gray-900">
                No rooms found
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Add your first hotel room to begin managing the inventory.
              </p>

              <button
                type="button"
                onClick={openAddForm}
                className="mt-5 bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Add Room
              </button>
            </div>
          ) : (
            <div className="overflow-hidden border border-gray-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                        Room
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                        Type
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                        Price
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                        Capacity
                      </th>

                      <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                        Availability
                      </th>

                      <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">
                    {rooms.map((room) => (
                      <tr
                        key={room._id}
                        className="transition-colors hover:bg-gray-50"
                      >
                        {/* Room */}

                        <td className="px-6 py-5 align-top">
                          <div className="flex items-start gap-3">
                            {room.image ? (
                              <img
                                src={room.image}
                                alt={room.name}
                                className="h-12 w-16 shrink-0 object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-16 shrink-0 items-center justify-center bg-[#f6f3ee] text-xs font-semibold text-gray-400">
                                ROOM
                              </div>
                            )}

                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900">
                                {room.name}
                              </p>

                              <p className="mt-1 max-w-[320px] truncate text-sm text-gray-500">
                                {room.description}
                              </p>

                              {room.amenities.length > 0 && (
                                <p className="mt-1 max-w-[320px] truncate text-xs text-gray-400">
                                  {room.amenities.join(" • ")}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Type */}

                        <td className="px-6 py-5 align-top">
                          <span className="inline-flex bg-[#f6f3ee] px-3 py-1 text-xs font-semibold text-gray-700">
                            {room.type}
                          </span>
                        </td>

                        {/* Price */}

                        <td className="whitespace-nowrap px-6 py-5 align-top">
                          <p className="font-semibold text-gray-900">
                            KSh {room.price.toLocaleString()}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Per night
                          </p>
                        </td>

                        {/* Capacity */}

                        <td className="whitespace-nowrap px-6 py-5 align-top text-sm text-gray-700">
                          {room.capacity}{" "}
                          {room.capacity === 1
                            ? "guest"
                            : "guests"}
                        </td>

                        {/* Availability */}

                        <td className="px-6 py-5 align-top">
                          <button
                            type="button"
                            onClick={() => toggleAvailability(room)}
                            className={`inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold transition ${
                              room.available
                                ? "bg-green-50 text-green-700 hover:bg-green-100"
                                : "bg-red-50 text-red-700 hover:bg-red-100"
                            }`}
                          >
                            <span
                              className={`h-1.5 w-1.5 ${
                                room.available
                                  ? "bg-green-600"
                                  : "bg-red-600"
                              }`}
                            />

                            {room.available
                              ? "Available"
                              : "Unavailable"}
                          </button>
                        </td>

                        {/* Actions */}

                        <td className="px-6 py-5 align-top">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(room)}
                              className="border border-gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 transition hover:border-gray-900 hover:bg-gray-900 hover:text-white"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteRoom(room)}
                              className="border border-red-200 bg-white px-3.5 py-2 text-xs font-semibold text-red-600 transition hover:border-red-600 hover:bg-red-600 hover:text-white"
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

              <div className="border-t border-gray-100 bg-gray-50 px-4 py-3 text-center text-xs text-gray-400 md:hidden">
                Swipe horizontally to view all room details.
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}