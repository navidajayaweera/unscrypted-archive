"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import {
  CATEGORY_COLORS,
  DIFFICULTY_COLORS,
  excerpt,
  inputClass,
  labelClass,
} from "@/lib/utils";
import type { Tutorial } from "@/types";

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "First Aid", value: "first-aid" },
  { label: "Survival", value: "survival" },
  { label: "Shelter", value: "shelter" },
  { label: "Food", value: "food" },
  { label: "Defense", value: "defense" },
];

export default function TutorialsPage() {
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "first-aid",
    content: "",
    difficulty: "beginner",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const url = activeCategory
      ? `/api/tutorials?category=${activeCategory}`
      : "/api/tutorials";
    const res = await fetch(url);
    setTutorials(await res.json());
  }, [activeCategory]);

  useEffect(() => {
    load();
  }, [load]);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg font-bold text-amber-500">Survival Tutorials</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded border border-amber-700/40 bg-amber-950/30 px-4 py-2 text-sm text-amber-500 hover:bg-amber-950/50"
        >
          Add Tutorial
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => setActiveCategory(cat.value)}
            className={`rounded px-3 py-1 text-xs transition-colors ${
              activeCategory === cat.value
                ? "bg-amber-500/20 text-amber-500"
                : "border border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tutorials.map((t) => (
          <Link
            key={t.id}
            href={`/tutorials/${t.id}`}
            className="rounded border border-amber-900/30 bg-zinc-900/40 p-4 transition-colors hover:border-amber-700/40"
          >
            <h3 className="font-mono text-sm font-bold text-zinc-200">{t.title}</h3>
            <div className="mt-2 flex gap-2">
              <span
                className={`rounded border px-2 py-0.5 text-xs ${CATEGORY_COLORS[t.category] ?? "border-zinc-700 text-zinc-400"}`}
              >
                {t.category}
              </span>
              <span
                className={`rounded border px-2 py-0.5 text-xs capitalize ${DIFFICULTY_COLORS[t.difficulty] ?? "border-zinc-700 text-zinc-400"}`}
              >
                {t.difficulty}
              </span>
            </div>
            <p className="mt-3 font-sans text-xs text-zinc-500">
              {excerpt(t.content.replace(/[#*`]/g, ""))}
            </p>
          </Link>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="ADD TUTORIAL">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>CATEGORY</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={inputClass}
              >
                {CATEGORIES.filter((c) => c.value).map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
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
              placeholder="# Title&#10;&#10;## Section&#10;Content here..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded border border-amber-700/40 bg-amber-950/30 py-2 text-sm text-amber-500 hover:bg-amber-950/50 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Tutorial"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
