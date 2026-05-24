# ARCHIVE SYSTEM — Protocol UNsCRYPTED

Bunker cold storage archive built with Next.js, Prisma, and SQLite.

## Getting Started

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/knowledge` | List all, supports `?tag=` filter |
| POST | `/api/knowledge` | Upload new document |
| GET | `/api/knowledge/[id]` | Get single document |
| DELETE | `/api/knowledge/[id]` | Delete document |
| GET | `/api/survivors` | List all, supports `?skill=` filter |
| POST | `/api/survivors` | Register new survivor |
| GET | `/api/survivors/[id]` | Get survivor profile |
| GET | `/api/skills` | List all skills, supports `?category=` filter |
| GET | `/api/stats` | Dashboard counts |

## Team Branches

- `p1/foundation` — Backend & layout (this branch)
- `p2/knowledge` — Knowledge Base UI
- `p3/survivors` — Survivor Registry UI
- `p4/dashboard` — Dashboard UI
