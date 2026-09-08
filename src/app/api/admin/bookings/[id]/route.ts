import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Booking from "@/models/booking.model";

const allowedStatuses = [
  "confirmed",
  "cancelled",
  "completed",
] as const;

type AllowedStatus = (typeof allowedStatuses)[number];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in.",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      clerkUserId: clerkUser.id,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account was not found.",
        },
        { status: 404 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to perform this action.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    const body = await request.json();
    const { status } = body;

    if (!allowedStatuses.includes(status as AllowedStatus)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid status. Use confirmed, cancelled, or completed.",
        },
        { status: 400 }
      );
    }

    const booking = await Booking.findById(id);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    if (booking.status === "cancelled" && status !== "cancelled") {
      return NextResponse.json(
        {
          success: false,
          message: "A cancelled booking cannot be changed.",
        },
        { status: 400 }
      );
    }

    if (booking.status === "completed" && status !== "completed") {
      return NextResponse.json(
        {
          success: false,
          message: "A completed booking cannot be changed.",
        },
        { status: 400 }
      );
    }

    booking.status = status;
    await booking.save();

    return NextResponse.json({
      success: true,
      message: `Booking status updated to ${status}.`,
      booking: {
        id: booking._id,
        bookingReference: booking.bookingReference,
        status: booking.status,
      },
    });
  } catch (error) {
    console.error("Admin booking status update error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update booking status.",
      },
      { status: 500 }
    );
  }
}