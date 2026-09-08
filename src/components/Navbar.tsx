import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold text-gray-900"
        >
          Serenity Hotel
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Home
          </Link>

          <Link
            href="/rooms"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Rooms
          </Link>

          <Link
            href="/restaurant"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Restaurant
          </Link>

          <Link
            href="/services"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Services
          </Link>

          {/* My Bookings - Logged In */}
<Show when="signed-in">
  <Link
    href="/my-bookings"
    className="text-sm font-medium text-gray-700 hover:text-black"
  >
    My Bookings
  </Link>

  <Link
    href="/restaurant/my-orders"
    className="text-sm font-medium text-gray-700 hover:text-black"
  >
    My Orders
  </Link>
</Show>

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Contact
          </Link>

          {/* Book Now */}
          <Link
            href="/bookings"
            className="rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Book Now
          </Link>

          {/* Logged Out */}
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-gray-700 hover:text-black"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="rounded-md border border-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-black hover:text-white"
            >
              Sign Up
            </Link>
          </Show>

          {/* Logged In */}
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>
      </nav>
    </header>
  );
}