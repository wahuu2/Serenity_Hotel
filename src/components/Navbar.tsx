import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-900">
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

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-700 hover:text-black"
          >
            Contact
          </Link>
        </div>

        {/* Booking Button */}
        <Link
          href="/bookings"
          className="rounded-md bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
        >
          Book Now
        </Link>
      </nav>
    </header>
  );
}