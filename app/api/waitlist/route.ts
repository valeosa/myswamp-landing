import { randomBytes } from "node:crypto";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import {
  escapePostgrestPattern,
  isValidEmail,
  normalizeEmail,
  sendConfirmationEmail,
} from "@/lib/waitlist";

export const runtime = "nodejs";

const GENERIC_ERROR = { message: "something went swampy. try again." };

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return Response.json({ message: "enter a valid email address." }, { status: 400 });
  }

  const rawEmail =
    typeof body === "object" && body !== null && "email" in body
      ? (body as { email?: unknown }).email
      : undefined;
  const email = typeof rawEmail === "string" ? normalizeEmail(rawEmail) : "";

  if (!isValidEmail(email)) {
    return Response.json({ message: "enter a valid email address." }, { status: 400 });
  }

  try {
    const supabase = getSupabaseAdmin();
    const { data: existing, error: lookupError } = await supabase
      .from("emails")
      .select("email, status")
      .ilike("email", escapePostgrestPattern(email))
      .maybeSingle();

    if (lookupError) throw lookupError;

    if (existing?.status === "confirmed") {
      return Response.json({
        status: "confirmed",
        message: "you're already in the swamp 🐸",
      });
    }

    const confirmationToken = randomBytes(32).toString("hex");
    const confirmationSentAt = new Date().toISOString();

    if (existing) {
      const { error } = await supabase
        .from("emails")
        .update({
          email,
          status: "pending",
          confirmed_at: null,
          confirmation_token: confirmationToken,
          confirmation_sent_at: confirmationSentAt,
        })
        .eq("email", existing.email);

      if (error) throw error;
    } else {
      const { error } = await supabase.from("emails").insert({
        email,
        status: "pending",
        confirmation_token: confirmationToken,
        confirmation_sent_at: confirmationSentAt,
      });

      if (error) throw error;
    }

    await sendConfirmationEmail(
      email,
      confirmationToken,
      new URL(request.url).origin,
    );

    return Response.json({
      status: "pending",
      message: "almost in. check your email to confirm.",
    });
  } catch (error) {
    console.error("Waitlist submission failed", error);
    return Response.json(GENERIC_ERROR, { status: 500 });
  }
}
