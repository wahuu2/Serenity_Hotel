import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/room.model";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();

    const rooms = await Room.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      rooms,
    });
  } catch (error) {
    console.error("Get rooms error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch rooms",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();

    const body = await request.json();

    const room = await Room.create(body);

    return NextResponse.json(
      {
        success: true,
        message: "Room created successfully",
        room,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create room error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create room",
      },
      { status: 500 }
    );
  }
}