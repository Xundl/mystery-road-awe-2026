import { Link } from "react-router-dom";
import { Badge, type BadgeVariant } from "../../components/Badge";
import { Card } from "../../components/Card";
import { formatDate } from "../../../js/utils";
import type { TimelineEvent } from "../../../js/types";

// Lookup-map technique for conditional styling
const CERTAINTY_VARIANT: Record<string, BadgeVariant> = {
  confirmed: "reviewed",
  reported: "unreviewed",
  contradictory: "flagged",
};

interface TimelineEventCardProps {
  event: TimelineEvent;
  locationNames: string[];
  personNames: { id: string; name: string }[];
}

export function TimelineEventCard({
  event,
  locationNames,
  personNames,
}: TimelineEventCardProps) {
  return (
    <Card className={`timeline-event certainty-${event.certainty}`}>
      <div className="timeline-time">
        {formatDate(event.time)}&nbsp;&middot;&nbsp;
        <Badge
          variant={CERTAINTY_VARIANT[event.certainty] ?? "unreviewed"}
          label={event.certainty}
        />
      </div>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      {locationNames.length > 0 && (
        <p className="evidence-meta">Location: {locationNames.join(", ")}</p>
      )}
      {personNames.length > 0 && (
        <p className="evidence-meta">
          People:{" "}
          {personNames.map((p, i) => (
            <span key={p.id}>
              {i > 0 && ", "}
              <Link to={`/team/people/${p.id}`}>{p.name}</Link>
            </span>
          ))}
        </p>
      )}
    </Card>
  );
}
