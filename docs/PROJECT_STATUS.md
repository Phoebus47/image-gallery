# Project Status – Image Gallery SPA

**Last updated:** March 1, 2026  
**Deadline:** March 1, 2026, 8:00 PM  
**Submit to:** See PRD §6

---

## Summary

| Area                  | Status         |
| --------------------- | -------------- |
| **PRD features**      | ✅ Implemented |
| **Architecture doc**  | ✅ Done        |
| **Deploy doc**        | ✅ Done        |
| **Tests & coverage**  | ✅ 100% (unit) |
| **Quality gates**     | ✅ All passing |
| **Deploy / Live URL** | ✅ Vercel      |

---

## Test assignment compliance (6/6)

| #   | Requirement                                                   | Implementation                                                                                                                                                                  |
| --- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Gallery page with images and hashtags per image               | `GalleryClient`, `ImageGrid`, `GalleryCard`; each card shows image + hashtag list                                                                                               |
| 2   | Show at most x images initially; load more on scroll          | `useInfiniteScroll`, sentinel, `PAGE_SIZE`/`INITIAL_LOAD_COUNT` = 12; load more when sentinel visible                                                                           |
| 3   | Variable image sizes; unlimited hashtags per image            | Masonry layout (`useMasonryColumns`, `useResponsiveColumns`); per-image `hashtags: string[]`                                                                                    |
| 4   | Click hashtag → filter gallery to that tag only               | `useGalleryFilter`, `HashtagFilter` (active tag + clear); filter applied to displayed list                                                                                      |
| 5   | placehold.co placeholders; sample hashtags for testing        | `mock-images.ts` uses placehold.co URLs; varied hashtags for demo and review                                                                                                    |
| 6   | Architecture + production tech (server, OS, deploy) + diagram | [docs/ARCHITECTURE.md](./ARCHITECTURE.md) (Mermaid diagram, stack, data flow); [docs/DEPLOY.md](./DEPLOY.md) (server specs, Node 20, Alpine/Ubuntu, MySQL 8, Vercel/Docker/PM2) |

**Extras:** Framework (Next.js); full source submitted; live URL for testing (Vercel); layout and styling at author’s choice.

---

## Done

### 1. Setup & infrastructure

- Next.js 16, React 19, TypeScript, Tailwind v4
- ESLint, Prettier, Vitest, SonarQube, Husky, Commitlint
- GitHub Actions CI
- Docker (SonarQube)
- docs/CODING_STANDARDS.md, SETUP.md

### 2. PRD features

| PRD item                    | Implementation                                                       |
| --------------------------- | -------------------------------------------------------------------- |
| **2.1 Gallery display**     | GalleryClient, ImageGrid, GalleryCard, mock/API data                 |
| **2.2 Infinite scroll**     | useInfiniteScroll, sentinel, load more                               |
| **2.3 Dynamic image sizes** | Masonry (useMasonryColumns, useResponsiveColumns), zero layout shift |
| **2.4 Unlimited hashtags**  | Per-image hashtags array, HashtagFilter                              |
| **2.5 Keyword filtering**   | useGalleryFilter, active tag, filter by hashtag                      |
| **Placehold.co + mock**     | mock-images.ts, API /api/images (Prisma when DB present)             |

### 3. UI/UX

- **Theme toggle** – Light / Dark / System in header; `localStorage`; no flash (inline script).
- **Loading skeleton** – Grid of 12 pulse cards while initial gallery loads.
- **Contrast** – `--text-tertiary` and dark-mode tokens adjusted for WCAG AA 4.5:1.
- Logo (header + footer) from `public/image-gallery-icon.webp`
- Glassmorphism, design system (globals.css)
- Lightbox (full-screen, next/prev, keyboard, zoom)
- BackToTop, Footer
- Ripple on hashtag click, card stagger (Framer Motion), shimmer loading
- Nav hides on scroll down, shows on scroll up (useScrollDirection)
- Sticky HashtagFilter (header on sm+; on mobile, floating pill bottom-left when filter active, `<section aria-label>`)
- Responsive: overflow-x-hidden, min-w-0/shrink to avoid horizontal scroll; reduced padding/gap on small screens

### 4. Data & API

- `src/lib/data/mock-images.ts` – placehold.co URLs + hashtags
- `src/app/api/images/route.ts` – GET images (Prisma or fallback)
- `src/lib/db.ts` – Prisma client
- Optional: MySQL + Prisma (db:generate, db:push, db:seed)

### 5. Documentation

- PRD.md – requirements
- docs/CODING_STANDARDS.md – coding standards
- docs/ARCHITECTURE.md – diagram (Mermaid), stack, data flow
- docs/DEPLOY.md – Docker, Vercel, Ubuntu + PM2
- docs/PROJECT_STATUS.md – status and key files
- SETUP.md – local setup
- README.md – features, scripts, docs links

### 6. Tests

- **Unit:** 22 test files, 118 tests (Vitest + RTL), coverage 100%
- **E2E:** Playwright (test:e2e) – 8 tests (gallery, filter, clear, lightbox, back-to-top, infinite scroll, mobile floating filter pill, theme toggle data-theme). Timeouts used for initial load and smooth-scroll where needed. test:e2e:report to open HTML report.
- Covered: GalleryCard, ImageGrid, HashtagFilter, ThemeToggle, Lightbox, BackToTop, Footer, GalleryClient, page, layout, API route, hooks (infinite-scroll, image-pool, gallery-filter, masonry, responsive-columns, scroll-direction, use-theme), mock-data, utils, db

### 7. Code quality

All gates pass. Bar: 0 open issues (Security, Reliability, Maintainability), 100% unit coverage, 0% duplications, SonarQube Quality Gate passed.

| Check      | Command                | Status  |
| ---------- | ---------------------- | ------- |
| ESLint     | `npm run lint`         | ✅ pass |
| Prettier   | `npm run format:check` | ✅ pass |
| TypeScript | `npm run type-check`   | ✅ pass |
| Unit tests | `npm run test:ci`      | ✅ pass |
| Build      | `npm run build`        | ✅ pass |
| SonarQube  | `npm run sonar`        | ✅ pass |

### 8. Deployment

- **Vercel:** App is deployed on Vercel.
- **Live URL:** [https://image-gallery-thanakrit-thanyawatsa.vercel.app/](https://image-gallery-thanakrit-thanyawatsa.vercel.app/)

---

## Optional / not done

- _(None; deployment to Vercel is done.)_

---

## Key files

| Path                                    | Purpose                                         |
| --------------------------------------- | ----------------------------------------------- |
| `src/app/page.tsx`                      | Home, renders GalleryClient                     |
| `src/app/components/GalleryClient.tsx`  | Client gallery, filter + scroll + grid          |
| `src/components/GalleryCard.tsx`        | Single card, image + hashtags, lightbox trigger |
| `src/components/ImageGrid.tsx`          | Masonry grid (ul/li, semantic list)             |
| `src/components/HashtagFilter.tsx`      | Sticky tag filter                               |
| `src/components/ThemeToggle.tsx`        | Light / Dark / System theme in header           |
| `src/components/Lightbox.tsx`           | Full-screen viewer                              |
| `src/components/BackToTop.tsx`          | Scroll-to-top button                            |
| `src/components/Footer.tsx`             | Footer with logo                                |
| `src/lib/constants.ts`                  | LABELS, logo path, page size                    |
| `src/lib/hooks/use-image-pool.ts`       | Fetch from API or mock fallback                 |
| `src/lib/hooks/use-infinite-scroll.ts`  | Sentinel-based load more                        |
| `src/lib/hooks/use-gallery-filter.ts`   | Filter by hashtag                               |
| `src/lib/hooks/use-masonry-columns.ts`  | Masonry layout distribution                     |
| `src/lib/hooks/use-scroll-direction.ts` | Nav visibility (hide on scroll down)            |
| `src/lib/hooks/use-theme.ts`            | Theme state + localStorage                      |
| `src/lib/data/mock-images.ts`           | Mock data (placehold.co)                        |
| `src/app/api/images/route.ts`           | GET images API                                  |
| `docs/ARCHITECTURE.md`                  | Architecture diagram                            |
| `docs/DEPLOY.md`                        | Deployment guide                                |
