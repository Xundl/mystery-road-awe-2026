import { VIEWS, type ViewName } from "../useHashRoute";

const LABELS: Record<ViewName, string> = {
  dashboard: "Dashboard",
  evidence: "Evidence",
  people: "People & Locations",
  timeline: "Timeline",
  workspace: "Workspace",
};

interface NavBarProps {
  current: ViewName;
  onNavigate: (v: ViewName) => void;
}

export function NavBar({ current, onNavigate }: NavBarProps) {
  return (
    <nav className="main-nav" aria-label="Main navigation">
      {VIEWS.map((v) => (
        <button
          key={v}
          type="button"
          className={v === current ? "nav-btn active" : "nav-btn"}
          onClick={() => onNavigate(v)}
        >
          {LABELS[v]}
        </button>
      ))}
    </nav>
  );
}
