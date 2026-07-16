import { NextResponse } from "next/server";
import { getDonations } from "@/lib/notion";

// Revalidate at most every 60 seconds so new Notion entries show up
// without needing a redeploy.
export const revalidate = 60;

export async function GET() {
  try {
    const donations = await getDonations();
    return NextResponse.json({ donations });
  } catch (error: any) {
    console.error("Failed to load donations from Notion:", error);
    return NextResponse.json(
      { error: error?.message ?? "Failed to load donations." },
      { status: 500 }
    );
  }
}
