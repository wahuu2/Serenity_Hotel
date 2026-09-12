import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">
      {/* =========================================================
          MAIN FOOTER
      ========================================================= */}
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 sm:gap-12 lg:grid-cols-4 lg:gap-10">
          {/* =====================================================
              HOTEL
          ===================================================== */}
          <div className="sm:col-span-2 lg:col-span-1 lg:pr-8">
            <Link
              href="/"
              className="inline-flex items-center text-xl font-semibold tracking-[0.04em] sm:text-2xl"
            >
              Serenity
              <span className="ml-1 font-normal text-amber-400">
                Hotel
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400 sm:mt-5">
              A comfortable place to stay, dine, relax, and experience warm
              Kenyan hospitality.
            </p>

            <Link
              href="/bookings"
              className="mt-6 inline-flex min-h-11 items-center justify-center border border-white/30 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white hover:text-gray-950"
            >
              Book Your Stay
            </Link>
          </div>

          {/* =====================================================
              EXPLORE
          ===================================================== */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 sm:text-sm">
              Explore
            </h3>

            <ul className="mt-4 space-y-1 sm:mt-5">
              <li>
                <Link
                  href="/"
                  className="flex min-h-10 items-center text-sm text-gray-400 transition hover:text-white"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/rooms"
                  className="flex min-h-10 items-center text-sm text-gray-400 transition hover:text-white"
                >
                  Rooms & Suites
                </Link>
              </li>

              <li>
                <Link
                  href="/restaurant"
                  className="flex min-h-10 items-center text-sm text-gray-400 transition hover:text-white"
                >
                  Restaurant
                </Link>
              </li>

              <li>
                <Link
                  href="/services"
                  className="flex min-h-10 items-center text-sm text-gray-400 transition hover:text-white"
                >
                  Hotel Services
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="flex min-h-10 items-center text-sm text-gray-400 transition hover:text-white"
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
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 sm:text-sm">
              At Serenity
            </h3>

            <ul className="mt-4 space-y-1 sm:mt-5">
              <li className="flex min-h-10 items-center text-sm text-gray-400">
                Comfortable Accommodation
              </li>

              <li className="flex min-h-10 items-center text-sm text-gray-400">
                Restaurant & Dining
              </li>

              <li className="flex min-h-10 items-center text-sm text-gray-400">
                Room Service
              </li>

              <li className="flex min-h-10 items-center text-sm text-gray-400">
                Housekeeping
              </li>

              <li className="flex min-h-10 items-center text-sm text-gray-400">
                Conference & Events
              </li>
            </ul>
          </div>

          {/* =====================================================
              CONTACT
          ===================================================== */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-400 sm:text-sm">
              Contact
            </h3>

            <div className="mt-4 space-y-4 text-sm text-gray-400 sm:mt-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                  Location
                </p>

                <p className="mt-1">
                  Nairobi, Kenya
                </p>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                  Phone
                </p>

                <a
                  href="tel:+254700000000"
                  className="mt-1 inline-block transition hover:text-white"
                >
                  +254 700 000 000
                </a>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
                  Email
                </p>

                <a
                  href="mailto:info@serenityhotel.com"
                  className="mt-1 inline-block break-all transition hover:text-white"
                >
                  info@serenityhotel.com
                </a>
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-[0.15em] text-gray-500">
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
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-center sm:px-6 sm:py-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
          <p className="text-xs leading-5 text-gray-500 sm:text-sm">
            © {new Date().getFullYear()} Serenity Hotel. All rights reserved.
          </p>

          <p className="text-xs leading-5 tracking-wide text-gray-500 sm:text-sm">
            Comfort{" "}
            <span className="mx-1 text-amber-500">•</span>{" "}
            Luxury{" "}
            <span className="mx-1 text-amber-500">•</span>{" "}
            Hospitality
          </p>
        </div>
      </div>
    </footer>
  );
}