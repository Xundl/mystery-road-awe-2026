import type { ReactNode } from "react";

interface CardProps {
  className?: string;
  title?: string;
  children: ReactNode;
}

// Demo 6: liegt in components/, weil mehrere Features es nutzen (Dashboard, Team, Timeline)
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
