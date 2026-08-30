import { defineConfig } from "vitepress";
import container from "markdown-it-container";
import type MarkdownIt from "markdown-it";

// Eigene Bloecke fuer Fachinhalte. Funksprueche standen bisher als gewoehnliche
// Zitate und sahen aus wie Fliesstext.
//   ::: funk     Ein Funkspruch, woertlich
//   ::: status   Eine Statusmeldung oder -anweisung
//   ::: sop      Ein Verfahren, Schritt fuer Schritt
//   ::: pruefen  Was die VAR noch festlegen muss
const BLOECKE: Array<[string, string]> = [
  ["funk", "Funkspruch"],
  ["status", "Status"],
  ["sop", "Verfahren"],
  ["pruefen", "Offen — von der VAR zu bestaetigen"],
];

function eigeneBloecke(md: MarkdownIt) {
  for (const [name, standard] of BLOECKE) {
    md.use(container, name, {
      render(tokens: any[], idx: number) {
        const t = tokens[idx];
        if (t.nesting === 1) {
          const titel = t.info.trim().slice(name.length).trim() || standard;
          return (
            `<div class="custom-block ${name}">` +
            `<p class="custom-block-title">${md.utils.escapeHtml(titel)}</p>`
          );
        }
        return "</div>";
      },
    });
  }
}

// =====================================================================
// VAR Knowledgebase
//
// Aufbau nach zwei Achsen, die vorher vermischt waren:
//
//   Vorn die WEGE — von oben nach unten durchzuarbeiten. Wer fliegen will,
//   liest den Pilotenbereich; wer disponieren will, den Disponentenbereich.
//   Beide beginnen bei "Erste Schritte".
//
//   Dahinter die NACHSCHLAGEWERKE — Luftrettung, Region, VAR-Systeme,
//   Allgemein. Da springt man hinein, man liest sie nicht am Stück.
//
// Vorher stand "Luftrettung" für dreierlei zugleich: Crew-Wissen, Funk und
// Länderkunde. Der Funk gehört zum Fach, die Länderkunde in einen eigenen
// Bereich — sonst sucht ein Neuling dreimal für einen Weg.
//
// Dateien wurden dabei NICHT verschoben: jeder bestehende Link, jedes
// Lesezeichen und jeder Suchtreffer bleibt gültig. Umsortiert ist die
// Navigation, nicht die Ablage.
// =====================================================================

const P = "/pilotenbereich";
const D = "/disponentenbereich";
const L = "/luftrettung";
const S = "/var-systeme";
const A = "/allgemein";

export default defineConfig({
  title: "VAR Knowledgebase",
  description:
    "Wissensdatenbank der Virtual Air Rescue: BOS-Funk, Flugbetrieb, " +
    "Disposition und die Systeme, mit denen wir Luftrettung simulieren.",
  srcDir: "src",
  lang: "de-DE",
  cleanUrls: false,
  sitemap: { hostname: "https://docs.virtualairrescue.com" },

  head: [
    // Das alte var_logo.png war eine 4096x4096-Datei mit 420 KB -- eingesetzt
    // als 24-px-Menuelogo, als Favicon und als Startbild zugleich.
    ["link", { rel: "icon", type: "image/svg+xml", href: "/var-icon.svg" }],
    ["link", { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32.png" }],
    ["link", { rel: "apple-touch-icon", href: "/appicon-512.png" }],
    ["meta", { property: "og:image", content: "/var-lockup.svg" }],
    ["meta", { property: "og:type", content: "website" }],
    ["meta", { property: "og:site_name", content: "VAR Knowledgebase" }],
    ["meta", { name: "theme-color", content: "#00113A" }],
  ],

  themeConfig: {
    // App-Icon, nicht die Hauptfassung: im Menue ist das Zeichen 26 px hoch.
    logo: { src: "/var-icon.svg", width: 26, height: 26, alt: "Virtual Air Rescue" },

    search: {
      provider: "local",
      options: {
        // Deutsch schreibt sich auf zwei Arten. Ohne Angleichung findet
        // "Aussenlandung" die Seite "Außenlandung" nicht — und umgekehrt.
        // Beide Schreibweisen werden hier auf dieselbe Form gebracht.
        miniSearch: {
          options: {
            processTerm: (term: string) =>
              term
                .toLowerCase()
                .replace(/ß/g, "ss")
                .replace(/ä/g, "ae")
                .replace(/ö/g, "oe")
                .replace(/ü/g, "ue"),
          },
          searchOptions: {
            prefix: true,
            fuzzy: 0.2,
            boost: { title: 4, titles: 2, text: 1 },
          },
        },
        translations: {
          button: { buttonText: "Suchen", buttonAriaLabel: "Suchen" },
          modal: {
            displayDetails: "Treffer im Text anzeigen",
            resetButtonTitle: "Suche zurücksetzen",
            backButtonTitle: "Zurück",
            noResultsText: "Nichts gefunden zu",
            footer: {
              selectText: "öffnen",
              navigateText: "wechseln",
              closeText: "schließen",
            },
          },
        },
      },
    },

    lastUpdated: {
      text: "Letzte Änderung",
      formatOptions: {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      },
    },

    // Fehlte bisher: wer einen Tippfehler sieht, musste den Weg über
    // GitHub Desktop gehen. Ein Link genügt.
    editLink: {
      pattern:
        "https://github.com/VAR-Virtual-Air-Rescue/docs-v2/edit/staging/src/:path",
      text: "Diese Seite auf GitHub bearbeiten",
    },

    nav: [
      { text: "Start", link: "/" },
      {
        text: "Ich will …",
        items: [
          { text: "… fliegen", link: `${P}/how-to-pilot` },
          { text: "… disponieren", link: `${D}/how-to-disponent` },
          { text: "… mitschreiben", link: "/mitwirken" },
        ],
      },
      {
        text: "Nachschlagen",
        items: [
          { text: "Statusmeldungen", link: `${L}/bos-funk/Status` },
          { text: "Stichwortkatalog", link: `${D}/Stichworte` },
          { text: "Glossar", link: "/start/glossar" },
          { text: "Webleitstelle", link: `${S}/webleitstelle` },
        ],
      },
      { text: "FAQ", link: "/faq" },
    ],

    sidebar: [
      {
        // Offen, nicht zugeklappt: wer neu ist, soll hier etwas sehen.
        text: "Erste Schritte",
        collapsed: false,
        items: [
          { text: "Die ersten 30 Minuten", link: "/start/erste-30-minuten" },
          { text: "Was du brauchst", link: "/start/voraussetzungen" },
          { text: "Hub und Discord", link: `${S}/how-to-discord` },
          { text: "Glossar", link: "/start/glossar" },
          { text: "FAQ", link: "/faq" },
        ],
      },
      {
        text: "Pilotenbereich",
        collapsed: false,
        items: [
          { text: "How-To Pilot", link: `${P}/how-to-pilot` },
          { text: "Addons", link: `${P}/addons` },
          // Stand bisher in keinem Menü und war nur über die Suche zu finden.
          { text: "Hubschraubertypen", link: `${P}/Hubschraubertypen` },
          { text: "Steuerorgane", link: `${P}/Steuerorgane` },
          {
            text: "Flugbetrieb",
            collapsed: false,
            items: [
              { text: "Leistung und Schwebeflug", link: `${P}/flugbetrieb/leistung` },
              { text: "Masse und Schwerpunkt", link: `${P}/flugbetrieb/masse-und-schwerpunkt` },
              { text: "Wirbelringstadium", link: `${P}/flugbetrieb/wirbelringstadium` },
              { text: "Autorotation und H-V-Diagramm", link: `${P}/flugbetrieb/autorotation` },
              { text: "Rollover und Bodenresonanz", link: `${P}/flugbetrieb/rollover-und-resonanz` },
            ],
          },
          {
            text: "Prozeduren (SOP)",
            collapsed: true,
            items: [
              { text: "Über SOPs & dieses Kapitel", link: `${P}/procedures/sops` },
              { text: "H145 Checkliste", link: `${P}/procedures/H145_checklist` },
              { text: "Betankung bei laufendem Rotor", link: `${P}/procedures/hot-refuelling` },
            ],
          },
          {
            text: "Allgemeine Luftfahrt",
            collapsed: true,
            items: [
              { text: "Standardplatzrunde", link: `${P}/allgemeineluftfahrt/Standardplatzrunde` },
              { text: "Luftraumstruktur", link: `${P}/allgemeineluftfahrt/Luftraumstruktur` },
              { text: "Navigation", link: `${P}/allgemeineluftfahrt/Navigation` },
              { text: "Meteorologie", link: `${P}/allgemeineluftfahrt/Meteorologie` },
              // Fehlender Schrägstrich: der Link war relativ und löste je nach
              // aufgerufener Seite anders auf.
              { text: "Reichweite", link: `${P}/allgemeineluftfahrt/Endurance` },
              { text: "Sichtflugminima und HEMS", link: `${P}/allgemeineluftfahrt/sichtflugminima` },
            ],
          },
        ],
      },
      {
        text: "Disponentenbereich",
        collapsed: false,
        items: [
          { text: "How-To Disponent", link: `${D}/how-to-disponent` },
          { text: "Disposition", link: `${D}/disposition` },
          { text: "Stichworte", link: `${D}/Stichworte` },
          { text: "NACA-Score", link: `${D}/naca` },
          { text: "Zielklinik wählen", link: `${D}/zielklinik` },
          { text: "MANV und Großschadenslage", link: `${D}/manv` },
        ],
      },
      {
        text: "Luftrettung",
        collapsed: true,
        items: [
          {
            text: "BOS-Funk",
            collapsed: true,
            items: [
              { text: "Grundlagen", link: `${L}/bos-funk/Grundlagen` },
              { text: "Funkverkehr", link: `${L}/bos-funk/Funkverkehr` },
              { text: "OPTA", link: `${L}/bos-funk/OPTA` },
              { text: "Status", link: `${L}/bos-funk/Status` },
              { text: "Funkbeispiel", link: `${L}/bos-funk/Funkbeispiel` },
              { text: "BOS-Funk und Flugfunk", link: `${L}/bos-funk/flugfunk-und-bos` },
            ],
          },
          {
            text: "Crew",
            collapsed: true,
            items: [
              { text: "HEMS-TC", link: `${L}/crew/hems-tc` },
              { text: "Notarzt", link: `${L}/crew/notarzt` },
              { text: "Übergabe: ABCDE und ISBAR", link: `${L}/crew/uebergabe` },
            ],
          },
          { text: "Außenlandungen", link: `${L}/aussenlandung` },
          { text: "Landestellen", link: `${L}/landeplatz` },
          { text: "Windenbetrieb", link: `${L}/windenbetrieb` },
          { text: "Nachtflug und NVIS", link: `${L}/nachtflug-nvis` },
          { text: "Intensivtransport (ITH)", link: `${L}/intensivtransport` },
          { text: "Luftrettungszentren", link: `${L}/luftrettungszentren` },
          {
            text: "Militärluftrettung",
            collapsed: true,
            items: [
              { text: "Einführung", link: `${L}/military/Einführung` },
              { text: "SOP", link: `${L}/military/SOP` },
            ],
          },
        ],
      },
      {
        // Neu als eigener Bereich. Bisher hing die Schweiz unter "Luftrettung",
        // und für die übrigen fünf Länder gab es gar nichts — obwohl dort der
        // größte Teil der Einsätze läuft.
        text: "Region",
        collapsed: true,
        items: [
          { text: "Überblick", link: "/region/" },
          { text: "Deutschland", link: "/region/deutschland" },
          { text: "Österreich", link: "/region/oesterreich" },
          {
            text: "Schweiz",
            collapsed: true,
            items: [
              { text: "Organisation", link: `${L}/Schweiz/organisation-schweiz` },
              { text: "Operationsbetrieb", link: `${L}/Schweiz/operationsbetrieb-schweiz` },
              { text: "Spitallexikon", link: `${L}/Schweiz/spitallexikon-schweiz` },
            ],
          },
          { text: "Benelux", link: "/region/benelux" },
        ],
      },
      {
        text: "VAR-Systeme",
        collapsed: true,
        items: [
          { text: "Webleitstelle", link: `${S}/webleitstelle` },
          { text: "Pilotenansicht", link: `${S}/pilot` },
          { text: "Mobile App-Alarmierung", link: `${S}/app-alarmierung` },
          { text: "Flugpläne und Landeplätze", link: `${S}/FlugplanUndWegpunkte` },
          // Lag bisher nur im Kopfmenü — und dort auf einem Pfad, den es nicht
          // gibt (/allgemein/var-systeme/hub/…), also 404.
          { text: "Discord verknüpfen", link: `${S}/how-to-discord` },
          {
            text: "Random & Everywhere",
            collapsed: true,
            items: [
              { text: "Voraussetzungen", link: `${S}/hpg-h145/r-e-integration/Voraussetzungen` },
              { text: "Einrichtung", link: `${S}/hpg-h145/r-e-integration/Einrichtung` },
              { text: "Fehlerbehebung", link: `${S}/hpg-h145/r-e-integration/Fehlerbehebung` },
            ],
          },
        ],
      },
      {
        text: "Allgemein",
        collapsed: true,
        items: [
          {
            text: "VATSIM",
            collapsed: true,
            items: [
              { text: "Registrierung", link: `${A}/vatsim/registrierung` },
              { text: "Prefile", link: `${A}/vatsim/prefile` },
            ],
          },
          { text: "Live-Streaming", link: `${A}/streaming` },
          { text: "Das Team & Struktur", link: `${A}/team` },
        ],
      },
      {
        text: "Regeln und Mitarbeit",
        collapsed: true,
        items: [
          { text: "Mitwirken", link: "/mitwirken" },
          { text: "VAR FAIR PLAY", link: "/fair-play" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/VAR-Virtual-Air-Rescue/docs-v2" },
    ],

    docFooter: { prev: "Vorherige Seite", next: "Nächste Seite" },
    outline: { label: "Auf dieser Seite", level: [2, 3] },
    darkModeSwitchLabel: "Erscheinungsbild",
    lightModeSwitchTitle: "Zum hellen Erscheinungsbild wechseln",
    darkModeSwitchTitle: "Zum dunklen Erscheinungsbild wechseln",
    sidebarMenuLabel: "Inhalt",
    returnToTopLabel: "Nach oben",
    externalLinkIcon: true,

    footer: {
      // Der Link auf FAIR PLAY zeigte auf "/fair-play/" mit Schrägstrich und
      // lief damit auf jeder Seite ins Leere.
      message:
        '<a href="https://virtualairrescue.com/impressum/">Impressum</a> | ' +
        '<a href="https://virtualairrescue.com/datenschutz/">Datenschutzerklärung</a> | ' +
        '<a href="/fair-play">VAR FAIR PLAY</a>',
    },
  },

  markdown: {
    // Eigene Blöcke für Fachinhalte. Die Gestaltung dazu steht in custom.css.
    container: {
      tipLabel: "Hinweis",
      warningLabel: "Achtung",
      dangerLabel: "Gefahr",
      infoLabel: "Info",
      detailsLabel: "Mehr dazu",
    },
    theme: { light: "github-light", dark: "github-dark" },
    image: { lazyLoading: true },
    config: eigeneBloecke,
  },
});
