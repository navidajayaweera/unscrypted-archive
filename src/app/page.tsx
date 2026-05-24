import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

async function getStats() {
  const [
    totalDocuments,
    totalSurvivors,
    totalSkills,
    totalShelters,
    totalTutorials,
    recentDocuments,
    recentSurvivors,
  ] = await Promise.all([
    prisma.knowledge.count(),
    prisma.survivor.count(),
    prisma.skill.count(),
    prisma.shelterLocation.count(),
    prisma.tutorial.count(),
    prisma.knowledge.findMany({ orderBy: { uploadedAt: "desc" }, take: 5 }),
    prisma.survivor.findMany({
      orderBy: { registeredAt: "desc" },
      take: 5,
      include: { skills: true },
    }),
  ]);

  return {
    totalDocuments,
    totalSurvivors,
    totalSkills,
    totalShelters,
    totalTutorials,
    recentDocuments,
    recentSurvivors,
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  const metrics = [
    { label: "Total Documents", value: stats.totalDocuments },
    { label: "Total Survivors", value: stats.totalSurvivors },
    { label: "Total Skills", value: stats.totalSkills },
    { label: "Shelter Locations", value: stats.totalShelters },
    { label: "Tutorials", value: stats.totalTutorials },
  ];

  const activity = [
    ...stats.recentDocuments.map((d) => ({
      type: "Document",
      name: d.title,
      date: d.uploadedAt,
    })),
    ...stats.recentSurvivors.map((s) => ({
      type: "Survivor",
      name: s.name,
      date: s.registeredAt,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3">
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#22c55e]" />
          <h2 className="font-mono text-lg font-bold tracking-wide text-amber-500">
            ARCHIVE SYSTEM — BUNKER COLD STORAGE
          </h2>
        </div>
        <p className="mt-1 text-sm text-zinc-500">Sector 05 operational status: nominal</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {metrics.map((m) => (
          <div
            key={m.label}
            className="rounded border border-amber-900/30 bg-zinc-900/40 p-4"
          >
            <p className="text-xs tracking-wider text-zinc-500">{m.label.toUpperCase()}</p>
            <p className="mt-1 font-mono text-2xl font-bold text-amber-500">{m.value}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { href: "/knowledge", label: "Upload Document" },
          { href: "/survivors", label: "Register Survivor" },
          { href: "/shelters", label: "Add Shelter" },
          { href: "/tutorials", label: "Add Tutorial" },
        ].map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className="rounded border border-amber-700/40 bg-amber-950/30 px-4 py-2 text-sm text-amber-500 transition-colors hover:bg-amber-950/50"
          >
            {action.label}
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded border border-amber-900/30 bg-zinc-900/30 p-5">
          <h3 className="mb-4 font-mono text-xs tracking-widest text-amber-500">
            RECENT ACTIVITY
          </h3>
          <div className="space-y-2">
            {activity.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm"
              >
                <div>
                  <span className="text-xs text-zinc-500">{item.type}</span>
                  <p className="text-zinc-300">{item.name}</p>
                </div>
                <span className="text-xs text-zinc-600">{formatDate(item.date.toISOString())}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded border border-emerald-900/30 bg-zinc-900/30 p-5">
          <h3 className="mb-4 font-mono text-xs tracking-widest text-emerald-500">
            CROSS-SECTOR API STATUS
          </h3>
          <div className="space-y-2 font-mono text-sm">
            {[
              { endpoint: "GET /api/knowledge?tag=medical", sector: "PULSE" },
              { endpoint: "GET /api/knowledge?tag=agricultural", sector: "HARVEST" },
              { endpoint: "GET /api/skills", sector: "ALL SECTORS" },
              { endpoint: "GET /api/shelters", sector: "NEXUS" },
              { endpoint: "GET /api/tutorials?category=first-aid", sector: "PULSE" },
            ].map((api) => (
              <div
                key={api.endpoint}
                className="flex items-center justify-between rounded border border-zinc-800 bg-zinc-950/50 px-3 py-2"
              >
                <span className="text-zinc-400">{api.endpoint}</span>
                <span className="text-xs text-emerald-500">{api.sector}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
