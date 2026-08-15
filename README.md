# Chroma Garcia Artist Group — API

Node.js + Express + MongoDB backend for the [Chroma Garcia Artist Group](https://chromagarcia.art)
website. This is the data layer for `chroma-garcia-web` (the Next.js
frontend) — a separate repo that consumes this API over REST and never
talks to MongoDB directly.

See `chroma-garcia-implementation-plan-express-backend.md` in the frontend
repo for the full architecture writeup this was built from.

## Stack

- **Node.js + Express** — REST API
- **MongoDB + Mongoose** — data + schemas
- **TypeScript**
- **JWT (httpOnly cookie)** — auth, verified per-request via middleware
- **Cloudinary** — signed uploads for artist/artwork images
- **Resend** (or Nodemailer) — contact form email delivery
- **Zod** — request validation

## Getting Started

```bash
npm install
cp .env.example .env   # fill in the values below
npm run dev
```

The API runs on `http://localhost:4000` by default (see `PORT` below).

### Environment Variables

```bash
# Server
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000   # the Next.js frontend's origin

# Database
MONGODB_URI=

# Auth
JWT_SECRET=                          # long random string
JWT_EXPIRES_IN=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
RESEND_API_KEY=
CONTACT_TO_EMAIL=hello@chromagarcia.art
```

`src/config/env.ts` validates these on boot — the server refuses to start
if a required variable is missing, rather than failing confusingly later.

### Scripts

```bash
npm run dev      # ts-node-dev / nodemon, auto-restart on change
npm run build    # tsc -> dist/
npm run start    # run compiled dist/index.js (production)
npm run seed     # load starter data (artists/artworks/outreach/events) into MongoDB
npm run lint     # eslint
```

## Project Structure

```
/src
  /config
    db.ts               → Mongoose connection
    env.ts               → env var validation
  /models                → Mongoose schemas (Artist, Artwork, OutreachPost,
                            Event, Officer, Announcement, User, ContactSubmission)
  /routes                 → public route definitions
  /routes/admin            → CRUD routes, mounted behind requireAuth + requireRole("admin")
  /controllers             → one per resource, matches /routes
  /middleware
    requireAuth.ts        → verifies JWT cookie, attaches req.user
    requireRole.ts
    errorHandler.ts
    validate.ts             → Zod schema wrapper for req.body
  /lib
    jwt.ts
    cloudinary.ts
    email.ts
  server.ts                  → Express app, CORS, JSON parsing, route mounting
  index.ts                    → connects DB, starts the server
/scripts
  seed.ts                     → populates MongoDB from starter data
.env.example
```

## API Reference

All responses are JSON. Public `GET` routes are unauthenticated.
`/api/admin/*` routes require a valid session (see **Auth** below).

### Public

| Method | Route | Notes |
|---|---|---|
| GET | `/api/artists` | |
| GET | `/api/artists/:slug` | |
| GET | `/api/artworks` | Query: `artist`, `medium`, `category`, `status`, `q` |
| GET | `/api/artworks/:slug` | |
| GET | `/api/outreach` | |
| GET | `/api/outreach/:slug` | |
| GET | `/api/events` | Query: `status=upcoming\|past` |
| GET | `/api/events/:slug` | |
| GET | `/api/officers` | |
| GET | `/api/partners` | |
| POST | `/api/contact` | Sends email via Resend, also logs a `ContactSubmission` |

### Auth

| Method | Route | Notes |
|---|---|---|
| POST | `/api/auth/login` | Sets an httpOnly JWT cookie on success |
| POST | `/api/auth/logout` | Clears the cookie |
| GET | `/api/auth/me` | Returns the current user, or 401 |

### Uploads

| Method | Route | Notes |
|---|---|---|
| POST | `/api/uploads/sign` | Returns a signed Cloudinary upload payload (admin only) |

### Admin (all require `requireAuth` + `requireRole("admin")`)

| Method | Route |
|---|---|
| POST / PATCH / DELETE | `/api/admin/artists[/:id]` |
| POST / PATCH / DELETE | `/api/admin/artworks[/:id]` |
| POST / PATCH / DELETE | `/api/admin/outreach[/:id]` |
| POST / PATCH / DELETE | `/api/admin/events[/:id]` |
| POST / PATCH / DELETE | `/api/admin/announcements[/:id]` |

## Auth Flow

1. Frontend `POST`s credentials to `/api/auth/login` with `credentials: "include"`.
2. On success, this API signs a JWT and sets it as an **httpOnly,
   `SameSite=None; Secure`** cookie (required for cross-origin cookies once
   both apps are deployed to different domains).
3. Every subsequent request from the frontend must include
   `credentials: "include"` so the cookie is sent automatically.
4. `requireAuth` middleware verifies the JWT on protected routes and
   attaches `req.user`; `requireRole("admin")` further restricts by role.

In local development, `CORS_ORIGIN` must exactly match the frontend's
origin (`http://localhost:3000`) and `cors()` must be configured with
`credentials: true`, or the cookie won't be set/sent at all.

## Data Model

Mongoose schemas live in `/src/models`. Summary (see each model file for
full field definitions/validation):

- **Artist** — `slug` (unique), `name`, `artStyle`, `medium`, `bio`,
  `palette`, `social`, `portraitUrl`
- **Artwork** — `slug` (unique), `title`, `artist` (ref `Artist`),
  `imageUrl`, `medium`, `category`, `tags[]`, `description`, `year`,
  `dimensions`, `palette`, `status`, `price`, `currency`, `isFeatured`
- **OutreachPost** — `slug` (unique), `title`, `type`, `date`, `excerpt`,
  `body`, `palette`, `author` (ref `User`)
- **Event** — `slug` (unique), `title`, `date`, `time`, `location`,
  `description`, `status`, `palette`
- **Officer** — `name`, `role`, `photoUrl`, `order`, `palette`
- **Announcement** — `title`, `body`, `isFeatured`
- **User** — `name`, `email` (unique), `passwordHash`, `role`
- **ContactSubmission** — `name`, `email`, `message`, `submittedAt`

## Seeding

```bash
npm run seed
```

Populates MongoDB with the same starter data currently used as mock data
in the frontend (`chroma-garcia-web/src/lib/data.ts`), so the frontend has
real records to point at as soon as it's cut over to this API.

## Deployment

This is a long-running Node process (not serverless) — deploy to
**Railway**, **Render**, or **Fly.io** rather than Vercel. Set all
environment variables from `.env.example` on whichever platform is used,
and set `CORS_ORIGIN` to the deployed frontend's real URL.

## Related

- Frontend: `chroma-garcia-web` (Next.js) — consumes this API via
  `src/lib/api.ts`, base URL configured through `NEXT_PUBLIC_API_URL`
