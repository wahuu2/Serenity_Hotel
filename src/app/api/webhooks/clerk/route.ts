import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/user.model";

type ClerkWebhookEvent = {
  type: string;
  data: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email_addresses: {
      email_address: string;
    }[];
  };
};

export async function POST(request: Request) {
  try {
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new Error("CLERK_WEBHOOK_SECRET is not defined");
    }

    const headerPayload = await headers();

    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing webhook headers",
        },
        { status: 400 }
      );
    }

    const payload = await request.text();

    const wh = new Webhook(webhookSecret);

    const event = wh.verify(payload, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as ClerkWebhookEvent;

    if (event.type === "user.created") {
      await connectToDatabase();

      const {
        id,
        first_name,
        last_name,
        email_addresses,
      } = event.data;

      const email = email_addresses[0]?.email_address;

      const name =
        [first_name, last_name].filter(Boolean).join(" ") ||
        "Guest User";

      if (!email) {
        return NextResponse.json(
          {
            success: false,
            message: "User email not found",
          },
          { status: 400 }
        );
      }

      await User.findOneAndUpdate(
        { clerkUserId: id },
        {
          clerkUserId: id,
          name,
          email,
        },
        {
          upsert: true,
          new: true,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Webhook processed successfully",
    });
  } catch (error) {
    console.error("Clerk webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Webhook processing failed",
      },
      { status: 500 }
    );
  }
}