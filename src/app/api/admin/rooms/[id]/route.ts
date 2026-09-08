import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Room from "@/models/room.model";

const allowedTypes = [
  "Deluxe",
  "Suite",
  "Family",
  "Standard",
];

async function checkAdmin() {
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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin();

    if (adminCheck.error) {
      return adminCheck.error;
    }

    const { id } = await params;
    const body = await request.json();

    const room = await Room.findById(id);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found.",
        },
        { status: 404 }
      );
    }

    const allowedFields = [
      "name",
      "type",
      "price",
      "description",
      "amenities",
      "image",
      "capacity",
      "available",
    ];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        room[field] = body[field];
      }
    }

    if (
      room.type &&
      !allowedTypes.includes(room.type)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid room type.",
        },
        { status: 400 }
      );
    }

    if (room.price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Price cannot be negative.",
        },
        { status: 400 }
      );
    }

    if (room.capacity < 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Capacity must be at least 1.",
        },
        { status: 400 }
      );
    }

    await room.save();

    return NextResponse.json({
      success: true,
      message: "Room updated successfully.",
      room,
    });
  } catch (error) {
    console.error("Admin room PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update room.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminCheck = await checkAdmin();

    if (adminCheck.error) {
      return adminCheck.error;
    }

    const { id } = await params;

    const room = await Room.findById(id);

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found.",
        },
        { status: 404 }
      );
    }

    await Room.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Room deleted successfully.",
    });
  } catch (error) {
    console.error("Admin room DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete room.",
      },
      { status: 500 }
    );
  }
}