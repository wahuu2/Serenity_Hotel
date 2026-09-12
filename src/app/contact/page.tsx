export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#f6f3ee]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gray-950 px-6 py-24 text-white md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,83,9,0.18),transparent_35%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-400">
            Contact Serenity
          </p>

          <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            We would love
            <span className="block text-amber-400">to hear from you.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-300 md:text-lg">
            Whether you are planning a stay, asking about our restaurant,
            arranging an event, or simply need more information, our team is
            ready to assist.
          </p>
        </div>
      </section>

      {/* Contact Information + Form */}
      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Contact Information */}
          <div className="rounded-[2rem] bg-gray-950 p-8 text-white md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-400">
              Get in Touch
            </p>

            <h2 className="mt-4 text-3xl font-semibold">
              Let&apos;s make your stay memorable.
            </h2>

            <p className="mt-5 leading-7 text-gray-300">
              Our team is available to assist you with reservations, dining,
              events, hotel services, directions, and any other questions about
              your stay.
            </p>

            <div className="mt-10 space-y-7">
              <div className="border-b border-white/10 pb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Location
                </p>

                <p className="mt-2 text-base text-white">
                  Nairobi, Kenya
                </p>
              </div>

              <div className="border-b border-white/10 pb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Phone
                </p>

                <a
                  href="tel:+254700000000"
                  className="mt-2 inline-block text-base text-white transition hover:text-amber-400"
                >
                  +254 700 000 000
                </a>
              </div>

              <div className="border-b border-white/10 pb-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Email
                </p>

                <a
                  href="mailto:info@serenityhotel.com"
                  className="mt-2 inline-block break-all text-base text-white transition hover:text-amber-400"
                >
                  info@serenityhotel.com
                </a>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                  Front Desk
                </p>

                <p className="mt-2 text-base text-white">
                  Open 24 hours, every day
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-[2rem] border border-black/5 bg-white p-7 shadow-sm md:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
                Send a Message
              </p>

              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
                How can we help?
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                Fill in the form below and our team will be ready to assist
                with your inquiry.
              </p>
            </div>

            <form className="mt-8 space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Full Name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-gray-200 bg-[#faf9f7] px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-200 bg-[#faf9f7] px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+254 700 000 000"
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f7] px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  What can we help with?
                </label>

                <select
                  id="subject"
                  name="subject"
                  defaultValue=""
                  className="w-full rounded-xl border border-gray-200 bg-[#faf9f7] px-4 py-3.5 text-sm text-gray-700 outline-none transition focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10"
                >
                  <option value="" disabled>
                    Select an inquiry type
                  </option>
                  <option value="reservation">Room Reservation</option>
                  <option value="restaurant">Restaurant</option>
                  <option value="events">Conference & Events</option>
                  <option value="services">Hotel Services</option>
                  <option value="general">General Inquiry</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-semibold text-gray-800"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  placeholder="Tell us how we can assist you..."
                  className="w-full resize-none rounded-xl border border-gray-200 bg-[#faf9f7] px-4 py-3.5 text-sm text-gray-950 outline-none transition placeholder:text-gray-400 focus:border-amber-600 focus:ring-2 focus:ring-amber-600/10"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-full bg-gray-950 px-6 py-4 text-sm font-semibold text-white transition hover:bg-amber-700"
              >
                Send Message
              </button>

              <p className="text-center text-xs leading-5 text-gray-500">
                We aim to respond to inquiries as soon as possible.
              </p>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-700">
              Need Something Else?
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-gray-950">
              Explore Serenity Hotel
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            <a
              href="/rooms"
              className="group rounded-2xl border border-gray-200 bg-[#f6f3ee] p-6 transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-700">
                Stay
              </p>

              <h3 className="mt-2 text-xl font-semibold text-gray-950">
                Rooms & Suites
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Find a comfortable room for your next stay.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-gray-950 transition group-hover:text-amber-700">
                Explore Rooms →
              </span>
            </a>

            <a
              href="/restaurant"
              className="group rounded-2xl border border-gray-200 bg-[#f6f3ee] p-6 transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-700">
                Dine
              </p>

              <h3 className="mt-2 text-xl font-semibold text-gray-950">
                Our Restaurant
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                Discover our menu and enjoy a meal during your stay.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-gray-950 transition group-hover:text-amber-700">
                Explore Dining →
              </span>
            </a>

            <a
              href="/services"
              className="group rounded-2xl border border-gray-200 bg-[#f6f3ee] p-6 transition hover:-translate-y-1 hover:border-amber-200 hover:shadow-md"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-700">
                Experience
              </p>

              <h3 className="mt-2 text-xl font-semibold text-gray-950">
                Hotel Services
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-600">
                See how we make your stay more comfortable and convenient.
              </p>

              <span className="mt-5 inline-block text-sm font-semibold text-gray-950 transition group-hover:text-amber-700">
                View Services →
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}