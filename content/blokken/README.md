# Blokcollectie

Deze map bevat herbruikbare trainingsblokken als Markdown.

Lokale feedback-events worden tijdens development onder `feedback-local/` geschreven. Die map staat in `.gitignore` en wordt niet gecommit.

## Bestandsvorm

Elk blok heeft YAML-frontmatter met metadata en daarna de setregels in hetzelfde formaat als uitgewerkte trainingen.

```md
---
id: block_bc_techniek_lange-lijn_001
type: kernblok
thema: Techniek
slagfocus: BC
afstand_m: 700
status: actief
rating:
  gemiddelde: 0
  aantal: 0
tags:
  - techniek
  - bc
---

## Blok - Techniek - BC - 700m

- `4x50m` `BC` `R:0:15` `70%` - rustige lange lijn {{coach: bewaak ontspannen ligging}}
```

## Import

Blokken uit `Trainingen-junioren-25-26.xlsx` worden gegenereerd als gewone blokcollectie onder `content/blokken/`.

```text
content/blokken/
```

Inzwemmen staat als eigen hoofdcategorie; alle andere blokken staan eerst op slagfocus en daarna op inhoudelijke categorie:

```text
inzwemmen/
bc/
  techniek/
  conditie/
rc/
  techniek/
alle-slagen/
  conditie/
wis/
  tempo/
```

Het oorspronkelijke Excel-blad, inclusief `2025` of `2026`, blijft in de frontmatter onder `bron.sheet` staan.
Het oorspronkelijke Excel-blad wordt niet in de frontmatter opgeslagen. De collectie behandelt geimporteerde blokken als gewone blokken.

Elk blok bevat wel gebruiksgeschiedenis:

```yaml
gebruik:
  aantal: 2
  trainingen:
    - 2025-08-25
    - 2026-01-12
```

En een wijzigingslog voor latere verbeteringen op basis van feedback:

```yaml
wijzigingen:
  - datum: 2026-05-17
    toelichting: tempo-opdracht verduidelijkt
```

De import is reproduceerbaar:

```powershell
./scripts/import-excel-blocks.ps1
```

Het script:

- leest de Excel als OpenXML
- detecteert blokken uit de jaarbladen en bronbladen
- dedupliceert gelijke blokken
- normaliseert slagafkortingen zoals `SNK`, `WIS`, `BC`, `RC`, `SS` en `VL`
- deelt blokken in naar slagfocus en inhoudelijke categorie
- voegt metadata en coach-tips toe
- schrijft `content/blokken/import-report.json`
