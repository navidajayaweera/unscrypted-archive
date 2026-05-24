import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { formatDate, SKILL_COLORS } from "@/lib/utils";
import type { Survivor } from "@/types";

type Props = { params: Promise<{ id: string }> };

export default async function SurvivorDetailPage({ params }: Props) {
  const { id } = await params;

  let survivor: Survivor;
  try {
    survivor = await fetchApi<Survivor>(`/api/survivors/${id}`);
  } catch {
    notFound();
  }

  const grouped = survivor.skills.reduce<Record<string, typeof survivor.skills>>(
    (acc, skill) => {
      (acc[skill.category] ??= []).push(skill);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-6">
      <Link href="/survivors" className="text-sm text-zinc-500 hover:text-amber-500">
        ← Back to Survivor Registry
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-mono text-xl font-bold text-amber-500">{survivor.name}</h2>
          <span className="mt-2 inline-block rounded border border-amber-700/40 bg-amber-950/30 px-2 py-0.5 text-xs text-amber-500">
            {survivor.sector}
          </span>
        </div>
        <span className="rounded border border-emerald-700/40 bg-emerald-950/30 px-3 py-1 text-xs text-emerald-500">
          ACTIVE
        </span>
      </div>

      <div className="flex gap-6 text-sm text-zinc-500">
        <span>Age: {survivor.age}</span>
        <span>Registered: {formatDate(survivor.registeredAt)}</span>
      </div>

      <section>
        <h3 className="mb-4 font-mono text-xs tracking-widest text-zinc-500">SKILLS</h3>
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, skills]) => (
            <div key={category}>
              <p className="mb-2 text-xs uppercase tracking-wider text-zinc-600">{category}</p>
              <div className="flex flex-wrap gap-2">
                {skills.map((sk) => (
                  <span
                    key={sk.id}
                    className={`rounded border px-3 py-1 text-sm ${SKILL_COLORS[sk.category] ?? "border-zinc-700 text-zinc-400"}`}
                  >
                    {sk.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
