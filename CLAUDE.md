# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server (Turbopack, port 3000)
npm run build    # production build (Turbopack by default)
npm run start    # serve production build
npm run lint     # run ESLint via the ESLint CLI directly (not `next lint`)
```

There are no tests yet. When added, run a single test file with whichever test runner is chosen.

## What this project is

PM Real Estate (`pmlaos`) — a bilingual (Lao/English) property listing and lead-generation website for a real estate broker in Vientiane, Laos. Full requirements are in `SRS.md`.

**Planned stack additions** (none installed yet): Prisma + Supabase PostgreSQL, Cloudinary, bcrypt, session auth.

## Next.js 16 — critical breaking changes

**Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.** Key differences from prior versions:

### `middleware.ts` is gone — use `proxy.ts`

The file is now `proxy.ts` (at project root, same level as `app/`). The exported function must be named `proxy` (not `middleware`):

```ts
// proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) { ... }

export const config = { matcher: [...] }
```

### All request-time APIs are async — no synchronous access

`params`, `searchParams`, `cookies()`, `headers()`, and `draftMode()` must all be awaited. Synchronous access was removed entirely in v16.

```tsx
// page.tsx
export default async function Page(props: PageProps<'/[locale]/listings/[slug]'>) {
  const { locale, slug } = await props.params   // must await
  const query = await props.searchParams         // must await
}
```

Run `npx next typegen` to generate `PageProps`, `LayoutProps`, and `RouteContext` type helpers.

### Turbopack is default

`next dev` and `next build` both use Turbopack. No `--turbopack` flag needed. Custom `webpack` config in `next.config.ts` will break the build — migrate to `turbopack` options or pass `--webpack` to opt out.

`experimental.turbopack` is now a top-level `turbopack` key in `next.config.ts`.

### Other async breaking changes

- `sitemap` generating function receives `id` as `Promise<string>` — must await it.
- `opengraph-image` / `twitter-image` / `icon` / `apple-icon` generating functions receive `params` and `id` as Promises.

## Architecture plan (from SRS.md)

### i18n routing

Locales: `lo` (default) and `en`. URL structure: `/{locale}/...`. No built-in Next.js i18n config — implemented manually via:

1. **`proxy.ts`** — redirects bare `/` → `/lo`, enforces locale prefix.
2. **`app/[locale]/`** — dynamic route segment carrying the locale through all public pages.
3. **`messages/lo.json` + `messages/en.json`** — all UI strings.
4. Lao listings store bilingual content in the DB: `titleEn`, `titleLo`, `descEn`, `descLo`.

### Route layout

```
app/
  layout.tsx               # bare root layout (no locale-aware logic here)
  [locale]/
    layout.tsx             # locale layout: sets <html lang="">, loads Noto Sans Lao for 'lo'
    page.tsx               # homepage: hero, featured listings, contact CTA
    listings/
      page.tsx             # listing index with filter bar (URL query params)
      [slug]/page.tsx      # listing detail
    about/page.tsx
    contact/page.tsx
  admin/                   # NOT locale-prefixed
    login/page.tsx
    layout.tsx             # session guard — redirect to /admin/login if no session
    page.tsx               # dashboard (stats)
    listings/
      page.tsx             # listings table
      new/page.tsx
      [id]/edit/page.tsx
    inquiries/page.tsx
proxy.ts                   # locale redirect + admin session guard hints
```

### Data layer

- **Prisma** schema: `Listing` and `Inquiry` models (fields defined in `SRS.md` §7).
- **Supabase** free-tier PostgreSQL as the hosted database.
- DB access only from Server Components and Route Handlers — never from Client Components.

### Admin auth

Single admin user. Email + password stored as bcrypt hash in env. Session via an encrypted cookie (e.g. iron-session or jose). `proxy.ts` can do an optimistic check; real authorization must also happen inside each Server Function/Route Handler.

### Image uploads

Cloudinary — upload from admin panel, store returned URLs in `Listing.images` (String[]). The `[locale]/listings/[slug]` detail page renders a swipeable gallery (up to 20 images).

### SEO

- Listing detail pages: `generateStaticParams` for SSG, `generateMetadata` for locale-aware title/description/OG.
- `app/sitemap.ts` — covers all active listings in both locales.
