import { NextResponse } from "next/server";
import type { ChallengeResults } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const results = (await request.json()) as ChallengeResults;

    const webhookUrl = process.env.DETOX_EMAIL_WEBHOOK;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          personal: results.personal,
          grandTotal: results.grandTotal,
          toxicLevelPercent: results.toxicLevelPercent,
          toxicLevelLabel: results.toxicLevelLabel,
          categories: results.categories,
          completedAt: results.completedAt,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit" },
      { status: 500 },
    );
  }
}
