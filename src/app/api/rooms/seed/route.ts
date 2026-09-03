import { connectToDatabase } from "@/lib/mongodb";
import Room from "@/models/room.model";
import { NextResponse } from "next/server";

const rooms = [
  {
    name: "Deluxe Room",
    type: "Deluxe",
    price: 8500,
    description:
      "A comfortable room with a spacious interior, modern furnishings, and everything you need for a relaxing stay.",
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "TV",
      "Room Service",
    ],
    image: "",
    capacity: 2,
    available: true,
  },
  {
    name: "Executive Suite",
    type: "Suite",
    price: 12000,
    description:
      "Enjoy extra space and premium comfort in our elegant executive suite, designed for business and leisure travelers.",
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "King Bed",
      "TV",
      "Mini Bar",
      "Room Service",
    ],
    image: "",
    capacity: 2,
    available: true,
  },
  {
    name: "Family Room",
    type: "Family",
    price: 15000,
    description:
      "A spacious family-friendly room offering comfortable accommodation for families traveling together.",
    amenities: [
      "Free Wi-Fi",
      "Air Conditioning",
      "Multiple Beds",
      "TV",
      "Room Service",
    ],
    image: "",
    capacity: 5,
    available: true,
  },
];

export async function POST() {
  try {
    await connectToDatabase();

    await Room.deleteMany({});

    const createdRooms = await Room.insertMany(rooms);

    return NextResponse.json({
      success: true,
      message: "Rooms seeded successfully",
      rooms: createdRooms,
    });
  } catch (error) {
    console.error("Seed rooms error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to seed rooms",
      },
      { status: 500 }
    );
  }
}