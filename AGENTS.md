# AGENTS.md — Antigravity CLI Project Instructions

## Mandatory Quality Gate Rule
- Whenever you make any code edits or implement features in `apps/*`, you MUST run the corresponding Quality Gate before claiming completion:
  - `apps/fe`: `pnpm quality:fe`
  - `apps/be`: `pnpm quality:be`
  - `apps/ai-services`: `pnpm quality:ai-services`
  - `apps/agentic`: `pnpm quality:agentic`
- Never claim success or commit if Quality Gates fail.

## UI System Kit Standards (`ui-system`)
- For all UI refactor and component development in `apps/fe`, strictly adhere to the UI System Kit (`.agents/skills/ui-system/`):
  - **Tokens First**: Use semantic tokens (`bg-background`, `text-foreground`, `text-gold`, `bg-ink`, `text-cream`, `font-serif`, `font-sans`). Never hardcode hex/rgb colors.
  - **Typography**: Cormorant Garamond (`font-serif`) for titles, prices, quotes; Inter (`font-sans`) for body and labels. Eyebrow headers use `text-[0.7rem] uppercase tracking-luxe text-gold`.
  - **Primitives**: Wrap major sections in `<Reveal>` and use `<SectionLabel>` from `@/components/site/primitives`.
  - **Accessibility**: Minimum touch targets `h-11` (44px), semantic HTML elements, no `<div onClick>`, mobile-first responsive design.
