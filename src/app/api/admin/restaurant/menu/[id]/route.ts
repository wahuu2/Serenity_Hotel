import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";
import MenuItem from "@/models/menuItem.model";

const allowedCategories = [
  "Breakfast",
  "Lunch",
  "Dinner",
  "Drinks",
  "Desserts",
];

async function checkAdmin() {
  const { userId } = await auth();

  if (!userId) {
    return false;
  }

  await connectToDatabase();

  const user = await User.findOne({
    clerkUserId: userId,
  });

  return !!user && user.role === "admin";
}

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
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

    const allowedFields = [
      "name",
      "category",
      "description",
      "price",
      "image",
      "available",
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates[field] = body[field];
      }
    }

    if (updates.category !== undefined) {
      if (!allowedCategories.includes(String(updates.category))) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid menu category",
          },
          { status: 400 }
        );
      }
    }

    if (
      updates.price !== undefined &&
      Number(updates.price) < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Price cannot be negative",
        },
        { status: 400 }
      );
    }

    if (updates.price !== undefined) {
      updates.price = Number(updates.price);
    }

    const menuItem = await MenuItem.findByIdAndUpdate(
      id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    console.error("Admin menu PATCH error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update menu item",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: RouteContext
) {
  try {
    const isAdmin = await checkAdmin();

    if (!isAdmin) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return NextResponse.json(
        {
          success: false,
          message: "Menu item not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Admin menu DELETE error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete menu item",
      },
      { status: 500 }
    );
  }
}