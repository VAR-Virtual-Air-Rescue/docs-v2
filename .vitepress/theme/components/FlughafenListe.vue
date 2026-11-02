<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import flughafenDaten from '../../../src/.data/airports.json'

interface Flughafen {
  id: number
  icao: string
  iata: string | null
  name: string
  city: string | null
  country: string
  elevationFt: number | null
  longestRunwayM: number | null
  active: boolean
}

const ANZAHL_PRO_SEITE = 100
const flughaefen = ref(flughafenDaten as Flughafen[])
const datenHinweis = ref('Gespeicherte Daten werden verwendet.')
const suche = ref('')
const sichtbareAnzahl = ref(ANZAHL_PRO_SEITE)

const gefilterteFlughaefen = computed(() => {
  const begriff = suche.value.trim().toLocaleLowerCase('de')
  return flughaefen.value
    .filter(flughafen => flughafen.active)
    .filter(flughafen => !begriff ||
      `${flughafen.icao} ${flughafen.iata ?? ''} ${flughafen.name} ${flughafen.city ?? ''} ${flughafen.country}`
        .toLocaleLowerCase('de')
        .includes(begriff))
    .sort((a, b) => a.icao.localeCompare(b.icao))
})

const angezeigteFlughaefen = computed(() =>
  gefilterteFlughaefen.value.slice(0, sichtbareAnzahl.value)
)

onMounted(async () => {
  try {
    const antwort = await fetch('/api/airports', {
      cache: 'no-store',
      signal: AbortSignal.timeout(30_000)
    })
    if (!antwort.ok) {
      throw new Error(`Flughafen-API antwortete mit HTTP ${antwort.status}.`)
    }

    const daten: unknown = await antwort.json()
    if (!Array.isArray(daten) || daten.length === 0 || !daten.every(istFlughafen)) {
      throw new Error('Die Flughafen-API lieferte Daten in einem unerwarteten Format.')
    }
    flughaefen.value = daten
    datenHinweis.value = 'Live-Daten von der Flughafen-API.'
  } catch (fehler) {
    const grund = fehler instanceof Error ? fehler.message : 'unbekannter Fehler'
    datenHinweis.value = `Live-Aktualisierung fehlgeschlagen (${grund}); gespeicherte Daten werden angezeigt.`
  }
})

function istFlughafen(eintrag: unknown): eintrag is Flughafen {
  if (!eintrag || typeof eintrag !== 'object') return false
  const daten = eintrag as Record<string, unknown>
  return typeof daten.id === 'number' &&
    typeof daten.icao === 'string' &&
    (typeof daten.iata === 'string' || daten.iata === null) &&
    typeof daten.name === 'string' &&
    (typeof daten.city === 'string' || daten.city === null) &&
    typeof daten.country === 'string' &&
    (typeof daten.elevationFt === 'number' || daten.elevationFt === null) &&
    (typeof daten.longestRunwayM === 'number' || daten.longestRunwayM === null) &&
    typeof daten.active === 'boolean'
}
</script>

<template>
  <section class="flughafenliste">
    <label class="suche">
      <span>Flughafen suchen</span>
      <input
        v-model="suche"
        type="search"
        placeholder="ICAO, IATA, Name, Ort oder Land"
        @input="sichtbareAnzahl = ANZAHL_PRO_SEITE"
      >
    </label>

    <p class="daten-hinweis" role="status">{{ datenHinweis }}</p>
    <p role="status">
      {{ gefilterteFlughaefen.length }} aktive Flughäfen
      <template v-if="suche.trim()"> · Suchergebnisse für „{{ suche.trim() }}“</template>
    </p>

    <div class="tabellenbereich">
      <table>
        <thead>
          <tr>
            <th scope="col">ICAO</th>
            <th scope="col">IATA</th>
            <th scope="col">Flughafen</th>
            <th scope="col">Ort</th>
            <th scope="col">Land</th>
            <th scope="col">Höhe (ft)</th>
            <th scope="col">Längste Bahn (m)</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flughafen in angezeigteFlughaefen" :key="flughafen.id">
            <td>{{ flughafen.icao }}</td>
            <td>{{ flughafen.iata || '–' }}</td>
            <td>{{ flughafen.name }}</td>
            <td>{{ flughafen.city || '–' }}</td>
            <td>{{ flughafen.country }}</td>
            <td>{{ flughafen.elevationFt ?? '–' }}</td>
            <td>{{ flughafen.longestRunwayM ?? '–' }}</td>
          </tr>
          <tr v-if="angezeigteFlughaefen.length === 0">
            <td colspan="7">Keine passenden Flughäfen gefunden.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <button
      v-if="angezeigteFlughaefen.length < gefilterteFlughaefen.length"
      type="button"
      @click="sichtbareAnzahl += ANZAHL_PRO_SEITE"
    >
      Weitere Flughäfen anzeigen
    </button>
  </section>
</template>

<style scoped>
.flughafenliste {
  margin: 1.5rem 0;
}

.suche {
  display: grid;
  gap: 0.4rem;
  max-width: 32rem;
  font-weight: 600;
}

.suche input {
  width: 100%;
  padding: 0.65rem 0.8rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 4px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
}

.tabellenbereich {
  overflow-x: auto;
}

.tabellenbereich table {
  min-width: 44rem;
}

.daten-hinweis {
  color: var(--vp-c-text-2);
  font-size: 0.9rem;
}

</style>
