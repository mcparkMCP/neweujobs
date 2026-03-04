# 🇪🇺 EU Jobs Brussels

The leading job board for EU institutions, NGOs, think tanks, and public affairs positions in Brussels.
This is the upgraded website (the old handcoded codebase is https://github.com/mcparkMCP/eujobs-platform ).

**Competitors:** jobsin.brussels, eurobrussels.com, euractiv.jobs.com, eujobs.co

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **Database:** MongoDB 7
- **Deployment:** Docker on Hetzner (AlmaLinux 9) with GitHub Actions CI/CD

## 📁 Project Structure

```
eu-jobs-brussels/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── auth/               # Login & Register pages
│   │   ├── categories/         # Category listing & detail
│   │   ├── companies/          # Company listing & detail
│   │   ├── jobs/               # Job listing & detail
│   │   ├── post-job/           # Job posting form
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Homepage
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── jobs/               # Job-related components
│   │   ├── layout/             # Header, Footer
│   │   └── ui/                 # Reusable UI components
│   ├── lib/
│   │   └── data.ts             # Mock data (replace with DB)
│   └── types/
│       └── index.ts            # TypeScript types
├── public/                     # Static assets
├── PROJECT_PLAN.md             # Detailed project plan
├── launch-agents.sh            # Multi-agent launcher
└── package.json
```

## ✨ Features

### Implemented (MVP)
- ✅ Homepage with featured jobs and search
- ✅ Job listings with filters (category, contract, experience, remote)
- ✅ Job detail pages with full information
- ✅ Company directory and profiles
- ✅ Category browsing
- ✅ Job posting form
- ✅ User authentication pages (UI)
- ✅ Mobile-responsive design
- ✅ EU-themed branding

### Coming Soon
- 🔄 Database integration (Prisma + Supabase)
- 🔄 User authentication (NextAuth.js)
- 🔄 Job application system
- 🔄 Employer dashboard
- 🔄 Job alerts & notifications
- 🔄 Payment integration
- 🔄 SEO optimization

## 🤖 Multi-Agent Development

This project supports parallel development using multiple Claude agents:

```bash
# Launch the multi-agent script
./launch-agents.sh
```

This will open multiple terminal windows, each with a Claude agent working on:
1. **Agent 1:** Database schema & Prisma setup
2. **Agent 2:** Authentication (NextAuth.js)
3. **Agent 3:** API routes for jobs
4. **Agent 4:** Employer dashboard
5. **Agent 5:** SEO & sitemap
6. **Agent 6:** Email notifications

## 🎨 Design System

### Colors
- **EU Blue:** `#003399` - Primary brand color
- **EU Yellow:** `#FFCC00` - Accent color
- **EU Dark:** `#001a4d` - Dark variant
- **EU Light:** `#e6ecf5` - Light backgrounds

### Components
- `.btn-primary` - Primary action buttons
- `.btn-secondary` - Secondary buttons
- `.card` - Content cards
- `.input-field` - Form inputs
- `.badge-*` - Status badges

## 📊 Job Categories

1. EU Institutions
2. EU Agencies
3. Trade Associations
4. NGOs & Civil Society
5. Think Tanks
6. Public Affairs & Lobbying
7. Law Firms
8. Media & Communications
9. International Organizations
10. Traineeships

## Deployment

### Infrastructure

- **Server:** vani3 (AlmaLinux 9, Hetzner)
- **Runtime:** Docker Compose (Next.js app + MongoDB 7)
- **Reverse proxy:** Nginx with self-signed SSL (Cloudflare handles public TLS)
- **CI/CD:** GitHub Actions with zero-downtime blue-green deploys

### How Deployment Works

Pushing to `main` triggers an automated deploy via GitHub Actions:

```
Push to main → GitHub Actions → SSH into vani3 → git pull
  → docker compose build → start new container on alternate port
  → health check (up to 90s) → swap nginx upstream → stop old container
```

The deploy uses **blue-green deployment** alternating between two port slots:
- **Blue:** port 3000 (container `eujobs-app`)
- **Green:** port 3010 (container `eujobs-green`)

The active slot is tracked in `.deploy-state`. Nginx switches to the new container only after the health check passes, ensuring zero downtime.

If the health check fails, the new container is stopped and removed — the old container continues serving traffic.

### Key Files

| File | Purpose |
|------|---------|
| `deploy.sh` | Blue-green deploy script (runs on vani3) |
| `.github/workflows/deploy.yml` | GitHub Actions workflow |
| `.deploy-state` | Tracks active port slot (gitignored) |
| `docker-compose.yml` | Docker services (app + MongoDB) |
| `Dockerfile` | Next.js production build |
| `.env.production` | Production env vars (gitignored) |

### GitHub Secrets

These are configured in the repo under Settings > Secrets > Actions:

| Secret | Description |
|--------|-------------|
| `DEPLOY_SSH_KEY` | SSH private key for vani3 access |
| `DEPLOY_HOST` | Server IP address |
| `DEPLOY_USER` | SSH user (`root`) |

### Manual Operations

**Check current state:**
```bash
ssh vani3 "cat /data/repos/eujobs/neweujobs/.deploy-state"   # active port
ssh vani3 "docker ps | grep eujobs"                            # running containers
ssh vani3 "cat /etc/nginx/conf.d/eujobs.conf"                  # nginx config
```

**Trigger a deploy manually on vani3:**
```bash
ssh vani3 "cd /data/repos/eujobs/neweujobs && git pull --ff-only origin main && bash deploy.sh"
```

**Rollback to previous slot:**
```bash
# If green (3010) is active and you want to go back to blue (3000):
ssh vani3 "docker start eujobs-app"
# Update nginx to point back to old port:
ssh vani3 "sed -i 's/server 127.0.0.1:3010/server 127.0.0.1:3000/' /etc/nginx/conf.d/eujobs.conf && nginx -t && nginx -s reload"
ssh vani3 "echo 3000 > /data/repos/eujobs/neweujobs/.deploy-state"
ssh vani3 "docker stop eujobs-green && docker rm eujobs-green"
```

**View deploy logs:**
```bash
gh run list -R chaollapark/neweujobs -L 5
gh run view <run-id> -R chaollapark/neweujobs --log
```

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ for the EU bubble in Brussels 🇪🇺
