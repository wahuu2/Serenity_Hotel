import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
        {/* Hotel */}
        <div>
          <h2 className="text-2xl font-bold">Serenity Hotel</h2>

          <p className="mt-4 leading-7 text-gray-400">
            Experience comfort, luxury, and exceptional hospitality
            during every stay.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold">Quick Links</h3>

          <ul className="mt-4 space-y-3 text-gray-400">
            <li>
              <Link href="/" className="hover:text-white">
                Home
              </Link>
            </li>

            <li>
              <Link href="/rooms" className="hover:text-white">
                Rooms
              </Link>
            </li>

            <li>
              <Link href="/restaurant" className="hover:text-white">
                Restaurant
              </Link>
            </li>

            <li>
              <Link href="/services" className="hover:text-white">
                Services
              </Link>
            </li>

            <li>
              <Link href="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Services */}
        <div>
          <h3 className="text-lg font-semibold">Our Services</h3>

          <ul className="mt-4 space-y-3 text-gray-400">
            <li>Room Service</li>
            <li>Housekeeping</li>
            <li>Laundry Service</li>
            <li>Airport Transfers</li>
            <li>Conference & Events</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold">Contact</h3>

          <div className="mt-4 space-y-3 text-gray-400">
            <p>Nairobi, Kenya</p>
            <p>+254 700 000 000</p>
            <p>info@serenityhotel.com</p>
            <p>Front Desk: Open 24/7</p>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-6 py-6 text-center text-sm text-gray-500 md:flex-row md:items-center md:justify-between md:text-left">
          <p>
            © {new Date().getFullYear()} Serenity Hotel. All rights
            reserved.
          </p>

          <p>
            Comfort • Luxury • Hospitality
          </p>
        </div>
      </div>
    </footer>
  );
}