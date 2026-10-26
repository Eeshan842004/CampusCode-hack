export type Theme = "light" | "dark";
export type ThemePref = Theme | "system";

const KEY = "cc-theme";

export function getPref(): ThemePref {
  try { return (localStorage.getItem(KEY) as ThemePref) || "system"; } catch { return "system"; }
}
export const systemTheme = (): Theme => (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
export const resolve = (p: ThemePref): Theme => (p === "system" ? systemTheme() : p);
export const current = (): Theme => (document.documentElement.dataset.theme === "dark" ? "dark" : "light");

function apply(t: Theme) {
  document.documentElement.dataset.theme = t;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", t === "dark" ? "#0d0f10" : "#f7f7f4");
}

export function setPref(p: ThemePref) {
  try { localStorage.setItem(KEY, p); } catch { /* ignore */ }
  apply(resolve(p));
  window.dispatchEvent(new Event("cc-theme"));
}

/** Theme switch with a circular reveal from the button (radius = distance to the farthest corner). */
export function toggleTheme(from?: HTMLElement | null) {
  const next: Theme = current() === "dark" ? "light" : "dark";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const doc = document as Document & { startViewTransition?: (cb: () => void) => { ready: Promise<void> } };
  if (!doc.startViewTransition || reduce || !from) { setPref(next); return; }
  const r = from.getBoundingClientRect();
  const x = r.left + r.width / 2, y = r.top + r.height / 2;
  const R = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
  const vt = doc.startViewTransition(() => setPref(next));
  vt.ready.then(() => {
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${R}px at ${x}px ${y}px)`] },
      { duration: 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)", pseudoElement: "::view-transition-new(root)" },
    );
  }).catch(() => {});
}
