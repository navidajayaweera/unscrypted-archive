"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/knowledge", label: "Knowledge Base" },
  { href: "/survivors", label: "Survivor Registry" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-amber-900/40 bg-zinc-950">
      <div className="border-b border-amber-900/40 px-4 py-5">
        <p className="text-xs tracking-widest text-amber-500/70">PROTOCOL</p>
        <p className="text-sm font-bold text-amber-400">UNsCRYPTED</p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-amber-500/15 text-amber-400"
                  : "text-zinc-400 hover:bg-zinc-900 hover:text-amber-300"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-amber-900/40 px-4 py-3 text-xs text-zinc-600">
        SECTOR 05 // ARCHIVE
      </div>
    </aside>
  );
}
