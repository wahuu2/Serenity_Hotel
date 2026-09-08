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
      const response = await fetch(
        `/api/admin/bookings/${bookingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

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
      <span className="text-xs text-gray-400">
        No actions
      </span>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {currentStatus === "pending" && (
        <button
          type="button"
          onClick={() => updateStatus("confirmed")}
          disabled={loading}
          className="rounded-md bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Updating..." : "Confirm"}
        </button>
      )}

      {currentStatus === "confirmed" && (
        <button
          type="button"
          onClick={() => updateStatus("completed")}
          disabled={loading}
          className="rounded-md bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Updating..." : "Complete"}
        </button>
      )}

      <button
        type="button"
        onClick={() => updateStatus("cancelled")}
        disabled={loading}
        className="rounded-md bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Updating..." : "Cancel"}
      </button>
    </div>
  );
}