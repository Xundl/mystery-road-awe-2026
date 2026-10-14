import { Link } from "react-router-dom";
import { Badge, type BadgeVariant } from "../../components/Badge";
import { Card } from "../../components/Card";
import { formatDate } from "../../../js/utils";
import type { TimelineEvent } from "../../../js/types";

// Demo 2 (Lookup-Map): ordnet jedem certainty-Wert eine Badge-Variante zu.
// Fallback "unreviewed" mit ?? für unbekannte Werte.
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
      {/* Demo 2 (&&): Ort nur anzeigen, wenn es welche gibt. "> 0" liefert einen
          Boolean, sonst würde React bei 0 eine "0" anzeigen. */}
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
