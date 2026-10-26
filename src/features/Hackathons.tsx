import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Bookmark, Search } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../app/store";
import { hackathons, type Hackathon, type Status } from "../data/mock";
import { Empty, PageCount, PageHead, StatusChip, Tabs } from "../components/ui";
import { fmtDateTime, fmtDay, inr, inrShort, timeLeft } from "../lib/format";
import { useNow } from "../lib/clock";

type Filter = "all" | Status;
type Sort = "deadline" | "prize" | "newest";

export function RegisterButton({ h, block }: { h: Hackathon; block?: boolean }) {
  const s = useStore();
  const registered = s.registrations.some((r) => r.slug === h.slug);
  if (registered) return <Link to="/registrations" className={`btn btn-outline${block ? " btn-block" : ""}`}>Registered ✓ <span className="sr-only">View your registrations</span></Link>;
  if (h.status === "completed") return <button type="button" className={`btn btn-outline${block ? " btn-block" : ""}`} disabled>Closed</button>;
  if (h.status === "upcoming") return <button type="button" className={`btn btn-outline${block ? " btn-block" : ""}`} aria-disabled="true" onClick={() => toast("Registration opens 20 Nov. We'll remind you.")}>Opens 20 Nov</button>;
  return (
    <button type="button" className={`btn btn-primary${block ? " btn-block" : ""}`} onClick={() => { s.register(h.slug); toast.success(`Registered for ${h.title}.`, { description: h.teamMax > 1 ? "Next: form your team." : "You're in. Good luck!" }); }}>
      Register <span className="arrow" aria-hidden="true">↗</span>
    </button>
  );
}

function Row({ h, i, open, onToggle }: { h: Hackathon; i: number; open: boolean; onToggle: () => void }) {
  const s = useStore();
  const now = useNow(60_000);
  const saved = s.saved.includes(h.slug);
  const panelId = `panel-${h.slug}`;
  const deadline = h.status === "completed" ? null : h.status === "live" ? h.stages[0].end : h.regCloses;
  return (
    <div className="row" data-open={open}>
      <button type="button" className="row-btn" aria-expanded={open} aria-controls={panelId} onClick={onToggle}>
        <span className="row-num">{String(i + 1).padStart(2, "0")}</span>
        <span style={{ minWidth: 0 }}><span className="row-cat">{h.category}{h.beginner ? " · Beginner friendly" : ""}</span><span className="row-title">{h.title}</span></span>
        <span className="row-desc">{h.short}</span>
        <span className="row-meta inr">{inrShort(h.prize)}<small>Prize pool</small></span>
        <span><StatusChip status={h.status} /></span>
        <span className="row-meta tnum">{deadline ? timeLeft(deadline, now).replace(" left", "") : fmtDay(h.stages[0].end)}<small>{deadline ? (h.status === "live" ? "Round 1 left" : "To register") : "Ended"}</small></span>
        <span className="row-arrow" aria-hidden="true">→</span>
      </button>
      <div className="row-panel" id={panelId} role="region" aria-label={`${h.title} details`}>
        <div>
          <div className="row-panel-inner">
            <div><span className="card-label">Prize pool</span><p className="inr" style={{ margin: "6px 0 4px", fontWeight: 900, fontSize: 22, letterSpacing: "-.03em" }}>{inr(h.prize)}</p><p style={{ margin: 0, fontSize: 13, color: "var(--ink-2)" }}>{h.prizeNote}</p></div>
            <div><span className="card-label">Key dates</span>
              <ul style={{ listStyle: "none", padding: 0, margin: "6px 0 0", fontSize: 13, display: "grid", gap: 4 }}>
                {h.status === "open" && <li><b>Register by</b> {fmtDateTime(h.regCloses)}</li>}
                {h.stages.slice(0, 3).map((st) => <li key={st.id}><b>{st.name}</b> {fmtDay(st.start)}{st.end !== st.start ? `–${fmtDay(st.end)}` : ""}</li>)}
              </ul>
            </div>
            <div><span className="card-label">Team & eligibility</span><p style={{ margin: "6px 0 4px", fontWeight: 800 }}>{h.teamMin === h.teamMax ? "Individual" : `${h.teamMin}–${h.teamMax} members`} · {h.mode}{h.location ? `, ${h.location}` : ""}</p><p style={{ margin: 0, fontSize: 13, color: "var(--ink-2)" }}>{h.eligibility}</p></div>
            <div><span className="card-label">Tracks & tags</span><div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>{h.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div></div>
          </div>
          <div className="row-actions">
            <RegisterButton h={h} />
            <button type="button" className="icon-btn" aria-pressed={saved} aria-label={saved ? `Remove ${h.title} from saved` : `Save ${h.title}`} title={saved ? "Saved" : "Save"}
              onClick={() => { s.toggleSaved(h.slug); toast(saved ? "Removed from saved." : `Saved ${h.title}.`); }}>
              <Bookmark size={17} strokeWidth={1.8} fill={saved ? "currentColor" : "none"} />
            </button>
            <Link to={`/hackathons/${h.slug}`} className="link-arrow purple" style={{ marginLeft: "auto" }}>View details <span aria-hidden="true">↗</span></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Hackathons() {
  const [params, setParams] = useSearchParams();
  const filter = (params.get("status") as Filter) || "all";
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("deadline");
  const [beginner, setBeginner] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const s = useStore();

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: hackathons.length, live: 0, open: 0, upcoming: 0, completed: 0 };
    hackathons.forEach((h) => c[h.status]++);
    return c;
  }, []);

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const key = (h: Hackathon) => new Date(h.status === "live" ? h.stages[0].end : h.status === "completed" ? "2999-01-01" : h.regCloses).getTime();
    return hackathons
      .filter((h) => filter === "all" || h.status === filter)
      .filter((h) => !beginner || h.beginner)
      .filter((h) => !needle || [h.title, h.category, h.organizer, ...h.tags].join(" ").toLowerCase().includes(needle))
      .sort((a, b) => sort === "prize" ? b.prize - a.prize : sort === "newest" ? new Date(b.stages[0].start).getTime() - new Date(a.stages[0].start).getTime() : key(a) - key(b));
  }, [q, filter, sort, beginner]);

  const live = counts.live;
  return (
    <div className="view-in">
      <PageHead eyebrow="Discover / The arena" title="HACKATHONS." desc={`${hackathons.length} hackathons · ${live} live · ${s.saved.length} saved. Open a row for prizes, dates and team rules.`} aside={<PageCount value={live} label="Live now" />} />

      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <Tabs label="Filter by status" value={filter} onChange={(v) => { setParams(v === "all" ? {} : { status: v }, { replace: true }); setOpen(null); }}
          tabs={[{ id: "all", label: "All", count: counts.all }, { id: "live", label: "Live", count: counts.live }, { id: "open", label: "Open", count: counts.open }, { id: "upcoming", label: "Upcoming", count: counts.upcoming }, { id: "completed", label: "Closed", count: counts.completed }]} />
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <label style={{ position: "relative", display: "block" }}>
            <span className="sr-only">Search hackathons</span>
            <Search size={16} style={{ position: "absolute", left: 12, top: 15, color: "var(--ink-3)" }} aria-hidden="true" />
            <input className="input" style={{ paddingLeft: 36, width: 240, minHeight: 46 }} type="search" placeholder="Search title, tag, organiser" value={q} onChange={(e) => setQ(e.target.value)} />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="sr-only">Sort by</span>
            <select className="select" style={{ width: 190 }} value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
              <option value="deadline">Deadline soonest</option>
              <option value="prize">Prize highest</option>
              <option value="newest">Newest</option>
            </select>
          </label>
          <button type="button" className="chip-btn" aria-pressed={beginner} onClick={() => setBeginner((b) => !b)}>Beginner friendly</button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">{list.length} hackathons shown</p>
      {list.length ? (
        <div className="rows">{list.map((h, i) => <Row key={h.slug} h={h} i={i} open={open === h.slug} onToggle={() => setOpen((o) => (o === h.slug ? null : h.slug))} />)}</div>
      ) : (
        <Empty title="Nothing matches that." action={<button type="button" className="btn btn-outline btn-sm" onClick={() => { setQ(""); setBeginner(false); setParams({}); }}>Clear filters</button>}>
          Try another word, or clear the filters to see all {hackathons.length} hackathons.
        </Empty>
      )}
    </div>
  );
}
