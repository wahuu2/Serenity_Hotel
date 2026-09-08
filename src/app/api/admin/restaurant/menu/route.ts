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

async function getAdminUser() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  await connectToDatabase();

  const user = await User.findOne({
    clerkUserId: userId,
  });

  if (!user || user.role !== "admin") {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const menuItems = await MenuItem.find().sort({
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      menuItems,
    });
  } catch (error) {
    console.error("Admin menu GET error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch menu items",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const adminUser = await getAdminUser();

    if (!adminUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      name,
      category,
      description,
      price,
      image,
      available,
    } = body;

    if (!name || !category || !description || price === undefined) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Name, category, description and price are required",
        },
        { status: 400 }
      );
    }

    if (!allowedCategories.includes(category)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid menu category",
        },
        { status: 400 }
      );
    }

    if (Number(price) < 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Price cannot be negative",
        },
        { status: 400 }
      );
    }

    const menuItem = await MenuItem.create({
      name,
      category,
      description,
      price: Number(price),
      image: image || "",
      available:
        typeof available === "boolean" ? available : true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Menu item created successfully",
        menuItem,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin menu POST error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create menu item",
      },
      { status: 500 }
    );
  }
}