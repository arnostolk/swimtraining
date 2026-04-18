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
- Metadata op de detailpagina staat als compacte lijst bovenaan.
- De trainingsinhoud wordt uit Markdown gerenderd.

## Routes

- `/`: dashboard met slimme vandaag-kaart en weekoverzicht
- `/week`: volledige weekweergave
- `/trainingen/[slug]`: detailpagina van 1 training
- `/archief`: overzicht met filters
- `/overzicht/kalender`: seizoenskalender
- `/overzicht/trainingskalender`: trainingskalender

## Datamodel

### Training

Elke training is een los Markdown-bestand met frontmatter.

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

## Contentstructuur

```text
content/
  seizoenen/
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
