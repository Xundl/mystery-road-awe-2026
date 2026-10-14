import { useSearchParams } from "react-router-dom";
import { TimelineFilters } from "./TimelineFilters";
import { TimelineList } from "./TimelineList";
import type { Location, Person, TimelineEvent } from "../../../js/types";

interface TimelinePageProps {
  timeline: TimelineEvent[];
  people: Person[];
  locations: Location[];
}

export function TimelinePage({
  timeline,
  people,
  locations,
}: TimelinePageProps) {
  // Query param read once per render to decide the INITIAL list: #/timeline?person=nova-byte
  const [searchParams] = useSearchParams();
  const personId = searchParams.get("person") ?? "";

  const types = Array.from(new Set(timeline.map((e) => e.type))).sort();

  const events = timeline
    .filter((e) => !personId || e.personIds.includes(personId))
    .slice()
    .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

  return (
    <section className="view active">
      <h2>Investigation Timeline</h2>
      <TimelineFilters
        people={people}
        locations={locations}
        types={types}
        initialPersonId={personId}
      />
      <TimelineList events={events} people={people} locations={locations} />
    </section>
  );
}
