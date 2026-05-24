"use client";

import { useCallback, useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";
import {
  CONTACT_STATUS_COLORS,
  formatDate,
  inputClass,
  labelClass,
  SECTOR_COLORS,
} from "@/lib/utils";
import type { ContactMessage } from "@/types";

const SECTORS = [
  {
    id: "governance",
    label: "Governance",
    description: "Shelter assignments, resource allocation, and sector coordination.",
  },
  {
    id: "health",
    label: "Health",
    description: "Medical aid, triage requests, and wellness check-ins.",
  },
  {
    id: "harvest",
    label: "Harvest",
    description: "Food supplies, agricultural support, and ration distribution.",
  },
  {
    id: "signal",
    label: "Signal",
    description: "Communications relay, missing persons, and emergency broadcasts.",
  },
] as const;

const CONTACT_TYPES = [
  { value: "shelter", label: "Shelter Request" },
  { value: "medical", label: "Medical Aid" },
  { value: "supplies", label: "Supply Request" },
  { value: "comms", label: "Communications" },
  { value: "general", label: "General Inquiry" },
];

const STATUS_FILTERS = ["All", "Pending", "Acknowledged", "Resolved"];

export default function ContactPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [activeSector, setActiveSector] = useState("All");
  const [activeStatus, setActiveStatus] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    name: "",
    sector: "governance",
    location: "",
    contactType: "general",
    message: "",
  });

  const load = useCallback(async () => {
    const params = new URLSearchParams();
    if (activeSector !== "All") params.set("sector", activeSector);
    if (activeStatus !== "All") params.set("status", activeStatus.toLowerCase());
    const query = params.toString();
    const res = await fetch(`/api/contact${query ? `?${query}` : ""}`);
    setMessages(await res.json());
  }, [activeSector, activeStatus]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSubmitting(false);

    if (res.ok) {
      setModalOpen(false);
      setForm({ name: "", sector: "governance", location: "", contactType: "general", message: "" });
      setSuccess(true);
      load();
      setTimeout(() => setSuccess(false), 4000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-mono text-lg font-bold text-amber-500">Sector Contact Relay</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Reach governance, health, harvest, or signal sectors from any shelter node.
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="rounded border border-amber-700/40 bg-amber-950/30 px-4 py-2 text-sm text-amber-500 hover:bg-amber-950/50"
        >
          Send Message
        </button>
      </div>

      {success && (
        <div className="rounded border border-emerald-700/50 bg-emerald-950/30 px-4 py-3 text-sm text-emerald-400">
          Message relayed to sector command. Await acknowledgment on this channel.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {SECTORS.map((sector) => (
          <button
            key={sector.id}
            type="button"
            onClick={() => {
              setActiveSector(activeSector === sector.id ? "All" : sector.id);
              setForm((f) => ({ ...f, sector: sector.id }));
            }}
            className={`rounded border p-4 text-left transition-colors ${
              activeSector === sector.id
                ? "border-amber-600/60 bg-amber-950/20"
                : "border-amber-900/30 bg-zinc-900/40 hover:border-amber-700/40"
            }`}
          >
            <span
              className={`inline-block rounded border px-2 py-0.5 text-xs ${SECTOR_COLORS[sector.id]}`}
            >
              {sector.label.toUpperCase()}
            </span>
            <p className="mt-2 text-xs text-zinc-500">{sector.description}</p>
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveSector("All")}
          className={`rounded px-3 py-1 text-xs transition-colors ${
            activeSector === "All"
              ? "bg-amber-500/20 text-amber-500"
              : "border border-zinc-800 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          All Sectors
        </button>
        {STATUS_FILTERS.map((status) => (
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

      <div className="space-y-3">
        {messages.length === 0 ? (
          <div className="rounded border border-zinc-800 bg-zinc-900/30 px-4 py-8 text-center text-sm text-zinc-500">
            No messages on this channel. Send a relay to contact a sector or shelter coordinator.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="rounded border border-amber-900/30 bg-zinc-900/40 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-mono text-sm font-bold text-zinc-200">{msg.name}</h3>
                  <p className="mt-1 text-xs text-zinc-500">{msg.location}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded border px-2 py-0.5 text-xs capitalize ${SECTOR_COLORS[msg.sector] ?? "border-zinc-700 text-zinc-400"}`}
                  >
                    {msg.sector}
                  </span>
                  <span className="rounded border border-zinc-700 px-2 py-0.5 text-xs capitalize text-zinc-400">
                    {msg.contactType}
                  </span>
                  <span
                    className={`rounded border px-2 py-0.5 text-xs capitalize ${CONTACT_STATUS_COLORS[msg.status] ?? "border-zinc-700 text-zinc-400"}`}
                  >
                    {msg.status}
                  </span>
                </div>
              </div>
              <p className="mt-3 text-sm text-zinc-400">{msg.message}</p>
              <p className="mt-2 text-xs text-zinc-600">{formatDate(msg.submittedAt)}</p>
            </div>
          ))
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="SEND SECTOR RELAY">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>YOUR NAME</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Survivor or shelter node ID"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>LOCATION</label>
            <input
              required
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              placeholder="Shelter name, coordinates, or sector node"
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>TARGET SECTOR</label>
              <select
                value={form.sector}
                onChange={(e) => setForm({ ...form, sector: e.target.value })}
                className={inputClass}
              >
                {SECTORS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>REQUEST TYPE</label>
              <select
                value={form.contactType}
                onChange={(e) => setForm({ ...form, contactType: e.target.value })}
                className={inputClass}
              >
                {CONTACT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>MESSAGE</label>
            <textarea
              required
              rows={4}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="Describe your request — shelter placement, medical need, supplies, etc."
              className={inputClass}
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded border border-amber-700/40 bg-amber-950/30 py-2 text-sm text-amber-500 hover:bg-amber-950/50 disabled:opacity-50"
          >
            {submitting ? "Relaying..." : "Relay Message"}
          </button>
        </form>
      </Modal>
    </div>
  );
}
