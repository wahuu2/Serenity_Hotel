import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Booking from "@/models/booking.model";

type RouteContext = {
  params: Promise<{
    id: string;
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
          message: "You must be signed in.",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Check logged-in admin
    const admin = await User.findOne({
      clerkUserId: clerkUser.id,
    });

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin account not found.",
        },
        { status: 404 }
      );
    }

    if (admin.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer ID is required.",
        },
        { status: 400 }
      );
    }

    const customer = await User.findById(id)
      .select("_id name email role createdAt")
      .lean();

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Customer not found.",
        },
        { status: 404 }
      );
    }

    const bookings = await Booking.find({
      user: customer._id,
    })
      .populate("room", "name type price")
      .sort({ createdAt: -1 })
      .lean();

    const totalSpent = bookings
      .filter(
        (booking) => booking.paymentStatus === "paid"
      )
      .reduce(
        (total, booking) =>
          total + booking.totalAmount,
        0
      );

    return NextResponse.json({
      success: true,

      customer: {
        _id: customer._id.toString(),
        name: customer.name,
        email: customer.email,
        role: customer.role,
        createdAt: customer.createdAt,
      },

      bookings: bookings.map((booking) => ({
        _id: booking._id.toString(),
        bookingReference: booking.bookingReference,
        guestName: booking.guestName,
        checkIn: booking.checkIn,
        checkOut: booking.checkOut,
        guests: booking.guests,
        nights: booking.nights,
        totalAmount: booking.totalAmount,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        createdAt: booking.createdAt,

        room: booking.room
          ? {
              name: (booking.room as any).name,
              type: (booking.room as any).type,
              price: (booking.room as any).price,
            }
          : null,
      })),

      statistics: {
        totalBookings: bookings.length,
        totalSpent,
      },
    });
  } catch (error) {
    console.error(
      "Fetch customer details error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch customer details.",
      },
      { status: 500 }
    );
  }
}