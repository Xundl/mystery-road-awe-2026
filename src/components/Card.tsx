import type { ReactNode } from "react";

interface CardProps {
  className?: string;
  title?: string;
  children: ReactNode;
}

// Generic card/panel wrapper (composition via `children`).
// Used by Dashboard panels, person cards, location cards and timeline events.
export function Card({
  className = "dashboard-panel",
  title,
  children,
}: CardProps) {
  return (
    <div className={className}>
      {title && <h3>{title}</h3>}
      {children}
    </div>
  );
}
