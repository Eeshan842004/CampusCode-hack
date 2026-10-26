import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import { STEPS, type Status, type Step } from "../data/mock";
import { initials } from "../lib/format";

export function Mark({ small }: { small?: boolean }) {
  return <span className={`cc-mark${small ? " small" : ""}`} aria-hidden="true"><span /><span /><span /></span>;
}

export function PageHead({ eyebrow, title, desc, aside }: { eyebrow: string; title: ReactNode; desc?: ReactNode; aside?: ReactNode }) {
  return (
    <header className="page-head">
      <div>
        <p className="eyebrow" style={{ margin: 0 }}>{eyebrow}</p>
        <h1 className="page-title">{title}</h1>
        {desc && <p className="page-desc">{desc}</p>}
      </div>
      {aside}
    </header>
  );
}

export function PageCount({ value, label }: { value: number | string; label: string }) {
  return <div className="page-count"><strong className="tnum">{typeof value === "number" ? String(value).padStart(2, "0") : value}</strong><span>{label}</span></div>;
}

export function SecHead({ num, title, note, id, children }: { num?: string; title: string; note?: ReactNode; id?: string; children?: ReactNode }) {
  return (
    <div className="sec-head">
      <h2 id={id}>{num && <span className="num">{num}</span>}{title}</h2>
      {children ?? (note && <span className="note">{note}</span>)}
    </div>
  );
}

const STATUS_LABEL: Record<Status, string> = { live: "Live", open: "Open", upcoming: "Upcoming", completed: "Completed" };
export function StatusChip({ status, label }: { status: Status | "done" | "warn"; label?: string }) {
  const cls = status === "completed" ? "done" : status;
  return <span className={`chip ${cls}`}><span className="sdot" aria-hidden="true" />{label ?? STATUS_LABEL[status as Status] ?? status}</span>;
}

export function Avatar({ name, hue = "#e6e3ff", size = 36, empty }: { name: string; hue?: string; size?: number; empty?: boolean }) {
  return (
    <span className={`avatar${empty ? " empty" : ""}`} style={{ width: size, height: size, background: empty ? undefined : hue, fontSize: Math.round(size * 0.36) }} aria-hidden="true">
      {empty ? "+" : initials(name)}
    </span>
  );
}

/** Progress ring. r=36/stroke 6 in a 78 viewBox scaled to `size`; arc drawn as C·p − w so round caps don't overstate it. */
export function Ring({ value, total, size = 78, label, sub }: { value: number; total: number; size?: number; label?: ReactNode; sub?: string }) {
  const r = 36, w = 6, C = 2 * Math.PI * r;
  const p = total > 0 ? Math.min(1, value / total) : 0;
  const arc = p >= 1 ? C : Math.max(0, C * p - w);
  const [shown, setShown] = useState(0);
  useEffect(() => { const id = requestAnimationFrame(() => setShown(arc)); return () => cancelAnimationFrame(id); }, [arc]);
  return (
    <span className="cc-ring" style={{ width: size, height: size }} role="img" aria-label={`${value} of ${total} done`}>
      <svg width={size} height={size} viewBox="0 0 78 78" aria-hidden="true">
        <circle className="track" cx="39" cy="39" r={r} fill="none" strokeWidth={w} />
        {p > 0 && <circle className="val" cx="39" cy="39" r={r} fill="none" strokeWidth={w} strokeLinecap="round" strokeDasharray={`${shown} ${C}`} />}
      </svg>
      <span className="lbl" style={{ fontSize: size * 0.24 }}>
        <span>{label ?? `${value}/${total}`}{sub && <small style={{ display: "block", font: "500 9px var(--font-mono)", letterSpacing: ".12em", color: "var(--ink-3)", marginTop: 2 }}>{sub}</small>}</span>
      </span>
    </span>
  );
}

/** Discover → Team up → Build → Ship. Line fills to i/(n−1) so it never overshoots the last dot. */
export function Stepper({ step, done }: { step: Step; done?: boolean }) {
  const p = done ? 1 : step / (STEPS.length - 1);
  return (
    <ol className="stepper" style={{ ["--p" as string]: p }} aria-label={`Progress: ${done ? "all steps done" : `step ${step + 1} of 4, ${STEPS[step]}`}`}>
      <span className="fill" aria-hidden="true" />
      {STEPS.map((s, i) => {
        const state = done || i < step ? "done" : i === step ? "current" : "todo";
        return (
          <li key={s} className="step" data-state={state} aria-current={state === "current" ? "step" : undefined}>
            <i aria-hidden="true">{state === "done" ? <svg width="10" height="10" viewBox="0 0 10 10"><path d="M2 5.2 4 7.2 8 3" stroke="currentColor" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg> : null}</i>
            <span>{s}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function Empty({ title, children, action, wm = "CC", error }: { title: string; children?: ReactNode; action?: ReactNode; wm?: string; error?: boolean }) {
  return (
    <div className={`state${error ? " error" : ""}`} role={error ? "alert" : undefined}>
      <span className="wm" aria-hidden="true">{wm}</span>
      <Mark small />
      <strong>{title}</strong>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}

export function ArrowLink({ to, children, purple }: { to: string; children: ReactNode; purple?: boolean }) {
  return <Link to={to} className={`link-arrow${purple ? " purple" : ""}`}>{children} <span aria-hidden="true">↗</span></Link>;
}

/** Accessible tablist with a sliding indicator (transform only on position). */
export function Tabs<T extends string>({ tabs, value, onChange, label }: { tabs: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ind, setInd] = useState({ x: 0, w: 0 });
  useLayoutEffect(() => {
    const el = ref.current?.querySelector<HTMLButtonElement>(`[data-id="${value}"]`);
    if (el) setInd({ x: el.offsetLeft, w: el.offsetWidth });
  }, [value, tabs.length]);
  const onKey = (e: React.KeyboardEvent) => {
    const i = tabs.findIndex((t) => t.id === value);
    let n = -1;
    if (e.key === "ArrowRight") n = (i + 1) % tabs.length;
    if (e.key === "ArrowLeft") n = (i - 1 + tabs.length) % tabs.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = tabs.length - 1;
    if (n >= 0) { e.preventDefault(); onChange(tabs[n].id); ref.current?.querySelector<HTMLButtonElement>(`[data-id="${tabs[n].id}"]`)?.focus(); }
  };
  return (
    <div className="tabs" role="tablist" aria-label={label} ref={ref} onKeyDown={onKey}>
      <span className="tabs-indicator" style={{ width: ind.w, transform: `translateX(${ind.x}px)` }} aria-hidden="true" />
      {tabs.map((t) => (
        <button key={t.id} type="button" role="tab" data-id={t.id} aria-selected={t.id === value} tabIndex={t.id === value ? 0 : -1} className="tab" onClick={() => onChange(t.id)}>
          {t.label}{t.count !== undefined && <span className="count">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}

/** Native <dialog> wrapper: Esc closes, focus is trapped by the browser, backdrop click closes. */
export function Dialog({ open, onClose, className = "modal", labelledBy, children }: { open: boolean; onClose: () => void; className?: string; labelledBy: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} className={className} aria-labelledby={labelledBy} onClose={onClose} onCancel={(e) => { e.preventDefault(); onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}>
      {children}
    </dialog>
  );
}
