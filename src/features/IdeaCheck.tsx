import { useMemo, useState } from "react";
import { PageHead, Ring } from "../components/ui";

// Demo scoring: four criteria, 25 points each, from simple text rules shown next to every score.
interface Idea { title: string; problem: string; users: string; solution: string; scope: string }
const EMPTY: Idea = { title: "", problem: "", users: "", solution: "", scope: "" };
const EXAMPLE: Idea = {
  title: "HostelFix",
  problem: "Hostel maintenance requests at our college go through a paper register. Students wait 4 to 6 days for a fix and never know the status.",
  users: "2,400 hostel students and 12 maintenance staff at one campus",
  solution: "A web app where students photograph the issue, wardens assign it, and everyone sees status updates. Weekly report for the admin.",
  scope: "React + Supabase, 3 screens, 36 hours, team of 3",
};
const BUZZ = ["revolutionary", "blockchain", "metaverse", "ai-powered", "disrupt", "uber for", "one-stop", "all-in-one", "everything"];

function score(i: Idea) {
  const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
  const all = Object.values(i).join(" ").toLowerCase();
  const hasNum = (s: string) => /\d/.test(s);
  const rows: { name: string; pts: number; notes: string[] }[] = [];

  let p = 0; const pn: string[] = [];
  if (words(i.problem) >= 15) { p += 10; pn.push("+10 problem has 15+ words"); } else pn.push("Describe the problem in 15+ words");
  if (words(i.users) >= 3) { p += 8; pn.push("+8 names who has it"); } else pn.push("Say who has this problem");
  if (hasNum(i.problem)) { p += 7; pn.push("+7 problem is measured"); } else pn.push("Add a number (time lost, people affected)");
  rows.push({ name: "Problem clarity", pts: p, notes: pn });

  let f = 0; const fn: string[] = [];
  if (words(i.scope) >= 3) { f += 8; fn.push("+8 scope written down"); } else fn.push("List stack, screens and time");
  if (/\b(\d+)\s*(hours?|hrs?|days?)\b/i.test(i.scope)) { f += 9; fn.push("+9 has a timeframe"); } else fn.push("Add a timeframe, e.g. 36 hours");
  if (/\b[1-5]\s*(screens?|pages?|features?)\b/i.test(i.scope)) { f += 8; fn.push("+8 small, countable scope"); } else fn.push("Cap the scope, e.g. 3 screens");
  rows.push({ name: "Feasibility", pts: f, notes: fn });

  let o = 0; const on: string[] = [];
  const buzz = BUZZ.filter((b) => all.includes(b));
  if (words(i.solution) >= 15) { o += 10; on.push("+10 solution explained"); } else on.push("Explain the solution in 15+ words");
  if (!buzz.length) { o += 10; on.push("+10 no buzzwords"); } else on.push(`Drop buzzwords: ${buzz.join(", ")}`);
  if (i.title.trim().length >= 3) { o += 5; on.push("+5 has a name"); } else on.push("Give it a name");
  rows.push({ name: "Originality", pts: o, notes: on });

  let m = 0; const mn: string[] = [];
  if (hasNum(i.users)) { m += 10; mn.push("+10 audience is sized"); } else mn.push("Size the audience");
  if (/(campus|college|hostel|city|village|school|students?)/i.test(i.users + i.problem)) { m += 8; mn.push("+8 real, specific setting"); } else mn.push("Name a real setting");
  if (/(report|track|status|save|reduce|faster|minutes|hours|days)/i.test(i.solution)) { m += 7; mn.push("+7 outcome you can check"); } else mn.push("Say what gets better and how you'd know");
  rows.push({ name: "Impact", pts: m, notes: mn });

  return { rows, total: rows.reduce((a, r) => a + r.pts, 0) };
}

export default function IdeaCheck() {
  const [idea, setIdea] = useState<Idea>(EMPTY);
  const { rows, total } = useMemo(() => score(idea), [idea]);
  const set = (k: keyof Idea) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setIdea({ ...idea, [k]: e.target.value });
  const fields: [keyof Idea, string, string, boolean][] = [
    ["title", "Idea name", "e.g. HostelFix", false],
    ["problem", "Problem", "What's broken, for whom, and how often?", true],
    ["users", "Who has it", "e.g. 2,400 hostel students at one campus", false],
    ["solution", "Solution", "What you'll build and how it fixes the problem", true],
    ["scope", "Scope", "Stack, number of screens, time, team size", false],
  ];
  return (
    <div className="view-in">
      <PageHead eyebrow="Build / IdeaCheck" title={<>CHECK YOUR <span className="ol-text">IDEA.</span></>} desc="Score a hackathon idea against a simple rubric before Round 1. Every point comes from a rule you can see." />
      <div className="grid gap-4 xl:grid-cols-12">
        <form className="card card-pad xl:col-span-7" onSubmit={(e) => e.preventDefault()} style={{ display: "grid", gap: 16, alignContent: "start" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span className="card-label">Your idea</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIdea(EXAMPLE)}>Try an example</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setIdea(EMPTY)}>Clear</button>
            </div>
          </div>
          {fields.map(([k, label, ph, area]) => (
            <label key={k} className="field"><span>{label}</span>
              {area ? <textarea className="textarea" value={idea[k]} onChange={set(k)} placeholder={ph} /> : <input className="input" value={idea[k]} onChange={set(k)} placeholder={ph} />}
            </label>
          ))}
        </form>
        <section className="xl:col-span-5" aria-labelledby="ic-score" style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <div className="card card-pad" style={{ display: "flex", gap: 18, alignItems: "center" }}>
            <Ring value={total} total={100} size={96} label={total} sub="/ 100" />
            <div>
              <span className="chip"><span className="sdot" aria-hidden="true" style={{ background: "var(--purple)" }} />Demo scoring</span>
              <h2 id="ic-score" style={{ margin: "10px 0 4px", fontSize: 22, fontWeight: 900, letterSpacing: "-.03em" }}>{total >= 80 ? "Strong idea." : total >= 50 ? "Getting there." : total > 0 ? "Needs work." : "Start typing."}</h2>
              <p style={{ margin: 0, fontSize: 13, color: "var(--ink-2)" }} aria-live="polite">Score {total} of 100. Rules only, no AI.</p>
            </div>
          </div>
          {rows.map((r) => (
            <div key={r.name} className="card card-pad">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <strong>{r.name}</strong><span className="tnum" style={{ fontWeight: 900 }}>{r.pts}<span style={{ color: "var(--ink-3)", fontWeight: 600 }}> / 25</span></span>
              </div>
              <span aria-hidden="true" style={{ display: "block", height: 6, background: "var(--surface-soft)", margin: "10px 0", position: "relative" }}>
                <span style={{ position: "absolute", inset: 0, transformOrigin: "left", transform: `scaleX(${r.pts / 25})`, background: "var(--purple)", transition: "transform .4s var(--ease-out)" }} />
              </span>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--ink-2)", lineHeight: 1.7 }}>{r.notes.map((n) => <li key={n} style={n.startsWith("+") ? { color: "var(--ink)" } : undefined}>{n}</li>)}</ul>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
