import { useState } from "react";
import { Link, useParams } from "react-router";
import { Share2 } from "lucide-react";
import { bySlug } from "../data/mock";
import { Empty, MobileCTA, StatusChip, Tabs } from "../components/ui";
import { countdown, fmtDate, fmtDateTime, inr } from "../lib/format";
import { useNow } from "../lib/clock";
import { RegisterButton } from "./Hackathons";

type Tab = "overview" | "timeline" | "prizes" | "rules";

export default function HackathonDetail() {
  const { slug = "" } = useParams();
  const h = bySlug(slug);
  const [tab, setTab] = useState<Tab>("overview");
  const now = useNow();
  if (!h) return <Empty title="We couldn't find that hackathon." wm="404" action={<Link to="/hackathons" className="btn btn-outline btn-sm">Back to hackathons ↗</Link>}>The link may be old or mistyped.</Empty>;

  const deadline = h.status === "live" ? h.stages[0].end : h.status === "completed" ? null : h.regCloses;
  const c = deadline ? countdown(deadline, now) : null;
  const share = `https://wa.me/?text=${encodeURIComponent(`${h.title} on CampusCode: ${h.short} ${location.origin}/hackathons/${h.slug}`)}`;

  return (
    <div className="view-in">
      <nav aria-label="Breadcrumb" style={{ marginBottom: 18 }}><Link to="/hackathons" className="link-arrow purple">← All hackathons</Link></nav>
      <div className="grid gap-6 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <span className="eyebrow">{h.category}</span><StatusChip status={h.status} />{h.beginner && <span className="tag">Beginner friendly</span>}
          </div>
          <h1 className="page-title" tabIndex={-1} style={{ textTransform: "uppercase" }}>{h.title}.</h1>
          <p className="page-desc" style={{ marginBottom: 26 }}>By {h.organizer} · {h.mode}{h.location ? `, ${h.location}` : ""} · {h.registered ? `${h.registered} registered` : "Registration opens soon"}</p>

          <Tabs label="Event sections" value={tab} onChange={setTab} tabs={[{ id: "overview", label: "Overview" }, { id: "timeline", label: "Timeline" }, { id: "prizes", label: "Prizes" }, { id: "rules", label: "Rules & FAQ" }]} />
          <div className="card card-pad" style={{ marginTop: 14 }} role="tabpanel" aria-label={tab}>
            {tab === "overview" && (
              <div style={{ display: "grid", gap: 18 }}>
                <p style={{ margin: 0, lineHeight: 1.75 }}>{h.description}</p>
                <div><span className="card-label">Eligibility</span><p style={{ margin: "6px 0 0" }}>{h.eligibility}</p></div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{h.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
              </div>
            )}
            {tab === "timeline" && (
              <ol style={{ listStyle: "none", margin: 0, padding: 0, position: "relative" }}>
                {h.stages.map((st, i) => {
                  const state = now > new Date(st.end).getTime() ? "Done" : now >= new Date(st.start).getTime() ? "Now" : "Upcoming";
                  return (
                    <li key={st.id} style={{ display: "grid", gridTemplateColumns: "40px 1fr", gap: 16, paddingBottom: i < h.stages.length - 1 ? 22 : 0 }}>
                      <span className="mono" style={{ fontSize: 12, color: state === "Now" ? "var(--purple-ink)" : "var(--ink-3)", paddingTop: 3 }}>0{i + 1}</span>
                      <div>
                        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}><strong style={{ fontSize: 17 }}>{st.name}</strong><StatusChip status={state === "Now" ? "live" : state === "Done" ? "done" : "upcoming"} label={state} /></div>
                        <p className="card-label" style={{ margin: "6px 0" }}>{fmtDateTime(st.start)}{st.end !== st.start && ` → ${fmtDateTime(st.end)}`}</p>
                        {st.desc && <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14 }}>{st.desc}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}
            {tab === "prizes" && (
              <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                {h.prizes.map((p) => (
                  <li key={p.place} style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 16, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
                    <span className="mono" style={{ fontSize: 12, color: "var(--purple-ink)" }}>{p.place}</span><span className="inr" style={{ fontWeight: 700 }}>{p.reward}</span>
                  </li>
                ))}
              </ul>
            )}
            {tab === "rules" && (
              <div style={{ display: "grid", gap: 22 }}>
                {h.rules.length > 0 && <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8, lineHeight: 1.6 }}>{h.rules.map((r) => <li key={r}>{r}</li>)}</ul>}
                {h.faqs.map((f) => <details key={f.q}><summary style={{ fontWeight: 700, cursor: "pointer", minHeight: 32 }}>{f.q}</summary><p style={{ margin: "8px 0 0", color: "var(--ink-2)" }}>{f.a}</p></details>)}
                {!h.rules.length && !h.faqs.length && <p style={{ margin: 0, color: "var(--ink-2)" }}>This event has ended.</p>}
              </div>
            )}
          </div>
        </article>

        <aside className="lg:col-span-4">
          <div className="card card-pad raised" style={{ position: "sticky", top: "calc(var(--topbar-h) + 20px)", display: "grid", gap: 18 }}>
            <div><span className="card-label">Prize pool</span><p className="inr" style={{ margin: "6px 0 2px", fontSize: 34, fontWeight: 900, letterSpacing: "-.05em" }}>{inr(h.prize)}</p><p style={{ margin: 0, fontSize: 13, color: "var(--ink-2)" }}>{h.prizeNote}</p></div>
            {c && <div><span className="card-label">{h.status === "live" ? "Round 1 closes in" : "Registration closes in"}</span><p className="tnum" style={{ margin: "6px 0 2px", fontSize: 26, fontWeight: 900, letterSpacing: "-.03em" }}>{c.d}d {String(c.h).padStart(2, "0")}h {String(c.m).padStart(2, "0")}m</p><p className="card-label" style={{ margin: 0 }}>{fmtDateTime(deadline!)}</p></div>}
            {!c && <div><span className="card-label">Ended</span><p style={{ margin: "6px 0 0", fontWeight: 800 }}>{fmtDate(h.stages[h.stages.length - 1].end)}</p></div>}
            <div><span className="card-label">Team size</span><p style={{ margin: "6px 0 0", fontWeight: 800 }}>{h.teamMin === h.teamMax ? "Individual" : `${h.teamMin} to ${h.teamMax} members`}</p></div>
            <RegisterButton h={h} block />
            <MobileCTA><RegisterButton h={h} block /></MobileCTA>
            <a href={share} target="_blank" rel="noreferrer" className="btn btn-ghost btn-sm"><Share2 size={15} aria-hidden="true" /> Share on WhatsApp</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
