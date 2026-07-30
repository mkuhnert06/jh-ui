"use client";

import { useEffect } from "react";

export type StatusTon = "rot" | "gelb" | "gruen";

export type StatusPillProps = {
  ton: StatusTon;
  text: string;
  href?: string;
  className?: string;
};

const FARBE_ONLY = /^(rot|grün|gruen|gelb|green|red|yellow|amber)$/i;

const TON_CLASS: Record<StatusTon, string> = {
  rot: "bg-jh-rot-bg text-jh-rot-fg",
  gelb: "bg-jh-gelb-bg text-jh-gelb-fg",
  gruen: "bg-jh-gruen-bg text-jh-gruen-fg",
};

/**
 * Status-Pill mit Klartext-Pflicht: `text` muss eine Aussage sein,
 * nicht nur die Farbe („Rot“ / „Grün“).
 */
export function StatusPill({ ton, text, href, className }: StatusPillProps) {
  useEffect(() => {
    const t = text.trim();
    if (!t || FARBE_ONLY.test(t)) {
      console.warn(
        `[StatusPill] text="${text}" ist keine Aussage – bitte z. B. „3 überfällig“ statt nur einer Farbe.`,
      );
    }
  }, [text]);

  const classes = [
    "inline-flex items-center gap-1.5 rounded-jh px-2 py-0.5 text-xs font-medium",
    TON_CLASS[ton],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a href={href} className={classes}>
        {text}
      </a>
    );
  }

  return <span className={classes}>{text}</span>;
}
