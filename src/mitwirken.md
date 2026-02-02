# Mitwirken

Unsere Docs-Page erweitert sich ständig und lebt von Beiträgen aus der Community. Damit Du in Zukunft deine eigenen Artikel verfassen oder andere korrigieren bzw. erweitern kannst, gibt es hier einen kleinen Leitfaden.

<a href="https://github.com/VAR-Virtual-Air-Rescue/">
  Hier kommst du schnell zu unserem GitHub Projekt.
</a>

## Vorab

Die folgenden Ausführungen wirken mitunter sehr komplex und für Laien sehr umfangreich. Wir empfehlen: konzentriert dranbleiben. Nach der ersten Einrichtung ist die Bearbeitung und Erstellung von Artikeln **sehr** einfach.

Wir freuen uns, wenn du dranbleibst. Per Ticket steht dir das DEVDEP für Nachfragen zur Verfügung!

## Technische Vorbereitung

Erstelle dir über diesen [Link](https://github.com/join) einen GitHub Account und sende uns deinen Nutzernamen. Erkläre uns kurz, was du dir vorstellst, was du vorhast und ob du ggf. Hilfe benötigst. Dann fügen wir dich zu unserem GitHub Projekt hinzu.

Hast du dir deinen Account erfolgreich erstellt, musst du ein paar Programme und Tools installieren, damit du loslegen kannst.

:::info Folgende Software setzen wir voraus:

<details>
<summary>Visual Studio Code</summary>
  Du kannst dir Visual Studio Code (kurz <b>VSC</b>) im Microsoft Store oder
  einfach
  <a href="https://code.visualstudio.com/download" target="_blank">
    hier
  </a>
  herunterladen.
</details>

<details>
<summary>Node.js</summary>
  Node.js findest du
  <a href="https://nodejs.org/en/download/prebuilt-installer" target="_blank">
    hier</a>. Die <b>LTS</b> Option reicht für unseren Zweck aus - die entsprechenden
  Installer findest du darunter.
</details>

<details>
<summary>GitHub Desktop</summary>
  Um deine Änderungen zu veröffentlichen benötigst du
  <a href="https://desktop.github.com/" target="_blank">
    <b>GitHub Desktop</b>
  </a>
</details>

<details>
<summary>Git SCM</summary>
  Damit <b>VSC</b> richtig funktioniert, musst du dir noch <a href="https://git-scm.com/downloads" target="_blank"> <b>Git SCM</b> </a>
  herunterladen.
</details>
:::

:::danger Achtung
Wir übernehmen keine Verantwortung für die Ergebnisse deiner Downloads und können nicht dauerhaft garantieren, dass die angegebenen Links erreichbar sind.
Du bist immernoch selbst für die Programme auf deinem PC (und vor allem wo und wie du sie installierst) verantwortlich.
:::

<details>
  <summary>Solltest du noch nichts von GitHub, Repositorys, Push- und Pull-Requests verstehen, lies diesen kleinen Guide hier durch:</summary>
  Das Git-Konzept basiert auf einer lokalen Kopie eines Projekts auf deinem PC.
  Dem sogenannten <b>Clone</b>. Das Projekt ist also "Open Source" - jeder hat Zugriff auf alle Daten.

Du bearbeitest an deinem PC diese lokal erstellte Kopie und veröffentlichst deine Änderungen, das nennt sich <b>Commit</b>.
Ein Commit ist eine Art Speicherpunkt, an welchem alle deine veränderten Daten hochgeladen werden; du kannst in deinem Commit auch kurz angeben, was du warum verändert hast.

Außerdem gibt es in GitHub Desktop die Aktion <b>Pull</b>. Das bedeutet, dass alle Änderungen, die vor oder während deiner Bearbeitung getätigt wurden, über deine lokale Kopie überschrieben werden, um immer up-to-date zu sein.

Mehrere Commits können zusammengeführt ("<b>gemerged</b>") werden.

Um zu verhindern, dass jeder direkt auf die "Live-Website" zugreift, gibt es zwei <b>Branches</b> im Docs <b>Repository</b>.

Um unsere Arbeit optimal kategorisieren zu können, gibt es im VAR-Projekt viele unterschiedliche Repositorys. Sie sind quasi "Ablagen" für verschiedene Projektteile. Bspw. unser Branding-Repository mit allen Daten rund um Logos und Schriftzüge.
Das Repository, in dem du unterwegs sein wirst, ist das Docs-Repository. Hier findest du alles, was die Docs-Seiten angeht.

Im Docs-Repository haben wir zwei der erwähnten Branches. Sie sind übersetzt die "Zweige" des Repositorys.
Der Development-Branch ist das, was von allen bearbeitet werden kann. Hier kann man sich austoben, ohne Auswirkungen auf die Website befürchten zu müssen.
Der Main-Branch spiegelt den aktuellen Stand der Website wieder. Darum darf an ihm nicht gearbeitet werden.

Du kannst dir vorstellen, dass zu Beginn Development- und Main-Branch identisch waren. Der Developemnt-Branch wird durch die Beitrage (=Commits) von Zeit zu Zeit verändert. Sind genug relevante Bearbeitungen zusammengekommen und überprüft, wird der Development-Branch mit dem Main-Branch verbunden - alle neuen Dateien werden auf dem Main-Branch gespeichert und werden veröffentlicht. Dann sind beide wieder identisch.
Das machst aber nicht du, keine Sorge ;)

Fazit: Übung macht den Meister. Nach einiger Zeit ergibt sich das Meiste von ganz allein und die Fachbegriffe gehen in Fleisch und Blut über.

  <div>
  </div>
</details>

## Workflow

### Grundlegende Einrichtung

Öffne **GitHub Desktop** und kopiere (="Clone") unten das Repository (="Projekt") "docs".

Wähle dann oben unter **Current branch** den Punkt **Development** aus und klicke auf **Fetch Origin**. Der letzte Schritt ist besonders wichtig, da deine lokale Kopie dann auf Neuerungen geprüfut wird.

:::danger Achtung
Bitte prüfe vor jeder Bearbeitung, dass du wirklich den **Staging**-Branch ausgewählt hast!
:::



Klicke oben unter **Repository** auf **Open in Visual Studio Code** oder nutze die nebenstehende Tastenkombination.

Jetzt öffnet sich **VSC** und **GitHub Desktop** kann erst einmal vernachlässigt werden.

In **VSC** klickst du oben unter **Terminal** auf **New Terminal**. In der unteren Hälfte öffnet sich nun ein neues Terminal.
Im Terminal gibst du jetzt `npm i` und nach dem Ladevorgang `npm start` ein.


Dann sollte sich dein Browser öffnen. Er stellt die lokale Kopie der Docs Website in deinem Browser dar, sodass du in VSC schreiben und parallel mitverfolgen kannst, wie deine Änderungen auf der Website aussehen würden.

Jetzt kannst du mit der Bearbeitung beginnen.

Diese Schritte (außer der Erste) müssen nach jedem Neustart von VSC bzw. GitHub Dekstop wiederholt werden.

### Dokumente..

Um unsere Dokumente anschaulich zu machen, nutzen wir verschiedene optische Elemente.

Wie diese erstellt werden, wie man _kursiv_, **fett** oder **_kursett_** bzw. **_fettsiv_** (?) schreiben kann, erfährst du am besten über die <a href="https://docusaurus.io/docs/markdown-features" target="_blank">Docusaurs Website</a>.

:::tip Kleiner Tipp
Am besten schaust du dir auf unseren Docs-Pages Elemente an, die es bereits gibt und siehst in **VSC** nach, wie sie gestaltet wurden.
:::

Wie du auf die Dokumente zugreifst, sie bearbeitest, erstellst oder löschst erfährst du hier:

#### .. aufrufen

Links am Rand siehst du den **Explorer**. Hier kannst du über den Unterpunkt "docs" alle bestehenden Dokumente aufrufen. Jedes Dokument ist eine .md ("Markdown Documentation") Datei - sie basiert also auf Markdown. Wie oben erwähnt, gestaltest du unsere Docs also mit Markdown-Syntax. Wählst du eine Datei aus, wird sie im Code-Editor geöffnet und kann bearbeitet werden. Mehr dazu weiter unten.

Sieh dir erst ein paar Dokumente an und vergleiche das Endprodukt auf der Website mit dem Code in VSC. Beachte dabei, dass noch nicht alle Änderungen, die du siehst, übernommen und "live" sein müssen.

#### .. erstellen

Um ein Dokument zu erstellen klickst du neben "**DOCS**" ganz oben im Explorer auf "**New File**". Gib deiner Datei einen passenden Namen (ein Wort) und füge **unbedingt** die Endung .md an.

:::info
Die Datei für dieses Dokument heißt übrigens "mitwirken.md".
:::

Mit einem `#` fügst du deine erste Überschrift und gleichzeitig die Überschrift für deine Datei ein. Jetzt kannst du mit dem Schreiben loslegen.

#### .. bearbeiten

Zum Bearbeiten einer Datei wählst du sie aus und bearbeitest den Text im Editor.
Deine Bearbeitungen werden im Verlauf der Veröffentlichung sichtbar sein - die Vorher/Nachher Versionen werden von authorisierten Personen überprüft.

#### .. löschen

Zum Löschen nutzt du einen Rechtsklick auf der gewünschten Datei und klickst auf **Delete**.

### Bearbeitungen absenden

Bist du fertig mit deiner Bearbeitung siehst du in **GitHub Dekstop** alle deine Bearbeitungen.
Verfasse unten links eine Überschrift für deinen Vorgang und beschreibe im Feld darunter, was du veröffentlichen willst (optional, aber gewünscht) damit die überprüfende Person weiß um was es sich bei deinen Bearbeitungen im allgemeinen handelt. Als Beispiel: _"Rechtsschreibfehler korrigiert"_ oder _"'Funkbeispiele erweitert'"_.

Danach klickst du auf die blaue Schaltfläche **Commit to Development** und danach oben auf **Push Origin**. Deine Daten werden übermittelt, von uns überprüft und danach veröffentlicht.

:::info
Der Veröffentlichungsprozess kann ein wenig Zeit in Anspruch nehmen. Gedulde dich und bearbeite in der Wartezeit einfach ein paar andere Dokumente ;)
:::

## Sonstiges

Wir hoffen, dass dir dieser kleine Leitfaden hier weitergeholfen hat. Schreib dein Feedback und deine Fragen doch gerne auf unseren Discordserver, wir helfen dir gerne weiter.

Ansonsten hilft während der Bearbeitung auch Google weiter - nicht zuletzt auch die <a href="https://docusaurus.io/docs/markdown-features" target="_blank">Docs Website</a> vom Docusaurus.

:::danger Wichtig
Erstelle deine Dokumente bitte nach bestem Wissen und Gewissen und immer mit einem Anspruch auf sprachlich und textliche Richtigkeit. Lösche keine Dokumente, deren Löschung nicht unbedingt nötig ist.
:::