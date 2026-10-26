import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { Command } from "cmdk";
import { NAV_ITEMS } from "../app/nav";
import { hackathons, people } from "../data/mock";
import { toggleTheme } from "../lib/theme";

export default function Palette({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate();
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { ref.current?.showModal(); }, []);
  const go = (to: string) => { onClose(); navigate(to); };
  return (
    <dialog ref={ref} className="modal palette" aria-label="Command palette" onClose={onClose} onClick={(e) => { if (e.target === ref.current) onClose(); }} style={{ marginTop: "12vh" }}>
      <style>{`
        .palette [cmdk-input] { width: 100%; border: 0; border-bottom: 1px solid var(--line); background: none; padding: 18px 20px; font-size: 16px; outline: none; color: var(--ink); }
        .palette [cmdk-list] { max-height: min(420px, 60dvh); overflow: auto; padding: 8px; }
        .palette [cmdk-group-heading] { font: 500 11px var(--font-mono); letter-spacing: .15em; color: var(--ink-3); text-transform: uppercase; padding: 10px 12px 6px; }
        .palette [cmdk-item] { display: flex; align-items: center; gap: 12px; min-height: 44px; padding: 0 12px; border-radius: 8px; cursor: pointer; font-size: 14px; font-weight: 600; }
        .palette [cmdk-item][data-selected="true"] { background: var(--lime-nav); color: #111; }
        .palette [cmdk-item] small { margin-left: auto; font: 500 11px var(--font-mono); color: inherit; opacity: .7; letter-spacing: .08em; }
        .palette [cmdk-empty] { padding: 24px; text-align: center; color: var(--ink-2); font-size: 14px; }
      `}</style>
      <Command label="Search and commands" loop>
        <Command.Input autoFocus placeholder="Search pages, hackathons, people…" />
        <Command.List>
          <Command.Empty>No results. Try “Rounds” or “Future Web”.</Command.Empty>
          <Command.Group heading="Actions">
            <Command.Item onSelect={() => go("/rounds")}>Continue ReBuild '26 submission<small>Action</small></Command.Item>
            <Command.Item onSelect={() => { onClose(); toggleTheme(); }}>Toggle dark mode<small>Theme</small></Command.Item>
            <Command.Item onSelect={() => go("/hackmate")}>Find a designer<small>HackMate</small></Command.Item>
          </Command.Group>
          <Command.Group heading="Pages">
            {NAV_ITEMS.map((n) => <Command.Item key={n.path} value={`page ${n.label}`} onSelect={() => go(n.path)}>{n.label}<small>Page</small></Command.Item>)}
          </Command.Group>
          <Command.Group heading="Hackathons">
            {hackathons.map((h) => <Command.Item key={h.slug} value={`${h.title} ${h.category}`} onSelect={() => go(`/hackathons/${h.slug}`)}>{h.title}<small>{h.status}</small></Command.Item>)}
          </Command.Group>
          <Command.Group heading="People">
            {people.map((p) => <Command.Item key={p.id} value={`${p.name} ${p.role} ${p.skills.join(" ")}`} onSelect={() => go("/hackmate")}>{p.name}<small>{p.role}</small></Command.Item>)}
          </Command.Group>
        </Command.List>
      </Command>
    </dialog>
  );
}
