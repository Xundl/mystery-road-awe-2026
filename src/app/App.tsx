import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./Header";
import { StubPage } from "../components/StubPage";
import { useCaseData } from "../data/useCaseData";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { TeamPage } from "../features/team/TeamPage";
import { PeopleList } from "../features/team/PeopleList";
import { LocationList } from "../features/team/LocationList";
import { PersonDetailPage } from "../features/team/PersonDetailPage";
import { TimelinePage } from "../features/timeline/TimelinePage";

// HashRouter: GitHub Pages has no server-side rewrite, so URLs look like
// react.html#/team/people (still real, bookmarkable routes).
export function App() {
  const data = useCaseData();

  return (
    <HashRouter>
      <Header />
      <main id="app" className="app-main">
        {data.error && <p>Could not load data: {data.error}</p>}
        {data.loading ? (
          <p>Loading case file&hellip;</p>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage data={data} />} />
            <Route path="/team" element={<TeamPage />}>
              <Route index element={<Navigate to="people" replace />} />
              <Route
                path="people"
                element={
                  <PeopleList people={data.people} evidence={data.evidence} />
                }
              />
              <Route
                path="people/:personId"
                element={
                  <PersonDetailPage
                    people={data.people}
                    timeline={data.timeline}
                  />
                }
              />
              <Route
                path="locations"
                element={<LocationList locations={data.locations} />}
              />
            </Route>
            <Route
              path="/timeline"
              element={
                <TimelinePage
                  timeline={data.timeline}
                  people={data.people}
                  locations={data.locations}
                />
              }
            />
            <Route
              path="/evidence"
              element={<StubPage title="Evidence Catalogue" />}
            />
            <Route
              path="/workspace"
              element={<StubPage title="Investigator Workspace" />}
            />
            {/* unknown URL -> dashboard (same fallback as the vanilla app) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        )}
      </main>
    </HashRouter>
  );
}
