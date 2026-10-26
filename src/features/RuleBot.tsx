import { useEffect, useRef, useState } from "react";
import { Bot, Send } from "lucide-react";
import { PageHead } from "../components/ui";

// Scripted answers, taken from the ReBuild '26 listing and organiser announcements. Nothing is generated.
const QA = [
  { id: "deadline", q: "When does Round 1 close?", keys: ["deadline", "close", "last date", "when", "date", "round 1", "round 2"],
    a: "Round 1 submissions close on 5 November 2026. Round 2, where shortlisted builders present their design choices, features and tech stack, runs 7 Nov 10:00 AM to 8 Nov 10:00 PM IST." },
  { id: "team", q: "Can I take part as a team?", keys: ["team", "solo", "individual", "group", "member", "partner"],
    a: "No. ReBuild '26 is individual participation, so every entry is built by one person." },
  { id: "deliver", q: "What do I need to submit?", keys: ["submit", "deliverable", "link", "screenshot", "github", "repo", "hosted"],
    a: "A live hosted link to your dashboard and screenshots. A GitHub repo is optional but appreciated." },
  { id: "judging", q: "How is it judged?", keys: ["judge", "judging", "score", "criteria", "evaluate", "mark", "faithful", "creativ"],
    a: "Organisers look at both: how faithfully you've recreated the CampusCode dashboard, and the creativity and polish you bring to it. Judging is mainly on desktop; mobile responsiveness, dark mode, accessible contrast and fast load all count as polish." },
  { id: "prizes", q: "What are the prizes?", keys: ["prize", "money", "reward", "win", "internship", "ppi", "certificate", "cash"],
    a: "1st place: ₹15,000, a pre-placement interview, a certificate and an internship opportunity. 2nd place: ₹3,000. Everyone else who participates gets a participation certificate." },
  { id: "frontend", q: "Do I need a backend?", keys: ["backend", "frontend", "api", "database", "server", "mock", "static", "data"],
    a: "No. It's frontend only, and mock or static data is allowed. Build the logged-in student dashboard using the landing page's style, colours and branding as reference." },
];

type Msg = { from: "bot" | "me"; text: string };
const GREETING: Msg = { from: "bot", text: "Hi! I answer questions about the ReBuild '26 rules. Pick a question below, or type one." };
const OFF_SCRIPT = "This demo only answers the questions below.";

function find(text: string) {
  const t = text.toLowerCase();
  let best: (typeof QA)[number] | undefined, hits = 0;
  for (const qa of QA) {
    const h = qa.keys.filter((k) => t.includes(k)).length;
    if (h > hits) { best = qa; hits = h; }
  }
  return best;
}

export default function RuleBot() {
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [asked, setAsked] = useState<string[]>([]);
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "nearest", behavior: "smooth" }); }, [msgs]);

  const ask = (text: string, id?: string) => {
    const qa = id ? QA.find((x) => x.id === id) : find(text);
    setMsgs((m) => [...m, { from: "me", text }, { from: "bot", text: qa ? qa.a : OFF_SCRIPT }]);
    if (qa) setAsked((a) => (a.includes(qa.id) ? a : [...a, qa.id]));
  };
  const submit = (e: React.FormEvent) => { e.preventDefault(); const v = input.trim(); if (!v) return; ask(v); setInput(""); };

  return (
    <div className="view-in">
      <PageHead eyebrow="Support / RuleBot" title={<>ASK THE <span className="ol-text">RULES.</span></>} desc="Quick answers about ReBuild '26, taken word for word from the official rules and organiser announcements." />
      <div className="grid gap-4 xl:grid-cols-12">
        <section className="card xl:col-span-8" aria-label="RuleBot chat" style={{ display: "flex", flexDirection: "column", minHeight: 520 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--line)" }}>
            <span className="icon-btn" aria-hidden="true" style={{ background: "var(--ink)", color: "var(--lime)", borderColor: "var(--ink)" }}><Bot size={18} /></span>
            <div style={{ flex: 1 }}><strong>RuleBot</strong><span className="card-label" style={{ display: "block" }}>ReBuild '26 rules</span></div>
            <span className="chip"><span className="sdot" aria-hidden="true" style={{ background: "var(--purple)" }} />Demo answers</span>
          </div>
          <div role="log" aria-live="polite" aria-label="Conversation" style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 12, overflowY: "auto", maxHeight: 520, background: "var(--surface-sunk)" }}>
            {msgs.map((m, i) => <p key={i} className={`bubble ${m.from}`} style={{ margin: 0 }}><span className="sr-only">{m.from === "bot" ? "RuleBot: " : "You: "}</span>{m.text}</p>)}
            <div ref={end} />
          </div>
          <div style={{ padding: "14px 20px 0", display: "flex", flexWrap: "wrap", gap: 8 }} role="group" aria-label="Suggested questions">
            {QA.map((qa) => <button key={qa.id} type="button" className="chip-btn" onClick={() => ask(qa.q, qa.id)} style={asked.includes(qa.id) ? { color: "var(--ink-3)" } : undefined}>{qa.q}</button>)}
          </div>
          <form onSubmit={submit} style={{ display: "flex", gap: 8, padding: 20 }}>
            <label htmlFor="rb-in" className="sr-only">Ask a question about the rules</label>
            <input id="rb-in" className="input" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. Can I use mock data?" autoComplete="off" />
            <button type="submit" className="btn btn-primary" aria-label="Send question"><Send size={16} aria-hidden="true" /></button>
          </form>
        </section>
        <aside className="xl:col-span-4" style={{ display: "grid", gap: 12, alignContent: "start" }}>
          <div className="card card-pad">
            <span className="card-label">How this demo works</span>
            <p style={{ margin: "8px 0 0", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.7 }}>RuleBot doesn't generate text. It matches your question to one of six official answers. If nothing matches, it says so instead of guessing.</p>
          </div>
          <div className="card card-pad">
            <span className="card-label">Covered</span>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18, fontSize: 14, lineHeight: 1.9 }}>{QA.map((qa) => <li key={qa.id}>{qa.q}</li>)}</ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
