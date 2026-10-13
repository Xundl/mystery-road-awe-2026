import { NavBar } from "./NavBar";
import type { ViewName } from "../useHashRoute";

interface HeaderProps {
  current: ViewName;
  onNavigate: (v: ViewName) => void;
}

export function Header({ current, onNavigate }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="brand">
          <img
            src={`${import.meta.env.BASE_URL}assets/logo/logo.svg`}
            alt="Project ReMotion logo"
            className="brand-logo"
          />
          <div>
            <h1>Project ReMotion</h1>
            <p className="subtitle">
              Investigate the failure of an AI-assisted rehabilitation robot.
            </p>
          </div>
        </div>
        <NavBar current={current} onNavigate={onNavigate} />
      </div>
    </header>
  );
}
