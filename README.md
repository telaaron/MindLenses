# MindLenses Website (SvelteKit)

Marketing site + intake flows for MindLenses.

## Local development

```sh
pnpm install
pnpm dev --host
```

## Build

```sh
pnpm build
pnpm preview
```

## Intake and Email Environment

Set these variables for form operations:

```env
RESEND_API_KEY=...
RESEND_FROM_EMAIL="MindLenses <noreply@mindlenses.app>"
REQUEST_INTAKE_TO_EMAIL=aaron@must-seen.com
ADMIN_DASHBOARD_TOKEN=choose-a-long-random-secret
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_INTAKE_TABLE=intake_requests
```

Behavior:

- `RESEND_API_KEY` + `RESEND_FROM_EMAIL` enable email sending.
- Every intake sends one internal email and one confirmation email to requester.
- If `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set, intake requests are stored in Supabase.
- If Supabase env is missing, storage falls back to `website/.data/intake-requests.json`.

## Supabase Setup

1. Open one of your existing Supabase projects.
2. In SQL Editor, run: `supabase/intake_requests.sql`.
3. Copy the project URL and service role key:
	- Settings -> API -> Project URL
	- Settings -> API -> service_role key
4. Put both values into `.env`.
5. Restart dev server.

After restart, all new intake writes/reads/updates use Supabase automatically.

## Internal Ops Queue

Routes:

- `/admin` (login)
- `/ops/requests` (queue after login)

The queue supports:

- Unified view for Express and Corporate requests
- Status updates (`new`, `approved`, `in_progress`, `waiting_customer`, `completed`, `rejected`)
- Payment state tracking (`pending_after_approval`, `link_sent`, `paid`)
- Manual payment link field and notes
