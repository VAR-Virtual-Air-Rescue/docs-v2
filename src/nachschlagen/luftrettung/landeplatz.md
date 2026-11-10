---
title: Landeplätze und Landestellen
description: Hubschrauberlandeplatz, Landestelle im öffentlichen Interesse oder Außenlandung — was der Unterschied ist, wie Klinik-Landeplätze in ops angezeigt werden und wo du die Daten für den Simulator bekommst.
---

# Landeplätze und Landestellen

Ein Hubschrauber braucht keine Start- und Landebahn. Er kann direkt an der
Einsatzstelle landen. Trotzdem ist ein fester Landeplatz fast immer die
sicherere Wahl: Dort sind Hindernisse bekannt, der Wind wird angezeigt, Verkehr
und Schaulustige sind ferngehalten, und oft ist der Brandschutz gesichert.

## Die drei Arten

| Art | Was es ist | Wo du sie findest |
|---|---|---|
| **Hubschrauberlandeplatz** | genehmigter Flugplatz für Hubschrauber, z. B. an großen Kliniken | AIP VFR, HEL AD |
| **Landestelle im öffentlichen Interesse (PIS)** | vom Luftfahrt-Bundesamt geprüfte Landestelle, wo ein Flugplatz nicht möglich oder sinnvoll ist | PIS-Masterliste des LBA |
| **Außenlandung** | Landung im Gelände ohne vorbereiteten Platz, meist an der Einsatzstelle | — |

Wie eine Außenlandung sicher abläuft, steht unter
[Außenlandung](/luftrettung/aussenlandung).

::: details Rechtlicher Hintergrund (Deutschland)
Hubschrauberlandeplätze müssen die Anforderungen der
[Allgemeinen Verwaltungsvorschrift zur Genehmigung der Anlage und des Betriebs von Hubschrauberflugplätzen](https://www.verwaltungsvorschriften-im-internet.de/bsvwvbund_19122005_LR116116413.htm)
erfüllen. Sie legt unter anderem fest, wie groß ein Landeplatz sein muss.

Wo ein solcher Flugplatz nicht möglich ist, gibt es Landestellen nach den
Mindestanforderungen aus
[Anlage 3 der Luftverkehrsordnung](https://www.gesetze-im-internet.de/luftvo_2015/anlage_3.html).
Diese **Landestellen im öffentlichen Interesse** (*Public Interest Site*, PIS)
prüft und zertifiziert das Luftfahrt-Bundesamt einzeln.

Manche Landestellen sind nur für Landungen nach
[§ 25 Absatz 2 Nummer 3 LuftVG](https://www.gesetze-im-internet.de/luftvg/__25.html)
zugelassen, also nur, wenn „die Landung aus Gründen der Sicherheit oder zur
Hilfeleistung bei einer Gefahr für Leib oder Leben einer Person erforderlich
ist“.
:::

## Landeplätze an Kliniken

Für die [Zielklinik](/disponentenbereich/zielklinik) zählt, wie der Patient ins
Haus kommt. Im Klinik-Popup von ops steht deshalb beim Eintrag **H**, welchen
Landeplatz die Klinik hat:

| Angabe | Bedeutung |
|---|---|
| **Dachlandeplatz** | auf dem Dach, kurzer Weg in den Schockraum |
| **Bodenlandeplatz** | auf dem Klinikgelände |
| **Landeplatz in der Nähe** | außerhalb des Geländes, die Übergabe braucht einen Bodentransport |
| **kein Landeplatz** | Landung nur abseits, mit bodengebundener Übergabe |

Dazu steht dort, ob der Landeplatz **nachtflugtauglich** ist oder **nur
tagsüber** angeflogen werden kann, und gegebenenfalls seine Kennung.

Auf der Karte erkennst du Kliniken mit Landeplatz am **grünen Punkt** am
Kliniksymbol. Setzt die Leitstelle dir eine Zielklinik, führt die Route auf
deiner Karte direkt zu deren Landeplatz.

::: tip Falsche Angaben melden
Stimmt der Landeplatz einer Klinik nicht, etwa Lage, Art oder Kennung, meldest du
es im Klinik-Popup über den Reiter **Klinikdaten melden**.
:::

## Landeplätze in ops

- Die Kartenebene **Heliports** zeigt die meisten Landeplätze mit ihren
  Kennungen.
- Das **Flugbuch** erkennt Start und Landung an Kliniken, Landeplätzen und
  Flughäfen automatisch und trägt sie als Start- und Zielort ein.

## Quellen und Karten

### Anflug- und Lagekarten

Die Karten der Hubschrauberlandeplätze in Deutschland findest du in der
[AIP VFR Deutschland](https://aip.dfs.de/BasicVFR/) der DFS unter **HEL AD
Hubschrauberlandeplätze**.

### PIS-Masterliste

Die [Liste der Landestellen im öffentlichen Interesse](https://www.lba.de/SharedDocs/Downloads/DE/B/B2_Flugbetrieb/PIS/PIS_Masterliste.pdf?__blob=publicationFile&v=18)
gibt das Luftfahrt-Bundesamt heraus. Die Einträge sind farbig markiert:

| Farbe | Bedeutung |
|---|---|
| Grün | entspricht den Anforderungen, freigegeben |
| Gelb | wird gerade angepasst, Nutzung höchstens eingeschränkt |
| Rot | entspricht den Anforderungen, aber noch nicht freigegeben |

### Karte aller Landeplätze in Deutschland

::: details Karte öffnen
<iframe src="https://www.google.com/maps/d/embed?mid=13kR56v4fHbzfOSVXG1WrH25yEk-w2MU&ehbc=2E312F" width="100%" height="800"></iframe>
:::

## Im Flugsimulator

Für dein Navigationsgerät stellen wir eine **Wegpunktdatenbank** mit den meisten
Landeplätzen in Deutschland, Österreich und der Schweiz bereit. Du findest sie im
HUB unter **Downloads / Links > Wegpunktdatenbank**. Dort filterst du die
Landeplätze und exportierst sie, zum Beispiel für LittleNavMap. Die Datenbank
enthält nur Lage und Kennung, **keine Szenerien**.

Wie Export und Import funktionieren, steht unter
[Flugpläne und Landeplätze](/var-systeme/FlugplanUndWegpunkte).

| Land | Quelle der Daten |
|---|---|
| Deutschland | [AIP VFR](https://aip.dfs.de/BasicVFR) der DFS und PIS-Masterliste des LBA |
| Österreich | [Geodatenportal](https://www.austrocontrol.at/piloten/vor_dem_flug/aim_services/geodatenportal) der Austro Control |
| Schweiz | [Sachplan Verkehr, Teil Infrastruktur Luftfahrt (SIL)](https://inspire-geoportal.ec.europa.eu/srv/api/records/ae5fa63c-c153-496a-b8a6-c896126398b1?language=ger) des BAZL |
