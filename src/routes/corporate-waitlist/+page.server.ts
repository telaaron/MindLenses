import { fail } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { createIntakeRequest, sendIntakeEmails } from "$lib/server/intake";

type WaitlistPayload = {
  fullName: string;
  workEmail: string;
  company: string;
  teamSize: string;
  useCase: string;
  firstLensCandidate: string;
  websiteOrLinkedin: string;
};

function readField(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function buildPayload(formData: FormData): WaitlistPayload {
  return {
    fullName: readField(formData, "fullName"),
    workEmail: readField(formData, "workEmail"),
    company: readField(formData, "company"),
    teamSize: readField(formData, "teamSize"),
    useCase: readField(formData, "useCase"),
    firstLensCandidate: readField(formData, "firstLensCandidate"),
    websiteOrLinkedin: readField(formData, "websiteOrLinkedin"),
  };
}

function validatePayload(payload: WaitlistPayload): string | null {
  if (!payload.fullName) return "Please provide your full name.";
  if (!payload.workEmail || !payload.workEmail.includes("@")) {
    return "Please provide a valid work email.";
  }
  if (!payload.company) return "Please provide your company name.";
  if (!payload.teamSize) return "Please select your team size.";
  if (!payload.useCase) return "Please select a use case.";
  if (!payload.firstLensCandidate) {
    return "Please tell us who should become the first internal Lens.";
  }
  return null;
}

export const actions: Actions = {
  join: async ({ request, getClientAddress }) => {
    const formData = await request.formData();
    const payload = buildPayload(formData);
    const validationError = validatePayload(payload);

    if (validationError) {
      return fail(400, {
        success: false,
        message: validationError,
        values: payload,
      });
    }

    let intakeRequest;
    try {
      intakeRequest = await createIntakeRequest({
        type: "corporate",
        requester: {
          name: payload.fullName,
          email: payload.workEmail,
          company: payload.company,
        },
        title: `Corporate waitlist: ${payload.company}`,
        summary: payload.firstLensCandidate,
        details: {
          teamSize: payload.teamSize,
          useCase: payload.useCase,
          firstLensCandidate: payload.firstLensCandidate,
          websiteOrLinkedin: payload.websiteOrLinkedin,
        },
        priority: "high",
      });
    } catch {
      return fail(500, {
        success: false,
        message:
          "Submission could not be stored. Please try again or contact us by email.",
        values: payload,
      });
    }

    try {
      await sendIntakeEmails(intakeRequest);
    } catch {
      // The submission is saved already; keep the UX successful.
    }

    const submissionId = intakeRequest.id;
    const webhookUrl = process.env.CORPORATE_WAITLIST_WEBHOOK_URL;

    if (webhookUrl) {
      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...payload,
            submissionId,
            submittedAt: intakeRequest.createdAt,
            source: "mindlenses-website",
            ip: getClientAddress(),
          }),
        });

        if (!response.ok) {
          console.warn("[corporate-waitlist] webhook returned non-2xx", {
            submissionId,
            status: response.status,
          });
        }
      } catch {
        console.warn("[corporate-waitlist] webhook failed", {
          submissionId,
        });
      }
    }

    console.info("[corporate-waitlist]", {
      submissionId,
      submittedAt: intakeRequest.createdAt,
      source: "mindlenses-website",
      payload,
    });

    return {
      success: true,
      submissionId,
      message:
        "You’re on the list. We’ll reach out with next steps, scope, and beta availability.",
    };
  },
};
