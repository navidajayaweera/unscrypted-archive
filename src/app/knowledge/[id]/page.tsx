import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function KnowledgeDetailPage({ params }: Props) {
  const { id } = await params;

  // Demo data fallback for demo IDs
  const isDemoId = id.startsWith("demo-");
  if (isDemoId) {
    const { DEMO_KNOWLEDGE } = await import("@/lib/demo-data");
    const doc = DEMO_KNOWLEDGE.find((d) => d.id === id);
    if (!doc) notFound();
    const related = DEMO_KNOWLEDGE.filter(
      (d) => d.id !== id && d.tags.split(",").some((t) => doc.tags.includes(t.trim()))
    ).slice(0, 3);

    return <KnowledgeView doc={doc} related={related} isDemo />;
  }

  const doc = await prisma.knowledge.findUnique({ where: { id } });
  if (!doc) notFound();

  const firstTag = doc.tags.split(",")[0]?.trim();
  const related = firstTag
    ? await prisma.knowledge.findMany({
        where: { tags: { contains: firstTag }, NOT: { id: doc.id } },
        take: 3,
      })
    : [];

  return (
    <KnowledgeView
      doc={{ ...doc, uploadedAt: doc.uploadedAt.toISOString() }}
      related={related.map((r) => ({ ...r, uploadedAt: r.uploadedAt.toISOString() }))}
    />
  );
}

function KnowledgeView({
  doc,
  related,
  isDemo,
}: {
  doc: { id: string; title: string; description: string; filePath: string; tags: string; uploadedAt: string };
  related: { id: string; title: string }[];
  isDemo?: boolean;
}) {
  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Link href="/knowledge" className="text-xs font-mono text-zinc-600 hover:text-amber-500 transition-colors">
          ← KNOWLEDGE BASE
        </Link>
        {isDemo && (
          <span className="rounded border border-amber-800/40 bg-amber-950/30 px-2 py-0.5 text-[10px] tracking-widest text-amber-700">
            DEMO
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-amber-700 text-xs">◈</span>
          <h2 className="font-mono text-xl font-bold text-amber-500 glow-amber">{doc.title}</h2>
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {doc.tags.split(",").map((t) => (
            <span
              key={t}
              className="rounded border border-zinc-700 bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-500"
            >
              {t.trim().toUpperCase()}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[10px] font-mono text-zinc-700">
          UPLOADED {formatDate(doc.uploadedAt).toUpperCase()}
        </p>
      </div>

      <div className="card-glow rounded border border-amber-900/25 bg-zinc-900/40 p-5">
        <p className="text-[10px] font-mono text-zinc-600 mb-3 tracking-widest">DESCRIPTION</p>
        <p className="font-sans text-sm leading-relaxed text-zinc-300">{doc.description}</p>
      </div>

      {doc.filePath && (
        <a
          href={doc.filePath}
          download
          className="inline-flex items-center gap-2 rounded border border-emerald-700/40 bg-emerald-950/20 px-4 py-2 text-xs font-mono text-emerald-500 hover:bg-emerald-950/40 transition-all glow-green"
        >
          ⬇ DOWNLOAD FILE
        </a>
      )}

      {related.length > 0 && (
        <section>
          <p className="mb-3 text-[10px] font-mono tracking-[0.2em] text-zinc-600">RELATED DOCUMENTS</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/knowledge/${r.id}`}
                className="rounded border border-zinc-800 bg-zinc-900/40 p-3 text-xs font-mono text-zinc-400 hover:border-amber-900/40 hover:text-amber-400 transition-all"
              >
                {r.title}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
