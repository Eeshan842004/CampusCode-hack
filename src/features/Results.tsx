import { Fragment, useState } from "react";
import { Link } from "react-router";
import { useStore } from "../app/store";
import { bySlug, leaderboards } from "../data/mock";
import { ArrowLink, Empty, PageCount, PageHead, SecHead } from "../components/ui";
import { fmtDate } from "../lib/format";

const MEDAL: Record<string, string> = { Winner: "var(--lime-nav)", "Runner-up": "var(--purple)", Participant: "var(--line-strong)" };

export default function Results() {
  const s = useStore();
  const done = s.registrations.filter((r) => r.result).sort((a, b) => new Date(bySlug(b.slug)!.stages[0].end).getTime() - new Date(bySlug(a.slug)!.stages[0].end).getTime());
  const boards = Object.keys(leaderboards);
  const [board, setBoard] = useState(boards[0]);
  const rows = leaderboards[board] ?? [];
  const wins = done.filter((r) => r.result!.place === "Winner").length;
  const podiums = done.filter((r) => r.result!.rank <= 3).length;
  const best = Math.min(...done.map((r) => r.result!.rank));

  return (
    <div className="view-in">
      <PageHead eyebrow="Compete / Outcomes" title="RESULTS." desc="Every finished hackathon, your rank and your score. The leaderboard for each event is below." aside={<PageCount value={podiums} label="Podium finishes" />} />

      <section id="results" aria-labelledby="h-results">
        <SecHead num="01" title="Your results" id="h-results" note={`${done.length} finished · ${wins} win · best rank #${best}`} />
        <div className="grid gap-3 md:grid-cols-3" style={{ marginBottom: 14 }}>
          {[["Hackathons finished", done.length], ["Podium finishes", podiums], ["Average score", (done.reduce((a, r) => a + r.result!.score, 0) / Math.max(1, done.length)).toFixed(1)]].map(([k, v]) => (
            <div key={k} className="card stat" style={{ minHeight: 110 }}><span className="card-label">{k}</span><strong>{v}</strong></div>
          ))}
        </div>
        <div className="rows">
          {done.map((r) => {
            const h = bySlug(r.slug)!;
            const res = r.result!;
            return (
              <div key={r.slug} className="row">
                <div className="row-btn" style={{ cursor: "default", gridTemplateColumns: "56px minmax(0,1.4fr) 140px 120px 120px minmax(120px, auto)" }}>
                  <span style={{ width: 44, height: 44, display: "grid", placeItems: "center", border: `2px solid ${MEDAL[res.place]}`, fontWeight: 900, fontSize: 16 }} className="tnum">#{res.rank}</span>
                  <span style={{ minWidth: 0 }}><span className="row-cat">{h.category} · {fmtDate(h.stages[0].end)}</span><span className="row-title">{h.title}</span></span>
                  <span className="row-meta">{res.place}<small>Result</small></span>
                  <span className="row-meta tnum">{res.rank} / {res.of}<small>Rank</small></span>
                  <span className="row-meta tnum">{res.score}<small>Score / 100</small></span>
                  <span style={{ display: "flex", gap: 14, justifyContent: "flex-end", flexWrap: "wrap" }}>
                    <button type="button" className="link-arrow purple" onClick={() => { setBoard(r.slug); document.getElementById("leaderboard")?.scrollIntoView({ behavior: "smooth" }); }}>Leaderboard</button>
                    {r.certificateId && <ArrowLink to="/certificates">Certificate</ArrowLink>}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="card card-pad" style={{ marginTop: 14, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
          <span className="chip live"><span className="sdot" aria-hidden="true" />In progress</span>
          <span style={{ fontSize: 14 }}><b>ReBuild '26</b> results are announced on 9 Nov, after Round 2. {s.submittedAt ? "Your project is in." : "Submit Round 1 first."}</span>
          <Link to="/rounds" className="link-arrow" style={{ marginLeft: "auto" }}>Rounds ↗</Link>
        </div>
      </section>

      <section id="leaderboard" aria-labelledby="h-board" style={{ marginTop: 48 }}>
        <SecHead num="02" title="Leaderboard" id="h-board">
          <label style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span className="card-label">Event</span>
            <select className="select" style={{ width: 220 }} value={board} onChange={(e) => setBoard(e.target.value)}>
              {boards.map((b) => <option key={b} value={b}>{bySlug(b)!.title}</option>)}
            </select>
          </label>
        </SecHead>
        {rows.length ? (
          <div className="card table-wrap">
            <table className="table">
              <caption className="sr-only">{bySlug(board)!.title} leaderboard. Your row is highlighted.</caption>
              <thead><tr><th scope="col">Rank</th><th scope="col">Team</th><th scope="col">College</th><th scope="col" style={{ textAlign: "right" }}>Score</th></tr></thead>
              <tbody>
                {rows.map((r, i) => (
                  <Fragment key={r.rank}>
                    {i > 0 && r.rank - rows[i - 1].rank > 1 && <tr key={`gap-${r.rank}`} aria-hidden="true"><td colSpan={4} style={{ textAlign: "center", color: "var(--ink-3)", padding: 6 }}>⋯</td></tr>}
                    <tr className={r.me ? "me" : undefined} aria-current={r.me ? "true" : undefined}>
                      <td className="tnum" style={{ fontWeight: 900, width: 80 }}>#{r.rank}</td>
                      <td style={{ fontWeight: 700 }}>{r.team}{r.me && <span className="chip solid" style={{ marginLeft: 10, height: 22 }}>You</span>}</td>
                      <td style={{ color: "var(--ink-2)" }}>{r.college}</td>
                      <td className="tnum" style={{ textAlign: "right", fontWeight: 800 }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
                          <span aria-hidden="true" style={{ display: "inline-block", width: 90, height: 6, background: "var(--surface-soft)", position: "relative" }}><span style={{ position: "absolute", inset: 0, width: `${r.score}%`, background: r.me ? "var(--purple)" : "var(--line-strong)" }} /></span>
                          {r.score.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : <Empty title="Leaderboard not published yet." />}
      </section>
    </div>
  );
}
