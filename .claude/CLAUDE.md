# VAR Knowledgebase (docs-v2)

Wissensdatenbank der Virtual Air Rescue (VAR), gebaut mit VitePress 1.x, live unter
https://docs.virtualairrescue.com. Leser sind Mitglieder (Piloten und Disponenten) einer
Luftrettungssimulation, viele davon Einsteiger. Alles ist auf Deutsch.

## Befehle

- `npm run dev` – Vorschau auf http://localhost:3006. Lädt vorher die Daten in `src/.data/`
  neu (Internet nötig). Kein Login, keine `.env` nötig.
- `npm run build` – baut nach `.vitepress/dist`. **Nach jeder Änderung ausführen:** Der Build
  bricht bei toten internen Links ab (`ignoreDeadLinks` ist bewusst nicht gesetzt).
- `npm run dev:gateway` – Build plus Gateway mit HUB-Login, nur für Maintainer, braucht eine
  `.env` (siehe `.env.example` und README).

Die Daten-Skripte (`prebuild`, `predev`) überschreiben `src/.data/*.json` mit dem aktuellen
Stand der OPS-API. Diese Dateien sind deshalb fast immer geändert. **Nicht zusammen mit
Textänderungen committen**, außer es ist ausdrücklich gewollt.

## Aufbau

```
src/
  index.md                 Startseite (Hero und Kacheln im Frontmatter)
  wege/                    zum Durcharbeiten, von oben nach unten
    start/                 Voraussetzungen, Die ersten 30 Minuten, Glossar
    pilotenbereich/        How To Pilot, Hubschrauber, Flugbetrieb, Procedures
    disponentenbereich/    How To Disponent, Disposition, Stichworte, Zielklinik, MANV
  nachschlagen/            zum Hineinspringen
    luftrettung/           Fachwissen, BOS-Funk, Crew, Länder (Schweiz, Österreich …)
    region/                Länderkunde
    var-systeme/           Webleitstelle, Pilotenansicht, Jet-Ansicht, Discord, R&E
    allgemein/             VATSIM u. a., dazu alte Weiterleitungsseiten
  community/               FAQ, VAR FAIR PLAY
  .data/                   automatisch erzeugte JSON-Daten (nicht von Hand bearbeiten)
  public/                  Logos, Favicons
.vitepress/
  config.mts               Navigation, Seitenleiste, Suche, eigene Blöcke, Rewrites
  theme/                   VAR-Farben (custom.css), Schrift Uniform, Vue-Komponenten
server/gateway.mjs         HUB-Login (OAuth) und Sperrprüfung vor der Auslieferung
```

### URLs ≠ Ordner

`rewriteLegacyRoute` in `config.mts` nimmt die Ordner `wege/` und `nachschlagen/` aus der URL
und `community/` ebenso:

| Datei | URL |
|---|---|
| `src/wege/disponentenbereich/manv.md` | `/disponentenbereich/manv` |
| `src/nachschlagen/var-systeme/jet.md` | `/var-systeme/jet` |
| `src/community/faq.md` | `/faq` |

**Interne Links immer mit der URL schreiben, nicht mit dem Dateipfad**, ohne `.md`:
`[Status](/luftrettung/bos-funk/Status)`. Groß- und Kleinschreibung im Dateinamen gilt auch in der
URL.

### Neue Seite anlegen

1. Datei im passenden Ordner anlegen (Wege oder Nachschlagen, siehe oben).
2. Frontmatter mit `title` und `description` setzen (siehe unten).
3. In `.vitepress/config.mts` in die Seitenleiste eintragen, mit den Kürzeln `P`, `D`, `L`, `S`,
   `A` für die Bereiche.
4. Von passenden Seiten aus verlinken, damit sie gefunden wird.
5. `npm run build`.

Beim **Löschen** einer Seite alle Verweise mit entfernen (Seitenleiste, Glossar, „Weiter“-Listen,
Startseiten-Kacheln) und die betroffenen Sätze umschreiben, statt nur den Link zu streichen.

### Anker

VitePress entfernt Umlaute aus Überschriften-Ankern: „Aufträge für Ambulanz-Jets“ wird zu
`#auftrage-fur-ambulanz-jets`. Der Build prüft Anker **nicht**. Bei Links auf Abschnitte den
Anker in `.vitepress/dist/…html` nachsehen (`id="…"`).

## Markdown-Bausteine

Standardblöcke von VitePress: `::: info`, `::: tip`, `::: warning`, `::: danger`,
`::: details`. Ein eigener Titel steht hinter dem Namen: `::: info Versuche beim D-1-Test`.

Eigene Blöcke (definiert in `config.mts`, gestaltet in `custom.css`):

| Block | Wofür |
|---|---|
| `::: funk` | ein Funkspruch, wörtlich |
| `::: status` | eine Statusmeldung oder Anweisung, z. B. `::: status Status 9 — Fahrzeuganmeldung` |
| `::: sop` | ein Verfahren, Schritt für Schritt |
| `::: pruefen` | Inhalt, den die VAR noch bestätigen muss |

Funksprüche gehören in `::: funk`, nicht in normale Zitate.

Vue-Komponenten: `<Stationskarte />` ist global registriert. `FlughafenListe` und `SpitalKarte`
werden in der Seite per `<script setup>` importiert (Beispiel:
`nachschlagen/luftrettung/flughafenverzeichnis.md`). Sie laden Live-Daten über `/api/…` und
fallen auf `src/.data/` zurück.

Bilder liegen in einem `assets/`-Ordner neben der Seite und werden relativ eingebunden:
`![MRT](assets/Base_NoScreen.png)`. Bilder vor dem Einchecken verkleinern.

## Frontmatter

```yaml
---
title: How To Disponent
description: Vom Konto bis zur ersten Schicht in der Leitstelle — was du brauchst, ….
---
```

Danach eine `# Überschrift` mit demselben Titel. `description` ist ein Satz und erscheint in der
Suche und in Vorschauen.

## Schreibstil

- **Deutsch, natürlich formuliert.** Keine Sätze, die wie übersetzt klingen. Lieber „Alles, was
  im Test geprüft wird, findest du in unserer Wissensdatenbank“ als „Der Test fragt Wissen ab, das
  in diesen Docs steht“.
- **Du-Form**, direkt und freundlich, ohne Werbesprache.
- **Kurze Absätze**, Zeilenumbruch im Quelltext bei etwa 80 Zeichen.
- **Abläufe als nummerierte Schritte** (`## 1. Registrierung`, `## 2. Vorbereitung` …),
  Voraussetzungen als Liste mit fettem Stichwort am Anfang.
- **Tabellen** für Gegenüberstellungen und Linksammlungen („Thema | Seiten“).
- **Fett** für Begriffe, die der Leser in der Oberfläche wiederfindet (Knöpfe, Felder, Status).
  Beschriftungen genau so schreiben, wie sie in HUB oder ops stehen.
- **Keine internen Namen** aus dem Code (Tabellen, Funktionen, Berechtigungs-Enums wie `DISPO`)
  in Leser-Texten. Stattdessen beschreiben, was der Nutzer sieht.
- **Verweisen statt wiederholen:** Was auf einer anderen Seite ausführlich steht, nur kurz
  anreißen und verlinken.
- Typografie: Gedankenstrich „—“, deutsche Anführungszeichen „…“, Prozent mit Leerzeichen
  (`80 %`), Ellipse „…“.

### Feste Begriffe

| So | Nicht so |
|---|---|
| HUB, immer in Großbuchstaben (auch HUB-Login, HUB-Admin) | Hub, hub, Moodle |
| Wissensdatenbank | Docs (im Leser-Text) |
| Support-Team, Ticket im HUB (`https://hub.virtualairrescue.com/tickets`) | Event-Team, Ticket im Discord |
| Webleitstelle, Pilotenansicht, Jet-Ansicht | Leitstellen-Interface, Piloten-Interface |
| Disponent, Pilot | Dispatcher |
| BOS-Funktest, P-1, D-1 | Funkttest, P1-Kurs |

### Feststehende Inhalte (Stand November 2026)

- **Discord-Verknüpfung ist für alle Mitglieder Pflicht**, nicht optional.
- **Vorerfahrung im Rettungsdienst** ist weder für Piloten noch für Disponenten nötig.
- **Weg zum Disponenten:** BOS-Funktest → Einschreibung in den D-1-Kurs im HUB und Anmeldung zu
  einem Einschulungstermin (findet im Discord statt) → D-1-Test, freigeschaltet nach bestätigter
  Anwesenheit.
- **Weg zum Piloten:** P-1-Prüfung im HUB, danach automatisch Berechtigung zum Verbinden.
- **Versuche** (P-1 und D-1): zwei Versuche, zwei Wochen Wartezeit, dann wird der dritte und
  letzte Versuch automatisch freigeschaltet. Danach hilft nur das Support-Team per Ticket.
  Bestehensgrenze 80 %. Die Zahlen werden im HUB-Admin gepflegt und können sich ändern.
- Der **NACA-Score** wird nicht mehr verwendet und kommt in den Docs nicht vor.
- **Patientendaten und Transportziel nur per Telefon** (Diensthandy bzw. Leitstellen-Telefon),
  nie über Funk. Die Leitstelle ruft mit dem Ziel zurück und setzt die Zielklinik zusätzlich in der
  Webleitstelle. Über Funk laufen nur Status, Lagemeldung und Nachforderung.
- Die Statusanweisungen **d** und **h** gibt es nicht mehr.
- **Status F** („Kommen Sie über Draht“) heißt: Leitstelle per Telefon anrufen.
- **Status 7** heißt „Einsatzgebunden“ (bei der VAR: Transport zur Klinik), **Status 8** heißt
  „Bedingt verfügbar“ (bei der VAR: am Zielort). Die Namen nicht ändern.
  Statusfolge im Einsatz: 2 → 3 → 4 → 7 → 8 → 1 → 2.

## Inhalte prüfen

Die Funktionen von HUB, Webleitstelle, Pilotenansicht und Jet-Seite stehen im Monorepo
(`var-monorepo`, Projektnotizen in `.claude/claude.md`). Wer Funktionen beschreibt:

- **Gegen den Code prüfen**, nicht aus dem Gedächtnis oder älteren Seiten übernehmen. Beschriftungen
  in den `.tsx`-Dateien nachsehen.
- **Closed-Beta-Funktionen** (nur mit Beta-Tester-Rolle) nicht oder nur mit Hinweis beschreiben.
  Open Beta darf rein, mit `::: info Open Beta`, wenn die Oberfläche das Kennzeichen zeigt.
- Werte, die im Admin-Bereich eingestellt werden (Versuche, Wartezeiten), stehen nicht im Code.
  Im Zweifel nachfragen statt raten.
- Nichts erfinden: Was unklar ist, offen lassen oder mit `::: pruefen` markieren.

## Git und Veröffentlichung

- Hauptzweig ist **`staging`**. Änderungen dort committen oder per Branch und PR nach `staging`.
- **Veröffentlichen** = PR von `staging` nach `release` und mergen. Der Workflow
  `.github/workflows/deploy-production.yaml` baut dann auf dem Server neu (Docker, Gateway auf
  Port 80 hinter Traefik).
- Vor einem Push `git pull --rebase` auf `staging`: Dependabot schiebt regelmäßig
  VitePress-Updates direkt in `staging`.
- Commit-Nachrichten auf Deutsch mit Bereich vorn, z. B. `Docs: How To Disponent überarbeitet`.
- `.env` ist in `.gitignore` und gehört nie ins Repository. Die echte `.env` liegt nur auf dem
  Server (`~/docker/docs-v2/.env`).
