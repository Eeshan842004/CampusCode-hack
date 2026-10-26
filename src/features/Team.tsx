import { useMemo, useState } from "react";
import { Copy, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../app/store";
import { bySlug, me, people, personById, type Person, type Team as TeamT } from "../data/mock";
import { Avatar, Empty, PageCount, PageHead, SecHead, StatusChip } from "../components/ui";
import { relativeAgo } from "../lib/format";
import { useNow } from "../lib/clock";

function Orbit({ team }: { team: TeamT }) {
  const s = useStore();
  const inner = team.members.map((m) => {
    const p = m.id === "u-me" ? { name: s.profile.name, hue: me.hue } : personById(m.id)!;
    return { key: m.id, name: p.name, hue: p.hue, role: m.role, me: m.id === "u-me" };
  });
  const n = inner.length;
  return (
    <div className="orbit" role="img" aria-label={`${team.name}: ${team.members.map((m) => (m.id === "u-me" ? "you" : personById(m.id)!.name)).join(", ")}. ${team.openRoles.length ? `Open role: ${team.openRoles.join(", ")}.` : "Team is full."}`}>
      <div className="orbit-glow" />
      <div className="orbit-ring" style={{ ["--inset" as string]: "22%" }} />
      <div className="orbit-ring dashed" style={{ ["--inset" as string]: "4%" }} />
      <div className="orbit-spin" style={{ ["--period" as string]: "60s" }}>
        {inner.map((p, i) => (
          <div key={p.key} className="orbit-node" style={{ ["--a" as string]: `${(360 / n) * i - 90}deg`, ["--r" as string]: "28cqw", ["--period" as string]: "60s" }}>
            <span className="orbit-pill" title={`${p.name} · ${p.role}`}><Avatar name={p.name} hue={p.hue} size={26} />{p.me ? "You" : p.name.split(" ")[0]}<span className="sr-only"> · {p.role}</span></span>
          </div>
        ))}
      </div>
      <div className="orbit-spin" style={{ ["--period" as string]: "90s", animationDirection: "reverse" }}>
        {team.openRoles.map((r, i) => (
          <div key={r} className="orbit-node" style={{ ["--a" as string]: `${45 + i * 120}deg`, ["--r" as string]: "46cqw", ["--period" as string]: "90s", }}>
            <span className="orbit-pill open" style={{ animationDirection: "reverse" }}>Need: {r}</span>
          </div>
        ))}
      </div>
      <div className="orbit-core"><div><strong>{team.name.split(" ").map((w) => w[0]).join("")}</strong><small>{team.members.length}/{team.size}</small></div></div>
    </div>
  );
}

/** Scripted matching with visible rules (no AI): fills an open role, availability, same hackathon, new skills. */
function match(p: Person, team: TeamT | undefined, mySkills: string[]) {
  const reasons: string[] = [];
  let score = 0;
  const target = team ? bySlug(team.slug)!.title : "";
  const fills = (r: string) => (/designer/i.test(r) ? /designer/i.test(p.role) : p.role.toLowerCase() === r.toLowerCase());
  if (team?.openRoles.some(fills)) { score += 50; reasons.push(`Fills your open ${team.openRoles[0]} role`); }
  if (p.availability === "Available") { score += 20; reasons.push("Available now"); } else if (p.availability === "Open to chat") { score += 10; reasons.push("Open to chat"); }
  if (target && p.lookingFor === target) { score += 20; reasons.push(`Looking for ${target}`); }
  const fresh = p.skills.filter((sk) => !mySkills.includes(sk));
  if (fresh.length >= 2) { score += 10; reasons.push(`Adds ${fresh.slice(0, 2).join(", ")}`); }
  return { score, reasons };
}

function HackMate({ team }: { team?: TeamT }) {
  const s = useStore();
  const [role, setRole] = useState("Designers");
  const roles = ["Designers", "Backend", "All"];
  const onTeam = new Set(s.teams.flatMap((t) => t.members.map((m) => m.id)));
  const list = useMemo(() => people
    .filter((p) => !(team && team.members.some((m) => m.id === p.id)))
    .filter((p) => role === "All" || (role === "Designers" ? /designer/i.test(p.role) : /backend|devops|full-stack/i.test(p.role)))
    .map((p) => ({ p, ...match(p, team, s.profile.skills) }))
    .sort((a, b) => b.score - a.score), [role, team, s.profile.skills]);
  const invite = (p: Person) => {
    s.set((st) => ({ ...st, sentInvites: [...st.sentInvites, p.id] }));
    toast.success(`Invite sent to ${p.name.split(" ")[0]}.`, { description: team ? `${team.name} · ${team.openRoles[0] ?? "Teammate"}` : undefined });
  };
  return (
    <section id="hackmate" aria-labelledby="h-hackmate" style={{ marginTop: 48 }}>
      <SecHead num="02" title="HackMate" id="h-hackmate"><span className="chip"><span className="sdot" aria-hidden="true" style={{ background: "var(--purple)" }} />Demo matching</span></SecHead>
      <p style={{ margin: "-4px 0 16px", fontSize: 14, color: "var(--ink-2)", maxWidth: 700 }}>
        Ranked by simple, visible rules: fills your open role (+50), available now (+20) or open to chat (+10), wants the same hackathon (+20), brings 2+ skills you don't have (+10).
      </p>
      <div role="group" aria-label="Filter people by role" style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16 }}>
        {roles.map((r) => <button key={r} type="button" className="chip-btn" aria-pressed={role === r} onClick={() => setRole(r)}>{r}</button>)}
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {list.map(({ p, score, reasons }) => {
          const sent = s.sentInvites.includes(p.id);
          return (
            <article key={p.id} className="card card-pad lift" style={{ display: "grid", gap: 14, alignContent: "start" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <Avatar name={p.name} hue={p.hue} size={44} />
                <div style={{ minWidth: 0, flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: 16, fontWeight: 800 }}>{p.name}</h3>
                  <span className="card-label" style={{ display: "block", marginTop: 2 }}>{p.role} · {p.year}</span>
                </div>
                <span className="tnum" style={{ fontWeight: 900, fontSize: 22, letterSpacing: "-.04em" }} aria-label={`Match score ${score}`}>{score}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: "var(--ink-2)" }}>{p.college} · {p.hackathons} hackathons</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{p.skills.map((k) => <span key={k} className="tag">{k}</span>)}</div>
              {reasons.length > 0 && <p style={{ margin: 0, fontSize: 13 }}><b>Why:</b> {reasons.join(" · ")}</p>}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, borderTop: "1px solid var(--line)", paddingTop: 12 }}>
                <StatusChip status={p.availability === "Available" ? "done" : p.availability === "Busy" ? "upcoming" : "open"} label={p.availability} />
                {onTeam.has(p.id) && !team?.members.some((m) => m.id === p.id) ? <span className="card-label">Past teammate</span> : null}
                <button type="button" className="btn btn-outline btn-sm" disabled={sent || p.availability === "Busy"} onClick={() => invite(p)} aria-label={sent ? `Invite sent to ${p.name}` : p.availability === "Busy" ? `${p.name} is busy` : `Invite ${p.name}`}>
                  {sent ? "Invite sent" : p.availability === "Busy" ? "Busy" : <>Invite <span aria-hidden="true">↗</span></>}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default function Team() {
  const s = useStore();
  const now = useNow(60_000);
  const active = s.registrations.filter((r) => r.teamId && bySlug(r.slug)?.status !== "completed");
  const [slug, setSlug] = useState(active[0]?.slug ?? "");
  const team = s.teams.find((t) => t.slug === slug);
  const past = s.registrations.filter((r) => r.teamId && bySlug(r.slug)?.status === "completed");

  const act = (id: string, ok: boolean) => {
    const inv = s.invites.find((i) => i.id === id)!;
    const p = personById(inv.from)!;
    s.set((st) => ({
      ...st,
      teams: ok && inv.kind === "request" ? st.teams.map((t) => t.name === inv.team ? { ...t, members: [...t.members, { id: p.id, role: inv.role }], openRoles: t.openRoles.filter((r) => r !== inv.role) } : t) : st.teams,
      invites: st.invites.filter((i) => i.id !== id),
    }));
    toast.success(ok ? (inv.kind === "request" ? `${p.name.split(" ")[0]} joined ${inv.team}.` : `You joined ${inv.team}.`) : "Declined.");
  };

  return (
    <div className="view-in">
      <PageHead eyebrow="Build / Collaboration" title={<>FIND YOUR <span className="ol-text">PEOPLE.</span></>} desc="Your teams, open roles and invites in one place. HackMate suggests people who fill the gaps." aside={<PageCount value={team ? `${team.members.length}/${team.size}` : "00"} label="Team size" />} />

      <section id="team" aria-labelledby="h-team">
        <SecHead num="01" title="My team" id="h-team" />
        <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "16px 20px", marginBottom: 12, flexWrap: "wrap" }}>
          <div><span className="card-label lime">Select hackathon</span><p style={{ margin: "4px 0 0", fontWeight: 800 }}>Team management context</p></div>
          <label style={{ flex: "1 1 260px", maxWidth: 480 }}>
            <span className="sr-only">Hackathon</span>
            <select className="select" value={slug} onChange={(e) => setSlug(e.target.value)}>
              {active.map((r) => <option key={r.slug} value={r.slug}>{bySlug(r.slug)!.title}</option>)}
            </select>
          </label>
        </div>

        {team ? (
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="card card-pad lg:col-span-7" style={{ display: "grid", placeItems: "center", minHeight: 420 }}><Orbit team={team} /></div>
            <div className="lg:col-span-5" style={{ display: "grid", gap: 12, alignContent: "start" }}>
              <div className="card card-pad">
                <span className="card-label">{bySlug(team.slug)!.title}</span>
                <h3 className="card-title" style={{ fontSize: 28, textTransform: "uppercase" }}>{team.name}</h3>
                <ul style={{ listStyle: "none", margin: "14px 0 0", padding: 0 }}>
                  {team.members.map((m) => {
                    const p = m.id === "u-me" ? { name: s.profile.name, hue: me.hue } : personById(m.id)!;
                    return (
                      <li key={m.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                        <Avatar name={p.name} hue={p.hue} size={34} />
                        <span style={{ fontWeight: 700, flex: 1 }}>{p.name}{m.id === "u-me" && " (you)"}</span>
                        <span className="card-label">{m.role}{m.lead ? " · Lead" : ""}</span>
                      </li>
                    );
                  })}
                  {team.openRoles.map((r) => (
                    <li key={r} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
                      <Avatar name="" empty size={34} />
                      <span style={{ fontWeight: 700, flex: 1, color: "var(--purple-ink)" }}>Open: {r}</span>
                      <a href="#hackmate" className="link-arrow purple">Find <span aria-hidden="true">↓</span></a>
                    </li>
                  ))}
                </ul>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
                  <span className="card-label">Invite code</span>
                  <code className="mono" style={{ fontSize: 15, letterSpacing: ".18em", padding: "6px 10px", border: "1px dashed var(--line-strong)" }}>{team.code}</code>
                  <button type="button" className="icon-btn" aria-label="Copy invite code" title="Copy" onClick={() => { navigator.clipboard?.writeText(team.code).catch(() => {}); toast.success("Invite code copied."); }}><Copy size={16} /></button>
                </div>
              </div>
              <div className="card card-pad">
                <span className="card-label">Invitations</span>
                {s.invites.length ? (
                  <ul style={{ listStyle: "none", margin: "8px 0 0", padding: 0 }}>
                    {s.invites.map((inv) => {
                      const p = personById(inv.from)!;
                      return (
                        <li key={inv.id} style={{ padding: "12px 0", borderBottom: "1px solid var(--line)", display: "grid", gap: 10 }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <Avatar name={p.name} hue={p.hue} size={32} />
                            <div style={{ minWidth: 0 }}>
                              <strong style={{ fontSize: 14 }}>{p.name}</strong>
                              <span className="card-label" style={{ display: "block" }}>{inv.kind === "request" ? `Request · ${inv.team}` : `Invite · ${inv.team}`} · {relativeAgo(inv.at, now)}</span>
                            </div>
                          </div>
                          <p style={{ margin: 0, fontSize: 13, color: "var(--ink-2)" }}>“{inv.message}”</p>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button type="button" className="btn btn-outline btn-sm" onClick={() => act(inv.id, true)}><UserPlus size={14} aria-hidden="true" /> Accept</button>
                            <button type="button" className="btn btn-ghost btn-sm" onClick={() => act(inv.id, false)}>Decline</button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                ) : <p style={{ margin: "8px 0 0", color: "var(--ink-2)", fontSize: 14 }}>No pending invitations.</p>}
                {s.sentInvites.length > 0 && <p className="card-label" style={{ margin: "12px 0 0" }}>Sent: {s.sentInvites.map((id) => personById(id)!.name.split(" ")[0]).join(", ")}</p>}
              </div>
            </div>
          </div>
        ) : (
          <Empty title="Select a hackathon." wm="00">Choose a team hackathon above to view or create its team.</Empty>
        )}

        {past.length > 0 && (
          <div style={{ marginTop: 18 }}>
            <span className="card-label">Past teams</span>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
              {past.map((r) => { const t = s.teams.find((x) => x.id === r.teamId)!; return <span key={t.id} className="tag" style={{ height: 30 }}>{t.name} · {bySlug(r.slug)!.title}</span>; })}
            </div>
          </div>
        )}
      </section>

      <HackMate team={team} />
    </div>
  );
}
