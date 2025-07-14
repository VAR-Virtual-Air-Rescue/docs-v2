# Virtual Air Rescue V2 Dokumentation

Dies ist das Repository für die [Dokumentation der VAR](https://docs.virtualairrescue.com/).

## Wie wirke ich mit?
Unsere Docs-Page erweitert sich ständig und lebt von Beiträgen aus der Community. Damit du in Zukunft deine eigenen Artikel verfassen oder andere korrigieren bzw. erweitern kannst, gibt es hier einen kleinen Leitfaden.

### Technische Vorbereitung
Zuerst, [erstelle dir einen GitHub Account](https://github.com/join). Im Anschluss können wir direkt los legen.

Du musst [git](https://git-scm.com/) sowie [nodejs](https://nodejs.org/en) auf deinem System Installiert haben.
Du brauchst außerdem einen Texteditor deiner Wahl, wir empfehlen [VS Code](https://code.visualstudio.com/) oder [Notepad++](https://notepad-plus-plus.org/downloads/).

Wenn du alles installiert hast, öffne eine Powershell oder CMD Konsole an dem Ort, an dem du unser Repository speichern möchtest und führe den Befehl `git clone https://github.com/VAR-Virtual-Air-Rescue/docs-v2.git` aus. Du musst dich ggf. mit GitHub Authentifizieren.

## Die Dokumentation bearbeiten
Gehe nun in das eben heruntergeladene Repository.

Führe initial den Befehl `npm install` aus, um alle Abhängigkeiten herunterzuladen.

Wenn du etwas bearbeiten möchtest, erstelle ein neues Branch mit `git switch -c <branch-name>`.

Bearbeite die Dateien, oder füge neue Hinzu. Alle Seiten werden mit Markdown als .md Datei gespeichert.
Wenn du die Navigation bearbeiten möchtest, kannst du dies unter `.vitepress/config.mts` machen.

Deine Änderungen kannst du mit `npm run dev` live anschauen.

Wenn du fertig bist, führe vom Hauptverzeichnis folgende Befehle in dieser Reihenfolge aus:

    git add .
    git commit -m "Beschreibe kurz deine Änderungen"
    git push

Deine Änderungen werden nun auf GitHub in einem neuen Branch hochgeladen und werden, nachdem wir drüber geschaut haben, in die Docs hinzugefügt.

**Vielen Dank für dein Engagement!**