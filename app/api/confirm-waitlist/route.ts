import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { WAITLIST_CONFIRMATION_TTL_MS } from "@/lib/waitlist";

export const runtime = "nodejs";

function redirect(request: Request, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");

  if (!token || !/^[a-f0-9]{64}$/.test(token)) {
    return redirect(request, "/waitlist-error");
  }

  try {
    const supabase = getSupabaseAdmin();
    const tokenHash = hashToken(token);
    const { data: pendingEmail, error: lookupError } = await supabase
      .from("emails")
      .select("confirmation_sent_at")
      .eq("confirmation_token", token)
      .eq("status", "pending")
      .maybeSingle();

    if (lookupError) {
      return redirect(request, "/waitlist-error");
    }

    if (!pendingEmail?.confirmation_sent_at) {
      const { data: alreadyConfirmed, error: confirmedLookupError } = await supabase
        .from("emails")
        .select("id")
        .eq("confirmation_token_hash", tokenHash)
        .eq("status", "confirmed")
        .maybeSingle();

      return !confirmedLookupError && alreadyConfirmed
        ? redirect(request, "/waitlist-confirmed")
        : redirect(request, "/waitlist-error");
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
        confirmation_token_hash: tokenHash,
      })
      .eq("confirmation_token", token)
      .eq("status", "pending")
      .select("email")
      .maybeSingle();

    if (updateError || !confirmed) {
      const { data: confirmedByAnotherRequest } = await supabase
        .from("emails")
        .select("id")
        .eq("confirmation_token_hash", tokenHash)
        .eq("status", "confirmed")
        .maybeSingle();

      return confirmedByAnotherRequest
        ? redirect(request, "/waitlist-confirmed")
        : redirect(request, "/waitlist-error");
    }

    return redirect(request, "/waitlist-confirmed");
  } catch (error) {
    console.error("Waitlist confirmation failed", error);
    return redirect(request, "/waitlist-error");
  }
}
