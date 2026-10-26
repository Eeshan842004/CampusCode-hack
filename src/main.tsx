import { StrictMode, lazy, Suspense, type ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "@fontsource-variable/inter/wght.css";
import "@fontsource/dm-mono/500.css";
import "./styles/index.css";
import { StoreProvider } from "./app/store";
import Shell from "./app/Shell";
import Overview from "./features/Overview";

// Each lazy page is created once, so tabs that share a page (e.g. /team and /hackmate) keep the same instance.
const cache = new Map<() => Promise<{ default: ComponentType }>, ComponentType>();
const page = (load: () => Promise<{ default: ComponentType }>) => {
  let C = cache.get(load);
  if (!C) { C = lazy(load); cache.set(load, C); }
  return <Suspense fallback={<PageSkeleton />}><C /></Suspense>;
};

function PageSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading">
      <div className="skel" style={{ width: 180, height: 12, marginBottom: 18 }} />
      <div className="skel" style={{ width: "min(520px, 80%)", height: 56, marginBottom: 16 }} />
      <div className="skel" style={{ width: "min(420px, 70%)", height: 14 }} />
    </div>
  );
}

const Hackathons = () => import("./features/Hackathons");
const Detail = () => import("./features/HackathonDetail");
const Registrations = () => import("./features/Registrations");
const Team = () => import("./features/Team");
const Rounds = () => import("./features/Rounds");
const Results = () => import("./features/Results");
const Inbox = () => import("./features/Inbox");
const Guide = () => import("./features/Guide");
const Card = () => import("./features/Card");
const Profile = () => import("./features/Profile");
const RuleBot = () => import("./features/RuleBot");
const IdeaCheck = () => import("./features/IdeaCheck");
const Login = () => import("./features/Login");
const NotFound = () => import("./features/NotFound");

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={page(Login)} />
          <Route element={<Shell />}>
            <Route index element={<Overview />} />
            <Route path="hackathons" element={page(Hackathons)} />
            <Route path="hackathons/:slug" element={page(Detail)} />
            <Route path="registrations" element={page(Registrations)} />
            <Route path="hackmate" element={page(Team)} />
            <Route path="team" element={page(Team)} />
            <Route path="ideacheck" element={page(IdeaCheck)} />
            <Route path="rounds" element={page(Rounds)} />
            <Route path="results" element={page(Results)} />
            <Route path="leaderboard" element={page(Results)} />
            <Route path="rulebot" element={page(RuleBot)} />
            <Route path="guide" element={page(Guide)} />
            <Route path="help" element={page(Guide)} />
            <Route path="communication" element={page(Inbox)} />
            <Route path="notifications" element={page(Inbox)} />
            <Route path="card" element={page(Card)} />
            <Route path="certificates" element={page(Card)} />
            <Route path="profile" element={page(Profile)} />
            <Route path="*" element={page(NotFound)} />
          </Route>
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  </StrictMode>,
);
