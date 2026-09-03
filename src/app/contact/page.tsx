export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-gray-900 px-6 py-20 text-center text-white">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-300">
          Contact Us
        </p>

        <h1 className="mt-3 text-4xl font-bold md:text-5xl">
          We Would Love to Hear From You
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-gray-300">
          Have a question about our rooms, restaurant, or services?
          Get in touch with the Serenity Hotel team.
        </p>
      </section>

      {/* Contact Content */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              Get in Touch
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Our team is available to assist you with reservations,
              inquiries, events, and any other information you may need.
            </p>

            <div className="mt-8 space-y-6">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Location
                </h3>
                <p className="mt-1 text-gray-600">
                  Nairobi, Kenya
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Phone
                </h3>
                <p className="mt-1 text-gray-600">
                  +254 700 000 000
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Email
                </h3>
                <p className="mt-1 text-gray-600">
                  info@serenityhotel.com
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900">
                  Opening Hours
                </h3>
                <p className="mt-1 text-gray-600">
                  Front Desk: Open 24/7
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              Send Us a Message
            </h2>

            <form className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>

                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  Message
                </label>

                <textarea
                  id="message"
                  rows={5}
                  placeholder="Write your message..."
                  className="w-full rounded-md border px-4 py-3 outline-none focus:ring-2 focus:ring-gray-400"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-md bg-gray-900 px-6 py-3 font-semibold text-white transition hover:bg-gray-700"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}