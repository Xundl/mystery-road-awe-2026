import { NavLink } from "react-router-dom";

const LINKS = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/evidence", label: "Evidence" },
  { to: "/team", label: "People & Locations" },
  { to: "/timeline", label: "Timeline" },
  { to: "/workspace", label: "Workspace" },
];

export function NavBar() {
  return (
    <nav className="main-nav" aria-label="Main navigation">
      {LINKS.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          className={({ isActive }) =>
            isActive ? "nav-btn active" : "nav-btn"
          }
        >
          {link.label}
        </NavLink>
      ))}
    </nav>
  );
}
