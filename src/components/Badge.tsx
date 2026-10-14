export type BadgeVariant = "reviewed" | "unreviewed" | "flagged";

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

// Demo 6: liegt in components/, weil mehrere Features es nutzen (Dashboard, Team, Timeline)
export function Badge({ variant, label }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{label}</span>;
}
