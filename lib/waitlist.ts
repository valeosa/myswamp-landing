import "server-only";

export const WAITLIST_CONFIRMATION_TTL_MS = 24 * 60 * 60 * 1000;

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export function escapePostgrestPattern(value: string) {
  return value.replace(/[\\%_]/g, "\\$&");
}

export async function sendConfirmationEmail(
  email: string,
  token: string,
  siteUrl: string,
) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.WAITLIST_FROM_EMAIL ?? "mySwamp <hello@myswamp.space>";

  if (!apiKey) {
    throw new Error("Missing RESEND_API_KEY");
  }

  const confirmationUrl = `${siteUrl.replace(/\/$/, "")}/api/confirm-waitlist?token=${encodeURIComponent(token)}`;
  const text = `hey,
confirm your spot on the mySwamp waitlist here:
${confirmationUrl}
the swamp will open soon 🐸`;
  const html = `<p>hey,</p><p>confirm your spot on the mySwamp waitlist here:<br><a href="${confirmationUrl}">confirm your spot</a></p><p>the swamp will open soon 🐸</p>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: "confirm your spot in the swamp",
      text,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email provider returned ${response.status}`);
  }
}
