<script setup>
import { computed, ref } from 'vue'
import daten from '../../../src/.data/stationen.json'
import spitaeler from '../../../src/.data/oesterreich-spitaeler.json'

const KARTENBEREICH = { x: 460, y: 665, width: 500, height: 315 }
const MAX_ZOOM = 8
const KARTENRAND = 16
const kategorien = [
  { id: 'UNIVERSITY', name: 'Universitätsklinik', plural: 'Universitätskliniken' },
  { id: 'SPECIALIST', name: 'Fachklinik', plural: 'Fachkliniken' },
  { id: 'HOSPITAL', name: 'Krankenhaus', plural: 'Krankenhäuser' }
]
const landeplatzTypen = {
  GROUND: 'Bodenlandeplatz',
  ROOF: 'Dachlandeplatz',
  NEARBY: 'Landeplatz in der Nähe'
}

const suche = ref('')
const kategorie = ref('')
const gewaehlt = ref(null)
const beruehrt = ref(null)
const svgKarte = ref(null)
const ausschnitt = ref({ ...KARTENBEREICH })
const zoom = computed(() => KARTENBEREICH.width / ausschnitt.value.width)
let ziehStart = null
let karteGezogen = false
const erweiterteGruppe = ref(null)

if (!daten.oesterreichUmriss?.d) {
  throw new Error('Umriss von Österreich fehlt in den Stationsdaten')
}
if (daten.bundeslaender?.length !== 9 || daten.bundeslaender.some(bundesland => !bundesland.d)) {
  throw new Error('Grenzen der neun österreichischen Bundesländer fehlen in den Stationsdaten')
}
if (!spitaeler.length) {
  throw new Error('Österreichische Spitäler fehlen in den Kartendaten')
}

const gefiltert = computed(() => {
  const q = suche.value.trim().toLocaleLowerCase('de')
  return spitaeler.filter(spital => {
    if (kategorie.value && spital.category !== kategorie.value) return false
    return !q || `${spital.name} ${spital.city || ''} ${spital.state || ''}`
      .toLocaleLowerCase('de').includes(q)
  })
})

const markerGruppen = computed(() => {
  const gruppenAbstand = 15 / zoom.value
  const uebrig = [...gefiltert.value].sort((a, b) => a.y - b.y || a.x - b.x)
  const gruppen = []
  while (uebrig.length) {
    const anker = uebrig[0]
    const mitglieder = uebrig.filter(spital =>
      Math.hypot(spital.x - anker.x, spital.y - anker.y) <= gruppenAbstand
    )
    const ids = new Set(mitglieder.map(spital => spital.id))
    for (let i = uebrig.length - 1; i >= 0; i--) {
      if (ids.has(uebrig[i].id)) uebrig.splice(i, 1)
    }
    gruppen.push(mitglieder)
  }

  const mittelpunkt = mitglieder => ({
    x: mitglieder.reduce((summe, spital) => summe + spital.x, 0) / mitglieder.length,
    y: mitglieder.reduce((summe, spital) => summe + spital.y, 0) / mitglieder.length
  })

  for (let i = 0; i < gruppen.length; i++) {
    if (gruppen[i].length < 2) continue
    for (let j = i + 1; j < gruppen.length; j++) {
      if (gruppen[j].length < 2) continue
      const a = mittelpunkt(gruppen[i])
      const b = mittelpunkt(gruppen[j])
      if (Math.hypot(a.x - b.x, a.y - b.y) < 22 / zoom.value) {
        gruppen[i].push(...gruppen[j])
        gruppen.splice(j, 1)
        i = -1
        break
      }
    }
  }

  return gruppen.map(mitglieder => {
    const { x, y } = mittelpunkt(mitglieder)
    const key = mitglieder.map(spital => spital.id).sort((a, b) => a - b).join('-')
    const aufgeklappt = mitglieder.length > 1 && erweiterteGruppe.value === key
    const radius = Math.min(32, Math.max(12, mitglieder.length * 1.8)) / zoom.value

    return {
      key,
      mitglieder,
      x,
      y,
      aufgeklappt,
      marker: mitglieder.map((spital, index) => {
        const winkel = -Math.PI / 2 + 2 * Math.PI * index / mitglieder.length
        return {
          spital,
          x: aufgeklappt ? x + Math.cos(winkel) * radius : spital.x,
          y: aufgeklappt ? y + Math.sin(winkel) * radius : spital.y
        }
      })
    }
  })
})

const kategorienAnzahl = Object.fromEntries(
  kategorien.map(eintrag => [
    eintrag.id,
    spitaeler.filter(spital => spital.category === eintrag.id).length
  ])
)

const aktiv = computed(() =>
  gefiltert.value.find(spital => spital.id === gewaehlt.value) || beruehrt.value
)

const kartePos = computed(() => {
  const spital = aktiv.value
  if (!spital) return null
  const { x, y, width, height } = ausschnitt.value
  const rechts = spital.x > x + width * 0.58
  const unten = spital.y > y + height * 0.62
  return {
    left: rechts ? 'auto' : `${(spital.x - x) / width * 100}%`,
    right: rechts ? `${(x + width - spital.x) / width * 100}%` : 'auto',
    top: unten ? 'auto' : `${(spital.y - y) / height * 100}%`,
    bottom: unten ? `${(y + height - spital.y) / height * 100}%` : 'auto'
  }
})

function begrenzeAusschnitt(x, y, width, height) {
  const w = Math.min(KARTENBEREICH.width, Math.max(KARTENBEREICH.width / MAX_ZOOM, width))
  const h = Math.min(KARTENBEREICH.height, Math.max(KARTENBEREICH.height / MAX_ZOOM, height))
  if (w === KARTENBEREICH.width) return { ...KARTENBEREICH }
  return {
    x: Math.max(KARTENBEREICH.x - KARTENRAND, Math.min(KARTENBEREICH.x + KARTENBEREICH.width - w + KARTENRAND, x)),
    y: Math.max(KARTENBEREICH.y - KARTENRAND, Math.min(KARTENBEREICH.y + KARTENBEREICH.height - h + KARTENRAND, y)),
    width: w,
    height: h
  }
}

function zoomeAuf(neuerZoom, clientX, clientY) {
  const nextZoom = Math.min(MAX_ZOOM, Math.max(1, neuerZoom))
  const svg = svgKarte.value
  const rect = svg?.getBoundingClientRect()
  const current = ausschnitt.value
  const focusX = rect && clientX != null
    ? current.x + (clientX - rect.left) / rect.width * current.width
    : current.x + current.width / 2
  const focusY = rect && clientY != null
    ? current.y + (clientY - rect.top) / rect.height * current.height
    : current.y + current.height / 2
  const width = KARTENBEREICH.width / nextZoom
  const height = KARTENBEREICH.height / nextZoom
  const ratioX = (focusX - current.x) / current.width
  const ratioY = (focusY - current.y) / current.height
  ausschnitt.value = begrenzeAusschnitt(
    focusX - ratioX * width,
    focusY - ratioY * height,
    width,
    height
  )
}

function zoomRad(event) {
  zoomeAuf(zoom.value * (event.deltaY < 0 ? 1.2 : 1 / 1.2), event.clientX, event.clientY)
}

function zieheStarten(event) {
  if (!event.isPrimary || event.button !== 0 || zoom.value <= 1 ||
      event.target.closest('.ok-punkt, .ok-cluster, .ok-cluster-zuklappen')) return
  ziehStart = {
    clientX: event.clientX,
    clientY: event.clientY,
    ...ausschnitt.value
  }
  karteGezogen = false
  event.currentTarget.setPointerCapture(event.pointerId)
}

function karteZiehen(event) {
  if (!ziehStart) return
  if (Math.hypot(event.clientX - ziehStart.clientX, event.clientY - ziehStart.clientY) > 2) {
    karteGezogen = true
  }
  if (!karteGezogen) return
  const rect = svgKarte.value.getBoundingClientRect()
  ausschnitt.value = begrenzeAusschnitt(
    ziehStart.x - (event.clientX - ziehStart.clientX) / rect.width * ziehStart.width,
    ziehStart.y - (event.clientY - ziehStart.clientY) / rect.height * ziehStart.height,
    ziehStart.width,
    ziehStart.height
  )
}

function ziehenBeenden(event) {
  if (svgKarte.value?.hasPointerCapture(event.pointerId)) {
    svgKarte.value.releasePointerCapture(event.pointerId)
  }
  ziehStart = null
  requestAnimationFrame(() => { karteGezogen = false })
}

function zuruecksetzen() {
  suche.value = ''
  kategorie.value = ''
  gewaehlt.value = null
  beruehrt.value = null
  ausschnitt.value = { ...KARTENBEREICH }
  erweiterteGruppe.value = null
}

function waehlen(spital) {
  if (karteGezogen) return
  gewaehlt.value = gewaehlt.value === spital.id ? null : spital.id
}

function gruppeUmschalten(gruppe) {
  erweiterteGruppe.value = gruppe.aufgeklappt ? null : gruppe.key
  gewaehlt.value = null
  beruehrt.value = null
}
</script>

<template>
  <div class="ok">
    <div class="ok-filter">
      <input
        v-model="suche"
        type="search"
        class="ok-suche"
        placeholder="Spital, Ort oder Bundesland suchen …"
        aria-label="Spitäler nach Name, Ort oder Bundesland durchsuchen"
      >
      <select v-model="kategorie" aria-label="Spitalkategorie">
        <option value="">Alle Kategorien</option>
        <option v-for="eintrag in kategorien" :key="eintrag.id" :value="eintrag.id">
          {{ eintrag.plural }} ({{ kategorienAnzahl[eintrag.id] }})
        </option>
      </select>
      <button type="button" class="ok-zurueck" @click="zuruecksetzen">
        Zurücksetzen
      </button>
    </div>

    <p class="ok-zahl">
      <b>{{ gefiltert.length }}</b> von {{ spitaeler.length }} Spitälern
      <span v-if="gefiltert.length !== spitaeler.length"> · gefiltert</span>
    </p>

    <div class="ok-kartenrahmen">
      <div class="ok-zoom" role="group" aria-label="Kartenzoom">
        <button type="button" aria-label="Karte vergrößern" :disabled="zoom >= MAX_ZOOM" @click="zoomeAuf(zoom * 1.5)">+</button>
        <output aria-live="polite">{{ Math.round(zoom * 100) }} %</output>
        <button type="button" aria-label="Karte verkleinern" :disabled="zoom <= 1" @click="zoomeAuf(zoom / 1.5)">−</button>
      </div>
      <svg
        ref="svgKarte"
        :viewBox="`${ausschnitt.x} ${ausschnitt.y} ${ausschnitt.width} ${ausschnitt.height}`"
        class="ok-svg"
        :class="{ 'ist-gezoomt': zoom > 1 }"
        role="img"
        aria-label="Karte der neun österreichischen Bundesländer und Spitäler mit Hubschrauberlandeplatz"
        @wheel.prevent="zoomRad"
        @pointerdown="zieheStarten"
        @pointermove="karteZiehen"
        @pointerup="ziehenBeenden"
        @pointercancel="ziehenBeenden"
        @lostpointercapture="ziehenBeenden"
      >
        <defs>
          <clipPath id="oesterreichkarte-umriss">
            <path :d="daten.oesterreichUmriss.d" />
          </clipPath>
        </defs>
        <path :d="daten.oesterreichUmriss.d" class="ok-flaeche" />
        <g clip-path="url(#oesterreichkarte-umriss)">
          <path
            v-for="bundesland in daten.bundeslaender"
            :key="bundesland.name"
            :d="bundesland.d"
            class="ok-grenze"
          />
          </g>
          <path :d="daten.oesterreichUmriss.d" class="ok-umriss" />
          <g v-for="gruppe in markerGruppen" :key="gruppe.key">
            <g
              v-if="gruppe.mitglieder.length > 1 && !gruppe.aufgeklappt"
              class="ok-cluster"
              tabindex="0"
              role="button"
              :aria-label="`${gruppe.mitglieder.length} Spitäler in der Nähe. Zum Auffächern anklicken.`"
              @click="gruppeUmschalten(gruppe)"
              @keydown.enter.prevent="gruppeUmschalten(gruppe)"
              @keydown.space.prevent="gruppeUmschalten(gruppe)"
            >
              <circle :cx="gruppe.x" :cy="gruppe.y" :r="10 / zoom" class="ok-cluster-ring" />
              <text :x="gruppe.x" :y="gruppe.y + 3.2 / zoom" :style="{ fontSize: `${8 / zoom}px` }" text-anchor="middle">
                {{ gruppe.mitglieder.length }}
              </text>
              <title>{{ gruppe.mitglieder.map(spital => spital.name).join(', ') }}</title>
            </g>
            <g v-else>
              <template v-if="gruppe.aufgeklappt">
                <line
                  v-for="marker in gruppe.marker"
                  :key="`linie-${marker.spital.id}`"
                  :x1="gruppe.x"
                  :y1="gruppe.y"
                  :x2="marker.x"
                  :y2="marker.y"
                  class="ok-spider-linie"
                />
                <g
                  class="ok-cluster-zuklappen"
                  tabindex="0"
                  role="button"
                  :aria-label="`${gruppe.mitglieder.length} Spitäler wieder zusammenfassen`"
                  @click="gruppeUmschalten(gruppe)"
                  @keydown.enter.prevent="gruppeUmschalten(gruppe)"
                  @keydown.space.prevent="gruppeUmschalten(gruppe)"
                >
                  <circle :cx="gruppe.x" :cy="gruppe.y" :r="7 / zoom" class="ok-zuklappen-ring" />
                  <text :x="gruppe.x" :y="gruppe.y + 3 / zoom" :style="{ fontSize: `${8 / zoom}px` }" text-anchor="middle">−</text>
                </g>
              </template>
              <g v-for="marker in gruppe.marker" :key="marker.spital.id">
                <circle
                  v-if="aktiv?.id === marker.spital.id"
                  :cx="marker.x"
                  :cy="marker.y"
                  :r="11 / zoom"
                  class="ok-halo"
                />
                <circle
                  :cx="marker.x"
                  :cy="marker.y"
                  :r="5 / zoom"
                  class="ok-punkt-ring"
                  aria-hidden="true"
                />
                <circle
                  :cx="marker.x"
                  :cy="marker.y"
                  :r="(aktiv?.id === marker.spital.id ? 4.1 : 3.5) / zoom"
                  :class="['ok-punkt', `ist-${marker.spital.category.toLowerCase()}`]"
                  tabindex="0"
                  role="button"
                  :aria-label="`${marker.spital.name}, ${marker.spital.city || ''}, ${marker.spital.state || ''}`"
                  :aria-pressed="gewaehlt === marker.spital.id"
                  @mouseenter="beruehrt = marker.spital"
                  @mouseleave="beruehrt = null"
                  @focus="beruehrt = marker.spital"
                  @blur="beruehrt = null"
                  @click="waehlen(marker.spital)"
                  @keydown.enter.prevent="waehlen(marker.spital)"
                  @keydown.space.prevent="waehlen(marker.spital)"
                />
              </g>
            </g>
          </g>
      </svg>

      <div v-if="aktiv" class="ok-karte" :style="kartePos">
        <b class="ok-karte-titel">{{ aktiv.name }}</b>
        <dl>
          <dt>Kategorie</dt>
          <dd>{{ kategorien.find(eintrag => eintrag.id === aktiv.category)?.name }}</dd>
          <dt>Ort</dt>
          <dd>{{ aktiv.city || '—' }}<span v-if="aktiv.state"> · {{ aktiv.state }}</span></dd>
          <dt>Landeplatz</dt>
          <dd>{{ landeplatzTypen[aktiv.helipad] || '—' }}</dd>
          <dt v-if="aktiv.operatorName">Betreiber</dt>
          <dd v-if="aktiv.operatorName">{{ aktiv.operatorName }}</dd>
        </dl>
        <span v-if="aktiv.helipadNight" class="ok-nacht">Nachtlandeplatz</span>
      </div>
    </div>

    <div class="ok-legende" aria-label="Kategorien der Spitäler">
      <span v-for="eintrag in kategorien" :key="eintrag.id">
        <i :class="`ist-${eintrag.id.toLowerCase()}`" aria-hidden="true" />
        {{ eintrag.name }} ({{ kategorienAnzahl[eintrag.id] }})
      </span>
      <span class="ok-hinweis">Mausrad zum Zoomen, Karte bei vergrößerter Ansicht ziehen. Zeiger auf einen Punkt legen oder anklicken.</span>
    </div>

    <details class="ok-tabelle" open>
      <summary>Alle {{ gefiltert.length }} Spitäler als Liste</summary>
      <div class="ok-rollen">
        <table>
          <thead>
            <tr>
              <th>Spital</th>
              <th>Kategorie</th>
              <th>Ort</th>
              <th>Hubschrauberlandeplatz</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="spital in gefiltert"
              :key="spital.id"
              :class="{ 'ist-aktiv': aktiv?.id === spital.id }"
              @mouseenter="beruehrt = spital"
              @mouseleave="beruehrt = null"
            >
              <td><b>{{ spital.name }}</b></td>
              <td>{{ kategorien.find(eintrag => eintrag.id === spital.category)?.name }}</td>
              <td>{{ spital.city || '—' }}<span v-if="spital.state" class="ok-bundesland"> · {{ spital.state }}</span></td>
              <td>{{ landeplatzTypen[spital.helipad] || '—' }}<span v-if="spital.helipadNight"> · Nacht</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>
  </div>
</template>

<style scoped>
.ok {
  --ok-krankenhaus: #2e7d46;
  --ok-fachklinik: var(--var-gold);
  --ok-universitaet: var(--var-navy);
  margin: 24px 0 8px;
}

:global(.dark) .ok { --ok-krankenhaus: #3fbf74; }

.ok-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin-bottom: 12px;
}

.ok-filter input,
.ok-filter select,
.ok-zurueck {
  font: inherit;
  font-size: 14px;
  padding: 7px 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 2px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}

.ok-suche { flex: 1 1 360px; min-width: 0; }
.ok-zurueck { cursor: pointer; color: var(--vp-c-text-2); }
.ok-zurueck:hover { border-color: var(--var-gold); color: var(--vp-c-text-1); }
.ok-zahl { margin: 0 0 10px; font-size: 14px; color: var(--vp-c-text-2); }
.ok-zahl b { color: var(--vp-c-text-1); }

.ok-kartenrahmen {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 2px;
  background: var(--vp-c-bg-alt);
  overflow: hidden;
}

.ok-zoom {
  position: absolute;
  z-index: 3;
  top: 10px;
  right: 10px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 2px;
  background: var(--vp-c-bg);
  box-shadow: 0 2px 8px rgba(0, 17, 58, .12);
}
.ok-zoom button {
  width: 30px;
  height: 30px;
  border: 0;
  border-radius: 2px;
  background: transparent;
  color: var(--vp-c-text-1);
  font: inherit;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}
.ok-zoom button:hover:not(:disabled) { background: var(--vp-c-brand-soft); }
.ok-zoom button:disabled { color: var(--vp-c-text-3); cursor: default; }
.ok-zoom output {
  min-width: 46px;
  color: var(--vp-c-text-2);
  font-size: 12px;
  text-align: center;
}

.ok-svg { display: block; width: 100%; height: auto; touch-action: none; }
.ok-svg.ist-gezoomt { cursor: grab; }
.ok-svg.ist-gezoomt:active { cursor: grabbing; }
.ok-flaeche { fill: var(--vp-c-bg); }
.ok-grenze, .ok-umriss {
  fill: none;
  stroke: var(--vp-c-divider);
  stroke-width: 1;
  stroke-linejoin: round;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.ok-punkt {
  stroke: var(--vp-c-bg-alt);
  stroke-width: 0.8;
  cursor: pointer;
  filter: drop-shadow(0 0.5px 0.8px rgba(0, 17, 58, .35));
  transition: r .12s ease, filter .12s ease;
}
.ok-punkt:hover, .ok-punkt:focus-visible {
  r: 5.5;
  filter: drop-shadow(0 0 2px var(--vp-c-bg));
  outline: none;
}
.ok-punkt:focus-visible { stroke: var(--var-gold); stroke-width: 1.5; }
.ok-punkt-ring { fill: var(--vp-c-bg); pointer-events: none; }
.ist-university { fill: var(--ok-universitaet); }
.ist-specialist { fill: var(--ok-fachklinik); }
.ist-hospital { fill: var(--ok-krankenhaus); }
.ok-halo { fill: var(--var-gold); opacity: .22; pointer-events: none; }

.ok-cluster,
.ok-cluster-zuklappen { cursor: pointer; }
.ok-cluster-ring {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-divider);
  stroke-width: 1.5;
  vector-effect: non-scaling-stroke;
  filter: drop-shadow(0 1px 2px rgba(0, 17, 58, .25));
}
.ok-cluster text,
.ok-cluster-zuklappen text {
  fill: var(--vp-c-text-1);
  font-size: 8px;
  font-weight: 700;
  pointer-events: none;
}
.ok-cluster:hover .ok-cluster-ring,
.ok-cluster:focus-visible .ok-cluster-ring {
  stroke: var(--var-gold);
  stroke-width: 2;
}
.ok-cluster:focus-visible,
.ok-cluster-zuklappen:focus-visible { outline: none; }
.ok-zuklappen-ring {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-divider);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}
.ok-spider-linie {
  stroke: var(--vp-c-text-3);
  stroke-width: 0.8;
  stroke-dasharray: 1.5 1.5;
  opacity: .7;
  pointer-events: none;
  vector-effect: non-scaling-stroke;
}

.ok-karte {
  position: absolute;
  z-index: 2;
  min-width: 210px;
  max-width: 280px;
  margin: 12px;
  padding: 11px 13px;
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--var-gold);
  border-radius: 2px;
  background: var(--vp-c-bg);
  box-shadow: 0 6px 22px rgba(0, 17, 58, .18);
  color: var(--vp-c-text-1);
  font-size: 12px;
  line-height: 1.45;
  pointer-events: none;
}
.ok-karte-titel { display: block; margin-bottom: 7px; font-size: 13px; }
.ok-karte dl { display: grid; grid-template-columns: auto 1fr; gap: 2px 9px; margin: 0; }
.ok-karte dt { color: var(--vp-c-text-3); font-size: 10px; text-transform: uppercase; }
.ok-karte dd { margin: 0; overflow-wrap: anywhere; }
.ok-nacht {
  display: inline-block;
  margin-top: 8px;
  padding: 2px 6px;
  border: 1px solid var(--var-gold);
  color: var(--var-akz);
  font-size: 10px;
  text-transform: uppercase;
}

.ok-legende {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  align-items: center;
  margin-top: 10px;
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.ok-legende span { display: inline-flex; align-items: center; gap: 7px; }
.ok-legende i { width: 10px; height: 10px; display: block; border-radius: 50%; }
.ok-legende i.ist-university { background: var(--ok-universitaet); }
.ok-legende i.ist-specialist { background: var(--ok-fachklinik); }
.ok-legende i.ist-hospital { background: var(--ok-krankenhaus); }
.ok-hinweis { color: var(--vp-c-text-3); font-size: 12px; }

.ok-tabelle { margin-top: 18px; }
.ok-tabelle summary {
  padding: 6px 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  cursor: pointer;
}
.ok-rollen {
  max-height: 460px;
  margin-top: 6px;
  overflow: auto;
  border: 1px solid var(--vp-c-divider);
  border-radius: 2px;
}
.ok-rollen table {
  width: 100%;
  min-width: 620px;
  border-collapse: collapse;
  font-size: 13px;
}
.ok-rollen th {
  position: sticky;
  top: 0;
  z-index: 1;
  padding: 9px 12px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 10px;
  letter-spacing: .12em;
  text-align: left;
  text-transform: uppercase;
  white-space: nowrap;
}
.ok-rollen td { padding: 8px 12px; border-bottom: 1px solid var(--vp-c-divider); }
.ok-rollen tr:last-child td { border-bottom: 0; }
.ok-rollen tr.ist-aktiv { background: var(--vp-c-brand-soft); }
.ok-bundesland { color: var(--vp-c-text-2); }

@media (max-width: 640px) {
  .ok-suche { flex-basis: 100%; }
  .ok-karte { min-width: 0; max-width: min(250px, calc(100% - 24px)); }
  .ok-zoom { top: 6px; right: 6px; }
}
@media (prefers-reduced-motion: reduce) {
  .ok-punkt { transition: none; }
}
</style>
