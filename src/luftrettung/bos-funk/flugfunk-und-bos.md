---
title: BOS-Funk und Flugfunk
description: Zwei Funkkreise, zwei Sprachen, zwei Zwecke — der häufigste Denkfehler bei Neuen, und wie man beide gleichzeitig bedient.
---

# BOS-Funk und Flugfunk

Ein Rettungshubschrauber hängt an **zwei** Funkkreisen, die nichts miteinander zu
tun haben. Wer sie verwechselt, redet mit den Falschen — und im Zweifel hört
niemand zu.

## Der Unterschied

| | BOS-Funk | Flugfunk |
|---|---|---|
| Mit wem | Leitstelle, andere Rettungsmittel, Feuerwehr | Flugverkehrskontrolle, andere Luftfahrzeuge |
| Worüber | Einsatz, Status, Patient, Transportziel | Luftraum, Freigaben, Verkehr, Wetter |
| Sprache | Deutsch, BOS-Phraseologie | ICAO-Phraseologie, Deutsch oder Englisch |
| Kennung | [OPTA](/luftrettung/bos-funk/OPTA), z. B. „Christoph 51“ | Luftfahrzeugkennzeichen oder Rufzeichen |
| Statusmeldungen | ja, [Statusziffern](/luftrettung/bos-funk/Status) | nein |
| Zuständig | Leitstelle | Flugsicherung |

**Die Leitstelle erteilt keine Freigaben.** Sie kann einen Einsatz vergeben, aber
sie kann nicht den Einflug in einen kontrollierten Luftraum genehmigen. Das kann
nur die Flugsicherung.

**Die Flugsicherung interessiert sich nicht für den Status.** Ein „Status 3“ auf
der Turmfrequenz bedeutet dort nichts.

## Der typische Denkfehler

> „Ich bin alarmiert, ich habe Sonderrechte, ich fliege einfach.“

Ein Einsatz ändert nichts daran, dass Luftraum Luftraum bleibt. Was er ändert,
ist die **Bereitschaft der Flugsicherung**, schnell und unbürokratisch zu
helfen — wenn man sie fragt. Die Formulierung, die das transportiert, gehört auf
die **Flugfunkfrequenz**, nicht in die Rufgruppe.

::: funk Auf der Flugfunkfrequenz
„Tower, D-HXYZ, Rettungshubschrauber im Einsatz, erbitte Durchflug der
Kontrollzone von Süden nach Norden, 1 500 Fuß.“
:::

::: funk Gleichzeitig, in der Rufgruppe
„Leitstelle von Christoph 51 — Status 3, Anflug Einsatzstelle, Landung in etwa
sechs Minuten.“
:::

Zwei Sätze, zwei Empfänger, keine Überschneidung.

## Wer was bedient

In der Regel liegt der **Flugfunk beim Piloten** und der **BOS-Funk beim
[HEMS-TC](/luftrettung/crew/hems-tc)**. Das ist keine Formalität: Der Pilot soll
sich auf den Luftraum konzentrieren, während im Hintergrund die Einsatzabwicklung
läuft.

Im Einpilotenbetrieb ohne TC muss der Pilot beides bedienen. Dann gilt die
Reihenfolge **fliegen, navigieren, funken** — und von den beiden Funkkreisen hat
der Flugfunk Vorrang, weil dort die Sicherheit hängt.

## Wann welcher Kreis dran ist

::: sop Faustregel
**Alles, was mit dem Fliegen zu tun hat**, geht an die Flugsicherung:
Freigaben, Steig- und Sinkflug, Verkehr, Wetter, Notlagen des Luftfahrzeugs.

**Alles, was mit dem Einsatz zu tun hat**, geht an die Leitstelle: Status,
Lagemeldung, Transportziel, Nachforderung.
:::

## Notmeldungen

Für Notlagen gibt es im Flugfunk eigene Meldungen — **MAYDAY** für Notfälle,
**PAN PAN** für Dringlichkeitslagen. Sie gehen an die Flugsicherung, nicht an die
Leitstelle.

Umgekehrt hat der BOS-Funk mit **Status 0** eine eigene Stufe für den
vorrangigen Sprechwunsch. Der Vollständigkeit halber: Das ist kein Notruf für
das Luftfahrzeug, sondern die Bitte, vor allen anderen mit der Leitstelle reden
zu dürfen.
→ [Status](/luftrettung/bos-funk/Status)

::: pruefen Was im VAR-Betrieb gilt
Wie der Flugfunk abgebildet wird, wenn nicht auf VATSIM geflogen wird — heute
existiert dort schlicht keine Gegenstelle. Ob dann eine Freigabe angenommen wird,
ob sie mitgesprochen wird oder ob der Punkt entfällt, ist nicht festgelegt.

Auf VATSIM gilt zusätzlich: die VAR ist **noch keine offizielle vSOA**, und
`COM/VIRTUALAIRRESCUE.COM` gehört in den Flugplan.
→ [Registrierung](/allgemein/vatsim/registrierung) · [Prefile](/allgemein/vatsim/prefile)
:::

## Weiter

- [Grundlagen](/luftrettung/bos-funk/Grundlagen)
- [Funkverkehr](/luftrettung/bos-funk/Funkverkehr)
- [Funkbeispiel](/luftrettung/bos-funk/Funkbeispiel)
- [Luftraumstruktur](/pilotenbereich/allgemeineluftfahrt/Luftraumstruktur)
