# Funkbeispiel

## Primäreinsatz

Zur Orientierung haben wir hier ein Funkbeispiel für einen Primäreinsatz erstellt, welches alle wichtigen Einsatzabschnitte abdeckt und einen Realeinsatz so gut wie möglich abbilden soll.

::: warning 10:00 Uhr ➜ Die Leistelle alarmiert das Rettungsmittel
Innerhalb der nächsten drei Minuten sendet das Luftrettungsmittel Status 3 zur Leitstelle, um <b>wortlos</b> die Einsatzübernahme zu quittieren.
:::

::: warning CHX 69 ➜ 10:02 Uhr ➜ Status 3
:::

Der kommende Einsatzabschnitt kann theoretisch komplett ohne Kommunikation verlaufen, hier hat die Leitstelle aber noch einige Informationen für den Hubschrauber.

::: info Leitstelle ➜ 10:05 Uhr
<strong>"Christoph 69 von Leitstelle VAR, kommen."</strong>

  <p>Die Leitstelle baut das Gespräch mit dem Luftrettungsmittel auf.</p>
:::

::: warning CHX69 ➜ 10:05 Uhr
<strong>"Hier Christoph 69, kommen."</strong>
:::

::: info Leitstelle ➜ 10:05 Uhr
<strong>
"Einsatz in der VAR-Straße 187 ist eine Nachforderung vom RTW, Patient
bewusstlos, kommen."
</strong>
:::

::: warning CHX69 ➜ 10:06 Uhr
<strong>"Einsatz als Nachforderung vom RTW, verstanden, kommen."</strong>
:::

::: info Leitstelle ➜ 10:06 Uhr
<strong>"Richtig verstanden, Ende."</strong>
:::

::: warning CHX69 ➜ 10:11 Uhr ➜ Status 4
:::

Der Hubschrauber ist am Einsatzort eingetroffen und das ärztliche Personal versorgt den Patienten.

Nach der Versorgung verständigt sich der Notarzt mit dem aufnehmenden Klinikum und meldet den Patienten an.
Das Luftrettungsmittel verlegt den Patienten im kommenden Einsatzabschnitt. Um der Leitstelle diese Information in Hinblick auf dessen Verfügbarkeit mitzuteilen, versucht die Besatzung ein Gespräch mittels Status 5 - dem klassischen Sprechwunsch - aufzubauen.

::: warning CHX69 ➜ 10:35 Uhr ➜ Status 5
:::

Entweder, die Leistelle schickt den FMS-Status J, die Sprechaufforderung:

:::info Leitstelle ➜ 10:36 Uhr ➜ Status J
:::

::: warning CHX69 ➜ 10:36 Uhr
<strong>
"Hier Christoph 69, Patient aufgenommen, wir fliegen ins Capitol-Klinikum
Finsdorf."
</strong>
:::

oder die Leitstelle baut den Ruf verbal auf:

:::info Leitstelle ➜ 10:36 Uhr
<strong>"Christoph 69 von Leitstelle VAR, kommen."</strong>
:::

::: warning CHX69 ➜ 10:36 Uhr
<strong>
"Hier Christoph 69, Patient aufgenommen, wir fliegen ins Capitol-Klinikum
Finsdorf, kommen."
</strong>
:::

:::info Leitstelle ➜ 10:36 Uhr
<strong>"Verstanden, Ende."</strong>

  <p>
    Die Leistelle kann als übergeordneter Gesprächsteilnehmer den Ruf - wie in
    diesem Fall - auch vorzeitig beenden.
  </p>
:::

::: warning CHX69 ➜ 10:37 Uhr ➜ Status 7
:::

Der Hubschrauber macht sich auf den Weg nach Finsdorf. Dort angekommen setzt er den Status 8.

**Eine Kommunikation mit der Leitstelle in der Zwischenzeit ist in der Regel nicht erforderlich.**

Am Zielort angekommen teilt die Besatzung der Leitstelle mittels Status 8 mit, dass der Patient zum einen in das Klinikum verbracht wurde und das Luftrettungsmittel zum anderen auf Nachfrage bedingt für einen kommenden Einsatz abkömmlich ist.

::: warning CHX69 ➜ 10:49 Uhr ➜ Status 8
:::

::: warning CHX69 ➜ 11:05 Uhr ➜ Status 1
Der Hubschrauber ist wieder einsatzbereit und fliegt zurück zum
Luftrettungszentrum.
:::

::: warning CHX69 ➜ 11:18 Uhr ➜ Status 2
:::

Ab hier geht es dann wieder [von vorne los.](#primareinsatz)
