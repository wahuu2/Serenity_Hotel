import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import Order from "@/models/order.model";

const allowedStatuses = [
  "pending",
  "confirmed",
  "preparing",
  "ready",
  "completed",
  "cancelled",
];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    const body = await request.json();

    const { status } = body;

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order status.",
        },
        { status: 400 }
      );
    }

    const order = await Order.findById(id);

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          message: "Restaurant order not found.",
        },
        { status: 404 }
      );
    }

    if (
      order.status === "cancelled" ||
      order.status === "completed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `A ${order.status} order cannot be changed.`,
        },
        { status: 400 }
      );
    }

    order.status = status;

    await order.save();

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error(
      "Admin restaurant order status API error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update restaurant order status.",
      },
      { status: 500 }
    );
  }
}