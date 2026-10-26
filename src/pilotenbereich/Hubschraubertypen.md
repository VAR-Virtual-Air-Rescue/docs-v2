# Hier eine Übersicht über alle Hubschraubertypen mit ICAO Code

Hier findet ihr eine Liste der bei uns verfügbaren Hubschraubermodelle mit den
passenden ICAO-Codes, falls ihr online, z. B. auf VATSIM, fliegen möchtet.

| **Hubschraubermodell** | **ICAO Code** |
| ------------------ | --------- |
| **A109**           | A109      |
| **AS350**          | AS50      |
| **AS365**          | AS65      |
| **B429**           | B429      |
| **BK117**          | BK17      |
| **EC135**          | EC35      |
| **EC155**          | EC55      |
| **H135**           | EC35      |
| **H145**           | EC45      |
| **NH90**           | NH90      |
| **R44**            | R44       |

## Verfügbare Luftfahrzeuge

Die folgende Übersicht zeigt die Flugzeugmodelle, die aktuell bei der VAR
geflogen werden können.

<script setup>
import daten from '../.data/stationen.json'

const ausgeblendeteMuster = new Set([
  'A109', 'AS350', 'AS365', 'B429', 'BK117', 'EC135', 'EC155',
  'H135', 'H145', 'MD900', 'NH90', 'R44'
])
const luftfahrzeuge = [...new Map(
  daten.stationen
    .filter(station => station.muster && !ausgeblendeteMuster.has(station.muster))
    .map(station => [
      `${station.muster}\0${station.icao || ''}`,
      { name: station.muster, icao: station.icao }
    ])
)].map(([, luftfahrzeug]) => luftfahrzeug)
  .sort((a, b) => a.name.localeCompare(b.name))
</script>

<table>
  <thead>
    <tr>
      <th><strong>Luftfahrzeug</strong></th>
      <th><strong>ICAO Code</strong></th>
    </tr>
  </thead>
  <tbody>
    <tr
      v-for="luftfahrzeug in luftfahrzeuge"
      :key="`${luftfahrzeug.name}-${luftfahrzeug.icao || ''}`"
    >
      <td><strong>{{ luftfahrzeug.name }}</strong></td>
      <td>{{ luftfahrzeug.icao || '—' }}</td>
    </tr>
  </tbody>
</table>
