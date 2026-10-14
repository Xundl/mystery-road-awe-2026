import { TimelineEventCard } from "./TimelineEventCard";
import type { Location, Person, TimelineEvent } from "../../../js/types";

interface TimelineListProps {
  events: TimelineEvent[];
  people: Person[];
  locations: Location[];
}

export function TimelineList({ events, people, locations }: TimelineListProps) {
  // Demo 2 (Early Return): keine Events -> Meldung anzeigen, restliches Rendern wird übersprungen
  if (events.length === 0) {
    return <p>No timeline events match the current filters.</p>;
  }

  return (
    // Demo 3: key = event.id (eindeutig pro Timeline-Event)
    <div className="timeline-container">
      {events.map((event) => (
        <TimelineEventCard
          key={event.id}
          event={event}
          locationNames={event.locationIds.map(
            (id) => locations.find((l) => l.id === id)?.name ?? id,
          )}
          personNames={event.personIds.flatMap((id) => {
            const p = people.find((x) => x.id === id);
            return p ? [{ id: p.id, name: p.name }] : [];
          })}
        />
      ))}
    </div>
  );
}
