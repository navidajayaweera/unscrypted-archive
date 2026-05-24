import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import type { Knowledge } from "@/types";

type Props = { params: Promise<{ id: string }> };

export default async function KnowledgeDetailPage({ params }: Props) {
  const { id } = await params;

  let doc: Knowledge;
  try {
    doc = await fetchApi<Knowledge>(`/api/knowledge/${id}`);
  } catch {
    notFound();
  }

  const firstTag = doc.tags.split(",")[0]?.trim();
  const allWithTag = firstTag
    ? await fetchApi<Knowledge[]>(`/api/knowledge?tag=${firstTag}`)
    : [];
  const related = allWithTag.filter((r) => r.id !== doc.id).slice(0, 3);

  return (
    <div className="space-y-6">
      <Link href="/knowledge" className="text-sm text-zinc-500 hover:text-amber-500">
        ← Back to Knowledge Base
      </Link>

      <div>
        <h2 className="font-mono text-xl font-bold text-amber-500">{doc.title}</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {doc.tags.split(",").map((t) => (
            <span
              key={t}
              className="rounded border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400"
            >
              {t.trim()}
            </span>
          ))}
        </div>
        <p className="mt-2 text-xs text-zinc-600">
          Uploaded {formatDate(doc.uploadedAt)}
        </p>
      </div>

      <div className="rounded border border-amber-900/30 bg-zinc-900/40 p-5">
        <p className="font-sans text-sm leading-relaxed text-zinc-300">{doc.description}</p>
      </div>

      {doc.filePath && (
        <a
          href={doc.filePath}
          download
          className="inline-block rounded border border-emerald-700/40 bg-emerald-950/30 px-4 py-2 text-sm text-emerald-500 hover:bg-emerald-950/50"
        >
          Download File
        </a>
      )}

      {related.length > 0 && (
        <section>
          <h3 className="mb-3 font-mono text-xs tracking-widest text-zinc-500">
            RELATED DOCUMENTS
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/knowledge/${r.id}`}
                className="rounded border border-zinc-800 bg-zinc-900/40 p-3 text-sm text-zinc-300 hover:border-amber-900/40"
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
