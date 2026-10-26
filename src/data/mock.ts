// Typed, deterministic mock data. Dates are ISO with +05:30. "Now" in the story is 3 Nov 2026, 18:42 IST (see lib/clock).

export type Status = "live" | "open" | "upcoming" | "completed";
export type Mode = "Online" | "Offline" | "Hybrid";

export interface Stage { id: string; name: string; start: string; end: string; desc: string }
export interface Faq { q: string; a: string }
export interface Hackathon {
  slug: string;
  title: string;
  short: string;
  category: string;
  domain: "Frontend" | "AI" | "Web" | "Smart tech" | "Health" | "Open source" | "Sustainability" | "Fintech" | "Design";
  status: Status;
  organizer: string;
  mode: Mode;
  location?: string;
  prize: number;
  prizeNote: string;
  prizes: { place: string; reward: string }[];
  teamMin: number;
  teamMax: number;
  registered: number;
  beginner: boolean;
  tags: string[];
  description: string;
  eligibility: string;
  regCloses: string;
  stages: Stage[];
  rules: string[];
  faqs: Faq[];
}

export const hackathons: Hackathon[] = [
  {
    slug: "rebuild-26",
    title: "ReBuild '26",
    short: "Recreate the CampusCode dashboard in your own style and skills.",
    category: "Frontend development",
    domain: "Frontend",
    status: "live",
    organizer: "CampusCode",
    mode: "Online",
    prize: 15000,
    prizeNote: "₹15,000 + PPI + internship opportunity",
    prizes: [
      { place: "1st", reward: "₹15,000 + pre-placement interview + certificate + internship opportunity" },
      { place: "2nd", reward: "₹3,000 + certificate" },
      { place: "All participants", reward: "Participation certificate" },
    ],
    teamMin: 1,
    teamMax: 1,
    registered: 44,
    beginner: true,
    tags: ["React", "UI/UX", "Frontend", "Dashboard"],
    description:
      "CampusCode presents ReBuild '26, the Dashboard Recreation Hackathon. Study the CampusCode dashboard, recreate it with your own skills, and show what you can do. Judging looks at how faithfully you recreate the dashboard and at the creativity and polish you bring to it.",
    eligibility: "Open to all college students. Individual participation.",
    regCloses: "2026-11-05T23:59:00+05:30",
    stages: [
      { id: "r1", name: "Dashboard recreation", start: "2026-10-25T10:00:00+05:30", end: "2026-11-05T23:59:00+05:30", desc: "Build the mock logged-in student dashboard. Submit a live link and screenshots; a GitHub repo is optional but appreciated." },
      { id: "r2", name: "Presentation", start: "2026-11-07T10:00:00+05:30", end: "2026-11-08T22:00:00+05:30", desc: "Shortlisted builders present their design choices, features and tech stack." },
      { id: "r3", name: "Results", start: "2026-11-09T18:00:00+05:30", end: "2026-11-09T18:00:00+05:30", desc: "Winners announced. Certificates issued to everyone who submitted." },
    ],
    rules: [
      "Individual participation only.",
      "Frontend only. Mock or static data is allowed; no backend is needed.",
      "Use the landing page's design style, colours and branding as your reference. The deliverable is the dashboard itself.",
      "You can add tabs such as Profile or My Hackathons, but the core dashboard must stay the heart of it.",
      "Round 1 deliverables: a live hosted link and screenshots. A GitHub repo is optional but appreciated.",
      "Judging is mainly on desktop. Mobile responsiveness earns extra polish points.",
    ],
    faqs: [
      { q: "When does Round 1 close?", a: "Round 1 submissions close on 5 Nov 2026." },
      { q: "Can I work in a team?", a: "No. ReBuild '26 is individual participation." },
      { q: "Do I need a backend?", a: "No. It's frontend only, and mock or static data is allowed." },
      { q: "What counts as polish?", a: "Dark mode, accessible contrast, fast load times and other UX upgrades." },
    ],
  },
  {
    slug: "ai-innovation",
    title: "AI Innovation",
    short: "Build intelligent solutions for problems that matter.",
    category: "Artificial intelligence",
    domain: "AI",
    status: "live",
    organizer: "CampusCode × AI Club, Anna University",
    mode: "Online",
    prize: 50000,
    prizeNote: "₹50,000 pool + cloud credits",
    prizes: [
      { place: "1st", reward: "₹25,000 + cloud credits" },
      { place: "2nd", reward: "₹15,000" },
      { place: "3rd", reward: "₹10,000" },
    ],
    teamMin: 2,
    teamMax: 4,
    registered: 212,
    beginner: false,
    tags: ["LLMs", "Python", "Computer vision", "Agents"],
    description: "A ten-day online build for AI products that solve a real campus or community problem. Mentors from industry review every Round 1 idea.",
    eligibility: "Undergraduate and postgraduate students in India. Teams of 2 to 4.",
    regCloses: "2026-11-06T23:59:00+05:30",
    stages: [
      { id: "r1", name: "Idea submission", start: "2026-11-01T10:00:00+05:30", end: "2026-11-06T23:59:00+05:30", desc: "Problem statement, approach and dataset plan." },
      { id: "r2", name: "Build sprint", start: "2026-11-07T10:00:00+05:30", end: "2026-11-10T20:00:00+05:30", desc: "Ship a working prototype." },
      { id: "r3", name: "Demo day", start: "2026-11-12T15:00:00+05:30", end: "2026-11-12T19:00:00+05:30", desc: "Five-minute demos to the jury." },
    ],
    rules: ["Teams of 2 to 4.", "Open-source models or APIs are allowed; declare them.", "Code written before 1 Nov must be declared."],
    faqs: [{ q: "Can first-years join?", a: "Yes, any year can join." }],
  },
  {
    slug: "future-web",
    title: "Future Web",
    short: "Design and ship the next generation of digital experiences.",
    category: "Web development",
    domain: "Web",
    status: "open",
    organizer: "CampusCode",
    mode: "Hybrid",
    location: "Chennai",
    prize: 100000,
    prizeNote: "₹1,00,000 pool",
    prizes: [
      { place: "1st", reward: "₹50,000 + internship interviews" },
      { place: "2nd", reward: "₹30,000" },
      { place: "3rd", reward: "₹20,000" },
    ],
    teamMin: 2,
    teamMax: 4,
    registered: 168,
    beginner: false,
    tags: ["React", "Accessibility", "Web performance", "Design systems"],
    description: "A 36-hour hybrid build: online qualifier, then the final in Chennai. Ship a fast, accessible web product that people actually want to use.",
    eligibility: "College students in India. Teams of 2 to 4, at least one designer recommended.",
    regCloses: "2026-11-12T23:59:00+05:30",
    stages: [
      { id: "r1", name: "Problem statement", start: "2026-11-10T10:00:00+05:30", end: "2026-11-13T23:59:00+05:30", desc: "Pick a track and submit your problem statement." },
      { id: "r2", name: "Project build", start: "2026-11-15T09:00:00+05:30", end: "2026-11-16T21:00:00+05:30", desc: "36-hour build, hybrid." },
      { id: "r3", name: "Final submission", start: "2026-11-16T21:00:00+05:30", end: "2026-11-16T23:59:00+05:30", desc: "Repo, live link and a two-minute video." },
    ],
    rules: ["Teams of 2 to 4.", "Finalists must attend the Chennai final in person.", "All code must be written during the event."],
    faqs: [{ q: "Is travel covered for finalists?", a: "Travel within Tamil Nadu is reimbursed for finalists." }],
  },
  {
    slug: "healthstack-48",
    title: "HealthStack 48",
    short: "48 hours to make healthcare kinder and faster.",
    category: "Health tech",
    domain: "Health",
    status: "open",
    organizer: "MedTech Society, Amrita Coimbatore",
    mode: "Online",
    prize: 150000,
    prizeNote: "₹1,50,000 pool",
    prizes: [
      { place: "1st", reward: "₹75,000" },
      { place: "2nd", reward: "₹45,000" },
      { place: "3rd", reward: "₹30,000" },
    ],
    teamMin: 2,
    teamMax: 5,
    registered: 341,
    beginner: true,
    tags: ["Health", "Mobile", "Data", "Accessibility"],
    description: "Two days, three tracks: patient journeys, rural access and mental wellbeing. Doctors mentor every team.",
    eligibility: "Any college student. Teams of 2 to 5. Beginner friendly.",
    regCloses: "2026-11-18T23:59:00+05:30",
    stages: [
      { id: "r1", name: "Kick-off", start: "2026-11-22T09:00:00+05:30", end: "2026-11-22T10:00:00+05:30", desc: "Tracks revealed." },
      { id: "r2", name: "Build", start: "2026-11-22T10:00:00+05:30", end: "2026-11-24T10:00:00+05:30", desc: "48 hours." },
      { id: "r3", name: "Judging", start: "2026-11-24T11:00:00+05:30", end: "2026-11-24T17:00:00+05:30", desc: "Live demos." },
    ],
    rules: ["Teams of 2 to 5.", "No real patient data. Use the provided synthetic datasets."],
    faqs: [{ q: "Do I need medical knowledge?", a: "No. Every team gets a doctor mentor." }],
  },
  {
    slug: "ship-it-oss",
    title: "Ship It: Open Source",
    short: "Land real pull requests in real open-source projects.",
    category: "Open source",
    domain: "Open source",
    status: "open",
    organizer: "FOSS Club, SSN College of Engineering",
    mode: "Online",
    prize: 30000,
    prizeNote: "₹30,000 + swag",
    prizes: [{ place: "Top 10", reward: "₹3,000 each + swag" }],
    teamMin: 1,
    teamMax: 3,
    registered: 96,
    beginner: true,
    tags: ["Git", "Open source", "Docs", "Testing"],
    description: "A one-week sprint where every merged PR scores points. Good-first-issues are tagged and mentors are on Discord.",
    eligibility: "Anyone with a GitHub account. Solo or teams of up to 3.",
    regCloses: "2026-11-09T23:59:00+05:30",
    stages: [{ id: "r1", name: "Sprint week", start: "2026-11-10T00:00:00+05:30", end: "2026-11-17T23:59:00+05:30", desc: "Merged PRs count." }],
    rules: ["Only PRs opened during sprint week count.", "Spam PRs disqualify the whole team."],
    faqs: [{ q: "Do docs PRs count?", a: "Yes, docs and tests score the same as code." }],
  },
  {
    slug: "campus-tech",
    title: "Campus Tech",
    short: "Create technology that makes student life better.",
    category: "Smart technology",
    domain: "Smart tech",
    status: "upcoming",
    organizer: "CampusCode",
    mode: "Offline",
    location: "Chennai",
    prize: 75000,
    prizeNote: "₹75,000 pool",
    prizes: [
      { place: "1st", reward: "₹40,000" },
      { place: "2nd", reward: "₹25,000" },
      { place: "3rd", reward: "₹10,000" },
    ],
    teamMin: 1,
    teamMax: 4,
    registered: 0,
    beginner: true,
    tags: ["IoT", "Mobile", "Campus", "Hardware"],
    description: "Smart campus ideas, built in 24 hours on site: transport, canteens, hostels, libraries. Hardware kits provided.",
    eligibility: "College students. Solo or teams of up to 4.",
    regCloses: "2026-12-01T23:59:00+05:30",
    stages: [{ id: "r1", name: "24-hour build", start: "2026-12-06T09:00:00+05:30", end: "2026-12-07T09:00:00+05:30", desc: "On site in Chennai." }],
    rules: ["Registration opens 20 Nov.", "Hardware kits must be returned."],
    faqs: [{ q: "When does registration open?", a: "20 Nov 2026." }],
  },
  {
    slug: "greengrid-sprint",
    title: "GreenGrid Sprint",
    short: "Climate and energy tools for Indian cities.",
    category: "Sustainability",
    domain: "Sustainability",
    status: "completed",
    organizer: "Energy Club, IIT Madras",
    mode: "Hybrid",
    location: "Chennai",
    prize: 60000,
    prizeNote: "₹60,000 pool",
    prizes: [{ place: "1st", reward: "₹30,000" }, { place: "2nd", reward: "₹20,000" }, { place: "3rd", reward: "₹10,000" }],
    teamMin: 2,
    teamMax: 4,
    registered: 152,
    beginner: false,
    tags: ["Climate", "Data viz", "Maps"],
    description: "A weekend sprint on energy and climate data for Indian cities.",
    eligibility: "Teams of 2 to 4.",
    regCloses: "2026-08-15T23:59:00+05:30",
    stages: [{ id: "r1", name: "Weekend build", start: "2026-08-22T09:00:00+05:30", end: "2026-08-23T18:00:00+05:30", desc: "" }],
    rules: [],
    faqs: [],
  },
  {
    slug: "finhack-chennai",
    title: "FinHack Chennai",
    short: "Payments, savings and credit for first-time earners.",
    category: "Fintech",
    domain: "Fintech",
    status: "completed",
    organizer: "Finance Club, Loyola College",
    mode: "Offline",
    location: "Chennai",
    prize: 100000,
    prizeNote: "₹1,00,000 pool",
    prizes: [{ place: "1st", reward: "₹50,000" }],
    teamMin: 2,
    teamMax: 4,
    registered: 244,
    beginner: false,
    tags: ["UPI", "Fintech", "Mobile"],
    description: "A 24-hour fintech build for first-time earners.",
    eligibility: "Teams of 2 to 4.",
    regCloses: "2026-07-05T23:59:00+05:30",
    stages: [{ id: "r1", name: "24-hour build", start: "2026-07-12T09:00:00+05:30", end: "2026-07-13T09:00:00+05:30", desc: "" }],
    rules: [],
    faqs: [],
  },
  {
    slug: "design-jam",
    title: "Design Jam '25",
    short: "A solo UI challenge judged by working designers.",
    category: "Design",
    domain: "Design",
    status: "completed",
    organizer: "CampusCode",
    mode: "Online",
    prize: 25000,
    prizeNote: "₹25,000 pool",
    prizes: [{ place: "1st", reward: "₹12,000" }],
    teamMin: 1,
    teamMax: 1,
    registered: 96,
    beginner: true,
    tags: ["Figma", "UI", "Prototyping"],
    description: "Redesign a public service app in 48 hours.",
    eligibility: "Solo.",
    regCloses: "2025-12-10T23:59:00+05:30",
    stages: [{ id: "r1", name: "48-hour challenge", start: "2025-12-13T10:00:00+05:30", end: "2025-12-15T10:00:00+05:30", desc: "" }],
    rules: [],
    faqs: [],
  },
];

export const bySlug = (slug: string) => hackathons.find((h) => h.slug === slug);

// ───────────────────────── The student ─────────────────────────

export const me = {
  id: "u-me",
  name: "Aditi Sharma",
  first: "Aditi",
  campusId: "CC-26-04817",
  role: "STUDENT",
  email: "aditi.sharma@college.edu",
  college: "SRM Institute of Science and Technology, Chennai",
  collegeShort: "SRMIST Chennai",
  year: "3rd year",
  degree: "B.Tech, Computer Science",
  bio: "Frontend developer who likes fast, accessible interfaces. Happiest when a design and its code finally match.",
  skills: ["React", "TypeScript", "Tailwind CSS", "Figma", "Node.js", "Accessibility"],
  links: { github: "github.com/aditi-sharma-demo", linkedin: "linkedin.com/in/aditi-sharma-demo", portfolio: "aditi.dev" },
  joined: "2025-08-02T12:00:00+05:30",
  hue: "#c9c2ff",
};

export type Step = 0 | 1 | 2 | 3; // Discover, Team up, Build, Ship
export const STEPS = ["Discover", "Team up", "Build", "Ship"] as const;
export type RegStatus = "Registered" | "Team formed" | "In draft" | "Submitted" | "Results";

export interface Registration {
  slug: string;
  role: string;
  step: Step;
  status: RegStatus;
  teamId?: string;
  registeredAt: string;
  next: { label: string; to: string };
  result?: { place: "Winner" | "Runner-up" | "Participant"; rank: number; of: number; score: number };
  certificateId?: string;
}

export const initialRegistrations: Registration[] = [
  { slug: "rebuild-26", role: "Solo builder", step: 2, status: "In draft", registeredAt: "2026-10-25T21:14:00+05:30", next: { label: "Continue submission", to: "/rounds" } },
  { slug: "future-web", role: "Team lead · Frontend", step: 1, status: "Registered", teamId: "pixel-pilots", registeredAt: "2026-10-30T19:02:00+05:30", next: { label: "Find a designer", to: "/hackmate" } },
  { slug: "greengrid-sprint", role: "Frontend", step: 3, status: "Results", teamId: "carbon-coders", registeredAt: "2026-08-10T10:00:00+05:30", next: { label: "View result", to: "/results" }, result: { place: "Runner-up", rank: 2, of: 38, score: 86.5 }, certificateId: "CC-CERT-26-GGS-0212" },
  { slug: "finhack-chennai", role: "Frontend", step: 3, status: "Results", teamId: "ledger-loop", registeredAt: "2026-07-01T10:00:00+05:30", next: { label: "View result", to: "/results" }, result: { place: "Participant", rank: 14, of: 61, score: 71.0 }, certificateId: "CC-CERT-26-FHC-0388" },
  { slug: "design-jam", role: "Solo designer", step: 3, status: "Results", registeredAt: "2025-12-01T10:00:00+05:30", next: { label: "View result", to: "/results" }, result: { place: "Winner", rank: 1, of: 96, score: 92.4 }, certificateId: "CC-CERT-25-DJ-0117" },
];

// ───────────────────────── Submission (ReBuild '26, Round 1) ─────────────────────────

export interface CheckItem { id: string; label: string; hint: string; kind: "url" | "repo" | "files" | "text" | "confirm"; value: string; done: boolean }
export const initialChecklist: CheckItem[] = [
  { id: "live", label: "Live link", hint: "Your deployed dashboard", kind: "url", value: "https://rebuild26-aditi.vercel.app", done: true },
  { id: "repo", label: "GitHub repo", hint: "Optional, but appreciated", kind: "repo", value: "https://github.com/aditi-sharma-demo/campuscode-dashboard", done: true },
  { id: "shots", label: "Screenshots", hint: "Desktop and mobile, light and dark", kind: "files", value: "8 screenshots", done: true },
  { id: "notes", label: "Design notes", hint: "What you kept, what you changed and why", kind: "text", value: "", done: false },
  { id: "confirm", label: "Final review", hint: "I confirm this is my own work, built for ReBuild '26", kind: "confirm", value: "", done: false },
];

// ───────────────────────── Teams & people ─────────────────────────

export interface Person {
  id: string;
  name: string;
  college: string;
  year: string;
  role: string;
  skills: string[];
  lookingFor: string;
  availability: "Available" | "Open to chat" | "Busy";
  hue: string;
  hackathons: number;
}

export const people: Person[] = [
  { id: "p1", name: "Rahul Iyer", college: "SRMIST Chennai", year: "3rd year", role: "Backend", skills: ["Node.js", "PostgreSQL", "Docker"], lookingFor: "Future Web", availability: "Busy", hue: "#c8f0a0", hackathons: 6 },
  { id: "p2", name: "Meera Krishnan", college: "SSN College of Engineering", year: "3rd year", role: "Full-stack", skills: ["Next.js", "Prisma", "AWS"], lookingFor: "Future Web", availability: "Busy", hue: "#ffd9a8", hackathons: 4 },
  { id: "p3", name: "Sana Qureshi", college: "Loyola College", year: "2nd year", role: "UI/UX Designer", skills: ["Figma", "Design systems", "Prototyping"], lookingFor: "Any web hackathon", availability: "Available", hue: "#ffc4d6", hackathons: 3 },
  { id: "p4", name: "Arjun Menon", college: "VIT Chennai", year: "4th year", role: "UI/UX Designer", skills: ["Figma", "Motion", "Illustration"], lookingFor: "Future Web", availability: "Available", hue: "#b8e3ff", hackathons: 7 },
  { id: "p5", name: "Priya Raghavan", college: "PSG Tech, Coimbatore", year: "3rd year", role: "ML Engineer", skills: ["Python", "PyTorch", "LLMs"], lookingFor: "AI Innovation", availability: "Open to chat", hue: "#d4ccff", hackathons: 5 },
  { id: "p6", name: "Karthik Subramanian", college: "Anna University (CEG)", year: "4th year", role: "Backend", skills: ["Go", "Redis", "gRPC"], lookingFor: "HealthStack 48", availability: "Available", hue: "#c9f5e6", hackathons: 9 },
  { id: "p7", name: "Neha Pillai", college: "Amrita Coimbatore", year: "2nd year", role: "Product Designer", skills: ["Figma", "User research", "Accessibility"], lookingFor: "HealthStack 48", availability: "Open to chat", hue: "#ffe8a3", hackathons: 2 },
  { id: "p8", name: "Vikram Rao", college: "Sathyabama University", year: "1st year", role: "Frontend", skills: ["HTML", "CSS", "JavaScript"], lookingFor: "Ship It: Open Source", availability: "Available", hue: "#ffd0c2", hackathons: 0 },
  { id: "p9", name: "Divya Natarajan", college: "SRMIST Chennai", year: "3rd year", role: "Data Scientist", skills: ["SQL", "Pandas", "Data viz"], lookingFor: "AI Innovation", availability: "Busy", hue: "#e2d4ff", hackathons: 4 },
  { id: "p10", name: "Farhan Ali", college: "IIIT Kancheepuram", year: "3rd year", role: "Mobile", skills: ["Flutter", "Firebase", "Kotlin"], lookingFor: "HealthStack 48", availability: "Available", hue: "#c2f0ff", hackathons: 5 },
  { id: "p11", name: "Ishita Bose", college: "VIT Chennai", year: "2nd year", role: "UI/UX Designer", skills: ["Figma", "Webflow", "Branding"], lookingFor: "Campus Tech", availability: "Open to chat", hue: "#ffcfe8", hackathons: 1 },
  { id: "p12", name: "Rohan Das", college: "SSN College of Engineering", year: "4th year", role: "DevOps", skills: ["Kubernetes", "CI/CD", "Linux"], lookingFor: "Any", availability: "Busy", hue: "#d8f5b5", hackathons: 11 },
];

export const personById = (id: string) => people.find((p) => p.id === id);

export interface Team { id: string; name: string; slug: string; members: { id: string; role: string; lead?: boolean }[]; openRoles: string[]; code: string; size: number }
export const teams: Team[] = [
  { id: "pixel-pilots", name: "Pixel Pilots", slug: "future-web", code: "PXL-4F2K", size: 4, members: [{ id: "u-me", role: "Frontend", lead: true }, { id: "p1", role: "Backend" }, { id: "p2", role: "Full-stack" }], openRoles: ["UI/UX Designer"] },
  { id: "carbon-coders", name: "Carbon Coders", slug: "greengrid-sprint", code: "CRB-77QA", size: 4, members: [{ id: "u-me", role: "Frontend" }, { id: "p6", role: "Backend", lead: true }, { id: "p7", role: "Designer" }], openRoles: [] },
  { id: "ledger-loop", name: "Ledger Loop", slug: "finhack-chennai", code: "LDG-19ZK", size: 4, members: [{ id: "u-me", role: "Frontend" }, { id: "p12", role: "DevOps", lead: true }, { id: "p9", role: "Data" }, { id: "p10", role: "Mobile" }], openRoles: [] },
];

export interface Invite { id: string; kind: "incoming" | "request"; from: string; team: string; slug: string; role: string; message: string; at: string }
export const initialInvites: Invite[] = [
  { id: "inv1", kind: "request", from: "p3", team: "Pixel Pilots", slug: "future-web", role: "UI/UX Designer", message: "Saw you need a designer for Future Web. I've done two design systems this year; happy to share my Figma.", at: "2026-11-03T16:10:00+05:30" },
  { id: "inv2", kind: "incoming", from: "p5", team: "Byte Bandits", slug: "ai-innovation", role: "Frontend", message: "We have the model working and need someone to make it usable. Interested?", at: "2026-11-02T21:30:00+05:30" },
];

// ───────────────────────── Inbox ─────────────────────────

export interface Notice { id: string; kind: "deadline" | "team" | "result" | "system" | "registration"; title: string; body: string; at: string; read: boolean; to?: string }
export const initialNotifications: Notice[] = [
  { id: "n1", kind: "deadline", title: "ReBuild '26 Round 1 closes on 5 Nov", body: "Your submission is 3 of 5 steps done. Add design notes and confirm to submit.", at: "2026-11-03T09:00:00+05:30", read: false, to: "/rounds" },
  { id: "n2", kind: "team", title: "Sana Qureshi wants to join Pixel Pilots", body: "Request for the UI/UX Designer role in Future Web.", at: "2026-11-03T16:10:00+05:30", read: false, to: "/team" },
  { id: "n3", kind: "team", title: "Priya Raghavan invited you to Byte Bandits", body: "AI Innovation · Frontend role.", at: "2026-11-02T21:30:00+05:30", read: false, to: "/team" },
  { id: "n4", kind: "registration", title: "You're registered for Future Web", body: "Team size 2 to 4. Round 1 opens 10 Nov.", at: "2026-10-30T19:02:00+05:30", read: true, to: "/registrations" },
  { id: "n5", kind: "result", title: "Certificate ready: GreenGrid Sprint", body: "Runner-up, rank 2 of 38. Download it from Certificates.", at: "2026-08-28T12:00:00+05:30", read: true, to: "/certificates" },
  { id: "n6", kind: "system", title: "Welcome to the arena", body: "Your CampusCode ID is CC-26-04817.", at: "2025-08-02T12:00:00+05:30", read: true, to: "/card" },
];

export interface Announcement { id: string; slug: string; from: string; title: string; body: string; at: string; pinned?: boolean }
export const announcements: Announcement[] = [
  { id: "a1", slug: "rebuild-26", from: "CampusCode team", title: "Round 1 closes on 5 November", body: "Please submit your live link and screenshots before Round 1 closes on 5 Nov. A GitHub repo is optional but appreciated.", at: "2026-11-02T11:00:00+05:30", pinned: true },
  { id: "a2", slug: "rebuild-26", from: "CampusCode team", title: "What we're judging", body: "We look at both: how faithfully you've recreated the CampusCode dashboard, and the creativity and polish you bring to it. A pixel-perfect copy with no extra thought won't top the list, and a completely different design that ignores the original won't either.", at: "2026-10-29T18:30:00+05:30" },
  { id: "a3", slug: "rebuild-26", from: "CampusCode team", title: "Desktop first, mobile for polish", body: "Judging is mainly on desktop. Mobile responsiveness scores extra under polish, as do dark mode, accessible contrast and fast load times.", at: "2026-10-28T20:15:00+05:30" },
  { id: "a4", slug: "future-web", from: "Future Web organisers", title: "Tracks announced", body: "Three tracks: Accessible commerce, Learning tools, and Civic tech. Pick one in your Round 1 problem statement.", at: "2026-11-01T17:00:00+05:30" },
  { id: "a5", slug: "rebuild-26", from: "CampusCode team", title: "Welcome to ReBuild '26", body: "Join the official WhatsApp group for updates, doubts and announcements. Frontend only; mock data is fine.", at: "2026-10-25T10:00:00+05:30" },
];

// ───────────────────────── Leaderboards ─────────────────────────

export interface Standing { rank: number; team: string; college: string; score: number; me?: boolean }
export const leaderboards: Record<string, Standing[]> = {
  "greengrid-sprint": [
    { rank: 1, team: "Solar Flare", college: "IIT Madras", score: 89.2 },
    { rank: 2, team: "Carbon Coders", college: "SRMIST · CEG · Amrita", score: 86.5, me: true },
    { rank: 3, team: "Gridlock", college: "NIT Trichy", score: 84.9 },
    { rank: 4, team: "Watt If", college: "PSG Tech", score: 81.3 },
    { rank: 5, team: "Kilowatt Kids", college: "VIT Chennai", score: 79.8 },
    { rank: 6, team: "Net Zero Heroes", college: "SSN", score: 77.0 },
    { rank: 7, team: "Ohm Sweet Ohm", college: "Anna University", score: 75.6 },
    { rank: 8, team: "Greenhouse", college: "Loyola College", score: 72.1 },
  ],
  "finhack-chennai": [
    { rank: 1, team: "Paisa Vasool", college: "IIT Madras", score: 91.0 },
    { rank: 2, team: "UPI Ninjas", college: "VIT Chennai", score: 88.4 },
    { rank: 3, team: "Credit Karma-ish", college: "SSN", score: 86.2 },
    { rank: 4, team: "Rupee Rangers", college: "Loyola College", score: 84.7 },
    { rank: 5, team: "Ledger Legends", college: "PSG Tech", score: 82.0 },
    { rank: 14, team: "Ledger Loop", college: "SRMIST · SSN · IIITDM", score: 71.0, me: true },
  ],
  "design-jam": [
    { rank: 1, team: "Aditi Sharma", college: "SRMIST Chennai", score: 92.4, me: true },
    { rank: 2, team: "Kavya Reddy", college: "NID Bengaluru", score: 90.1 },
    { rank: 3, team: "Ishaan Gupta", college: "IIT Bombay (IDC)", score: 88.8 },
    { rank: 4, team: "Ananya Joshi", college: "MIT Institute of Design", score: 85.5 },
    { rank: 5, team: "Rohit Varma", college: "Srishti Manipal", score: 83.0 },
  ],
};

// ───────────────────────── Profile extras ─────────────────────────

export const badges = [
  { id: "first-ship", label: "First Ship", desc: "Submitted your first project", earned: "2025-12-15T10:00:00+05:30" },
  { id: "podium", label: "Podium Finish", desc: "Top 3 in a hackathon", earned: "2025-12-20T10:00:00+05:30" },
  { id: "team-player", label: "Team Player", desc: "Built with 3 different teams", earned: "2026-08-23T18:00:00+05:30" },
  { id: "streak", label: "6-Week Streak", desc: "Built something 6 weeks in a row", earned: "2026-11-02T10:00:00+05:30" },
];

/** 12 weeks × 7 days of activity levels (0–4), seeded so screenshots never change. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const activity: number[] = (() => {
  const r = mulberry32(2026);
  return Array.from({ length: 84 }, (_, i) => {
    const week = Math.floor(i / 7);
    const recent = week >= 6 ? 1.6 : 0.8; // busier since ReBuild started
    const v = r() * recent * 2.6;
    return Math.min(4, Math.floor(v));
  });
})();

export const ticker = [
  "ReBuild '26 Round 1 closes 5 Nov",
  "AI Innovation is live",
  "Future Web registrations close 12 Nov",
  "3 teams need a designer",
  "HealthStack 48 is beginner friendly",
  "Round 2 presentations on 7–8 Nov",
];
