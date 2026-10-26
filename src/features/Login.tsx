import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast, Toaster } from "sonner";
import { Mark } from "../components/ui";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("aditi.sharma@college.edu");
  const [stage, setStage] = useState<"email" | "code">("email");
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const [err, setErr] = useState<string | null>(null);
  const [shake, setShake] = useState(0);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  useEffect(() => { document.title = "Log in · CampusCode"; }, []);
  useEffect(() => { if (stage === "code") boxes.current[0]?.focus(); }, [stage]);

  const sendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setErr("That email doesn't look right. Use the one you registered with, like name@college.edu."); return; }
    setErr(null); setStage("code");
    toast.success(`Code sent to ${email}.`);
  };
  const setDigit = (i: number, v: string) => {
    const digits = v.replace(/\D/g, "");
    if (digits.length > 1) { // paste
      const next = [...code];
      digits.slice(0, 6 - i).split("").forEach((d, k) => (next[i + k] = d));
      setCode(next);
      boxes.current[Math.min(5, i + digits.length)]?.focus();
      return;
    }
    const next = [...code]; next[i] = digits; setCode(next);
    if (digits && i < 5) boxes.current[i + 1]?.focus();
  };
  const enter = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.join("").length < 6) { setErr("Enter all 6 digits. Demo: any 6 digits work."); setShake((n) => n + 1); return; }
    navigate("/");
  };

  return (
    <div style={{ minHeight: "100dvh", display: "grid", gridTemplateColumns: "minmax(0,1.2fr) minmax(0,1fr)", position: "relative" }} className="login">
      <style>{`@media (max-width: 900px) { .login { grid-template-columns: 1fr !important; } .login-art { min-height: 46dvh; } } @keyframes otpShake { 20%,60% { transform: translateX(-4px) } 40%,80% { transform: translateX(4px) } } .otp-shake { animation: otpShake .3s } @media (prefers-reduced-motion: reduce) { .otp-shake { animation: none } }`}</style>
      <div className="login-art" style={{ position: "relative", overflow: "hidden", borderRight: "1px solid var(--line)", padding: "32px clamp(20px, 5vw, 64px)", display: "flex", flexDirection: "column" }}>
        <div className="cc-bg-grid" style={{ position: "absolute" }} aria-hidden="true" />
        <div className="cc-bg-orb one" style={{ position: "absolute" }} aria-hidden="true" />
        <div className="cc-bg-orb two" style={{ position: "absolute" }} aria-hidden="true" />
        <Link to="/" style={{ position: "relative", display: "flex", gap: 12, alignItems: "center", textDecoration: "none" }} aria-label="CampusCode home"><Mark /><span className="brand-word"><strong style={{ display: "block", fontSize: 15, fontWeight: 900, letterSpacing: ".16em" }}>CAMPUSCODE</strong><small style={{ display: "block", font: "700 9px var(--font-sans)", letterSpacing: ".18em", color: "var(--ink-3)" }}>HACKATHON ARENA</small></span></Link>
        <div style={{ position: "relative", marginTop: "auto" }}>
          <p className="eyebrow" style={{ margin: 0 }}>CampusCode / Authentication</p>
          <h1 style={{ margin: "14px 0 18px", fontSize: "clamp(3.5rem, 2rem + 7vw, 9rem)", fontWeight: 900, letterSpacing: "-.065em", lineHeight: 0.84 }} className="view-in">
            ENTER<br /><span style={{ color: "transparent", WebkitTextStroke: "1.5px var(--outline-stroke)" }}>THE ARENA</span>.
          </h1>
          <p style={{ margin: 0, color: "var(--ink-2)", maxWidth: 420, lineHeight: 1.7 }}>Sign in to continue building, collaborating and competing with the CampusCode community.</p>
          <div style={{ display: "flex", gap: 24, marginTop: 28 }} aria-hidden="true">{["Build", "Compete", "Ship"].map((w, i) => <span key={w} className="card-label"><span style={{ color: "var(--purple-ink)" }}>0{i + 1}</span> {w}</span>)}</div>
        </div>
      </div>

      <div style={{ display: "grid", placeItems: "center", padding: "40px clamp(20px, 5vw, 64px)", background: "var(--surface)" }}>
        <div style={{ width: "min(420px, 100%)" }}>
          <p className="card-label" style={{ margin: 0 }}>{stage === "email" ? "Existing account / Login" : "Step 2 of 2"}</p>
          <h2 style={{ margin: "8px 0 8px", fontSize: 34, fontWeight: 900, letterSpacing: "-.05em" }}>{stage === "email" ? "Log in." : "Check your email."}</h2>
          <p style={{ margin: "0 0 26px", color: "var(--ink-2)", fontSize: 14 }}>{stage === "email" ? "We'll send a 6-digit code. No password needed." : <>We sent a code to <b>{email}</b>. Demo: any 6 digits work.</>}</p>
          {stage === "email" ? (
            <form onSubmit={sendCode} noValidate style={{ display: "grid", gap: 16 }}>
              <label className="field"><span>College email</span>
                <input className="input" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!err} aria-describedby={err ? "login-err" : undefined} />
                {err && <span id="login-err" className="err">{err}</span>}
              </label>
              <button type="submit" className="btn btn-dark btn-block">Send login code <span className="arrow" aria-hidden="true">↗</span></button>
            </form>
          ) : (
            <form onSubmit={enter} noValidate style={{ display: "grid", gap: 16 }}>
              <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
                <legend className="field-label" style={{ marginBottom: 10 }}>6-digit code</legend>
                <div key={shake} className={shake ? "otp-shake" : undefined} style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 8 }}>
                  {code.map((d, i) => (
                    <input key={i} ref={(el) => { boxes.current[i] = el; }} className="input tnum" inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"} aria-label={`Digit ${i + 1}`} value={d}
                      style={{ textAlign: "center", fontSize: 22, fontWeight: 800, padding: 0, minHeight: 56 }} aria-invalid={!!err && !d}
                      onChange={(e) => setDigit(i, e.target.value)} onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) boxes.current[i - 1]?.focus(); }} />
                  ))}
                </div>
              </fieldset>
              {err && <span className="err" role="alert">{err}</span>}
              <button type="submit" className="btn btn-dark btn-block">Enter <span className="arrow" aria-hidden="true">↗</span></button>
              <button type="button" className="link-arrow purple" onClick={() => { setStage("email"); setCode(Array(6).fill("")); setErr(null); }}>← Use a different email</button>
            </form>
          )}
          <p className="card-label" style={{ marginTop: 30 }}>Demo data · Built for ReBuild '26</p>
        </div>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
