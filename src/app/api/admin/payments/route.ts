import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Payment from "@/models/payment.model";
import User from "@/models/user.model";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
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
      clerkUserId: userId,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    if (user.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to access payments.",
        },
        { status: 403 }
      );
    }

    const payments = await Payment.find({})
      .populate("user", "name email clerkUserId role")
      .populate({
        path: "booking",
        select:
          "bookingReference guestName guestEmail guestPhone room checkIn checkOut nights totalAmount status paymentStatus",
        populate: {
          path: "room",
          select: "name type price",
        },
      })
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      payments,
    });
  } catch (error) {
    console.error("Admin payments API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch payments.",
      },
      { status: 500 }
    );
  }
}