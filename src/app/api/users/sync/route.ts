import { syncUser } from "@/lib/sync-user";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await syncUser();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User is not signed in",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User synced successfully",
      user: {
        id: user._id,
        clerkUserId: user.clerkUserId,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("User sync error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to sync user",
      },
      { status: 500 }
    );
  }
}