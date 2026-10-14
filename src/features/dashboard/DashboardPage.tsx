import type { CaseDataState } from "../../data/useCaseData";
import { formatDate } from "../../../js/utils";
import { Badge, type BadgeVariant } from "../../components/Badge";
import { Card } from "../../components/Card";
import { CaseSummaryCard } from "./CaseSummaryCard";
import { StatCard } from "./StatCard";
import { ProgressBar } from "./ProgressBar";

interface DashboardPageProps {
  data: CaseDataState;
}

function statusVariant(status: string): BadgeVariant {
  const s = (status || "").toLowerCase();
  if (s === "reviewed") return "reviewed";
  if (s === "flagged") return "flagged";
  return "unreviewed";
}

export function DashboardPage({ data }: DashboardPageProps) {
  const { caseData, evidence, people, locations, timeline, bookmarkCount } =
    data;

  // Derived values are recomputed on every render -> never stale.
  const reviewedCount = evidence.filter(
    (e) => (e.status || "").toLowerCase() === "reviewed",
  ).length;
  const progressPct =
    evidence.length === 0
      ? 0
      : Math.round((reviewedCount / evidence.length) * 100);

  const recentEvidence = evidence.slice(-5).reverse();
  const recentTimeline = timeline.slice(-5).reverse();

  return (
    <section className="view active">
      <h2>Case Dashboard</h2>

      <CaseSummaryCard caseData={caseData} />

      <div className="stat-grid">
        <StatCard value={evidence.length} label="Evidence items" />
        <StatCard value={people.length} label="People" />
        <StatCard value={locations.length} label="Locations" />
        <StatCard value={bookmarkCount} label="Bookmarked" />
        <StatCard value={reviewedCount} label="Reviewed" />
      </div>

      <Card title="Review progress">
        <ProgressBar percent={progressPct} />
        <p>{progressPct}% of evidence reviewed</p>
      </Card>

      <div className="dashboard-columns">
        <Card title="Recent evidence">
          {recentEvidence.length === 0 && <p>No evidence loaded yet.</p>}
          {recentEvidence.map((ev) => (
            <div className="mini-list-item" key={ev.id}>
              <strong>{ev.id}</strong> &mdash; {ev.title}{" "}
              <Badge variant={statusVariant(ev.status)} label={ev.status} />
            </div>
          ))}
        </Card>

        <Card title="Recent timeline events">
          {recentTimeline.length === 0 && <p>No timeline events loaded yet.</p>}
          {recentTimeline.map((evt) => (
            <div className="mini-list-item" key={evt.id}>
              <strong>{formatDate(evt.time)}</strong>
              <br />
              {evt.title}
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}
