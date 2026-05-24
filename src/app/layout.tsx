import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "ARCHIVE SYSTEM — UNsCRYPTED",
  description: "Bunker cold storage archive for Protocol UNsCRYPTED",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-mono antialiased">
        {/* CRT scan sweep */}
        <div className="scan-sweep" />

        <div className="flex min-h-screen bg-[#0a0a0a] text-zinc-100">
          <Sidebar />
          <div className="flex flex-1 flex-col min-w-0">
            {/* Top bar */}
            <header className="flex shrink-0 items-center justify-between border-b border-amber-900/30 bg-zinc-950/80 px-6 py-3 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <span className="text-amber-900/60 text-xs select-none">▌</span>
                <h1 className="text-sm font-bold tracking-[0.2em] text-amber-500 glow-amber flicker">
                  ARCHIVE&nbsp;SYSTEM
                </h1>
                <span className="text-amber-900/40 text-xs select-none hidden sm:block">
                  // BUNKER COLD STORAGE
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-xs text-zinc-600 font-mono">
                  NODE:05-AR
                </span>
                <span className="flex items-center gap-2 rounded border border-emerald-700/50 bg-emerald-950/50 px-3 py-1 text-xs text-[#22c55e] glow-green">
                  <span className="relative flex h-2 w-2">
                    <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-[#22c55e] opacity-60" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22c55e]" />
                  </span>
                  ONLINE
                </span>
              </div>
            </header>

            <main className="flex-1 p-6 overflow-auto">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
