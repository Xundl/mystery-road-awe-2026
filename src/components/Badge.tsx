export type BadgeVariant =
  "reviewed" | "unreviewed" | "flagged" | "relevant" | "critical";

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

export function statusVariant(status: string): BadgeVariant {
  const s = (status || "").toLowerCase();
  if (s === "reviewed") return "reviewed";
  if (s === "flagged") return "flagged";
  return "unreviewed";
}

export function relevanceVariant(relevance: string): BadgeVariant {
  return (relevance || "").toLowerCase() === "relevant"
    ? "relevant"
    : "unreviewed";
}

// Reusable badge: the variant decides the colour, the label is the text.
export function Badge({ variant, label }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{label}</span>;
}
