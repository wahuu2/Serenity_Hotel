import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import MenuItem from "@/models/menuItem.model";

export async function GET() {
  try {
    await connectToDatabase();

    const menuItems = await MenuItem.find({
      available: true,
    }).sort({
      category: 1,
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      menuItems,
    });
  } catch (error) {
    console.error("Public restaurant menu API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch restaurant menu.",
      },
      { status: 500 }
    );
  }
}