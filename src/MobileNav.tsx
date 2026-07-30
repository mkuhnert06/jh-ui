"use client";

import { useEffect } from "react";
import type { NavItem } from "./types";

export type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  appName: string;
  nav: NavItem[];
  pathname?: string;
};

function isActive(pathname: string | undefined, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Sheet-Navigation unter `lg`. Desktop-Nav bleibt in AppShell.
 */
export function MobileNav({ open, onClose, appName, nav, pathname }: MobileNavProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal aria-label="Navigation">
      <button
        type="button"
        className="absolute inset-0 bg-jh-overlay"
        aria-label="Menü schließen"
        onClick={onClose}
      />
      <nav className="absolute inset-y-0 left-0 flex w-[min(100%,20rem)] flex-col bg-jh-surface shadow-xl">
        <div className="flex h-jh-header items-center justify-between border-b border-jh-border px-4">
          <span className="text-[15px] font-medium tracking-[-0.01em] text-jh-text">{appName}</span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-jh p-2 text-jh-text-muted transition-colors duration-jh hover:bg-black/[0.03]"
            aria-label="Schließen"
          >
            <CloseIcon />
          </button>
        </div>
        <ul className="flex-1 overflow-y-auto p-2">
          {nav.map((item) => (
            <li key={item.href + item.label}>
              <a
                href={item.href}
                onClick={onClose}
                className={[
                  "block rounded-jh px-3 py-2.5 text-sm transition-colors duration-jh",
                  isActive(pathname, item.href)
                    ? "bg-jh-blau-tint font-medium text-jh-blau"
                    : "text-jh-text-muted hover:bg-black/[0.03]",
                ].join(" ")}
              >
                {item.label}
              </a>
              {item.children?.length ? (
                <ul className="mb-1 ml-2 border-l border-jh-border pl-2">
                  {item.children.map((child) => (
                    <li key={child.href + child.label}>
                      <a
                        href={child.href}
                        onClick={onClose}
                        className={[
                          "block rounded-jh px-3 py-2 text-sm transition-colors duration-jh",
                          isActive(pathname, child.href)
                            ? "bg-jh-blau-tint font-medium text-jh-blau"
                            : "text-jh-text-muted hover:bg-black/[0.03]",
                        ].join(" ")}
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        d="M5 5l8 8M13 5l-8 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
