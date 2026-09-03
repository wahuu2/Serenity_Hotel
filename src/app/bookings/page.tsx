"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

type Room = {
  _id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  capacity: number;
  available: boolean;
};

function BookingForm() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = searchParams.get("room");

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    async function fetchRoom() {
      if (!roomId) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/rooms/${roomId}`);
        const data = await response.json();

        if (data.success) {
          setRoom(data.room);
        } else {
          setError(data.message || "Failed to load room");
        }
      } catch (error) {
        console.error("Failed to fetch room:", error);
        setError("Failed to load room details");
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [roomId]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end.getTime() - start.getTime();

    const calculatedNights = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return calculatedNights > 0 ? calculatedNights : 0;
  }, [checkIn, checkOut]);

  const total = room ? room.price * nights : 0;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (!roomId) {
      setError("No room selected.");
      return;
    }

    if (!checkIn || !checkOut) {
      setError("Please select your check-in and check-out dates.");
      return;
    }

    if (nights <= 0) {
      setError("Check-out date must be after check-in date.");
      return;
    }

    if (guests > (room?.capacity ?? 0)) {
      setError(
        `This room can accommodate a maximum of ${room?.capacity} guests.`
      );
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomId,
          guestName,
          guestEmail,
          guestPhone,
          checkIn,
          checkOut,
          guests,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to create booking");
        return;
      }

      router.push(
        `/bookings/success?reference=${data.booking.bookingReference}`
      );
    } catch (error) {
      console.error("Booking error:", error);
      setError("Something went wrong while creating your booking.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading booking details...</p>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Select a Room
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "Please select a room before making a booking."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 px-6 py-16 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
          Reservations
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Book Your Stay
        </h1>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">

          <form
            onSubmit={handleSubmit}
            className="rounded-xl bg-white p-8 shadow-sm lg:col-span-2"
          >
            <h2 className="text-2xl font-bold text-gray-900">
              Guest Details
            </h2>

            <p className="mt-2 text-gray-600">
              You are booking the{" "}
              <span className="font-semibold">
                {room.name}
              </span>
              .
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>

                <input
                  type="tel"
                  value={guestPhone}
                  onChange={(e) => setGuestPhone(e.target.value)}
                  placeholder="+254 700 000 000"
                  required
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                value={guestEmail}
                onChange={(e) => setGuestEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>

            <h2 className="mt-10 text-2xl font-bold text-gray-900">
              Reservation Details
            </h2>

            <div className="mt-6 grid gap-6 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check-in Date
                </label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check-out Date
                </label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

            </div>

            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Number of Guests
              </label>

              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
              >
                {Array.from(
                  { length: room.capacity },
                  (_, index) => index + 1
                ).map((number) => (
                  <option key={number} value={number}>
                    {number}{" "}
                    {number === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="mt-6 rounded-md bg-red-50 p-4 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || nights === 0}
              className="mt-8 w-full rounded-md bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {submitting
                ? "Creating Booking..."
                : "Confirm Booking"}
            </button>
          </form>

          <div className="h-fit rounded-xl bg-white p-8 shadow-sm">

            <h2 className="text-xl font-bold text-gray-900">
              Booking Summary
            </h2>

            <div className="mt-6 space-y-4">

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Room
                </span>

                <span className="font-medium text-gray-900">
                  {room.name}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Room Type
                </span>

                <span className="font-medium text-gray-900">
                  {room.type}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Guests
                </span>

                <span className="font-medium text-gray-900">
                  {guests}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Nights
                </span>

                <span className="font-medium text-gray-900">
                  {nights}
                </span>
              </div>

              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Rate / Night
                </span>

                <span className="font-medium text-gray-900">
                  KSh {room.price.toLocaleString()}
                </span>
              </div>

              <div className="border-t pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-900">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-gray-900">
                    KSh {total.toLocaleString()}
                  </span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <p className="text-gray-600">
            Loading booking details...
          </p>
        </main>
      }
    >
      <BookingForm />
    </Suspense>
  );
}