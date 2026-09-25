# -*- coding: utf-8 -*-
"""Datengrundlage der Stationskarte erzeugen.

Zwei Dinge, beide **einmalig beim Bauen**, nicht zur Laufzeit:

1. Die Stationen aus der Leitstelle holen und auf das reduzieren, was die Karte
   zeigt. Der Endpunkt ist oeffentlich lesbar, schickt aber **kein**
   `Access-Control-Allow-Origin` -- ein Browser auf docs.virtualairrescue.com
   darf ihn also nicht abfragen. Deshalb wird eingebacken statt live geladen.
   Nebenwirkung: die Karte laedt sofort und funktioniert auch, wenn die
   Leitstelle gerade nicht erreichbar ist.

2. Die Laenderumrisse. Quelle ist Natural Earth (gemeinfrei, keine Namensnennung
   noetig, https://www.naturalearthdata.com). Der Datensatz wird auf den
   Einsatzraum beschnitten, vereinfacht und als fertige SVG-Pfade abgelegt --
   damit im Repo kein 3-MB-GeoJSON liegt.

Aufruf:  python scripts/karte-bauen.py
"""
import io, json, math, os, sys, urllib.request

HIER = os.path.dirname(os.path.abspath(__file__))
ZIEL = os.path.join(os.path.dirname(HIER), "src", ".data")
os.makedirs(ZIEL, exist_ok=True)

API = "https://ops.virtualairrescue.com/api/stations"
NE = ("https://raw.githubusercontent.com/nvkelso/natural-earth-vector/"
      "master/geojson/ne_50m_admin_0_countries.geojson")

# Der Einsatzraum: Deutschland, Oesterreich, Schweiz, Niederlande, Luxemburg,
# Belgien -- plus die Nachbarn, damit die Karte nicht in der Luft haengt.
EINSATZ = {"DE", "AT", "CH", "NL", "LU", "BE"}
NACHBARN = {"FR", "IT", "CZ", "PL", "DK", "SI", "LI", "GB", "SK", "HU", "HR"}

# Ausschnitt in Grad
LON0, LON1 = 2.0, 18.0
LAT0, LAT1 = 44.5, 55.6

BREITE = 1000.0   # Bezugsbreite der SVG-Zeichnung


def merc_y(lat):
    """Web-Mercator, damit die Umrisse aussehen wie auf jeder anderen Karte."""
    return math.log(math.tan(math.pi / 4 + math.radians(lat) / 2))


# Bildschirmkoordinaten laufen nach unten, geografische Breite nach oben.
# Oben im Bild liegt also LAT1 (Norden), unten LAT0.
Y_OBEN = merc_y(LAT1)
Y_UNTEN = merc_y(LAT0)
SPANNE_X = LON1 - LON0
SPANNE_Y = Y_OBEN - Y_UNTEN                  # positiv

# In der Mercator-Abbildung haben x und y denselben Massstab. Wird die Breite
# auf BREITE abgebildet, folgt die Hoehe daraus zwingend -- sonst waere die
# Karte verzerrt.
HOEHE = BREITE * SPANNE_Y / math.radians(SPANNE_X)


def projiziere(lon, lat):
    x = (lon - LON0) / SPANNE_X * BREITE
    y = (Y_OBEN - merc_y(lat)) / SPANNE_Y * HOEHE
    return x, y


# ---------------------------------------------------------------- 1 Stationen
def hole(url):
    req = urllib.request.Request(url, headers={"User-Agent": "VAR-Docs-Build"})
    with urllib.request.urlopen(req, timeout=90) as r:
        return json.load(r)


print("Stationen holen ...")
roh = hole(API)
print("  %d Datensaetze" % len(roh))

# Eintraege, die im Bestand stehen, aber nicht in eine Wissensdatenbank gehoeren.
# Bewusst als sichtbare Regel und nicht still: was hier herausfaellt, wird unten
# aufgelistet und steht als Hinweis auf der Seite.
import re
RAUS = re.compile("NICHT NUTZEN|DEV[ ]*[0-9]|(^|[ ])Test([ ]|$)", 2)

stationen = []
ausgelassen = []
for s in roh:
    if s.get("latitude") is None or s.get("longitude") is None:
        ausgelassen.append((s.get("bosCallsign"), "ohne Koordinate"))
        continue
    if RAUS.search((s.get("bosCallsign") or "") + " " + (s.get("bosCallsignShort") or "")):
        ausgelassen.append((s.get("bosCallsign"), "Platzhalter oder Testeintrag"))
        continue
    # Ausserhalb des Kartenausschnitts? Dann stimmt entweder der Ausschnitt
    # nicht oder der Datensatz. Den Ausschnitt fuer einen einzelnen Ausreisser
    # aufzureissen wuerde die Karte fuer alle anderen unbrauchbar machen.
    if not (LAT0 <= s["latitude"] <= LAT1 and LON0 <= s["longitude"] <= LON1):
        ausgelassen.append((s.get("bosCallsign"),
                            "liegt ausserhalb des Einsatzraums (%.2f N, %.2f O)"
                            % (s["latitude"], s["longitude"])))
        continue

    x, y = projiziere(s["longitude"], s["latitude"])
    stationen.append({
        "id": s.get("id"),
        "name": s.get("bosCallsign") or s.get("bosCallsignShort") or "?",
        "kurz": s.get("bosCallsignShort"),
        "land": s.get("country"),
        "region": s.get("locationState"),
        "funkbereich": s.get("bosRadioArea"),
        "betreiber": s.get("operator"),
        "muster": s.get("aircraft"),
        "kennung": s.get("aircraftRegistration"),
        "einsatzart": s.get("bosUse"),
        "winde": bool(s.get("hasWinch")),
        "tau": bool(s.get("hasRope")),
        "nvg": bool(s.get("hasNvg")),
        "rund": bool(s.get("is24h")),
        "lat": round(s["latitude"], 5),
        "lon": round(s["longitude"], 5),
        "x": round(x, 1),
        "y": round(y, 1),
    })

stationen.sort(key=lambda s: (s["land"] or "", s["name"] or ""))

# ------------------------------------------------------------- 2 Laenderumriss
print("Laenderumrisse holen ...")
geo = hole(NE)


def beschneide(ring):
    """Ring auf den Ausschnitt begrenzen und vereinfachen.

    Kein echtes Clipping: Punkte weit ausserhalb werden auf den Rand gezogen.
    Fuer eine Uebersichtskarte reicht das und spart viel Rechnerei.
    """
    aus = []
    for lon, lat in ring:
        lon = min(max(lon, LON0 - 2), LON1 + 2)
        lat = min(max(lat, LAT0 - 2), LAT1 + 2)
        aus.append(projiziere(lon, lat))
    return aus


def vereinfache(punkte, eps=1.2):
    """Douglas-Peucker, damit aus 3 MB GeoJSON ein paar KB Pfad werden."""
    if len(punkte) < 3:
        return punkte
    ax, ay = punkte[0]
    bx, by = punkte[-1]
    dx, dy = bx - ax, by - ay
    laenge = math.hypot(dx, dy)
    weit, idx = 0.0, 0
    for i in range(1, len(punkte) - 1):
        px, py = punkte[i]
        if laenge == 0:
            d = math.hypot(px - ax, py - ay)
        else:
            d = abs(dy * px - dx * py + bx * ay - by * ax) / laenge
        if d > weit:
            weit, idx = d, i
    if weit <= eps:
        return [punkte[0], punkte[-1]]
    return (vereinfache(punkte[:idx + 1], eps)[:-1]
            + vereinfache(punkte[idx:], eps))


def zu_pfad(polys):
    teile = []
    for ring in polys:
        if len(ring) < 3:
            continue
        d = "M" + " ".join("%.1f,%.1f" % (x, y) for x, y in ring) + "Z"
        teile.append(d)
    return "".join(teile)


laender = []
sys.setrecursionlimit(10000)
for f in geo["features"]:
    p = f["properties"]
    iso = p.get("ISO_A2_EH") or p.get("ISO_A2") or ""
    if iso not in EINSATZ | NACHBARN:
        continue
    g = f["geometry"]
    polys = g["coordinates"] if g["type"] == "MultiPolygon" else [g["coordinates"]]
    ringe = []
    for poly in polys:
        aussen = poly[0]
        # Inseln und Splitter weglassen, die im Ausschnitt nichts beitragen
        lons = [c[0] for c in aussen]
        lats = [c[1] for c in aussen]
        if max(lons) < LON0 - 2 or min(lons) > LON1 + 2:
            continue
        if max(lats) < LAT0 - 2 or min(lats) > LAT1 + 2:
            continue
        if len(aussen) < 8:
            continue
        r = vereinfache(beschneide(aussen), 1.2)
        if len(r) >= 3:
            ringe.append(r)
    if not ringe:
        continue
    laender.append({
        "iso": iso,
        "name": p.get("NAME_DE") or p.get("NAME") or iso,
        "einsatzgebiet": iso in EINSATZ,
        "d": zu_pfad(ringe),
    })

laender.sort(key=lambda l: (not l["einsatzgebiet"], l["iso"]))

# ------------------------------------------------------------------ schreiben
daten = {
    "stand": None,       # wird vom Aufrufer gesetzt, siehe unten
    "quelle": API,
    "umrissQuelle": "Natural Earth (gemeinfrei), ne_50m_admin_0_countries",
    "ausschnitt": {"lon": [LON0, LON1], "lat": [LAT0, LAT1]},
    "breite": round(BREITE, 1),
    "hoehe": round(HOEHE, 1),
    "ausgelassen": [{"name": n, "grund": g} for n, g in ausgelassen],
    "laender": laender,
    "stationen": stationen,
}

if "--stand" in sys.argv:
    daten["stand"] = sys.argv[sys.argv.index("--stand") + 1]

pfad = os.path.join(ZIEL, "stationen.json")
io.open(pfad, "w", encoding="utf-8").write(
    json.dumps(daten, ensure_ascii=False, separators=(",", ":")))

print()
print("geschrieben: %s" % pfad)
print("  %d Stationen, %d Laender, %.0f KB"
      % (len(stationen), len(laender), os.path.getsize(pfad) / 1024))
laender_zahl = {}
for s in stationen:
    laender_zahl[s["land"]] = laender_zahl.get(s["land"], 0) + 1
print("  je Land: " + ", ".join("%s %d" % kv for kv in sorted(laender_zahl.items())))
print("  mit Winde: %d | 24 h: %d | NVG: %d | Tau: %d"
      % (sum(s["winde"] for s in stationen), sum(s["rund"] for s in stationen),
         sum(s["nvg"] for s in stationen), sum(s["tau"] for s in stationen)))
if ausgelassen:
    print()
    print("  nicht uebernommen (%d):" % len(ausgelassen))
    for nm, warum in ausgelassen:
        print("    %-26s %s" % (nm, warum))
