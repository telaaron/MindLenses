import { fail } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { env } from "$env/dynamic/private";
import {
  INTAKE_STATUSES,
  PAYMENT_STATES,
  isAdminTokenValid,
  listIntakeRequests,
  updateIntakeRequest,
} from "$lib/server/intake";

export const prerender = false;
const ADMIN_COOKIE_NAME = "ml_admin_token";

function getToken(url: URL): string {
  return (url.searchParams.get("token") || "").trim();
}

function resolveAdminToken(url: URL, cookieToken: string | undefined): string {
  const queryToken = getToken(url);
  if (queryToken) return queryToken;
  return (cookieToken || "").trim();
}

function isStatus(value: string): value is (typeof INTAKE_STATUSES)[number] {
  return INTAKE_STATUSES.includes(value as (typeof INTAKE_STATUSES)[number]);
}

function isPaymentState(value: string): value is (typeof PAYMENT_STATES)[number] {
  return PAYMENT_STATES.includes(value as (typeof PAYMENT_STATES)[number]);
}

function summarize(requests: Awaited<ReturnType<typeof listIntakeRequests>>) {
  const now = Date.now();

  const total = requests.length;
  const open = requests.filter((request) =>
    ["new", "approved", "in_progress", "waiting_customer"].includes(request.status),
  ).length;
  const overdue = requests.filter(
    (request) => request.status !== "completed" && request.status !== "rejected" && Date.parse(request.slaDueAt) < now,
  ).length;

  return { total, open, overdue };
}

export const load: PageServerLoad = async ({ url, cookies }) => {
  const token = resolveAdminToken(url, cookies.get(ADMIN_COOKIE_NAME));
  const configured = Boolean(env.ADMIN_DASHBOARD_TOKEN?.trim());
  const authorized = isAdminTokenValid(token);

  if (!configured) {
    return {
      configured,
      authorized: false,
      reason: "ADMIN_DASHBOARD_TOKEN is missing.",
      token,
      requests: [],
      stats: { total: 0, open: 0, overdue: 0 },
      statuses: INTAKE_STATUSES,
      paymentStates: PAYMENT_STATES,
    };
  }

  if (!authorized) {
    return {
      configured,
      authorized: false,
      reason: "Invalid or missing token.",
      token,
      requests: [],
      stats: { total: 0, open: 0, overdue: 0 },
      statuses: INTAKE_STATUSES,
      paymentStates: PAYMENT_STATES,
    };
  }

  const requests = await listIntakeRequests();

  return {
    configured,
    authorized: true,
    reason: "",
    token,
    requests,
    stats: summarize(requests),
    statuses: INTAKE_STATUSES,
    paymentStates: PAYMENT_STATES,
  };
};

export const actions: Actions = {
  update: async ({ request, cookies }) => {
    const formData = await request.formData();

    const tokenFromForm = String(formData.get("token") || "").trim();
    const token = tokenFromForm || (cookies.get(ADMIN_COOKIE_NAME) || "").trim();
    const id = String(formData.get("id") || "").trim();
    const status = String(formData.get("status") || "").trim();
    const paymentState = String(formData.get("paymentState") || "").trim();
    const paymentLink = String(formData.get("paymentLink") || "").trim();
    const notes = String(formData.get("notes") || "").trim();

    if (!isAdminTokenValid(token)) {
      return fail(401, {
        success: false,
        message: "Unauthorized.",
      });
    }

    if (!id) {
      return fail(400, {
        success: false,
        message: "Missing request id.",
      });
    }

    if (!isStatus(status)) {
      return fail(400, {
        success: false,
        message: "Invalid status.",
      });
    }

    if (!isPaymentState(paymentState)) {
      return fail(400, {
        success: false,
        message: "Invalid payment state.",
      });
    }

    const updated = await updateIntakeRequest({
      id,
      status,
      paymentState,
      paymentLink: paymentLink || null,
      notes,
    });

    if (!updated) {
      return fail(404, {
        success: false,
        message: "Request not found.",
      });
    }

    return {
      success: true,
      id,
      message: `Saved ${id}.`,
    };
  },
  logout: async ({ cookies }) => {
    cookies.delete(ADMIN_COOKIE_NAME, {
      path: "/",
    });

    return {
      success: true,
      message: "Logged out.",
    };
  },
};
