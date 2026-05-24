"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const TRANSMISSION_LINES = [
  "> INCOMING TRANSMISSION ... DECRYPTING",
  "> ORIGIN: SECTOR 05 // ARCHIVE NODE",
  "> TIMESTAMP: 2035-03-14T04:17:00Z",
  "> SIGNAL STRENGTH: WEAK — BUNKER RELAY ACTIVE",
  "> MESSAGE LOADED",
];

const TIMELINE = [
  {
    year: "2035",
    label: "THE EVENT",
    text: "A massive Coronal Mass Ejection strikes Earth. Power grids collapse worldwide. Satellites fail. The surface goes dark.",
  },
  {
    year: "2035+",
    label: "THE DESCENT",
    text: "Millions retreat into pre-war bunkers and shelter networks. Communication fragments. Sectors isolate. Survival becomes local.",
  },
  {
    year: "NOW",
    label: "THE ARCHIVE",
    text: "Protocol UNsCRYPTED maintains cold-storage archives beneath the ruins — preserving medical protocols, engineering manuals, shelter maps, and survivor records for anyone still breathing.",
  },
];

const CAPABILITIES = [
  { icon: "◉", title: "Knowledge Base", text: "Medical, agricultural, and engineering documents recovered from the old world." },
  { icon: "◎", title: "Survivor Registry", text: "Track who's alive, where they are, and what skills they carry." },
  { icon: "◆", title: "Shelter Network", text: "Active bunker locations, capacity, and status across surviving sectors." },
  { icon: "◇", title: "Survival Tutorials", text: "First aid, food preservation, shelter building — written for life underground." },
];

export default function LandingPage() {
  const [lines, setLines] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < TRANSMISSION_LINES.length) {
        setLines((prev) => [...prev, TRANSMISSION_LINES[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => setReady(true), 400);
      }
    }, 280);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#060606] text-zinc-100">
      {/* Top bar */}
      <header className="border-b border-amber-900/20 px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <p className="text-[10px] tracking-[0.35em] text-amber-700/70">PROTOCOL</p>
            <p className="text-sm font-bold tracking-widest text-amber-500 glow-amber">
              UNsCRYPTED
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-zinc-600">
            <span className="hidden sm:inline">YEAR 2035</span>
            <span className="h-3 w-px bg-zinc-800 hidden sm:inline" />
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 glow-green animate-pulse" />
              ARCHIVE NODE ONLINE
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
        {/* Transmission boot */}
        {!ready && (
          <div className="mb-12 space-y-1 min-h-[140px]">
            {lines.map((line, i) => (
              <p
                key={i}
                className={`text-sm ${i === lines.length - 1 ? "text-emerald-400 glow-green" : "text-zinc-600"}`}
              >
                {line}
              </p>
            ))}
            <span className="text-emerald-400 text-sm cursor-blink">█</span>
          </div>
        )}

        {/* Hero */}
        <section
          className={`transition-all duration-700 ${ready ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="text-[10px] tracking-[0.3em] text-red-500/80 glow-red mb-4">
            // GLOBAL INFRASTRUCTURE: OFFLINE // SURFACE: UNINHABITABLE
          </p>
          <h1 className="font-mono text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight text-amber-500 glow-amber">
            The world ended
            <br />
            <span className="text-zinc-300">in a single solar flare.</span>
          </h1>
          <p className="mt-6 max-w-2xl font-sans text-sm sm:text-base leading-relaxed text-zinc-400">
            On March 14, 2035, a Coronal Mass Ejection tore through Earth&apos;s magnetosphere.
            Every grid failed. Every satellite burned. The cities went silent. Those who survived
            descended into bunkers — and waited. This archive exists so the living do not forget
            how to heal, grow, build, and find each other.
          </p>

          <Link
            href="/dashboard"
            className="mt-10 inline-flex items-center gap-3 rounded border border-amber-600/50 bg-amber-950/30 px-6 py-3 text-sm font-mono text-amber-400 transition-all hover:bg-amber-950/50 hover:border-amber-500/70 hover:glow-amber"
          >
            <span className="text-emerald-500">▶</span>
            ENTER ARCHIVE SYSTEM
            <span className="text-amber-700">→</span>
          </Link>
        </section>

        {/* Timeline */}
        <section
          className={`mt-20 transition-all duration-700 delay-150 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <p className="mb-6 text-[10px] tracking-[0.25em] text-zinc-600">SITUATION REPORT</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {TIMELINE.map((item) => (
              <div
                key={item.label}
                className="card-glow rounded border border-amber-900/20 bg-zinc-900/40 p-5"
              >
                <p className="text-[10px] tracking-widest text-amber-600">{item.year}</p>
                <h2 className="mt-1 font-mono text-sm font-bold text-amber-500">{item.label}</h2>
                <p className="mt-3 font-sans text-xs leading-relaxed text-zinc-500">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* What the archive offers */}
        <section
          className={`mt-16 transition-all duration-700 delay-300 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <p className="mb-6 text-[10px] tracking-[0.25em] text-zinc-600">
            ARCHIVE CAPABILITIES — FOR SURVIVORS IN THE BUNKERS
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {CAPABILITIES.map((cap) => (
              <div
                key={cap.title}
                className="flex gap-4 rounded border border-zinc-800/80 bg-zinc-950/50 p-4"
              >
                <span className="text-lg text-amber-700">{cap.icon}</span>
                <div>
                  <h3 className="font-mono text-sm text-zinc-200">{cap.title}</h3>
                  <p className="mt-1 font-sans text-xs leading-relaxed text-zinc-500">
                    {cap.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section
          className={`mt-20 rounded border border-emerald-900/25 bg-zinc-900/30 p-8 text-center transition-all duration-700 delay-500 ${ready ? "opacity-100" : "opacity-0"}`}
        >
          <p className="text-[10px] tracking-[0.3em] text-emerald-600 mb-3">
            SECTOR 05 // DOMAIN ARCHIVE
          </p>
          <p className="font-sans text-sm text-zinc-400 max-w-lg mx-auto">
            If you can read this, you are not alone. Access the dashboard to search documents,
            register survivors, locate shelters, and relay messages between sectors.
          </p>
          <Link
            href="/dashboard"
            className="mt-6 inline-flex items-center gap-2 rounded border border-emerald-700/40 bg-emerald-950/20 px-5 py-2.5 text-xs font-mono text-emerald-400 transition-all hover:bg-emerald-950/40 hover:glow-green"
          >
            OPEN DASHBOARD
          </Link>
        </section>
      </main>

      <footer className="border-t border-zinc-900 px-6 py-4 text-center text-[10px] tracking-widest text-zinc-700">
        THE ARCHIVE MUST NOT FALL // PROTOCOL UNsCRYPTED
      </footer>
    </div>
  );
}
