import { Badge, relevanceVariant, statusVariant } from "../../components/Badge";
import { formatDate } from "../../../js/utils";
import type { Evidence } from "../../../js/types";

interface EvidenceCardProps {
  evidence: Evidence;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onOpen: (id: string) => void;
}

export function EvidenceCard({
  evidence,
  isBookmarked,
  onToggleBookmark,
  onOpen,
}: EvidenceCardProps) {
  return (
    // Demo 1: React attaches the handler itself, no inline onclick, no addEventListener,
    // and no event delegation needed.
    <div className="evidence-card" onClick={() => onOpen(evidence.id)}>
      <button
        type="button"
        className={isBookmarked ? "bookmark-btn active" : "bookmark-btn"}
        aria-label={`Toggle bookmark for ${evidence.title}`}
        onClick={(e) => {
          e.stopPropagation(); // do not also open the detail view
          onToggleBookmark(evidence.id);
        }}
      >
        <span className="bookmark-icon">{isBookmarked ? "★" : "☆"}</span>
      </button>
      <h3>{evidence.title}</h3>
      <div className="evidence-meta">
        {evidence.id} &middot; {evidence.type} &middot;{" "}
        {formatDate(evidence.timestamp)}
      </div>
      <div className="evidence-summary">{evidence.summary}</div>
      {evidence.tags.includes("critical") && (
        <Badge variant="critical" label="Critical" />
      )}
      <Badge variant={statusVariant(evidence.status)} label={evidence.status} />
      <Badge
        variant={relevanceVariant(evidence.relevance)}
        label={evidence.relevance}
      />
      <div>
        {evidence.tags.map((tag) => (
          <span className="tag-chip" key={tag}>
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
