import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { prisma } from "@/lib/db";
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export default async function TutorialDetailPage({ params }: Props) {
  const { id } = await params;

  if (id.startsWith("demo-")) {
    const { DEMO_TUTORIALS } = await import("@/lib/demo-data");
    const tutorial = DEMO_TUTORIALS.find((t) => t.id === id);
    if (!tutorial) notFound();
    const related = DEMO_TUTORIALS.filter(
      (t) => t.id !== id && t.category === tutorial.category
    ).slice(0, 3);
    return <TutorialView tutorial={tutorial} related={related} isDemo />;
  }

  const tutorial = await prisma.tutorial.findUnique({ where: { id } });
  if (!tutorial) notFound();

  const related = await prisma.tutorial.findMany({
    where: { category: tutorial.category, NOT: { id: tutorial.id } },
    take: 3,
  });

  return (
    <TutorialView
      tutorial={{ ...tutorial, createdAt: tutorial.createdAt.toISOString() }}
      related={related.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }))}
    />
  );
}

type TutorialData = {
  id: string;
  title: string;
  category: string;
  content: string;
  difficulty: string;
  createdAt: string;
};

function TutorialView({
  tutorial,
  related,
  isDemo,
}: {
  tutorial: TutorialData;
  related: TutorialData[];
  isDemo?: boolean;
}) {
  const DIFF_ICON: Record<string, string> = {
    beginner: "▲",
    intermediate: "▲▲",
    advanced: "▲▲▲",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-2">
        <Link href="/tutorials" className="text-xs font-mono text-zinc-600 hover:text-amber-500 transition-colors">
          ← TUTORIALS
        </Link>
        {isDemo && (
          <span className="rounded border border-amber-800/40 bg-amber-950/30 px-2 py-0.5 text-[10px] tracking-widest text-amber-700">
            DEMO
          </span>
        )}
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-amber-700 text-xs">◇</span>
          <h2 className="font-mono text-xl font-bold text-amber-500 glow-amber">{tutorial.title}</h2>
        </div>
        <div className="flex gap-2">
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-mono ${
              CATEGORY_COLORS[tutorial.category] ?? "border-zinc-700 text-zinc-400"
            }`}
          >
            {tutorial.category.toUpperCase()}
          </span>
          <span
            className={`rounded border px-2 py-0.5 text-[10px] font-mono capitalize flex items-center gap-1 ${
              DIFFICULTY_COLORS[tutorial.difficulty] ?? "border-zinc-700 text-zinc-400"
            }`}
          >
            <span>{DIFF_ICON[tutorial.difficulty] ?? "▲"}</span>
            {tutorial.difficulty}
          </span>
        </div>
      </div>

      <article className="prose-archive card-glow rounded border border-amber-900/25 bg-zinc-900/40 p-6">
        <ReactMarkdown>{tutorial.content}</ReactMarkdown>
      </article>

      {related.length > 0 && (
        <section>
          <p className="mb-3 text-[10px] font-mono tracking-[0.2em] text-zinc-600">RELATED TUTORIALS</p>
          <div className="grid gap-2 sm:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.id}
                href={`/tutorials/${r.id}`}
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
