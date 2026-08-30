---
title: Luftrettungszentren
description: Alle Stationen der VAR auf einer Karte — Betreiber, Muster, Funkrufname und Merkmale wie Winde, Nachtflug und Rund-um-die-Uhr-Betrieb.
---

# Luftrettungszentren

Alle Stationen, die im Lagebild der Leitstelle hinterlegt sind. Zeiger auf einen
Punkt legen — oder mit der Tabulatortaste ansteuern — und die Angaben stehen da.
Ein Klick heftet die Karte fest.

<Stationskarte />

## Was die Karte zeigt

**Einsatzart** ist die Farbe der Punkte. Sie sagt, wofür die Station vorgesehen
ist:

| | Bedeutung |
|---|---|
| Primärrettung | Anflug zum Notfallort, das klassische RTH-Profil |
| Primär und Verlegung | beides, je nach Auftrag |
| Verlegung (ITH) | Transporte zwischen Kliniken — siehe [Intensivtransport](/luftrettung/intensivtransport) |

**Merkmale** stehen in der Kurzinfo und lassen sich als Filter benutzen:

- **24 h** — durchgehender Betrieb statt nur bei Tageslicht
- **Winde** — Rettungswinde an Bord, siehe [Windenbetrieb](/luftrettung/windenbetrieb)
- **Tau** — Festtau (Fixtau) für das schnelle Ein- und Ausbringen im Gebirge
- **NVG** — nachtflugfähig mit Bildverstärker, siehe
  [Nachtflug und NVIS](/luftrettung/nachtflug-nvis)

## Die Verteilung

Der Einsatzraum umfasst **sieben Länder**, mit deutlichem Schwerpunkt auf
Deutschland und Österreich. Die Zahlen unter der Karte kommen direkt aus den
Daten und werden beim Einlesen neu gerechnet — sie können also nicht vom Bestand
abweichen.

::: tip Belgien kommt nicht vor
Die [FAQ](/faq) nennt Belgien als Einsatzgebiet. Im Stationsbestand steht dort
keine einzige Station — dafür aber **Italien** (Pelikan 1–3 und Aiut Alpin in
Südtirol) und **Liechtenstein**. Eines von beidem sollte nachgezogen werden.
:::

## Woher die Daten kommen

Aus dem Lagebild der Leitstelle, Endpunkt `/api/stations`. Sie werden **beim
Bauen dieser Seite eingelesen**, nicht im Browser nachgeladen: Der Endpunkt
schickt kein `Access-Control-Allow-Origin`, ein Browser auf
docs.virtualairrescue.com dürfte ihn also gar nicht abfragen. Nebenwirkung: die
Karte ist sofort da und funktioniert auch, wenn die Leitstelle gerade klemmt.

Neu einlesen mit:

```bash
python scripts/karte-bauen.py --stand JJJJ-MM-TT
```

Die Länderumrisse stammen von [Natural Earth](https://www.naturalearthdata.com)
(gemeinfrei) und sind beim Erzeugen auf den Einsatzraum beschnitten und
vereinfacht worden — deshalb liegt im Repo kein 3-MB-GeoJSON.

::: pruefen Im Bestand aufgefallen
Beim Einlesen sind ein paar Dinge aufgefallen, die in der Leitstelle korrigiert
gehören — nicht hier:

- **Drei Einträge sind keine Stationen**: `NICHT NUTZEN ARA 3`, `Christoph Dev 1`
  und `Christoph Dev 2`. Sie stehen im öffentlichen Bestand und sind hier
  herausgefiltert.
- **`Ambulanz Hallingdal`** steht unter Land `DE`, liegt aber bei 60,63° N /
  8,57° O — das ist Norwegen, rund 700 km außerhalb des Einsatzraums. Ebenfalls
  herausgefiltert.
- **`D-H` steht bei 14 Stationen als Kennung** — offensichtlich ein Platzhalter,
  unter anderem bei Aiut Alpin, Medic 01, SAR 21 und vier Air-Glaciers-Standorten.
- **Doppelte Kennungen**: `HB-ZZM` bei Martin 3, 4 und 6; `LX-HMS` bei
  Air Rescue 2 und 3; dazu `OE-XVL`, `OE-XEY`, `OE-XCC` und `HB-ZRY` je zweimal.
  Manches davon ist plausibel — ein Luftfahrzeug für zwei Standorte —, dreifach
  eher nicht.
- **`Air Rescue 3`** ist Luxemburg zugeordnet, trägt als Region aber **Luzern**.
:::

## Was dieser Seite noch fehlt

Die Karte sagt, **wo** eine Station ist und **was** sie kann. Was sie nicht sagt,
ist das, wofür diese Seite ursprünglich gedacht war: die **Besonderheiten** der
einzelnen Standorte.

Also etwa: Anflugverfahren an schwierigen Landeplätzen, Eigenheiten des
Einsatzgebiets, typische Einsatzarten, Zusammenarbeit mit Bergrettung oder
Wasserrettung, oder was an einer Station schon einmal schiefgegangen ist.

Das lässt sich nicht aus einer Datenbank ziehen — das weiß nur, wer dort fliegt.
[Melde dich](/mitwirken), wenn du zu einer Station etwas beitragen kannst.

## Weiter

- [Region](/region/) — wie die Luftrettung je Land organisiert ist
- [Landestellen](/luftrettung/landeplatz)
- [Außenlandungen](/luftrettung/aussenlandung)
