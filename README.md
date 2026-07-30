# @josef-hebel/ui

Gemeinsames Design-Paket für Josef-Hebel-Web-Apps (Cockpit, Einkaufstermine, …).
Source-only: die Apps kompilieren das Paket über `transpilePackages` – kein Build-Step, keine npm-Registry.

## Regel

**Wenn zwei Apps dasselbe Element brauchen, kommt es hierher, nicht in die App.**

Farben und Maße leben ausschließlich in `src/tokens.css`. Keine Hex-Werte in Komponenten oder Apps.

## Installation

Im Repo-Root der App (Pfad anpassen):

```bash
npm install ../jh-ui
```

oder per Git:

```bash
npm install git+ssh://git@github.com:ORG/jh-ui.git#v1.0.0
```

`next.config`:

```js
transpilePackages: ["@josef-hebel/ui"]
```

`globals.css` / Layout:

```css
@import "@josef-hebel/ui/tokens.css";
```

`tailwind.config`:

```js
presets: [require("@josef-hebel/ui/tailwind-preset")]
```

Content-Pfad ergänzen, damit Klassen aus dem Paket gescannt werden:

```js
content: [
  "./src/**/*.{ts,tsx}",
  "./node_modules/@josef-hebel/ui/src/**/*.{ts,tsx}",
]
```

## Nutzung

```tsx
import { AppShell, StatusPill, PeriodPicker } from "@josef-hebel/ui";

<AppShell
  appName="Einkaufstermine"
  nav={[{ label: "Übersicht", href: "/" }]}
  user={{ vorname: "Marlon", nachname: "Kuhnert", rolle: "Admin" }}
  pathname={pathname}
  status={<StatusPill ton="rot" text="3 überfällig" />}
>
  {children}
</AppShell>
```

## Versionierung

SemVer über **Git-Tags** (`v1.0.0`, `v1.1.0`, …). Apps pinnen den Tag in `package.json`. Breaking Changes (Token-Umbenennungen, AppShell-API) → Major.

## Exports

| Import | Inhalt |
|--------|--------|
| `@josef-hebel/ui` | Komponenten + `formatName` / `getInitialen` |
| `@josef-hebel/ui/tokens.css` | CSS-Variablen |
| `@josef-hebel/ui/tailwind-preset` | Tailwind-Preset (`jh.*`) |
