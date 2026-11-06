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

interface Laendergruppe {
  code: string
  name: string
  flughaefen: Flughafen[]
}

const laendernamen = new Intl.DisplayNames(['de'], { type: 'region' })
const zahlenformat = new Intl.NumberFormat('de-DE')

function landName(code: string): string {
  try {
    return laendernamen.of(code) ?? code
  } catch {
    return code
  }
}

function normalisiere(liste: Flughafen[]): Flughafen[] {
  return liste.map(flughafen => ({ ...flughafen, country: flughafen.country.trim().toUpperCase() }))
}

const flughaefen = ref(normalisiere(flughafenDaten as Flughafen[]))
const datenHinweis = ref('Gespeicherte Daten werden verwendet.')
const suche = ref('')
const landFilter = ref('')
const aufgeklappt = ref(new Set<string>())

const aktiveFlughaefen = computed(() => flughaefen.value.filter(flughafen => flughafen.active))

function gruppiere(liste: Flughafen[]): Laendergruppe[] {
  const gruppen = new Map<string, Laendergruppe>()
  for (const flughafen of liste) {
    let gruppe = gruppen.get(flughafen.country)
    if (!gruppe) {
      gruppe = { code: flughafen.country, name: landName(flughafen.country), flughaefen: [] }
      gruppen.set(flughafen.country, gruppe)
    }
    gruppe.flughaefen.push(flughafen)
  }
  return [...gruppen.values()]
    .sort((a, b) => a.name.localeCompare(b.name, 'de') || a.code.localeCompare(b.code))
    .map(gruppe => ({
      ...gruppe,
      flughaefen: gruppe.flughaefen.sort((a, b) => a.icao.localeCompare(b.icao))
    }))
}

const alleLaender = computed(() => gruppiere(aktiveFlughaefen.value))

const suchbegriff = computed(() => suche.value.trim().toLocaleLowerCase('de'))

const laendergruppen = computed(() => {
  const begriff = suchbegriff.value
  return gruppiere(aktiveFlughaefen.value
    .filter(flughafen => !landFilter.value || flughafen.country === landFilter.value)
    .filter(flughafen => !begriff ||
      `${flughafen.icao} ${flughafen.iata ?? ''} ${flughafen.name} ${flughafen.city ?? ''} ${flughafen.country} ${landName(flughafen.country)}`
        .toLocaleLowerCase('de')
        .includes(begriff)))
})

const trefferAnzahl = computed(() =>
  laendergruppen.value.reduce((summe, gruppe) => summe + gruppe.flughaefen.length, 0)
)

// Bei Suche oder Länderfilter sind die Treffer überschaubar und werden direkt gezeigt.
const allesOffen = computed(() => suchbegriff.value !== '' || landFilter.value !== '')

function istOffen(code: string): boolean {
  return allesOffen.value || aufgeklappt.value.has(code)
}

function umschalten(code: string) {
  const neu = new Set(aufgeklappt.value)
  if (neu.has(code)) neu.delete(code)
  else neu.add(code)
  aufgeklappt.value = neu
}

function alleAufklappen(offen: boolean) {
  aufgeklappt.value = offen ? new Set(laendergruppen.value.map(gruppe => gruppe.code)) : new Set()
}

function zuruecksetzen() {
  suche.value = ''
  landFilter.value = ''
}

function zahl(wert: number | null, einheit: string): string {
  return wert === null ? '–' : `${zahlenformat.format(wert)} ${einheit}`
}

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
    flughaefen.value = normalisiere(daten)
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
    <div class="filter">
      <label class="feld feld-suche">
        <span>Suche</span>
        <input
          v-model="suche"
          type="search"
          placeholder="ICAO, IATA, Name oder Ort"
          autocomplete="off"
        >
      </label>
      <label class="feld feld-land">
        <span>Land</span>
        <select v-model="landFilter">
          <option value="">Alle Länder ({{ alleLaender.length }})</option>
          <option v-for="land in alleLaender" :key="land.code" :value="land.code">
            {{ land.name }} ({{ land.flughaefen.length }})
          </option>
        </select>
      </label>
    </div>

    <div class="statuszeile">
      <p role="status">
        <strong>{{ trefferAnzahl }}</strong> Flughäfen in
        <strong>{{ laendergruppen.length }}</strong> {{ laendergruppen.length === 1 ? 'Land' : 'Ländern' }}
      </p>
      <div class="aktionen">
        <button v-if="allesOffen" type="button" class="link-knopf" @click="zuruecksetzen">
          Filter zurücksetzen
        </button>
        <template v-else>
          <button type="button" class="link-knopf" @click="alleAufklappen(true)">Alle aufklappen</button>
          <button type="button" class="link-knopf" @click="alleAufklappen(false)">Alle zuklappen</button>
        </template>
      </div>
    </div>
    <p class="daten-hinweis">{{ datenHinweis }}</p>

    <p v-if="laendergruppen.length === 0" class="leer">Keine passenden Flughäfen gefunden.</p>

    <div v-for="gruppe in laendergruppen" :key="gruppe.code" class="land">
      <button
        type="button"
        class="land-kopf"
        :aria-expanded="istOffen(gruppe.code)"
        :aria-controls="`land-${gruppe.code}`"
        :disabled="allesOffen"
        @click="umschalten(gruppe.code)"
      >
        <span class="land-name">{{ gruppe.name }}</span>
        <span class="land-code">{{ gruppe.code }}</span>
        <span class="land-anzahl">{{ gruppe.flughaefen.length }}</span>
        <span v-if="!allesOffen" class="pfeil" aria-hidden="true">›</span>
      </button>

      <table v-if="istOffen(gruppe.code)" :id="`land-${gruppe.code}`" class="tabelle">
        <thead>
          <tr>
            <th scope="col">ICAO</th>
            <th scope="col">IATA</th>
            <th scope="col">Flughafen</th>
            <th scope="col">Ort</th>
            <th scope="col" class="zahl">Höhe</th>
            <th scope="col" class="zahl">Längste Bahn</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flughafen in gruppe.flughaefen" :key="flughafen.id">
            <td class="icao">{{ flughafen.icao }}</td>
            <td class="iata">{{ flughafen.iata || '–' }}</td>
            <td class="name">{{ flughafen.name }}</td>
            <td class="ort">{{ flughafen.city || '–' }}</td>
            <td class="zahl" data-label="Höhe">{{ zahl(flughafen.elevationFt, 'ft') }}</td>
            <td class="zahl" data-label="Bahn">{{ zahl(flughafen.longestRunwayM, 'm') }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<style scoped>
.flughafenliste {
  margin: 1.5rem 0;
}

/* Filter */
.filter {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 0.75rem;
}

.feld {
  display: grid;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-2);
}

.feld input,
.feld select {
  width: 100%;
  min-height: 2.75rem;
  padding: 0.6rem 0.8rem;
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 1rem;
  font-weight: 400;
}

.feld select {
  appearance: auto;
}

.feld input:focus,
.feld select:focus {
  outline: 2px solid var(--vp-c-brand-1);
  outline-offset: 1px;
}

.statuszeile {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem 1rem;
  margin-top: 1rem;
}

.statuszeile p {
  margin: 0;
}

.aktionen {
  display: flex;
  gap: 1rem;
}

.link-knopf {
  padding: 0.25rem 0;
  color: var(--vp-c-brand-1);
  font-size: 0.9rem;
  font-weight: 500;
}

.link-knopf:hover {
  text-decoration: underline;
}

.daten-hinweis {
  margin: 0.25rem 0 1rem;
  color: var(--vp-c-text-3);
  font-size: 0.8rem;
}

.leer {
  padding: 1.5rem;
  border: 1px dashed var(--vp-c-border);
  border-radius: 8px;
  text-align: center;
  color: var(--vp-c-text-2);
}

/* Länderabschnitte */
.land {
  margin-bottom: 0.5rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  overflow: hidden;
}

.land-kopf {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
  min-height: 3rem;
  padding: 0.6rem 1rem;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-align: left;
  cursor: pointer;
}

.land-kopf:disabled {
  cursor: default;
  opacity: 1;
}

.land-kopf:not(:disabled):hover {
  background: var(--vp-c-default-soft);
}

.land-name {
  font-weight: 600;
}

.land-code {
  padding: 0.05rem 0.4rem;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 600;
}

.land-anzahl {
  margin-left: auto;
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-variant-numeric: tabular-nums;
}

.pfeil {
  font-size: 1.3rem;
  line-height: 1;
  color: var(--vp-c-text-3);
  transition: transform 0.15s ease;
}

.land-kopf[aria-expanded='true'] .pfeil {
  transform: rotate(90deg);
}

/* Tabelle (Desktop) */
.tabelle {
  display: table;
  width: 100%;
  margin: 0;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.tabelle tr {
  border: 0;
  background: transparent;
}

.tabelle th,
.tabelle td {
  padding: 0.55rem 1rem;
  border: 0;
  border-top: 1px solid var(--vp-c-divider);
  text-align: left;
  vertical-align: top;
}

.tabelle th {
  color: var(--vp-c-text-2);
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.tabelle tbody tr:hover {
  background: var(--vp-c-bg-soft);
}

.icao {
  font-family: var(--vp-font-family-mono);
  font-weight: 700;
}

.iata {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-2);
}

.tabelle .zahl {
  text-align: right;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

/* Karten (Mobilgeräte) */
@media (max-width: 640px) {
  .filter {
    grid-template-columns: 1fr;
  }

  .land-kopf {
    padding: 0.6rem 0.8rem;
  }

  .tabelle thead {
    display: none;
  }

  .tabelle,
  .tabelle tbody {
    display: block;
  }

  .tabelle tr {
    display: grid;
    grid-template-columns: auto auto 1fr;
    grid-template-areas:
      'icao iata hoehe'
      'name name name'
      'ort  ort  bahn';
    align-items: baseline;
    gap: 0.15rem 0.6rem;
    padding: 0.7rem 0.8rem;
    border-top: 1px solid var(--vp-c-divider);
  }

  .tabelle tbody tr:hover {
    background: transparent;
  }

  .tabelle td {
    padding: 0;
    border: 0;
  }

  .icao { grid-area: icao; font-size: 1rem; }
  .iata { grid-area: iata; }
  .name { grid-area: name; font-weight: 500; }
  .ort { grid-area: ort; color: var(--vp-c-text-2); font-size: 0.85rem; }

  .tabelle .zahl {
    color: var(--vp-c-text-2);
    font-size: 0.8rem;
  }

  .tabelle .zahl::before {
    content: attr(data-label) ' ';
    color: var(--vp-c-text-3);
  }

  .tabelle td:nth-child(5) { grid-area: hoehe; }
  .tabelle td:nth-child(6) { grid-area: bahn; }
}
</style>
