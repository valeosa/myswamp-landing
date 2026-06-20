import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { WAITLIST_CONFIRMATION_TTL_MS } from "@/lib/waitlist";

export const runtime = "nodejs";

function redirect(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token) return redirect(request, "/waitlist-error");

  try {
    const supabase = getSupabaseAdmin();
    const { data: pendingEmail, error: lookupError } = await supabase
      .from("emails")
      .select("confirmation_sent_at")
      .eq("confirmation_token", token)
      .eq("status", "pending")
      .maybeSingle();

    if (lookupError || !pendingEmail?.confirmation_sent_at) {
      return redirect(request, "/waitlist-error");
    }

    const sentAt = new Date(pendingEmail.confirmation_sent_at).getTime();
    if (!Number.isFinite(sentAt) || Date.now() - sentAt > WAITLIST_CONFIRMATION_TTL_MS) {
      return redirect(request, "/waitlist-error");
    }

    const { data: confirmed, error: updateError } = await supabase
      .from("emails")
      .update({
        status: "confirmed",
        confirmed_at: new Date().toISOString(),
        confirmation_token: null,
      })
      .eq("confirmation_token", token)
      .eq("status", "pending")
      .select("email")
      .maybeSingle();

    if (updateError || !confirmed) {
      return redirect(request, "/waitlist-error");
    }

    return redirect(request, "/waitlist-confirmed");
  } catch (error) {
    console.error("Waitlist confirmation failed", error);
    return redirect(request, "/waitlist-error");
  }
}
