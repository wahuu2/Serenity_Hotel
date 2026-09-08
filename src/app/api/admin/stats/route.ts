import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Room from "@/models/room.model";
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

    const totalRooms = await Room.countDocuments();

    const availableRooms = await Room.countDocuments({
      available: true,
    });

    const totalBookings = await Booking.countDocuments();

    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: {
            $in: ["confirmed", "completed"],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$totalAmount",
          },
        },
      },
    ]);

    const totalRevenue = revenueResult[0]?.totalRevenue || 0;

    return NextResponse.json({
      success: true,
      stats: {
        totalRooms,
        availableRooms,
        totalBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    console.error("Admin statistics error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load admin statistics.",
      },
      { status: 500 }
    );
  }
}