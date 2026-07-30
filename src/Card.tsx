import type { ReactNode } from "react";

export type CardProps = {
  title?: string;
  children?: ReactNode;
  className?: string;
};

/** TODO: Standard-Kartenlayout (Padding, Titelzeile, optionale Actions). */
export function Card({ title, children, className }: CardProps) {
  return (
    <section
      className={["rounded-jh border border-jh-border bg-jh-surface p-4", className]
        .filter(Boolean)
        .join(" ")}
    >
      {title ? <h2 className="mb-3 text-sm font-medium text-jh-text">{title}</h2> : null}
      {children}
    </section>
  );
}
