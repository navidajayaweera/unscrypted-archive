"use client";

import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded border border-amber-900/50 bg-zinc-950 shadow-2xl shadow-amber-950/30"
        style={{ boxShadow: "0 0 0 1px rgba(245,158,11,0.15), 0 25px 50px rgba(0,0,0,0.8), 0 0 30px rgba(245,158,11,0.05)" }}
      >
        {/* Terminal title bar */}
        <div className="flex items-center justify-between border-b border-amber-900/30 bg-zinc-900/80 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-700 text-xs">▌</span>
            <h3 className="text-xs font-bold tracking-[0.2em] text-amber-400 glow-amber">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-600 hover:text-amber-500 transition-colors text-sm font-mono"
            aria-label="Close"
          >
            [ESC]
          </button>
        </div>

        {/* Content */}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
