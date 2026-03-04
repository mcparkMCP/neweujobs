# EU Jobs Brussels

The leading job board for EU institutions, NGOs, think tanks, and public affairs positions in Brussels.
Live at [eujobs.co](https://eujobs.co).

Previous handcoded codebase: [mcparkMCP/eujobs-platform](https://github.com/mcparkMCP/eujobs-platform)

**Competitors:** jobsin.brussels, eurobrussels.com, euractiv.jobs.com

## Tech Stack

- **Framework:** Next.js 14 (App Router, `output: 'standalone'`)
- **Styling:** Tailwind CSS 3.4 with `@tailwindcss/typography`
- **Language:** TypeScript 5
- **Database:** MongoDB 7 (self-hosted in Docker — no paid cloud service)
- **ODM:** Mongoose 9
- **Payments:** Stripe
- **Email:** Brevo (formerly Sendinblue)
- **Analytics:** PostHog
- **Deployment:** Docker on Hetzner VPS (AlmaLinux 9), Cloudflare DNS/TLS

## Quick Start

```bash
npm install
npm run dev        # http://localhost:3000
npm run build
npm start
```

## Database

The app uses a **self-hosted MongoDB 7** instance running in Docker alongside the app — no MongoDB Atlas or any paid database service.

- **Connection:** `mongodb://eujobs-mongo:27017/test` (Docker internal network)
- **Database name:** `test` (the default Mongoose database)
- **Storage:** Docker volume `mongo-data` persisted on the host

### Collections

| Collection | Count | Description |
|------------|-------|-------------|
| `jobs` | ~79,000 | Job listings (scraped + posted) |
| `eu_interest_representatives` | ~12,700 | EU Transparency Register lobbying entities |
| `org_career_guides` | ~12,000 | AI-generated career guides per organization |
| `career_guides` | 15 | Curated career guides (blog-style) |
| `bib_consultancies` | 71 | Best in Brussels: consultancy firms |
| `bib_consultants` | 228 | Best in Brussels: individual consultants |
| `bib_specialist_categories` | 27 | Best in Brussels: specialization categories |
| `bib_law_firms` | 6 | Best in Brussels: law firms |
| `bib_trainers` | 5 | Best in Brussels: trainers |
| `bib_digital_tools` | 6 | Best in Brussels: digital tools |
| `bib_intelligence_systems` | 16 | Best in Brussels: intelligence systems |
| `users` | 2 | Admin accounts |

### Companies

Companies are **not stored in MongoDB**. They are derived at runtime from the `jobs` collection by extracting unique `companyName` values. The logic is in `src/lib/data.ts` (`getUniqueCompanies`, `getAllCompaniesWithCounts`, `getCompanyBySlug`).

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── jobs/                   # Job listing + detail (/jobs, /jobs/[slug])
│   ├── companies/              # Company listing + detail (derived from jobs)
│   ├── categories/             # Job category listing + detail
│   ├── lobbying-entities/      # EU Transparency Register entities
│   ├── career-guides/          # Org-specific career guides (~12,000)
│   ├── blog/                   # Curated career guide articles
│   ├── best-in-brussels/       # Consultancy/law firm directory
│   ├── pricing/                # Job posting pricing
│   ├── post-job/               # Job posting form (Stripe checkout)
│   ├── alerts/                 # Job alert signup
│   ├── fairpay/                # Salary calculator
│   ├── about/                  # About page
│   ├── contact/                # Contact form
│   ├── privacy/                # Privacy policy
│   ├── terms/                  # Terms of service
│   ├── actions/                # Server actions (job posting, Stripe)
│   ├── api/                    # API routes (webhooks, search, sitemap)
│   ├── layout.tsx              # Root layout (header, footer, analytics)
│   ├── page.tsx                # Homepage
│   └── not-found.tsx           # 404 page
├── components/
│   ├── Breadcrumb.tsx          # Reusable breadcrumb with JSON-LD
│   ├── NewsletterSignup.tsx    # Newsletter popup
│   ├── jobs/                   # JobCard, JobFilters, etc.
│   ├── layout/                 # Header, Footer
│   └── ui/                     # Reusable UI components
├── lib/
│   ├── data.ts                 # Job/company/category data fetching
│   ├── dbConnect.ts            # Mongoose connection singleton
│   ├── careerGuideData.ts      # Career guide queries
│   ├── orgCareerGuideData.ts   # Org career guide queries
│   └── stripe.ts               # Stripe helpers
├── models/                     # Mongoose models
│   ├── Job.ts
│   ├── LobbyingEntity.ts
│   └── ...
└── types/
    └── index.ts                # TypeScript types
```

## Key Pages

| Route | What | Data Source |
|-------|------|-------------|
| `/` | Homepage with search + featured jobs | `jobs` collection |
| `/jobs` | Paginated job listings with filters | `jobs` collection |
| `/jobs/[slug]` | Job detail with Apply button | `jobs` collection |
| `/companies` | ~8,800 companies derived from jobs | `jobs` (runtime aggregation) |
| `/companies/[slug]` | Company profile + open positions | `jobs` (filtered by company) |
| `/categories/[slug]` | Jobs by category | Hardcoded categories + `jobs` |
| `/lobbying-entities` | Paginated EU transparency entities | `eu_interest_representatives` |
| `/lobbying-entities/[slug]` | Entity detail + related jobs | `eu_interest_representatives` + `jobs` |
| `/career-guides` | Paginated org career guides | `org_career_guides` |
| `/career-guides/[slug]` | Full career guide article | `org_career_guides` |
| `/blog` | Curated career guide articles | `career_guides` |
| `/best-in-brussels` | Consultancy/lobbying firm directory | `bib_*` collections |
| `/pricing` | Job posting plans | Static |
| `/post-job` | Job posting form → Stripe checkout | Stripe API |
| `/fairpay` | EU salary calculator | Static data |

## SEO

- **Breadcrumbs:** Every page (except homepage) has a `<Breadcrumb>` component that renders both a visible nav bar and a `BreadcrumbList` JSON-LD script for Google.
- **Structured data:** Job detail pages include `JobPosting` JSON-LD. Lobbying entity pages include `Organization` JSON-LD. Career guides include `Article` JSON-LD.
- **Sitemaps:** Dynamic sitemaps at `/api/sitemap`, `/api/sitemap-jobs`, `/api/sitemap-entities`, `/api/sitemap-career-guides`.
- **Meta tags:** Every page has `generateMetadata` with title, description, Open Graph, and Twitter Card tags.

## Deployment

### Infrastructure

- **Server:** vani3 (Hetzner VPS, AlmaLinux 9, IP `157.180.7.100`)
- **Runtime:** Docker Compose (Next.js app + MongoDB 7, bridge network)
- **Reverse proxy:** Nginx with self-signed SSL (Cloudflare handles public TLS)
- **CI/CD:** GitHub Actions with zero-downtime blue-green deploys

### Docker Setup

```yaml
# docker-compose.yml
services:
  eujobs:      # Next.js app, port 3000 (internal)
  mongo:       # MongoDB 7, port 27017 (internal), volume: mongo-data
```

Both containers run on a Docker bridge network (`neweujobs_eujobs-network`). The app connects to MongoDB via `mongodb://eujobs-mongo:27017/test`.

At build time, MongoDB is not available, so the Dockerfile sets a dummy `MONGODB_URI=mongodb://localhost:27017`. The real URI is injected at runtime via `.env.production`.

### Blue-Green Deployment

Pushing to `main` triggers GitHub Actions:

```
Push to main → GitHub Actions → SSH into vani3 → git pull
  → docker compose build → start new container on alternate port
  → health check (up to 90s) → swap nginx upstream → stop old container
```

Two port slots:
- **Blue:** port 3000 (container `eujobs-app`)
- **Green:** port 3010 (container `eujobs-green`)

Active slot tracked in `.deploy-state`. Nginx switches only after health check passes.

### Key Files

| File | Purpose |
|------|---------|
| `deploy.sh` | Blue-green deploy script (runs on vani3) |
| `.github/workflows/deploy.yml` | GitHub Actions workflow |
| `.deploy-state` | Tracks active port slot (gitignored) |
| `docker-compose.yml` | Docker services (app + MongoDB) |
| `Dockerfile` | Multi-stage Next.js production build |
| `.env.production` | Production env vars (gitignored) |

### GitHub Secrets

| Secret | Description |
|--------|-------------|
| `DEPLOY_SSH_KEY` | SSH private key for vani3 access |
| `DEPLOY_HOST` | Server IP address |
| `DEPLOY_USER` | SSH user (`root`) |

### Manual Operations

```bash
# Check status
ssh vani3 "cat /data/repos/eujobs/neweujobs/.deploy-state"
ssh vani3 "docker ps | grep eujobs"

# Manual deploy
ssh vani3 "cd /data/repos/eujobs/neweujobs && git pull --ff-only origin main && bash deploy.sh"

# View deploy logs
gh run list -R chaollapark/neweujobs -L 5
```

## Recent Changes

### Breadcrumbs & Company Fix (aa1acb2)
- Created reusable `Breadcrumb` component with JSON-LD structured data and `aria-label` accessibility
- Added breadcrumbs to all 21 page types (listing pages, detail pages, static pages)
- Fixed company detail pages returning 404: `getCompanyBySlug()` had a `.limit(500)` bug that missed most companies
- Added proper status/plan filtering to company queries to match listing page logic

### Mobile Responsiveness (5d6963d)
- Fixed newsletter popup overflowing viewport on mobile
- Added mobile-visible Apply button on job detail pages (was hidden below `lg:` breakpoint)
- Responsive card padding (`p-5 sm:p-8`) across job detail, pricing, post-job, about pages
- Responsive text sizes for pricing, 404, hero sections
- Improved touch targets on lobbying entities pagination and filter chips (44px minimum)
- Flex-wrap on alerts frequency radios for small screens

### Performance & SEO Hardening (01c10c9)
- Added `allowDiskUse` to career guide aggregation queries (12,000+ docs)
- Added MongoDB indexes for career guide pagination
- Production hardening for large collection queries

## Design System

### Colors
- **EU Blue:** `#003399` — primary brand color
- **EU Yellow:** `#FFCC00` — accent/CTA color
- **EU Dark:** `#001a4d` — dark variant
- **EU Light:** `#e6ecf5` — light backgrounds

### Key Classes
- `.btn-primary` — primary action buttons (EU blue)
- `.btn-secondary` — secondary buttons
- `.input-field` — form inputs
- `.badge-*` — status badges

## License

MIT
