import type { CaseDataState } from "../useCaseData";
import { formatDate, getStatusBadgeClass } from "../../js/utils";
import { CaseSummaryCard } from "../components/CaseSummaryCard";
import { StatCard } from "../components/StatCard";
import { ProgressBar } from "../components/ProgressBar";

interface DashboardPageProps {
  data: CaseDataState;
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

      <div className="dashboard-panel">
        <h3>Review progress</h3>
        <ProgressBar percent={progressPct} />
        <p>{progressPct}% of evidence reviewed</p>
      </div>

      <div className="dashboard-columns">
        <div className="dashboard-panel">
          <h3>Recent evidence</h3>
          {recentEvidence.length === 0 && <p>No evidence loaded yet.</p>}
          {recentEvidence.map((ev) => (
            <div className="mini-list-item" key={ev.id}>
              <strong>{ev.id}</strong> &mdash; {ev.title}{" "}
              <span className={`badge ${getStatusBadgeClass(ev.status)}`}>
                {ev.status}
              </span>
            </div>
          ))}
        </div>

        <div className="dashboard-panel">
          <h3>Recent timeline events</h3>
          {recentTimeline.length === 0 && <p>No timeline events loaded yet.</p>}
          {recentTimeline.map((evt) => (
            <div className="mini-list-item" key={`${evt.time}-${evt.title}`}>
              <strong>{formatDate(evt.time)}</strong>
              <br />
              {evt.title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
