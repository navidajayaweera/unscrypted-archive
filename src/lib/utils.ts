const inputClass =
  "w-full rounded border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-amber-600";

const labelClass = "mb-1 block text-xs tracking-wider text-zinc-500";

export { inputClass, labelClass };

export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function excerpt(text: string, max = 120) {
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export const SKILL_COLORS: Record<string, string> = {
  medical: "border-red-700/50 bg-red-950/40 text-red-400",
  construction: "border-orange-700/50 bg-orange-950/40 text-orange-400",
  farming: "border-lime-700/50 bg-lime-950/40 text-lime-400",
  tech: "border-blue-700/50 bg-blue-950/40 text-blue-400",
  engineering: "border-amber-700/50 bg-amber-950/40 text-amber-400",
};

export const STATUS_COLORS: Record<string, string> = {
  active: "border-emerald-700/50 bg-emerald-950/40 text-emerald-400",
  full: "border-amber-700/50 bg-amber-950/40 text-amber-400",
  abandoned: "border-zinc-600/50 bg-zinc-900/40 text-zinc-500",
};

export const DIFFICULTY_COLORS: Record<string, string> = {
  beginner: "border-emerald-700/50 bg-emerald-950/40 text-emerald-400",
  intermediate: "border-amber-700/50 bg-amber-950/40 text-amber-400",
  advanced: "border-red-700/50 bg-red-950/40 text-red-400",
};

export const CATEGORY_COLORS: Record<string, string> = {
  "first-aid": "border-red-700/50 bg-red-950/40 text-red-400",
  survival: "border-emerald-700/50 bg-emerald-950/40 text-emerald-400",
  shelter: "border-amber-700/50 bg-amber-950/40 text-amber-400",
  food: "border-lime-700/50 bg-lime-950/40 text-lime-400",
  defense: "border-orange-700/50 bg-orange-950/40 text-orange-400",
};

export const SECTOR_COLORS: Record<string, string> = {
  governance: "border-amber-700/50 bg-amber-950/40 text-amber-400",
  health: "border-red-700/50 bg-red-950/40 text-red-400",
  harvest: "border-lime-700/50 bg-lime-950/40 text-lime-400",
  signal: "border-blue-700/50 bg-blue-950/40 text-blue-400",
};

export const CONTACT_STATUS_COLORS: Record<string, string> = {
  pending: "border-amber-700/50 bg-amber-950/40 text-amber-400",
  acknowledged: "border-blue-700/50 bg-blue-950/40 text-blue-400",
  resolved: "border-emerald-700/50 bg-emerald-950/40 text-emerald-400",
};
