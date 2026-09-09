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
export async function PATCH(request: Request) {
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
          message: "You are not authorized to manage payments.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const { paymentId, status } = body;

    const allowedStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    if (!paymentId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment ID and status are required.",
        },
        { status: 400 }
      );
    }

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment status.",
        },
        { status: 400 }
      );
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return NextResponse.json(
        {
          success: false,
          message: "Payment not found.",
        },
        { status: 404 }
      );
    }

    payment.status = status;

    if (status === "paid") {
      payment.paidAt = payment.paidAt || new Date();
    } else {
      payment.paidAt = null;
    }

    await payment.save();

    const Booking = (await import("@/models/booking.model")).default;

    const booking = await Booking.findById(payment.booking);

    if (booking) {
      if (status === "paid") {
        booking.paymentStatus = "paid";

        if (booking.status !== "cancelled") {
          booking.status = "confirmed";
        }
      } else if (status === "refunded") {
        booking.paymentStatus = "refunded";
      } else {
        booking.paymentStatus = "unpaid";
      }

      await booking.save();
    }

    const updatedPayment = await Payment.findById(payment._id)
      .populate("user", "name email")
      .populate({
        path: "booking",
        select:
          "bookingReference guestName guestEmail room checkIn checkOut nights totalAmount status paymentStatus",
        populate: {
          path: "room",
          select: "name type price",
        },
      });

    return NextResponse.json({
      success: true,
      message: "Payment status updated successfully.",
      payment: updatedPayment,
    });
  } catch (error) {
    console.error(
      "Admin payment status update error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update payment status.",
      },
      { status: 500 }
    );
  }
}