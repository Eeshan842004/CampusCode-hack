import {
  Award, BadgeCheck, BookOpen, Bot, ChartBar, CircleUser, Clock3, IdCard, Layers, LayoutGrid,
  LifeBuoy, Lightbulb, Megaphone, Bell, Sparkles, Trophy, Users, type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  /** Shared pages: tabs that live on the same page scroll to this section id. */
  anchor?: string;
  tag?: "AI";
  count?: "unread";
}
export interface NavSection { label: string; items: NavItem[] }

// Same labels and order as CampusCode's real student sidebar, grouped under section headers.
export const NAV: NavSection[] = [
  { label: "Workspace", items: [
    { label: "Overview", path: "/", icon: LayoutGrid },
    { label: "Hackathons", path: "/hackathons", icon: Trophy },
    { label: "My Registrations", path: "/registrations", icon: Clock3 },
  ] },
  { label: "Build", items: [
    { label: "HackMate AI", path: "/hackmate", icon: Sparkles, anchor: "hackmate", tag: "AI" },
    { label: "IdeaCheck AI", path: "/ideacheck", icon: Lightbulb, tag: "AI" },
    { label: "My Team", path: "/team", icon: Users },
    { label: "Rounds", path: "/rounds", icon: Layers },
  ] },
  { label: "Compete", items: [
    { label: "Results", path: "/results", icon: Award },
    { label: "Leaderboard", path: "/leaderboard", icon: ChartBar, anchor: "leaderboard" },
  ] },
  { label: "Support", items: [
    { label: "RuleBot AI", path: "/rulebot", icon: Bot, tag: "AI" },
    { label: "Student Guide", path: "/guide", icon: BookOpen },
    { label: "Official Communication", path: "/communication", icon: Megaphone },
    { label: "Notifications", path: "/notifications", icon: Bell, anchor: "notifications", count: "unread" },
    { label: "Help & Support", path: "/help", icon: LifeBuoy, anchor: "help" },
  ] },
  { label: "Account", items: [
    { label: "Digital Card", path: "/card", icon: IdCard },
    { label: "Certificates", path: "/certificates", icon: BadgeCheck, anchor: "certificates" },
    { label: "Profile", path: "/profile", icon: CircleUser },
  ] },
];

export const NAV_ITEMS = NAV.flatMap((s) => s.items);

export function findNav(pathname: string): NavItem | undefined {
  if (pathname === "/") return NAV_ITEMS[0];
  if (pathname.startsWith("/hackathons/")) return NAV_ITEMS.find((i) => i.path === "/hackathons");
  return NAV_ITEMS.find((i) => i.path !== "/" && pathname.startsWith(i.path));
}
