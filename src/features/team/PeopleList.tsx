import { PersonCard } from "./PersonCard";
import { countEvidenceForPerson } from "./countEvidence";
import type { Evidence, Person } from "../../../js/types";

interface PeopleListProps {
  people: Person[];
  evidence: Evidence[];
}

export function PeopleList({ people, evidence }: PeopleListProps) {
  return (
    // Demo 3: Liste wird mit .map() in eine Liste von Komponenten verwandelt.
    // key = stabile id der Person, damit React beim Re-Render die Elemente zuordnen kann.
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
