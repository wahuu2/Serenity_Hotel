"use client";

import { useEffect, useState } from "react";

type Room = {
  name: string;
  type: string;
  price: number;
};

type Booking = {
  _id: string;
  room: Room;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  nights: number;
  totalAmount: number;
  status: string;
  bookingReference: string;
};

export default function MyBookingsPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function syncCurrentUser() {
      try {
        const response = await fetch("/api/users/sync", {
          method: "POST",
        });

        const data = await response.json();

        if (!response.ok) {
          console.error("User sync failed:", data.message);
          return;
        }

        console.log("User synced successfully:", data.user);

        if (data.user?.email) {
          setEmail(data.user.email);
        }
      } catch (error) {
        console.error("User sync error:", error);
      }
    }

    syncCurrentUser();
  }, []);

  async function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setBookings([]);
    setSearched(false);

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/bookings?email=${encodeURIComponent(email.trim())}`
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to fetch bookings.");
        return;
      }

      setBookings(data.bookings);
      setSearched(true);
    } catch (error) {
      console.error("Fetch bookings error:", error);

      setError(
        "Something went wrong while fetching your bookings."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-KE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function getStatusClasses(status: string) {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      case "completed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  }

  function formatStatus(status: string) {
    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 px-6 py-16 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
          Reservations
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          My Bookings
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-300">
          View your Serenity Hotel reservations and booking
          details.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <form
          onSubmit={handleSearch}
          className="rounded-xl bg-white p-8 shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900">
            Find Your Bookings
          </h2>

          <p className="mt-2 text-gray-600">
            Your signed-in Clerk email has been filled in
            automatically.
          </p>

          <div className="mt-6 flex flex-col gap-4 md:flex-row">
            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="you@example.com"
              className="flex-1 rounded-md border border-gray-300 px-4 py-3 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-gray-900 px-8 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {loading ? "Searching..." : "Find Bookings"}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-md bg-red-50 p-4 text-sm text-red-600">
              {error}
            </div>
          )}
        </form>

        {searched && bookings.length === 0 && !error && (
          <div className="mt-8 rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              No Bookings Found
            </h2>

            <p className="mt-3 text-gray-600">
              We couldn't find any reservations associated
              with this email address.
            </p>
          </div>
        )}

        {bookings.length > 0 && (
          <div className="mt-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Your Reservations
            </h2>

            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-xl bg-white p-8 shadow-sm"
              >
                <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm text-gray-500">
                      Booking Reference
                    </p>

                    <p className="mt-1 text-lg font-bold text-gray-900">
                      {booking.bookingReference}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${getStatusClasses(
                      booking.status
                    )}`}
                  >
                    {formatStatus(booking.status)}
                  </span>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <p className="text-sm text-gray-500">
                      Room
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {booking.room?.name || "Room"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {booking.room?.type || "Accommodation"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Guest
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {booking.guestName}
                    </p>

                    <p className="text-sm text-gray-500">
                      {booking.guests}{" "}
                      {booking.guests === 1
                        ? "guest"
                        : "guests"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Check-in
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(booking.checkIn)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Check-out
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {formatDate(booking.checkOut)}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Duration
                    </p>

                    <p className="mt-1 font-semibold text-gray-900">
                      {booking.nights}{" "}
                      {booking.nights === 1
                        ? "night"
                        : "nights"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total Amount
                    </p>

                    <p className="mt-1 text-xl font-bold text-gray-900">
                      KSh{" "}
                      {booking.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}