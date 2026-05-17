# Plan: blokcollectie en feedback

## Aanleiding

De huidige werkwijze genereert inzwemmen en trainingsblokken vooral per training. Dat werkt, maar maakt het lastig om goede bestaande blokken opnieuw te gebruiken en zwakkere blokken minder vaak te kiezen.

De gewenste richting is:

1. Bouw een collectie met herbruikbare bestaande blokken.
2. Haal zoveel mogelijk blokken uit `Trainingen-junioren-25-26.xlsx`.
3. Gebruik bij het maken van een training eerst een passend bestaand blok.
4. Voeg nieuwe blokken die toch worden gegenereerd terug toe aan de collectie.
5. Laat trainers later eenvoudig feedback geven, bijvoorbeeld met 1-3 sterren.
6. Gebruik feedback om minder populaire blokken lager te ranken of over te slaan.

## Huidige situatie

- Uitgewerkte trainingen staan als Markdown onder `content/seizoenen/*/trainingen/`.
- De viewer leest trainingen en kalenderinformatie via `app/viewer/lib/content.ts`.
- `trainingsblokken` zijn nu afgeleid uit de trainingskalender, niet uit een echte blokbibliotheek.
- De Excel-bron bevat sheets `2025`, `2026`, `Inzwemmen`, `BC`, `SS`, `RC`, `VL`, `Overig` en `WS`.
- De Excel-sheets zijn groot genoeg om eerst met een importscript te analyseren en daarna pas te cureren.

## Voorgestelde contentstructuur

```text
content/
  blokken/
    *.md
    feedback-local/
    import-report.json
```

Markdown-bestanden worden de gecureerde blokcollectie. Elk blok krijgt frontmatter met metadata en daarna de setregels in het bestaande trainingsformaat.

`feedback-local/` bevat lokale praktijkfeedback tijdens development. Deze map wordt door Git genegeerd. In productie kan dezelfde feedbackvorm later naar Vercel Blob worden geschreven als losse JSON-events.

`import-report.json` bewaart wat uit Excel is gehaald, wat is overgeslagen en welke regels handmatige controle nodig hebben.

## Blokmodel

Voorstel voor een blok als Markdown:

```md
---
id: block_2025_bc_001
type: inzwemmen
thema: Techniek
slagfocus: BC
afstand_m: 600
status: actief
bron:
  type: excel
  bestand: Trainingen-junioren-25-26.xlsx
  sheet: Inzwemmen
  rijen: 12-18
rating:
  gemiddelde: 0
  aantal: 0
tags:
  - basis
  - rustig
  - junioren
---

## Inzwemmen - Techniek - BC - 600m

- `3x100m` `BC` `R:0:15` `70%` - rustig inzwemmen met lange lijn {{coach: let op ontspannen ligging}}
```

Open keuzes:

- `type`: minimaal `inzwemmen`, `blok`, mogelijk later `conditieblok`.
- `status`: `actief`, `concept`, `afgekeurd`.
- `tags`: gebruiken voor selectie, filtering en uitleg.

## Feedbackmodel

Voorstel voor feedback:

```json
{
  "blockId": "block_2025_bc_001",
  "trainingSlug": "2026-05-16-wedstrijdtempo-alle-slagen",
  "datum": "2026-05-16",
  "rating": 3,
  "opmerking": "Liep goed, duidelijke opdracht",
  "trainer": "optioneel"
}
```

Eerste versie:

- 3 sterren is genoeg: `1` niet goed, `2` bruikbaar, `3` goed.
- Feedback hoort bij een blok, niet alleen bij een hele training.
- Opmerking is optioneel.
- Trainernaam is optioneel, zodat feedback snel blijft.
- Lokale feedback wordt als losse JSON-events opgeslagen onder `content/blokken/feedback-local/`.
- `content/blokken/feedback-local/` staat in `.gitignore`.
- Productiefeedback kan later naar Vercel Blob met dezelfde eventvorm.

Latere versie:

- Feedback opslaan via een kleine API/server action.
- Per blok een score berekenen op basis van gemiddelde, aantal stemmen en recentheid.
- Blokken met lage score minder vaak selecteren of alleen nog als fallback gebruiken.

## Selectielogica

Bij het maken van een training:

1. Bepaal per trainingsonderdeel de behoefte: type, thema, slagfocus, afstand en sessievorm.
2. Zoek eerst in `blocks.json` naar passende actieve blokken.
3. Sorteer kandidaten op:
   - match op thema en slagfocus
   - afstand passend bij de training
   - positieve feedback
   - niet te recent gebruikt
4. Kies een blok uit de beste kandidaten, met lichte variatie zodat niet steeds hetzelfde blok terugkomt.
5. Als er geen goed blok is, genereer een nieuw blok.
6. Sla een nieuw bruikbaar blok als concept op in de collectie, met bron `generated`.

## Excel-extractie

Fase 1 is niet meteen perfect importeren, maar eerst structureren:

1. Maak een script dat de workbook-sheets leest.
2. Zet ruwe celinhoud om naar kandidaatblokken.
3. Herken blokgrenzen op koppen zoals `INZWEMMEN`, `KERN`, slagbladen en lege regels.
4. Normaliseer setregels naar het blokmodel waar dat betrouwbaar kan.
5. Markeer twijfelgevallen met `status: concept` en neem ze op in `import-report.json`.

Belangrijk: Excel-import is een hulpmiddel, geen automatische kwaliteitsgarantie. De collectie moet uiteindelijk gecureerd kunnen worden.

## App-UX

Eerste feedbackplek:

- Op de trainingsdetailpagina onder elk herbruikbaar blok.
- Toon een compacte 3-sterren bediening.
- Maak feedback mobiel snel: een tik moet genoeg zijn.
- Toon eventueel na stemmen een kleine bevestiging en optioneel een veld voor opmerking.

Voor de app betekent dit dat Markdown-trainingen uiteindelijk blok-id's moeten kunnen refereren, bijvoorbeeld in frontmatter of vlak boven de blokkop.

## Implementatiefases

### Fase 1: basiscollectie

- Voeg TypeScript-types toe voor `TrainingBlock`, `TrainingBlockFeedback` en selectieresultaten.
- Voeg Markdown-blokken toe onder `content/blokken/` met een klein handmatig voorbeeld.
- Voeg lokale feedbackopslag toe onder `content/blokken/feedback-local/`.
- Voeg loaderfuncties toe naast `getAllTrainings`.
- Zorg dat bestaande appweergave nog ongewijzigd blijft.

### Fase 2: Excel-import

- Voeg een importscript toe voor `Trainingen-junioren-25-26.xlsx`.
- Kies een parserdependency, bijvoorbeeld `xlsx`, of een aparte Node-tool buiten de viewer.
- Genereer kandidaatblokken en een importrapport.
- Curatie blijft handmatig controleerbaar via JSON.

### Fase 3: trainingselectie

- Voeg selectielogica toe die blokken matcht op thema, slagfocus en afstand.
- Leg vast welke blokken in een training gebruikt zijn.
- Zorg dat nieuw gegenereerde blokken als concept kunnen worden toegevoegd.

### Fase 4: feedback in de app

- Voeg een feedbackcomponent toe op de trainingsdetailpagina.
- Begin met lokale/mock opslag of statische voorbeelddata.
- Beslis daarna of feedback via API, database of repositorybestand wordt opgeslagen.

### Fase 5: kwaliteitssturing

- Bereken per blok een score.
- Gebruik score en recent gebruik in de selectie.
- Zet blokken met structureel lage feedback automatisch op lagere prioriteit of `afgekeurd`.

## Eerste beslissingen

- Start bestandsgebaseerd: Markdown-blokken in `content/blokken/`.
- Feedback op blokniveau, niet alleen trainingsniveau.
- Eerst 3 sterren, geen uitgebreid formulier.
- Excel-import mag conceptblokken maken die later gecureerd worden.
- Bestaande Markdown-trainingen blijven voorlopig geldig.
- Developmentfeedback wordt lokaal opgeslagen via `POST /api/block-feedback`.
- Productiefeedback wordt via dezelfde store-abstraction naar Vercel Blob geschreven wanneer `BLOB_READ_WRITE_TOKEN` gezet is. `FEEDBACK_STORE=vercel-blob` mag expliciet, maar is niet verplicht.

## Open vragen

- Moeten inzwemblokken en kernblokken in een bestand, of aparte bestanden?
- Wordt feedback door iedere trainer anoniem gegeven, of met naam/login?
- Moet feedback offline aan de badrand kunnen werken?
- Moet een slecht blok direct verdwijnen, of eerst minder vaak gekozen worden?
- Hoeveel handmatige curatie is acceptabel na de Excel-import?
