import { useState, type FormEvent } from "react";
import type { Evidence, Person } from "../../../js/types";
import {
  loadHypothesis,
  saveHypothesis,
  type HypothesisDraft,
} from "./storage";

interface HypothesisFormProps {
  people: Person[];
  evidence: Evidence[];
}

export function HypothesisForm({ people, evidence }: HypothesisFormProps) {
  // Demo 2: ONE object for the whole form (all fields belong together and are
  // saved together). The initial value is read once from localStorage.
  const [draft, setDraft] = useState<HypothesisDraft>(loadHypothesis);
  const [showSaved, setShowSaved] = useState(false);

  // Generic updater: copies the old draft and replaces one field (immutable)
  const setField = <K extends keyof HypothesisDraft>(
    key: K,
    value: HypothesisDraft[K],
  ) => setDraft((d) => ({ ...d, [key]: value }));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    try {
      saveHypothesis(draft);
    } catch {
      alert("Your hypothesis could not be saved to local storage.");
      return;
    }
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  return (
    <div className="hypothesis-card">
      <h3>Hypothesis Draft</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <label htmlFor="hypSuspect">Suspected responsible person</label>
          <select
            id="hypSuspect"
            value={draft.suspectId}
            onChange={(e) => setField("suspectId", e.target.value)}
          >
            <option value="">Select a person…</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypNature">Accidental or deliberate incident</label>
          <select
            id="hypNature"
            value={draft.nature}
            onChange={(e) => setField("nature", e.target.value)}
          >
            <option value="">Select…</option>
            <option value="accidental">Accidental</option>
            <option value="deliberate">Deliberate</option>
            <option value="unclear">Unclear</option>
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypEvidence">Selected supporting evidence</label>
          <select
            id="hypEvidence"
            multiple
            size={6}
            value={draft.evidenceIds}
            onChange={(e) =>
              setField(
                "evidenceIds",
                Array.from(e.target.selectedOptions, (o) => o.value),
              )
            }
          >
            {evidence.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.id} - {ev.title}
              </option>
            ))}
          </select>
        </div>

        <div className="form-row">
          <label htmlFor="hypConfidence">Confidence (0–100)</label>
          <input
            type="range"
            id="hypConfidence"
            min={0}
            max={100}
            value={draft.confidence}
            onChange={(e) => setField("confidence", Number(e.target.value))}
          />
          <output>{draft.confidence}</output>
        </div>

        <div className="form-row">
          <label htmlFor="hypExplanation">Written explanation</label>
          <textarea
            id="hypExplanation"
            rows={4}
            placeholder="Explain your reasoning…"
            value={draft.explanation}
            onChange={(e) => setField("explanation", e.target.value)}
          />
        </div>

        <div className="form-row">
          <label htmlFor="hypAlternative">Alternative explanation</label>
          <textarea
            id="hypAlternative"
            rows={3}
            placeholder="What else could explain the evidence?"
            value={draft.alternative}
            onChange={(e) => setField("alternative", e.target.value)}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            Save hypothesis draft
          </button>
          {showSaved && <span className="saved-msg">Saved</span>}
        </div>
      </form>
    </div>
  );
}
