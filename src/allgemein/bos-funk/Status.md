# Status

Der _Status_ eines Rettungsmittels wurde lange per FMS ("Funkmeldesystem") übertragen. Seit der Einführung des Digitalfunks weicht das sogenannte "tonfrequente Übertragungssystem" zum Senden von Statusmeldungen dem SDS (**S**hort **D**ata **S**ervice). Dieses System im Digitalfunk kann ähnliche Funktionen wie das alte FMS im Analogfunk abdecken. Es dient dem Austausch von Kurznachrichten, ähnlich einer SMS.

SDS ermöglicht die Übertragung von End-To-End verschlüsselten Alarmierungen, GPS-Positionsdaten oder Textnachrichten. Grundlegend besteht eine Statusnachricht aus einer fünfstelligen Zahl, für die in den TETRA-Endgeräten ein Statustext hinterlegt ist.

Darüber kann auch das Senden von den bekannten zahlengebundenen Statusmeldungen realisiert werden.

Der Vorteil dieser Statusnummern ist die deutliche Reduktion des Funkverkehrs innerhalb einer Leitstellenrufgruppe.

## Statusmeldungen

| **Status** |       **Bedeutung**        | **Details**                                                                                       |
| :--------: | :------------------------: | :------------------------------------------------------------------------------------------------ |
|     0      | Priorisierter Sprechwunsch | Das Einsatzmittel möchte vor allen anderen Kontakt mit der Leitstelle aufnehmen.                  |
|     1      |  Einsatzbereit über Funk   | Das Einsatzmittel kann nach Rücksprache und abhängig vom Standort alarmiert werden.               |
|     2      | Einsatzbereit am Standort  | Das Einsatzmittel kann am Heimatstandort alarmiert werden.                                        |
|     3      |     Einsatz übernommen     | Das Einsatzmittel hat den Auftrag angenommen und befindet sich auf Anfahrt.                       |
|     4      |   Ankunft am Einsatzort    | Das Einsatzmittel ist mit der Abarbeitung vor Ort beschäftigt und nur bedingt erreichbar.         |
|     5      |        Sprechwunsch        | Das Einsatzmittel möchte Kontakt mit der Leitstelle aufnehmen.                                    |
|     6      |    Nicht einsatzbereit     | Das Einsatzmittel kann nicht alarmiert werden.                                                    |
|     7      |    Patient aufgenommen     | Das Einsatzmittel hat einen Patienten aufgenommen und kann nicht alarmiert werden.                |
|     8      |     Ankunft am Zielort     | Das Einsatzmittel kann mit einer längeren Reaktionszeit nach Rücksprache alarmiert werden.        |
|     9      |     Fahrzeuganmeldung      | Das Einsatzmittel meldet sich im Funkverkehrsbereich an. Bei der VAR: Meldung nach dem Einloggen. |

## Statusanweisungen

| **Status** |           **Bedeutung**           | **Details**                                                                                     |
| :--------: | :-------------------------------: | :---------------------------------------------------------------------------------------------- |
|     E      |          Einsatzabbruch           | Das Einsatzmittel wird vom Einsatzabgezogen und quittiert mit `2` oder `1`.                     |
|     C      |      Einsatzübernahme melden      | Dem Disponenten muss mit `3` die Übernahme des Einsatzes quittiert werden.                      |
|     F      |       Kommen Sie über Draht       | Das Einsatzmittel muss sich telefonisch (per Discord) beim Disponenten melden.                  |
|     H      |        Fahren Sie Wache an        | Keine Nutzung in der VAR                                                                        |
|     J      | Sprechaufforderung (nach `5`/`0`) | Nicht-mündliche Aufforderung, mit dem Sprechen zu beginnen.                                     |
|     L      |       Geben Sie Lagemeldung       | Die Leitstelle fordert eine Lagemeldung vom Rettungsmittel an.                                  |
|     P      | Einsatz mit Polizei/Pause nehmen  | Keine Nutzung in der VAR                                                                        |
|     U      |      Unerlaubte Statusfolge       | Keine Nutzung in der VAR                                                                        |
|     c      |        Status korrigieren         | Das Einsatzmittel hat einen offensichtlich falschen Status gesetzt und muss diesen korrigieren. |
|     d      |     Transportziel durchgeben      | Die Leitstelle erfragt das Transportziel des Rettungsmittels.                                   |
|     h      |      Zielklinik verständigt       | Die Leitstelle hat die Zielklinik verständigt und positive Rückmeldung erhalten.                |
|     o      | Warten, alle Abfrageplätze belegt | Das Rettungsmittel muss auf die Sprechaufforderung warten.                                      |
|     u      |            Verstanden             | Die Leitstelle hat die Informationen aufgenommen und verstanden.                                |

:::info Status 5
In vielen Leitstellen kann ein Gespräch nur über das Senden des Status 5 initiiert werden, da der Disponent den Funk innerhalb seiner Rufgruppe nicht ständig mithört. Auch bei uns wird der Sprechwunsch mittels Status 5 von vielen Disponenten erwartet und immer vor mündlichen Sprechwünschen priorisiert.
:::

:::info Status 9
Die vergangenen Monate haben gezeigt, dass die Implementierung eines Status 9 sinnvoll ist. In Realität ist das in vielen Leitstellenbereichen die Anmeldung in einer fremden Rufgruppe (analog zu Status 5).
VAR-intern kann der Status 9 dann genutzt werden, wenn man sich eingeloggt hat und dem Disponenten diesen Umstand mitteilen möchte. Die Reaktion darauf wird dann `u` sein. Somit wird die Rufgruppe frei von
"Funksprechproben" oder versteckten Hinweisen auf die Einsatzbereitschaft eines Einsatzmittels gehalten. Solltet ihr eure Audio-Einstellungen überprüfen wollen, tut das bitte in den Einstellungen selbst. Das indirekte Betteln nach schnellen Einsätzen mit wiederholtem Drücken von Status 9
ist nicht erwünscht und wird entsprechend geahndet. Sollte das Rettungsmittel durch Witterung und Zeit nur beschränkt bzw. unter Auflagen alarmierbar sein, ist das nach wie vor mit Status 5 mitzuteilen.
:::
