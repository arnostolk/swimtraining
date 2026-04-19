# App Instructies

## Doel

Dit bestand is leidend voor de viewer-app van SwimTraining.

De app is een mobile-first coach-tool waarmee trainers vooral de training van vandaag en de huidige week snel kunnen openen.

## Productdoel

- De primaire flow is: vandaag bekijken, eerstvolgende training openen, week bekijken.
- De app is geen algemeen documentenarchief als eerste indruk.
- De app moet goed bruikbaar zijn op een telefoon aan de badrand.

## Primaire UX-flow

1. Trainer opent de app.
2. De homepage toont een slimme kaart voor vandaag.
3. Als er vandaag geen training is, toont dezelfde kaart de eerstvolgende training.
4. Daaronder staat altijd de huidige week van maandag t/m zondag.
5. Vanuit home moet een trainer met 1 tik naar de training of week kunnen.

## UX-regels

- Mobile first is leidend.
- Volledige week tonen: maandag t/m zondag.
- Zondag blijft zichtbaar, ook als er geen training is.
- Als er een wedstrijd op zondag is, moet die expliciet zichtbaar zijn.
- Als er geen training is vanwege vakantie, moet de reden expliciet zichtbaar zijn.
- Metadata op de detailpagina staat in een inklapbare accordion bovenaan.
- De trainingsinhoud wordt uit Markdown gerenderd.

## Header

- De appnaam in de header is `Trainingen`.
- De titel staat onderaan uitgelijnd met het logo.
- De titel heeft een kleine ondermarge zodat hij optisch iets hoger staat.
- Het hoofdmenu is een hamburgermenu op dezelfde hoogte als het logo.
- Het hamburgermenu sluit bij klik op een menu-item.
- Het hamburgermenu sluit ook bij klik buiten het menu.

## Datumformaten

- De algemene datumweergave in de app gebruikt: `Maandag 17-08-2026`.
- In weekoverzichten gebruiken daglabels de korte notatie: `ma 17-08-2026`.
- De titelregel op de trainingspagina toont de lange notatie.

## Home

- Als er vandaag geen training is, staat alleen `Geen training vandaag` bovenaan.
- De extra regel `Reden: Geen training vandaag` wordt niet getoond.
- De tegel `Eerstvolgende training` is volledig klikbaar.
- Binnen die tegel staat geen losse knop `Open training`.
- Onder het blok `Deze week` staat een apart navigatieblok met `Vorige week` en `Volgende week`.

## Weekoverzicht

- Daglabels krijgen extra horizontale ruimte zodat de datumkolom rustiger oogt.
- De datumkolom staat iets van de linkerrand af.
- Weekenddagen krijgen een subtiel andere achtergrondkleur.
- Doordeweekse dagen krijgen ook een subtiele rand, maar zonder infill-kleur.
- Er staan geen scheidingslijnen meer tussen de dagen.
- De eerste dag van de week heeft dezelfde hoogte als de andere dagen.

## Trainingsdetail

- Bovenaan staan knoppen voor `Vorige training`, `Week overzicht` en `Volgende training`.
- `Week overzicht` opent altijd de week van de huidige training.
- Als er geen vorige of volgende training is, wordt een disabled knop getoond.
- Geplande trainingen zonder uitgewerkt Markdown-bestand hebben toch een detailpagina.
- Op zo'n detailpagina is zichtbaar dat de training nog niet is uitgewerkt.
- Setregels met `{{coach: ...}}` krijgen extra trainerinfo.
- De hele setregel wordt dan klikbaar.
- De trainerinfo verschijnt als bottom sheet op mobiel.
- In de gewone lijstweergave wordt de coachtekst niet voluit getoond.
- In uitgewerkte trainingsblokken wordt trainerinfo op elke setregel verwacht.
- In het inzwemmen kan trainerinfo selectief worden gebruikt.

## Klikgedrag

- Hoofdkaarten en trainingsrijen zijn klikbaar als geheel.
- Interne knoppen en links binnen zulke kaarten blijven apart klikbaar.
- Navigatie voor trainingen werkt ook voor geplande, nog niet uitgewerkte sessies.

## Routes

- `/`: dashboard met slimme vandaag-kaart en weekoverzicht
- `/week`: volledige weekweergave
- `/trainingen/[slug]`: detailpagina van 1 training
- `/archief`: overzicht met filters
- `/overzicht/kalender`: seizoenskalender
- `/overzicht/trainingskalender`: trainingskalender

## Indexeerbaarheid

- De volledige viewer-app is niet bedoeld voor publieke indexering.
- Niet-indexeerbaarheid is een vaste app-afspraak voor alle viewer-omgevingen en alle viewer-routes.
- Alle viewer-routes geven `noindex` en `nofollow`, inclusief home, week, archief, overzichten en trainingsdetailpagina's.
- De viewer levert ook een `robots.txt` die crawlers de app niet laat indexeren.

## Datamodel

### Training

Elke training is een los Markdown-bestand met frontmatter.

Voor set-regels in de Markdown geldt: zet altijd `-` tussen de intensiteit en de vrije beschrijving, bijvoorbeeld `- ` `8x50m` `BC` `R:0:15` `95%` `-` wedstrijdtempo`.

Verplichte velden:

- `slug`
- `datum`
- `seizoen`
- `periode`
- `primair_thema`
- `sessievorm`
- `slagfocus`
- `totale_afstand_m`
- `duur_min`

Optioneel:

- `secundair_thema`
- `public`

### Seizoensmetadata

Per seizoen is er een JSON-bestand met:

- trainingsdagen
- vakanties
- wedstrijden
- optioneel extra `geen_training_dagen`

## Multi-season gedrag

- De app ondersteunt meerdere seizoenen onder `content/seizoenen/`.
- Het actieve seizoen wordt standaard bepaald op basis van de datum.
- Home, weekoverzicht en trainingsdetail moeten automatisch uit het juiste seizoen lezen.
- Trainingsnavigatie vorige/volgende mag over het volledige beschikbare trainingsaanbod lopen.
- Overzichtspagina's voor kalender en trainingskalender moeten per seizoen kunnen laden.
- De viewer hoeft geen expliciete seizoenschakelaar in de primaire flow te hebben.

## Contentstructuur

```text
content/
  seizoenen/
    2025-2026/
      metadata/
        kalender.json
      overzicht/
        kalender.md
        trainingskalender.md
      trainingen/
        2026/
          04/
          05/
          06/
          07/
    2026-2027/
      metadata/
        kalender.json
      overzicht/
        kalender.md
        trainingskalender.md
      trainingen/
        2026/
          09/
        2027/
          01/
          03/
          06/
```

## Vaste structuur van trainingbestanden

Elke training heeft:

1. frontmatter
2. `# Training`
3. `## Inzwemmen - ...`
4. `## Blok 1 - ...`
5. `## Blok 2 - ...`

Bij een sessie met `Lang conditieblok` mag `## Conditieblok - ...` worden gebruikt.

## Technische richting

- `Next.js` met App Router
- `TypeScript`
- `gray-matter` voor frontmatter
- `react-markdown` en `remark-gfm` voor rendering
- `date-fns` voor datumlogica
- Content wordt lokaal uit de repo gelezen
- De app wordt statisch gedeployed op Vercel

## Werkafspraak

- `APP_INSTRUCTIES.md` is leidend voor appkeuzes en app-tuning.
- `INSTRUCTIES.md` blijft leidend voor trainingsgeneratie.
- Bij wijzigingen aan UX, routes, datamodel of viewer-gedrag wordt dit bestand bijgewerkt.
