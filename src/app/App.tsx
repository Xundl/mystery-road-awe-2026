import { useState } from "react";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import { Header } from "./Header";
import { useCaseData } from "../data/useCaseData";
import { BookmarksProvider } from "../features/bookmarks/BookmarksContext";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { EvidencePage } from "../features/evidence/EvidencePage";
import type { EvidenceEdit } from "../features/evidence/EvidenceDetail";
import { TeamPage } from "../features/team/TeamPage";
import { PeopleList } from "../features/team/PeopleList";
import { LocationList } from "../features/team/LocationList";
import { PersonDetailPage } from "../features/team/PersonDetailPage";
import { TimelinePage } from "../features/timeline/TimelinePage";
import { WorkspacePage } from "../features/workspace/WorkspacePage";
import { loadNotes, saveNotes } from "../features/workspace/storage";

// HashRouter: GitHub Pages has no server-side rewrite, so URLs look like
// react.html#/team/people (still real, bookmarkable routes).
export function App() {
  const loaded = useCaseData();

  // State owned here because Evidence AND Workspace need it (lifted state).
  const [notes, setNotes] = useState<Record<string, string>>(loadNotes);
  const [edits, setEdits] = useState<Record<string, EvidenceEdit>>({});

  // Demo 6: callbacks that are passed down; the setters stay in this component.
  const handleSaveNote = (id: string, text: string) => {
    const next = { ...notes, [id]: text }; // new object, no mutation
    setNotes(next);
    saveNotes(next);
  };
  const handleChangeEvidence = (id: string, edit: EvidenceEdit) =>
    setEdits((prev) => ({ ...prev, [id]: { ...prev[id], ...edit } }));

  // Demo 4/9: the evidence everybody sees = loaded data + user edits, derived on
  // every render. Dashboard, Evidence and Workspace all get THIS list, so the
  // "Reviewed" count on the Dashboard can never be stale.
  const evidence = loaded.evidence.map((ev) =>
    edits[ev.id] ? { ...ev, ...edits[ev.id] } : ev,
  );
  const data = { ...loaded, evidence };

  return (
    <BookmarksProvider>
      <HashRouter>
        <Header />
        <main id="app" className="app-main">
          {data.error && <p>Could not load data: {data.error}</p>}
          {data.loading ? (
            <p>Loading case file&hellip;</p>
          ) : (
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route
                path="/dashboard"
                element={<DashboardPage data={data} />}
              />
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
                path="/evidence/:evidenceId?"
                element={
                  <EvidencePage
                    evidence={data.evidence}
                    people={data.people}
                    locations={data.locations}
                    notes={notes}
                    onChangeEvidence={handleChangeEvidence}
                    onSaveNote={handleSaveNote}
                  />
                }
              />
              <Route
                path="/workspace"
                element={
                  <WorkspacePage
                    evidence={data.evidence}
                    people={data.people}
                    notes={notes}
                  />
                }
              />
              {/* unknown URL -> dashboard (same fallback as the vanilla app) */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          )}
        </main>
      </HashRouter>
    </BookmarksProvider>
  );
}
