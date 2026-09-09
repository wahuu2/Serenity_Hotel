import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Booking from "@/models/booking.model";
import Payment from "@/models/payment.model";

export async function POST(request: Request) {
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

    const body = await request.json();

    const { bookingId } = body;

    if (!bookingId) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking ID is required.",
        },
        { status: 400 }
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

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    if (booking.user.toString() !== user._id.toString()) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to pay for this booking.",
        },
        { status: 403 }
      );
    }

    const existingPayment = await Payment.findOne({
      booking: booking._id,
    });

    if (existingPayment) {
      return NextResponse.json(
        {
          success: false,
          message: "A payment already exists for this booking.",
          payment: existingPayment,
        },
        { status: 400 }
      );
    }

    const transactionReference = `PAY-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const payment = await Payment.create({
      booking: booking._id,
      user: user._id,
      amount: booking.totalAmount,
      currency: "KES",
      paymentMethod: "development",
      transactionReference,
      status: "paid",
      paidAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Payment completed successfully.",
        payment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Payment API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process payment.",
      },
      { status: 500 }
    );
  }
}