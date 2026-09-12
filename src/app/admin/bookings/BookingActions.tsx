"use client";

import { useState } from "react";

type BookingActionsProps = {
  bookingId: string;
  status: string;
};

export default function BookingActions({
  bookingId,
  status,
}: BookingActionsProps) {
  const [currentStatus, setCurrentStatus] = useState(status);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Failed to update booking.");
        return;
      }

      setCurrentStatus(data.booking.status);
    } catch (error) {
      console.error("Booking status update error:", error);
      alert("Something went wrong while updating the booking.");
    } finally {
      setLoading(false);
    }
  }

  if (
    currentStatus === "cancelled" ||
    currentStatus === "completed"
  ) {
    return (
      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500">
        No actions
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {currentStatus === "pending" && (
        <button
          type="button"
          onClick={() => updateStatus("confirmed")}
          disabled={loading}
          className="inline-flex min-w-[90px] items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-emerald-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Updating
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M5 10.5 8.5 14 15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Confirm
            </>
          )}
        </button>
      )}

      {currentStatus === "confirmed" && (
        <button
          type="button"
          onClick={() => updateStatus("completed")}
          disabled={loading}
          className="inline-flex min-w-[90px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-700 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              Updating
            </>
          ) : (
            <>
              <svg
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4"
                aria-hidden="true"
              >
                <path
                  d="M5 10.5 8.5 14 15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Complete
            </>
          )}
        </button>
      )}

      <button
        type="button"
        onClick={() => updateStatus("cancelled")}
        disabled={loading}
        className="inline-flex min-w-[80px] items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 transition-all duration-200 hover:border-red-300 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-200 border-t-red-600" />
            Updating
          </>
        ) : (
          <>
            <svg
              viewBox="0 0 20 20"
              fill="none"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path
                d="M6 6 14 14M14 6 6 14"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            Cancel
          </>
        )}
      </button>
    </div>
  );
}