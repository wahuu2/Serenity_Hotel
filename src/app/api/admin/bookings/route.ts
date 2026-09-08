import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Booking from "@/models/booking.model";

export async function GET() {
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
          message: "You are not authorized to access this resource.",
        },
        { status: 403 }
      );
    }

    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("room", "name type price")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Admin bookings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load bookings.",
      },
      { status: 500 }
    );
  }
}