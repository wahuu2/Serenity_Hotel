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
      <nav className="mx-auto flex min-h-[68px] max-w-7xl items-center justify-between px-4 sm:min-h-[74px] sm:px-6 lg:min-h-[80px] lg:px-8">
        {/* Brand */}
        <Link
          href="/"
          onClick={closeMenu}
          className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden sm:h-12 sm:w-12 lg:h-14 lg:w-14">
            <img
              src="/logo.png"
              alt="Serenity Hotel logo"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex min-w-0 flex-col justify-center leading-none">
            <span className="truncate text-[18px] font-semibold tracking-[0.07em] text-gray-950 sm:text-[22px] lg:text-[26px]">
              SERENITY
            </span>

            <span className="mt-1 text-[8px] font-semibold tracking-[0.3em] text-amber-700 sm:text-[10px]">
              HOTEL
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-4 xl:flex">
          <Link
            href="/"
            className="px-1.5 text-sm font-medium text-gray-700 transition hover:text-amber-700"
          >
            Home
          </Link>

          <Link
            href="/rooms"
            className="px-1.5 text-sm font-medium text-gray-700 transition hover:text-amber-700"
          >
            Rooms & Suites
          </Link>

          <Link
            href="/restaurant"
            className="px-1.5 text-sm font-medium text-gray-700 transition hover:text-amber-700"
          >
            Restaurant
          </Link>

          <Link
            href="/services"
            className="px-1.5 text-sm font-medium text-gray-700 transition hover:text-amber-700"
          >
            Services
          </Link>

          <Show when="signed-in">
            <Link
              href="/my-bookings"
              className="px-1.5 text-sm font-medium text-gray-700 transition hover:text-amber-700"
            >
              My Bookings
            </Link>

            <Link
              href="/restaurant/my-orders"
              className="px-1.5 text-sm font-medium text-gray-700 transition hover:text-amber-700"
            >
              My Orders
            </Link>
          </Show>

          <Link
            href="/contact"
            className="px-1.5 text-sm font-medium text-gray-700 transition hover:text-amber-700"
          >
            Contact
          </Link>

          <Link
            href="/bookings"
            className="rounded-full bg-gray-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Book Now
          </Link>

          <Show when="signed-in">
            <UserButton />
          </Show>

          <Show when="signed-out">
            <Link
              href="/sign-in"
              className="text-sm font-semibold text-gray-700 transition hover:text-amber-700"
            >
              Sign In
            </Link>
          </Show>
        </div>

        {/* Mobile / Tablet Actions */}
        <div className="flex items-center gap-2.5 xl:hidden">
          <Show when="signed-in">
            <div className="flex items-center">
              <UserButton />
            </div>
          </Show>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-900 transition hover:border-gray-900 hover:bg-gray-50 sm:h-11 sm:w-11"
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

      {/* Mobile / Tablet Menu */}
      {menuOpen && (
        <div className="border-t border-gray-100 bg-white shadow-lg xl:hidden">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 sm:py-5">
            <div className="rounded-2xl border border-gray-100 bg-[#f6f3ee] p-2">
              {/* Main Links */}
              <div className="flex flex-col">
                <Link
                  href="/"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-white hover:text-amber-700"
                >
                  Home
                </Link>

                <Link
                  href="/rooms"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-white hover:text-amber-700"
                >
                  Rooms & Suites
                </Link>

                <Link
                  href="/restaurant"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-white hover:text-amber-700"
                >
                  Restaurant
                </Link>

                <Link
                  href="/services"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-white hover:text-amber-700"
                >
                  Hotel Services
                </Link>

                <Show when="signed-in">
                  <Link
                    href="/my-bookings"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-white hover:text-amber-700"
                  >
                    My Bookings
                  </Link>

                  <Link
                    href="/restaurant/my-orders"
                    onClick={closeMenu}
                    className="rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-white hover:text-amber-700"
                  >
                    My Orders
                  </Link>
                </Show>

                <Link
                  href="/contact"
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-white hover:text-amber-700"
                >
                  Contact
                </Link>
              </div>

              {/* Booking CTA */}
              <div className="mt-2 border-t border-black/5 pt-3">
                <Link
                  href="/bookings"
                  onClick={closeMenu}
                  className="flex w-full items-center justify-center rounded-xl bg-gray-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-amber-700"
                >
                  Book Your Stay
                </Link>
              </div>

              {/* Signed Out */}
              <Show when="signed-out">
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <Link
                    href="/sign-in"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:border-gray-900"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/sign-up"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-xl border border-gray-950 bg-white px-4 py-3 text-sm font-semibold text-gray-950 transition hover:bg-gray-950 hover:text-white"
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