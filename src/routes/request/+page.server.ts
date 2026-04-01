import { fail, redirect } from "@sveltejs/kit";
import type { Actions } from "./$types";
import { createIntakeRequest, sendIntakeEmails } from "$lib/server/intake";

type IntakePayload = {
  personaName: string;
  whyThisPersona: string;
  sourceMaterials: string;
  focusAreas: string;
  packageType: "mindcore" | "mindcore_mindbank";
  fullName: string;
  email: string;
  company: string;
};

function readField(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function buildPayload(formData: FormData): IntakePayload {
  const packageType = readField(formData, "packageType");

  return {
    personaName: readField(formData, "personaName"),
    whyThisPersona: readField(formData, "whyThisPersona"),
    sourceMaterials: readField(formData, "sourceMaterials"),
    focusAreas: readField(formData, "focusAreas"),
    packageType:
      packageType === "mindcore_mindbank" ? "mindcore_mindbank" : "mindcore",
    fullName: readField(formData, "fullName"),
    email: readField(formData, "email"),
    company: readField(formData, "company"),
  };
}

function validatePayload(payload: IntakePayload): string | null {
  if (!payload.personaName) return "Please add the persona you want.";
  if (!payload.whyThisPersona) return "Please add why this persona is needed now.";
  if (!payload.sourceMaterials) return "Please add at least one source or material.";
  if (!payload.focusAreas) return "Please define the focus for this lens.";
  if (!payload.fullName) return "Please add your full name.";
  if (!payload.email || !payload.email.includes("@")) {
    return "Please provide a valid email address.";
  }
  return null;
}

function formatPackageName(pkg: IntakePayload["packageType"]): string {
  return pkg === "mindcore_mindbank" ? "MindCore + MindBank" : "MindCore";
}

export const actions: Actions = {
  default: async ({ request }) => {
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

    const packageName = formatPackageName(payload.packageType);

    let intakeRequest;
    try {
      intakeRequest = await createIntakeRequest({
        type: "express",
        requester: {
          name: payload.fullName,
          email: payload.email,
          company: payload.company,
        },
        title: `${payload.personaName} (${packageName})`,
        summary: payload.whyThisPersona,
        details: {
          persona: payload.personaName,
          package: packageName,
          whyNow: payload.whyThisPersona,
          sourceMaterials: payload.sourceMaterials,
          focusAreas: payload.focusAreas,
        },
      });
    } catch {
      return fail(500, {
        success: false,
        message: "Could not save your request. Please try again.",
        values: payload,
      });
    }

    try {
      await sendIntakeEmails(intakeRequest);
    } catch {
      // Request is already persisted. Do not block the flow on transient mail errors.
    }

    redirect(303, `/request/confirm?id=${intakeRequest.id}`);
  },
};
