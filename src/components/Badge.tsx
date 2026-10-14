export type BadgeVariant = "reviewed" | "unreviewed" | "flagged";

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
}

// Reusable badge: the variant decides the colour, the label is the text.
export function Badge({ variant, label }: BadgeProps) {
  return <span className={`badge badge-${variant}`}>{label}</span>;
}
