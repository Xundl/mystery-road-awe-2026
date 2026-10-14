import { NavLink, Outlet } from "react-router-dom";

const tabClass = ({ isActive }: { isActive: boolean }) =>
  isActive ? "tab-btn active" : "tab-btn";

// Feature component: owns the tab bar; the active tab comes from the URL.
export function TeamPage() {
  return (
    <section className="view active">
      <h2>People &amp; Locations</h2>
      <div className="tab-bar">
        <NavLink to="/team/people" className={tabClass}>
          People
        </NavLink>
        <NavLink to="/team/locations" className={tabClass}>
          Locations
        </NavLink>
      </div>
      <Outlet />
    </section>
  );
}
