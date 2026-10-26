import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ExternalLink, X } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../app/store";
import { badges, me } from "../data/mock";
import { Avatar, PageHead, SecHead } from "../components/ui";
import { fmtDate } from "../lib/format";
import { getPref, setPref, type ThemePref } from "../lib/theme";

export default function Profile() {
  const s = useStore();
  const [form, setForm] = useState(s.profile);
  const [skill, setSkill] = useState("");
  const [theme, setTheme] = useState<ThemePref>(getPref);
  const [err, setErr] = useState<string | null>(null);
  const dirty = JSON.stringify(form) !== JSON.stringify(s.profile);
  useEffect(() => setForm(s.profile), [s.profile]);

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) { setErr("Add your full name, at least 2 characters."); return; }
    setErr(null);
    s.set((st) => ({ ...st, profile: { ...form, name: form.name.trim() } }));
    toast.success("Changes saved.");
  };
  const addSkill = () => {
    const v = skill.trim();
    if (v && !form.skills.includes(v)) setForm({ ...form, skills: [...form.skills, v] });
    setSkill("");
  };
  const pref = (k: keyof typeof s.prefs) => s.set((st) => ({ ...st, prefs: { ...st.prefs, [k]: !st.prefs[k] } }));
  const filled = [form.name, form.college, form.year, form.bio, form.skills.length >= 3, me.links.github].filter(Boolean).length;
  const pct = Math.round((filled / 6) * 100);

  return (
    <div className="view-in">
      <PageHead eyebrow="Account / Profile" title={<>YOUR <span className="ol-text">PROFILE.</span></>} desc="Your public builder profile. Teams see this when HackMate suggests you." />

      <section className="card card-pad" style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }} aria-label="Profile summary">
        <Avatar name={s.profile.name} hue={me.hue} size={84} />
        <div style={{ flex: "1 1 300px", minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 28, fontWeight: 900, letterSpacing: "-.05em" }}>{s.profile.name}</p>
          <p style={{ margin: "4px 0 10px", color: "var(--ink-2)" }}>{s.profile.college} · {s.profile.year} · {me.degree}</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{s.profile.skills.map((k) => <span key={k} className="tag">{k}</span>)}</div>
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {Object.entries(me.links).map(([k, v]) => <a key={k} href={`https://${v}`} target="_blank" rel="noreferrer" className="link-arrow purple" style={{ textTransform: "none", letterSpacing: 0, fontWeight: 600 }}><ExternalLink size={13} aria-hidden="true" />{v}</a>)}
        </div>
      </section>
      <div className="card" style={{ padding: "14px 24px", display: "flex", alignItems: "center", gap: 16, marginBottom: 40, flexWrap: "wrap" }}>
        <span className="card-label">Profile {pct}% complete</span>
        <span style={{ flex: "1 1 200px", height: 6, background: "var(--surface-soft)", position: "relative" }} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completeness">
          <span style={{ position: "absolute", inset: 0, transformOrigin: "left", transform: `scaleX(${pct / 100})`, background: "var(--purple)", transition: "transform .6s var(--ease-out)" }} />
        </span>
        <span style={{ fontSize: 13, color: "var(--ink-2)" }}>{pct < 100 ? "Add a bio and 3+ skills to rank higher in HackMate." : "Looking good."}</span>
      </div>

      <section aria-labelledby="h-badges" style={{ marginBottom: 40 }}>
        <SecHead num="01" title="Achievements" id="h-badges" note="Earned by doing" />
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4" style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {badges.map((b, i) => (
            <li key={b.id} className="card card-pad" style={{ display: "flex", gap: 14, alignItems: "center", animation: `cardRise .5s var(--ease-back) ${i * 70}ms both` }}>
              <span style={{ width: 52, height: 52, flex: "none", border: "1.5px solid var(--ink)", display: "grid", placeItems: "center", font: "500 12px var(--font-mono)", letterSpacing: ".06em", background: i === 1 ? "var(--lime-nav)" : "var(--surface)", color: i === 1 ? "#111" : "var(--ink)" }} aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
              <div><strong style={{ display: "block" }}>{b.label}</strong><span style={{ fontSize: 13, color: "var(--ink-2)" }}>{b.desc}</span><span className="card-label" style={{ display: "block", marginTop: 4, fontSize: 10 }}>{fmtDate(b.earned)}</span></div>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 xl:grid-cols-12">
        <section className="xl:col-span-7" aria-labelledby="h-account">
          <SecHead num="02" title="Account" id="h-account" />
          <form className="card card-pad" onSubmit={save} noValidate style={{ display: "grid", gap: 18 }}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="field"><span>Full name</span>
                <input className="input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} aria-invalid={!!err} aria-describedby={err ? "name-err" : undefined} autoComplete="name" />
                {err && <span id="name-err" className="err">{err}</span>}
              </label>
              <label className="field"><span>Email</span><input className="input" value={me.email} readOnly aria-describedby="email-hint" /><span id="email-hint" className="hint">Your login email can't be changed here.</span></label>
              <label className="field"><span>College</span><input className="input" value={form.college} onChange={(e) => setForm({ ...form, college: e.target.value })} /></label>
              <label className="field"><span>Year</span>
                <select className="select" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}>{["1st year", "2nd year", "3rd year", "4th year", "Postgraduate"].map((y) => <option key={y}>{y}</option>)}</select>
              </label>
            </div>
            <label className="field"><span>Bio</span><textarea className="textarea" value={form.bio} maxLength={240} onChange={(e) => setForm({ ...form, bio: e.target.value })} aria-describedby="bio-count" /><span id="bio-count" className="hint">{form.bio.length}/240</span></label>
            <div className="field">
              <label htmlFor="skill-in">Skills</label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {form.skills.map((k) => (
                  <span key={k} className="tag" style={{ paddingRight: 2 }}>{k}
                    <button type="button" aria-label={`Remove ${k}`} onClick={() => setForm({ ...form, skills: form.skills.filter((x) => x !== k) })} style={{ border: 0, background: "none", cursor: "pointer", display: "grid", placeItems: "center", width: 24, height: 24, color: "var(--ink-3)" }}><X size={12} /></button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input id="skill-in" className="input" value={skill} onChange={(e) => setSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }} placeholder="Add a skill and press Enter" />
                <button type="button" className="btn btn-ghost" onClick={addSkill}>Add</button>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, alignItems: "center", borderTop: "1px solid var(--line)", paddingTop: 18 }}>
              {!dirty && <span className="hint" style={{ marginRight: "auto" }}>No unsaved changes.</span>}
              <button type="button" className="btn btn-ghost" disabled={!dirty} onClick={() => setForm(s.profile)}>Discard</button>
              <button type="submit" className="btn btn-primary" disabled={!dirty}>Save changes</button>
            </div>
          </form>
        </section>

        <section className="xl:col-span-5" aria-labelledby="h-prefs">
          <SecHead num="03" title="Preferences" id="h-prefs" />
          <div className="card card-pad" style={{ display: "grid", gap: 6 }}>
            <fieldset style={{ border: 0, padding: 0, margin: "0 0 10px" }}>
              <legend className="field-label" style={{ marginBottom: 10 }}>Theme</legend>
              <div className="tabs" role="radiogroup" aria-label="Theme">
                {(["system", "light", "dark"] as ThemePref[]).map((t) => (
                  <button key={t} type="button" role="radio" aria-checked={theme === t} className="tab" style={theme === t ? { background: "var(--lime-nav)", color: "#111" } : undefined} onClick={() => { setTheme(t); setPref(t); }}>{t}</button>
                ))}
              </div>
            </fieldset>
            {([["email", "Email reminders"], ["whatsapp", "WhatsApp reminders"], ["remind24h", "Remind me 24 h before deadlines"]] as const).map(([k, label]) => (
              <div key={k} className="check-row" style={{ justifyContent: "space-between" }}>
                <span id={`pref-${k}`} style={{ fontWeight: 600 }}>{label}</span>
                <button type="button" role="switch" className="switch" aria-checked={s.prefs[k]} aria-labelledby={`pref-${k}`} onClick={() => { pref(k); toast(`${label} ${s.prefs[k] ? "off" : "on"}.`); }} />
              </div>
            ))}
            <p className="hint" style={{ margin: "10px 0 0" }}>Looking for your ID card? It's under <Link to="/card" style={{ color: "var(--purple-ink)", fontWeight: 700 }}>Digital Card</Link>.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
