import type { ReactNode } from "react";

export type EmptyStateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

/** TODO: leere Listen / Filter ohne Treffer – Illustration + CTA. */
export function EmptyState({
  title = "Keine Einträge",
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={["flex flex-col items-center justify-center gap-2 px-4 py-12 text-center", className]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-sm font-medium text-jh-text">{title}</p>
      {description ? <p className="max-w-sm text-sm text-jh-text-muted">{description}</p> : null}
      {action}
    </div>
  );
}
