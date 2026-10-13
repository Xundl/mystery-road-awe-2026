import { Header } from "./components/Header";
import { DashboardPage } from "./pages/DashboardPage";
import { StubPage } from "./pages/StubPage";
import { useCaseData } from "./useCaseData";
import { useHashRoute } from "./useHashRoute";

export function App() {
  const [view, navigate] = useHashRoute();
  const data = useCaseData();

  return (
    <>
      <Header current={view} onNavigate={navigate} />
      <main id="app" className="app-main">
        {data.error && <p>Could not load data: {data.error}</p>}
        {data.loading && <p>Loading case file&hellip;</p>}
        {!data.loading && view === "dashboard" && <DashboardPage data={data} />}
        {view === "evidence" && <StubPage title="Evidence Catalogue" />}
        {view === "people" && <StubPage title="People & Locations" />}
        {view === "timeline" && <StubPage title="Timeline" />}
        {view === "workspace" && <StubPage title="Investigator Workspace" />}
      </main>
    </>
  );
}
