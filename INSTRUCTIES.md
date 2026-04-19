# Zwemtraining Instructies

## Doel

Dit bestand bundelt alles wat nu bekend is over de systematische opzet van zwemtrainingen.

Het doel is een werkwijze in 2 stappen:

1. Eerst een trainingskalender maken.
2. Daarna per trainingssessie de echte training genereren.

## Werkafspraak

- `INSTRUCTIES.md` is het centrale bronbestand voor trainingsgeneratie.
- Bij elke inhoudelijke wijziging aan trainingsopzet, schrijfregels of periodisering moet `INSTRUCTIES.md` worden bijgewerkt.
- App-specifieke keuzes, UX en viewer-gedrag horen in `APP_INSTRUCTIES.md`.
- Andere bestanden mogen bestaan, maar `INSTRUCTIES.md` blijft leidend voor trainingsinhoud.

## Bronnen In De Werkmap

### Excel-bronbestand

- Bestand: `Trainingen-junioren-25-26.xlsx`
- Doel: inspiratiebron voor inzwemmen en trainingsblokken

### Gevonden sheets

- `2025`
- `2026`
- `Inzwemmen`
- `BC`
- `SS`
- `RC`
- `VL`
- `Overig`
- `WS`

### Wat uit het Excel-bestand bekend is

- De sheets `2025` en `2026` bevatten trainingsdagen met uitgewerkte sessies.
- Er is een herkenbare opbouw met `INZWEMMEN` en `KERN`-blokken.
- De slagen `BC`, `SS`, `RC`, `VL` en `WS` worden apart gebruikt.
- Er zijn tientallen inzwemblokken aanwezig als inspiratie.
- Er zijn veel voorbeeldblokken voor techniek, conditie en andere trainingsdoelen.

## Vaste Uitgangspunten

- Seizoen loopt van half augustus tot begin juli.
- Voor de eerste opzet gebruiken we een fictief seizoen `2026-2027`.
- Trainingsdagen zijn maandag, woensdag, vrijdag en zaterdag.
- Elke training duurt `60` minuten.
- Wedstrijden zijn op zondag.
- Er zijn ongeveer `2` wedstrijden per maand.
- Er wordt niet getraind tijdens schoolvakanties.
- Regio voor vakanties is `midden`.
- Output mag in `Markdown` worden geschreven.

## Vaste Trainingsopbouw

- Elke training start met `600m` inzwemmen.
- De afstand van het inzwemmen is altijd vast.
- De inhoud van het inzwemmen is volledig vrij.
- Het inzwemmen mag per training anders zijn.
- Het inzwemmen begint nooit met `WIS`. Altijd eerst opwarmen met een andere slag.
- Het Excel-bestand is de inspiratiebron voor het inzwemmen.

### Kern van de sessie

- Standaard bestaat de training uit `2` blokken.
- Meestal is `1` blok `Techniek`.
- Het andere blok is een ander trainingsdoel.
- Alternatief is `1` lang conditieblok.
- Een lang conditieblok past vooral vroeg in het seizoen.

### Opmaak bloktitel

- De titel van een blok vermeldt altijd: thema, slagafkorting en afstand.
- Formaat: `Blok N` `Thema` `SLAG` `afstand`
- Voorbeeld: `Blok 1` `Techniek` `BC` `800m`
- Als een blok meerdere slagen combineert, staan alle slagen vermeld of wordt `WIS` gebruikt.

### Opmaak set-regels

- Vaste volgorde per regel: `herhaling` `slag` `R:xx` `intensiteit` `-` beschrijving
- Zet altijd een expliciet scheidingsteken `-` tussen de intensiteit en de vrije beschrijving.
- Voorbeeld: `- ` `8x50m` `BC` `R:0:15` `95%` `-` wedstrijdtempo`
- Elke regel begint altijd met `{N}x{afstand}m`, bijvoorbeeld `4x100m` of `2x150m`
- Na het genereren altijd controleren of de benoemde afstanden per blok en het sessietotaal kloppen met de optelsom van de setregels
- Voorbeeld: `4x100m` `BC` `R:0:20` `75%` eerste 50 hard, tweede 50 ontspannen
- Backticks worden gebruikt voor: herhaling, afstand, slagafkorting, rusttijd, intensiteit, slagcombinaties
- Beschrijvingen (instructies, uitleg) staan als gewone tekst achter de codes
- **Elke setregel met een tempo-intentie krijgt altijd een percentage.** Extra duiding mag daarna als tekst volgen.
- Gangbare percentages: `50%` herstel, `70%` rustig, `75%` aëroob, `80%` aëroob hoog, `85-90%` omslagpunt, `95%` wedstrijdtempo, `100%` sprint
- Techniekregels waar "rustig" een uitvoeringsinstructie is (geen tempo-aanduiding) hoeven geen percentage
- Slagen worden altijd als afkorting geschreven: `BC`, `VL`, `RC`, `SS`, `WIS`, `SNK`
- `WIS` betekent wisselslag (alle vier slagen). `IM` is de Engelse term voor hetzelfde en wordt niet gebruikt als slagafkorting.
- Nooit uitgeschreven als 'vlinder', 'rugcrawl', 'schoolslag', etc.
- Trainerinfo per setregel wordt genoteerd als `{{coach: ...}}`
- Voorbeeld: `3x200m` `BC` `R:0:20` `75%` `{{coach: let op lange doorhaal en stabiele ellebooghoogte}}`
- `{{coach: ...}}` hoort direct aan het einde van de setregel
- In elk trainingsblok krijgt elke setregel een trainerinfo. Er is altijd wel een nuttig aandachtspunt voor de trainer.
- Bij het inzwemmen is trainerinfo optioneel: toevoegen wanneer het inhoudelijk iets oplevert, weglaten mag als de regel te basaal is.

## Doel Van Het Systeem

- Elke trainingssessie moet een duidelijk doel hebben.
- Elke trainingssessie krijgt `1` primair thema.
- Elke trainingssessie mag `1` secundair thema krijgen.
- Trainingsdoelen moeten logisch over het seizoen verschuiven.
- Vroeg in het seizoen ligt de nadruk meer op conditie en basis.
- Richting wedstrijden verschuift de nadruk naar snelheid, techniek en wedstrijdspecifiek werk.
- Alle soorten training moeten verdeeld kunnen worden over alle trainingsdagen.
- Dat is nodig omdat zwemmers op verschillende combinaties van dagen trainen.

## Slagen

Wedstrijden en trainingen houden rekening met:

- `BC`
- `SS`
- `RC`
- `VL`
- `WIS`

### Taalregel voor wisselslag

- `WIS` is de enige te gebruiken slagafkorting voor wisselslag.
- `IM` blijft alleen bestaan als themanaam en niet als slagafkorting.

## Thema's

Deze thema's zijn nu vastgelegd voor de trainingskalender:

- `Techniek`
- `Aerobic base`
- `Uithoudingsvermogen`
- `Omslagpunt`
- `Snelheid`
- `Wedstrijdtempo`
- `IM`
- `Start en keerpunt`
- `Herstel`

### Vaste taalregel voor thema's

- `Aerobic base` blijft in het Engels.
- `Aerobic base` wordt voortaan niet meer vertaald.

## Algemene Regels Voor Thematoekenning

- Elke sessie krijgt een primair thema.
- Elke sessie mag een secundair thema krijgen.
- `Techniek` mag in bijna elke periode terugkomen.
- `Snelheid` en `Wedstrijdtempo` nemen toe richting het einde van het seizoen.
- Een zaterdag voor een wedstrijd is nooit de zwaarste sessie van de week.
- Een maandag na een wedstrijd is vaak `Herstel` of `Techniek`.
- Alle weekdagen mogen alle thema's dragen.
- De kans per weekdag verschilt wel.

## Vakanties Regio Midden 2026-2027

- Herfstvakantie: `17 okt 2026` t/m `25 okt 2026`
- Kerstvakantie: `19 dec 2026` t/m `3 jan 2027`
- Voorjaarsvakantie: `20 feb 2027` t/m `28 feb 2027`
- Meivakantie: `24 apr 2027` t/m `2 mei 2027`

## Aannames

- We gebruiken een fictieve kalender voor seizoen `2026-2027`.
- We gebruiken officiele vakantiedata voor regio `midden`.
- De extra adviesweek bij meivakantie is niet gebruikt.
- Feestdagen buiten vakanties zijn nog niet apart verwerkt.
- Wedstrijden zijn fictief gekozen op zondagen.
- De eerste trainingskalender is regel-gestuurd en nog niet direct Excel-gestuurd.
- Het Excel-bestand is nu een inspiratiebron en nog niet automatisch gekoppeld.

## Fictieve Wedstrijddagen 2026-2027

- September 2026: `13 sep 2026`, `27 sep 2026`
- Oktober 2026: `11 okt 2026`, `18 okt 2026`
- November 2026: `8 nov 2026`, `22 nov 2026`
- December 2026: `6 dec 2026`, `13 dec 2026`
- Januari 2027: `10 jan 2027`, `24 jan 2027`
- Februari 2027: `7 feb 2027`, `14 feb 2027`
- Maart 2027: `14 mrt 2027`, `28 mrt 2027`
- April 2027: `11 apr 2027`, `18 apr 2027`
- Mei 2027: `16 mei 2027`, `30 mei 2027`
- Juni 2027: `13 jun 2027`, `27 jun 2027`

## Periodisering

### Periode 1: Algemene opbouw

- Datums: `17 aug 2026` t/m `16 okt 2026`
- Doel: `Aerobic base` opbouwen
- Focus: techniekbasis, ligging, ritme, `IM`-basis
- Karakter: veel conditie, lage tot matige intensiteit

### Periode 2: Herstart na herfst

- Datums: `26 okt 2026` t/m `18 dec 2026`
- Doel: `Uithoudingsvermogen` en `Omslagpunt` opbouwen
- Focus: techniek onder vermoeidheid, langere sets
- Karakter: meer omvang en langere hoofdsets

### Periode 3: Herstart na kerst

- Datums: `4 jan 2027` t/m `19 feb 2027`
- Doel: `Omslagpunt` verdiepen
- Focus: slaggerichte techniek, wisselslag, conditie
- Karakter: stevige belasting, beperkte snelheid

### Periode 4: Voorwedstrijdblok

- Datums: `1 mrt 2027` t/m `23 apr 2027`
- Doel: `Wedstrijdtempo` opbouwen
- Focus: snelheid, start en keerpunt, wedstrijdritme
- Karakter: meer specifieke sets, minder pure omvang

### Periode 5: Wedstrijdspecifiek

- Datums: `3 mei 2027` t/m `13 jun 2027`
- Doel: wedstrijdgericht trainen
- Focus: `Wedstrijdtempo`, snelheid, techniek onder druk
- Karakter: korter en scherper

### Periode 6: Afbouw

- Datums: `14 jun 2027` t/m `3 jul 2027`
- Doel: fris en scherp worden
- Focus: herstel, kwaliteit, wedstrijdgevoel
- Karakter: lagere omvang, hoge scherpte

## Periode-Regels

### Periode 1: Algemene opbouw

- Primair doel: `Aerobic base`
- Secundair doel: `Techniek` en `IM`
- Blokkeuze: vaak `Techniek + Aerobic base`
- Alternatief: `1` lang `Aerobic base` blok
- Belasting: laag tot matig
- Wedstrijdweek: zaterdag lichter en technisch

### Periode 2: Herstart na herfst

- Primair doel: `Uithoudingsvermogen`
- Secundair doel: `Omslagpunt` en `Techniek`
- Blokkeuze: `Techniek + Uithoudingsvermogen`
- Alternatief: `Techniek + Omslagpunt`
- Belasting: matig tot stevig
- Wedstrijdweek: vrijdag minder omvang, zaterdag technisch

### Periode 3: Herstart na kerst

- Primair doel: `Omslagpunt`
- Secundair doel: `Uithoudingsvermogen`, `IM` en `Techniek`
- Blokkeuze: `Techniek + Omslagpunt`
- Alternatief: `1` lang conditieblok met `Omslagpunt`-accent
- Belasting: stevig
- Wedstrijdweek: maandag herstel, zaterdag korter

### Periode 4: Voorwedstrijdblok

- Primair doel: `Wedstrijdtempo`
- Secundair doel: `Snelheid`, `Start en keerpunt` en `Techniek`
- Blokkeuze: `Techniek + Wedstrijdtempo`
- Alternatief: `Techniek + Snelheid`
- Belasting: matig tot hoog, maar specifieker
- Wedstrijdweek: vrijdag kort en scherp, zaterdag licht

### Periode 5: Wedstrijdspecifiek

- Primair doel: `Wedstrijdtempo`
- Secundair doel: `Snelheid` en `Start en keerpunt`
- Blokkeuze: `Techniek + Wedstrijdtempo`
- Alternatief: `Snelheid + Start en keerpunt`
- Belasting: korter en scherper
- Wedstrijdweek: veel kwaliteit, weinig extra vermoeidheid

### Periode 6: Afbouw

- Primair doel: `Herstel` en `Wedstrijdtempo`
- Secundair doel: `Snelheid` en `Techniek`
- Blokkeuze: `Techniek + korte Wedstrijdtempo prikkel`
- Alternatief: `Herstel + start en keerpunt`
- Belasting: laag in omvang, hoog in kwaliteit
- Wedstrijdweek: alleen scherpte behouden

## Weekritme

### Standaard weekritme

- Maandag: `Herstel`, `Techniek` of rustige `Aerobic base`
- Woensdag: `Uithoudingsvermogen` of `Omslagpunt`
- Vrijdag: `Snelheid`, `Wedstrijdtempo` of slaggericht werk
- Zaterdag: `Techniek`, `Start en keerpunt` of lichte prikkel

### Wedstrijdweek met zondagwedstrijd

- Maandag: `Herstel + Techniek`
- Woensdag: hoofdset met `Uithoudingsvermogen`, `Omslagpunt` of `Wedstrijdtempo`
- Vrijdag: kort, doelgericht en niet uitputtend
- Zaterdag: licht, technisch en scherp

### Week na vakantie

- Maandag: `Aerobic base + Techniek`
- Woensdag: `Aerobic base` of `Uithoudingsvermogen`
- Vrijdag: `Techniek + Omslagpunt`
- Zaterdag: `IM`, slaggevoel of lichte snelheid

## Slagfocus-Regels

- `IM` als thema geeft `WIS` als slagfocus.
- `Start en keerpunt` geeft meestal `Alle slagen`.
- `Herstel` geeft meestal `Alle slagen`.
- In andere gevallen rouleert de slagfocus over `BC`, `SS`, `RC` en `VL`.
- De rotatie verschilt per weekdag.

## Trainingskalender 2026-2027

Elke regel hieronder bevat:

- datum
- periode
- primair thema
- secundair thema
- sessievorm
- slagfocus
- reden

### Augustus 2026

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| ma 17 aug 2026 | Algemene opbouw | Aerobic base | Techniek | 2 blokken | BC | opbouwweek |
| wo 19 aug 2026 | Algemene opbouw | Aerobic base | IM | Lang conditieblok | IM | duuraccent |
| vr 21 aug 2026 | Algemene opbouw | Techniek | Aerobic base | 2 blokken | SS | techniekbasis |
| za 22 aug 2026 | Algemene opbouw | Aerobic base | IM | Lang conditieblok | IM | lange prikkel |
| ma 24 aug 2026 | Algemene opbouw | Aerobic base | Techniek | 2 blokken | SS | opbouwweek |
| wo 26 aug 2026 | Algemene opbouw | Aerobic base | Techniek | 2 blokken | VL | duuraccent |
| vr 28 aug 2026 | Algemene opbouw | Techniek | Aerobic base | 2 blokken | RC | techniekbasis |
| za 29 aug 2026 | Algemene opbouw | IM | Techniek | 2 blokken | IM | slaggevoel |
| ma 31 aug 2026 | Algemene opbouw | Aerobic base | Techniek | 2 blokken | RC | opbouwweek |

### September 2026

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| wo 02 sep 2026 | Algemene opbouw | Aerobic base | IM | Lang conditieblok | IM | duuraccent |
| vr 04 sep 2026 | Algemene opbouw | Techniek | Aerobic base | 2 blokken | VL | techniekbasis |
| za 05 sep 2026 | Algemene opbouw | IM | Techniek | 2 blokken | IM | slaggevoel |
| ma 07 sep 2026 | Algemene opbouw | Aerobic base | Techniek | 2 blokken | VL | opbouwweek |
| wo 09 sep 2026 | Algemene opbouw | Omslagpunt | Techniek | 2 blokken | SS | wedstrijdweek |
| vr 11 sep 2026 | Algemene opbouw | Techniek | Snelheid | 2 blokken | BC | twee dagen voor wedstrijd |
| za 12 sep 2026 | Algemene opbouw | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 14 sep 2026 | Algemene opbouw | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 16 sep 2026 | Algemene opbouw | Aerobic base | IM | Lang conditieblok | IM | duuraccent |
| vr 18 sep 2026 | Algemene opbouw | Techniek | Aerobic base | 2 blokken | SS | techniekbasis |
| za 19 sep 2026 | Algemene opbouw | IM | Techniek | 2 blokken | IM | slaggevoel |
| ma 21 sep 2026 | Algemene opbouw | Aerobic base | Techniek | 2 blokken | SS | opbouwweek |
| wo 23 sep 2026 | Algemene opbouw | Omslagpunt | Techniek | 2 blokken | VL | wedstrijdweek |
| vr 25 sep 2026 | Algemene opbouw | Techniek | Snelheid | 2 blokken | RC | twee dagen voor wedstrijd |
| za 26 sep 2026 | Algemene opbouw | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 28 sep 2026 | Algemene opbouw | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 30 sep 2026 | Algemene opbouw | Aerobic base | IM | Lang conditieblok | IM | duuraccent |

### Oktober 2026

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| vr 02 okt 2026 | Algemene opbouw | Techniek | Aerobic base | 2 blokken | VL | techniekbasis |
| za 03 okt 2026 | Algemene opbouw | Aerobic base | IM | Lang conditieblok | IM | lange prikkel |
| ma 05 okt 2026 | Algemene opbouw | Aerobic base | Techniek | 2 blokken | VL | opbouwweek |
| wo 07 okt 2026 | Algemene opbouw | Omslagpunt | Techniek | 2 blokken | SS | wedstrijdweek |
| vr 09 okt 2026 | Algemene opbouw | Techniek | Snelheid | 2 blokken | BC | twee dagen voor wedstrijd |
| za 10 okt 2026 | Algemene opbouw | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 12 okt 2026 | Algemene opbouw | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 14 okt 2026 | Algemene opbouw | Omslagpunt | Techniek | 2 blokken | RC | wedstrijdweek |
| vr 16 okt 2026 | Algemene opbouw | Techniek | Snelheid | 2 blokken | SS | twee dagen voor wedstrijd |
| ma 26 okt 2026 | Herstart na herfst | Aerobic base | Techniek | 2 blokken | RC | eerste week na vakantie |
| wo 28 okt 2026 | Herstart na herfst | Aerobic base | Uithoudingsvermogen | 2 blokken | BC | eerste week na vakantie |
| vr 30 okt 2026 | Herstart na herfst | Techniek | Omslagpunt | 2 blokken | VL | eerste week na vakantie |
| za 31 okt 2026 | Herstart na herfst | IM | Snelheid | 2 blokken | IM | eerste week na vakantie |

### November 2026

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| ma 02 nov 2026 | Herstart na herfst | Techniek | Uithoudingsvermogen | 2 blokken | VL | herstart en opbouw |
| wo 04 nov 2026 | Herstart na herfst | Omslagpunt | Techniek | 2 blokken | SS | wedstrijdweek |
| vr 06 nov 2026 | Herstart na herfst | Techniek | Snelheid | 2 blokken | BC | twee dagen voor wedstrijd |
| za 07 nov 2026 | Herstart na herfst | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 09 nov 2026 | Herstart na herfst | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 11 nov 2026 | Herstart na herfst | Uithoudingsvermogen | Omslagpunt | 2 blokken | RC | hoofdset |
| vr 13 nov 2026 | Herstart na herfst | Omslagpunt | Techniek | 2 blokken | SS | tempo-werk |
| za 14 nov 2026 | Herstart na herfst | IM | Uithoudingsvermogen | 2 blokken | IM | wisselslag en conditie |
| ma 16 nov 2026 | Herstart na herfst | Techniek | Uithoudingsvermogen | 2 blokken | SS | herstart en opbouw |
| wo 18 nov 2026 | Herstart na herfst | Omslagpunt | Techniek | 2 blokken | VL | wedstrijdweek |
| vr 20 nov 2026 | Herstart na herfst | Techniek | Snelheid | 2 blokken | RC | twee dagen voor wedstrijd |
| za 21 nov 2026 | Herstart na herfst | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 23 nov 2026 | Herstart na herfst | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 25 nov 2026 | Herstart na herfst | Uithoudingsvermogen | Omslagpunt | 2 blokken | BC | hoofdset |
| vr 27 nov 2026 | Herstart na herfst | Omslagpunt | Techniek | 2 blokken | VL | tempo-werk |
| za 28 nov 2026 | Herstart na herfst | IM | Uithoudingsvermogen | 2 blokken | IM | wisselslag en conditie |
| ma 30 nov 2026 | Herstart na herfst | Techniek | Uithoudingsvermogen | 2 blokken | VL | herstart en opbouw |

### December 2026

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| wo 02 dec 2026 | Herstart na herfst | Omslagpunt | Techniek | 2 blokken | SS | wedstrijdweek |
| vr 04 dec 2026 | Herstart na herfst | Techniek | Snelheid | 2 blokken | BC | twee dagen voor wedstrijd |
| za 05 dec 2026 | Herstart na herfst | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 07 dec 2026 | Herstart na herfst | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 09 dec 2026 | Herstart na herfst | Omslagpunt | Techniek | 2 blokken | RC | wedstrijdweek |
| vr 11 dec 2026 | Herstart na herfst | Techniek | Snelheid | 2 blokken | SS | twee dagen voor wedstrijd |
| za 12 dec 2026 | Herstart na herfst | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 14 dec 2026 | Herstart na herfst | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 16 dec 2026 | Herstart na herfst | Uithoudingsvermogen | Omslagpunt | 2 blokken | VL | hoofdset |
| vr 18 dec 2026 | Herstart na herfst | Omslagpunt | Techniek | 2 blokken | RC | tempo-werk |

### Januari 2027

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| ma 04 jan 2027 | Herstart na kerst | Aerobic base | Techniek | 2 blokken | BC | eerste week na vakantie |
| wo 06 jan 2027 | Herstart na kerst | Aerobic base | Uithoudingsvermogen | 2 blokken | RC | eerste week na vakantie |
| vr 08 jan 2027 | Herstart na kerst | Techniek | Omslagpunt | 2 blokken | SS | eerste week na vakantie |
| za 09 jan 2027 | Herstart na kerst | IM | Snelheid | 2 blokken | IM | eerste week na vakantie |
| ma 11 jan 2027 | Herstart na kerst | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 13 jan 2027 | Herstart na kerst | Omslagpunt | Techniek | Lang conditieblok | VL | lange threshold-prikkel |
| vr 15 jan 2027 | Herstart na kerst | Techniek | Omslagpunt | 2 blokken | RC | slaggerichte kwaliteit |
| za 16 jan 2027 | Herstart na kerst | IM | Techniek | 2 blokken | IM | wisselslagbasis |
| ma 18 jan 2027 | Herstart na kerst | Techniek | Omslagpunt | 2 blokken | RC | herstart na weekend |
| wo 20 jan 2027 | Herstart na kerst | Omslagpunt | Techniek | 2 blokken | BC | wedstrijdweek |
| vr 22 jan 2027 | Herstart na kerst | Techniek | Snelheid | 2 blokken | VL | twee dagen voor wedstrijd |
| za 23 jan 2027 | Herstart na kerst | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 25 jan 2027 | Herstart na kerst | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 27 jan 2027 | Herstart na kerst | Omslagpunt | Uithoudingsvermogen | 2 blokken | SS | hoofdset |
| vr 29 jan 2027 | Herstart na kerst | Techniek | Omslagpunt | 2 blokken | BC | slaggerichte kwaliteit |
| za 30 jan 2027 | Herstart na kerst | IM | Techniek | 2 blokken | IM | wisselslagbasis |

### Februari 2027

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| ma 01 feb 2027 | Herstart na kerst | Techniek | Omslagpunt | 2 blokken | BC | herstart na weekend |
| wo 03 feb 2027 | Herstart na kerst | Omslagpunt | Techniek | 2 blokken | RC | wedstrijdweek |
| vr 05 feb 2027 | Herstart na kerst | Techniek | Snelheid | 2 blokken | SS | twee dagen voor wedstrijd |
| za 06 feb 2027 | Herstart na kerst | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 08 feb 2027 | Herstart na kerst | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 10 feb 2027 | Herstart na kerst | Omslagpunt | Techniek | 2 blokken | VL | wedstrijdweek |
| vr 12 feb 2027 | Herstart na kerst | Techniek | Snelheid | 2 blokken | RC | twee dagen voor wedstrijd |
| za 13 feb 2027 | Herstart na kerst | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 15 feb 2027 | Herstart na kerst | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 17 feb 2027 | Herstart na kerst | Omslagpunt | Uithoudingsvermogen | 2 blokken | BC | hoofdset |
| vr 19 feb 2027 | Herstart na kerst | Techniek | Omslagpunt | 2 blokken | VL | slaggerichte kwaliteit |

### Maart 2027

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| ma 01 mrt 2027 | Voorwedstrijdblok | Aerobic base | Techniek | 2 blokken | BC | eerste week na vakantie |
| wo 03 mrt 2027 | Voorwedstrijdblok | Aerobic base | Uithoudingsvermogen | 2 blokken | RC | eerste week na vakantie |
| vr 05 mrt 2027 | Voorwedstrijdblok | Techniek | Omslagpunt | 2 blokken | SS | eerste week na vakantie |
| za 06 mrt 2027 | Voorwedstrijdblok | IM | Snelheid | 2 blokken | IM | eerste week na vakantie |
| ma 08 mrt 2027 | Voorwedstrijdblok | Techniek | Wedstrijdtempo | 2 blokken | SS | specifieke opbouw |
| wo 10 mrt 2027 | Voorwedstrijdblok | Wedstrijdtempo | Techniek | 2 blokken | VL | wedstrijdweek |
| vr 12 mrt 2027 | Voorwedstrijdblok | Snelheid | Wedstrijdtempo | Wedstrijdvoorbereiding | RC | twee dagen voor wedstrijd |
| za 13 mrt 2027 | Voorwedstrijdblok | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 15 mrt 2027 | Voorwedstrijdblok | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 17 mrt 2027 | Voorwedstrijdblok | Wedstrijdtempo | Snelheid | 2 blokken | BC | wedstrijdgericht |
| vr 19 mrt 2027 | Voorwedstrijdblok | Snelheid | Start en keerpunt | 2 blokken | Alle slagen | kwaliteit |
| za 20 mrt 2027 | Voorwedstrijdblok | Techniek | Start en keerpunt | 2 blokken | Alle slagen | lichte prikkel |
| ma 22 mrt 2027 | Voorwedstrijdblok | Techniek | Wedstrijdtempo | 2 blokken | VL | specifieke opbouw |
| wo 24 mrt 2027 | Voorwedstrijdblok | Wedstrijdtempo | Techniek | 2 blokken | SS | wedstrijdweek |
| vr 26 mrt 2027 | Voorwedstrijdblok | Snelheid | Wedstrijdtempo | Wedstrijdvoorbereiding | BC | twee dagen voor wedstrijd |
| za 27 mrt 2027 | Voorwedstrijdblok | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 29 mrt 2027 | Voorwedstrijdblok | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 31 mrt 2027 | Voorwedstrijdblok | Wedstrijdtempo | Snelheid | 2 blokken | RC | wedstrijdgericht |

### April 2027

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| vr 02 apr 2027 | Voorwedstrijdblok | Snelheid | Start en keerpunt | 2 blokken | Alle slagen | kwaliteit |
| za 03 apr 2027 | Voorwedstrijdblok | Techniek | Start en keerpunt | 2 blokken | Alle slagen | lichte prikkel |
| ma 05 apr 2027 | Voorwedstrijdblok | Techniek | Wedstrijdtempo | 2 blokken | SS | specifieke opbouw |
| wo 07 apr 2027 | Voorwedstrijdblok | Wedstrijdtempo | Techniek | 2 blokken | VL | wedstrijdweek |
| vr 09 apr 2027 | Voorwedstrijdblok | Snelheid | Wedstrijdtempo | Wedstrijdvoorbereiding | RC | twee dagen voor wedstrijd |
| za 10 apr 2027 | Voorwedstrijdblok | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 12 apr 2027 | Voorwedstrijdblok | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 14 apr 2027 | Voorwedstrijdblok | Wedstrijdtempo | Techniek | 2 blokken | BC | wedstrijdweek |
| vr 16 apr 2027 | Voorwedstrijdblok | Snelheid | Wedstrijdtempo | Wedstrijdvoorbereiding | VL | twee dagen voor wedstrijd |
| za 17 apr 2027 | Voorwedstrijdblok | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 19 apr 2027 | Voorwedstrijdblok | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 21 apr 2027 | Voorwedstrijdblok | Wedstrijdtempo | Snelheid | 2 blokken | SS | wedstrijdgericht |
| vr 23 apr 2027 | Voorwedstrijdblok | Snelheid | Start en keerpunt | 2 blokken | Alle slagen | kwaliteit |

### Mei 2027

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| ma 03 mei 2027 | Wedstrijdspecifiek | Aerobic base | Techniek | 2 blokken | SS | eerste week na vakantie |
| wo 05 mei 2027 | Wedstrijdspecifiek | Aerobic base | Uithoudingsvermogen | 2 blokken | VL | eerste week na vakantie |
| vr 07 mei 2027 | Wedstrijdspecifiek | Techniek | Omslagpunt | 2 blokken | RC | eerste week na vakantie |
| za 08 mei 2027 | Wedstrijdspecifiek | IM | Snelheid | 2 blokken | IM | eerste week na vakantie |
| ma 10 mei 2027 | Wedstrijdspecifiek | Techniek | Wedstrijdtempo | 2 blokken | RC | wedstrijdblok |
| wo 12 mei 2027 | Wedstrijdspecifiek | Wedstrijdtempo | Techniek | 2 blokken | BC | wedstrijdweek |
| vr 14 mei 2027 | Wedstrijdspecifiek | Snelheid | Wedstrijdtempo | Wedstrijdvoorbereiding | VL | twee dagen voor wedstrijd |
| za 15 mei 2027 | Wedstrijdspecifiek | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 17 mei 2027 | Wedstrijdspecifiek | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 19 mei 2027 | Wedstrijdspecifiek | Wedstrijdtempo | Snelheid | 2 blokken | SS | wedstrijdgericht |
| vr 21 mei 2027 | Wedstrijdspecifiek | Snelheid | Start en keerpunt | 2 blokken | Alle slagen | kort en scherp |
| za 22 mei 2027 | Wedstrijdspecifiek | Wedstrijdtempo | Start en keerpunt | 2 blokken | Alle slagen | wedstrijdgevoel |
| ma 24 mei 2027 | Wedstrijdspecifiek | Techniek | Wedstrijdtempo | 2 blokken | BC | wedstrijdblok |
| wo 26 mei 2027 | Wedstrijdspecifiek | Wedstrijdtempo | Techniek | 2 blokken | RC | wedstrijdweek |
| vr 28 mei 2027 | Wedstrijdspecifiek | Snelheid | Wedstrijdtempo | Wedstrijdvoorbereiding | SS | twee dagen voor wedstrijd |
| za 29 mei 2027 | Wedstrijdspecifiek | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 31 mei 2027 | Wedstrijdspecifiek | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |

### Juni 2027

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| wo 02 jun 2027 | Wedstrijdspecifiek | Wedstrijdtempo | Snelheid | 2 blokken | VL | wedstrijdgericht |
| vr 04 jun 2027 | Wedstrijdspecifiek | Snelheid | Start en keerpunt | 2 blokken | Alle slagen | kort en scherp |
| za 05 jun 2027 | Wedstrijdspecifiek | Wedstrijdtempo | Start en keerpunt | 2 blokken | Alle slagen | wedstrijdgevoel |
| ma 07 jun 2027 | Wedstrijdspecifiek | Techniek | Wedstrijdtempo | 2 blokken | RC | wedstrijdblok |
| wo 09 jun 2027 | Wedstrijdspecifiek | Wedstrijdtempo | Techniek | 2 blokken | BC | wedstrijdweek |
| vr 11 jun 2027 | Wedstrijdspecifiek | Snelheid | Wedstrijdtempo | Wedstrijdvoorbereiding | VL | twee dagen voor wedstrijd |
| za 12 jun 2027 | Wedstrijdspecifiek | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 14 jun 2027 | Afbouw | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 16 jun 2027 | Afbouw | Wedstrijdtempo | Snelheid | 2 blokken | SS | scherpte |
| vr 18 jun 2027 | Afbouw | Techniek | Wedstrijdtempo | 2 blokken | BC | lichte kwaliteit |
| za 19 jun 2027 | Afbouw | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | scherpte behouden |
| ma 21 jun 2027 | Afbouw | Herstel | Techniek | Herstel + techniek | Alle slagen | afbouw |
| wo 23 jun 2027 | Afbouw | Wedstrijdtempo | Techniek | 2 blokken | RC | wedstrijdweek |
| vr 25 jun 2027 | Afbouw | Snelheid | Wedstrijdtempo | Wedstrijdvoorbereiding | SS | twee dagen voor wedstrijd |
| za 26 jun 2027 | Afbouw | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | dag voor wedstrijd |
| ma 28 jun 2027 | Afbouw | Herstel | Techniek | Herstel + techniek | Alle slagen | dag na wedstrijd |
| wo 30 jun 2027 | Afbouw | Wedstrijdtempo | Snelheid | 2 blokken | VL | scherpte |

### Juli 2027

| Datum | Periode | Primair thema | Secundair thema | Sessievorm | Slagfocus | Reden |
| --- | --- | --- | --- | --- | --- | --- |
| vr 02 jul 2027 | Afbouw | Techniek | Wedstrijdtempo | 2 blokken | RC | lichte kwaliteit |
| za 03 jul 2027 | Afbouw | Techniek | Start en keerpunt | Wedstrijdvoorbereiding | Alle slagen | scherpte behouden |

## Huidige Bestanden In De Werkmap

- `Trainingen-junioren-25-26.xlsx`
- `seizoen-2026-2027-kalender.md`
- `seizoen-2026-2027-trainingskalender.md`
- `voorbeeldtrainingen.md`
- `INSTRUCTIES.md`

## Eerste Voorbeeldtrainingen

- Er is een apart bestand met eerste voorbeeldtrainingen gemaakt.
- Bestand: `voorbeeldtrainingen.md`
- Doel: de trainingslogica testen en daarna tunen.
- De voorbeelden komen uit verschillende periodes van het seizoen.
- De voorbeelden gebruiken de huidige kalenderlogica en het Excel-bestand als inspiratie.

### Huidige keuzes in de voorbeeldtrainingen

- Elke training start met `600m` inzwemmen.
- Elke training heeft daarna `2` kernblokken.
- In de voorbeelden is blok `1` steeds `Techniek`.
- Blok `2` volgt het primaire thema van de sessie.
- De streefafstand per sessie is **minimaal 2500m**, bij voorkeur boven de 2500m.
- Techniekblokken tellen mee in de totale afstand maar zijn bewust korter qua meters door de lagere intensiteit en uitvoering op halve snelheid.
- In `Afbouw` is de totale afstand lager, maar minimaal `2500m`.
- In vroege periodes is de totale afstand hoger, richting `2700m` of meer.

## Volgende Logische Stap

De volgende stap is per trainingssessie echte inhoud genereren op basis van:

- het primair thema
- het secundair thema
- de sessievorm
- de slagfocus
- de voorbeeldblokken uit het Excel-bestand
