import { Link } from "react-router-dom";
import { Card } from "../../components/Card";
import type { Person } from "../../../js/types";

interface PersonCardProps {
  person: Person;
  evidenceCount: number;
  showBackground?: boolean;
}

// Demo 2 (Ternary): Einzahl/Mehrzahl ("item" oder "items")
// Demo 6: liegt in features/team/, weil nur das Team-Feature es braucht
export function PersonCard({
  person,
  evidenceCount,
  showBackground = false,
}: PersonCardProps) {
  return (
    <Card className="person-card">
      <div className="person-card-header">
        <img
          className="person-avatar"
          src={`${import.meta.env.BASE_URL}${person.avatar}`}
          alt={`Portrait of ${person.name}`}
        />
        <div>
          <h3>
            <Link to={`/team/people/${person.id}`}>{person.name}</Link>
          </h3>
          <div className="person-role">{person.role}</div>
        </div>
      </div>
      <p>
        <strong>Speciality:</strong> {person.speciality}
      </p>
      <ul>
        {person.responsibilities.map((r) => (
          <li key={r}>{r}</li>
        ))}
      </ul>
      <div className="person-statement">&ldquo;{person.statement}&rdquo;</div>
      {showBackground && person.background && <p>{person.background}</p>}
      <p>
        {evidenceCount} related evidence item{evidenceCount === 1 ? "" : "s"}
      </p>
    </Card>
  );
}
