"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

const rooms = [
  {
    id: 1,
    name: "Deluxe Room",
    price: 8500,
  },
  {
    id: 2,
    name: "Executive Suite",
    price: 12000,
  },
  {
    id: 3,
    name: "Family Room",
    price: 15000,
  },
];

function BookingForm() {
  const searchParams = useSearchParams();

  const roomId = Number(searchParams.get("room"));

  const selectedRoom = rooms.find((room) => room.id === roomId);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

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

  const total = selectedRoom
    ? selectedRoom.price * nights
    : 0;

  if (!selectedRoom) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Select a Room
          </h1>

          <p className="mt-3 text-gray-600">
            Please select a room before making a booking.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-900 px-6 py-16 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
          Reservations
        </p>

        <h1 className="mt-3 text-4xl font-bold">
          Book Your Stay
        </h1>
      </section>

      {/* Booking Form */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-3">
          
          {/* Form */}
          <div className="rounded-xl bg-white p-8 shadow-sm lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900">
              Reservation Details
            </h2>

            <p className="mt-2 text-gray-600">
              You are booking the{" "}
              <span className="font-semibold">
                {selectedRoom.name}
              </span>
              .
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              
              {/* Check-in */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check-in Date
                </label>

                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              {/* Check-out */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Check-out Date
                </label>

                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>
            </div>

            {/* Guests */}
            <div className="mt-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Number of Guests
              </label>

              <select
                value={guests}
                onChange={(e) =>
                  setGuests(Number(e.target.value))
                }
                className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
                <option value={5}>5 Guests</option>
              </select>
            </div>

            {/* Continue Button */}
            <button
              type="button"
              disabled={nights === 0}
              className="mt-8 w-full rounded-md bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              Continue to Payment
            </button>
          </div>

          {/* Booking Summary */}
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
                  {selectedRoom.name}
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
                  KSh {selectedRoom.price.toLocaleString()}
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