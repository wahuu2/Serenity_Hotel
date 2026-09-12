import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

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

const unavailableRooms = totalRooms - availableRooms;

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
          Admin Dashboard
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300 sm:text-base sm:leading-8">
          Manage reservations, rooms, guests, and restaurant
          operations from one place.
        </p>
      </div>
    </div>
  </section>

  {/* =====================================================
      DASHBOARD CONTENT
  ===================================================== */}

  <section className="mx-auto max-w-7xl px-4 py-7 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
    {/* ===================================================
        WELCOME
    =================================================== */}

    <div className="mb-7 sm:mb-8">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
        Overview
      </p>

      <h2 className="mt-2 text-2xl font-semibold text-gray-900 sm:text-3xl">
        Welcome, {user.name}
      </h2>

      <p className="mt-2 text-sm leading-6 text-gray-600">
        Here is a quick overview of your hotel operations.
      </p>
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
              {totalRooms}
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
              {availableRooms}
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

      {/* Total Bookings */}

      <div className="border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
              Total Bookings
            </p>

            <p className="mt-3 text-3xl font-semibold text-gray-900">
              {totalBookings}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-blue-50 text-blue-700">
            <span className="text-sm font-semibold">
              BK
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Reservations recorded in the system
        </p>
      </div>

      {/* Revenue */}

      <div className="bg-gray-950 p-5 text-white shadow-sm sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400">
              Total Revenue
            </p>

            <p className="mt-3 text-2xl font-semibold sm:text-3xl">
              KSh {totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-amber-400/10 text-amber-400">
            <span className="text-sm font-semibold">
              KSh
            </span>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Confirmed and completed bookings
        </p>
      </div>
    </div>

    {/* ===================================================
        MANAGEMENT
    =================================================== */}

    <div className="mt-10 sm:mt-12">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
          Management
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-gray-900">
          Hotel operations
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
          Quickly access the areas you manage most often.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Bookings */}

        <Link
          href="/admin/bookings"
          className="group border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-900 hover:shadow-md sm:p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
              01
            </span>

            <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
              →
            </span>
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-900">
            Manage Bookings
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            View and manage guest reservations and booking
            activity.
          </p>
        </Link>

        {/* Rooms */}

        <Link
          href="/admin/rooms"
          className="group border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-900 hover:shadow-md sm:p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
              02
            </span>

            <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
              →
            </span>
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-900">
            Manage Rooms
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Add, edit, remove, and manage room availability.
          </p>
        </Link>

        {/* Customers */}

        <Link
          href="/admin/customers"
          className="group border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-900 hover:shadow-md sm:p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
              03
            </span>

            <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
              →
            </span>
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-900">
            Customers
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            View registered guests and customer information.
          </p>
        </Link>

        {/* Restaurant */}

        <Link
          href="/admin/restaurant"
          className="group border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-gray-900 hover:shadow-md sm:p-6"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-700">
              04
            </span>

            <span className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-gray-900">
              →
            </span>
          </div>

          <h3 className="mt-5 text-lg font-semibold text-gray-900">
            Restaurant
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage restaurant orders and dining operations.
          </p>
        </Link>
      </div>
    </div>

    {/* ===================================================
        ADMIN NOTE
    =================================================== */}

    <div className="mt-8 border border-gray-200 bg-white p-5 shadow-sm sm:mt-10 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            Administrator Access
          </p>

          <h3 className="mt-2 text-lg font-semibold text-gray-900">
            Serenity Hotel operations
          </h3>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            You are signed in with administrator privileges.
            Changes made in this area affect the hotel
            management system.
          </p>
        </div>

        <div className="shrink-0 text-xs font-medium uppercase tracking-wider text-gray-400">
          Admin
        </div>
      </div>
    </div>
  </section>
</main>

);
}