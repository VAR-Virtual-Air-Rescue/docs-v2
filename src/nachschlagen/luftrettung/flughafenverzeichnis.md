# Flughafenverzeichnis

Hier findest du die aktiven Flughäfen aus der VAR-Flughafen-API. Die Daten
werden beim Öffnen der Seite live geladen. Wenn die API nicht erreichbar ist,
werden die gespeicherten Daten angezeigt. Suche nach ICAO-, IATA-Code,
Flughafen, Ort oder Land.

<script setup>
import FlughafenListe from '../../../.vitepress/theme/components/FlughafenListe.vue'
</script>

<FlughafenListe />
