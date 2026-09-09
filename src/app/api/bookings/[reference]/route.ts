import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/booking.model";
import User from "@/models/user.model";
import Payment from "@/models/payment.model";

type RouteContext = {
  params: Promise<{
    reference: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RouteContext
) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to view this booking.",
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
          message: "User account was not found in the database.",
        },
        { status: 404 }
      );
    }

    const { reference } = await params;

    if (!reference) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking reference is required.",
        },
        { status: 400 }
      );
    }

    const booking = await Booking.findOne({
      bookingReference: reference,
      user: user._id,
    })
      .populate("room", "name type price")
      .lean();

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    const payment = await Payment.findOne({
      booking: booking._id,
      user: user._id,
    })
      .select(
        "amount currency paymentMethod transactionReference status paidAt createdAt"
      )
      .lean();

    return NextResponse.json({
      success: true,
      booking: {
        _id: booking._id.toString(),
        bookingReference: booking.bookingReference,

        guestName: booking.guestName,
        guestEmail: booking.guestEmail,
        guestPhone: booking.guestPhone,

        room: booking.room,

        checkIn: booking.checkIn,
        checkOut: booking.checkOut,

        guests: booking.guests,
        nights: booking.nights,

        totalAmount: booking.totalAmount,

        status: booking.status,
        paymentStatus: booking.paymentStatus,

        createdAt: booking.createdAt,

        payment: payment
          ? {
              amount: payment.amount,
              currency: payment.currency,
              paymentMethod: payment.paymentMethod,
              transactionReference:
                payment.transactionReference,
              status: payment.status,
              paidAt: payment.paidAt,
              createdAt: payment.createdAt,
            }
          : null,
      },
    });
  } catch (error) {
    console.error("Fetch booking confirmation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch booking confirmation.",
      },
      { status: 500 }
    );
  }
}