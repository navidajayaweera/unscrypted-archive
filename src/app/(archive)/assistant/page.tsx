"use client";

import { useEffect, useRef, useState } from "react";
import { inputClass } from "@/lib/utils";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const STARTUP_LINES = [
  "> ARCHIVE-AI v2.1 ... WAKING",
  "> LOADING SECTOR 05 KNOWLEDGE INDEX ... OK",
  "> CME EVENT CONTEXT ... LOADED",
  "> SURVIVOR ASSIST MODE ... ACTIVE",
  "> AWAITING INPUT",
];

const SUGGESTIONS = [
  "Where can I find medical documents?",
  "How do I register a new survivor?",
  "What should I do for severe bleeding?",
  "Which shelters are still active?",
];

const WELCOME =
  "> ARCHIVE-AI ONLINE\n\nSurvivor, I am the Sector 05 archive intelligence. Ask me about documents, shelters, survival procedures, or how to use this system. Signal is weak — keep queries clear.";

export default function ArchiveAIPage() {
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [booted, setBooted] = useState(false);
  const [bootLines, setBootLines] = useState<string[]>([]);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let i = 0;
    const iv = setInterval(() => {
      if (i < STARTUP_LINES.length) {
        setBootLines((prev) => [...prev, STARTUP_LINES[i]]);
        i++;
      } else {
        clearInterval(iv);
        setTimeout(() => setBooted(true), 300);
      }
    }, 200);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  const displayMessages: Message[] =
    history.length === 0
      ? [{ role: "assistant", content: WELCOME }]
      : history;

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    setError("");
    const nextHistory: Message[] = [...history, { role: "user", content: trimmed }];
    setHistory(nextHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextHistory }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Relay failed");
        return;
      }

      setHistory([...nextHistory, { role: "assistant", content: data.reply }]);
    } catch {
      setError("Could not reach archive relay node.");
    } finally {
      setLoading(false);
    }
  }

  if (!booted) {
    return (
      <div className="flex flex-col justify-center min-h-[60vh] space-y-1">
        <p className="text-[10px] tracking-[0.3em] text-zinc-600 mb-4">
          ARCHIVE-AI INITIALIZATION
        </p>
        {bootLines.map((line, i) => (
          <p
            key={i}
            className={`font-mono text-sm ${
              i === bootLines.length - 1 ? "text-emerald-400 glow-green" : "text-zinc-500"
            }`}
          >
            {line}
          </p>
        ))}
        <span className="text-emerald-400 text-sm cursor-blink">█</span>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col">
      <div className="mb-4">
        <h2 className="font-mono text-lg font-bold text-amber-500 glow-amber">Archive AI</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Sector 05 intelligence relay — ask about survival, archives, shelters, or protocols.
        </p>
      </div>

      <div className="card-glow flex flex-1 flex-col overflow-hidden rounded border border-amber-900/25 bg-zinc-900/30">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {displayMessages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded border px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "border-amber-700/40 bg-amber-950/30 text-amber-100"
                    : "border-zinc-700/60 bg-zinc-950/60 text-zinc-300"
                }`}
              >
                {msg.role === "assistant" && (
                  <p className="mb-2 text-[10px] tracking-widest text-emerald-600">ARCHIVE-AI</p>
                )}
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="rounded border border-zinc-700/60 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-500">
                <span className="text-[10px] tracking-widest text-emerald-600">ARCHIVE-AI</span>
                <p className="mt-1">
                  Processing<span className="cursor-blink">...</span>
                </p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {history.length === 0 && (
          <div className="border-t border-zinc-800/60 px-4 py-3">
            <p className="mb-2 text-[10px] tracking-widest text-zinc-600">SUGGESTED QUERIES</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded border border-zinc-800 px-3 py-1.5 text-xs text-zinc-400 transition-colors hover:border-amber-800/50 hover:text-amber-400"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {error && (
          <div className="border-t border-red-900/40 bg-red-950/20 px-4 py-2 text-xs text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-zinc-800/60 p-4"
        >
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the archive..."
              disabled={loading}
              className={inputClass}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="shrink-0 rounded border border-amber-700/40 bg-amber-950/30 px-4 py-2 text-xs font-mono text-amber-500 transition-colors hover:bg-amber-950/50 disabled:opacity-50"
            >
              RELAY
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
