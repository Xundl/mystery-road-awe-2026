import { PersonCard } from "./PersonCard";
import { countEvidenceForPerson } from "./countEvidence";
import type { Evidence, Person } from "../../../js/types";

interface PeopleListProps {
  people: Person[];
  evidence: Evidence[];
}

export function PeopleList({ people, evidence }: PeopleListProps) {
  return (
    <div className="people-grid">
      {people.map((person) => (
        <PersonCard
          key={person.id}
          person={person}
          evidenceCount={countEvidenceForPerson(evidence, person)}
        />
      ))}
    </div>
  );
}
