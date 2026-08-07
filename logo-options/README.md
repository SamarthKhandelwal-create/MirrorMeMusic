# Logo shade options

Six colourways of the site mark. Geometry is identical in every one — only the
background purple changes. The diamond stays `#000`.

| | Hex | Name | Notes |
|---|---|---|---|
| **A** | `#9333ea` | Current — vivid violet | What the site ships today. Reads clearly at 16px. |
| **B** | `#7e22ce` | Deeper royal purple | More restrained; slightly less punch as a favicon. |
| **C** | `#a855f7` | Brighter orchid | Most presence in a tab bar; still legible small. |
| **D** | `#6d28d9` | Indigo-leaning violet | Cooler, pulls toward blue. |
| **E** | `#8b5cf6` | Soft lavender-violet | Softest; weakest at favicon sizes. |
| **F** | `#581c87` | Deep plum | Closest to the site background `#171021`; most cohesive, but can disappear in a crowded tab bar. |

## Files

Each option has three:

- `X-name.svg` — source, scales to any size
- `X-name-512.png` — large raster, for decks or previews
- `X-name-64.png` — favicon-size, to judge legibility when small

`_comparison-sheet.png` shows all six on the site background (`#171021`).

## Applying one

Tell me the letter and I'll update every place the mark appears:

- `src/components/SiteLogo.tsx` — header and footer
- `src/app/icon.svg` — browser tab (modern browsers)
- `src/app/favicon.ico` — 64×64 fallback
- `src/app/apple-icon.png` — iOS home screen

These are kept in sync deliberately; changing only one leaves the tab icon
disagreeing with the header.

> This folder is reference material, not part of the build. Nothing here is
> imported by the app, so it has no effect on bundle size.
