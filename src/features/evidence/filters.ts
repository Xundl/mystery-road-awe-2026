import type { Evidence, Person } from "../../../js/types";
import { evidenceMentionsPerson } from "../team/countEvidence";

export type SortOrder = "date-desc" | "date-asc" | "title-asc" | "title-desc";

export interface EvidenceFilters {
  search: string;
  type: string;
  person: string;
  location: string;
  status: string;
  relevance: string;
  sort: SortOrder;
}

export type FilterField = Exclude<keyof EvidenceFilters, "sort">;

export type FiltersAction =
  | { type: "SET_FILTER"; field: FilterField; value: string }
  | { type: "SET_SORT"; sort: SortOrder }
  | { type: "CLEAR_FILTERS" };

export const initialFilters: EvidenceFilters = {
  search: "",
  type: "",
  person: "",
  location: "",
  status: "",
  relevance: "",
  sort: "date-desc",
};

// Demo 7: one reducer for all 7 related values.
export function filtersReducer(
  state: EvidenceFilters,
  action: FiltersAction,
): EvidenceFilters {
  switch (action.type) {
    case "SET_FILTER":
      return { ...state, [action.field]: action.value };
    case "SET_SORT":
      return { ...state, sort: action.sort };
    case "CLEAR_FILTERS":
      // all filters back to "empty" in ONE step; the sort order is kept
      return { ...initialFilters, sort: state.sort };
  }
}

// Demo 4: the visible list is DERIVED from (evidence, filters) on every render.
// It is never stored in its own state, so it cannot drift out of sync.
export function filterAndSortEvidence(
  evidence: Evidence[],
  filters: EvidenceFilters,
  people: Person[],
): Evidence[] {
  const term = filters.search.toLowerCase().trim();
  const person = people.find((p) => p.id === filters.person);

  const matches = evidence.filter((ev) => {
    if (term) {
      const haystack =
        `${ev.title} ${ev.summary} ${ev.tags.join(" ")}`.toLowerCase();
      if (!haystack.includes(term)) return false;
    }
    if (filters.type && ev.type.toLowerCase() !== filters.type) return false;
    if (filters.person && (!person || !evidenceMentionsPerson(ev, person)))
      return false;
    if (filters.location && !ev.locationIds.includes(filters.location))
      return false;
    if (filters.status && (ev.status || "").toLowerCase() !== filters.status)
      return false;
    if (
      filters.relevance &&
      (ev.relevance || "").toLowerCase() !== filters.relevance
    )
      return false;
    return true;
  });

  // Demo 3: .filter() already returned a NEW array, so .sort() below
  // can never reorder the master list (the vanilla bug).
  const time = (ev: Evidence) => new Date(ev.timestamp).getTime();
  switch (filters.sort) {
    case "title-asc":
      return matches.sort((a, b) => a.title.localeCompare(b.title));
    case "title-desc":
      return matches.sort((a, b) => b.title.localeCompare(a.title));
    case "date-asc":
      return matches.sort((a, b) => time(a) - time(b));
    default:
      return matches.sort((a, b) => time(b) - time(a));
  }
}
