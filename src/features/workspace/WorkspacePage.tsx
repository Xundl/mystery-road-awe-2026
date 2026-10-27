import { Link } from "react-router-dom";
import { useBookmarks } from "../bookmarks/BookmarksContext";
import { HypothesisForm } from "./HypothesisForm";
import type { Evidence, Person } from "../../../js/types";

interface WorkspacePageProps {
  evidence: Evidence[];
  people: Person[];
  notes: Record<string, string>;
}

export function WorkspacePage({ evidence, people, notes }: WorkspacePageProps) {
  const { bookmarks } = useBookmarks();

  // Demo 4: both lists are DERIVED from the single source of truth
  const bookmarkedItems = evidence.filter((ev) => bookmarks.includes(ev.id));
  const notedItems = evidence.filter((ev) => notes[ev.id]);

  return (
    <section className="view active">
      <h2>Investigator Workspace</h2>

      <div className="workspace-grid">
        <div className="workspace-col">
          <h3>Bookmarked Evidence</h3>
          {bookmarkedItems.length === 0 ? (
            <p>
              No bookmarked evidence yet. Bookmark items from the Evidence view.
            </p>
          ) : (
            bookmarkedItems.map((ev) => (
              <div className="mini-list-item" key={ev.id}>
                <strong>{ev.id}</strong> &mdash; {ev.title}{" "}
                <Link
                  className="btn btn-small btn-secondary"
                  to={`/evidence/${ev.id}`}
                >
                  Open
                </Link>
              </div>
            ))
          )}
        </div>

        <div className="workspace-col">
          <h3>Personal Notes</h3>
          <p className="hint-text">
            Notes are attached to whichever evidence item is currently open in
            the Evidence view.
          </p>
          {notedItems.length === 0 ? (
            <p>
              No notes yet. Add one from an evidence item&apos;s detail view.
            </p>
          ) : (
            notedItems.map((ev) => (
              <div className="mini-list-item" key={ev.id}>
                <strong>{ev.id}</strong> &mdash; {ev.title}
                <div>{notes[ev.id]}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <HypothesisForm people={people} evidence={evidence} />
    </section>
  );
}
