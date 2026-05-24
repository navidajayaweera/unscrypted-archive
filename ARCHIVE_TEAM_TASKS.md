# ARCHIVE SYSTEM — Team Task Division
**Hackathon: Protocol UNsCRYPTED | Domain 05: Archive**
**Stack: Next.js 14 (App Router) + Prisma + SQLite + Tailwind CSS**

---

## ⚠️ Before Anyone Touches Code

1. P1 sets up the project and pushes to GitHub
2. Everyone else clones the repo
3. No one starts their feature until P1's skeleton is live
4. Estimated P1 unblock time: **30–45 minutes**

---

## P1 — Foundation & Backend

> You go first. Everyone is blocked until you're done.

### Responsibilities

- Initialize Next.js 14 project with App Router
- Install and configure Prisma with SQLite
- Define database schema
- Write seed data
- Build all API routes
- Set up global layout, sidebar navigation, and theme

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
| GET | `/api/stats` | Return counts for dashboard (P4 needs this) |

### Layout & Theme

- Create `app/layout.tsx` with sidebar + top bar
- Sidebar links: Dashboard, Knowledge Base, Survivor Registry
- Theme: dark background, amber/green accent, monospace font (`font-mono`)
- Top bar: system name "ARCHIVE SYSTEM", status badge "ONLINE"

### File Structure to Create

```
app/
  layout.tsx        ← global layout with sidebar
  api/
    knowledge/
      route.ts
      [id]/route.ts
    survivors/
      route.ts
      [id]/route.ts
    skills/
      route.ts
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
- [ ] Sidebar and layout render correctly
- [ ] Slack/message team: **"P1 done — clone and start"**

---

## P2 — Knowledge Base

> Wait for P1's push. Then own everything document-related.

### Pages to Build

#### `/knowledge` — Knowledge Base List Page

**Sections:**
- Page header: "Knowledge Base" title + "Upload Document" button
- Search bar — filters documents by title in real time
- Tag filter row — clickable tags: `All`, `Medical`, `Agricultural`, `Engineering`, `Tech`
- Document grid — cards showing title, description snippet, tags, upload date, download button
- Upload modal (triggered by button) — fields: Title, Description, File upload, Tags (multi-select)

#### `/knowledge/[id]` — Document View Page

**Sections:**
- Back button → `/knowledge`
- Document title + tags
- Metadata row: uploaded date
- Description block
- Download button (links to file)
- Related documents section (same tags, max 3)

### Components to Build

```
components/knowledge/
  KnowledgeCard.tsx       ← card with title, tags, date, download btn
  KnowledgeList.tsx       ← renders grid of KnowledgeCards
  KnowledgeUploadForm.tsx ← modal form: title, desc, file, tags
  TagFilter.tsx           ← row of clickable tag buttons
```

### API Calls You'll Make

```ts
GET  /api/knowledge           // list page
GET  /api/knowledge?tag=medical // filtered list
POST /api/knowledge           // upload form submission
GET  /api/knowledge/[id]      // document view page
```

### Done When

- [ ] Can browse all documents
- [ ] Search bar filters in real time
- [ ] Tag filter works
- [ ] Upload modal submits and new doc appears in list
- [ ] Single document page loads with correct data
- [ ] Download button works

---

## P3 — Survivor Registry

> Wait for P1's push. Then own everything survivor-related.

### Pages to Build

#### `/survivors` — Survivor Registry List Page

**Sections:**
- Page header: "Survivor Registry" title + "Register Survivor" button
- Search bar — filters survivors by name
- Skill category filter — `All`, `Medical`, `Construction`, `Farming`, `Tech`, `Engineering`
- Survivor cards grid — name, sector, skill count, top 3 skill badges
- Register modal (triggered by button) — fields: Name, Age, Sector, Skills (add multiple)

#### `/survivors/[id]` — Survivor Profile Page

**Sections:**
- Back button → `/survivors`
- Survivor name + sector badge
- Metadata: age, registered date
- Skills section — grouped by category, each skill as a badge
- Status indicator: "ACTIVE"

### Components to Build

```
components/survivors/
  SurvivorCard.tsx    ← card with name, sector, skill badges
  SurvivorList.tsx    ← renders grid of SurvivorCards
  SurvivorForm.tsx    ← modal form: name, age, sector, skills
  SkillBadge.tsx      ← colored badge by category
  SkillFilter.tsx     ← row of clickable skill category buttons
```

### API Calls You'll Make

```ts
GET  /api/survivors                    // list page
GET  /api/survivors?skill=medical      // filtered
POST /api/survivors                    // register form
GET  /api/survivors/[id]               // profile page
GET  /api/skills?category=farming      // skill filter
```

### Done When

- [ ] Can browse all survivors
- [ ] Search bar filters by name
- [ ] Skill category filter works
- [ ] Register modal submits and new survivor appears in list
- [ ] Profile page loads with correct skills
- [ ] Skill badges are color-coded by category

---

## P4 — Dashboard

> Wait for P1's push. Then own the home page and the stats.

### Page to Build

#### `/` — Dashboard (Home)

**Sections:**
- System header: "ARCHIVE SYSTEM — BUNKER COLD STORAGE" with blinking status dot
- Stats bar (4 metric cards):
  - Total Documents
  - Total Survivors
  - Total Skills
  - Active Sectors
- Quick actions row:
  - "Upload Document" → opens `/knowledge`
  - "Register Survivor" → opens `/survivors`
- Recent activity feed — last 5 documents uploaded + last 5 survivors registered (sorted by date)
- Cross-sector API status panel — shows 3 mock endpoints available to other sectors:
  - `GET /api/knowledge?tag=medical` — PULSE sector
  - `GET /api/knowledge?tag=agricultural` — HARVEST sector
  - `GET /api/skills` — All sectors

### API Calls You'll Make

```ts
GET /api/stats        // total counts for metric cards
GET /api/knowledge    // recent uploads (sort by date, limit 5)
GET /api/survivors    // recent registrations (limit 5)
```

### Done When

- [ ] Stats cards show real numbers from DB
- [ ] Recent activity feed is populated
- [ ] Quick action buttons navigate correctly
- [ ] Cross-sector API panel is visible
- [ ] Page looks like a proper system dashboard

---

## Shared Rules

- **Branch per person:** `p1/foundation`, `p2/knowledge`, `p3/survivors`, `p4/dashboard`
- **PR to main** only when your feature is complete
- **Don't touch each other's files**
- **If blocked**, message team immediately — don't sit on it
- **Last 30 min:** everyone stops feature work, merge everything, test end-to-end, zip for submission

---

## Final Submission Checklist

- [ ] All 5 pages functional
- [ ] Upload and register flows working
- [ ] Search and filters working
- [ ] Dashboard stats pulling real data
- [ ] Code zipped → `ARCHIVE_SUBMISSION.zip`
- [ ] Pitch deck ready
- [ ] Folklore narrative doc ready
- [ ] PR & rollout plan ready

---

*STANDBY. THE ARCHIVE MUST NOT FALL.*
