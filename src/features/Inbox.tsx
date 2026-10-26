import { useState } from "react";
import { Link } from "react-router";
import { Bell, CalendarClock, Megaphone, Pin, Trophy, UserPlus } from "lucide-react";
import { useStore, unreadCount } from "../app/store";
import { announcements, bySlug, type Notice } from "../data/mock";
import { Empty, PageCount, PageHead, SecHead } from "../components/ui";
import { fmtDateTime, relativeAgo } from "../lib/format";
import { useNow } from "../lib/clock";

const ICON: Record<Notice["kind"], typeof Bell> = { deadline: CalendarClock, team: UserPlus, result: Trophy, system: Bell, registration: Bell };

export default function Inbox() {
  const s = useStore();
  const now = useNow(60_000);
  const unread = unreadCount(s);
  const events = [...new Set(announcements.map((a) => a.slug))];
  const [ev, setEv] = useState("all");
  const list = announcements.filter((a) => ev === "all" || a.slug === ev).sort((a, b) => Number(!!b.pinned) - Number(!!a.pinned) || new Date(b.at).getTime() - new Date(a.at).getTime());
  const markAll = () => s.set((st) => ({ ...st, notifications: st.notifications.map((n) => ({ ...n, read: true })) }));
  const markOne = (id: string) => s.set((st) => ({ ...st, notifications: st.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));

  return (
    <div className="view-in">
      <PageHead eyebrow="Support / Inbox" title="INBOX." desc="Official announcements from organisers and your personal notifications, in one place instead of five WhatsApp groups." aside={<PageCount value={unread} label="Unread" />} />

      <div className="grid gap-8 xl:grid-cols-12">
        <section id="communication" aria-labelledby="h-comm" className="xl:col-span-7">
          <SecHead num="01" title="Official communication" id="h-comm">
            <label><span className="sr-only">Filter by hackathon</span>
              <select className="select" style={{ width: 200, minHeight: 40 }} value={ev} onChange={(e) => setEv(e.target.value)}>
                <option value="all">All hackathons</option>
                {events.map((e) => <option key={e} value={e}>{bySlug(e)!.title}</option>)}
              </select>
            </label>
          </SecHead>
          <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 10 }}>
            {list.map((a) => (
              <li key={a.id} className="card card-pad" style={a.pinned ? { borderColor: "var(--lime-nav)", boxShadow: "inset 3px 0 0 var(--lime-nav)" } : undefined}>
                <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 8 }}>
                  <Megaphone size={15} aria-hidden="true" style={{ color: "var(--purple)" }} />
                  <span className="card-label">{bySlug(a.slug)!.title} · {a.from}</span>
                  {a.pinned && <span className="chip" style={{ height: 22 }}><Pin size={11} aria-hidden="true" />Pinned</span>}
                  <span className="card-label" style={{ marginLeft: "auto" }}><time dateTime={a.at}>{fmtDateTime(a.at)}</time></span>
                </div>
                <h3 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 800, letterSpacing: "-.02em" }}>{a.title}</h3>
                <p style={{ margin: 0, color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7 }}>{a.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section id="notifications" aria-labelledby="h-notif" className="xl:col-span-5">
          <SecHead num="02" title="Notifications" id="h-notif">
            <button type="button" className="link-arrow purple" onClick={markAll} disabled={!unread} style={!unread ? { opacity: 0.5, cursor: "default" } : undefined}>Mark all read</button>
          </SecHead>
          {s.notifications.length ? (
            <ul className="card" style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {s.notifications.map((n) => {
                const Icon = ICON[n.kind];
                return (
                  <li key={n.id} style={{ borderBottom: "1px solid var(--line)", position: "relative", background: n.read ? undefined : "color-mix(in oklab, var(--purple) 5%, var(--surface))" }}>
                    <Link to={n.to ?? "#"} onClick={() => markOne(n.id)} style={{ display: "grid", gridTemplateColumns: "36px 1fr auto", gap: 12, padding: "16px 18px", textDecoration: "none" }}>
                      <span className="icon-btn" style={{ width: 36, height: 36 }} aria-hidden="true"><Icon size={16} /></span>
                      <span style={{ minWidth: 0 }}>
                        <strong style={{ display: "block", fontSize: 14, fontWeight: n.read ? 600 : 800 }}>{n.title}</strong>
                        <span style={{ display: "block", fontSize: 13, color: "var(--ink-2)", marginTop: 2 }}>{n.body}</span>
                      </span>
                      <span style={{ textAlign: "right" }}>
                        <span className="card-label" style={{ whiteSpace: "nowrap" }}>{relativeAgo(n.at, now)}</span>
                        {!n.read && <span style={{ display: "block", width: 8, height: 8, borderRadius: "50%", background: "var(--purple)", margin: "8px 0 0 auto" }} aria-label="Unread" />}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : <Empty title="All caught up." />}
        </section>
      </div>
    </div>
  );
}
