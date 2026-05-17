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
