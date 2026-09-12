"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type BookingFormProps = {
  userName: string;
  userEmail: string;
};

type Room = {
  _id: string;
  name: string;
  type: string;
  price: number;
  description: string;
  capacity: number;
  available: boolean;
};

function BookingFormContent({
  userName,
  userEmail,
}: BookingFormProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = searchParams.get("room");

  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [guestName, setGuestName] = useState(userName);
  const [guestEmail, setGuestEmail] = useState(userEmail);
  const [guestPhone, setGuestPhone] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  useEffect(() => {
    setGuestName(userName);
    setGuestEmail(userEmail);
  }, [userName, userEmail]);

  useEffect(() => {
    async function fetchRoom() {
      if (!roomId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/rooms/${roomId}`);
        const data = await response.json();

        if (data.success) {
          setRoom(data.room);
        } else {
          setError(data.message || "Failed to load room.");
        }
      } catch (error) {
        console.error("Failed to fetch room:", error);
        setError("Failed to load room details.");
      } finally {
        setLoading(false);
      }
    }

    fetchRoom();
  }, [roomId]);

  const today = new Date().toISOString().split("T")[0];

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) {
      return 0;
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end.getTime() - start.getTime();

    const calculatedNights = Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );

    return calculatedNights > 0 ? calculatedNights : 0;
  }, [checkIn, checkOut]);

  const total = room ? room.price * nights : 0;

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!roomId) {
      setError("No room selected.");
      return;
    }

    if (!guestName.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!guestEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!guestPhone.trim()) {
      setError("Please enter your phone number.");
      return;
    }

    if (!checkIn || !checkOut) {
      setError(
        "Please select your check-in and check-out dates."
      );
      return;
    }

    if (nights <= 0) {
      setError(
        "Check-out date must be after check-in date."
      );
      return;
    }

    if (guests < 1) {
      setError("At least one guest is required.");
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
        setError(
          data.message || "Failed to create booking."
        );
        return;
      }

      router.push(`/payments/${data.booking._id}`);
    } catch (error) {
      console.error("Booking error:", error);

      setError(
        "Something went wrong while creating your booking."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
          <p className="mt-4 text-sm text-gray-600">
            Preparing your reservation...
          </p>
        </div>
      </main>
    );
  }

  if (!room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6">
        <div className="w-full max-w-md bg-white p-8 text-center shadow-sm md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
            Serenity Hotel
          </p>

          <h1 className="mt-4 text-3xl font-semibold text-gray-900">
            Select a Room
          </h1>

          <p className="mt-4 leading-7 text-gray-600">
            {error ||
              "Please select a room before making a booking."}
          </p>

          <button
            type="button"
            onClick={() => router.push("/rooms")}
            className="mt-7 w-full bg-gray-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Explore Rooms
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* =========================================================
          PAGE HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-20 text-white md:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,130,50,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-amber-400">
              Reservations
            </p>

            <h1 className="mt-5 text-4xl font-semibold leading-tight md:text-6xl">
              Reserve your stay.
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300 md:text-lg md:leading-8">
              Complete your reservation and take the next step toward a
              comfortable stay at Serenity Hotel.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================
          BOOKING CONTENT
      ========================================================= */}
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px] lg:items-start lg:gap-12">
          {/* =====================================================
              BOOKING FORM
          ===================================================== */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-sm"
          >
            {/* Guest Details */}
            <div className="border-b border-gray-200 p-6 sm:p-8 md:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                  Step 01
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-gray-900 md:text-3xl">
                  Guest details
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                  Tell us who will be staying. Your account information has
                  already been filled in for you.
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="guestName"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Full Name
                  </label>

                  <input
                    id="guestName"
                    type="text"
                    value={guestName}
                    onChange={(event) =>
                      setGuestName(event.target.value)
                    }
                    placeholder="Enter your full name"
                    required
                    className="w-full border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="guestPhone"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Phone Number
                  </label>

                  <input
                    id="guestPhone"
                    type="tel"
                    value={guestPhone}
                    onChange={(event) =>
                      setGuestPhone(event.target.value)
                    }
                    placeholder="+254 700 000 000"
                    required
                    className="w-full border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mt-6">
                <label
                  htmlFor="guestEmail"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Email Address
                </label>

                <input
                  id="guestEmail"
                  type="email"
                  value={guestEmail}
                  readOnly
                  required
                  className="w-full cursor-not-allowed border border-gray-200 bg-gray-100 px-4 py-3.5 text-sm text-gray-600 outline-none"
                />

                <p className="mt-2 text-xs text-gray-500">
                  This email is connected to your signed-in account.
                </p>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="p-6 sm:p-8 md:p-10">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-700">
                  Step 02
                </p>

                <h2 className="mt-3 text-2xl font-semibold text-gray-900 md:text-3xl">
                  Your reservation
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-gray-600">
                  Select your dates and the number of guests for this room.
                </p>
              </div>

              {/* Dates */}
              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="checkIn"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Check-in Date
                  </label>

                  <input
                    id="checkIn"
                    type="date"
                    value={checkIn}
                    onChange={(event) =>
                      setCheckIn(event.target.value)
                    }
                    min={today}
                    required
                    className="w-full border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Your arrival date
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="checkOut"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Check-out Date
                  </label>

                  <input
                    id="checkOut"
                    type="date"
                    value={checkOut}
                    onChange={(event) =>
                      setCheckOut(event.target.value)
                    }
                    min={checkIn || today}
                    required
                    className="w-full border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Your departure date
                  </p>
                </div>
              </div>

              {/* Guests */}
              <div className="mt-6">
                <label
                  htmlFor="guests"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Number of Guests
                </label>

                <select
                  id="guests"
                  value={guests}
                  onChange={(event) =>
                    setGuests(Number(event.target.value))
                  }
                  className="w-full border border-gray-300 bg-white px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900"
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

                <p className="mt-2 text-xs text-gray-500">
                  Maximum capacity: {room.capacity} guests
                </p>
              </div>

              {/* Live Total */}
              <div className="mt-8 border border-gray-200 bg-[#f6f3ee] p-5 sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Estimated stay
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      {nights > 0
                        ? `${nights} ${
                            nights === 1 ? "night" : "nights"
                          } × KSh ${room.price.toLocaleString()}`
                        : "Select your dates to calculate your stay"}
                    </p>
                  </div>

                  <p className="text-2xl font-semibold text-gray-900">
                    KSh {total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div
                  role="alert"
                  className="mt-6 border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
                >
                  <p className="font-semibold">
                    Unable to continue
                  </p>

                  <p className="mt-1">
                    {error}
                  </p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting || nights === 0}
                className="mt-8 w-full bg-gray-950 px-6 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {submitting
                  ? "Creating Booking..."
                  : "Continue to Payment"}
              </button>

              <p className="mt-4 text-center text-xs leading-5 text-gray-500">
                Your reservation will be created before proceeding to
                payment.
              </p>
            </div>
          </form>

          {/* =====================================================
              BOOKING SUMMARY
          ===================================================== */}
          <aside className="lg:sticky lg:top-28">
            <div className="overflow-hidden bg-gray-950 text-white shadow-sm">
              {/* Summary Header */}
              <div className="border-b border-white/10 p-6 sm:p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-400">
                  Your Stay
                </p>

                <h2 className="mt-3 text-2xl font-semibold">
                  Booking summary
                </h2>
              </div>

              {/* Room */}
              <div className="p-6 sm:p-8">
                <div className="border-b border-white/10 pb-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                    Selected Room
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold">
                    {room.name}
                  </h3>

                  <p className="mt-1 text-sm text-amber-400">
                    {room.type}
                  </p>

                  <p className="mt-5 text-sm leading-7 text-gray-400">
                    {room.description}
                  </p>
                </div>

                {/* Details */}
                <div className="border-b border-white/10 py-7">
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-400">
                        Guests
                      </span>

                      <span className="text-sm font-medium text-white">
                        {guests}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-400">
                        Nights
                      </span>

                      <span className="text-sm font-medium text-white">
                        {nights || "—"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-gray-400">
                        Rate / Night
                      </span>

                      <span className="text-sm font-medium text-white">
                        KSh {room.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div className="border-b border-white/10 py-7">
                  <div className="space-y-5">
                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Check-in
                      </p>

                      <p className="mt-2 text-sm font-medium text-white">
                        {checkIn
                          ? new Date(
                              checkIn
                            ).toLocaleDateString("en-KE", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Not selected"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-wider text-gray-500">
                        Check-out
                      </p>

                      <p className="mt-2 text-sm font-medium text-white">
                        {checkOut
                          ? new Date(
                              checkOut
                            ).toLocaleDateString("en-KE", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "Not selected"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Total */}
                <div className="pt-7">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-gray-400">
                        Total stay
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {nights > 0
                          ? `${nights} ${
                              nights === 1
                                ? "night"
                                : "nights"
                            }`
                          : "Awaiting dates"}
                      </p>
                    </div>

                    <p className="text-3xl font-semibold text-white">
                      KSh {total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hotel Note */}
            <div className="mt-5 border border-gray-200 bg-white p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                Serenity Hotel
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-600">
                Enjoy comfortable accommodation, thoughtful service, and
                warm Kenyan hospitality throughout your stay.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default function BookingForm(
  props: BookingFormProps
) {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-[#f6f3ee] px-6">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />

            <p className="mt-4 text-sm text-gray-600">
              Loading booking details...
            </p>
          </div>
        </main>
      }
    >
      <BookingFormContent {...props} />
    </Suspense>
  );
}