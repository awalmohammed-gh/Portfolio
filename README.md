# Mohammed Awal — Portfolio & CMS

A Next.js portfolio whose content lives in MongoDB and is managed from a private
admin dashboard at `/admin`. Images are stored on Cloudinary. Saving in the
dashboard updates the public site immediately; no code changes or redeploys.

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 ·
React Icons · MongoDB + Mongoose · Cloudinary · Zod · Argon2id

## Getting started

```bash
npm install
cp .env.example .env.local     # then fill in the values
npm run db:seed                # migrate the original portfolio content into MongoDB
npm run admin:create           # create the admin from ADMIN_EMAIL / ADMIN_PASSWORD
npm run dev                    # http://localhost:3000, dashboard at /admin
```

`db:seed` is idempotent: it only inserts records that are missing and never
overwrites anything edited in the dashboard. After `admin:create`, remove
`ADMIN_PASSWORD` from your env file. To reset a forgotten password, set a new
`ADMIN_PASSWORD` and run `npm run admin:create -- --reset-password`.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` / `build` / `start` | Develop, build, serve |
| `npm run lint` / `typecheck` | ESLint / TypeScript |
| `npm run db:seed` | Migrate original content into MongoDB (safe to re-run) |
| `npm run admin:create` | Provision the administrator account |
| `npm run test:smoke` | End-to-end checks against a running server (`BASE_URL`, default `http://localhost:3100`) |

## How it fits together

```
Admin dashboard ─► /api/* Route Handlers ─► Mongoose ─► MongoDB
Image upload    ─► /api/media/upload (auth + content check) ─► Cloudinary ─► MediaAsset in MongoDB
Public pages    ─► lib/data/public.ts ('use cache' + cacheTag) ─► MongoDB
```

- **Public site** (`src/app/(portfolio)`): the original pages and components,
  now reading from `lib/data/public.ts`. Reads are cached and tagged; every
  admin write calls `revalidateTag`, so the next visitor sees the change.
  Drafts and hidden records are never returned to visitors.
- **Admin** (`src/app/admin`): server-checked session on every page and API
  call. Forms are generated from field definitions in
  `components/admin/resources.ts` and `content-config.ts`.
- **Validation**: Zod schemas in `lib/validations/*` are the single definition
  of what each record may contain, used by the API and the seed script.
- **Models**: `src/models/*`. Editable page copy lives in `SiteContent`, one
  document per section; add a section by adding a schema, not a collection.
- **Icons** are stored by name (e.g. `SiReact`) and resolved via `lib/icons.ts`.

## Security

- No public registration; the admin is provisioned by script.
- Passwords hashed with Argon2id. Sessions are random tokens in an HttpOnly,
  SameSite=Lax cookie (`__Host-` prefixed and `Secure` in production); only a
  SHA-256 hash is stored in MongoDB. Sessions expire after 7 days and are
  revoked on logout; changing the password signs out other sessions.
- Login is rate limited per IP and per email (stored in MongoDB, so it holds
  across serverless instances).
- State-changing requests must come from the site's own origin (CSRF).
- Uploads are limited to 4 MB and checked by file signature (JPEG, PNG, WebP,
  GIF, AVIF; no SVG). Images still in use can't be deleted; images orphaned
  by an edit or delete are removed from Cloudinary automatically.
- No localStorage/sessionStorage. Theme and admin sidebar preferences are
  stored in cookies.

## Deploying to Vercel

1. Create a MongoDB Atlas cluster and a database user. Under **Network Access**
   allow `0.0.0.0/0` (Vercel uses dynamic IPs).
2. In the Vercel project settings, add the environment variables from
   `.env.example` (`MONGODB_URI` pointing at Atlas, the Cloudinary keys, and
   optionally `MONGODB_DB`, `CLOUDINARY_FOLDER`). Don't add `ADMIN_PASSWORD`.
3. Run `npm run db:seed` and `npm run admin:create` once from your machine with
   `.env.local` pointing at the Atlas URI.
4. Deploy. The build prerenders pages from the database, so `MONGODB_URI` must
   be available at build time.
5. In **Site Settings → Site URL**, enter your production URL to enable
   canonical links, the sitemap, and absolute social-sharing image URLs.

`GET /api/health` reports whether the database is reachable.
