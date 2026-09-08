import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Room from "@/models/room.model";

async function getAdminUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "You must be signed in.",
        },
        { status: 401 }
      ),
    };
  }

  await connectToDatabase();

  const user = await User.findOne({
    clerkUserId: clerkUser.id,
  });

  if (!user) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "User account was not found.",
        },
        { status: 404 }
      ),
    };
  }

  if (user.role !== "admin") {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "You are not authorized to access this resource.",
        },
        { status: 403 }
      ),
    };
  }

  return { user };
}

export async function GET() {
  try {
    const adminCheck = await getAdminUser();

    if (adminCheck.error) {
      return adminCheck.error;
    }

    const rooms = await Room.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Admin rooms GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load rooms.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminCheck = await getAdminUser();

    if (adminCheck.error) {
      return adminCheck.error;
    }

    const body = await request.json();

    const {
      name,
      type,
      price,
      description,
      amenities,
      image,
      capacity,
      available,
    } = body;

    if (
      !name ||
      !type ||
      price === undefined ||
      !description ||
      capacity === undefined
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, type, price, description, and capacity are required.",
        },
        { status: 400 }
      );
    }

    if (
      !["Deluxe", "Suite", "Family", "Standard"].includes(type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid room type.",
        },
        { status: 400 }
      );
    }

    if (Number(price) < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Price cannot be negative.",
        },
        { status: 400 }
      );
    }

    if (Number(capacity) < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Capacity must be at least 1.",
        },
        { status: 400 }
      );
    }

    const room = await Room.create({
      name,
      type,
      price: Number(price),
      description,
      amenities: Array.isArray(amenities) ? amenities : [],
      image: image || "",
      capacity: Number(capacity),
      available: available !== false,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Room created successfully.",
        room,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin room POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create room.",
      },
      { status: 500 }
    );
  }
}