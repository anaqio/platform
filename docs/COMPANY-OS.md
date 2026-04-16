# Anaqio — Company Operating System

> Living document. Review quarterly. Last updated: 2026-03-24.

---

## 1. Vision / Traction Organizer (V/TO)

### Core Values

1. **Sovereignty** — Build Moroccan AI infrastructure, not dependency on foreign platforms
2. **Craft over speed** — Ship polished, brand-consistent experiences (navy, gold, Syne — never compromised)
3. **Radical simplicity** — 4-tap flows, no feature creep, refuse what's out of scope
4. **Builder honesty** — Bad news early with a plan; blameless postmortems

### Core Focus

- **Purpose:** Democratize professional fashion imagery for Moroccan brands
- **Niche:** AI-powered virtual try-on and studio photography for fashion commerce

### 10-Year Target (BHAG)

> Anaqio is the default visual commerce platform across MENA — every fashion brand generates studio-quality imagery through Anaqio before listing a product.

### Marketing Strategy

- **Target market:** Moroccan fashion brands (kaftan, jellaba, contemporary) spending 5,000–20,000 MAD/collection on photoshoots
- **3 Uniques:** (1) AI virtual try-on with preset models, (2) 90% cost reduction vs traditional studio, (3) Moroccan-first (Darija community, MAD pricing, local aesthetic)
- **Proven process:** Upload garment → Select preset model → Generate → Download (4 taps)
- **Guarantee:** Studio-quality output or iterate free (within generation credits)

### 3-Year Picture (2029)

| Measurable          | Target                     |
| ------------------- | -------------------------- |
| ARR                 | 2M MAD                     |
| Active brands       | 200+                       |
| Monthly generations | 50,000+                    |
| Team size           | 8–12                       |
| Markets             | Morocco + 2 MENA countries |

### 1-Year Plan (2026–2027)

| #   | Goal                                                           | Owner     | Deadline     |
| --- | -------------------------------------------------------------- | --------- | ------------ |
| 1   | Launch MVP at expo — validate demand with 50+ live generations | Amal      | Mar 28, 2026 |
| 2   | Convert 20 waitlist signups to paying beta users               | Amal      | Jun 2026     |
| 3   | Add batch generation + lookbook export                         | Moughamir | Q3 2026      |
| 4   | Integrate billing (Stripe or local payment)                    | Moughamir | Q3 2026      |
| 5   | Reach 500 waitlist signups                                     | Amal      | Dec 2026     |

---

## 2. Current Quarter Rocks (Q1 2026 — ends Mar 31)

| #   | Rock                                                          | Owner     | Status | Due    | Jira                                                                       |
| --- | ------------------------------------------------------------- | --------- | ------ | ------ | -------------------------------------------------------------------------- |
| 1   | Studio MVP feature-complete (upload → generate → download)    | Moughamir | 🟢     | Mar 28 | [SCRUM-96](https://omnizya.atlassian.net/browse/SCRUM-96) (Epic: SCRUM-73) |
| 2   | Landing page live at anaqio.com with waitlist capture + Brevo | Moughamir | 🟢     | Mar 28 | [SCRUM-87](https://omnizya.atlassian.net/browse/SCRUM-87) ✅ Done          |
| 3   | Expo kiosk mode working at 1920×1080 landscape                | Moughamir | 🟡     | Mar 28 | [SCRUM-95](https://omnizya.atlassian.net/browse/SCRUM-95) (Epic: SCRUM-73) |
| 4   | 100 waitlist signups pre-expo                                 | Amal      | 🟡     | Mar 28 | [SCRUM-97](https://omnizya.atlassian.net/browse/SCRUM-97) (Epic: SCRUM-76) |
| 5   | Brand assets finalized (logo, business cards, pitch deck)     | Amal      | 🟢     | Mar 28 | [SCRUM-98](https://omnizya.atlassian.net/browse/SCRUM-98)                  |

> Rock completion target: 80%+. If off-track by week 10 (now), escalate to IDS immediately.

---

## 3. Scorecard (Weekly Measurables)

| #   | Metric                                   | Owner     | Goal     | Type    |
| --- | ---------------------------------------- | --------- | -------- | ------- |
| 1   | New waitlist signups (weekly)            | Amal      | ≥ 10     | Leading |
| 2   | Successful generations (studio MVP test) | Moughamir | ≥ 5/week | Leading |
| 3   | Open bugs (P0/P1)                        | Moughamir | ≤ 2      | Health  |
| 4   | HF Spaces inference success rate         | Moughamir | ≥ 90%    | Health  |
| 5   | Landing page Lighthouse mobile score     | Moughamir | ≥ 85     | Health  |

> Review every Monday. Only discuss off-track (red) numbers.

---

## 4. Accountability Chart

At 2-person stage, each founder wears multiple hats. Define the seats now so handoff is clean when hiring.

```
┌─────────────────────────────────────┐
│          VISIONARY (Amal)           │
│  Strategy · Brand · Partnerships    │
│  Fundraising · Market positioning   │
└──────────────┬──────────────────────┘
               │
┌──────────────┴──────────────────────┐
│        INTEGRATOR (Moughamir)       │
│  Technical execution · Architecture │
│  Shipping · Ops · Hiring (future)   │
└──────────────┬──────────────────────┘
               │
    ┌──────────┼──────────┐
    │          │          │
 Product    Growth    Finance
 (Moug)    (Amal)    (Amal)
```

**GWC check per seat:** Before hiring, confirm the candidate Gets it (understands the role), Wants it (motivated), has Capacity to do it (skills + bandwidth).

---

## 5. L10 Meeting Format (Weekly, 60 min — 2-person adapted)

| Block     | Duration | Content                                              |
| --------- | -------- | ---------------------------------------------------- |
| Check-in  | 5 min    | Best professional/personal win this week             |
| Scorecard | 5 min    | Review 5 metrics — only discuss red                  |
| Rocks     | 5 min    | On-track / off-track per Rock                        |
| Headlines | 5 min    | Customer feedback, waitlist signals, partner updates |
| IDS       | 35 min   | Identify → Discuss → Solve top 3 issues              |
| To-Dos    | 5 min    | Assign 7-day action items (90%+ completion target)   |

> Same day/time every week. No rescheduling. No skipping.

---

## 6. Architecture Decision Records (ADRs)

Document every significant technical decision. Store in `docs/adrs/`.

**Template:**

```markdown
# ADR-NNN: Title

**Status:** Proposed | Accepted | Deprecated
**Date:** YYYY-MM-DD
**Decision-maker:** Name

## Context

What is the issue? Why does this decision need to be made now?

## Decision

What was decided.

## Consequences

What becomes easier. What becomes harder. What are the risks.
```

**Key ADRs to document retroactively:**

| #   | Decision                                    | Rationale                                                         |
| --- | ------------------------------------------- | ----------------------------------------------------------------- |
| 001 | HF Spaces over fal.ai for inference         | No payment method yet; free tier sufficient for demo              |
| 002 | Supabase over Firebase                      | SSR cookie auth, Postgres, Realtime, Moroccan data residency path |
| 003 | Next.js 16 + Turbopack                      | React Compiler, async APIs, production-ready bundler              |
| 004 | Tailwind v4 CSS-first (no config file)      | Simpler, faster, brand tokens via @theme in globals.css           |
| 005 | Zustand over Redux/Context for studio state | Minimal boilerplate, works outside React tree, tiny bundle        |

---

## 7. Build vs Buy Decisions

| Function         | Decision                              | Reasoning                                         |
| ---------------- | ------------------------------------- | ------------------------------------------------- |
| Auth             | **Buy** (Supabase Auth)               | Commodity; email + OAuth out of the box           |
| Database         | **Buy** (Supabase Postgres)           | Managed, Realtime, Storage included               |
| Inference        | **Build** (multi-provider router)     | Core differentiator; control over model selection |
| Payments         | **Buy** (Stripe or CMI, deferred)     | Commodity; integrate when monetizing              |
| Email automation | **Buy** (Brevo)                       | Waitlist sequences, not core                      |
| Hosting          | **Buy** (Vercel)                      | Zero-config Next.js deploys, edge network         |
| Video generation | **Build** (Remotion)                  | Brand-specific compositions, competitive moat     |
| Design system    | **Build** (shadcn/ui + custom tokens) | Brand expression layer is core                    |

> **Rule:** Only build what's core competitive advantage. Review quarterly.

---

## 8. Tech Debt Budget

- **20% of weekly dev time** allocated to maintenance, refactoring, dependency updates
- **Boy Scout Rule:** Leave code better than you found it
- **Categorize before fixing:**
  - _Deliberate-prudent:_ "We know this shortcut; we'll fix post-expo" — track in issues
  - _Reckless:_ Fix immediately (security, data integrity)
- Current known debt:
  - [ ] `db:types` script has placeholder `<ref>` for project-id
  - [ ] `ai-studio-base/` is an untracked prototype — decide: integrate or archive
  - [ ] 8 duplicate Jira issues marked `[DUPLICATE]` — can be transitioned to Done or deleted (SCRUM-10, 12, 13, 14, 15, 16, 34, 47)
  - [ ] "omnizya" Jira account used as assignee on 12+ issues — should resolve to Moughamir or Amal
  - [ ] 45 standalone issues not linked to any epic — triage and assign to epics or archive

---

## 9. Quarterly Pulsing Cadence

| When                  | What                       | Output                                       |
| --------------------- | -------------------------- | -------------------------------------------- |
| **Week 1 of quarter** | Rock-setting session (2h)  | 3–7 Rocks per person, SMART format           |
| **Weekly**            | L10 meeting (60 min)       | IDS resolutions + 7-day to-dos               |
| **Week 7**            | Mid-quarter check          | Escalate off-track Rocks                     |
| **Last week**         | Quarter review (2h)        | Rock completion %, next quarter Rocks        |
| **Annually (Jan)**    | V/TO refresh + 1-year plan | Updated vision, 3-year picture, annual goals |

---

## 10. Decision-Making Framework

| Decision Type          | Who Decides (DRI) | Examples                                 |
| ---------------------- | ----------------- | ---------------------------------------- |
| Brand & positioning    | Amal              | Colors, copy tone, pricing, partnerships |
| Technical architecture | Moughamir         | Stack choices, infrastructure, ADRs      |
| Feature scope (in/out) | Both (consensus)  | What ships in MVP vs deferred            |
| Hiring                 | Both (consensus)  | GWC evaluation, culture fit              |
| Spend > 1000 MAD       | Both (consensus)  | SaaS subscriptions, contractor payments  |

> **Default:** The person closest to the problem decides. Escalate only when reversibility is low.
