import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/room.model";
import { NextResponse } from "next/server";

type RoomRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: Request,
  { params }: RoomRouteProps
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    const room = await Room.findById(id).lean();

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message: "Room not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      room,
    });
  } catch (error) {
    console.error("Get room error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch room",
      },
      { status: 500 }
    );
  }
}