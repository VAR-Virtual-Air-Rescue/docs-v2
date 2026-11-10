---
title: Jet-Ansicht
description: Organtransporte und Ambulanzflüge mit Ambulanz-Jets — Planung, Aufträge, Legs, Bodentransport, Rufzeichen und Co-Pilot.
---

# Jet-Ansicht

Ambulanz-Jets fliegen bei uns **Organtransporte** und **Ambulanzflüge**. Sie
haben eine eigene Ansicht, die [Jet-Seite](https://ops.virtualairrescue.com/jet).
Die [Pilotenansicht](/var-systeme/pilot) bietet nur Hubschrauber an.

Die Jet-Ansicht funktioniert anders als die Pilotenansicht:

| | Hubschrauber | Jet |
|---|---|---|
| Ansicht | Pilotenansicht | Jet-Seite |
| Funk | BOS-Funk mit der Leitstelle | kein Funk |
| Einsätze | von der Leitstelle oder vom Auto-Dispatch | Auftrag selbst wählen oder von der Leitstelle zugewiesen |
| Ablauf | ein Einsatz | Kette aus mehreren Abschnitten (Legs) |
| Verbinden | vor dem ersten Einsatz | erst zum Fliegen, geplant wird vorher |

Voraussetzungen sind dieselben wie beim Hubschrauber: Pilotenberechtigung,
verknüpfter Discord-Account und bestätigte Pflicht-NOTAMs.

## Flugzeug und Standort wählen

Ganz oben wählst du unter **Flugzeug und Standort**:

- **Flugzeug:** die Jet-Station mit Betreiber, Muster, Kennzeichen und
  Heimatflughafen.
- **Muster im Simulator:** das Flugzeug, das du tatsächlich fliegst. „Wie
  Station“ übernimmt das Muster der Station.
- **Standort (Startflughafen):** wo dein Flugzeug gerade steht.

Die Auswahl merkt sich dein Browser. Für die Planung musst du **nicht verbunden**
sein.

## Auftrag suchen

Unter **Auftrag suchen** erzeugt **Vorschläge laden** sechs Vorschläge vom
Auto-Dispatch. **Neue Vorschläge** würfelt neu. Unter **Einstellungen ändern**
legst du fest:

- **Dauer** von–bis,
- ob die Dauer für die ganze Kette oder nur für den Transportflug gilt,
- ob die Kette **ab deinem Standort** oder **ab dem Abholflughafen** beginnt,
- ob ein **Rückflug** dazugehört.

Jeder Vorschlag zeigt Art, Kliniken, Flughäfen, Strecke und Dauer. Die Legs des
gewählten Vorschlags erscheinen auf der Karte. Nimmst du einen an, ist es dein
**Auftrag**. Du kannst immer nur einen offenen Auftrag haben.

### Organtransport und Ambulanzflug

- **Organtransport:** Ein Spenderorgan muss von der Spenderklinik zum
  Transplantationszentrum. Spender liegen in den Ländern von FOEDUS und
  Eurotransplant. Jedes Organ hat eine **Frist (Ischämiezeit)**, die mit der
  Entnahme beginnt.
- **Ambulanzflug:** Ein Patient wird aus dem Ausland, meist aus einem
  Urlaubsland, in eine Klinik nach Hause geflogen.

### Eigene Route

Unter **Eigene Route zusammenstellen** wählst du Abhol- und Zielflughafen, Art
und gegebenenfalls das Organ selbst, auch weit weg von deinem Standort. Das
System sucht an beiden Flughäfen die nächste passende Klinik und rechnet die
Kette. Passt etwas nicht, bekommst du einen Hinweis, entscheiden musst du
selbst.

Liegt der Flughafen im Ausland, kann die Kliniksuche etwas dauern. Bis eine
Klinik gefunden ist, steht dort „Klinik wird gesucht …“, und der
Bodentransport ist so lange gesperrt.

## Der Auftrag: Legs

Ein Auftrag besteht aus mehreren **Legs**, die nacheinander ablaufen:

| Leg | Wer | Was |
|---|---|---|
| Positionierung | du | Flug von deinem Standort zum Abholflughafen |
| Zubringer | Bodentransport | Patient bzw. Organ von der Startklinik zum Flughafen |
| Transport | du | Flug vom Abhol- zum Zielflughafen |
| Zustellung | Bodentransport | vom Zielflughafen zur Zielklinik |
| Rückflug | du | optional zurück zur Basis |

Das jeweils nächste Leg steht unter **Als Nächstes**. Zu jedem Flug-Leg gibt es
einen **SimBrief-Link** mit Flughäfen, Rufzeichen und Muster. Szenerien für die
Flughäfen musst du selbst besorgen.

### Flüge werden automatisch erkannt

Off-Block, Start, Landung und On-Block erkennt das System aus den Daten deines
Simulators. Du musst nichts von Hand melden. Ein Leg ist erledigt, sobald du am
Zielflughafen landest. Landest du woanders, wird das als Ausweichlandung
protokolliert. Bei einem Durchstart wird das Erledigt zurückgenommen.

Startest du direkt am Abholflughafen, wird die Positionierung übersprungen.
Kommen keine Positionsdaten an, kannst du die Ereignisse von Hand auslösen.

### Bodentransport und Frist

Zubringer und Zustellung fährt standardmäßig ein **simulierter
Bodentransport**. Der Zubringer startet erst, wenn du verbunden bist und

- auf **Transport vorbereiten** drückst,
- die Positionierung überspringst oder
- die Positionierung fliegst.

Ab dann läuft beim Organtransport die **Frist**. Wird sie überschritten, wird
das protokolliert, aber nicht bestraft.

Die Leitstelle kann für Zubringer oder Zustellung stattdessen einen
**Rettungshubschrauber** einsetzen. Der Hubschrauberpilot bekommt dafür einen
eigenen Einsatz. Nimmt er nicht innerhalb von fünf Minuten an, übernimmt wieder
der Bodentransport.

### Abbrechen und zurückgeben

Brauchst du ein Leg nicht, kannst du es **überspringen**. Willst du den Auftrag
nicht fliegen, gibst du ihn **zurück**. Ein angenommener Auftrag bleibt sieben
Tage reserviert, danach verfällt er.

## Rufzeichen

Jedes Flug-Leg bekommt sein **eigenes ATC-Rufzeichen**, zum Beispiel `DRF001`
für die Positionierung und `DRF002` für den Transport. Die Nummer zählt pro
Flugzeugmuster fortlaufend weiter. Ein Leg bekommt sein Rufzeichen erst, wenn es
an der Reihe ist. Übersprungene Legs verbrauchen keine Nummer. Manche Stationen
haben auch ein festes Rufzeichen.

Das aktuelle Rufzeichen steht oben auf der Jet-Seite, darunter klein die
ausgesprochene Form. Es steht auch im SimBrief-Link und im Flugbuch. Dein
Discord-Name lautet während des Auftrags `Name • Rufzeichen`.

## Co-Pilot

Bei jedem offenen Flug-Leg kannst du unter **Co-Pilot (VAR-Nummer, optional)**
einen Kollegen eintragen. Er bekommt eine Benachrichtigung und sieht oben auf
seiner Jet-Seite die Karte **Als Co-Pilot eingeladen**. Dort sieht er den
Auftrag als Vorschau und kann annehmen oder ablehnen.

Nach dem Annehmen ist es ein **gemeinsamer Auftrag**. Der Flug zählt im Flugbuch
für beide, bearbeiten kann ihn aber nur der Pilot. Als Co-Pilot kannst du
jederzeit aussteigen, der Pilot behält den Auftrag.

## Aufträge von der Leitstelle

Disponenten können Jet-Aufträge auch selbst anlegen und dir zuweisen. Du
bekommst dann eine Benachrichtigung mit Ton, und der Auftrag erscheint auf
deiner Jet-Seite wie ein selbst gewählter. Wie das in der Leitstelle aussieht,
steht unter [Webleitstelle](/var-systeme/webleitstelle#auftrage-fur-ambulanz-jets).

## Verbindung

Weil Jets keinen Funk haben, hält nichts den Browser-Tab wach. Friert der Tab im
Hintergrund ein, bleibt deine Sitzung trotzdem offen, **solange der VAR Desktop
Client Simulatordaten liefert**. Kommst du zurück, geht es ohne neues Verbinden
weiter. Trennst du dich bewusst, endet die Sitzung sofort.

Ohne Verbindung fragt die Jet-Seite den Stand deines Auftrags alle 30 Sekunden
ab.

## Buchung

Jet-Stationen kannst du im HUB buchen wie Hubschrauber-Stationen. Wähle beim
Buchen die Art **Ambulanz-Jet**.
