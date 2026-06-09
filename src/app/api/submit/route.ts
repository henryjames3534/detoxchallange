import { NextResponse } from "next/server";
import type { ChallengeResults } from "@/lib/types";
import {
  markChallengeEmailsSent,
  saveAssessmentFromResults,
} from "@/lib/portal-service";
import {
  buildChallengeThankYouEmail,
  buildDoctorNewAssessmentEmail,
} from "@/lib/email-templates";
import { getDoctorNotificationEmail, sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const results = (await request.json()) as ChallengeResults;

    let saved;
    try {
      saved = await saveAssessmentFromResults(results);
    } catch (dbError) {
      console.error("Database save error:", dbError);
      return NextResponse.json(
        { success: false, message: "Failed to save assessment" },
        { status: 500 },
      );
    }

    const assessment = saved.assessment;
    const alreadyEmailed =
      saved.isDuplicate ||
      (assessment.thankYouEmailSentAt != null &&
        assessment.doctorEmailSentAt != null);

    if (!alreadyEmailed) {
      try {
        const thankYou = buildChallengeThankYouEmail(results);
        await sendEmail({
          to: results.personal.email,
          subject: thankYou.subject,
          html: thankYou.html,
          text: thankYou.text,
        });

        const doctorEmail = getDoctorNotificationEmail();
        const doctorNotice = buildDoctorNewAssessmentEmail(results);
        await sendEmail({
          to: doctorEmail,
          subject: doctorNotice.subject,
          html: doctorNotice.html,
          text: doctorNotice.text,
        });

        await markChallengeEmailsSent(assessment.id);
      } catch (emailError) {
        console.error("Challenge email error:", emailError);
      }
    }

    const webhookUrl = process.env.DETOX_EMAIL_WEBHOOK;
    if (webhookUrl && !saved.isDuplicate) {
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

    return NextResponse.json({
      success: true,
      duplicate: saved.isDuplicate || alreadyEmailed,
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit" },
      { status: 500 },
    );
  }
}
