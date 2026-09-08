import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Order from "@/models/order.model";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const adminUser = await User.findOne({
      clerkUserId: userId,
    });

    if (!adminUser || adminUser.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.menuItem", "name category")
      .sort({
        createdAt: -1,
      });

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Admin restaurant orders API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch restaurant orders.",
      },
      { status: 500 }
    );
  }
}