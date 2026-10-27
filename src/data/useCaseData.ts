import { useEffect, useState } from "react";
import type {
  CaseData,
  Evidence,
  Location,
  Person,
  TimelineEvent,
} from "../../js/types";

export interface CaseDataState {
  loading: boolean;
  error: string | null;
  caseData: CaseData | null;
  evidence: Evidence[];
  people: Person[];
  locations: Location[];
  timeline: TimelineEvent[];
}

const BASE = import.meta.env.BASE_URL;

async function getJson<T>(file: string): Promise<T> {
  const res = await fetch(`${BASE}data/${file}`);
  if (!res.ok) throw new Error(`Could not load ${file} (${res.status})`);
  return (await res.json()) as T;
}

// PLACEHOLDER architecture (Exercise 3): the data is loaded once in <App />
// and passed down via props. Will be replaced by a context / data layer later.
export function useCaseData(): CaseDataState {
  const [state, setState] = useState<CaseDataState>({
    loading: true,
    error: null,
    caseData: null,
    evidence: [],
    people: [],
    locations: [],
    timeline: [],
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getJson<CaseData>("case.json"),
      getJson<Person[]>("people.json"),
      getJson<Location[]>("locations.json"),
      getJson<Evidence[]>("evidence.json"),
      getJson<TimelineEvent[]>("timeline.json"),
    ])
      .then(([caseData, people, locations, evidence, timeline]) => {
        if (cancelled) return;
        setState({
          loading: false,
          error: null,
          caseData,
          people,
          locations,
          evidence,
          timeline,
        });
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setState((s) => ({
          ...s,
          loading: false,
          error: err instanceof Error ? err.message : String(err),
        }));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
