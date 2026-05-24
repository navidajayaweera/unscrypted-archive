"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { inputClass, labelClass, STATUS_COLORS } from "@/lib/utils";
import { DEMO_SHELTERS } from "@/lib/demo-data";
import type { Shelter } from "@/types";

const STATUSES = ["All", "Active", "Full", "Abandoned"];

const STATUS_ICON: Record<string, string> = {
  active: "●",
  full: "◆",
  abandoned: "○",
};

export default function SheltersPage() {
  const [shelters, setShelters]       = useState<Shelter[]>([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [modalOpen, setModalOpen]     = useState(false);
  const [isDemo, setIsDemo]           = useState(false);
  const [form, setForm]               = useState({
    name: "", description: "", lat: "", lng: "", capacity: "", status: "active",
  });
  const [submitting, setSubmitting]   = useState(false);

  const load = useCallback(async () => {
    try {
      const res  = await fetch("/api/shelters");
      if (!res.ok) throw new Error("api-error");
      const data: Shelter[] = await res.json();
      if (data.length === 0) {
        setShelters(DEMO_SHELTERS);
        setIsDemo(true);
      } else {
        setShelters(data);
        setIsDemo(false);
      }
    } catch {
      setShelters(DEMO_SHELTERS);
      setIsDemo(true);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered =
    activeStatus === "All"
      ? shelters
      : shelters.filter((s) => s.status === activeStatus.toLowerCase());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/shelters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        lat: Number(form.lat),
        lng: Number(form.lng),
        capacity: Number(form.capacity),
      }),
    });
    setModalOpen(false);
    setForm({ name: "", description: "", lat: "", lng: "", capacity: "", status: "active" });
    setSubmitting(false);
    load();
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-amber-700 text-xs">◆</span>
            <h2 className="font-mono text-base font-bold tracking-widest text-amber-500 glow-amber">
              SHELTER LOCATIONS
            </h2>
            {isDemo && (
              <span className="rounded border border-amber-800/40 bg-amber-950/30 px-2 py-0.5 text-[10px] tracking-widest text-amber-700">
                DEMO
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-zinc-600">
            {filtered.length} location{filtered.length !== 1 ? "s" : ""} on record
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded border border-amber-700/40 bg-amber-950/20 px-4 py-2 text-xs font-mono text-amber-500 transition-all hover:bg-amber-950/40"
        >
          &gt; ADD SHELTER
        </button>
      </div>

      {/* Status filters */}
      <div className="flex flex-wrap gap-1.5">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`rounded px-3 py-1 text-[11px] font-mono tracking-wider transition-all ${
              activeStatus === status
                ? "bg-amber-500/15 text-amber-400 border border-amber-700/50"
                : "border border-zinc-800 text-zinc-600 hover:border-zinc-700 hover:text-zinc-400"
            }`}
          >
            {status.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="card-glow rounded border border-amber-900/20 bg-zinc-900/40 p-4 transition-all duration-200 hover:border-amber-800/40"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-mono text-sm font-bold text-zinc-200 truncate flex-1">
                {s.name}
              </h3>
              <span
                className={`rounded border px-2 py-0.5 text-[10px] font-mono capitalize shrink-0 flex items-center gap-1 ${
                  STATUS_COLORS[s.status] ?? "border-zinc-700 text-zinc-400"
                }`}
              >
                <span>{STATUS_ICON[s.status] ?? "◌"}</span>
                {s.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-3">
              {s.description}
            </p>
            <div className="border-t border-zinc-800/60 pt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[10px] font-mono">
              <div>
                <span className="text-zinc-700">CAPACITY</span>
                <p className="text-zinc-400">{s.capacity} persons</p>
              </div>
              <div>
                <span className="text-zinc-700">COORDS</span>
                <p className="text-zinc-400">
                  {s.lat.toFixed(3)}, {s.lng.toFixed(3)}
                </p>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-3 py-12 text-center text-xs text-zinc-700 font-mono">
            — NO SHELTERS FOUND —
          </div>
        )}
      </div>

      {/* Add shelter modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="ADD SHELTER">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>NAME</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Bunker / Refuge name"
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>LATITUDE</label>
              <input
                required
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
                placeholder="6.9271"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>LONGITUDE</label>
              <input
                required
                type="number"
                step="any"
                value={form.lng}
                onChange={(e) => setForm({ ...form, lng: e.target.value })}
                placeholder="79.8612"
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>CAPACITY</label>
              <input
                required
                type="number"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>STATUS</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={inputClass}
              >
                <option value="active">Active</option>
                <option value="full">Full</option>
                <option value="abandoned">Abandoned</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded border border-amber-700/40 bg-amber-950/20 py-2 text-xs font-mono text-amber-500 hover:bg-amber-950/40 disabled:opacity-50 transition-all"
          >
            {submitting ? "ADDING..." : "> ADD SHELTER"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
