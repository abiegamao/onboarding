# MINESHA Onboarding Platform — Developer Reference

## What This Is

Peace-driven leadership coaching platform. Guides clients through a proprietary 4-phase transformation pathway called "The Peace-Driven Leader™" — from burnout to breakthrough via Mind, Body, and Divine Identity work.

**Primary flows:**
1. Public visitor → signup → plan selection → pending approval → active dashboard → 4-phase onboarding journey
2. Admin monitors clients, manages subscriptions, tracks progress

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router), React 19, TypeScript 5 strict |
| Styling | Tailwind CSS 4, Radix UI, Base UI, shadcn/ui |
| Database | MongoDB Atlas via Mongoose 9 |
| Cache | Upstash Redis (REST client) |
| Auth | JWT via `jose`, bcryptjs (12 rounds), HTTP-only cookies |
| Payments | Stripe (checkout links only — webhooks NOT implemented yet) |
| Email | Resend (API key configured, no sending logic yet) |
| Animations | Lottie React, canvas-confetti |
| Charts | Recharts |
| Toasts | Sonner |

---

## Environment Variables

```env
# Required
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<random-long-string>

# Upstash Redis
UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=...

# Stripe checkout links (public)
NEXT_PUBLIC_STRIPE_BASIC_URL=https://buy.stripe.com/...
NEXT_PUBLIC_STRIPE_INTERMEDIATE_URL=https://buy.stripe.com/...

# Email (configured, not yet used)
RESEND_API_KEY=re_...
```

> **WARNING:** `JWT_SECRET` has a hardcoded fallback (`"peace-driven-default-secret-key"`). Always override in production or accounts can be forged.

---

## Routes & Access Control

### Public
| Route | Purpose |
|-------|---------|
| `/` | Landing/marketing page |
| `/signup` | 3-step registration |
| `/login` | Email/password login |

### Authenticated — all roles
| Route | Purpose |
|-------|---------|
| `/plans` | Plan selection (unsubscribed users) |
| `/pending` | Wait page after plan selection (pending status) |
| `/success` | Welcome celebration (active, first-time only) |
| `/dashboard` | Main hub — phase progress, roadmap |

### Admin only
| Route | Purpose |
|-------|---------|
| `/admin` | Stats dashboard + charts |
| `/admin/clients` | Client list with filters |
| `/admin/subscriptions` | Subscription management |
| `/admin/settings` | Admin profile/password |

### API Routes
```
POST /api/auth/signup         - create account
POST /api/auth/login          - authenticate, set cookie
GET  /api/auth/logout         - clear cookie
GET  /api/auth/me             - current user profile

POST /api/user/select-plan    - select plan → status = pending

GET|PATCH /api/onboarding/progress - fetch/update phase progress
POST /api/onboarding/complete-celebration - mark welcome seen

GET /api/admin/stats          - aggregate dashboard stats
GET /api/admin/clients        - paginated client list
GET /api/admin/subscriptions  - subscription data
GET /api/admin/members        - team management

GET /api/location/countries   - searchable country list
GET /api/location/cities      - cities by country code
GET /api/location/validate-city-country

GET|PATCH /api/settings/profile
PATCH     /api/settings/password
GET|PATCH /api/admin/settings/profile
PATCH     /api/admin/settings/password
```

---

## Auth System

JWT in HTTP-only cookie `auth_token` (7-day expiry).

```typescript
// JWT payload
{ userId: string, email: string, role: "admin" | "client" }
```

**Guards:**
- `lib/auth.ts` → `requireAuth()` — verify token, return userId
- `lib/adminAuth.ts` → `requireAdmin()` — verify token + check role === "admin"

Call these at the top of every protected API route.

---

## Data Models

### User
```typescript
{
  email, password (hashed),
  firstName, lastName,
  addressLine1, addressLine2?,
  city, stateProvince, zipCode, countryRegion,
  phoneNumber,
  role: "admin" | "client",          // default: "client"
  accountStatus: "unsubscribed" | "pending" | "active",
  plan: "basic" | "intermediate" | "custom" | null,
  createdAt, updatedAt
}
```

### OnboardingProfile
Tracks the 4-phase journey. Nested document per user.

```typescript
{
  userId,
  currentPhase: 1–4,
  currentStep: "1A"–"4C",   // 17 total steps
  isCompleted: boolean,
  hasSeenCelebration: boolean,

  // Phase 1 — Connection
  snapshot, gettingToKnowYou (13 fields), triage (9 domains × 5 Qs), orientation,

  // Phase 2 — Awareness
  evaluations360, growthInputs, eveningPulse, rhythmSnapshot, bossIndex, homeAudit,

  // Phase 3 — Stabilization
  visionActivation, visionStatements, idealDayNarrative, wordOfYear, familyMission,

  // Phase 4 — Activation
  kickstartCallBooked, telegramJoined, wealthStrategyComplete
}
```

---

## User Status Lifecycle

```
unsubscribed → (select plan) → pending → (admin approves) → active
```

Currently **manual** — admin must manually change status to active. Stripe webhooks not wired up yet.

---

## Onboarding Steps Reference

| Step ID | Phase | Description |
|---------|-------|-------------|
| 1A | 1 – Connection | Foundation video |
| 1B | 1 | Getting to Know You (13 questions) |
| 1C | 1 | Leadership Triage (9 domains) |
| 1D | 1 | Orientation scheduling |
| 2A | 2 – Awareness | 360° Feedback evaluation |
| 2B | 2 | Growth inputs |
| 2C | 2 | Evening pulse tracking |
| 2D | 2 | Rhythm snapshot |
| 2E | 2 | Boss index |
| 2F | 2 | Home audit |
| 3A | 3 – Stabilization | Vision activation |
| 3B | 3 | Vision statements |
| 3C | 3 | Ideal day narrative |
| 3D | 3 | Word of year |
| 3E | 3 | Family mission |
| 4A | 4 – Activation | ProTeam kickstart call |
| 4B | 4 | Join Telegram community |
| 4C | 4 | Wealth strategy |

---

## Caching Strategy

Upstash Redis with TTLs:
- Admin stats: 300s (5 min)
- Client lists: 60s
- Location data: 3600s (1 hr)

Cache keys follow pattern: `admin:stats`, `admin:clients:page:N`, etc.

---

## Key Files

```
app/
  page.tsx                      # Landing
  signup/page.tsx               # 3-step registration
  login/page.tsx
  plans/page.tsx                # Plan selection (Stripe links)
  pending/page.tsx              # Waiting approval
  success/page.tsx              # Welcome celebration + videos
  dashboard/
    page.tsx                    # Main dashboard
    layout.tsx                  # Sidebar + nav shell
  admin/
    page.tsx                    # Stats + charts
    layout.tsx                  # AdminShell
  api/
    auth/                       # login, signup, logout, me
    user/select-plan/
    onboarding/progress/
    onboarding/complete-celebration/
    admin/stats|clients|subscriptions|members/
    location/countries|cities|validate-city-country/
    settings/profile|password/
    admin/settings/profile|password/

components/
  SignupForm.tsx                 # 1200+ lines, 3-step form
  TriageDomainForm.tsx           # 9-domain triage questionnaire
  AdminShell.tsx / AdminSidebar / AdminTopbar
  subscription-stat-cards.tsx
  plan-distribution-chart.tsx

lib/
  auth.ts                       # requireAuth()
  adminAuth.ts                  # requireAdmin()
  mongodb.ts                    # connection util
  redis.ts                      # Upstash client

models/
  User.ts
  OnboardingProfile.ts
```

---

## What's Done

- Authentication (signup/login/logout/JWT cookies)
- User + OnboardingProfile schemas
- Plan selection + pending state
- Landing page
- Plans page with Stripe links
- Dashboard with progress tracking
- Admin dashboard with stats, charts, subscription data
- Multi-step signup with full validation (country/city autocomplete, Terms modal)
- Location services APIs
- Welcome celebration sequence (Lottie, confetti, YouTube embeds)
- Redis caching layer
- Admin client management (list, filter, sort, stale detection at 7 days)
- Settings endpoints (profile, password)
- Subscriptions management page

---

## What's NOT Done / In Progress

### Critical (blocks production)

1. **Email Pipeline** — Resend API key exists but zero sending logic. Need emails for: signup confirmation, pending approval notification, account activated, step completion nudges.

2. **UI Refactor** - Improve user experience


### Medium Priority

5. **Rate Limiting** — No brute-force protection on `/api/auth/login` or `/api/auth/signup`. Add middleware-level rate limiting (consider `@upstash/ratelimit` — already have Redis).

6. **ProTeam Messaging** — UI button exists in dashboard but no backend. Admin–client messaging not implemented.

7. **Email Notifications on Status Change** — When admin approves an account (status → active), user should get an email. No trigger exists.

8. **Admin Pagination Limit** — Currently caps at 50 clients. May need cursor-based pagination for scale.

---

## Development Notes

- Default theme is **dark**. Toggle with next-themes `ModeToggle`.
- Primary brand color: gold `#b6954a`.
- Step IDs are strings ("1A", "2B"...). Treat as opaque IDs — schema relies on them.
- `SignupForm.tsx` is large (~1200 lines). Be careful editing; it owns validation state for all 3 steps.
- Admin routes return cached responses — bust cache manually in Redis if testing live data changes.
- MongoDB Atlas requires your IP in the whitelist. If queries hang locally, check Atlas network access.

## Running Locally

```bash
npm install
cp .env.example .env.local   # fill in all vars
npm run dev                  # Turbopack dev server
```

Admin account: create a user in MongoDB directly and set `role: "admin"`.
