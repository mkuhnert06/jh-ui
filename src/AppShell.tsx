"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { formatName, getInitialen } from "./lib/formatName";
import type { AppUser, NavItem } from "./types";

export type { NavItem, AppUser };

export type AppShellProps = {
  appName: string;
  nav: NavItem[];
  user: AppUser;
  /** Slot direkt nach dem App-Namen (z. B. PeriodPicker). */
  actions?: ReactNode;
  /** Slot rechts vor SharePoint (z. B. StatusPill, Sync). */
  status?: ReactNode;
  /**
   * Ersetzt die Standard-Desktop-Navigation (Zeile 2).
   * Wenn gesetzt, wird die eingebaute Top/Mehr-Nav nicht gerendert.
   */
  navSlot?: ReactNode;
  /**
   * Ersetzt Burger + MobileNav. Wenn gesetzt, steuert die App das Mobile-Menü selbst
   * (Button gehört typischerweise in den Slot).
   */
  mobileNavSlot?: ReactNode;
  sharepointUrl?: string;
  sharepointLabel?: string;
  /** Blaue Wortmarke (helle Flächen). Ohne Pfad: Bildmarke als Fallback. */
  logoSrc?: string;
  logoAlt?: string;
  /** Abmelde-URL. Default: `/auth/signout` */
  signOutHref?: string;
  pathname?: string;
  children: ReactNode;
};

const MAX_TOP = 5;
const SIGN_OUT_DEFAULT = "/auth/signout";
export const JH_THEME_KEY = "jh-theme";

function isActive(pathname: string | undefined, href: string): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function flattenNav(items: NavItem[]): NavItem[] {
  const out: NavItem[] = [];
  for (const item of items) {
    out.push(item);
    if (item.children) out.push(...flattenNav(item.children));
  }
  return out;
}

function readTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function applyTheme(next: "light" | "dark") {
  const root = document.documentElement;
  if (next === "dark") root.setAttribute("data-theme", "dark");
  else root.removeAttribute("data-theme");
  try {
    localStorage.setItem(JH_THEME_KEY, next);
  } catch {
    /* optional */
  }
}

/**
 * App-Chrome Variante B (Homepage-ähnlich, zweizeilig, weißer Grund):
 * Meta-Zeile + Navigationszeile mit blauer Unterlinie, Aktiv in Hebel-Blau.
 */
export function AppShell({
  appName,
  nav,
  user,
  status,
  actions,
  navSlot,
  mobileNavSlot,
  sharepointUrl,
  sharepointLabel = "SharePoint",
  logoSrc,
  logoAlt = "Josef Hebel",
  signOutHref = SIGN_OUT_DEFAULT,
  pathname,
  children,
}: AppShellProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mehrOpen, setMehrOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const mehrRef = useRef<HTMLLIElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  const displayName = formatName(user);
  const initialen = getInitialen(user);

  const { top, mehr } = useMemo(() => {
    if (nav.length <= MAX_TOP) return { top: nav, mehr: [] as NavItem[] };
    return { top: nav.slice(0, MAX_TOP - 1), mehr: nav.slice(MAX_TOP - 1) };
  }, [nav]);

  useEffect(() => {
    setTheme(readTheme());
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    function onScroll() {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setScrolled(window.scrollY > 2), 200);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      const t = e.target as Node;
      if (mehrRef.current && !mehrRef.current.contains(t)) setMehrOpen(false);
      if (avatarRef.current && !avatarRef.current.contains(t)) setAvatarOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }, [theme]);

  const searchItems = useMemo(() => flattenNav(nav), [nav]);

  return (
    <div className="min-h-screen bg-jh-surface-alt font-sans text-jh-text">
      <header
        className={[
          "sticky top-0 z-50 bg-jh-surface transition-[box-shadow] duration-jh",
          scrolled ? "shadow-sm" : "",
        ].join(" ")}
        style={{
          boxShadow: scrolled ? "var(--jh-shadow-scrolled)" : "var(--jh-shadow-header)",
        }}
      >
        {/* Zeile 1 – Metazeile */}
        <div className="border-b border-jh-border">
          <div className="mx-auto flex h-9 max-w-[1600px] items-center gap-3 px-3 sm:px-4">
            {mobileNavSlot ? (
              mobileNavSlot
            ) : (
              <button
                type="button"
                className="rounded-jh p-1 text-jh-text-muted lg:hidden hover:bg-black/[0.03]"
                aria-label="Menü"
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </button>
            )}

            <span className="min-w-0 truncate text-xs font-medium text-jh-text sm:text-[13px]">
              {appName}
            </span>

            {actions ? (
              <div className="flex min-w-0 items-center gap-1.5">{actions}</div>
            ) : null}

            <div className="ml-auto flex min-w-0 items-center gap-1.5 sm:gap-2">
              {status ? <div className="flex items-center gap-1.5">{status}</div> : null}

              {sharepointUrl ? (
                <a
                  href={sharepointUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden rounded-jh px-2 py-1 text-xs text-jh-text-muted transition-colors duration-jh hover:bg-black/[0.03] hover:text-jh-blau sm:inline"
                >
                  {sharepointLabel}
                </a>
              ) : null}

              <div ref={avatarRef} className="relative">
                <button
                  type="button"
                  aria-expanded={avatarOpen}
                  aria-haspopup="menu"
                  onClick={() => setAvatarOpen((o) => !o)}
                  className="flex max-w-[11rem] items-center gap-1.5 rounded-jh px-1.5 py-0.5 text-xs text-jh-text transition-colors duration-jh hover:bg-black/[0.03] sm:max-w-[14rem]"
                  aria-label="Benutzermenü"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-jh-blau-tint text-[10px] font-medium text-jh-blau">
                    {initialen}
                  </span>
                  <span className="hidden truncate sm:inline">{displayName}</span>
                  <Chevron />
                </button>
                {avatarOpen ? (
                  <div
                    role="menu"
                    className="absolute right-0 top-full z-50 mt-1.5 w-64 rounded-jh border border-jh-border bg-jh-surface py-1 shadow-lg"
                  >
                    <div className="border-b border-jh-border px-3 py-2.5">
                      <p className="text-sm font-medium text-jh-text">{displayName}</p>
                      {user.rolle ? (
                        <p className="mt-0.5 text-xs text-jh-text-muted">{user.rolle}</p>
                      ) : null}
                    </div>
                    {sharepointUrl ? (
                      <a
                        role="menuitem"
                        href={sharepointUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block px-3 py-2 text-sm text-jh-text-muted transition-colors duration-jh hover:bg-black/[0.03] sm:hidden"
                        onClick={() => setAvatarOpen(false)}
                      >
                        {sharepointLabel}
                      </a>
                    ) : null}
                    <button
                      type="button"
                      role="menuitem"
                      onClick={() => {
                        toggleTheme();
                        setAvatarOpen(false);
                      }}
                      className="flex w-full px-3 py-2 text-left text-sm text-jh-text-muted transition-colors duration-jh hover:bg-black/[0.03]"
                    >
                      {theme === "dark" ? "Hellmodus" : "Dunkelmodus"}
                    </button>
                    <form action={signOutHref} method="post">
                      <button
                        type="submit"
                        role="menuitem"
                        className="flex w-full border-t border-jh-border px-3 py-2 text-left text-sm text-jh-text-muted transition-colors duration-jh hover:bg-black/[0.03]"
                      >
                        Abmelden
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        {/* Zeile 2 – Navigation + Logo, blaue Unterlinie */}
        <div className="border-b-2 border-jh-blau">
          <div className="mx-auto flex h-12 max-w-[1600px] items-stretch gap-3 px-3 sm:h-14 sm:px-4">
            {navSlot ? (
              <div className="relative min-w-0 flex-1">{navSlot}</div>
            ) : (
              <nav
                className="relative hidden min-w-0 flex-1 items-stretch lg:flex"
                aria-label="Hauptnavigation"
              >
                <ul className="flex min-w-0 items-stretch gap-0.5">
                  {top.map((item) => (
                    <NavTab key={item.href + item.label} item={item} pathname={pathname} />
                  ))}
                  {mehr.length > 0 ? (
                    <li ref={mehrRef} className="relative flex items-stretch">
                      <button
                        type="button"
                        aria-expanded={mehrOpen}
                        aria-haspopup="menu"
                        onClick={() => setMehrOpen((o) => !o)}
                        className={[
                          "relative flex items-center gap-1 px-2.5 text-sm transition-colors duration-jh",
                          mehr.some(
                            (m) =>
                              isActive(pathname, m.href) ||
                              m.children?.some((c) => isActive(pathname, c.href)),
                          )
                            ? "font-medium text-jh-blau"
                            : "font-normal text-jh-blau/80 hover:text-jh-blau",
                        ].join(" ")}
                      >
                        Mehr
                        <Chevron />
                        {mehr.some(
                          (m) =>
                            isActive(pathname, m.href) ||
                            m.children?.some((c) => isActive(pathname, c.href)),
                        ) ? (
                          <span
                            className="absolute inset-x-0 bottom-0 h-0.5 bg-jh-blau"
                            aria-hidden
                          />
                        ) : null}
                      </button>
                      {mehrOpen ? (
                        <ul
                          role="menu"
                          className="absolute left-0 top-full z-50 mt-0 min-w-[11rem] border border-jh-border border-t-2 border-t-jh-blau bg-jh-surface py-1 shadow-lg"
                        >
                          {mehr.map((item) => (
                            <li key={item.href + item.label} role="none">
                              <a
                                role="menuitem"
                                href={item.href}
                                onClick={() => setMehrOpen(false)}
                                className={[
                                  "block px-3 py-2 text-sm transition-colors duration-jh",
                                  isActive(pathname, item.href)
                                    ? "font-medium text-jh-blau"
                                    : "text-jh-text-muted hover:bg-black/[0.03] hover:text-jh-blau",
                                ].join(" ")}
                              >
                                {item.label}
                              </a>
                              {item.children?.map((child) => (
                                <a
                                  key={child.href + child.label}
                                  role="menuitem"
                                  href={child.href}
                                  onClick={() => setMehrOpen(false)}
                                  className={[
                                    "block px-3 py-2 pl-5 text-sm transition-colors duration-jh",
                                    isActive(pathname, child.href)
                                      ? "font-medium text-jh-blau"
                                      : "text-jh-text-muted hover:bg-black/[0.03] hover:text-jh-blau",
                                  ].join(" ")}
                                >
                                  {child.label}
                                </a>
                              ))}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                    </li>
                  ) : null}
                </ul>
              </nav>
            )}

            <div className="ml-auto flex shrink-0 items-center py-2">
              <a href="/" className="flex items-center" aria-label="Zur Startseite">
                {logoSrc ? (
                  <img
                    src={logoSrc}
                    alt={logoAlt}
                    className="h-8 w-auto max-w-[11rem] object-contain object-right sm:h-9 sm:max-w-[13rem]"
                  />
                ) : (
                  <Logo size={36} variant="full" className="text-jh-blau" />
                )}
              </a>
            </div>
          </div>
        </div>
      </header>

      {!mobileNavSlot ? (
        <MobileNav
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          appName={appName}
          nav={nav}
          pathname={pathname}
        />
      ) : null}

      {searchOpen ? (
        <CommandPalette
          items={searchItems}
          onClose={() => setSearchOpen(false)}
          pathname={pathname}
        />
      ) : null}

      <main>{children}</main>
    </div>
  );
}

function NavTab({ item, pathname }: { item: NavItem; pathname?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const active =
    isActive(pathname, item.href) ||
    !!item.children?.some((c) => isActive(pathname, c.href));
  const hasChildren = !!item.children?.length;

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const baseCls = [
    "relative flex items-center gap-1 px-2.5 text-sm transition-colors duration-jh",
    active ? "font-medium text-jh-blau" : "font-normal text-jh-blau/80 hover:text-jh-blau",
  ].join(" ");

  return (
    <li ref={ref} className="relative flex items-stretch">
      {hasChildren ? (
        <>
          <button
            type="button"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen((o) => !o)}
            className={baseCls}
          >
            {item.label}
            <Chevron />
            {active ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-jh-blau" aria-hidden />
            ) : null}
          </button>
          {open ? (
            <ul
              role="menu"
              className="absolute left-0 top-full z-50 mt-0 min-w-[11rem] border border-jh-border border-t-2 border-t-jh-blau bg-jh-surface py-1 shadow-lg"
            >
              <li role="none">
                <a
                  role="menuitem"
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={[
                    "block px-3 py-2 text-sm transition-colors duration-jh",
                    isActive(pathname, item.href)
                      ? "font-medium text-jh-blau"
                      : "text-jh-text-muted hover:bg-black/[0.03] hover:text-jh-blau",
                  ].join(" ")}
                >
                  {item.label}
                </a>
              </li>
              {item.children!.map((child) => (
                <li key={child.href + child.label} role="none">
                  <a
                    role="menuitem"
                    href={child.href}
                    onClick={() => setOpen(false)}
                    className={[
                      "block px-3 py-2 text-sm transition-colors duration-jh",
                      isActive(pathname, child.href)
                        ? "font-medium text-jh-blau"
                        : "text-jh-text-muted hover:bg-black/[0.03] hover:text-jh-blau",
                    ].join(" ")}
                  >
                    {child.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <a href={item.href} className={baseCls} aria-current={active ? "page" : undefined}>
          {item.label}
          {active ? (
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-jh-blau" aria-hidden />
          ) : null}
        </a>
      )}
    </li>
  );
}

function CommandPalette({
  items,
  onClose,
  pathname,
}: {
  items: NavItem[];
  onClose: () => void;
  pathname?: string;
}) {
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items.slice(0, 12);
    return items.filter((i) => i.label.toLowerCase().includes(needle)).slice(0, 12);
  }, [items, q]);

  useEffect(() => {
    inputRef.current?.focus();
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center bg-jh-overlay pt-[15vh] px-4">
      <button type="button" className="absolute inset-0 cursor-default" aria-label="Schließen" onClick={onClose} />
      <div
        role="dialog"
        aria-modal
        aria-label="Suche"
        className="relative w-full max-w-lg overflow-hidden rounded-jh border border-jh-border bg-jh-surface shadow-xl"
      >
        <div className="flex items-center gap-2 border-b border-jh-border px-3">
          <SearchIcon />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Navigieren …"
            className="h-11 w-full bg-transparent text-sm text-jh-text outline-none placeholder:text-jh-text-hint"
          />
        </div>
        <ul className="max-h-72 overflow-y-auto py-1">
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-sm text-jh-text-hint">Keine Treffer</li>
          ) : (
            filtered.map((item) => (
              <li key={item.href + item.label}>
                <a
                  href={item.href}
                  onClick={onClose}
                  className={[
                    "flex items-center justify-between px-3 py-2 text-sm transition-colors duration-jh hover:bg-black/[0.03]",
                    isActive(pathname, item.href) ? "font-medium text-jh-blau" : "text-jh-text",
                  ].join(" ")}
                >
                  <span>{item.label}</span>
                  <span className="text-xs text-jh-text-hint">{item.href}</span>
                </a>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function Chevron() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden className="opacity-70">
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

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="text-jh-text-hint">
      <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      <path
        d="M3 5h12M3 9h12M3 13h12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
