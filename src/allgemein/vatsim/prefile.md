# VATSIM Prefile Flugplan

Um auf VATSIM online zu fliegen, ist es erforderlich, einen Flugplan aufzugeben. In diesen Flugplan kann man relevante Informationen eintragen, die für Lotsen auf dem Netzwerk von nöten sind.
Hierzu haben wir folgend ein Beispiel:

```
(FPL-CALLSIGN-IG
-EC45/L-SDGIJ7RY/S
-ZZZZxxxx
-N0110F025 VFR RESCUE MISSIONS
-ZZZZxxxx
-PBN/D1 DOF/**240926** REG/DHxxx OPR/VAR COM/VIRTUALAIRRESCUE.COM ORGN/EDDZZPZX RMK/IFPSRA)
```

:::info

- **CALLSIGN** bitte durch das ICAO Callsign ersetzen. Beispiel: **CHX53**
- **ZZZZ** ist der ICAO Code. Wir nutzen ZZZZ als Platzhalter.
- **xxxx** ist die UTC Zeit. Beispiel: 0850
- **DOF/** bitte durch das aktuelle Datum ersetzen: **JJMMTT** (Jahr Jahr Monat Monat Tag Tag)
- **OPR/** bitte hier VAR eintragen.
- **COM/** VIRTUALAIRRESCUE.COM eintragen.
  :::

---

Mit dem folgenden Link kannst du einen vorausgefüllten PreFile-Flugplan öffnen.

Wichtig: Bitte ändere entsprechend deines Fluges das
:::danger Wichtig

### Bitte ändere entsprechend deines Fluges folgende Einträge:

- **Callsign**

- **Aircraft Type (ICAO)**

- **DOF/**

- **REG/**
  :::

> **[Bitte bei my.vatsim.net einloggen, dann diesen Link anklicken und o.g. Parameter anpassen!](https://my.vatsim.net/pilots/flightplan?raw=%28FPL-CHXzzz-VS+-EC45%2FL-SDGIJ7RY%2FS+-ZZZZ2035+-N0110F025+VFR+-ZZZZ0120+-PBN%2FD1+REG%2FDHxxx+OPR%2FVAR+COM%2FVIRTUALAIRRESCUE.COM+RMK%2FTCAS%29&fuel_time=0130)**
