import type { ReactNode } from "react";

export type DataTableProps = {
  children?: ReactNode;
  className?: string;
};

/** TODO: gemeinsame Tabellen-Chrome (Header sticky, Zeilen-Hover, leere Zustände). */
export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={["overflow-x-auto rounded-jh border border-jh-border bg-jh-surface", className]
      .filter(Boolean)
      .join(" ")}
    >
      {/* TODO: Spalten-API, Sortierung, Dichte */}
      {children}
    </div>
  );
}
