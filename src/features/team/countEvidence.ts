import type { Evidence, Person } from "../../../js/types";

export function evidenceMentionsPerson(ev: Evidence, person: Person): boolean {
  return ev.personIds.includes(person.id) || ev.personIds.includes(person.name);
}

export function countEvidenceForPerson(
  evidence: Evidence[],
  person: Person,
): number {
  return evidence.filter((ev) => evidenceMentionsPerson(ev, person)).length;
}
