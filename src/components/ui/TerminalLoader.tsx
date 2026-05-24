"use client";

import { useEffect, useState } from "react";

interface TerminalLoaderProps {
  /** e.g. "KNOWLEDGE_BASE", "SURVIVOR_REGISTRY" */
  label: string;
  /** e.g. "/api/knowledge" */
  endpoint: string;
}

const FRAMES = ["▰▱▱▱▱▱▱▱", "▰▰▱▱▱▱▱▱", "▰▰▰▱▱▱▱▱", "▰▰▰▰▱▱▱▱", "▰▰▰▰▰▱▱▱", "▰▰▰▰▰▰▱▱", "▰▰▰▰▰▰▰▱", "▰▰▰▰▰▰▰▰"];

export default function TerminalLoader({ label, endpoint }: TerminalLoaderProps) {
  const lines = [
    `> INIT ARCHIVE_SYS QUERY`,
    `> TARGET  :: ${endpoint}`,
    `> MODULE  :: ${label}`,
    `> CIPHER  :: AES-256 // handshake OK`,
    `> STATUS  :: FETCHING RECORDS...`,
  ];

  const [visibleCount, setVisibleCount] = useState(0);
  const [frameIdx, setFrameIdx]         = useState(0);
  const [dotCount, setDotCount]         = useState(0);

  // Reveal lines one by one
  useEffect(() => {
    if (visibleCount >= lines.length) return;
    const t = setTimeout(() => setVisibleCount((n) => n + 1), 180);
    return () => clearTimeout(t);
  }, [visibleCount, lines.length]);

  // Progress bar animation
  useEffect(() => {
    const t = setInterval(() => setFrameIdx((i) => (i + 1) % FRAMES.length), 130);
    return () => clearInterval(t);
  }, []);

  // Cursor dots
  useEffect(() => {
    const t = setInterval(() => setDotCount((d) => (d + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);

  const progress = Math.round((frameIdx / (FRAMES.length - 1)) * 100);

  return (
    <div className="rounded border border-zinc-800/70 bg-zinc-950/60 p-5 font-mono space-y-1 min-h-[160px]">
      {lines.slice(0, visibleCount).map((line, i) => (
        <p
          key={i}
          className={`text-[11px] leading-relaxed ${
            i === lines.length - 1
              ? "text-amber-400"
              : i < 2
              ? "text-zinc-500"
              : "text-zinc-600"
          }`}
        >
          {line}
        </p>
      ))}

      {visibleCount >= lines.length && (
        <div className="pt-2 space-y-1.5">
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-zinc-600">PROGRESS</span>
            <span className="text-amber-500 text-[11px] tracking-widest">{FRAMES[frameIdx]}</span>
            <span className="text-[11px] text-zinc-600">{progress}%</span>
          </div>
          <p className="text-[11px] text-amber-500">
            {`> AWAITING RESPONSE`}
            <span className="text-amber-400">{".".repeat(dotCount)}</span>
            <span className="animate-pulse">█</span>
          </p>
        </div>
      )}
    </div>
  );
}
