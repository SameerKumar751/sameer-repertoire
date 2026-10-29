# Sameer Kumar — Portfolio (V5)

React 18 · TypeScript · Vite 5 · Tailwind CSS v4 · GSAP + ScrollTrigger · Simple Icons (brand logos).
Palette: black `#050505`, ivory `#F3F0E8`, vermilion `#F04B32` (tokens in `src/styles/globals.css`).
Fonts: Bricolage Grotesque (display), Inter (body), IBM Plex Mono (labels), via @fontsource packages.

**Node:** 18.18+ (22 LTS recommended).

```
npm install      # creates package-lock.json — commit it (none ships in this archive)
npm run dev
npm run build    # tsc --noEmit && vite build -> dist/
npm run preview
```

## Scroll architecture (src/App.tsx)
| Transition | Mechanism |
|---|---|
| Hero → About | `StickyLayer` (position: sticky) holds Hero; About (z-index 1) scrolls over it; Hero dims via scrubbed ScrollTrigger |
| About → Principles | plain document flow |
| Principles → Projects | same `StickyLayer` pattern (taller layers hold with their *bottom* at the viewport bottom) |
| Skills | independent: `ScrollTrigger` pins only `.sk-pin`; one scrubbed timeline drives logos, category titles and ticks (fully reversible) |
| Experience | plain flow |
| Certifications → Contact | `StickyLayer` + Contact over it; footer follows in normal flow |

No transforms are applied to ancestors of sticky layers. Skills sequence length ≈ 0.34 × viewport height per technology (0.28 on phones); a "Skip technologies" link jumps to Experience. With reduced motion, Skills is a static grouped list.

## Where things are
- Orange thread: `components/thread/Thread.tsx` (hero, contact), `Rail.tsx` (About, Principles, Projects, Experience).
- Skills data + categories: `src/data/skills.ts`; logo map: `src/features/skills/icons.ts` (technologies with no brand mark — Java, SQL — use a typographic mark; REST APIs uses an original diagram).
- Content: `src/data/*.ts`. Signature placeholder: `src/config/signature.ts` (kept as-is; not your real signature).

## Asset checklist (relative to `public/`, see `src/config/assets.ts`)
| Asset | Path | Status |
|---|---|---|
| Resume PDF | `public/resume.pdf` | **PLACEHOLDER file (clearly marked, no real content) — replace with your real resume before launch.** Same filename = no code change |
| Contact portrait | `public/assets/sameer-portrait.jpg` | Supplied. Crop/face centre are constants at the top of `features/contact/ParticlePortrait.tsx`; a plain light background gives the cleanest dots |
| Certificate images (4:3 JPG) | `assets/certificates/genai.jpg`, `dp700.jpg`, `oracle-agent-ai.jpg` | Missing — typographic fallback |
| KIF-RMS screenshots | `assets/projects/kif-rms.jpg` | Missing — diagram shown |
| Social image | `og-image.jpg` + absolute `og:image` in `index.html` | Missing (needs domain) |

## Content still to confirm
DP-700 and Oracle Agent AI are "Verification pending" (`src/data/certifications.ts`). Bharat Darshan and QuanDetect show only title + GitHub link. No email set (`src/data/profile.ts`). The Contact section has links only — no form exists, so there is no validation/submission logic to preserve.

## Deploy (Vercel)
Preset Vite · `npm run build` · output `dist`. Add canonical / og:url / og:image and a sitemap line once the domain is known.

## Verification status
Only a TypeScript syntax-level pass was possible (no network: dependencies could not be installed), so the build, browser behaviour and visuals are **untested**.


## React Bits Pro (Spectral Drape / Particle Text) — NOT installed yet
`components.json` is configured with the `@reactbits-starter` registry (`https://pro.reactbits.dev/api/r/starter/{name}.json`, `Authorization: Bearer ${REACTBITS_LICENSE_KEY}`), a `@/` alias and `src/lib/utils.ts` (`cn`). To install:
1. Put your key in `.env.local` as `REACTBITS_LICENSE_KEY=...` (git-ignored; never prefix with `VITE_`).
2. `npx shadcn@latest add @reactbits-starter/spectral-drape-tw` and `npx shadcn@latest add @reactbits-starter/particle-text-tw`.
3. Read the installed source/props (the docs list React 19 / Next.js; this project is React 18 + Vite — check peer dependencies), then replace `features/hero/HeroDrape.tsx` and `features/hero/ParticleName.tsx` usage in `sections/Hero.tsx`.
Until then the hero uses in-house canvas stand-ins with the same roles (`HeroDrape`, `ParticleName`). They are not React Bits components.

## Notes
- Skills: category label, ticks, progress bar and the logo all derive from one scrubbed timeline (`sections/Skills.tsx`); "Skip technologies" jumps to Experience.
- Logos come from `simple-icons` (^13); Java, SQL have no brand mark in the package and show a typographic mark; REST APIs uses an original diagram.
- KIF-RMS stack descriptions (`stackDetails` in `src/data/projects.ts`) are short role summaries inferred from the listed stack — verify against the repository.
- Experience illustration is conceptual (frontend / API / data / runtime layers).


## Resume
The Resume button downloads `/resume.pdf`. **Replace `public/resume.pdf` with your actual resume PDF** (keep the name). The button is active whenever that file exists; the file shipped now is only a placeholder.

## Scroll/thread architecture notes (V5)
- Hero thread: `components/thread/HeroThread.tsx` measures the rendered headline (cap-height, baseline, text extents) and builds two layered paths (behind SYSTEMS, in front of the K, ending in a ring on the orange full stop). It rebuilds on resize/font-load and keeps its progress.
- Rails (About, Principles, Projects, Experience): `components/thread/Rail.tsx` — one timeline per rail; nodes reveal at their real y-position. Principles uses `stuck` because its content stops moving when the next section covers it.
- Skills: one scrubbed value drives every logo/label/tick (`sections/Skills.tsx`).
