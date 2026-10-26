import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, Lock, Send } from "lucide-react";
import { toast } from "sonner";
import { checklistDone, useStore } from "../app/store";
import { bySlug, type CheckItem } from "../data/mock";
import { Dialog, Empty, MobileCTA, PageHead, Ring, StatusChip } from "../components/ui";
import { fmtDateTime, timeLeft } from "../lib/format";
import { useNow } from "../lib/clock";

function validate(item: CheckItem, v: string): string | null {
  if (item.kind === "repo" && v && !/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+/.test(v)) return "That isn't a GitHub link. Paste a URL that starts with https://github.com/.";
  if (item.kind === "url" && !/^https:\/\/[\w.-]+\.[a-z]{2,}/i.test(v)) return "Paste the full link, starting with https://.";
  if (item.kind === "text" && v.trim().length < 40) return `Write at least 40 characters (${v.trim().length} so far).`;
  return null;
}

async function celebrate() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const { default: confetti } = await import("canvas-confetti");
  confetti({ particleCount: 80, spread: 75, startVelocity: 38, origin: { y: 0.7 }, colors: ["#7665ff", "#a8e62e", "#111111"], disableForReducedMotion: true });
}

function SubmitDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useStore();
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const done = checklistDone(s);
  const total = s.checklist.length;
  const ready = done === total;

  const save = (item: CheckItem) => {
    const err = validate(item, draft);
    if (err) { setError(err); return; }
    s.set((st) => ({ ...st, checklist: st.checklist.map((c) => (c.id === item.id ? { ...c, value: draft, done: true } : c)) }));
    setEditing(null); setError(null);
    toast.success(`${item.label} saved.`);
  };
  const toggleConfirm = (item: CheckItem) => s.set((st) => ({ ...st, checklist: st.checklist.map((c) => (c.id === item.id ? { ...c, done: !c.done } : c)) }));
  const submit = () => {
    s.set((st) => ({ ...st, submittedAt: new Date().toISOString(), registrations: st.registrations.map((r) => (r.slug === "rebuild-26" ? { ...r, step: 3, status: "Submitted" } : r)) }));
    onClose();
    toast.success("Project submitted.", { description: "ReBuild '26 · Round 1. Round 2 presentations run 7–8 Nov." });
    celebrate();
  };

  return (
    <Dialog open={open} onClose={onClose} className="drawer" labelledBy="submit-title">
      <div className="dlg-head">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>ReBuild '26 · Round 1</p>
          <h2 id="submit-title" style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 900, letterSpacing: "-.05em", lineHeight: 1 }}>SUBMIT PROJECT.</h2>
        </div>
        <Ring value={done} total={total} size={64} />
      </div>
      <div className="dlg-body">
        <p style={{ margin: "0 0 8px", color: "var(--ink-2)", fontSize: 14 }}>Finish all five to unlock submit. Your progress saves as you go.</p>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {s.checklist.map((item) => (
            <li key={item.id} className="check-row" style={{ flexWrap: "wrap" }}>
              <span className="check-box" data-on={item.done} aria-hidden="true">{item.done && <Check size={14} strokeWidth={3} />}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <strong style={{ fontSize: 15 }}>{item.label}</strong>
                <span className="sr-only">{item.done ? ", done" : ", not done"}</span>
                <p style={{ margin: "2px 0 0", fontSize: 13, color: "var(--ink-3)", overflowWrap: "anywhere" }}>{item.done && item.value ? item.value : item.hint}</p>
              </div>
              {item.kind === "confirm" ? (
                <button type="button" role="switch" className="switch" aria-checked={item.done} aria-label={item.hint} onClick={() => toggleConfirm(item)} />
              ) : editing !== item.id ? (
                <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditing(item.id); setDraft(item.value); setError(null); }}>{item.done ? "Edit" : "Add"}</button>
              ) : null}
              {editing === item.id && (
                <div style={{ flexBasis: "100%", display: "grid", gap: 8, marginTop: 10 }}>
                  <label className="sr-only" htmlFor={`f-${item.id}`}>{item.label}</label>
                  {item.kind === "text" ? (
                    <textarea id={`f-${item.id}`} className="textarea" value={draft} onChange={(e) => setDraft(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `e-${item.id}` : undefined}
                      placeholder="Kept: CampusCode's real sidebar, tokens and headline style. Added: mobile tab bar, dark mode from the admin palette, AA contrast fixes…" autoFocus />
                  ) : (
                    <input id={`f-${item.id}`} className="input" value={draft} onChange={(e) => setDraft(e.target.value)} aria-invalid={!!error} aria-describedby={error ? `e-${item.id}` : undefined} autoFocus inputMode="url" />
                  )}
                  {error && <p id={`e-${item.id}`} className="err" style={{ margin: 0 }}>{error}</p>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => save(item)}>Save</button>
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => { setEditing(null); setError(null); }}>Cancel</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="dlg-foot">
        {!ready && <span className="hint" style={{ marginRight: "auto" }} id="submit-why">{total - done} {total - done === 1 ? "step" : "steps"} left: {s.checklist.filter((c) => !c.done).map((c) => c.label.toLowerCase()).join(", ")}.</span>}
        <button type="button" className="btn btn-ghost" onClick={onClose}>Save & close</button>
        <button type="button" className="btn btn-primary" disabled={!ready} aria-describedby={!ready ? "submit-why" : undefined} onClick={submit}>Submit project <span className="arrow" aria-hidden="true">↗</span></button>
      </div>
    </Dialog>
  );
}

export default function Rounds() {
  const s = useStore();
  const now = useNow(60_000);
  const [params, setParams] = useSearchParams();
  const regs = s.registrations.filter((r) => bySlug(r.slug)?.status !== "completed");
  const slug = params.get("h") && regs.some((r) => r.slug === params.get("h")) ? params.get("h")! : regs[0]?.slug;
  const h = slug ? bySlug(slug) : undefined;
  const [round, setRound] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const reg = regs.find((r) => r.slug === slug);
  const team = reg?.teamId ? s.teams.find((t) => t.id === reg.teamId) : undefined;
  const done = checklistDone(s);
  const isRebuild = slug === "rebuild-26";
  const submitted = isRebuild && !!s.submittedAt;

  const rounds = useMemo(() => (h ? h.stages.slice(0, 3) : []), [h]);
  const st = rounds[round];
  const locked = (i: number) => !!rounds[i] && now < new Date(rounds[i].start).getTime();

  if (!h || !reg) return (
    <div className="view-in">
      <PageHead eyebrow="Build / Rounds" title="ROUNDS." desc="All rounds on one page." />
      <Empty title="No active hackathon." action={<Link to="/hackathons" className="btn btn-primary btn-sm">Find a hackathon ↗</Link>}>Register for a hackathon to see its rounds here.</Empty>
    </div>
  );

  const decision = isRebuild ? (submitted ? "Under review" : "Pending") : "Opens with Round 1";
  return (
    <div className="view-in">
      <PageHead eyebrow="Build / Rounds" title="ROUNDS." desc="All rounds on one page. Switch tabs to submit, track status, or review feedback." />

      <div className="round-tabs" role="tablist" aria-label="Hackathon rounds">
        {rounds.map((r, i) => (
          <button key={r.id} type="button" role="tab" aria-selected={round === i} className="round-tab" onClick={() => setRound(i)}>
            <span className="rn">0{i + 1}</span>
            <span><strong>ROUND {i + 1}</strong><small>{r.name}</small></span>
            {locked(i) && <Lock size={14} className="lock" aria-label="Not open yet" />}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2" role="tabpanel" aria-label={`Round ${round + 1}`}>
        <section className="card card-pad">
          <span className="card-label lime">Hackathon workspace</span>
          <h2 className="card-title" style={{ fontSize: 30 }}>{h.title}</h2>
          <label className="field" style={{ margin: "18px 0" }}>
            <span className="field-label">Hackathon</span>
            <select className="select" value={slug} onChange={(e) => { setParams({ h: e.target.value }); setRound(0); }}>
              {regs.map((r) => <option key={r.slug} value={r.slug}>{bySlug(r.slug)!.title}</option>)}
            </select>
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", border: "1px solid var(--line)", background: "var(--surface-sunk)", marginBottom: 18, flexWrap: "wrap" }}>
            <StatusChip status={locked(round) ? "upcoming" : now > new Date(st.end).getTime() ? "done" : "live"} label={locked(round) ? "Not open" : now > new Date(st.end).getTime() ? "Closed" : "Open now"} />
            <span style={{ fontWeight: 700 }}>Round {round + 1} · {st.name}</span>
          </div>
          <dl className="kv">
            <dt>Window</dt><dd>{fmtDateTime(st.start)}{st.end !== st.start && <> → {fmtDateTime(st.end)}</>}</dd>
            <dt>Team</dt><dd>{team ? `${team.name} · ${team.members.length}/${team.size}` : "Solo · individual event"}</dd>
            <dt>Submission</dt><dd>{isRebuild ? (submitted ? "Submitted" : `In draft · ${done}/5 steps`) : "Not started"}</dd>
            <dt>Decision</dt><dd>{round === 0 ? decision : "—"}</dd>
            <dt>Organizer feedback</dt><dd>{submitted && round === 0 ? "Thanks! Reviews finish before 7 Nov." : "No feedback yet"}</dd>
          </dl>
        </section>

        <section className="card card-pad" aria-labelledby="round-sub">
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
            <div>
              <span className="card-label lime">Round {round + 1} submission</span>
              <h2 id="round-sub" className="card-title" style={{ fontSize: 30 }}>{isRebuild && round === 0 ? "Ship your dashboard." : st.name + "."}</h2>
            </div>
            <span className="icon-btn" aria-hidden="true" style={{ background: "var(--lime-wash)", borderColor: "transparent", color: "var(--lime-ink)" }}><Send size={17} /></span>
          </div>
          <p style={{ color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7, margin: "4px 0 18px" }}>{st.desc}</p>

          {isRebuild && round === 0 ? (
            submitted ? (
              <div className="state" style={{ minHeight: 200, borderStyle: "solid", borderColor: "var(--line)" }}>
                <span className="wm" aria-hidden="true">SHIPPED</span>
                <Ring value={5} total={5} size={64} />
                <strong>Project submitted.</strong>
                <p>Your live link, repo and screenshots are with the CampusCode team. Round 2 presentations run 7–8 Nov.</p>
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setDrawer(true)}>View submission</button>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 18 }}>
                <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
                  <Ring value={done} total={5} size={84} />
                  <div>
                    <p style={{ margin: 0, fontWeight: 800, fontSize: 18 }}>{done} of 5 steps done</p>
                    <p className="card-label" style={{ margin: "6px 0 0" }}>Closes in <span className="tnum">{timeLeft(st.end, now).replace(" left", "")}</span></p>
                  </div>
                </div>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {s.checklist.map((c) => (
                    <li key={c.id} className="check-row" style={{ padding: "10px 0" }}>
                      <span className="check-box" data-on={c.done} aria-hidden="true">{c.done && <Check size={14} strokeWidth={3} />}</span>
                      <span style={{ fontWeight: 600 }}>{c.label}<span className="sr-only">{c.done ? ", done" : ", to do"}</span></span>
                    </li>
                  ))}
                </ul>
                <div><button type="button" className="btn btn-dark" onClick={() => setDrawer(true)}>Continue submission <span className="arrow" aria-hidden="true">↗</span></button></div>
                {!drawer && <MobileCTA><button type="button" className="btn btn-dark" onClick={() => setDrawer(true)}>Continue submission <span className="arrow" aria-hidden="true">↗</span></button></MobileCTA>}
              </div>
            )
          ) : locked(round) ? (
            <Empty title="Not open yet." wm={`R${round + 1}`}>Opens {fmtDateTime(st.start)}. We'll notify you the moment it does.</Empty>
          ) : team && team.members.length < team.size && h.teamMin > 1 ? (
            <Empty title="Team not complete." wm={`${team.members.length}/${team.size}`} action={<Link to="/hackmate" className="btn btn-outline btn-sm">Find teammates ↗</Link>}>{team.name} has {team.members.length} of {team.size}. You can submit with {h.teamMin}+, but an open {team.openRoles[0] ?? "role"} slot is waiting.</Empty>
          ) : (
            <Empty title="Nothing to submit here." wm={`R${round + 1}`}>This round has no submission.</Empty>
          )}
        </section>
      </div>
      <SubmitDrawer open={drawer} onClose={() => setDrawer(false)} />
    </div>
  );
}
