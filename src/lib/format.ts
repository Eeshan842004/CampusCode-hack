// Formatting helpers. All dates are stored as ISO strings with +05:30 and shown in Asia/Kolkata.

const TZ = "Asia/Kolkata";

const inrFull = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const inrCompact = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", notation: "compact", maximumFractionDigits: 1 });
const num = new Intl.NumberFormat("en-IN");

export const inr = (n: number) => inrFull.format(n);
export const inrShort = (n: number) => (n >= 100000 ? inrCompact.format(n) : inrFull.format(n));
export const count = (n: number) => num.format(n);

const dateFmt = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, day: "2-digit", month: "short", year: "numeric" });
const dayMonth = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, day: "2-digit", month: "short" });
const timeFmt = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, hour: "numeric", minute: "2-digit", hour12: true });
const weekday = new Intl.DateTimeFormat("en-IN", { timeZone: TZ, weekday: "short" });

export const fmtDate = (iso: string) => dateFmt.format(new Date(iso));
export const fmtDay = (iso: string) => dayMonth.format(new Date(iso));
export const fmtTime = (iso: string) => `${timeFmt.format(new Date(iso)).replace(/\s?([ap])m/i, (_, x: string) => ` ${x.toUpperCase()}M`)} IST`;
export const fmtDateTime = (iso: string) => `${fmtDay(iso)}, ${fmtTime(iso)}`;
export const fmtWeekday = (iso: string) => weekday.format(new Date(iso));

export interface Parts { d: number; h: number; m: number; s: number; done: boolean }

/** Recomputed from the clock on every tick, never decremented (no drift). */
export function countdown(deadline: string, now: number): Parts {
  const delta = Math.max(0, new Date(deadline).getTime() - now);
  return {
    d: Math.floor(delta / 86_400_000),
    h: Math.floor((delta % 86_400_000) / 3_600_000),
    m: Math.floor((delta % 3_600_000) / 60_000),
    s: Math.floor((delta % 60_000) / 1000),
    done: delta === 0,
  };
}

export function timeLeft(deadline: string, now: number): string {
  const { d, h, m, done } = countdown(deadline, now);
  if (done) return "Closed";
  if (d > 0) return `${d}d ${h}h left`;
  if (h > 0) return `${h}h ${m}m left`;
  return `${m}m left`;
}

export function relativeAgo(iso: string, now: number): string {
  const diff = Math.max(0, now - new Date(iso).getTime());
  const m = Math.floor(diff / 60_000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d === 1 ? "Yesterday" : `${d}d ago`;
}

export const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

export const pad2 = (n: number) => String(n).padStart(2, "0");
