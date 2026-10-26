import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  initialChecklist, initialInvites, initialNotifications, initialRegistrations, me, teams,
  type CheckItem, type Invite, type Notice, type Registration, type Team,
} from "../data/mock";

interface Profile { name: string; college: string; year: string; bio: string; skills: string[] }
interface Prefs { email: boolean; whatsapp: boolean; remind24h: boolean }
interface State {
  registrations: Registration[];
  checklist: CheckItem[];
  submittedAt: string | null;
  invites: Invite[];
  notifications: Notice[];
  teams: Team[];
  saved: string[];
  sentInvites: string[];
  profile: Profile;
  prefs: Prefs;
}

const KEY = "cc-demo-state-v1";
const fresh = (): State => ({
  registrations: initialRegistrations,
  checklist: initialChecklist,
  submittedAt: null,
  invites: initialInvites,
  notifications: initialNotifications,
  teams,
  saved: ["healthstack-48"],
  sentInvites: [],
  profile: { name: me.name, college: me.college, year: me.year, bio: me.bio, skills: me.skills },
  prefs: { email: true, whatsapp: true, remind24h: true },
});

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch { /* storage unavailable: run in memory */ }
  return fresh();
}

type Ctx = State & {
  set: (fn: (s: State) => State) => void;
  reset: () => void;
  register: (slug: string) => void;
  toggleSaved: (slug: string) => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(load);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* ignore */ }
  }, [state]);

  const set = useCallback((fn: (s: State) => State) => setState(fn), []);
  const reset = useCallback(() => setState(fresh()), []);
  const register = useCallback((slug: string) => setState((s) =>
    s.registrations.some((r) => r.slug === slug) ? s : {
      ...s,
      registrations: [{ slug, role: "Participant", step: 0, status: "Registered", registeredAt: new Date().toISOString(), next: { label: "Form your team", to: "/team" } }, ...s.registrations],
    }), []);
  const toggleSaved = useCallback((slug: string) => setState((s) => ({
    ...s, saved: s.saved.includes(slug) ? s.saved.filter((x) => x !== slug) : [...s.saved, slug],
  })), []);

  const value = useMemo(() => ({ ...state, set, reset, register, toggleSaved }), [state, set, reset, register, toggleSaved]);
  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore outside StoreProvider");
  return ctx;
}

export const unreadCount = (s: State) => s.notifications.filter((n) => !n.read).length;
export const checklistDone = (s: State) => s.checklist.filter((c) => c.done).length;
