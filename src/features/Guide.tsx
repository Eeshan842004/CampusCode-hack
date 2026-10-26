import { useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { me } from "../data/mock";
import { PageHead, SecHead } from "../components/ui";

const STEPS = [
  { n: "01", t: "Discover", d: "Browse Hackathons, open a row for prize, dates and team rules, then register." },
  { n: "02", t: "Team up", d: "Use My Team for invite codes and HackMate to find people who fill your open roles." },
  { n: "03", t: "Build", d: "Rounds shows every round's window, your status and the submission checklist." },
  { n: "04", t: "Ship", d: "Submit when the checklist hits 5/5. Results, leaderboards and certificates follow." },
];

const FAQ = [
  { q: "Where do I submit a round?", a: "Open Rounds, pick the hackathon, and use Continue submission. The button unlocks when every checklist item is done." },
  { q: "Can I edit after submitting?", a: "You can view your submission any time. Edits after the deadline go through the organiser via Help & Support." },
  { q: "Why are times shown in IST?", a: "Every CampusCode deadline is set in India Standard Time, so we show IST everywhere, even if your device is set to another zone." },
  { q: "How does HackMate rank people?", a: "With visible rules, not a black box: fills your open role (+50), available now (+20), same hackathon (+20), new skills (+10)." },
  { q: "How do I get my certificate?", a: "Certificates appear under Account → Certificates once results are out. Print or save them as PDF." },
  { q: "Can I change the theme?", a: "Yes. Use the moon/sun button in the top bar, or Profile → Preferences to follow your system setting." },
];

export default function Guide() {
  const [topic, setTopic] = useState("Submission");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (msg.trim().length < 15) { setErr("Tell us a bit more: at least 15 characters, so we can help the first time."); return; }
    setErr(null); setMsg("");
    toast.success("Message sent to CampusCode support.", { description: `Topic: ${topic}. We reply within 24 hours, by email to ${me.email}.` });
  };
  return (
    <div className="view-in">
      <PageHead eyebrow="Support / Student guide" title={<>HOW IT <span className="ol-text">WORKS.</span></>} desc="From idea to impact in four steps, plus answers to the questions students ask most." />

      <section id="guide" aria-labelledby="h-guide">
        <SecHead num="01" title="Student guide" id="h-guide" note="From idea to impact." />
        <ol className="grid md:grid-cols-2 xl:grid-cols-4" style={{ listStyle: "none", margin: "0 0 36px", padding: 0, border: "1px solid var(--line)" }}>
          {STEPS.map((st, i) => (
            <li key={st.n} className="lift" style={{ position: "relative", padding: 28, minHeight: 240, display: "flex", flexDirection: "column", background: "var(--surface-sunk)", borderLeft: i ? "1px solid var(--line)" : 0 }}>
              <span className="card-label">{st.n}</span>
              <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "22px 0 24px" }} />
              <h3 style={{ margin: 0, fontSize: 32, fontWeight: 800, letterSpacing: "-.05em", textTransform: "uppercase" }}>{st.t}</h3>
              <p style={{ margin: "12px 0 0", fontSize: 14, color: "var(--ink-2)", lineHeight: 1.6 }}>{st.d}</p>
              <span aria-hidden="true" style={{ marginTop: "auto", alignSelf: "flex-end", color: "var(--purple)" }}>↗</span>
            </li>
          ))}
        </ol>
        <SecHead num="02" title="Questions" />
        <div className="card" style={{ marginBottom: 48 }}>
          {FAQ.map((f) => (
            <details key={f.q} style={{ borderBottom: "1px solid var(--line)" }}>
              <summary style={{ cursor: "pointer", padding: "18px 22px", fontWeight: 700, minHeight: 44 }}>{f.q}</summary>
              <p style={{ margin: 0, padding: "0 22px 18px", color: "var(--ink-2)", lineHeight: 1.7 }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="help" aria-labelledby="h-help">
        <SecHead num="03" title="Help & support" id="h-help" note="Replies within 24 h" />
        <div className="grid gap-3 lg:grid-cols-12">
          <form className="card card-pad lg:col-span-7" onSubmit={send} noValidate style={{ display: "grid", gap: 16 }}>
            <label className="field"><span>Topic</span>
              <select className="select" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {["Submission", "Team", "Registration", "Certificates", "Something else"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="field"><span>Message</span>
              <textarea className="textarea" value={msg} onChange={(e) => setMsg(e.target.value)} aria-invalid={!!err} aria-describedby={err ? "help-err" : "help-hint"} placeholder="What happened, and what did you expect?" />
              {err ? <span id="help-err" className="err">{err}</span> : <span id="help-hint" className="hint">Include the hackathon name and round if it's about a submission.</span>}
            </label>
            <div><button type="submit" className="btn btn-primary">Send message <span className="arrow" aria-hidden="true">↗</span></button></div>
          </form>
          <div className="card card-pad lg:col-span-5" style={{ display: "grid", gap: 16, alignContent: "start" }}>
            <div><span className="card-label">Quick answers</span><p style={{ margin: "6px 0 0" }}>Ask <Link to="/rulebot" className="link-arrow purple">RuleBot</Link> about ReBuild '26 rules.</p></div>
            <div><span className="card-label">Organiser group</span><p style={{ margin: "6px 0 0", fontSize: 14, color: "var(--ink-2)" }}>Announcements are mirrored in <Link to="/communication" style={{ color: "var(--purple-ink)", fontWeight: 700 }}>Official Communication</Link>, so you don't miss them in a busy chat.</p></div>
            <div><span className="card-label">Status</span><p style={{ margin: "6px 0 0", display: "flex", alignItems: "center", gap: 8, fontWeight: 700 }}><span className="chip done" style={{ padding: 0, border: 0, background: "none" }}><span className="sdot" /></span>All systems operational</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
