import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import MenuItem from "@/models/menuItem.model";
import Order from "@/models/order.model";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You must be signed in to place an order.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
    } = body;

    if (
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide customer details and at least one item.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const user = await User.findOne({
      clerkUserId: userId,
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Fetch the actual menu items from MongoDB.
     * We do not trust prices sent from the browser.
     */
    const menuItemIds = items.map((item) => item.menuItem);

    const menuItems = await MenuItem.find({
      _id: { $in: menuItemIds },
      available: true,
    });

    if (menuItems.length !== items.length) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more selected menu items are unavailable.",
        },
        { status: 400 }
      );
    }

    const orderItems = [];
    let totalAmount = 0;

    for (const item of items) {
      const menuItem = menuItems.find(
        (menu) => menu._id.toString() === item.menuItem
      );

      if (!menuItem) {
        return NextResponse.json(
          {
            success: false,
            message: "A selected menu item could not be found.",
          },
          { status: 400 }
        );
      }

      const quantity = Number(item.quantity);

      if (!Number.isInteger(quantity) || quantity < 1) {
        return NextResponse.json(
          {
            success: false,
            message: "Each item must have a valid quantity.",
          },
          { status: 400 }
        );
      }

      const subtotal = menuItem.price * quantity;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity,
        subtotal,
      });

      totalAmount += subtotal;
    }

    const orderReference = `ORD-${Date.now()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const order = await Order.create({
      user: user._id,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim().toLowerCase(),
      customerPhone: customerPhone.trim(),
      items: orderItems,
      totalAmount,
      status: "pending",
      orderReference,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Restaurant order placed successfully.",
        order: {
          id: order._id,
          orderReference: order.orderReference,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          items: order.items,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Restaurant order API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to place restaurant order.",
      },
      { status: 500 }
    );
  }
}