import { useState } from "react";
import { formatDate } from "../../../js/utils";
import type { Evidence, Location, Person } from "../../../js/types";
import { RELEVANCE_OPTIONS, STATUS_OPTIONS } from "./EvidenceToolbar";

export type EvidenceEdit = Partial<Pick<Evidence, "status" | "relevance">>;

interface EvidenceDetailProps {
  evidence: Evidence;
  people: Person[];
  locations: Location[];
  savedNote: string;
  onClose: () => void;
  onChangeEvidence: (id: string, edit: EvidenceEdit) => void;
  onSaveNote: (id: string, text: string) => void;
}

export function EvidenceDetail({
  evidence,
  people,
  locations,
  savedNote,
  onClose,
  onChangeEvidence,
  onSaveNote,
}: EvidenceDetailProps) {
  // Controlled textarea: the text being typed is local state,
  // the SAVED note lives in the parent (App).
  const [noteDraft, setNoteDraft] = useState(savedNote);

  const personNames = evidence.personIds.map(
    (id) => people.find((p) => p.id === id)?.name ?? id,
  );
  const locationNames = evidence.locationIds.map((id) => {
    const loc = locations.find((l) => l.id === id);
    return loc ? `${loc.id} - ${loc.name}` : id;
  });

  return (
    <div className="evidence-detail">
      <div className="evidence-detail-header">
        <div>
          <h2>{evidence.title}</h2>
          <div className="evidence-meta">
            {evidence.id} &middot; {evidence.type} &middot;{" "}
            {formatDate(evidence.timestamp)}
          </div>
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-small"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      {evidence.tags.includes("critical") && (
        <div className="warning-banner">
          This item is tagged as critical evidence.
        </div>
      )}

      <div className="detail-field">
        <strong>Summary</strong>
        {evidence.summary}
      </div>
      <div className="evidence-detail-content">{evidence.content}</div>
      <div className="detail-field">
        <strong>Related people</strong>
        {personNames.join(", ")}
      </div>
      <div className="detail-field">
        <strong>Related locations</strong>
        {locationNames.join(", ")}
      </div>

      <div className="detail-field">
        <strong>Review status</strong>
        <select
          value={evidence.status.toLowerCase()}
          onChange={(e) =>
            onChangeEvidence(evidence.id, { status: e.target.value })
          }
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="detail-field">
        <strong>Relevance</strong>
        <select
          value={evidence.relevance.toLowerCase()}
          onChange={(e) =>
            onChangeEvidence(evidence.id, { relevance: e.target.value })
          }
        >
          {RELEVANCE_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="detail-field">
        <strong>Investigator note</strong>
        <textarea
          className="note-textarea"
          rows={3}
          placeholder="Add a private note about this evidence..."
          value={noteDraft}
          onChange={(e) => setNoteDraft(e.target.value)}
        />
        <button
          type="button"
          className="btn btn-primary btn-small"
          style={{ marginTop: 6 }}
          onClick={() => onSaveNote(evidence.id, noteDraft)}
        >
          Save note
        </button>
      </div>

      <div className="detail-field">
        <strong>Note preview</strong>
        <div>{savedNote}</div>
      </div>
    </div>
  );
}
