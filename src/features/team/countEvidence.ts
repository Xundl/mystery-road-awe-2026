import type { Evidence, Person } from "../../../js/types";

export function countEvidenceForPerson(
  evidence: Evidence[],
  person: Person,
): number {
  return evidence.filter(
    (ev) =>
      ev.personIds.includes(person.id) || ev.personIds.includes(person.name),
  ).length;
}
