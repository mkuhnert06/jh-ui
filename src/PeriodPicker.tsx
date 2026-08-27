"use client";

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

export type PeriodValue = { year: number; month: number }; // month 1–12

export type PeriodPickerProps = {
  value: PeriodValue;
  onChange: (next: PeriodValue) => void;
  /** Obergrenze (inklusive). Default: aktueller Monat. */
  max?: PeriodValue;
  className?: string;
  label?: string;
};

const MONATE = [
  "Jan",
  "Feb",
  "Mär",
  "Apr",
  "Mai",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Okt",
  "Nov",
  "Dez",
] as const;

function nowPeriod(): PeriodValue {
  const d = new Date();
  return { year: d.getFullYear(), month: d.getMonth() + 1 };
}

function isFuture(p: PeriodValue, max: PeriodValue): boolean {
  return p.year > max.year || (p.year === max.year && p.month > max.month);
}

function formatLabel(p: PeriodValue): string {
  return `${MONATE[p.month - 1]} ${p.year}`;
}

/**
 * Kombinierter Monat/Jahr-Picker: Popover mit Jahr-Tabs und 12er-Monatsgrid.
 * Zukunft (über `max`, Default jetzt) ist disabled.
 */
export function PeriodPicker({
  value,
  onChange,
  max: maxProp,
  className,
  label = "Zeitraum",
}: PeriodPickerProps) {
  const max = maxProp ?? nowPeriod();
  const [open, setOpen] = useState(false);
  const [tabYear, setTabYear] = useState(value.year);
  /** left = Popover wächst nach rechts (left-0); right = nach links (right-0) */
  const [panelAlign, setPanelAlign] = useState<"left" | "right">("left");
  const rootRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  const years = useMemo(() => {
    const start = max.year - 4;
    const list: number[] = [];
    for (let y = start; y <= max.year; y++) list.push(y);
    return list;
  }, [max.year]);

  useEffect(() => {
    if (open) setTabYear(Math.min(value.year, max.year));
  }, [open, value.year, max.year]);

  useLayoutEffect(() => {
    if (!open || !rootRef.current) return;
    const rect = rootRef.current.getBoundingClientRect();
    const panelW = 256; // w-64
    const spaceRight = window.innerWidth - rect.left;
    const spaceLeft = rect.right;
    // Nah am linken Rand: nach rechts öffnen, sonst nach links (wie bisher).
    if (spaceRight >= panelW + 12) setPanelAlign("left");
    else if (spaceLeft >= panelW + 12) setPanelAlign("right");
    else setPanelAlign(spaceRight >= spaceLeft ? "left" : "right");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const pick = useCallback(
    (month: number) => {
      const next = { year: tabYear, month };
      if (isFuture(next, max)) return;
      onChange(next);
      setOpen(false);
    },
    [tabYear, max, onChange],
  );

  function onTriggerKey(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setOpen((o) => !o);
    }
  }

  return (
    <div ref={rootRef} className={["relative inline-block", className].filter(Boolean).join(" ")}>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={label}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onTriggerKey}
        className="inline-flex h-8 items-center gap-1.5 rounded-jh border border-jh-border bg-jh-surface px-2.5 text-sm text-jh-text transition-colors duration-jh hover:bg-black/[0.03]"
      >
        <span className="tabular-nums">{formatLabel(value)}</span>
        <ChevronDown />
      </button>

      {open ? (
        <div
          id={listId}
          role="dialog"
          aria-label={label}
          className={[
            "absolute z-50 mt-1.5 w-64 rounded-jh border border-jh-border bg-jh-surface p-2 shadow-lg",
            panelAlign === "left" ? "left-0" : "right-0",
          ].join(" ")}
        >
          <div className="mb-2 flex gap-1 overflow-x-auto">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setTabYear(y)}
                className={[
                  "rounded-jh px-2 py-1 text-xs tabular-nums transition-colors duration-jh",
                  y === tabYear
                    ? "bg-jh-blau-tint font-medium text-jh-blau"
                    : "text-jh-text-muted hover:bg-black/[0.03]",
                ].join(" ")}
              >
                {y}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-1">
            {MONATE.map((name, i) => {
              const month = i + 1;
              const disabled = isFuture({ year: tabYear, month }, max);
              const selected = value.year === tabYear && value.month === month;
              return (
                <button
                  key={name}
                  type="button"
                  disabled={disabled}
                  onClick={() => pick(month)}
                  className={[
                    "rounded-jh px-2 py-1.5 text-sm transition-colors duration-jh",
                    selected
                      ? "bg-jh-blau-tint font-medium text-jh-blau"
                      : "text-jh-text hover:bg-black/[0.03]",
                    disabled ? "cursor-not-allowed opacity-40 hover:bg-transparent" : "",
                  ].join(" ")}
                >
                  {name}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="text-jh-text-hint">
      <path
        d="M3 4.5L6 7.5L9 4.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
