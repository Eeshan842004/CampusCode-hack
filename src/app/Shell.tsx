import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import { Bell, CircleUser, Ellipsis, House, Layers, LogOut, Moon, Search, Sun, Trophy, Users, X } from "lucide-react";
import { Toaster } from "sonner";
import { NAV, findNav } from "./nav";
import { useStore, unreadCount } from "./store";
import { Avatar, Dialog, Mark } from "../components/ui";
import { me } from "../data/mock";
import { current, toggleTheme } from "../lib/theme";
import { countdown } from "../lib/format";
import { useNow } from "../lib/clock";

const Palette = lazy(() => import("../features/Palette"));

function useThemeName() {
  const [t, setT] = useState(current);
  useEffect(() => {
    const on = () => setT(current());
    window.addEventListener("cc-theme", on);
    const mq = matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", on);
    return () => { window.removeEventListener("cc-theme", on); mq.removeEventListener("change", on); };
  }, []);
  return t;
}

/** Cursor glow for .lift cards: one listener, one style write per frame. */
function useLiftGlow() {
  useEffect(() => {
    if (!matchMedia("(pointer: fine)").matches) return;
    let raf = 0, ev: PointerEvent | null = null;
    const onMove = (e: PointerEvent) => {
      ev = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = (ev?.target as Element | null)?.closest?.(".lift") as HTMLElement | null;
        if (!el || !ev) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${ev.clientX - r.left}px`);
        el.style.setProperty("--my", `${ev.clientY - r.top}px`);
      });
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => { document.removeEventListener("pointermove", onMove); cancelAnimationFrame(raf); };
  }, []);
}

function ThemeButton() {
  const t = useThemeName();
  const ref = useRef<HTMLButtonElement>(null);
  return (
    <button ref={ref} type="button" className="icon-btn" onClick={() => toggleTheme(ref.current)} aria-label={t === "dark" ? "Switch to light mode" : "Switch to dark mode"} title={t === "dark" ? "Light mode" : "Dark mode"}>
      {t === "dark" ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
    </button>
  );
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const s = useStore();
  const unread = unreadCount(s);
  const { pathname } = useLocation();
  const active = findNav(pathname);
  return (
    <>
      {NAV.map((sec, i) => (
        <div key={sec.label}>
          {i > 0 && <div className="nav-sep" aria-hidden="true" />}
          <div className="sidebar-label" id={`nav-${sec.label}`}>{sec.label}</div>
          <ul className="nav-list" aria-labelledby={`nav-${sec.label}`}>
            {sec.items.map((it) => {
              const isActive = active?.path === it.path;
              const Icon = it.icon;
              return (
                <li key={it.path}>
                  <Link to={it.path} className="nav-item" aria-current={isActive ? "page" : undefined} onClick={onNavigate} title={it.label}>
                    <Icon size={16} strokeWidth={1.8} aria-hidden="true" />
                    <span>{it.label}</span>
                    {it.count === "unread" && unread > 0 && <b className="nav-count" aria-label={`${unread} unread`}>{unread}</b>}
                    {it.tag && !isActive && <span className="nav-tag" aria-hidden="true">{it.tag}</span>}
                    {isActive && <span className="nav-arrow" aria-hidden="true">→</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </>
  );
}

function Sidebar({ onLogout }: { onLogout: () => void }) {
  const now = useNow(60_000);
  const { d, h } = countdown("2026-11-05T23:59:00+05:30", now);
  const s = useStore();
  return (
    <aside className="sidebar" aria-label="Main navigation">
      <Link to="/" className="sidebar-brand" aria-label="CampusCode, Hackathon Arena: Overview">
        <Mark />
        <span className="brand-word"><strong>CAMPUSCODE</strong><small>HACKATHON ARENA</small></span>
      </Link>
      <nav className="sidebar-scroll" aria-label="Dashboard">
        <NavLinks />
      </nav>
      <div className="sidebar-foot">
        <Link to="/rounds" className="sidebar-promo">
          <span className="mono">ReBuild '26 · Round 1</span>
          <strong>{s.submittedAt ? "Submitted. Good luck!" : `Closes in ${d}d ${h}h`}</strong>
        </Link>
        <div className="sidebar-user">
          <Avatar name={s.profile.name} hue={me.hue} size={34} />
          <div><strong>{s.profile.name}</strong><small>{me.role}</small></div>
          <button type="button" className="icon-btn logout" onClick={onLogout} aria-label="Log out" title="Log out"><LogOut size={16} strokeWidth={1.8} /></button>
        </div>
      </div>
    </aside>
  );
}

const TABS = [
  { to: "/", label: "Home", icon: House },
  { to: "/hackathons", label: "Hackathons", icon: Trophy },
  { to: "/rounds", label: "Rounds", icon: Layers },
  { to: "/team", label: "Team", icon: Users },
];

export default function Shell() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const s = useStore();
  const unread = unreadCount(s);
  const item = findNav(pathname);
  const [more, setMore] = useState(false);
  const [palette, setPalette] = useState(false);
  const firstPath = useRef(true);
  useLiftGlow();

  // Shared pages scroll to their section; plain pages reset to top. Focus moves to the main heading for screen readers.
  useEffect(() => {
    setMore(false);
    const id = hash.slice(1) || item?.anchor;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const first = firstPath.current;
    firstPath.current = false;
    if (!id) window.scrollTo({ top: 0 });
    // Lazy pages may not be mounted yet: look for the section for up to ~1s.
    let tries = 0, raf = 0;
    const seek = () => {
      const target = id ? document.getElementById(id) : null;
      if (target) target.scrollIntoView({ behavior: reduce || first ? "auto" : "smooth", block: "start" });
      else if (id && tries++ < 60) { raf = requestAnimationFrame(seek); return; }
      if (!first) document.querySelector<HTMLElement>("#main h1")?.focus({ preventScroll: true });
    };
    raf = requestAnimationFrame(seek);
    document.title = `${item?.label ?? "Not found"} · CampusCode`;
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash, item]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setPalette((p) => !p); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const logout = () => navigate("/login");

  return (
    <div className="app">
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="cc-bg-grid" aria-hidden="true" />
      <div className="cc-bg-orb one" aria-hidden="true" />
      <div className="cc-bg-orb two" aria-hidden="true" />
      <Sidebar onLogout={logout} />

      <div className="main">
        <header className="topbar">
          <div className="crumb"><span>CampusCode / Student</span><strong>{item?.label ?? "Not found"}</strong></div>
          <div className="top-actions">
            <button type="button" className="search-btn" onClick={() => setPalette(true)} aria-label="Search and commands (Ctrl K)">
              <Search size={16} strokeWidth={1.8} aria-hidden="true" /><span className="search-label">Search hackathons, people…</span><kbd>Ctrl K</kbd>
            </button>
            <ThemeButton />
            <NavLink to="/notifications" className="icon-btn" aria-label={`Notifications, ${unread} unread`} title="Notifications">
              <Bell size={17} strokeWidth={1.8} aria-hidden="true" />{unread > 0 ? <b className="badge">{unread}</b> : <i className="dot" />}
            </NavLink>
            <Link to="/profile" className="topbar-user" aria-label={`Profile: ${s.profile.name}`}>
              <Avatar name={s.profile.name} hue={me.hue} size={36} />
              <span className="hidden xl:inline">{s.profile.name}</span>
            </Link>
          </div>
        </header>

        <header className="m-topbar">
          <Link to="/" aria-label="CampusCode home"><Mark small /></Link>
          <div className="m-title"><span>CAMPUSCODE / STUDENT</span><strong>{item?.label ?? "Not found"}</strong></div>
          <button type="button" className="icon-btn" onClick={() => setPalette(true)} aria-label="Search"><Search size={17} strokeWidth={1.8} /></button>
          <ThemeButton />
          <NavLink to="/notifications" className="icon-btn" aria-label={`Notifications, ${unread} unread`}>
            <Bell size={17} strokeWidth={1.8} aria-hidden="true" />{unread > 0 && <b className="badge">{unread}</b>}
          </NavLink>
        </header>

        <main id="main" className="content" tabIndex={-1}>
          <Outlet />
        </main>

        <footer className="app-footer">
          <span>Demo data · Built for ReBuild '26</span>
          <span className="live"><span className="chip done" style={{ border: 0, padding: 0, height: "auto", background: "none" }}><span className="sdot" aria-hidden="true" /></span>Clock set to 3 Nov 2026 · IST</span>
          <button type="button" className="link-arrow" style={{ color: "var(--ink-3)", font: "inherit", letterSpacing: "inherit" }} onClick={() => { s.reset(); }}>Reset demo</button>
        </footer>
      </div>

      <nav className="tabbar" aria-label="Main">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"} aria-current={(to === "/" ? pathname === "/" : pathname.startsWith(to) || (to === "/team" && pathname === "/hackmate")) ? "page" : undefined}>
            <Icon size={20} strokeWidth={1.8} aria-hidden="true" />{label}
          </NavLink>
        ))}
        <button type="button" onClick={() => setMore(true)} aria-expanded={more} aria-haspopup="dialog">
          <Ellipsis size={20} strokeWidth={1.8} aria-hidden="true" />More
        </button>
      </nav>

      <Dialog open={more} onClose={() => setMore(false)} className="drawer" labelledBy="more-title">
        <div className="dlg-head">
          <div><p className="eyebrow" style={{ margin: 0 }}>All sections</p><h2 id="more-title" style={{ margin: "6px 0 0", fontSize: 24, fontWeight: 900, letterSpacing: "-.04em" }}>MENU.</h2></div>
          <button type="button" className="icon-btn" onClick={() => setMore(false)} aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="dlg-body" style={{ paddingTop: 4 }}>
          <NavLinks onNavigate={() => setMore(false)} />
          <div style={{ display: "flex", gap: 10, marginTop: 18, alignItems: "center" }}>
            <Link to="/profile" className="btn btn-ghost btn-sm" onClick={() => setMore(false)}><CircleUser size={16} /> {s.profile.name}</Link>
            <button type="button" className="btn btn-ghost btn-sm" onClick={logout}><LogOut size={16} /> Log out</button>
          </div>
        </div>
      </Dialog>

      {palette && (
        <Suspense fallback={null}>
          <Palette onClose={() => setPalette(false)} />
        </Suspense>
      )}
      <AppToaster />
    </div>
  );
}

/** Toasts move to the top on phones so the tab bar never covers them. */
function AppToaster() {
  const [phone, setPhone] = useState(() => matchMedia("(max-width: 767px)").matches);
  const theme = useThemeName();
  useEffect(() => {
    const mq = matchMedia("(max-width: 767px)");
    const on = () => setPhone(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return <Toaster theme={theme} position={phone ? "top-center" : "bottom-right"} closeButton toastOptions={{ style: { background: "var(--surface)", color: "var(--ink)", border: "1px solid var(--line)" } }} />;
}
