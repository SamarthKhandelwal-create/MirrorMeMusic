# Multi-shade logo concepts

Seven designs combining all six purples from the parent folder, rather than
picking one. Same six hexes throughout: `#581c87` `#6d28d9` `#7e22ce`
`#9333ea` `#a855f7` `#8b5cf6` — ordered deep plum → soft lavender so gradients
read as depth rather than noise.

| | Design | How it uses the shades | Holds up at 64px |
|---|---|---|---|
| **G1** | Conic sweep | All six rotating around the plate | Yes |
| **G2** | Concentric rings | One shade per diamond ring | Partly — rings merge |
| **G3** | Spiral | Archimedean spiral, full gradient | **No** — loses the diamond |
| **G4** | Faceted | A shade per quadrant, cut-glass | **No** — facets muddy together |
| **G5** | Gradient band | Black plate, gradient diamond | Yes — cleanest |
| **G6** | Diamond spiral | Nested diamonds rotating inward | Yes |
| **G7** | Spiral aperture | Original mark + spiral in the opening | Yes |

## Honest read

**G5** and **G7** are the strongest. G5 is the cleanest — it inverts the
current mark so the diamond itself carries the gradient, and it stays crisp
at favicon size. G7 keeps the existing silhouette exactly and adds the spiral
where a reflection would sit, so it's the smallest change from what ships now.

**G6** is the most literally spiral-like while still reading as a diamond.

**G3 and G4 aren't recommended.** G3 is a true spiral but abandons the diamond
entirely and turns illegible small; G4's facets are too close in value to
separate. They're included because they were worth trying, not because they
work.

## Files

Each design has `.svg` (source), `-512.png`, and `-64.png` (favicon size —
check this one before deciding; it's where these designs differ most).

- `_comparison-sheet.png` — G1–G5 side by side
- `_spiral-sheet.png` — G6 and G7

## Applying one

Say the code and I'll update all four places the mark appears:
`src/components/SiteLogo.tsx`, `src/app/icon.svg`, `src/app/favicon.ico`,
`src/app/apple-icon.png`.

Note these are gradient designs, so `SiteLogo.tsx` needs the gradient `<defs>`
copied across — and SVG gradient IDs must be unique per document to avoid
collisions with the mirror's own gradients on the homepage.

> Reference material. Nothing here is imported by the app.
