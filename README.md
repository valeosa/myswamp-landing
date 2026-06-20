mySwamp's landing page.

## Waitlist setup

1. Run `supabase/migrations/202606200001_waitlist_double_opt_in.sql` against the Supabase project.
2. Copy `.env.example` to `.env.local` and configure the Supabase service-role and Resend credentials.

Confirmation links use the landing page's own deployed origin and expire after 24 hours.

Before sending launch emails from `hello@myswamp.space`, configure SPF, DKIM, and DMARC records for the domain.
