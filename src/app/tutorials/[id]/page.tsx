import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/db";
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function TutorialDetailPage({ params }: Props) {
  const { id } = await params;
  const tutorial = await prisma.tutorial.findUnique({ where: { id } });
  if (!tutorial) notFound();

  const related = await prisma.tutorial.findMany({
    where: { category: tutorial.category, NOT: { id: tutorial.id } },
    take: 3,
  });

  return (
    <div className="space-y-6">
      <Link href="/tutorials" className="text-sm text-zinc-500 hover:text-amber-500">
        ← Back to Tutorials
      </Link>

      <div>
        <h2 className="font-mono text-xl font-bold text-amber-500">{tutorial.title}</h2>
        <div className="mt-2 flex gap-2">
          <span
            className={`rounded border px-2 py-0.5 text-xs ${CATEGORY_COLORS[tutorial.category] ?? "border-zinc-700 text-zinc-400"}`}
          >
            {tutorial.category}
          </span>
          <span
            className={`rounded border px-2 py-0.5 text-xs capitalize ${DIFFICULTY_COLORS[tutorial.difficulty] ?? "border-zinc-700 text-zinc-400"}`}
          >
            {tutorial.difficulty}
          </span>
        </div>
      </div>

      <article className="prose-archive rounded border border-amber-900/30 bg-zinc-900/40 p-6">
        <ReactMarkdown>{tutorial.content}</ReactMarkdown>
      </article>

      {related.length > 0 && (
        <section>
          <h3 className="mb-3 font-mono text-xs tracking-widest text-zinc-500">
            RELATED TUTORIALS
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/tutorials/${r.id}`}
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
