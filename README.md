mySwamp's landing page.

## Waitlist setup

1. Run `supabase/migrations/202606200001_waitlist_double_opt_in.sql` against the Supabase project.
2. Copy `.env.example` to `.env.local` and configure the Supabase service-role and Resend credentials.
3. Set `SITE_URL` to the deployed origin. Confirmation links expire after 24 hours.

Before sending launch emails from `hello@myswamp.space`, configure SPF, DKIM, and DMARC records for the domain.
