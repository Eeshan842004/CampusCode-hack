import { useState } from "react";
import { Download, Printer, Share2 } from "lucide-react";
import { useStore } from "../app/store";
import { bySlug, me, type Registration } from "../data/mock";
import { Avatar, Dialog, Empty, Mark, PageHead, SecHead } from "../components/ui";
import { fmtDate } from "../lib/format";

function Certificate({ r, name }: { r: Registration; name: string }) {
  const h = bySlug(r.slug)!;
  const res = r.result!;
  return (
    <div className="print-area" style={{ padding: "40px 44px", background: "#fff", color: "#111", position: "relative", overflow: "hidden", border: "1px solid #deded8", aspectRatio: "1.414", display: "flex", flexDirection: "column" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#1111110b 1px,#0000 1px),linear-gradient(90deg,#1111110b 1px,#0000 1px)", backgroundSize: "28px 28px" }} aria-hidden="true" />
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ display: "flex", gap: 10, alignItems: "center" }}><Mark small /><b style={{ letterSpacing: ".16em", fontSize: 13 }}>CAMPUSCODE</b></span>
        <span style={{ font: "500 10px var(--font-mono)", letterSpacing: ".15em", color: "#555" }}>{r.certificateId}</span>
      </div>
      <div style={{ position: "relative", marginTop: "auto" }}>
        <p style={{ font: "500 11px var(--font-mono)", letterSpacing: ".2em", color: "#587c0f", margin: 0 }}>CERTIFICATE OF {res.place === "Participant" ? "PARTICIPATION" : "ACHIEVEMENT"}</p>
        <h3 style={{ margin: "10px 0 6px", fontSize: "clamp(28px, 5vw, 46px)", fontWeight: 900, letterSpacing: "-.06em", lineHeight: 0.95 }}>{name.toUpperCase()}.</h3>
        <p style={{ margin: 0, fontSize: 14, color: "#444", lineHeight: 1.6 }}>
          {res.place === "Participant" ? "Participated in" : `Placed ${res.place.toLowerCase()} (rank ${res.rank} of ${res.of}) in`} <b>{h.title}</b>, organised by {h.organizer}, {fmtDate(h.stages[0].end)}.
        </p>
      </div>
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 28, font: "500 10px var(--font-mono)", letterSpacing: ".14em", color: "#555" }}>
        <span>LEARN · BUILD · COMPETE · SHIP</span><span>DEMO CERTIFICATE</span>
      </div>
    </div>
  );
}

export default function Card() {
  const s = useStore();
  const certs = s.registrations.filter((r) => r.certificateId && r.result);
  const [view, setView] = useState<Registration | null>(null);
  const share = (r: Registration) => `https://wa.me/?text=${encodeURIComponent(`I earned a certificate at ${bySlug(r.slug)!.title} on CampusCode!`)}`;

  return (
    <div className="view-in">
      <PageHead eyebrow="Identity / Verified account" title="DIGITAL ID." desc="Your CampusCode identity card and every certificate you've earned." />

      <section id="card" aria-labelledby="h-card">
        <h2 id="h-card" className="sr-only">Digital card</h2>
        <div className="grid gap-8 xl:grid-cols-12" style={{ alignItems: "center", marginBottom: 48 }}>
          <div className="xl:col-span-7">
            <div className="id-card">
              <div style={{ padding: "26px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 1 }}>
                <span style={{ display: "flex", gap: 12, alignItems: "center" }}><Mark /><span className="brand-word"><strong style={{ display: "block", fontSize: 15, fontWeight: 900, letterSpacing: ".16em" }}>CAMPUSCODE</strong><small style={{ display: "block", font: "700 9px var(--font-sans)", letterSpacing: ".18em", color: "var(--ink-3)" }}>HACKATHON ARENA</small></span></span>
                <span className="chip done"><span className="sdot" aria-hidden="true" />Verified</span>
              </div>
              <div style={{ padding: "8px 28px 26px", display: "flex", gap: 22, alignItems: "center", position: "relative", zIndex: 1, flexWrap: "wrap" }}>
                <Avatar name={s.profile.name} hue={me.hue} size={88} />
                <div style={{ minWidth: 0 }}>
                  <span className="card-label lime">{me.role}</span>
                  <p style={{ margin: "6px 0 4px", fontSize: 30, fontWeight: 900, letterSpacing: "-.05em", lineHeight: 1 }}>{s.profile.name}</p>
                  <p style={{ margin: 0, fontSize: 14, color: "var(--ink-2)" }}>{s.profile.college}</p>
                </div>
              </div>
              <dl style={{ margin: "0 28px", display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", borderTop: "1px solid var(--ink)", borderBottom: "1px solid var(--ink)", position: "relative", zIndex: 1 }}>
                {[["CampusCode ID", me.campusId], ["Year", s.profile.year], ["Member since", fmtDate(me.joined)]].map(([k, v]) => (
                  <div key={k} style={{ padding: "14px 0" }}><dt className="card-label" style={{ fontSize: 10 }}>{k}</dt><dd className="mono" style={{ margin: "6px 0 0", fontSize: 13, letterSpacing: ".06em", color: "var(--ink)" }}>{v}</dd></div>
                ))}
              </dl>
              <div style={{ padding: "18px 28px 24px", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", position: "relative", zIndex: 1 }}>
                <span className="card-label">Learn · Build · Compete · Ship</span>
                <span className="card-label">{certs.length} certificates · {s.registrations.length} events</span>
              </div>
            </div>
          </div>
          <div className="xl:col-span-5">
            <p className="eyebrow" style={{ margin: 0 }}>Identity / 01</p>
            <p style={{ margin: "10px 0 14px", fontSize: "clamp(2rem, 1.4rem + 2vw, 3.25rem)", fontWeight: 900, letterSpacing: "-.06em", lineHeight: 0.92 }}>ONE ID.<br />YOUR <span style={{ color: "transparent", WebkitTextStroke: "1.5px var(--outline-stroke)" }}>CAMPUSCODE.</span></p>
            <p style={{ margin: "0 0 20px", color: "var(--ink-2)", fontSize: 14, lineHeight: 1.7 }}>Show it at offline events and on your portfolio. Organisers check your ID against your registrations.</p>
            <button type="button" className="btn btn-outline" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Print / save</button>
          </div>
        </div>
      </section>

      <section id="certificates" aria-labelledby="h-certs">
        <SecHead num="01" title="Certificates" id="h-certs" note={`${certs.length} earned`} />
        {certs.length ? (
          <div className="grid gap-3 md:grid-cols-3">
            {certs.map((r) => {
              const h = bySlug(r.slug)!;
              return (
                <article key={r.certificateId} className="card card-pad lift" style={{ display: "grid", gap: 14 }}>
                  <span className="card-label">{fmtDate(h.stages[0].end)}</span>
                  <h3 className="card-title" style={{ textTransform: "uppercase", margin: 0 }}>{h.title}</h3>
                  <p style={{ margin: 0, fontSize: 14 }}><b>{r.result!.place}</b> · Rank {r.result!.rank} of {r.result!.of}</p>
                  <p className="mono" style={{ margin: 0, fontSize: 11, color: "var(--ink-3)" }}>{r.certificateId}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", borderTop: "1px solid var(--line)", paddingTop: 14 }}>
                    <button type="button" className="btn btn-outline btn-sm" onClick={() => setView(r)}><Download size={14} aria-hidden="true" /> View & download</button>
                    <a className="btn btn-ghost btn-sm" href={share(r)} target="_blank" rel="noreferrer" aria-label={`Share ${h.title} certificate on WhatsApp`}><Share2 size={14} aria-hidden="true" /> Share</a>
                  </div>
                </article>
              );
            })}
          </div>
        ) : <Empty title="No certificates yet.">Finish a hackathon to earn your first one.</Empty>}
      </section>

      <Dialog open={!!view} onClose={() => setView(null)} labelledBy="cert-title">
        {view && (
          <>
            <div className="dlg-head"><h2 id="cert-title" style={{ margin: 0, fontSize: 20, fontWeight: 900, letterSpacing: "-.03em" }}>{bySlug(view.slug)!.title} certificate</h2></div>
            <div className="dlg-body"><Certificate r={view} name={s.profile.name} /></div>
            <div className="dlg-foot">
              <button type="button" className="btn btn-ghost" onClick={() => setView(null)}>Close</button>
              <button type="button" className="btn btn-primary" onClick={() => window.print()}><Printer size={16} aria-hidden="true" /> Print or save PDF</button>
            </div>
          </>
        )}
      </Dialog>
    </div>
  );
}
