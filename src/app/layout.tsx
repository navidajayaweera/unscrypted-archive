import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata = {
  title: "ARCHIVE SYSTEM",
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
        <div className="flex min-h-screen bg-zinc-950 text-zinc-100">
          <Sidebar />
          <div className="flex flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-amber-900/40 bg-zinc-900/50 px-6 py-3">
              <h1 className="text-sm font-bold tracking-widest text-amber-400">
                ARCHIVE SYSTEM
              </h1>
              <span className="flex items-center gap-2 rounded border border-emerald-700/50 bg-emerald-950/50 px-3 py-1 text-xs text-emerald-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                ONLINE
              </span>
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
