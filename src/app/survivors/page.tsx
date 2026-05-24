"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import { formatDate, inputClass, labelClass, SKILL_COLORS } from "@/lib/utils";
import type { Survivor } from "@/types";

const CATEGORIES = ["All", "Medical", "Construction", "Farming", "Tech", "Engineering"];

type SkillEntry = { name: string; category: string };

export default function SurvivorsPage() {
  const [survivors, setSurvivors] = useState<Survivor[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: "", age: "", sector: "" });
  const [skills, setSkills] = useState<SkillEntry[]>([{ name: "", category: "medical" }]);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const skill = activeCategory === "All" ? "" : activeCategory.toLowerCase();
    const url = skill ? `/api/survivors?skill=${skill}` : "/api/survivors";
    const res = await fetch(url);
    setSurvivors(await res.json());
  }, [activeCategory]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = survivors.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/survivors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        age: Number(form.age),
        sector: form.sector,
        skills: skills.filter((s) => s.name.trim()),
      }),
    });
    setModalOpen(false);
    setForm({ name: "", age: "", sector: "" });
    setSkills([{ name: "", category: "medical" }]);
    setSubmitting(false);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg font-bold text-amber-500">Survivor Registry</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded border border-amber-700/40 bg-amber-950/30 px-4 py-2 text-sm text-amber-500 hover:bg-amber-950/50"
        >
          Register Survivor
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name..."
        className={inputClass}
      />

      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded px-3 py-1 text-xs transition-colors ${
              activeCategory === cat
                ? "bg-amber-500/20 text-amber-500"
                : "border border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <Link
            key={s.id}
            href={`/survivors/${s.id}`}
            className="rounded border border-amber-900/30 bg-zinc-900/40 p-4 transition-colors hover:border-amber-700/40"
          >
            <h3 className="font-mono text-sm font-bold text-zinc-200">{s.name}</h3>
            <p className="mt-1 text-xs text-zinc-500">{s.sector}</p>
            <p className="mt-1 text-xs text-zinc-600">
              {s.skills.length} skill{s.skills.length !== 1 ? "s" : ""}
            </p>
            <div className="mt-3 flex flex-wrap gap-1">
              {s.skills.slice(0, 3).map((sk) => (
                <span
                  key={sk.id}
                  className={`rounded border px-2 py-0.5 text-xs ${SKILL_COLORS[sk.category] ?? "border-zinc-700 text-zinc-400"}`}
                >
                  {sk.name}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="REGISTER SURVIVOR">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>NAME</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>AGE</label>
              <input
                required
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>SECTOR</label>
              <input
                required
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>SKILLS</label>
            {skills.map((sk, i) => (
              <div key={i} className="mb-2 flex gap-2">
                <input
                  placeholder="Skill name"
                  value={sk.name}
                  onChange={(e) => {
                    const next = [...skills];
                    next[i].name = e.target.value;
                    setSkills(next);
                  }}
                  className={inputClass}
                />
                <select
                  value={sk.category}
                  onChange={(e) => {
                    const next = [...skills];
                    next[i].category = e.target.value;
                    setSkills(next);
                  }}
                  className={inputClass}
                >
                  {["medical", "construction", "farming", "tech", "engineering"].map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setSkills([...skills, { name: "", category: "medical" }])}
              className="text-xs text-amber-500 hover:text-amber-400"
            >
              + Add skill
            </button>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded border border-amber-700/40 bg-amber-950/30 py-2 text-sm text-amber-500 hover:bg-amber-950/50 disabled:opacity-50"
          >
            {submitting ? "Registering..." : "Register"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
