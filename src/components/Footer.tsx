import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* =========================================================
          MAIN FOOTER
      ========================================================= */}
      <div className="mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* =====================================================
              HOTEL
          ===================================================== */}
          <div className="lg:pr-8">
            <Link
              href="/"
              className="inline-block text-2xl font-semibold tracking-tight"
            >
              Serenity
              <span className="ml-1 font-normal text-amber-400">Hotel</span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
              A comfortable place to stay, dine, relax, and experience warm
              Kenyan hospitality.
            </p>

            <Link
              href="/bookings"
              className="mt-7 inline-flex border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-gray-950"
            >
              Book Your Stay
            </Link>
          </div>

          {/* =====================================================
              EXPLORE
          ===================================================== */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              Explore
            </h3>

            <ul className="mt-5 space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/rooms"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Rooms & Suites
                </Link>
              </li>

              <li>
                <Link
                  href="/restaurant"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Restaurant
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Hotel Services
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-400 transition hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* =====================================================
              SERVICES
          ===================================================== */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              At Serenity
            </h3>

            <ul className="mt-5 space-y-3">
              <li className="text-sm text-gray-400">
                Comfortable Accommodation
              </li>

              <li className="text-sm text-gray-400">
                Restaurant & Dining
              </li>

              <li className="text-sm text-gray-400">
                Room Service
              </li>

              <li className="text-sm text-gray-400">
                Housekeeping
              </li>

              <li className="text-sm text-gray-400">
                Conference & Events
              </li>
            </ul>
          </div>

          {/* =====================================================
              CONTACT
          ===================================================== */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">
              Contact
            </h3>

            <div className="mt-5 space-y-4 text-sm text-gray-400">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Location
                </p>

                <p className="mt-1">
                  Nairobi, Kenya
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Phone
                </p>

                <p className="mt-1">
                  +254 700 000 000
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Email
                </p>

                <p className="mt-1 break-all">
                  info@serenityhotel.com
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Front Desk
                </p>

                <p className="mt-1">
                  Open 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          FOOTER DIVIDER
      ========================================================= */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left lg:px-8">
          <p className="text-xs text-gray-500 sm:text-sm">
            © {new Date().getFullYear()} Serenity Hotel. All rights reserved.
          </p>

          <p className="text-xs tracking-wide text-gray-500 sm:text-sm">
            Comfort <span className="mx-1 text-amber-500">•</span> Luxury{" "}
            <span className="mx-1 text-amber-500">•</span> Hospitality
          </p>
        </div>
      </div>
    </footer>
  );
}