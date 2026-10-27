import type { Dispatch } from "react";
import type { Location, Person } from "../../../js/types";
import type {
  EvidenceFilters,
  FilterField,
  FiltersAction,
  SortOrder,
} from "./filters";

interface EvidenceToolbarProps {
  filters: EvidenceFilters;
  dispatch: Dispatch<FiltersAction>;
  types: string[];
  people: Person[];
  locations: Location[];
}

export function EvidenceToolbar({
  filters,
  dispatch,
  types,
  people,
  locations,
}: EvidenceToolbarProps) {
  const setFilter = (field: FilterField) => (value: string) =>
    dispatch({ type: "SET_FILTER", field, value });

  return (
    <div className="toolbar">
      <div className="toolbar-row">
        {/* Demo 2: controlled input = value + onChange */}
        <input
          type="text"
          placeholder="Search title, summary, tags…"
          aria-label="Search evidence"
          value={filters.search}
          onChange={(e) => setFilter("search")(e.target.value)}
        />
        <Select
          label="Filter by type"
          value={filters.type}
          onChange={setFilter("type")}
          allLabel="All types"
          options={types.map((t) => ({ value: t.toLowerCase(), label: t }))}
        />
        <Select
          label="Filter by person"
          value={filters.person}
          onChange={setFilter("person")}
          allLabel="All people"
          options={people.map((p) => ({ value: p.id, label: p.name }))}
        />
        <Select
          label="Filter by location"
          value={filters.location}
          onChange={setFilter("location")}
          allLabel="All locations"
          options={locations.map((l) => ({ value: l.id, label: l.name }))}
        />
      </div>
      <div className="toolbar-row">
        <Select
          label="Filter by status"
          value={filters.status}
          onChange={setFilter("status")}
          allLabel="All statuses"
          options={STATUS_OPTIONS}
        />
        <Select
          label="Filter by relevance"
          value={filters.relevance}
          onChange={setFilter("relevance")}
          allLabel="All relevance"
          options={RELEVANCE_OPTIONS}
        />
        <select
          aria-label="Sort evidence"
          value={filters.sort}
          onChange={(e) =>
            dispatch({ type: "SET_SORT", sort: e.target.value as SortOrder })
          }
        >
          <option value="date-desc">Newest first</option>
          <option value="date-asc">Oldest first</option>
          <option value="title-asc">Title (A–Z)</option>
          <option value="title-desc">Title (Z–A)</option>
        </select>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}

export const STATUS_OPTIONS = [
  { value: "unreviewed", label: "Unreviewed" },
  { value: "reviewed", label: "Reviewed" },
  { value: "flagged", label: "Flagged" },
];

export const RELEVANCE_OPTIONS = [
  { value: "unknown", label: "Unknown" },
  { value: "relevant", label: "Relevant" },
  { value: "irrelevant", label: "Irrelevant" },
];

interface SelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: { value: string; label: string }[];
}

function Select({ label, value, onChange, allLabel, options }: SelectProps) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="">{allLabel}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
