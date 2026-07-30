import type { ReactNode } from "react";

export type KpiTileProps = {
  label: string;
  value?: ReactNode;
  hint?: string;
  className?: string;
};

/** TODO: KPI-Kachel mit Delta, Trend und denselben Status-Tönen wie StatusPill. */
export function KpiTile({ label, value = "—", hint, className }: KpiTileProps) {
  return (
    <div
      className={["rounded-jh border border-jh-border bg-jh-surface px-4 py-3", className]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="text-xs text-jh-text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold tabular-nums text-jh-text">{value}</p>
      {hint ? <p className="mt-1 text-xs text-jh-text-hint">{hint}</p> : null}
    </div>
  );
}
