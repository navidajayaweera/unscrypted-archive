# ARCHIVE SYSTEM — Team Task Division
**Hackathon: Protocol UNsCRYPTED | Domain 05: Archive**
**Stack: Next.js 14 (App Router) + Prisma + SQLite + Tailwind CSS**

---

## ⚠️ Before Anyone Touches Code

1. P1 sets up the project and pushes to GitHub
2. Everyone else clones the repo
3. No one starts their feature until P1's skeleton is live
4. Estimated P1 unblock time: **30–45 minutes**

> **P4 owns ALL frontend UI.** P2 and P3 build backend only (API routes, DB, logic). P4 consumes their APIs and builds every page and component.

---

## P1 — Foundation & Backend Core

> You go first. Everyone is blocked until you're done.

### Responsibilities

- Initialize Next.js 14 project with App Router
- Install and configure Prisma with SQLite
- Define database schema
- Write seed data
- Build all API routes
- Set up global layout, sidebar navigation, and theme (P4 will style, you just scaffold)

### Database Schema

```prisma
model Knowledge {
  id          String   @id @default(cuid())
  title       String
  description String
  filePath    String
  tags        String   // comma-separated e.g. "medical,engineering"
  uploadedAt  DateTime @default(now())
}

model Survivor {
  id           String   @id @default(cuid())
  name         String
  age          Int
  sector       String
  registeredAt DateTime @default(now())
  skills       Skill[]
}

model Skill {
  id         String   @id @default(cuid())
  name       String
  category   String   // medical, construction, farming, tech, engineering
  survivor   Survivor @relation(fields: [survivorId], references: [id])
  survivorId String
}

model ShelterLocation {
  id          String   @id @default(cuid())
  name        String
  description String
  lat         Float
  lng         Float
  capacity    Int
  status      String   // active, full, abandoned
  createdAt   DateTime @default(now())
}

model Tutorial {
  id          String   @id @default(cuid())
  title       String
  category    String   // first-aid, survival, shelter, food, defense
  content     String   // markdown content
  difficulty  String   // beginner, intermediate, advanced
  createdAt   DateTime @default(now())
}
```

### API Routes to Build

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
| GET | `/api/stats` | Return all counts for dashboard |

### File Structure to Create

```
app/
  layout.tsx        ← global layout with sidebar (scaffold only, P4 styles)
  api/
    knowledge/
      route.ts
      [id]/route.ts
    survivors/
      route.ts
      [id]/route.ts
    skills/
      route.ts
    shelters/
      route.ts
      [id]/route.ts
    tutorials/
      route.ts
      [id]/route.ts
    stats/
      route.ts
prisma/
  schema.prisma
  seed.ts
lib/
  db.ts             ← Prisma client singleton
public/
  uploads/          ← empty folder for file storage
```

### Done When

- [ ] Repo is on GitHub
- [ ] `npm run dev` works
- [ ] All API routes return valid JSON
- [ ] Seed data populates the DB (`npx prisma db seed`)
- [ ] Message team: **"P1 done — clone and start"**

---

## P2 — Knowledge Base & Survivor Registry (Backend Only)

> Wait for P1's push. You build API logic only — no UI, no pages, no components.

### Your Job

P1 creates the route files. You fill in the logic inside them.

### Knowledge API Logic (`/api/knowledge`)

- `GET` — query all Knowledge records, support `?tag=` filter (search inside comma-separated tags field)
- `POST` — accept multipart form, save file to `/public/uploads/`, write record to DB
- `GET /[id]` — return single record by id, 404 if not found
- `DELETE /[id]` — delete record and remove file from disk

### Survivor + Skills API Logic (`/api/survivors`, `/api/skills`)

- `GET /survivors` — query all with their skills, support `?skill=` filter
- `POST /survivors` — create survivor + associated skills in one transaction
- `GET /survivors/[id]` — return survivor with full skills list
- `GET /skills` — return all skills, support `?category=` filter

### Stats API Logic (`/api/stats`)

Return this shape (P4 needs it for dashboard):

```ts
{
  totalDocuments: number,
  totalSurvivors: number,
  totalSkills: number,
  totalShelters: number,
  totalTutorials: number,
  recentDocuments: Knowledge[],  // last 5
  recentSurvivors: Survivor[]    // last 5
}
```

### Done When

- [ ] All knowledge endpoints return correct data
- [ ] File upload saves to disk and DB
- [ ] Survivor create with skills works in one call
- [ ] Stats endpoint returns correct counts
- [ ] Tested with curl or Postman

---

## P3 — Shelters, First Aid & Tutorials (Backend Only)

> Wait for P1's push. You build API logic only — no UI, no pages, no components.

### Your Job

P1 creates the route files. You fill in the logic inside them.

### Shelter Locations API Logic (`/api/shelters`)

- `GET` — return all shelters with name, description, lat, lng, capacity, status
- `POST` — create new shelter location
- `GET /[id]` — return single shelter

Data shape:
```ts
{
  id: string,
  name: string,
  description: string,
  lat: number,
  lng: number,
  capacity: number,
  status: "active" | "full" | "abandoned"
}
```

### Tutorials API Logic (`/api/tutorials`)

- `GET` — return all tutorials, support `?category=` filter
- Categories: `first-aid`, `survival`, `shelter`, `food`, `defense`
- `POST` — create new tutorial (title, category, content as markdown, difficulty)
- `GET /[id]` — return single tutorial with full content

### Seed Data to Write

Write realistic seed entries in `prisma/seed.ts` for:
- At least 5 shelter locations (real-sounding bunker names, coords near Colombo)
- At least 8 tutorials — mix of first-aid and survival (with actual markdown content, not placeholder)

### Done When

- [ ] Shelter list endpoint returns correct data
- [ ] Tutorial list + category filter works
- [ ] Single tutorial returns full markdown content
- [ ] Seed data is realistic and populated
- [ ] Tested with curl or Postman

---

## P4 — All UI (Dashboard + All Pages)

> Wait for P1's push. You own every single page and component in this project.

### Theme & Design System

Apply consistently across all pages:
- Background: near-black (`#0a0a0a`)
- Primary accent: amber (`#f59e0b`)
- Secondary accent: green (`#22c55e`)
- Font: monospace (`font-mono`) for headers and labels, readable sans for body
- Borders: dim amber/green tinted
- Vibe: decayed military terminal — functional, gritty, post-apocalyptic

---

### Page 1: `/` — Dashboard

**Sections:**
- System header: "ARCHIVE SYSTEM — BUNKER COLD STORAGE" + blinking green status dot "ONLINE"
- Stats bar — 5 metric cards: Total Documents, Total Survivors, Total Skills, Shelter Locations, Tutorials
- Quick actions row: buttons for Upload Doc, Register Survivor, Add Shelter, Add Tutorial
- Recent activity feed — last 5 docs + last 5 survivors (date, name, type)
- Cross-sector API panel — show available endpoints for NEXUS/PULSE/HARVEST sectors

**API calls:**
```ts
GET /api/stats
```

---

### Page 2: `/knowledge` — Knowledge Base

**Sections:**
- Header + "Upload Document" button
- Search bar (real-time filter by title)
- Tag filter row: All, Medical, Agricultural, Engineering, Tech
- Document cards grid: title, tags, date, download button
- Upload modal: Title, Description, File, Tags

**API calls:**
```ts
GET  /api/knowledge
GET  /api/knowledge?tag=medical
POST /api/knowledge
```

---

### Page 3: `/knowledge/[id]` — Document View

**Sections:**
- Back button
- Title + tags
- Upload date
- Description
- Download button
- Related documents (same tag, max 3)

**API calls:**
```ts
GET /api/knowledge/[id]
GET /api/knowledge?tag=x
```

---

### Page 4: `/survivors` — Survivor Registry

**Sections:**
- Header + "Register Survivor" button
- Search bar (by name)
- Skill category filter: All, Medical, Construction, Farming, Tech, Engineering
- Survivor cards: name, sector, top 3 skill badges
- Register modal: Name, Age, Sector, Skills (add multiple)

**API calls:**
```ts
GET  /api/survivors
GET  /api/survivors?skill=medical
POST /api/survivors
```

---

### Page 5: `/survivors/[id]` — Survivor Profile

**Sections:**
- Back button
- Name + sector badge + ACTIVE status
- Age + registered date
- Skills grouped by category

**API calls:**
```ts
GET /api/survivors/[id]
```

---

### Page 6: `/shelters` — Shelter Locations

**Sections:**
- Header + "Add Shelter" button
- Shelter cards grid: name, status badge (active/full/abandoned), capacity, description
- Status filter: All, Active, Full, Abandoned
- Add Shelter modal: Name, Description, Lat, Lng, Capacity, Status

**API calls:**
```ts
GET  /api/shelters
POST /api/shelters
```

---

### Page 7: `/tutorials` — Survival Tutorials

**Sections:**
- Header + "Add Tutorial" button
- Category filter tabs: All, First Aid, Survival, Shelter, Food, Defense
- Tutorial cards: title, category badge, difficulty badge, short excerpt
- Click card → expand or navigate to full tutorial

**API calls:**
```ts
GET /api/tutorials
GET /api/tutorials?category=first-aid
```

---

### Page 8: `/tutorials/[id]` — Tutorial Detail

**Sections:**
- Back button
- Title + category + difficulty badges
- Full markdown content rendered as HTML
- Related tutorials (same category, max 3)

**API calls:**
```ts
GET /api/tutorials/[id]
```

---

### Sidebar Navigation (update layout.tsx)

```
Dashboard        /
Knowledge Base   /knowledge
Survivor Registry /survivors
Shelter Locations /shelters
Tutorials        /tutorials
```

---

### Done When

- [ ] All 8 pages render correctly
- [ ] Theme is consistent across all pages
- [ ] All modals work (submit + list updates)
- [ ] All search/filter interactions work
- [ ] Sidebar highlights active route
- [ ] Stats dashboard shows real numbers
- [ ] Markdown renders correctly on tutorial detail page

---

## Shared Rules

- **Branch per person:** `p1/foundation`, `p2/knowledge-survivors-backend`, `p3/shelters-tutorials-backend`, `p4/all-ui`
- **PR to main** only when your section is complete
- **P2 and P3: do not touch app/ folder** — backend routes only
- **P4: do not touch prisma/ or api/ folders** — UI only
- **If blocked**, message team immediately
- **Last 30 min:** stop feature work, merge everything, test end-to-end, zip for submission

---

## Final Submission Checklist

- [ ] All 8 pages functional
- [ ] All CRUD flows working
- [ ] Search and filters working
- [ ] Dashboard stats pulling real data
- [ ] Tutorials render markdown
- [ ] Shelter locations display correctly
- [ ] Code zipped → `ARCHIVE_SUBMISSION.zip`
- [ ] Pitch deck ready
- [ ] Folklore narrative doc ready
- [ ] PR & rollout plan ready

---

*STANDBY. THE ARCHIVE MUST NOT FALL.*
