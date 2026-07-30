export type NameParts = {
  vorname?: string | null;
  nachname?: string | null;
};

function clean(part?: string | null): string {
  return (part ?? "").trim().replace(/\s+/g, " ");
}

/**
 * Normalisiert Anzeigenamen auf „Vorname Nachname“.
 * Apps liefern Namen aus Auth/SSO/Mitarbeiter unterschiedlich sortiert –
 * dieses Paket ist die einzige Formatierungsquelle.
 */
export function formatName({ vorname, nachname }: NameParts): string {
  const v = clean(vorname);
  const n = clean(nachname);
  return [v, n].filter(Boolean).join(" ");
}

/** Initialen aus Vor- und Nachname, z. B. „MK“. */
export function getInitialen({ vorname, nachname }: NameParts): string {
  const v = clean(vorname);
  const n = clean(nachname);
  const a = v.charAt(0);
  const b = n.charAt(0);
  return `${a}${b}`.toUpperCase() || "?";
}
