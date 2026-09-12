"use client";

import { useState } from "react";
import Link from "next/link";
import { Show, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-5 sm:px-6 lg:px-8">
        {/* =========================================================
            LOGO
        ========================================================= */}
        <Link
          href="/"
          onClick={closeMenu}
          className="shrink-0 text-xl font-semibold tracking-tight text-gray-950 sm:text-2xl"
        >
          Serenity
          <span className="ml-1 font-normal text-amber-700">Hotel</span>
        </Link>

        {/* =========================================================
            DESKTOP NAVIGATION
        ========================================================= */}
        <div className="hidden items-center gap-6 lg:flex">
          <Link
            href="/"
            className="text-sm font-medium text-gray-700 transition hover:text-amber-700"
          >
            Home
          </Link>

          <Link
            href="/rooms"
            className="text-sm font-medium text-gray-700 transition hover:text-amber-700"
          >
            Rooms
          </Link>

          <Link
            href="/restaurant"
            className="text-sm font-medium text-gray-700 transition hover:text-amber-700"
          >
            Restaurant
          </Link>

          <Link
            href="/services"
            className="text-sm font-medium text-gray-700 transition hover:text-amber-700"
          >
            Services
          </Link>

          <Show when="signed-in">
            <Link
              href="/my-bookings"
              className="text-sm font-medium text-gray-700 transition hover:text-amber-700"
            >
              My Bookings
            </Link>

            <Link
              href="/restaurant/my-orders"
              className="text-sm font-medium text-gray-700 transition hover:text-amber-700"
            >
              My Orders
            </Link>
          </Show>

          <Link
            href="/contact"
            className="text-sm font-medium text-gray-700 transition hover:text-amber-700"
          >
            Contact
          </Link>

          {/* Book Now */}
          <Link
            href="/bookings"
            className="bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800"
          >
            Book Now
          </Link>

          {/* Logged Out */}
          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-gray-700 transition hover:text-black"
            >
              Sign In
            </Link>

            <Link
              href="/sign-up"
              className="border border-gray-900 px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-950 hover:text-white"
            >
              Sign Up
            </Link>
          </Show>

          {/* Logged In */}
          <Show when="signed-in">
            <UserButton />
          </Show>
        </div>

        {/* =========================================================
            MOBILE / TABLET ACTIONS
        ========================================================= */}
        <div className="flex items-center gap-3 lg:hidden">
          <Show when="signed-in">
            <UserButton />
          </Show>

          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center border border-gray-200 text-gray-900 transition hover:border-gray-900"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* =========================================================
          MOBILE / TABLET MENU
      ========================================================= */}
      {menuOpen && (
        <div className="border-t border-gray-200 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl px-5 py-5 sm:px-6">
            <div className="flex flex-col">
              <Link
                href="/"
                onClick={closeMenu}
                className="border-b border-gray-100 py-4 text-sm font-medium text-gray-800 transition hover:text-amber-700"
              >
                Home
              </Link>

              <Link
                href="/rooms"
                onClick={closeMenu}
                className="border-b border-gray-100 py-4 text-sm font-medium text-gray-800 transition hover:text-amber-700"
              >
                Rooms
              </Link>

              <Link
                href="/restaurant"
                onClick={closeMenu}
                className="border-b border-gray-100 py-4 text-sm font-medium text-gray-800 transition hover:text-amber-700"
              >
                Restaurant
              </Link>

              <Link
                href="/services"
                onClick={closeMenu}
                className="border-b border-gray-100 py-4 text-sm font-medium text-gray-800 transition hover:text-amber-700"
              >
                Services
              </Link>

              <Show when="signed-in">
                <Link
                  href="/my-bookings"
                  onClick={closeMenu}
                  className="border-b border-gray-100 py-4 text-sm font-medium text-gray-800 transition hover:text-amber-700"
                >
                  My Bookings
                </Link>

                <Link
                  href="/restaurant/my-orders"
                  onClick={closeMenu}
                  className="border-b border-gray-100 py-4 text-sm font-medium text-gray-800 transition hover:text-amber-700"
                >
                  My Orders
                </Link>
              </Show>

              <Link
                href="/contact"
                onClick={closeMenu}
                className="border-b border-gray-100 py-4 text-sm font-medium text-gray-800 transition hover:text-amber-700"
              >
                Contact
              </Link>

              {/* Mobile Booking Button */}
              <Link
                href="/bookings"
                onClick={closeMenu}
                className="mt-5 bg-gray-950 px-6 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                Book Your Stay
              </Link>

              {/* Mobile Auth */}
              <Show when="signed-out">
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <Link
                    href="/sign-in"
                    onClick={closeMenu}
                    className="border border-gray-300 px-4 py-3 text-center text-sm font-semibold text-gray-800 transition hover:border-gray-900"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={closeMenu}
                    className="border border-gray-900 bg-white px-4 py-3 text-center text-sm font-semibold text-gray-900 transition hover:bg-gray-950 hover:text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              </Show>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}