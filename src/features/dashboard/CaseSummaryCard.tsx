import { Badge } from "../../components/Badge";
import { Card } from "../../components/Card";
import type { CaseData } from "../../../js/types";

interface CaseSummaryCardProps {
  caseData: CaseData | null;
}

export function CaseSummaryCard({ caseData }: CaseSummaryCardProps) {
  return (
    <Card className="case-summary-card" title={caseData?.title || "Case"}>
      <p>
        <Badge
          variant="flagged"
          label={(caseData?.status || "unknown").toUpperCase()}
        />
      </p>
      <p>{caseData?.summary || ""}</p>
    </Card>
  );
}
