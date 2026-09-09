import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/booking.model";
import Room from "@/models/room.model";
import User from "@/models/user.model";

function generateBookingReference() {
  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `SH-${date}-${random}`;
}

export async function POST(request: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to make a booking.",
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

    const body = await request.json();

    const {
      roomId,
      guestName,
      guestEmail,
      guestPhone,
      checkIn,
      checkOut,
      guests,
    } = body;

    if (
      !roomId ||
      !guestName ||
      !guestEmail ||
      !guestPhone ||
      !checkIn ||
      !checkOut ||
      !guests
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide all required booking details.",
        },
        { status: 400 }
      );
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found.",
        },
        { status: 404 }
      );
    }

    if (!room.available) {
      return NextResponse.json(
        {
          success: false,
          message: "This room is currently unavailable.",
        },
        { status: 400 }
      );
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const guestCount = Number(guests);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide valid check-in and check-out dates.",
        },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Check-out date must be after check-in date.",
        },
        { status: 400 }
      );
    }

    if (guestCount < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "At least one guest is required.",
        },
        { status: 400 }
      );
    }

    if (guestCount > room.capacity) {
      return NextResponse.json(
        {
          success: false,
          message: `This room can accommodate a maximum of ${room.capacity} guests.`,
        },
        { status: 400 }
      );
    }

    const overlappingBooking = await Booking.findOne({
      room: room._id,
      status: {
        $in: ["pending", "confirmed"],
      },
      checkIn: {
        $lt: endDate,
      },
      checkOut: {
        $gt: startDate,
      },
    });

    if (overlappingBooking) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This room is already booked for the selected dates.",
        },
        { status: 409 }
      );
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) /
        millisecondsPerDay
    );

    const totalAmount = nights * room.price;

    const booking = await Booking.create({
      user: user._id,

      room: room._id,

      guestName: guestName.trim(),

      guestEmail: guestEmail.trim().toLowerCase(),

      guestPhone: guestPhone.trim(),

      checkIn: startDate,

      checkOut: endDate,

      guests: guestCount,

      nights,

      totalAmount,

      status: "pending",

      bookingReference: generateBookingReference(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully.",
        booking: {
          _id: booking._id.toString(),
          bookingReference: booking.bookingReference,
          status: booking.status,
          totalAmount: booking.totalAmount,
          nights: booking.nights,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create booking.",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to view bookings.",
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

    const bookings = await Booking.find({
      user: user._id,
    })
      .populate("room", "name type price")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Fetch bookings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch bookings.",
      },
      { status: 500 }
    );
  }
}