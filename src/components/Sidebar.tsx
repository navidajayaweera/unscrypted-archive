"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "◈", short: "DASH" },
  { href: "/knowledge", label: "Knowledge Base", icon: "◉", short: "KNOW" },
  { href: "/survivors", label: "Survivor Registry", icon: "◎", short: "SURV" },
  { href: "/shelters", label: "Shelter Locations", icon: "◆", short: "SHLT" },
  { href: "/tutorials", label: "Tutorials", icon: "◇", short: "TUTS" },
  { href: "/assistant", label: "Archive AI", icon: "◌", short: "AI" },
  { href: "/api-docs",  label: "API Docs",   icon: "◫", short: "API" },
];

const sysLines = [
  { label: "MEM",  value: "4.7 TB",  color: "text-emerald-500" },
  { label: "UPTIME", value: "1847d", color: "text-amber-500"   },
  { label: "NODES",  value: "12/16", color: "text-amber-500"   },
  { label: "SIGNAL", value: "WEAK",  color: "text-red-500"     },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-amber-900/25 bg-[#060606]">
      {/* Brand */}
      <div className="border-b border-amber-900/25 px-4 py-5">
        <Link href="/" className="block hover:opacity-90 transition-opacity">
          <p className="text-[10px] tracking-[0.3em] text-amber-700/70 mb-0.5">PROTOCOL</p>
          <p className="text-sm font-bold tracking-widest text-amber-500 glow-amber">
            UNsCRYPTED
          </p>
          <p className="text-[10px] tracking-widest text-zinc-600 mt-1">DOMAIN 05 // ARCHIVE</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-0.5 p-3">
        <p className="px-2 py-1 text-[10px] tracking-[0.25em] text-zinc-700 mb-1">
          NAVIGATION
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-2.5 rounded px-3 py-2 text-sm transition-all duration-150 ${
                isActive
                  ? "bg-amber-500/10 text-amber-400 border border-amber-700/30 glow-amber"
                  : "text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200 border border-transparent"
              }`}
            >
              <span className={`text-xs ${isActive ? "text-amber-500" : "text-zinc-700 group-hover:text-zinc-500"}`}>
                {item.icon}
              </span>
              <span className="truncate">{item.label}</span>
              {isActive && (
                <span className="ml-auto text-[10px] text-amber-700 cursor-blink">▌</span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* System status */}
      <div className="border-t border-amber-900/25 px-3 py-3 space-y-1.5">
        <p className="px-1 text-[10px] tracking-[0.25em] text-zinc-700 mb-2">SYS STATUS</p>
        {sysLines.map((line) => (
          <div key={line.label} className="flex items-center justify-between px-1">
            <span className="text-[10px] tracking-wider text-zinc-600">{line.label}</span>
            <span className={`text-[10px] font-mono ${line.color}`}>{line.value}</span>
          </div>
        ))}
        <div className="mt-2 pt-2 border-t border-zinc-900 flex items-center gap-1.5 px-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 glow-green" />
          <span className="text-[10px] text-zinc-600">SECTOR 05 ONLINE</span>
        </div>
      </div>
    </aside>
  );
}
