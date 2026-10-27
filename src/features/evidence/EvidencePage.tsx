import { useReducer } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBookmarks } from "../bookmarks/BookmarksContext";
import { EvidenceCard } from "./EvidenceCard";
import { EvidenceDetail, type EvidenceEdit } from "./EvidenceDetail";
import { EvidenceToolbar } from "./EvidenceToolbar";
import {
  filterAndSortEvidence,
  filtersReducer,
  initialFilters,
} from "./filters";
import type { Evidence, Location, Person } from "../../../js/types";

interface EvidencePageProps {
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  notes: Record<string, string>;
  onChangeEvidence: (id: string, edit: EvidenceEdit) => void;
  onSaveNote: (id: string, text: string) => void;
}

// Feature component: owns the filter state and wires data + callbacks together.
export function EvidencePage({
  evidence,
  people,
  locations,
  notes,
  onChangeEvidence,
  onSaveNote,
}: EvidencePageProps) {
  const { bookmarks, onToggleBookmark } = useBookmarks();
  const navigate = useNavigate();
  const { evidenceId } = useParams<{ evidenceId: string }>(); // selected item lives in the URL

  // Demo 7: all filter/sort values in one reducer
  const [filters, dispatch] = useReducer(filtersReducer, initialFilters);

  // Demo 4: derived on every render, never stored
  const visible = filterAndSortEvidence(evidence, filters, people);
  const types = Array.from(new Set(evidence.map((e) => e.type))).sort();
  const selected = evidence.find((e) => e.id === evidenceId);

  return (
    <section className="view active">
      <h2>Evidence Catalogue</h2>
      <EvidenceToolbar
        filters={filters}
        dispatch={dispatch}
        types={types}
        people={people}
        locations={locations}
      />

      {visible.length === 0 ? (
        <p>No evidence matches the current filters.</p>
      ) : (
        <div className="evidence-grid">
          {visible.map((ev) => (
            <EvidenceCard
              key={ev.id}
              evidence={ev}
              isBookmarked={bookmarks.includes(ev.id)}
              onToggleBookmark={onToggleBookmark}
              onOpen={(id) => navigate(`/evidence/${id}`)}
            />
          ))}
        </div>
      )}

      {selected && (
        <EvidenceDetail
          key={selected.id}
          evidence={selected}
          people={people}
          locations={locations}
          savedNote={notes[selected.id] ?? ""}
          onClose={() => navigate("/evidence")}
          onChangeEvidence={onChangeEvidence}
          onSaveNote={onSaveNote}
        />
      )}
    </section>
  );
}
