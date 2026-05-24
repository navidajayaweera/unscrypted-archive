"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import { inputClass, labelClass, STATUS_COLORS } from "@/lib/utils";
import type { Shelter } from "@/types";

const STATUSES = ["All", "Active", "Full", "Abandoned"];

export default function SheltersPage() {
  const [shelters, setShelters] = useState<Shelter[]>([]);
  const [activeStatus, setActiveStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    lat: "",
    lng: "",
    capacity: "",
    status: "active",
  });
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/shelters");
    setShelters(await res.json());
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-lg font-bold text-amber-500">Shelter Locations</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded border border-amber-700/40 bg-amber-950/30 px-4 py-2 text-sm text-amber-500 hover:bg-amber-950/50"
        >
          Add Shelter
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setActiveStatus(status)}
            className={`rounded px-3 py-1 text-xs transition-colors ${
              activeStatus === status
                ? "bg-amber-500/20 text-amber-500"
                : "border border-zinc-800 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((s) => (
          <div
            key={s.id}
            className="rounded border border-amber-900/30 bg-zinc-900/40 p-4"
          >
            <div className="flex items-start justify-between">
              <h3 className="font-mono text-sm font-bold text-zinc-200">{s.name}</h3>
              <span
                className={`rounded border px-2 py-0.5 text-xs capitalize ${STATUS_COLORS[s.status] ?? "border-zinc-700 text-zinc-400"}`}
              >
                {s.status}
              </span>
            </div>
            <p className="mt-2 text-xs text-zinc-500 line-clamp-2">{s.description}</p>
            <div className="mt-3 flex justify-between text-xs text-zinc-600">
              <span>Capacity: {s.capacity}</span>
              <span>
                {s.lat.toFixed(4)}, {s.lng.toFixed(4)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="ADD SHELTER">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>LATITUDE</label>
              <input
                required
                type="number"
                step="any"
                value={form.lat}
                onChange={(e) => setForm({ ...form, lat: e.target.value })}
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
                className={inputClass}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
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
            className="w-full rounded border border-amber-700/40 bg-amber-950/30 py-2 text-sm text-amber-500 hover:bg-amber-950/50 disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Shelter"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
