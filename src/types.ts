export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
  /** Nicht klickbare Zwischenüberschrift in Dropdowns (z. B. „Chef-Blick"). */
  heading?: boolean;
};

export type AppUser = {
  vorname: string;
  nachname: string;
  rolle?: string;
};
