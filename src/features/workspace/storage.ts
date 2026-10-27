const NOTES_KEY = "remotion_notes";
const HYPOTHESIS_KEY = "remotion_hypothesis";

export function loadNotes(): Record<string, string> {
  try {
    const raw = localStorage.getItem(NOTES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object"
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

export function saveNotes(notes: Record<string, string>): void {
  localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
}

export interface HypothesisDraft {
  suspectId: string;
  nature: string;
  evidenceIds: string[];
  confidence: number;
  explanation: string;
  alternative: string;
}

export const emptyHypothesis: HypothesisDraft = {
  suspectId: "",
  nature: "",
  evidenceIds: [],
  confidence: 50,
  explanation: "",
  alternative: "",
};

export function loadHypothesis(): HypothesisDraft {
  try {
    const raw = localStorage.getItem(HYPOTHESIS_KEY);
    if (!raw) return emptyHypothesis;
    const parsed = JSON.parse(raw) as Partial<HypothesisDraft>;
    return {
      ...emptyHypothesis,
      ...parsed,
      confidence: Number(parsed.confidence ?? 50),
    };
  } catch {
    return emptyHypothesis;
  }
}

export function saveHypothesis(draft: HypothesisDraft): void {
  localStorage.setItem(
    HYPOTHESIS_KEY,
    JSON.stringify({ ...draft, savedAt: new Date().toISOString() }),
  );
}
