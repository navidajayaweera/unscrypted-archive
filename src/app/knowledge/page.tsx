"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { formatDate, inputClass, labelClass } from "@/lib/utils";
import type { Knowledge } from "@/types";

const TAGS = ["All", "Medical", "Agricultural", "Engineering", "Tech"];

export default function KnowledgePage() {
  const [documents, setDocuments] = useState<Knowledge[]>([]);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", tags: "" });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const tag = activeTag === "All" ? "" : activeTag.toLowerCase();
    const url = tag ? `/api/knowledge?tag=${tag}` : "/api/knowledge";
    const res = await fetch(url);
    setDocuments(await res.json());
  }, [activeTag]);

  useEffect(() => {
    load();
  }, [load]);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg font-bold text-amber-500">Knowledge Base</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded border border-amber-700/40 bg-amber-950/30 px-4 py-2 text-sm text-amber-500 hover:bg-amber-950/50"
        >
          Upload Document
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title..."
        className={inputClass}
      />

      <div className="flex flex-wrap gap-2">
        {TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => setActiveTag(tag)}
            className={`rounded px-3 py-1 text-xs transition-colors ${
              activeTag === tag
                ? "bg-amber-500/20 text-amber-500"
                : "border border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((doc) => (
          <div
            key={doc.id}
            className="rounded border border-amber-900/30 bg-zinc-900/40 p-4"
          >
            <Link href={`/knowledge/${doc.id}`} className="hover:text-amber-400">
              <h3 className="font-mono text-sm font-bold text-zinc-200">{doc.title}</h3>
            </Link>
            <p className="mt-2 text-xs text-zinc-500 line-clamp-2">{doc.description}</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {doc.tags.split(",").map((t) => (
                <span
                  key={t}
                  className="rounded border border-zinc-700 px-2 py-0.5 text-xs text-zinc-400"
                >
                  {t.trim()}
                </span>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-zinc-600">{formatDate(doc.uploadedAt)}</span>
              {doc.filePath && (
                <a
                  href={doc.filePath}
                  download
                  className="text-xs text-emerald-500 hover:text-emerald-400"
                >
                  Download
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="UPLOAD DOCUMENT">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>TITLE</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className={inputClass}
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
            <label className={labelClass}>FILE</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="text-sm text-zinc-400"
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded border border-amber-700/40 bg-amber-950/30 py-2 text-sm text-amber-500 hover:bg-amber-950/50 disabled:opacity-50"
          >
            {submitting ? "Uploading..." : "Upload"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
