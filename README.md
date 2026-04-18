# SwimTraining

Systeem voor het genereren van zwemtrainingen en een viewer-app voor trainers.

## Bestanden met instructies

| Bestand | Doel |
|---|---|
| `INSTRUCTIES.md` | Leidende regels voor trainingsgeneratie |
| `APP_INSTRUCTIES.md` | Leidende regels voor viewer-app, UX en datamodel |

## Repo-structuur

```text
/
  INSTRUCTIES.md
  APP_INSTRUCTIES.md
  README.md
  Trainingen-junioren-25-26.xlsx
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
  app/
    viewer/
```

## Werkwijze

1. `INSTRUCTIES.md` is alleen leidend voor trainingsinhoud en generatieregels.
2. `APP_INSTRUCTIES.md` is alleen leidend voor viewer-app, UX en rendering.
3. Trainingscontent leeft onder `content/seizoenen/...`.
4. De app leest de trainingscontent lokaal uit de repo en wordt gedeployed op Vercel.

## Contentmodel

- Elke training is een los Markdown-bestand met frontmatter.
- Per seizoen bestaat een `kalender.json` met trainingsdagen, vakanties en wedstrijden.
- Overzichtsdocumenten blijven ook in Markdown beschikbaar.

## Viewer-doel

- Primary flow: vandaag en deze week.
- Mobile first.
- Zondag en wedstrijden expliciet zichtbaar.
- Vakanties expliciet zichtbaar als reden voor geen training.
