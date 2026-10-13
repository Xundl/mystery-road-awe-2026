import { useEffect, useState } from "react";

export const VIEWS = [
  "dashboard",
  "evidence",
  "people",
  "timeline",
  "workspace",
] as const;

export type ViewName = (typeof VIEWS)[number];

function isView(value: string): value is ViewName {
  return (VIEWS as readonly string[]).includes(value);
}

function readView(): ViewName {
  const hash = window.location.hash.replace("#", "");
  // Unknown or empty hash -> fall back to the dashboard (like the vanilla app)
  return isView(hash) ? hash : "dashboard";
}

export function useHashRoute(): [ViewName, (v: ViewName) => void] {
  const [view, setView] = useState<ViewName>(readView);

  useEffect(() => {
    const onHashChange = () => setView(readView());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (v: ViewName) => {
    window.location.hash = v;
  };

  return [view, navigate];
}
