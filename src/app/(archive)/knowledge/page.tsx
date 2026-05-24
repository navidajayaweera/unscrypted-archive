"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import TerminalLoader from "@/components/ui/TerminalLoader";
import { formatDate, inputClass, labelClass } from "@/lib/utils";
import { DEMO_KNOWLEDGE } from "@/lib/demo-data";
import type { Knowledge } from "@/types";

const TAGS = ["All", "Medical", "Agricultural", "Engineering", "Tech", "Survival"];

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<Knowledge[]>([]);
  const [search, setSearch]       = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [isDemo, setIsDemo]       = useState(false);
  const [loading, setLoading]     = useState(true);
  const [form, setForm]           = useState({ title: "", description: "", tags: "" });
  const [file, setFile]           = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const tag = activeTag === "All" ? "" : activeTag.toLowerCase();
      const url = tag ? `/api/knowledge?tag=${tag}` : "/api/knowledge";
      const res = await fetch(url);
      if (!res.ok) throw new Error("api-error");
      const data: Knowledge[] = await res.json();
      if (data.length === 0) {
        const filtered =
          tag
            ? DEMO_KNOWLEDGE.filter((d) => d.tags.includes(tag))
            : DEMO_KNOWLEDGE;
        setDocuments(filtered);
        setIsDemo(true);
      } else {
        setDocuments(data);
        setIsDemo(false);
      }
    } catch {
      setDocuments(DEMO_KNOWLEDGE);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, [activeTag]);

  useEffect(() => { load(); }, [load]);

  const filtered = documents.filter((d) =>
    d.title.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("description", form.description);
    fd.append("tags", form.tags);
    if (file) fd.append("file", file);
    await fetch("/api/knowledge", { method: "POST", body: fd });
    setModalOpen(false);
    setForm({ title: "", description: "", tags: "" });
    setFile(null);
    setSubmitting(false);
    load();
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-700 text-xs">◉</span>
            <h2 className="font-mono text-base font-bold tracking-widest text-amber-500 glow-amber">
              KNOWLEDGE BASE
            </h2>
            {isDemo && (
              <span className="rounded border border-amber-800/40 bg-amber-950/30 px-2 py-0.5 text-[10px] tracking-widest text-amber-700">
                DEMO
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-zinc-600">
            {filtered.length} record{filtered.length !== 1 ? "s" : ""} indexed
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded border border-amber-700/40 bg-amber-950/20 px-4 py-2 text-xs font-mono text-amber-500 transition-all hover:bg-amber-950/40 hover:border-amber-600/60"
        >
          &gt; UPLOAD DOC
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">▶</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className={`${inputClass} pl-7`}
        />
      </div>

      {/* Tag filters */}
      <div className="flex flex-wrap gap-1.5">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`rounded px-3 py-1 text-[11px] font-mono tracking-wider transition-all ${
              activeTag === tag
                ? "bg-amber-500/15 text-amber-400 border border-amber-700/50 glow-amber"
                : "border border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
            }`}
          >
            {tag.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <TerminalLoader label="KNOWLEDGE_BASE" endpoint="/api/knowledge" />
      ) : null}
      <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${loading ? "hidden" : ""}`}>
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="card-glow group rounded border border-amber-900/20 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-amber-800/40"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <Link href={`/knowledge/${doc.id}`} className="flex-1 min-w-0">
                <h3 className="font-mono text-sm font-bold text-zinc-200 group-hover:text-amber-400 transition-colors truncate">
                  {doc.title}
                </h3>
              </Link>
              <span className="text-amber-900/50 text-xs shrink-0">◈</span>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
              {doc.description}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {doc.tags.split(",").map((t) => (
                <span
                  key={t}
                  className="rounded border border-zinc-800 bg-zinc-900 px-2 py-0.5 text-[10px] font-mono text-zinc-500"
                >
                  {t.trim().toUpperCase()}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-zinc-700 font-mono">{formatDate(doc.uploadedAt)}</span>
              {doc.filePath && (
                <a
                  href={doc.filePath}
                  download
                  className="text-[10px] font-mono text-emerald-600 hover:text-emerald-400 glow-green transition-colors"
                >
                  ⬇ DOWNLOAD
                </a>
              )}
            </div>
          </div>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="col-span-3 py-12 text-center text-xs text-zinc-700 font-mono">
            — NO RECORDS FOUND —
          </div>
        )}
      </div>

      {/* Upload modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="UPLOAD DOCUMENT">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>TITLE</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
              placeholder="Document title"
            />
          </div>
          <div>
            <label className={labelClass}>DESCRIPTION</label>
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className={inputClass}
              placeholder="Brief description..."
            />
          </div>
          <div>
            <label className={labelClass}>TAGS (comma-separated)</label>
            <input
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="medical,engineering"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>FILE ATTACHMENT</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-xs text-zinc-500 file:mr-3 file:rounded file:border file:border-amber-800/40 file:bg-amber-950/20 file:px-3 file:py-1 file:text-xs file:text-amber-500 file:font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded border border-amber-700/40 bg-amber-950/20 py-2 text-xs font-mono text-amber-500 hover:bg-amber-950/40 disabled:opacity-50 transition-all"
          >
            {submitting ? "UPLOADING..." : "> UPLOAD DOCUMENT"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
