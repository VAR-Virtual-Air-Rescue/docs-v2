# Flugpläne und Nutzerwegpunkte
Die VAR unterstützt jetzt auch eine direkte Einsatznavigation durch den [Client](Desktopclient).
Bei Erhalt eines neuen Einsatzen, wird automatisch eine entsprechende Datei ins richtige Verzeichnis importiert, sodass diese mit gängigen Navigationsgeräten geladen werden kann.
Um die Funktion, bei einem Einsatz automatisch zum aktuellen Einsatz zu navigieren, nutzen zu können, findest du hier entsprechende Anleitungen.
## Flugpläne
Um bei der Alarmierung automatisch zum Einsatzort navigiert zu werden, musst du im Client folgende Einstellungen vornehmen:
1. MSFS: Keine Einstellungen notwendig
2. X-Plane: Eintragen des Ordnerpfades, in dem sich X-Plane selbst befindet. Sollte es Fehler beim Importieren von .fms-Daten geben, kannst du deinen AIRAC angeben, das ist aber optional und sollte automatisch gefunden (aber nicht angezeigt) werden.
Nach der Alarmierung wird dann eine Flugplan-Datei erstellt, die folgendermaßen aufgerufen werden kann:
#### X-Plane Standard - Garmin GNS-430
1. Aufrufen der ACTIVE FLIGHT PLAN Seite über den Button <code>FPL</code>.
2. Aufrufen der FLIGHT PLAN CATALOG Seite über drehen des kleinen Rades.
3. Auswahl mit <code>PUSH CRSR</code> aktivieren, den Flugplan **VAR.fms** mit dem großen Rad auswählen und mit <code>ENT</code> bestätigen.
4. Gegebenenfalls mit <code>FPL</code>, <code>PUSH CRSR</code>, auswählen von **EMER**, klicken von <code>Đ</code> und <code>ENT</code> direkt zum Wegpunkt fliegen.
#### X-Plane RealityXP GTN 750 bzw. MSFS TDS GTNXi
1. Auswählen von <code>Flight Plan</code> im GTN-Hauptmenü.
2. Danach <code>Menu</code>, zum Aufrufen des Flight Plan-Menüs.
3. <code>Catalog</code> öffnet alle geladenen Flugpläne, über <code>Menu</code> und <code>Import</code> kann dann der Flugplan **VAR.gfp** geladen werden.
4. Mit <code>Activate</code> kann der Flugplan dann aktiviert werden.
#### MSFS PMS50 GTN (Premium-Version erforderlich)
1. Auswählen von <code>Flight Plan</code> im GTN-Hauptmenü.
2. Danach <code>Menu</code>, zum Aufrufen des Flight Plan-Menüs.
3. Durch Klicken von <code>Import</code> und <code>Import from File</code> den Flugplan laden.
4. Nach Auswahl von <code>OK</code> kann der Import kurz dauern.
## Nutzerwegpunkte
:::danger Hinweis
Die Funktion des Exports von Wegpunkten über den angegeben Link ist zur Zeit <b>nicht verfügbar</b>.
:::
#### Datenbank anzeigen
Zum Anzeigen dieser Datenbank navigiert ihr in der Webleitstelle zu **Einstellungen > Download** und klickt dann auf den entsprechenden Link.
Alternativ findet ihr [hier](https://lst.virtualairrescue.com/resources/heliport) schnell dort hin.
Angezeigt wird die Gesamtheit aller verfügbaren Daten in Seiten zu je 100 Landeplätzen.
#### Filter
Da ein Export aller Daten zur selben Zeit nicht immer sinnvoll ist, könnt ihr die zu exportierenden Landeplätze filtern.
Dazu gibt es in jeder Spaltenüberschrift ein Drei-Punkt-Menü, in welchem durch Klicken der Schaltfläche "Filter" die entsprechende Spalte gefiltert werden kann.
#### Export
Alle zu exportierenden Helipads können mit der obersten Checkbox ("Alle auswählen") ausgewählt werden; alternativ ist auch eine selektivere Auswahl durch anklicken der individuellen Reihen möglich.
Sobald eine Auswahl getroffen wurde, unterscheidet sich der Ablauf nach dem gewünschten Import-Format:
<details>
<summary><b>LittleNavMap</b></summary>

1. Anklicken der Schaltfläche **„Export für LittleNavMap“**
2. An beliebiger Stelle speichern
3. In LittleNavMap: Nutzerpunkte → Importiere CSV → Datei wählen
4. Fertig

</details>

<details>
<summary><b>Reality XP GTN 750</b></summary>

1. Anklicken der Schaltfläche **„Export für RealityXP/TDS“**
2. Speichern unter  
   `C:\ProgramData\Garmin\Trainers\GTN\FPLN`
3. Im Simulator: Waypoint Info → Import Waypoints → OK
4. Fertig

[Schritte im Manual nachlesen](https://reality-xp.com/support/trainingcenter/userguides/manuals/Reality%20XP%20GTN%20Touch%20XPlane.pdf#page=9)

</details>

<details>
<summary><b>TDS GTNXi Pro</b></summary>

1. Anklicken der Schaltfläche **„Export für RealityXP/TDS“**
2. Speichern unter  
   `C:\ProgramData\TDS\GTNXi`
3. Im Simulator: Waypoint Info → Import Waypoints → OK
4. Fertig

[Schritte im Manual nachlesen](https://tdssim.com/Downloads/Manuals/TDSGTNXiFlightSimManual.pdf#page=26)

</details>

<details>
<summary><b>PMS50 GTN 750</b></summary>

**Hinweis:**  
Import nur mit Premium-Version möglich.

1. Anklicken der Schaltfläche **„Export für PMS50“**  
   (max. 100 Wegpunkte pro Bank)
2. Speichern unter  
   `...\Community\pms50-gtn750\waypoints\gtn750`
3. Im Simulator: Waypoint Info → Import Waypoints → OK
4. Fertig

[Schritte im Manual nachlesen](https://pms50.com/fs2020/gtn750/documentation.pdf#page=49)

</details>

Das Importieren sollte normalerweise ohne einen Neustart des Simulators funktionieren. Lest bei Problemen erst im Manual nach und meldet euch bei gravierenden Fehlern beim Admin-Team.
#### Navigation
In der Regel reicht hier ein klick auf den <code>Direct-To-Button</code> mit Eingabe des Designators, der im [Tracker](https://ops.virtualairrescue.com/tracker) angezeigt wird.
