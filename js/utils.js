import { allEvidence, allPeople, allLocations } from "../app.js";

export function findEvidenceById(id) {
  for (let i = 0; i < allEvidence.length; i++) {
    if (allEvidence[i].id === id) return allEvidence[i];
  }
  return null;
}

export function findPersonById(id) {
  for (let i = 0; i < allPeople.length; i++) {
    if (allPeople[i].id === id) return allPeople[i];
  }
  return null;
}

export function findLocationById(id) {
  for (let i = 0; i < allLocations.length; i++) {
    if (allLocations[i].id === id) return allLocations[i];
  }
  return null;
}

export function evidenceMentionsPerson(ev, person) {
  if (!ev.personIds) return false;
  return ev.personIds.indexOf(person.id) !== -1 || ev.personIds.indexOf(person.name) !== -1;
}

export const formatDate = (ts) => {
  if (!ts) return "Unknown date";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return ts;
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) +
    " " + d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
};

export const getStatusBadgeClass = (status) => {
  const s = (status || "").toLowerCase();
  if (s === "reviewed") return "badge-reviewed";
  if (s === "flagged") return "badge-flagged";
  return "badge-unreviewed";
};

export const getRelevanceBadgeClass = (relevance) => {
  const r = (relevance || "").toLowerCase();
  if (r === "relevant") return "badge-relevant";
  return "badge-unreviewed";
};