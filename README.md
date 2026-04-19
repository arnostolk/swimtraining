# SwimTraining

Systeem voor het genereren van zwemtrainingen en een viewer-app voor trainers.

## Bestanden met instructies

| Bestand | Doel |
|---|---|
| `INSTRUCTIES.md` | Leidende regels voor trainingsgeneratie |
| `APP_INSTRUCTIES.md` | Leidende regels voor viewer-app, UX en datamodel |
| `BACKLOG.md` | Centrale backlog voor ideeen en doorontwikkeling |
| `.github/agents/` | Workspace custom agents voor VS Code Insiders |

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
3. `BACKLOG.md` is de plek voor ideeen, wensen en doorontwikkeling die nog niet zijn besloten, inclusief prioriteitssysteem.
4. Trainingscontent leeft onder `content/seizoenen/...`.
5. De app leest de trainingscontent lokaal uit de repo en wordt gedeployed op Vercel.
6. Workspace custom agents voor VS Code staan onder `.github/agents/`.
7. De development-rollen zijn beschikbaar als echte custom agents onder `.github/agents/`.
8. De orchestrator-agent kan development-vragen direct als subagent doorzetten binnen de development-keten.
9. De trainings-rollen zijn beschikbaar als echte custom agents onder `.github/agents/`.
10. De orchestrator-agent kan trainings-vragen direct als subagent doorzetten binnen de trainings-keten.

## Contentmodel

- Elke training is een los Markdown-bestand met frontmatter.
- In set-regels staat altijd een `-` tussen intensiteit en vrije beschrijving, bijvoorbeeld `` `95%` - wedstrijdtempo ``.
- In trainingsblokken heeft elke setregel trainerinfo via `{{coach: ...}}`; in het inzwemmen is dat optioneel.
- Per seizoen bestaat een `kalender.json` met trainingsdagen, vakanties en wedstrijden.
- Overzichtsdocumenten blijven ook in Markdown beschikbaar.

## Viewer-doel

- Primary flow: vandaag en deze week.
- Mobile first.
- Zondag en wedstrijden expliciet zichtbaar.
- Vakanties expliciet zichtbaar als reden voor geen training.
