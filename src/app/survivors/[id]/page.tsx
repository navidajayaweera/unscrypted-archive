import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDate, SKILL_COLORS } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function SurvivorDetailPage({ params }: Props) {
  const { id } = await params;

  if (id.startsWith("demo-")) {
    const { DEMO_SURVIVORS } = await import("@/lib/demo-data");
    const survivor = DEMO_SURVIVORS.find((s) => s.id === id);
    if (!survivor) notFound();
    return <SurvivorView survivor={survivor} isDemo />;
  }

  const survivor = await prisma.survivor.findUnique({
    where: { id },
    include: { skills: true },
  });
  if (!survivor) notFound();

  return (
    <SurvivorView
      survivor={{
        ...survivor,
        registeredAt: survivor.registeredAt.toISOString(),
        skills: survivor.skills,
      }}
    />
  );
}

type SurvivorData = {
  id: string;
  name: string;
  age: number;
  sector: string;
  registeredAt: string;
  skills: { id: string; name: string; category: string; survivorId: string }[];
};

function SurvivorView({ survivor, isDemo }: { survivor: SurvivorData; isDemo?: boolean }) {
  const grouped = survivor.skills.reduce<Record<string, typeof survivor.skills>>(
    (acc, skill) => {
      (acc[skill.category] ??= []).push(skill);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <Link href="/survivors" className="text-xs font-mono text-zinc-600 hover:text-amber-500 transition-colors">
          ← SURVIVOR REGISTRY
        </Link>
        {isDemo && (
          <span className="rounded border border-amber-800/40 bg-amber-950/30 px-2 py-0.5 text-[10px] tracking-widest text-amber-700">
            DEMO
          </span>
        )}
      </div>

      <div className="card-glow rounded border border-amber-900/25 bg-zinc-900/40 p-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-amber-700 text-xs">◎</span>
              <h2 className="font-mono text-xl font-bold text-amber-500 glow-amber">
                {survivor.name}
              </h2>
            </div>
            <span className="inline-block rounded border border-amber-700/40 bg-amber-950/30 px-2 py-0.5 text-[10px] font-mono text-amber-500">
              {survivor.sector}
            </span>
          </div>
          <span className="rounded border border-emerald-700/40 bg-emerald-950/30 px-3 py-1 text-xs font-mono text-emerald-500 glow-green">
            ● ACTIVE
          </span>
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800/60 flex gap-6 text-[11px] font-mono text-zinc-500">
          <span>AGE: <span className="text-zinc-300">{survivor.age}</span></span>
          <span>
            REGISTERED:{" "}
            <span className="text-zinc-300">{formatDate(survivor.registeredAt)}</span>
          </span>
          <span>
            SKILLS:{" "}
            <span className="text-amber-500">{survivor.skills.length}</span>
          </span>
        </div>
      </div>

      <section>
        <p className="mb-4 text-[10px] font-mono tracking-[0.2em] text-zinc-600">
          SKILL PROFILE
        </p>
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category} className="rounded border border-zinc-800/60 bg-zinc-900/30 p-4">
              <p className="mb-3 text-[10px] font-mono tracking-widest text-zinc-600 uppercase">
                [{category}]
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.map((sk) => (
                  <span
                    key={sk.id}
                    className={`rounded border px-3 py-1 text-xs font-mono ${
                      SKILL_COLORS[sk.category] ?? "border-zinc-700 text-zinc-400"
                    }`}
                  >
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(grouped).length === 0 && (
            <p className="text-xs text-zinc-700 font-mono">— NO SKILLS REGISTERED —</p>
          )}
        </div>
      </section>
    </div>
  );
}
