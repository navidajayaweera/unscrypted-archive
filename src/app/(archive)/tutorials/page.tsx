"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { CATEGORY_COLORS, DIFFICULTY_COLORS, excerpt, inputClass, labelClass } from "@/lib/utils";
import { DEMO_TUTORIALS } from "@/lib/demo-data";
import type { Tutorial } from "@/types";

const CATEGORIES = [
  { label: "All",       value: "" },
  { label: "First Aid", value: "first-aid" },
  { label: "Survival",  value: "survival" },
  { label: "Shelter",   value: "shelter" },
  { label: "Food",      value: "food" },
  { label: "Defense",   value: "defense" },
];

const DIFF_ICON: Record<string, string> = {
  beginner: "▲",
  intermediate: "▲▲",
  advanced: "▲▲▲",
};

export default function TutorialsPage() {
  const [tutorials, setTutorials]       = useState<Tutorial[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [modalOpen, setModalOpen]       = useState(false);
  const [isDemo, setIsDemo]             = useState(false);
  const [form, setForm]                 = useState({
    title: "", category: "first-aid", content: "", difficulty: "beginner",
  });
  const [submitting, setSubmitting]     = useState(false);

  const load = useCallback(async () => {
    try {
      const url = activeCategory
        ? `/api/tutorials?category=${activeCategory}`
        : "/api/tutorials";
      const res = await fetch(url);
      if (!res.ok) throw new Error("api-error");
      const data: Tutorial[] = await res.json();
      if (data.length === 0) {
        const filtered = activeCategory
          ? DEMO_TUTORIALS.filter((t) => t.category === activeCategory)
          : DEMO_TUTORIALS;
        setTutorials(filtered);
        setIsDemo(true);
      } else {
        setTutorials(data);
        setIsDemo(false);
      }
    } catch {
      setTutorials(DEMO_TUTORIALS);
      setIsDemo(true);
    }
  }, [activeCategory]);

  useEffect(() => { load(); }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/tutorials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setModalOpen(false);
    setForm({ title: "", category: "first-aid", content: "", difficulty: "beginner" });
    setSubmitting(false);
    load();
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-700 text-xs">◇</span>
            <h2 className="font-mono text-base font-bold tracking-widest text-amber-500 glow-amber">
              SURVIVAL TUTORIALS
            </h2>
            {isDemo && (
              <span className="rounded border border-amber-800/40 bg-amber-950/30 px-2 py-0.5 text-[10px] tracking-widest text-amber-700">
                DEMO
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-zinc-600">
            {tutorials.length} tutorial{tutorials.length !== 1 ? "s" : ""} archived
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded border border-amber-700/40 bg-amber-950/20 px-4 py-2 text-xs font-mono text-amber-500 transition-all hover:bg-amber-950/40"
        >
          &gt; ADD TUTORIAL
        </button>
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.value)}
            className={`rounded px-3 py-1 text-[11px] font-mono tracking-wider transition-all ${
              activeCategory === cat.value
                ? "bg-amber-500/15 text-amber-400 border border-amber-700/50 glow-amber"
                : "border border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
            }`}
          >
            {cat.label.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((t) => (
          <Link
            key={t.id}
            href={`/tutorials/${t.id}`}
            className="card-glow group rounded border border-amber-900/20 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-amber-800/40 block"
          >
            <h3 className="font-mono text-sm font-bold text-zinc-200 group-hover:text-amber-400 transition-colors mb-2">
              {t.title}
            </h3>
            <div className="flex gap-2 mb-3">
              <span
                className={`rounded border px-2 py-0.5 text-[10px] font-mono ${
                  CATEGORY_COLORS[t.category] ?? "border-zinc-700 text-zinc-400"
                }`}
              >
                {t.category.toUpperCase()}
              </span>
              <span
                className={`rounded border px-2 py-0.5 text-[10px] font-mono capitalize flex items-center gap-1 ${
                  DIFFICULTY_COLORS[t.difficulty] ?? "border-zinc-700 text-zinc-400"
                }`}
              >
                <span>{DIFF_ICON[t.difficulty] ?? "▲"}</span>
                {t.difficulty}
              </span>
            </div>
            <p className="font-sans text-xs text-zinc-500 leading-relaxed">
              {excerpt(t.content.replace(/[#*`]/g, ""))}
            </p>
          </Link>
        ))}
        {tutorials.length === 0 && (
          <div className="col-span-3 py-12 text-center text-xs text-zinc-700 font-mono">
            — NO TUTORIALS FOUND —
          </div>
        )}
      </div>

      {/* Add tutorial modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="ADD TUTORIAL">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>TITLE</label>
            <input
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Tutorial title"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>CATEGORY</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.filter((c) => c.value).map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>DIFFICULTY</label>
              <select
                value={form.difficulty}
                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                className={inputClass}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>CONTENT (MARKDOWN)</label>
            <textarea
              required
              rows={8}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className={inputClass}
              placeholder="## Section&#10;&#10;Content here..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded border border-amber-700/40 bg-amber-950/20 py-2 text-xs font-mono text-amber-500 hover:bg-amber-950/40 disabled:opacity-50 transition-all"
          >
            {submitting ? "ADDING..." : "> ADD TUTORIAL"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
