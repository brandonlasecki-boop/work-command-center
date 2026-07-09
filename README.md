# Work Command Center

Personal multi-company project tracker — a polished work command center for managing projects, recursive work items, daily logs, and a fullscreen TV mode.

## Stack

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui
- Supabase (Postgres)

## Setup

1. Copy `.env.example` to `.env.local` and fill in Supabase credentials
2. Apply migrations: `supabase/migrations/001_work_command_center.sql` (already applied to cloud project)
3. Run the dev server:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Routes

| Route | Description |
|-------|-------------|
| `/dashboard` | Main overview — companies, active projects, today's wins, focus items |
| `/companies` | Manage companies |
| `/company/[id]` | Company detail with projects and activity |
| `/project/[id]` | Project detail with recursive work item tree |
| `/daily-log` | Chronological completed work log with filters |
| `/tv` | Fullscreen command center for office display |

## Supabase Project

Cloud project: **Work Command Center** (`hssjoymuqfmawecwmvdp`) in `us-east-2`
