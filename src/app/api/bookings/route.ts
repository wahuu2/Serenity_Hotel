import { connectToDatabase } from "@/lib/mongodb";
import Booking from "@/models/booking.model";
import Room from "@/models/room.model";
import { NextResponse } from "next/server";

function generateBookingReference() {
  const date = new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");

  const random = Math.floor(1000 + Math.random() * 9000);

  return `SH-${date}-${random}`;
}

export async function GET(request: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required",
        },
        { status: 400 }
      );
    }

    const bookings = await Booking.find({
      guestEmail: email.toLowerCase(),
    })
      .populate("room", "name type price")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch bookings",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

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
          message: "All booking fields are required",
        },
        { status: 400 }
      );
    }

    const room = await Room.findById(roomId);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found",
        },
        { status: 404 }
      );
    }

    if (!room.available) {
      return NextResponse.json(
        {
          success: false,
          message: "This room is currently unavailable",
        },
        { status: 400 }
      );
    }

    if (Number(guests) > room.capacity) {
      return NextResponse.json(
        {
          success: false,
          message: `This room can accommodate a maximum of ${room.capacity} guests`,
        },
        { status: 400 }
      );
    }

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (
      Number.isNaN(startDate.getTime()) ||
      Number.isNaN(endDate.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid check-in or check-out date",
        },
        { status: 400 }
      );
    }

    if (endDate <= startDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Check-out date must be after check-in date",
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
            "This room is already booked for the selected dates. Please choose different dates or another room.",
        },
        { status: 409 }
      );
    }

    const millisecondsPerDay = 1000 * 60 * 60 * 24;

    const nights = Math.ceil(
      (endDate.getTime() - startDate.getTime()) /
        millisecondsPerDay
    );

    const totalAmount = room.price * nights;

    const booking = await Booking.create({
      room: room._id,
      guestName,
      guestEmail,
      guestPhone,
      checkIn: startDate,
      checkOut: endDate,
      guests: Number(guests),
      nights,
      totalAmount,
      status: "pending",
      bookingReference: generateBookingReference(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create booking error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create booking",
      },
      { status: 500 }
    );
  }
}