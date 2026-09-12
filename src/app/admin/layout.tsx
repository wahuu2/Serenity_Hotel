import Link from "next/link";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#f6f3ee]">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/admin" className="flex items-center">
            <span className="text-lg font-semibold tracking-[0.03em] text-gray-950 sm:text-xl">
              Serenity
            </span>

            <span className="ml-1 text-lg font-normal text-amber-700 sm:text-xl">
              Hotel
            </span>

            <span className="ml-3 hidden border-l border-gray-300 pl-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-500 sm:block">
              Admin
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <Link
              href="/admin"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
            >
              Dashboard
            </Link>

            <Link
              href="/admin/bookings"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
            >
              Bookings
            </Link>

            <Link
              href="/admin/rooms"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
            >
              Rooms
            </Link>

            <Link
              href="/admin/customers"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
            >
              Customers
            </Link>

            <Link
              href="/admin/restaurant"
              className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 hover:text-gray-950"
            >
              Restaurant
            </Link>
          </nav>

          <Link
            href="/"
            className="hidden rounded-md border border-gray-200 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-gray-700 transition hover:border-gray-900 hover:text-gray-950 sm:block"
          >
            View Site
          </Link>
        </div>
      </header>

      {children}
    </div>
  );
}