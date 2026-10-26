import { useEffect, useState } from "react";

/**
 * Demo clock. The story ("Round 1 closes in about a day") must read the same whenever a judge opens the
 * link, so "now" starts at a fixed moment and then runs in real time from page load.
 */
export const DEMO_START = new Date("2026-11-03T18:42:00+05:30").getTime();
const loadedAt = Date.now();
export const demoNow = () => DEMO_START + (Date.now() - loadedAt);

/** Ticks on the real second boundary (no drift, no freeze in background tabs). */
export function useNow(intervalMs = 1000): number {
  const [now, setNow] = useState(demoNow);
  useEffect(() => {
    let t: number;
    const tick = () => {
      setNow(demoNow());
      t = window.setTimeout(tick, intervalMs - (Date.now() % intervalMs));
    };
    t = window.setTimeout(tick, intervalMs - (Date.now() % intervalMs));
    return () => window.clearTimeout(t);
  }, [intervalMs]);
  return now;
}
