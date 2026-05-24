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

## Pages

| Route | Description |
|-------|-------------|
| `/` | Dashboard with stats and recent activity |
| `/knowledge` | Knowledge Base list + upload |
| `/knowledge/[id]` | Document detail |
| `/survivors` | Survivor Registry list + register |
| `/survivors/[id]` | Survivor profile |
| `/shelters` | Shelter locations list + add |
| `/tutorials` | Survival tutorials list + add |
| `/tutorials/[id]` | Tutorial detail (markdown) |

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
| GET | `/api/shelters` | List all shelter locations |
| POST | `/api/shelters` | Add new shelter |
| GET | `/api/shelters/[id]` | Get single shelter |
| GET | `/api/tutorials` | List all, supports `?category=` filter |
| POST | `/api/tutorials` | Create new tutorial |
| GET | `/api/tutorials/[id]` | Get single tutorial |
| GET | `/api/stats` | Dashboard counts + recent activity |

## Team Branches

- `p1/foundation` — Project setup, schema, API scaffold, layout
- `p2/knowledge-survivors-backend` — Knowledge & survivor API logic
- `p3/shelters-tutorials-backend` — Shelter & tutorial API logic + seed
- `p4/all-ui` — All pages and components
