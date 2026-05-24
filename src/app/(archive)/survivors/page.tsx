"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Modal from "@/components/ui/Modal";
import TerminalLoader from "@/components/ui/TerminalLoader";
import { formatDate, inputClass, labelClass, SKILL_COLORS } from "@/lib/utils";
import { DEMO_SURVIVORS } from "@/lib/demo-data";
import type { Survivor } from "@/types";

const CATEGORIES = ["All", "Medical", "Construction", "Farming", "Tech", "Engineering"];
type SkillEntry = { name: string; category: string };

export default function SurvivorsPage() {
  const [survivors, setSurvivors]     = useState<Survivor[]>([]);
  const [search, setSearch]           = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [modalOpen, setModalOpen]     = useState(false);
  const [isDemo, setIsDemo]           = useState(false);
  const [loading, setLoading]         = useState(true);
  const [form, setForm]               = useState({ name: "", age: "", sector: "" });
  const [skills, setSkills]           = useState<SkillEntry[]>([{ name: "", category: "medical" }]);
  const [submitting, setSubmitting]   = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const skill = activeCategory === "All" ? "" : activeCategory.toLowerCase();
      const url   = skill ? `/api/survivors?skill=${skill}` : "/api/survivors";
      const res   = await fetch(url);
      if (!res.ok) throw new Error("api-error");
      const data: Survivor[] = await res.json();
      if (data.length === 0) {
        const filtered = skill
          ? DEMO_SURVIVORS.filter((s) =>
              s.skills.some((sk) => sk.category === skill)
            )
          : DEMO_SURVIVORS;
        setSurvivors(filtered);
        setIsDemo(true);
      } else {
        setSurvivors(data);
        setIsDemo(false);
      }
    } catch {
      setSurvivors(DEMO_SURVIVORS);
      setIsDemo(true);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  useEffect(() => { load(); }, [load]);

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-700 text-xs">◎</span>
            <h2 className="font-mono text-base font-bold tracking-widest text-amber-500 glow-amber">
              SURVIVOR REGISTRY
            </h2>
            {isDemo && (
              <span className="rounded border border-amber-800/40 bg-amber-950/30 px-2 py-0.5 text-[10px] tracking-widest text-amber-700">
                DEMO
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-zinc-600">
            {filtered.length} survivor{filtered.length !== 1 ? "s" : ""} registered
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded border border-amber-700/40 bg-amber-950/20 px-4 py-2 text-xs font-mono text-amber-500 transition-all hover:bg-amber-950/40"
        >
          &gt; REGISTER SURVIVOR
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 text-xs">▶</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name..."
          className={`${inputClass} pl-7`}
        />
      </div>

      {/* Category filters */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded px-3 py-1 text-[11px] font-mono tracking-wider transition-all ${
              activeCategory === cat
                ? "bg-amber-500/15 text-amber-400 border border-amber-700/50 glow-amber"
                : "border border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
            }`}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <TerminalLoader label="SURVIVOR_REGISTRY" endpoint="/api/survivors" />
      ) : null}
      <div className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${loading ? "hidden" : ""}`}>
        {filtered.map((s) => (
          <Link
            key={s.id}
            href={`/survivors/${s.id}`}
            className="card-glow group rounded border border-amber-900/20 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-amber-800/40 block"
          >
            <div className="flex items-start justify-between mb-1">
              <h3 className="font-mono text-sm font-bold text-zinc-200 group-hover:text-amber-400 transition-colors">
                {s.name}
              </h3>
              <span className="rounded border border-emerald-800/40 bg-emerald-950/30 px-1.5 py-0.5 text-[10px] font-mono text-emerald-600 shrink-0">
                ACTIVE
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 font-mono mb-3">
              {s.sector}
            </p>
            <div className="flex flex-wrap gap-1 mb-3">
              {s.skills.slice(0, 3).map((sk) => (
                <span
                  key={sk.id}
                  className={`rounded border px-2 py-0.5 text-[10px] font-mono ${
                    SKILL_COLORS[sk.category] ?? "border-zinc-700 text-zinc-400"
                  }`}
                >
                  {sk.name}
                </span>
              ))}
              {s.skills.length > 3 && (
                <span className="rounded border border-zinc-800 px-2 py-0.5 text-[10px] font-mono text-zinc-600">
                  +{s.skills.length - 3}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-700">
              <span>{s.skills.length} skill{s.skills.length !== 1 ? "s" : ""}</span>
              <span>{formatDate(s.registeredAt)}</span>
            </div>
          </Link>
        ))}
        {!loading && filtered.length === 0 && (
          <div className="col-span-3 py-12 text-center text-xs text-zinc-700 font-mono">
            — NO SURVIVORS FOUND —
          </div>
        )}
      </div>

      {/* Register modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="REGISTER SURVIVOR">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>NAME</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={inputClass}
              placeholder="Full name"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
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
                placeholder="Sector X"
                className={inputClass}
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>SKILLS</label>
            <div className="space-y-2">
              {skills.map((sk, i) => (
                <div key={i} className="flex gap-2">
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
                    className={`${inputClass} shrink-0 w-36`}
                  >
                    {["medical", "construction", "farming", "tech", "engineering"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setSkills([...skills, { name: "", category: "medical" }])}
              className="mt-2 text-[11px] font-mono text-amber-600 hover:text-amber-400 transition-colors"
            >
              + ADD SKILL
            </button>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded border border-amber-700/40 bg-amber-950/20 py-2 text-xs font-mono text-amber-500 hover:bg-amber-950/40 disabled:opacity-50 transition-all"
          >
            {submitting ? "REGISTERING..." : "> REGISTER"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
