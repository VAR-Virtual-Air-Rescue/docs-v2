<script setup>
/**
 * Stationskarte der VAR.
 *
 * Daten: `src/.data/stationen.json`, erzeugt von `scripts/karte-bauen.py` aus
 * dem Endpunkt der Leitstelle. **Eingebacken, nicht live geladen** -- der
 * Endpunkt schickt kein `Access-Control-Allow-Origin`, ein Browser auf
 * docs.virtualairrescue.com darf ihn also gar nicht abfragen. Nebenwirkung:
 * die Karte ist sofort da und funktioniert auch, wenn die Leitstelle klemmt.
 *
 * Umrisse: Natural Earth, gemeinfrei, beim Erzeugen auf den Einsatzraum
 * beschnitten und vereinfacht.
 */
import { ref, computed, onMounted } from 'vue'
import daten from '../../../src/.data/stationen.json'

const LAENDER = {
  DE: 'Deutschland', AT: 'Österreich', CH: 'Schweiz', NL: 'Niederlande',
  LU: 'Luxemburg', LI: 'Liechtenstein', IT: 'Italien', BE: 'Belgien'
}
const ART = {
  PRIMARY: 'Primärrettung',
  DUAL_USE: 'Primär und Verlegung',
  SECONDARY: 'Verlegung (ITH)'
}

const suche = ref('')
const land = ref('')
const art = ref('')
const nurWinde = ref(false)
const nurRund = ref(false)
const nurNvg = ref(false)
const gewaehlt = ref(null)      // angeheftet per Klick
const beruehrt = ref(null)      // unter dem Zeiger
const bereit = ref(false)

onMounted(() => { bereit.value = true })

const laenderListe = computed(() => {
  const z = {}
  for (const s of daten.stationen) z[s.land] = (z[s.land] || 0) + 1
  return Object.keys(z).sort((a, b) => z[b] - z[a])
    .map(k => ({ k, name: LAENDER[k] || k, n: z[k] }))
})

const gefiltert = computed(() => {
  const q = suche.value.trim().toLowerCase()
  return daten.stationen.filter(s => {
    if (land.value && s.land !== land.value) return false
    if (art.value && s.einsatzart !== art.value) return false
    if (nurWinde.value && !s.winde) return false
    if (nurRund.value && !s.rund) return false
    if (nurNvg.value && !s.nvg) return false
    if (!q) return true
    return [s.name, s.kurz, s.betreiber, s.muster, s.kennung, s.region,
            s.funkbereich].some(v => (v || '').toLowerCase().includes(q))
  })
})

const sichtbar = computed(() => new Set(gefiltert.value.map(s => s.id)))

/** Kennzahlen aus den Daten statt von Hand im Text -- sonst driften sie. */
const auswertung = computed(() => {
  const st = daten.stationen
  const je = {}
  for (const s of st) je[s.land] = (je[s.land] || 0) + 1
  return {
    gesamt: st.length,
    laender: Object.entries(je).sort((a, b) => b[1] - a[1])
      .map(([k, n]) => ({ k, name: LAENDER[k] || k, n })),
    rund: st.filter(s => s.rund).length,
    winde: st.filter(s => s.winde).length,
    nvg: st.filter(s => s.nvg).length,
    tau: st.filter(s => s.tau).length,
    primaer: st.filter(s => s.einsatzart === 'PRIMARY').length,
    doppelt: st.filter(s => s.einsatzart === 'DUAL_USE').length,
    verlegung: st.filter(s => s.einsatzart === 'SECONDARY').length
  }
})
const aktiv = computed(() => gewaehlt.value || beruehrt.value)

function farbe (s) {
  if (s.einsatzart === 'SECONDARY') return 'var(--var-signal)'
  if (s.einsatzart === 'DUAL_USE') return 'var(--var-gold)'
  return 'var(--kt-primaer)'
}

/** Karte fuer die Kurzinfo so setzen, dass sie im Bild bleibt. */
const kartePos = computed(() => {
  const s = aktiv.value
  if (!s) return null
  const rechts = s.x > daten.breite * 0.58
  const unten = s.y > daten.hoehe * 0.62
  return {
    left: rechts ? 'auto' : (s.x / daten.breite * 100) + '%',
    right: rechts ? ((1 - s.x / daten.breite) * 100) + '%' : 'auto',
    top: unten ? 'auto' : (s.y / daten.hoehe * 100) + '%',
    bottom: unten ? ((1 - s.y / daten.hoehe) * 100) + '%' : 'auto'
  }
})

function zuruecksetzen () {
  suche.value = ''; land.value = ''; art.value = ''
  nurWinde.value = nurRund.value = nurNvg.value = false
  gewaehlt.value = null
}
</script>

<template>
  <div class="kt">
    <!-- ------------------------------------------------------- Filter -->
    <div class="kt-filter">
      <input v-model="suche" type="search" class="kt-suche"
             placeholder="Funkrufname, Betreiber, Muster, Kennung …"
             aria-label="Stationen durchsuchen">

      <select v-model="land" aria-label="Land">
        <option value="">Alle Länder</option>
        <option v-for="l in laenderListe" :key="l.k" :value="l.k">
          {{ l.name }} ({{ l.n }})
        </option>
      </select>

      <select v-model="art" aria-label="Einsatzart">
        <option value="">Jede Einsatzart</option>
        <option value="PRIMARY">Primärrettung</option>
        <option value="DUAL_USE">Primär und Verlegung</option>
        <option value="SECONDARY">Verlegung (ITH)</option>
      </select>

      <label class="kt-schalter"><input type="checkbox" v-model="nurWinde"> Winde</label>
      <label class="kt-schalter"><input type="checkbox" v-model="nurRund"> 24 h</label>
      <label class="kt-schalter"><input type="checkbox" v-model="nurNvg"> NVG</label>

      <button type="button" class="kt-zurueck" @click="zuruecksetzen">Zurücksetzen</button>
    </div>

    <p class="kt-zahl">
      <b>{{ gefiltert.length }}</b> von {{ daten.stationen.length }} Stationen
      <span v-if="gefiltert.length !== daten.stationen.length"> · gefiltert</span>
    </p>

    <!-- --------------------------------------------------------- Karte -->
    <div class="kt-buehne">
      <svg :viewBox="`0 0 ${daten.breite} ${daten.hoehe}`" class="kt-svg"
           role="img" aria-label="Karte der Luftrettungszentren im Einsatzraum der VAR">
        <g class="kt-land">
          <path v-for="l in daten.laender" :key="l.iso" :d="l.d"
                :class="['kt-flaeche', l.einsatzgebiet ? 'ist-einsatz' : 'ist-nachbar']"/>
        </g>

        <!-- Erst die ausgefilterten, damit die sichtbaren obenauf liegen -->
        <g class="kt-punkte">
          <circle v-for="s in daten.stationen" :key="'a'+s.id"
                  v-show="!sichtbar.has(s.id)"
                  :cx="s.x" :cy="s.y" r="3" class="kt-punkt ist-aus"/>
        </g>
        <g class="kt-punkte">
          <g v-for="s in gefiltert" :key="s.id">
            <circle v-if="aktiv && aktiv.id === s.id"
                    :cx="s.x" :cy="s.y" r="13" class="kt-halo"/>
            <circle :cx="s.x" :cy="s.y" r="5.5" class="kt-punkt"
                    :style="{ fill: farbe(s) }"
                    tabindex="0" role="button"
                    :aria-label="`${s.name}, ${s.betreiber}, ${s.muster}`"
                    @mouseenter="beruehrt = s" @mouseleave="beruehrt = null"
                    @focus="beruehrt = s" @blur="beruehrt = null"
                    @click="gewaehlt = gewaehlt && gewaehlt.id === s.id ? null : s"
                    @keydown.enter.prevent="gewaehlt = s"
                    @keydown.space.prevent="gewaehlt = s"/>
          </g>
        </g>
      </svg>

      <!-- Kurzinfo -->
      <div v-if="aktiv" class="kt-karte" :style="kartePos">
        <div class="kt-karte-kopf">
          <b>{{ aktiv.name }}</b>
          <span v-if="aktiv.kurz" class="kt-kurz">{{ aktiv.kurz }}</span>
        </div>
        <dl>
          <dt>Betreiber</dt><dd>{{ aktiv.betreiber || '—' }}</dd>
          <dt>Muster</dt><dd>{{ aktiv.muster || '—' }}<span v-if="aktiv.kennung"> · {{ aktiv.kennung }}</span></dd>
          <dt>Ort</dt><dd>{{ aktiv.region || '—' }}<span v-if="aktiv.land"> · {{ LAENDER[aktiv.land] || aktiv.land }}</span></dd>
          <dt v-if="aktiv.funkbereich">Funkbereich</dt><dd v-if="aktiv.funkbereich">{{ aktiv.funkbereich }}</dd>
          <dt>Einsatzart</dt><dd>{{ ART[aktiv.einsatzart] || aktiv.einsatzart || '—' }}</dd>
        </dl>
        <div class="kt-merkmale">
          <span :class="['kt-m', aktiv.rund && 'an']">24 h</span>
          <span :class="['kt-m', aktiv.winde && 'an']">Winde</span>
          <span :class="['kt-m', aktiv.tau && 'an']">Tau</span>
          <span :class="['kt-m', aktiv.nvg && 'an']">NVG</span>
        </div>
      </div>
    </div>

    <div class="kt-legende">
      <span><i style="background:var(--kt-primaer)"></i> Primärrettung</span>
      <span><i style="background:var(--var-gold)"></i> Primär und Verlegung</span>
      <span><i style="background:var(--var-signal)"></i> Verlegung (ITH)</span>
      <span class="kt-hinweis">Zeiger darüber oder mit der Tabulatortaste ansteuern.
        Klick heftet die Karte fest.</span>
    </div>

    <!-- ------------------------------------------------------- Tabelle -->
    <details class="kt-tabelle" open>
      <summary>Alle {{ gefiltert.length }} Stationen als Liste</summary>
      <div class="kt-rollen">
        <table>
          <thead>
            <tr><th>Funkrufname</th><th>Betreiber</th><th>Muster</th><th>Kennung</th>
                <th>Ort</th><th>Art</th><th>Merkmale</th></tr>
          </thead>
          <tbody>
            <tr v-for="s in gefiltert" :key="s.id"
                :class="{ 'ist-aktiv': aktiv && aktiv.id === s.id }"
                @mouseenter="beruehrt = s" @mouseleave="beruehrt = null">
              <td><b>{{ s.name }}</b></td>
              <td>{{ s.betreiber || '—' }}</td>
              <td>{{ s.muster || '—' }}</td>
              <td class="kt-kennung">{{ s.kennung || '—' }}</td>
              <td>{{ s.region || '—' }}<span class="kt-land-kurz"> {{ s.land }}</span></td>
              <td>{{ (ART[s.einsatzart] || '—').replace(' und Verlegung', '+V') }}</td>
              <td class="kt-mini">
                <span v-if="s.rund">24 h</span><span v-if="s.winde">Winde</span>
                <span v-if="s.tau">Tau</span><span v-if="s.nvg">NVG</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </details>

    <div class="kt-auswertung">
      <div>
        <h4>{{ auswertung.gesamt }} Stationen in {{ auswertung.laender.length }} Ländern</h4>
        <ul>
          <li v-for="l in auswertung.laender" :key="l.k">
            <span>{{ l.name }}</span><b>{{ l.n }}</b>
          </li>
        </ul>
      </div>
      <div>
        <h4>Merkmale</h4>
        <ul>
          <li><span>Rund um die Uhr</span><b>{{ auswertung.rund }}</b></li>
          <li><span>Rettungswinde</span><b>{{ auswertung.winde }}</b></li>
          <li><span>Nachtflug (NVG)</span><b>{{ auswertung.nvg }}</b></li>
          <li><span>Festtau</span><b>{{ auswertung.tau }}</b></li>
        </ul>
      </div>
      <div>
        <h4>Einsatzart</h4>
        <ul>
          <li><span>Primärrettung</span><b>{{ auswertung.primaer }}</b></li>
          <li><span>Primär und Verlegung</span><b>{{ auswertung.doppelt }}</b></li>
          <li><span>Verlegung (ITH)</span><b>{{ auswertung.verlegung }}</b></li>
        </ul>
      </div>
    </div>

    <details v-if="daten.ausgelassen && daten.ausgelassen.length" class="kt-ausgelassen">
      <summary>{{ daten.ausgelassen.length }} Einträge aus dem Bestand nicht übernommen</summary>
      <ul>
        <li v-for="(a, i) in daten.ausgelassen" :key="i">
          <b>{{ a.name }}</b> — {{ a.grund }}
        </li>
      </ul>
      <p>Der Bestand der Leitstelle führt {{ daten.stationen.length + daten.ausgelassen.length }}
        Einträge. Was hier herausfällt und warum, steht in
        <code>scripts/karte-bauen.py</code>.</p>
    </details>

    <p class="kt-quelle">
      Quelle: Lagebild der Leitstelle (<code>/api/stations</code>), Stand
      <b>{{ daten.stand || 'unbekannt' }}</b>. Eingebacken beim Bauen — der Endpunkt
      erlaubt keine Abfrage aus dem Browser einer anderen Adresse.
      Umrisse: Natural Earth, gemeinfrei.
    </p>
  </div>
</template>

<style scoped>
.kt {
  --kt-primaer: #2e7d46;
  margin: 24px 0 8px;
}
:global(.dark) .kt { --kt-primaer: #3fbf74; }

/* ----------------------------------------------------------- Filter */
.kt-filter {
  display: flex; flex-wrap: wrap; gap: 8px; align-items: center;
  margin-bottom: 12px;
}
.kt-filter input[type="search"], .kt-filter select {
  font: inherit; font-size: 14px;
  padding: 7px 10px;
  border: 1px solid var(--vp-c-border);
  border-radius: 2px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
}
.kt-suche { flex: 1 1 260px; min-width: 0; }
.kt-schalter {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 14px; padding: 7px 11px;
  border: 1px solid var(--vp-c-border); border-radius: 2px;
  cursor: pointer; user-select: none;
}
.kt-schalter:has(input:checked) {
  border-color: var(--var-gold);
  background: var(--vp-c-brand-soft);
}
.kt-zurueck {
  font: inherit; font-size: 14px; padding: 7px 12px; cursor: pointer;
  background: transparent; color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-border); border-radius: 2px;
}
.kt-zurueck:hover { border-color: var(--var-gold); color: var(--vp-c-text-1); }
.kt-zahl { font-size: 14px; color: var(--vp-c-text-2); margin: 0 0 10px; }
.kt-zahl b { color: var(--vp-c-text-1); }

/* ------------------------------------------------------------ Karte */
.kt-buehne {
  position: relative;
  border: 1px solid var(--vp-c-divider);
  border-radius: 2px;
  background: var(--vp-c-bg-alt);
  overflow: hidden;
}
.kt-svg { display: block; width: 100%; height: auto; }
.kt-flaeche { stroke: var(--vp-c-divider); stroke-width: 1; }
.ist-einsatz { fill: var(--vp-c-bg); }
.ist-nachbar { fill: transparent; stroke-dasharray: 3 4; }

.kt-punkt {
  stroke: var(--vp-c-bg); stroke-width: 1.5;
  cursor: pointer; transition: r .12s ease;
}
.kt-punkt:hover, .kt-punkt:focus-visible { r: 8; outline: none; }
.kt-punkt:focus-visible { stroke: var(--var-gold); stroke-width: 2.5; }
.ist-aus { fill: var(--vp-c-text-3); opacity: .2; pointer-events: none; }
.kt-halo { fill: var(--var-gold); opacity: .22; pointer-events: none; }

/* --------------------------------------------------------- Kurzinfo */
.kt-karte {
  position: absolute; z-index: 5;
  min-width: 230px; max-width: 300px;
  margin: 14px;
  padding: 13px 15px 12px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-left: 4px solid var(--var-gold);
  border-radius: 2px;
  box-shadow: 0 6px 22px rgba(0, 17, 58, .18);
  pointer-events: none;
  font-size: 13.5px; line-height: 1.5;
}
.kt-karte-kopf { display: flex; align-items: baseline; gap: 8px; margin-bottom: 8px; }
.kt-karte-kopf b { font-size: 15px; color: var(--vp-c-text-1); }
.kt-kurz {
  font-size: 10.5px; letter-spacing: .1em; color: var(--vp-c-text-3);
}
.kt-karte dl {
  display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: 0;
}
.kt-karte dt {
  font-size: 10.5px; letter-spacing: .1em; text-transform: uppercase;
  color: var(--vp-c-text-3); align-self: baseline;
}
.kt-karte dd { margin: 0; color: var(--vp-c-text-1); }
.kt-merkmale { display: flex; gap: 5px; margin-top: 10px; flex-wrap: wrap; }
.kt-m {
  font-size: 10.5px; letter-spacing: .08em; text-transform: uppercase;
  padding: 2px 7px; border-radius: 2px;
  border: 1px solid var(--vp-c-divider); color: var(--vp-c-text-3);
}
.kt-m.an {
  border-color: var(--var-gold); color: var(--var-akz);
  background: var(--vp-c-brand-soft); font-weight: 700;
}

/* --------------------------------------------------------- Legende */
.kt-legende {
  display: flex; flex-wrap: wrap; gap: 16px; align-items: center;
  margin-top: 10px; font-size: 13px; color: var(--vp-c-text-2);
}
.kt-legende span { display: inline-flex; align-items: center; gap: 7px; }
.kt-legende i { width: 11px; height: 11px; border-radius: 50%; display: block; }
.kt-hinweis { color: var(--vp-c-text-3); font-size: 12.5px; }

/* --------------------------------------------------------- Tabelle */
.kt-tabelle { margin-top: 20px; }
.kt-tabelle summary {
  cursor: pointer; font-size: 14px; color: var(--vp-c-text-2);
  padding: 6px 0;
}
.kt-rollen { overflow-x: auto; max-height: 460px; overflow-y: auto;
  border: 1px solid var(--vp-c-divider); border-radius: 2px; margin-top: 6px; }
.kt-rollen table { width: 100%; min-width: 720px; border-collapse: collapse; font-size: 13.5px; }
.kt-rollen th {
  position: sticky; top: 0; z-index: 1;
  background: var(--vp-c-bg-alt); text-align: left;
  font-size: 10.5px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--vp-c-text-2); padding: 9px 12px;
  border-bottom: 1px solid var(--vp-c-divider); white-space: nowrap;
}
.kt-rollen td { padding: 8px 12px; border-bottom: 1px solid var(--vp-c-divider); }
.kt-rollen tr:last-child td { border-bottom: 0; }
.kt-rollen tr.ist-aktiv { background: var(--vp-c-brand-soft); }
.kt-kennung { font-family: var(--vp-font-family-mono); font-size: 12px; }
.kt-rollen td, .kt-zahl { font-feature-settings: var(--var-ziffern); }
/* --vp-c-text-3 ergibt bei 11 px nur 4,3:1. */
.kt-land-kurz { color: var(--vp-c-text-2); font-size: 11px; letter-spacing: .08em; }
.kt-mini { white-space: nowrap; }
.kt-mini span {
  font-size: 10px; letter-spacing: .07em; text-transform: uppercase;
  padding: 1px 5px; margin-right: 3px; border-radius: 2px;
  border: 1px solid var(--var-gold); color: var(--var-akz);
}
/* ----------------------------------------------------- Auswertung */
.kt-auswertung {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px;
  background: var(--vp-c-divider); border: 1px solid var(--vp-c-divider);
  margin-top: 22px;
}
.kt-auswertung > div { background: var(--vp-c-bg); padding: 16px 18px 18px; }
.kt-auswertung h4 {
  margin: 0 0 10px; font-size: 11px; font-weight: 700; letter-spacing: .13em;
  text-transform: uppercase; color: var(--var-akz);
}
.kt-auswertung ul { list-style: none; margin: 0; padding: 0; }
.kt-auswertung li {
  display: flex; justify-content: space-between; align-items: baseline; gap: 12px;
  padding: 3px 0; font-size: 14px; color: var(--vp-c-text-2);
}
.kt-auswertung li b {
  color: var(--vp-c-text-1);
  /* Uniform kennt kein tnum -- der gleich breite Satz heisst hier lnum. */
  font-feature-settings: var(--var-ziffern);
}
@media (max-width: 720px) { .kt-auswertung { grid-template-columns: 1fr; } }

.kt-ausgelassen { margin-top: 14px; font-size: 13.5px; }
.kt-ausgelassen summary { cursor: pointer; color: var(--vp-c-text-2); padding: 6px 0; }
.kt-ausgelassen ul { margin: 6px 0 8px; padding-left: 20px; color: var(--vp-c-text-2); }
.kt-ausgelassen p { color: var(--vp-c-text-3); font-size: 12.5px; margin: 0; }

.kt-quelle { font-size: 12.5px; color: var(--vp-c-text-3); margin-top: 14px; }

@media (max-width: 640px) {
  .kt-suche { flex-basis: 100%; }
  .kt-karte { position: static; margin: 10px 0 0; max-width: none; }
}
@media (prefers-reduced-motion: reduce) {
  .kt-punkt { transition: none; }
}
</style>
