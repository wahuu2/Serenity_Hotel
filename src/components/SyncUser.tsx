"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";

export default function SyncUser() {
  const { isSignedIn } = useAuth();

  useEffect(() => {
    if (!isSignedIn) {
      return;
    }

    let cancelled = false;

    async function syncUser() {
      try {
        const response = await fetch("/api/users/sync", {
          method: "POST",
        });

        const data = await response.json();

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          console.error("User sync failed:", data.message);
          return;
        }

        console.log("User sync successful:", data);
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error("User sync error:", error);
      }
    }

    syncUser();

    return () => {
      cancelled = true;
    };
  }, [isSignedIn]);

  return null;
}