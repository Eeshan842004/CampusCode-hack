import { useState } from "react";
import { Link } from "react-router";
import { useStore } from "../app/store";
import { bySlug, me, personById, type Registration } from "../data/mock";
import { ArrowLink, Avatar, Empty, PageCount, PageHead, StatusChip, Stepper, Tabs } from "../components/ui";
import { fmtDate, timeLeft } from "../lib/format";
import { useNow } from "../lib/clock";

function Card({ r }: { r: Registration }) {
  const s = useStore();
  const now = useNow(60_000);
  const h = bySlug(r.slug)!;
  const team = r.teamId ? s.teams.find((t) => t.id === r.teamId) : undefined;
  const submitted = r.slug === "rebuild-26" && !!s.submittedAt;
  const status = submitted ? "Submitted" : r.status;
  const next = h.stages.find((st) => new Date(st.end).getTime() > now);
  return (
    <article className="card lift" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr)" }}>
      <div className="card-pad" style={{ display: "grid", gap: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap", alignItems: "flex-start" }}>
          <div style={{ minWidth: 0 }}>
            <span className="card-label">{h.category} · Registered {fmtDate(r.registeredAt)}</span>
            <h2 className="card-title" style={{ fontSize: 26, textTransform: "uppercase" }}><Link to={`/hackathons/${h.slug}`} style={{ textDecoration: "none" }}>{h.title}</Link></h2>
            <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)" }}>{r.role}{team ? ` · ${team.name}` : ""}</p>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="chip solid">{status}</span>
            <StatusChip status={h.status} />
          </div>
        </div>
        <Stepper step={submitted ? 3 : r.step} done={r.status === "Results" || submitted} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: 16 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            {team && (
              <span className="avatar-stack" role="img" aria-label={`${team.name}: ${team.members.length} of ${team.size} members`}>
                {team.members.map((m) => { const p = m.id === "u-me" ? { name: s.profile.name, hue: me.hue } : personById(m.id)!; return <Avatar key={m.id} name={p.name} hue={p.hue} size={32} />; })}
                {Array.from({ length: Math.max(0, team.size - team.members.length) }, (_, i) => <Avatar key={i} name="" empty size={32} />)}
              </span>
            )}
            {r.result ? (
              <span style={{ fontSize: 14 }}><b>{r.result.place}</b> · Rank <span className="tnum">{r.result.rank}</span> of {r.result.of} · Score <span className="tnum">{r.result.score}</span></span>
            ) : next ? (
              <span className="card-label">{next.name} · <span className="tnum">{timeLeft(next.end, now)}</span></span>
            ) : null}
          </div>
          {r.certificateId ? <ArrowLink to="/certificates">Certificate</ArrowLink> : <ArrowLink to={submitted ? "/rounds" : r.next.to}>{submitted ? "View submission" : r.next.label}</ArrowLink>}
        </div>
      </div>
    </article>
  );
}

export default function Registrations() {
  const s = useStore();
  const [tab, setTab] = useState<"active" | "past">("active");
  const active = s.registrations.filter((r) => bySlug(r.slug)?.status !== "completed");
  const past = s.registrations.filter((r) => bySlug(r.slug)?.status === "completed");
  const list = tab === "active" ? active : past;
  return (
    <div className="view-in">
      <PageHead eyebrow="Track / Your events" title={<>MY <span className="ol-text">REGISTRATIONS.</span></>} desc="Every hackathon you joined, from Discover to Ship. Statuses follow Registered → Team formed → In draft → Submitted → Results." aside={<PageCount value={s.registrations.length} label="Registered" />} />
      <div style={{ marginBottom: 18 }}>
        <Tabs label="Registrations" value={tab} onChange={setTab} tabs={[{ id: "active", label: "Active", count: active.length }, { id: "past", label: "Completed", count: past.length }]} />
      </div>
      {list.length ? (
        <div className="grid gap-3">{list.map((r) => <Card key={r.slug} r={r} />)}</div>
      ) : (
        <Empty title="Nothing on your plate." action={<Link to="/hackathons" className="btn btn-primary btn-sm">Find a hackathon <span aria-hidden="true">↗</span></Link>}>
          When you register for a hackathon, it shows up here with its progress.
        </Empty>
      )}
    </div>
  );
}
