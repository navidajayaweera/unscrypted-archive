"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { DEMO_STATS } from "@/lib/demo-data";
import type { Stats } from "@/types";

const BOOT_LINES = [
  "> ARCHIVE_SYS v4.2.1 ... INITIALIZING",
  "> COLD STORAGE MODULE ... LOADED",
  "> CHECKING DATABASE INTEGRITY ... OK",
  "> DECRYPTION LAYER ... ACTIVE",
  "> CROSS-SECTOR API BRIDGE ... READY",
  "> ARCHIVE SYSTEM ONLINE",
];

const CROSS_SECTOR = [
  { endpoint: "GET /api/knowledge?tag=medical",      sector: "PULSE",      status: "UP" },
  { endpoint: "GET /api/knowledge?tag=agricultural", sector: "HARVEST",    status: "UP" },
  { endpoint: "GET /api/skills",                     sector: "ALL SECTORS",status: "UP" },
  { endpoint: "GET /api/shelters",                   sector: "NEXUS",      status: "UP" },
  { endpoint: "GET /api/tutorials?category=first-aid",sector: "PULSE",     status: "UP" },
];

export default function DashboardPage() {
  const [bootLines, setBootLines]   = useState<string[]>([]);
  const [booted, setBooted]         = useState(false);
  const [stats, setStats]           = useState<Stats | null>(null);
  const [isDemo, setIsDemo]         = useState(false);

  // Boot sequence
  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < BOOT_LINES.length) {
        setBootLines((prev) => [...prev, BOOT_LINES[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => setBooted(true), 350);
      }
    }, 220);
    return () => clearInterval(iv);
  }, []);

  // Load stats after boot
  useEffect(() => {
    if (!booted) return;
    fetch("/api/stats")
      .then((r) => {
        if (!r.ok) throw new Error("stats-error");
        return r.json();
      })
      .then((data: Stats) => {
        // Validate shape — API may return error JSON or empty DB
        const valid =
          Array.isArray(data.recentDocuments) &&
          Array.isArray(data.recentSurvivors);
        const empty =
          !valid ||
          (data.totalDocuments === 0 &&
            data.totalSurvivors === 0 &&
            data.totalShelters === 0);
        if (empty) {
          setStats(DEMO_STATS);
          setIsDemo(true);
        } else {
          setStats(data);
        }
      })
      .catch(() => {
        setStats(DEMO_STATS);
        setIsDemo(true);
      });
  }, [booted]);

  const metrics = stats
    ? [
        { label: "DOCUMENTS",  value: stats.totalDocuments,  color: "text-amber-500" },
        { label: "SURVIVORS",  value: stats.totalSurvivors,  color: "text-amber-500" },
        { label: "SKILLS",     value: stats.totalSkills,     color: "text-amber-400" },
        { label: "SHELTERS",   value: stats.totalShelters,   color: "text-emerald-500"},
        { label: "TUTORIALS",  value: stats.totalTutorials,  color: "text-amber-400" },
      ]
    : null;

  const activity = stats
    ? [
        ...(stats.recentDocuments ?? []).map((d) => ({
          type: "DOC",
          name: d.title,
          date: d.uploadedAt,
          color: "text-amber-500",
        })),
        ...(stats.recentSurvivors ?? []).map((s) => ({
          type: "SURV",
          name: s.name,
          date: s.registeredAt,
          color: "text-emerald-500",
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 8)
    : [];

  // ── Boot screen ──
  if (!booted) {
    return (
      <div className="flex flex-col justify-center min-h-[60vh] space-y-1">
        <p className="text-[10px] tracking-[0.3em] text-zinc-600 mb-4">
          ARCHIVE_SYS BOOTSTRAP SEQUENCE
        </p>
        {bootLines.map((line, i) => (
          <p
            key={i}
            className={`boot-line font-mono text-sm ${
              i === bootLines.length - 1
                ? "text-emerald-400 glow-green"
                : "text-zinc-500"
            }`}
          >
            {line}
          </p>
        ))}
        <span className="text-emerald-400 text-sm cursor-blink">█</span>
      </div>
    );
  }

  // ── Main dashboard ──
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-50" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <h2 className="font-mono text-lg font-bold tracking-wide text-amber-500 glow-amber flicker">
              ARCHIVE SYSTEM — BUNKER COLD STORAGE
            </h2>
          </div>
          <p className="mt-1 ml-6 text-xs text-zinc-600">
            Sector 05 operational status: nominal&nbsp;
            <span className="text-emerald-600">// all subsystems green</span>
          </p>
        </div>
        {isDemo && (
          <span className="rounded border border-amber-700/40 bg-amber-950/30 px-2 py-1 text-[10px] tracking-widest text-amber-600">
            DEMO&nbsp;MODE
          </span>
        )}
      </div>

      {/* Stats bar */}
      {metrics ? (
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <div
              key={m.label}
              className="card-glow rounded border border-amber-900/25 bg-zinc-900/50 p-4 transition-all duration-200"
            >
              <p className="text-[10px] tracking-[0.2em] text-zinc-600">{m.label}</p>
              <p className={`mt-2 font-mono text-3xl font-bold ${m.color} glow-amber`}>
                {String(m.value).padStart(2, "0")}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-3 grid-cols-5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="rounded border border-zinc-800 bg-zinc-900/40 p-4 animate-pulse h-20" />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div>
        <p className="mb-2 text-[10px] tracking-[0.2em] text-zinc-600">QUICK ACTIONS</p>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/knowledge", label: "> UPLOAD DOCUMENT" },
            { href: "/survivors", label: "> REGISTER SURVIVOR" },
            { href: "/shelters",  label: "> ADD SHELTER" },
            { href: "/tutorials", label: "> ADD TUTORIAL" },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded border border-amber-800/40 bg-amber-950/20 px-4 py-2 text-xs font-mono text-amber-500 transition-all hover:bg-amber-950/40 hover:border-amber-600/60 hover:glow-amber"
            >
              {action.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Activity + Cross-sector */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Recent activity */}
        <section className="card-glow rounded border border-amber-900/25 bg-zinc-900/30 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-amber-700">◈</span>
            <h3 className="font-mono text-[10px] tracking-[0.25em] text-amber-500">
              RECENT ACTIVITY
            </h3>
          </div>
          <div className="space-y-1.5">
            {activity.map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded border border-zinc-800/60 bg-zinc-950/60 px-3 py-2 text-sm transition-colors hover:border-zinc-700/60"
              >
                <span className={`text-[10px] font-mono font-bold ${item.color} shrink-0`}>
                  [{item.type}]
                </span>
                <p className="flex-1 text-xs text-zinc-300 truncate">{item.name}</p>
                <span className="text-[10px] text-zinc-700 shrink-0">{formatDate(item.date)}</span>
              </div>
            ))}
            {activity.length === 0 && (
              <p className="text-xs text-zinc-700 text-center py-4">— no activity —</p>
            )}
          </div>
        </section>

        {/* Cross-sector API */}
        <section className="card-glow-green rounded border border-emerald-900/25 bg-zinc-900/30 p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-emerald-700">◉</span>
            <h3 className="font-mono text-[10px] tracking-[0.25em] text-emerald-500">
              CROSS-SECTOR API PANEL
            </h3>
          </div>
          <div className="space-y-1.5 font-mono">
            {CROSS_SECTOR.map((api, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded border border-zinc-800/60 bg-zinc-950/60 px-3 py-2 text-xs"
              >
                <span className="text-emerald-600 text-[10px] shrink-0">▶</span>
                <span className="flex-1 text-zinc-400 truncate">{api.endpoint}</span>
                <span className="shrink-0 text-[10px] text-zinc-600">{api.sector}</span>
                <span className="shrink-0 text-[10px] text-emerald-500 glow-green">{api.status}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
