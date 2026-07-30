export type NavItem = {
  label: string;
  href: string;
  children?: NavItem[];
};

export type AppUser = {
  vorname: string;
  nachname: string;
  rolle?: string;
};
