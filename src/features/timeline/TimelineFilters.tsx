import type { Location, Person } from "../../../js/types";

interface TimelineFiltersProps {
  people: Person[];
  locations: Location[];
  types: string[];
  initialPersonId: string;
}

// Visually complete, not wired yet (no onChange) -> Exercise 5.
// defaultValue only sets the initial selection (e.g. from ?person=...).
export function TimelineFilters({
  people,
  locations,
  types,
  initialPersonId,
}: TimelineFiltersProps) {
  return (
    <div className="toolbar">
      <div className="toolbar-row">
        <select aria-label="Order" defaultValue="asc">
          <option value="asc">Oldest first</option>
          <option value="desc">Newest first</option>
        </select>
        <select aria-label="Filter by person" defaultValue={initialPersonId}>
          <option value="">All people</option>
          {people.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <select aria-label="Filter by location" defaultValue="">
          <option value="">All locations</option>
          {locations.map((l) => (
            <option key={l.id} value={l.id}>
              {l.name}
            </option>
          ))}
        </select>
        <select aria-label="Filter by event type" defaultValue="">
          <option value="">All event types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
