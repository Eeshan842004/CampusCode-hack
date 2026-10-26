import { Link } from "react-router";
import NumberFlow, { NumberFlowGroup } from "@number-flow/react";
import { toast } from "sonner";
import { useStore, checklistDone } from "../app/store";
import { activity, bySlug, hackathons, me, personById, ticker, type Registration } from "../data/mock";
import { ArrowLink, Avatar, Empty, MobileCTA, Ring, SecHead, StatusChip, Stepper } from "../components/ui";
import { countdown, fmtDay, fmtTime, fmtWeekday, inrShort, timeLeft } from "../lib/format";
import { useNow } from "../lib/clock";

const R1_CLOSE = "2026-11-05T23:59:00+05:30";
const played = { stats: false };

function Ticker() {
  const copy = (hidden?: boolean) => (
    <div className="ticker-copy" aria-hidden={hidden || undefined}>
      {ticker.map((t) => <span key={t} className="ticker-item">{t}</span>)}
    </div>
  );
  return (
    <div className="ticker" role="marquee" aria-label={`Live updates: ${ticker.join(". ")}`}>
      <div className="ticker-track">{copy()}{copy(true)}</div>
    </div>
  );
}

function Countdown({ deadline }: { deadline: string }) {
  const now = useNow();
  const c = countdown(deadline, now);
  const units: [number, string][] = [[c.d, "Days"], [c.h, "Hrs"], [c.m, "Min"], [c.s, "Sec"]];
  return (
    <div>
      <span className="sr-only">Round 1 closes in {c.d} days {c.h} hours {c.m} minutes.</span>
      <NumberFlowGroup>
        <div className="countdown" aria-hidden="true">
          {units.map(([v, l], i) => (
            <div key={l} style={{ display: "contents" }}>
              {i > 0 && <span className="sep">:</span>}
              <div className="unit"><b><NumberFlow value={v} format={{ minimumIntegerDigits: 2 }} trend={-1} /></b><small>{l}</small></div>
            </div>
          ))}
        </div>
      </NumberFlowGroup>
    </div>
  );
}

function Hero() {
  const s = useStore();
  const done = checklistDone(s);
  const total = s.checklist.length;
  const h = bySlug("rebuild-26")!;
  const submitted = !!s.submittedAt;
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-main">
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <span className="eyebrow">Current hackathon · Round 1</span>
          <StatusChip status="live" label="Live" />
        </div>
        <h2 id="hero-title">REBUILD <span className="ol-text">'26.</span></h2>
        <p style={{ margin: "0 0 18px", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7, maxWidth: 520 }}>
          The Dashboard Recreation Hackathon by CampusCode. {submitted ? "Your Round 1 project is in. Round 2 presentations run 7–8 Nov." : `Your submission is ${done} of ${total} steps done.`}
        </p>
        <dl style={{ display: "flex", flexWrap: "wrap", gap: "14px 30px", margin: "0 0 24px" }}>
          {[["Prize", <span className="inr">₹15,000 + PPI</span>], ["Registered", `${h.registered} builders`], ["Format", "Individual · Online"], ["Round 2", "7–8 Nov"]].map(([k, v]) => (
            <div key={k as string}><dt className="card-label">{k}</dt><dd style={{ margin: "4px 0 0", fontWeight: 800, fontSize: 15 }}>{v}</dd></div>
          ))}
        </dl>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          <Link to="/rounds" className={`btn btn-dark${submitted ? "" : " hidden md:inline-flex"}`}>{submitted ? "View submission" : "Continue submission"} <span className="arrow" aria-hidden="true">↗</span></Link>
          <Link to="/hackathons/rebuild-26" className="btn btn-outline">Event details</Link>
        </div>
        {!submitted && <MobileCTA><Link to="/rounds" className="btn btn-dark">Continue submission <span className="arrow" aria-hidden="true">↗</span></Link></MobileCTA>}
      </div>
      <div className="hero-side">
        <div>
          <span className="card-label">{submitted ? "Round 1 closes in" : "Submit before"}</span>
          <div style={{ marginTop: 10 }}><Countdown deadline={R1_CLOSE} /></div>
          <p className="card-label" style={{ marginTop: 10 }}>{fmtDay(R1_CLOSE)} · {fmtTime(R1_CLOSE)}</p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Ring value={submitted ? total : done} total={total} size={78} />
          <div>
            <span className="card-label">Submission checklist</span>
            <p style={{ margin: "4px 0 6px", fontWeight: 800, fontSize: 14 }}>{submitted ? "Submitted" : `${total - done} steps to go`}</p>
            <ArrowLink to="/rounds" purple>Open checklist</ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stats() {
  const s = useStore();
  const now = useNow(60_000);
  const active = s.registrations.filter((r) => { const h = bySlug(r.slug); return h && h.status !== "completed"; });
  const completed = s.registrations.filter((r) => r.status === "Results");
  const certs = s.registrations.filter((r) => r.certificateId);
  const animate = !played.stats;
  played.stats = true;
  const tiles: [string, number, string, string][] = [
    ["Registered", s.registrations.length, `${active.length} active right now`, "/registrations"],
    ["Ongoing", active.length, `Next: ${timeLeft(R1_CLOSE, now)}`, "/rounds"],
    ["Completed", completed.length, "1 win · 1 runner-up", "/results"],
    ["Certificates", certs.length, "Ready to download", "/certificates"],
  ];
  return (
    <div className="stats">
      {tiles.map(([label, value, note, to]) => (
        <Link key={label} to={to} className="card stat lift" style={{ textDecoration: "none" }}>
          <span className="card-label">{label}</span>
          <strong><NumberFlow value={value} format={{ minimumIntegerDigits: 2 }} animated={animate} /></strong>
          <small>{note}</small>
        </Link>
      ))}
    </div>
  );
}

function RegRow({ r }: { r: Registration }) {
  const h = bySlug(r.slug)!;
  const now = useNow(60_000);
  const s = useStore();
  const team = r.teamId ? s.teams.find((t) => t.id === r.teamId) : undefined;
  const deadline = h.stages.find((st) => new Date(st.end).getTime() > now)?.end ?? h.regCloses;
  return (
    <article className="card card-pad lift" style={{ display: "grid", gap: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ minWidth: 0 }}>
          <span className="card-label">{h.category}</span>
          <h3 className="card-title" style={{ textTransform: "uppercase" }}><Link to={`/hackathons/${h.slug}`} style={{ textDecoration: "none" }}>{h.title}</Link></h3>
          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-2)" }}>
            {r.role}{team && <> · {team.name} {team.members.length}/{team.size}</>} · <span className="tnum">{timeLeft(deadline, now)}</span>
          </p>
        </div>
        <StatusChip status={h.status} />
      </div>
      <Stepper step={r.slug === "rebuild-26" && s.submittedAt ? 3 : r.step} done={r.slug === "rebuild-26" && !!s.submittedAt} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        {team ? (
          <span className="avatar-stack" role="img" aria-label={`Team: ${team.members.length} of ${team.size}`}>
            {team.members.map((m) => { const p = m.id === "u-me" ? { name: me.name, hue: me.hue } : personById(m.id)!; return <Avatar key={m.id} name={p.name} hue={p.hue} size={30} />; })}
            {Array.from({ length: team.size - team.members.length }, (_, i) => <Avatar key={i} name="" empty size={30} />)}
          </span>
        ) : <span className="card-label">Solo</span>}
        <ArrowLink to={r.slug === "rebuild-26" && s.submittedAt ? "/rounds" : r.next.to}>{r.slug === "rebuild-26" && s.submittedAt ? "View submission" : r.next.label}</ArrowLink>
      </div>
    </article>
  );
}

function Upcoming() {
  const now = useNow(60_000);
  const s = useStore();
  const mine = new Set(s.registrations.map((r) => r.slug));
  const items = hackathons
    .flatMap((h) => [
      ...h.stages.map((st) => ({ at: st.end, title: `${h.title}: ${st.name}`, mine: mine.has(h.slug), slug: h.slug })),
      ...(h.status === "open" ? [{ at: h.regCloses, title: `${h.title}: registration closes`, mine: mine.has(h.slug), slug: h.slug }] : []),
    ])
    .filter((e) => new Date(e.at).getTime() > now)
    .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
    .slice(0, 5);
  return (
    <ol className="card" style={{ listStyle: "none", margin: 0, padding: "4px 20px" }}>
      {items.map((e) => (
        <li key={e.title + e.at} style={{ display: "grid", gridTemplateColumns: "54px 1fr", gap: 14, padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
          <div style={{ textAlign: "center", border: "1px solid var(--line)", padding: "6px 0" }}>
            <span className="card-label" style={{ fontSize: 10 }}>{fmtWeekday(e.at)}</span>
            <b style={{ display: "block", fontSize: 20, fontWeight: 900, letterSpacing: "-.04em", lineHeight: 1.1 }} className="tnum">{fmtDay(e.at).split(" ")[0]}</b>
            <span className="card-label" style={{ fontSize: 10 }}>{fmtDay(e.at).split(" ")[1]}</span>
          </div>
          <div style={{ minWidth: 0 }}>
            <Link to={`/hackathons/${e.slug}`} style={{ fontWeight: 700, fontSize: 14, textDecoration: "none", display: "block" }}>{e.title}</Link>
            <span className="card-label" style={{ display: "block", marginTop: 4 }}>{fmtTime(e.at)}{e.mine ? " · Registered" : ""}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}

function Discover() {
  const s = useStore();
  const mine = new Set(s.registrations.map((r) => r.slug));
  const recs = [
    { slug: "ai-innovation", why: "Byte Bandits invited you as frontend" },
    { slug: "healthstack-48", why: "Matches your skills: React, Accessibility" },
    { slug: "ship-it-oss", why: "Beginner friendly · solo allowed" },
  ].filter((r) => !mine.has(r.slug));
  if (!recs.length) return <Empty title="You're in everything we'd suggest.">Browse the full list to find something new.</Empty>;
  return (
    <div className="rows">
      {recs.map((r, i) => {
        const h = bySlug(r.slug)!;
        return (
          <div className="row" key={h.slug}>
            <Link to={`/hackathons/${h.slug}`} className="row-btn" style={{ textDecoration: "none", gridTemplateColumns: undefined }}>
              <span className="row-num">{String(i + 1).padStart(2, "0")}</span>
              <span style={{ minWidth: 0 }}><span className="row-cat">{h.category}</span><span className="row-title">{h.title}</span></span>
              <span className="row-desc">{r.why}</span>
              <span className="row-meta inr">{inrShort(h.prize)}<small>Prize pool</small></span>
              <span><StatusChip status={h.status} /></span>
              <span className="row-meta">{h.teamMin === h.teamMax ? "Solo" : `${h.teamMin}–${h.teamMax}`}<small>Team</small></span>
              <span className="row-arrow" aria-hidden="true">↗</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
}

function Streak() {
  const total = activity.filter((a) => a > 0).length;
  return (
    <div className="card card-pad">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap", marginBottom: 16 }}>
        <div><span className="card-label">Build streak</span><p style={{ margin: "6px 0 0", fontWeight: 800, fontSize: 18, letterSpacing: "-.02em" }}>6 weeks in a row.</p></div>
        <span className="card-label">{total} active days · 1 freeze left</span>
      </div>
      <div className="heat" role="img" aria-label={`Activity over the last 12 weeks: ${total} active days`}>
        {activity.map((l, i) => <i key={i} data-l={l} />)}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}><span className="card-label">12 weeks ago</span><span className="card-label">This week</span></div>
    </div>
  );
}

function Requests() {
  const s = useStore();
  const act = (id: string, ok: boolean) => {
    const inv = s.invites.find((i) => i.id === id)!;
    const p = personById(inv.from)!;
    s.set((st) => {
      let teams = st.teams;
      if (ok && inv.kind === "request") teams = st.teams.map((t) => t.name === inv.team ? { ...t, members: [...t.members, { id: p.id, role: inv.role }], openRoles: t.openRoles.filter((r) => r !== inv.role) } : t);
      return { ...st, teams, invites: st.invites.filter((i) => i.id !== id) };
    });
    toast.success(ok ? (inv.kind === "request" ? `${p.name.split(" ")[0]} joined ${inv.team}.` : `You joined ${inv.team}.`) : `Declined ${inv.kind === "request" ? `${p.name.split(" ")[0]}'s request` : `the ${inv.team} invite`}.`);
  };
  if (!s.invites.length) return <Empty title="No pending requests." wm="00">New team invites and join requests show up here.</Empty>;
  return (
    <ul className="card" style={{ listStyle: "none", margin: 0, padding: "4px 20px" }}>
      {s.invites.map((inv) => {
        const p = personById(inv.from)!;
        return (
          <li key={inv.id} style={{ padding: "16px 0", borderBottom: "1px solid var(--line)", display: "grid", gap: 12 }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <Avatar name={p.name} hue={p.hue} size={38} />
              <div style={{ minWidth: 0 }}>
                <strong style={{ fontSize: 14 }}>{p.name}</strong>
                <span className="card-label" style={{ display: "block", marginTop: 2 }}>{inv.kind === "request" ? `Wants to join ${inv.team}` : `Invites you to ${inv.team}`} · {inv.role}</span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => act(inv.id, true)}>Accept</button>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => act(inv.id, false)}>Decline</button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function Overview() {
  const s = useStore();
  const now = useNow(60_000);
  const first = s.profile.name.split(" ")[0] || me.first;
  const ongoing = s.registrations.filter((r) => bySlug(r.slug)?.status !== "completed");
  const due = s.submittedAt ? 0 : 1;
  return (
    <div className="view-in">
      <Ticker />
      <header className="page-head">
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>Student workspace / Live</p>
          <h1 className="page-title" tabIndex={-1}>
            <span className="reveal-word">WELCOME</span> <span className="reveal-word" style={{ animationDelay: "80ms" }}>BACK,</span>{" "}
            <span className="reveal-word" style={{ animationDelay: "160ms" }}><span className="greet-name">{first.toUpperCase()}</span>.</span>
          </h1>
          <p className="page-desc">
            {due ? <>1 submission due in <span className="tnum">{timeLeft(R1_CLOSE, now).replace(" left", "")}</span></> : "Round 1 submitted"} · {s.invites.length} team {s.invites.length === 1 ? "request" : "requests"} · Round 2 on 7 Nov.
          </p>
        </div>
      </header>

      <Hero />
      <div style={{ height: 12 }} />
      <Stats />

      <div className="grid gap-6 xl:grid-cols-12" style={{ marginBottom: 40 }}>
        <div className="xl:col-span-8" style={{ display: "grid", gap: 40, alignContent: "start" }}>
          <section aria-labelledby="h-yours">
            <SecHead num="01" title="Your hackathons" id="h-yours"><ArrowLink to="/registrations">All registrations</ArrowLink></SecHead>
            <div className="grid gap-3 md:grid-cols-2">{ongoing.map((r) => <RegRow key={r.slug} r={r} />)}</div>
          </section>
          <section aria-labelledby="h-streak">
            <SecHead num="03" title="Activity" id="h-streak" note="Weekly streak, never daily" />
            <Streak />
          </section>
        </div>
        <div className="xl:col-span-4" style={{ display: "grid", gap: 40, alignContent: "start" }}>
          <section aria-labelledby="h-upcoming">
            <SecHead num="02" title="Upcoming" id="h-upcoming" note="All times IST" />
            <Upcoming />
          </section>
          <section aria-labelledby="h-req">
            <SecHead num="04" title="Team requests" id="h-req" />
            <Requests />
          </section>
        </div>
      </div>

      <section aria-labelledby="h-discover">
        <SecHead num="05" title="Discover hackathons" id="h-discover"><ArrowLink to="/hackathons">View all</ArrowLink></SecHead>
        <Discover />
      </section>
    </div>
  );
}
