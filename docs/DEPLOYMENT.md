# Production Deployment Guide

> For the Anaqio platform monorepo. Covers Vercel, Supabase, Cloudflare DNS + Workers, and Brevo.  
> Last updated: 2026-04-08.

---

## Prerequisites

```bash
# Install CLI tools
bun add -g vercel@latest          # Vercel CLI
npm install -g supabase            # Supabase CLI
```

Accounts needed:

- [Vercel](https://vercel.com) — team: `psycholium`
- [Supabase](https://supabase.com) — project: `afspusrgrqpgxqhqfepy` (platform)
- [Cloudflare](https://dash.cloudflare.com) — zones: `anaqio.com`, `anaqio.studio` (TBD)
- [Brevo](https://app.brevo.com) — for waitlist email automation
- [GitHub](https://github.com/anaqio/platform) — CI token access

---

## 1. Supabase Production Setup

### 1a. Link the CLI to the remote project

```bash
cd supabase/   # always run supabase commands from this dir
supabase login
supabase link --project-ref afspusrgrqpgxqhqfepy
```

### 1b. Expose non-public schemas to PostgREST

> **Must be done once manually** — there is no CLI flag for this.

Dashboard → **Settings → API → Exposed schemas**  
Add: `studio`, `landing` (default list only has `public` and `graphql_public`)

Without this, any app query targeting `studio.*` or `landing.*` returns a `404` from the REST layer.

### 1c. Push migrations

```bash
# Verify what is applied vs pending
supabase migration list

# Push all pending migrations to remote
supabase db push
```

Never edit tables directly in the dashboard. All schema changes go through `supabase/migrations/`.

### 1d. Collect credentials

From **Dashboard → Settings → API**:

| Variable                                       | Where to find it                               |
| ---------------------------------------------- | ---------------------------------------------- |
| `NEXT_PUBLIC_SUPABASE_URL`                     | Project URL (same for all apps)                |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY` | Publishable (anon) key                         |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`         | Same key — studio uses this name               |
| `SUPABASE_SERVICE_ROLE_KEY`                    | Service role key — **never expose to browser** |

### 1e. Enable Realtime for studio

Dashboard → **Database → Replication** → enable for `studio.generations` table.

---

## 2. Vercel Setup

### 2a. Link the monorepo

Run once from the repo root. This creates `.vercel/repo.json` which maps each `applications/` subdirectory to its own Vercel project.

```bash
cd /path/to/com.anaqio
vercel login
vercel link --repo
# Select team: psycholium
# Confirm repo: anaqio/platform
```

> **Do not use `vercel link` (without `--repo`)** — it creates `project.json` which only tracks one project and breaks the multi-app setup.

### 2b. Fix Root Directory per project

> **Must be done once manually** in each project's Vercel dashboard.

Dashboard → **Project → Settings → General → Root Directory**

| Project      | Root Directory              |
| ------------ | --------------------------- |
| studio       | `applications/studio`       |
| landing-page | `applications/landing-page` |
| backoffice   | `applications/backoffice`   |

### 2c. Set environment variables

Use `vercel env` to push variables from the repo root. Run per-project by `cd`-ing into each app directory first.

```bash
# Pull existing remote env to see what's set (creates .env.vercel.local — gitignored)
cd applications/landing-page
vercel env pull

# Add a variable interactively
vercel env add BREVO_API_KEY production

# Add all variables at once from a file
vercel env add < .env.production   # reads key=value lines
```

#### Studio env vars (production)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
HF_SPACE_URL                        # Hugging Face Spaces endpoint
HF_API_TOKEN                        # HF read token
NEXT_PUBLIC_KIOSK_MODE=false
```

#### Landing-page env vars (production)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
SUPABASE_SERVICE_ROLE_KEY           # server actions only
NEXT_PUBLIC_APP_URL=https://anaqio.com
NEXT_PUBLIC_GA_ID                   # Google Analytics measurement ID
BREVO_API_KEY                       # server-only — waitlist automation
BREVO_LIST_ID                       # numeric Brevo list ID
BRAND_ACCESS_PASSWORD               # /brand route protection
```

#### Backoffice env vars (production)

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
SUPABASE_SERVICE_ROLE_KEY
NEXT_PUBLIC_APP_URL=https://backoffice.anaqio.com
```

> `SUPABASE_SERVICE_ROLE_KEY` must be set as **Environment: Production + Preview**, scope **Server** only. Never expose it as a `NEXT_PUBLIC_*` variable.

### 2d. GitHub Actions secrets

In GitHub → **Settings → Secrets → Actions** for `anaqio/platform`:

| Secret        | Value                                                         |
| ------------- | ------------------------------------------------------------- |
| `TURBO_TOKEN` | Vercel Remote Cache token — **Dashboard → Settings → Tokens** |
| `TURBO_TEAM`  | `psycholium`                                                  |

The `ci.yml` and `main.yml` workflows use these to share Turborepo cache across CI runs.

### 2e. Deploy to production

```bash
# Preview deploy (any branch)
cd applications/studio
vercel deploy

# Production deploy (main branch only)
vercel deploy --prod
```

Merges to `main` trigger automatic production deploys via Vercel's GitHub integration — manual `--prod` deploys are only needed to force-promote or test outside CI.

### 2f. Studio: extend function timeout

The AI generation endpoint can run up to 5 minutes. `applications/studio/vercel.json` already sets this:

```json
{
  "functions": {
    "app/api/generate/route.ts": {
      "maxDuration": 300
    }
  }
}
```

Verify it is committed and present after any monorepo restructuring.

---

## 3. Cloudflare DNS

Manage DNS for `anaqio.com` (and any subdomain) from **Cloudflare Dashboard → anaqio.com → DNS → Records**.

### 3a. Root domain (anaqio.com → landing-page)

Add these after Vercel provides the deployment domain (found in **Project → Settings → Domains**):

| Type    | Name  | Value                  | Proxy                 |
| ------- | ----- | ---------------------- | --------------------- |
| `CNAME` | `@`   | `cname.vercel-dns.com` | DNS only (grey cloud) |
| `CNAME` | `www` | `cname.vercel-dns.com` | DNS only (grey cloud) |

> **Proxy off (grey cloud)** for Vercel domains. Cloudflare proxying intercepts HTTPS and breaks Vercel's edge network, certificate issuance, and preview URL protection.

Then add the domain in Vercel:

```bash
cd applications/landing-page
vercel domains add anaqio.com
vercel domains add www.anaqio.com
```

### 3b. Subdomain routing

| Subdomain               | Points to              | Vercel project |
| ----------------------- | ---------------------- | -------------- |
| `studio.anaqio.com`     | `cname.vercel-dns.com` | studio         |
| `backoffice.anaqio.com` | `cname.vercel-dns.com` | backoffice     |

```bash
# Add in Cloudflare DNS (CNAME, proxy OFF)
studio    CNAME  cname.vercel-dns.com
backoffice  CNAME  cname.vercel-dns.com

# Then register in Vercel
cd applications/studio   && vercel domains add studio.anaqio.com
cd applications/backoffice && vercel domains add backoffice.anaqio.com
```

### 3c. Email DNS records (Brevo)

Brevo requires SPF, DKIM, and DMARC records to pass spam filters. Add these in Cloudflare DNS:

| Type    | Name              | Value                                                 | Notes                          |
| ------- | ----------------- | ----------------------------------------------------- | ------------------------------ |
| `TXT`   | `@`               | `v=spf1 include:spf.brevo.com mx ~all`                | SPF — authorizes Brevo to send |
| `TXT`   | `mail._domainkey` | _(from Brevo dashboard)_                              | DKIM public key                |
| `TXT`   | `_dmarc`          | `v=DMARC1; p=quarantine; rua=mailto:dmarc@anaqio.com` | DMARC policy                   |
| `CNAME` | `link`            | `alias.brevo.com`                                     | Click tracking                 |
| `CNAME` | `img`             | `alias.brevo.com`                                     | Open tracking pixel            |

> Get the exact DKIM value from **Brevo → Senders & IPs → Domains → anaqio.com → Authenticate**.

### 3d. Security headers (Cloudflare-level)

In Cloudflare **Security → Settings**:

- **SSL/TLS mode**: Full (strict)
- **Always Use HTTPS**: On
- **HSTS**: Enable (max-age 6 months, include subdomains)
- **Bot Fight Mode**: On (free tier) or Super Bot Fight Mode (Pro+)

---

## 4. Cloudflare Workers (optional — email routing)

Use Cloudflare Email Routing + a Worker to forward `hello@anaqio.com` to personal inboxes without exposing them.

### 4a. Enable Email Routing

Cloudflare Dashboard → **anaqio.com → Email → Email Routing → Enable**

Cloudflare auto-adds the required MX records. Do not add them manually.

### 4b. Create a catch-all routing rule

Dashboard → **Email → Email Routing → Routing Rules → Catch-all**  
Action: **Send to an email** → `moughamir@example.com`, `amal@example.com`

### 4c. Deploy a filtering Worker (optional)

For advanced routing (e.g., forward `support@` to a ticketing system, `hello@` to founders):

```bash
# Install Wrangler
bun add -g wrangler
wrangler login

# Create worker
mkdir cloudflare-workers && cd cloudflare-workers
wrangler init email-router --no-bundle
```

`wrangler.toml`:

```toml
name = "anaqio-email-router"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[triggers]
crons = []  # email workers are not cron-triggered — they're bound via Email Routing rules
```

`src/index.ts`:

```ts
export default {
  async email(message: ForwardableEmailMessage, env: Env) {
    const to = message.to.toLowerCase()

    if (to.startsWith('support@')) {
      await message.forward('support-inbox@yourdomain.com')
    } else if (to.startsWith('hello@') || to.startsWith('contact@')) {
      await message.forward('moughamir@yourdomain.com')
      await message.forward('amal@yourdomain.com')
    } else {
      // Drop unmatched
      message.setReject('No such recipient')
    }
  },
} satisfies ExportedHandler<Env>
```

```bash
wrangler deploy
```

Then in Cloudflare Email Routing → Routing Rules: add a catch-all rule → **Action: Send to Worker** → select `anaqio-email-router`.

---

## 5. Brevo — Waitlist Email Automation

Brevo handles transactional emails and marketing automation for the landing-page waitlist flow.

### 5a. API key

Brevo Dashboard → **SMTP & API → API Keys → Create API key**  
Name it `anaqio-landing-production`. Copy the key and set it in Vercel:

```bash
cd applications/landing-page
vercel env add BREVO_API_KEY production
```

### 5b. Contacts list

Dashboard → **Contacts → Lists → Create a list** named `Anaqio Waitlist`.  
Note the numeric list ID (e.g., `12`) and set `BREVO_LIST_ID=12` in Vercel.

The landing-page server action (`lib/actions/waitlist.ts`) calls the Brevo API using these two vars to add signups to the list automatically.

### 5c. Sender domain verification

Dashboard → **Senders & IPs → Domains → Add a domain** → enter `anaqio.com`  
Follow the DKIM/SPF instructions (same records as §3c above).

Verify with **Authenticate** after DNS propagates (can take up to 24h).

### 5d. Transactional email template

Dashboard → **Email Templates → New Template**  
Create a "Waitlist Confirmation" template. Note the numeric template ID and pass it as `templateId` in Brevo API calls from the server action.

### 5e. Automation flow (optional)

Dashboard → **Automation → New Workflow**  
Trigger: **Contact added to list** (Anaqio Waitlist)  
Step 1: Wait 0 min → Send "Waitlist Confirmation" email  
Step 2: Wait 7 days → Send "We're building for you" follow-up

---

## 6. Post-Launch Checklist

### DNS propagation

```bash
# Verify A/CNAME resolution
dig anaqio.com +short
dig studio.anaqio.com +short
dig backoffice.anaqio.com +short

# Verify email records
dig TXT anaqio.com +short        # should show SPF
dig TXT mail._domainkey.anaqio.com +short  # DKIM
dig TXT _dmarc.anaqio.com +short  # DMARC
```

### Vercel domain status

```bash
vercel domains ls           # list all registered domains
vercel domains inspect anaqio.com  # show DNS + cert status
```

All domains should show `✓ Valid` with an auto-provisioned TLS certificate.

### Supabase

```bash
supabase migration list     # all migrations should show "applied"
```

In Dashboard → **Settings → API → Exposed schemas**: confirm `studio` and `landing` are listed.

### Brevo

Send a test signup through the landing page form. Verify:

1. Contact appears in the Brevo list
2. Confirmation email lands in inbox (not spam)
3. DMARC/DKIM pass — check email headers for `dkim=pass`

### Environment variables

```bash
# Verify each app's env is complete
cd applications/studio      && vercel env pull && cat .env.vercel.local
cd applications/landing-page && vercel env pull && cat .env.vercel.local
cd applications/backoffice   && vercel env pull && cat .env.vercel.local
```

No variable should be empty. Clean up the pulled files after:

```bash
rm applications/**/.env.vercel.local
```

### End-to-end smoke test

- `https://anaqio.com` — landing page loads, language switcher works
- `https://anaqio.com/api/health` (if implemented) — 200
- `https://studio.anaqio.com` — studio loads, Supabase auth works
- `https://backoffice.anaqio.com` — dashboard loads, waitlist data visible
- Submit waitlist form → contact appears in Brevo → confirmation email received

---

## Troubleshooting

| Symptom                                                     | Likely cause                                                          | Fix                                            |
| ----------------------------------------------------------- | --------------------------------------------------------------------- | ---------------------------------------------- |
| Vercel deploy uses wrong root directory                     | Root Directory not updated in project settings                        | §2b                                            |
| `404` on Supabase queries from landing or studio            | `studio`/`landing` schemas not exposed to PostgREST                   | §1b                                            |
| Supabase queries return no data (backoffice)                | Wrong client for schema (e.g., using `admin.ts` to query `landing.*`) | Use `landing.ts` client                        |
| Vercel build fails in CI but passes locally                 | `TURBO_TOKEN` / `TURBO_TEAM` secrets missing in GitHub                | §2d                                            |
| Email landing in spam                                       | SPF/DKIM/DMARC not set or not propagated                              | §3c, §5c                                       |
| Cloudflare breaks Vercel cert                               | Cloudflare proxy (orange cloud) enabled on Vercel CNAME               | Set proxy to DNS only (grey cloud) — §3a       |
| `vercel link` created `project.json` instead of `repo.json` | Ran `vercel link` without `--repo` in a monorepo                      | Delete `.vercel/`, re-run `vercel link --repo` |
| Worker email routing not firing                             | Worker not set as catch-all action in Email Routing rules             | §4c                                            |
