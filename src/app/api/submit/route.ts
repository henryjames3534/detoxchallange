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
import { env } from "@/lib/env";

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

    const emailStatus = {
      skipped: alreadyEmailed,
      patient: { sent: false, error: null as string | null },
      doctor: { sent: false, error: null as string | null },
    };

    if (!alreadyEmailed) {
      try {
        const thankYou = buildChallengeThankYouEmail(results);
        const patientResult = await sendEmail({
          to: results.personal.email,
          subject: thankYou.subject,
          html: thankYou.html,
          text: thankYou.text,
        });
        emailStatus.patient.sent = true;
        if (patientResult.dev) {
          emailStatus.patient.error = "SMTP not configured (dev mode)";
        }

        const doctorEmail = getDoctorNotificationEmail();
        const doctorNotice = buildDoctorNewAssessmentEmail(results);
        const doctorResult = await sendEmail({
          to: doctorEmail,
          subject: doctorNotice.subject,
          html: doctorNotice.html,
          text: doctorNotice.text,
        });
        emailStatus.doctor.sent = true;
        if (doctorResult.dev) {
          emailStatus.doctor.error = "SMTP not configured (dev mode)";
        }

        if (!patientResult.dev && !doctorResult.dev) {
          await markChallengeEmailsSent(assessment.id);
        }
      } catch (emailError) {
        const message =
          emailError instanceof Error ? emailError.message : String(emailError);
        console.error("Challenge email error:", emailError);
        if (!emailStatus.patient.sent) emailStatus.patient.error = message;
        if (!emailStatus.doctor.sent) emailStatus.doctor.error = message;

        return NextResponse.json(
          {
            success: true,
            duplicate: saved.isDuplicate,
            emails: emailStatus,
            warning: "Assessment saved but one or more emails failed to send",
          },
          { status: 207 },
        );
      }
    }

    const webhookUrl = env("DETOX_EMAIL_WEBHOOK");
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
      emails: emailStatus,
    });
  } catch (error) {
    console.error("Submit error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit" },
      { status: 500 },
    );
  }
}
