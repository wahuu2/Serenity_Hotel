import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Room from "@/models/room.model";
import Booking from "@/models/booking.model";

export default async function AdminDashboardPage() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  await connectToDatabase();

  const user = await User.findOne({
    clerkUserId: clerkUser.id,
  });

  if (!user) {
    redirect("/");
  }

  if (user.role !== "admin") {
    redirect("/");
  }

  const totalRooms = await Room.countDocuments();

  const availableRooms = await Room.countDocuments({
    available: true,
  });

  const totalBookings = await Booking.countDocuments();

  const revenueResult = await Booking.aggregate([
    {
      $match: {
        status: {
          $in: ["confirmed", "completed"],
        },
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: {
          $sum: "$totalAmount",
        },
      },
    },
  ]);

  const totalRevenue = revenueResult[0]?.totalRevenue || 0;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-gray-900 px-6 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-400">
            Serenity Hotel
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Admin Dashboard
          </h1>

          <p className="mt-4 max-w-2xl text-gray-300">
            Manage hotel bookings, rooms, customers, and
            restaurant operations from one place.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Rooms
            </p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {totalRooms}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Available Rooms
            </p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {availableRooms}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Bookings
            </p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              {totalBookings}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-gray-500">
              Total Revenue
            </p>

            <p className="mt-3 text-3xl font-bold text-gray-900">
              KSh {totalRevenue.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-xl bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            Welcome, {user.name}
          </h2>

          <p className="mt-2 text-gray-600">
            You are signed in as a hotel administrator.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <a
              href="/admin/bookings"
              className="rounded-lg border border-gray-200 p-5 transition hover:border-gray-900 hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900">
                Manage Bookings
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View and manage guest reservations.
              </p>
            </a>

            <a
              href="/admin/rooms"
              className="rounded-lg border border-gray-200 p-5 transition hover:border-gray-900 hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900">
                Manage Rooms
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add, edit, and manage hotel rooms.
              </p>
            </a>

            <a
              href="/admin/customers"
              className="rounded-lg border border-gray-200 p-5 transition hover:border-gray-900 hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900">
                Customers
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                View registered hotel guests.
              </p>
            </a>

            <a
              href="/admin/restaurant"
              className="rounded-lg border border-gray-200 p-5 transition hover:border-gray-900 hover:bg-gray-50"
            >
              <h3 className="font-semibold text-gray-900">
                Restaurant
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Manage restaurant orders.
              </p>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}