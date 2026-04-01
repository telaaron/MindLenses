import { fail, redirect } from "@sveltejs/kit";
import type { Actions, PageServerLoad } from "./$types";
import { isAdminTokenValid } from "$lib/server/intake";
import { env } from "$env/dynamic/private";

const ADMIN_COOKIE_NAME = "ml_admin_token";

export const prerender = false;

export const load: PageServerLoad = async ({ cookies }) => {
  const configured = Boolean(env.ADMIN_DASHBOARD_TOKEN?.trim());
  const cookieToken = (cookies.get(ADMIN_COOKIE_NAME) || "").trim();

  if (configured && isAdminTokenValid(cookieToken)) {
    redirect(303, "/ops/requests");
  }

  return {
    configured,
  };
};

export const actions: Actions = {
  login: async ({ request, cookies }) => {
    const formData = await request.formData();
    const token = String(formData.get("token") || "").trim();

    if (!isAdminTokenValid(token)) {
      return fail(401, {
        success: false,
        message: "Invalid admin token.",
      });
    }

    cookies.set(ADMIN_COOKIE_NAME, token, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
    });

    redirect(303, "/ops/requests");
  },
};
