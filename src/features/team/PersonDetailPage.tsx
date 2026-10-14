import { Link, useParams } from "react-router-dom";
import { PersonCard } from "./PersonCard";
import type { Person, TimelineEvent } from "../../../js/types";

interface PersonDetailPageProps {
  people: Person[];
  timeline: TimelineEvent[];
}

export function PersonDetailPage({ people, timeline }: PersonDetailPageProps) {
  // useParams gives `string | undefined` -> must be checked before use
  const { personId } = useParams<{ personId: string }>();
  const person = people.find((p) => p.id === personId);

  if (!person) {
    return (
      <p>
        No person with id &ldquo;{personId}&rdquo;.{" "}
        <Link to="/team/people">Back to all people</Link>
      </p>
    );
  }

  const events = timeline.filter((e) => e.personIds.includes(person.id));

  return (
    <div>
      <p>
        <Link to="/team/people">&larr; All people</Link>
      </p>
      <PersonCard person={person} evidenceCount={0} showBackground />
      <p>
        <Link to={`/timeline?person=${person.id}`}>
          {events.length} timeline event{events.length === 1 ? "" : "s"} &rarr;
        </Link>
      </p>
    </div>
  );
}
