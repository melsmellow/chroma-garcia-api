# Chroma Garcia API — Development Checklist

## 🟢 Phase 0 — Project Setup

### Project Initialization
- [ ] Initialize Node.js project
- [ ] Install Express
- [ ] Configure TypeScript
- [ ] Configure ECMAScript Modules (ESM)
- [ ] Add `tsx` for development
- [ ] Create initial project folder structure
- [ ] Create `.gitignore`
- [ ] Create initial `README.md`

### Initial Application Setup
- [ ] Create `src/app.ts`
- [ ] Create `src/index.ts`
- [ ] Configure Express
- [ ] Configure JSON body parsing
- [ ] Configure CORS
- [ ] Add `/health` endpoint
- [ ] Configure development script

---

## 🟡 Phase 1 — Application Foundation

### Environment Configuration
- [ ] Create `.env`
- [ ] Create `.env.example`
- [ ] Create `src/config/env.ts`
- [ ] Validate required environment variables with Zod
- [ ] Configure development environment variables
- [ ] Configure production environment variables

**Required Environment Variables**
```
NODE_ENV=
PORT=
CORS_ORIGIN=

MONGODB_URI=

JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

RESEND_API_KEY=
```

### Database Configuration
- [ ] Create MongoDB Atlas cluster
- [ ] Create database user
- [ ] Configure network access
- [ ] Add MongoDB connection string to `.env`
- [ ] Create `src/config/db.ts`
- [ ] Connect Express API to MongoDB
- [ ] Handle MongoDB connection errors
- [ ] Prevent server from starting if database connection fails
- [ ] Test successful MongoDB connection

**Target Flow**
```
index.ts
   ↓
Validate environment
   ↓
Connect MongoDB
   ↓
Start Express server
```

---

## 🟡 Phase 2 — Core Application Infrastructure

### API Routing
- [ ] Create `src/routes/index.ts`
- [ ] Mount API routes in `app.ts`
- [ ] Configure API base path
- [ ] Add API versioning

**API Base Path**
```
/api/v1

Example:
/api/v1/artists
/api/v1/artworks
/api/v1/events
/api/v1/outreach
```

### Error Handling
- [ ] Create custom `ApiError` utility
- [ ] Create centralized error handling middleware
- [ ] Handle Mongoose validation errors
- [ ] Handle duplicate key errors
- [ ] Handle invalid MongoDB ObjectId errors
- [ ] Handle unknown errors
- [ ] Add 404 route handling

**Standard Error Response**
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### Validation Middleware
- [ ] Create generic Zod validation middleware
- [ ] Support request body validation
- [ ] Support query parameter validation
- [ ] Support route parameter validation

---

## 🟡 Phase 3 — Database Models

### Artist
- [ ] Create `Artist.ts`
- [ ] Add unique slug
- [ ] Add slug index
- [ ] Add name
- [ ] Add art style
- [ ] Add medium
- [ ] Add biography
- [ ] Add palette
- [ ] Add social links
- [ ] Add portrait URL
- [ ] Add timestamps

### Artwork
- [ ] Create `Artwork.ts`
- [ ] Add unique slug
- [ ] Add artist ObjectId reference
- [ ] Add title
- [ ] Add image URL
- [ ] Add medium
- [ ] Add category
- [ ] Add tags
- [ ] Add description
- [ ] Add year
- [ ] Add dimensions
- [ ] Add palette
- [ ] Add artwork status
- [ ] Add price
- [ ] Add currency
- [ ] Add featured flag
- [ ] Add timestamps

**Artwork Statuses**
- Available
- Reserved
- Sold
- Not for Sale

### Outreach Post
- [ ] Create `OutreachPost.ts`
- [ ] Add unique slug
- [ ] Add title
- [ ] Add type
- [ ] Add date
- [ ] Add excerpt
- [ ] Add body
- [ ] Add palette
- [ ] Add optional author reference
- [ ] Add timestamps

**Outreach Types**
- Outreach
- Workshop
- Exhibition
- Donation
- Community

### Event
- [ ] Create `Event.ts`
- [ ] Add unique slug
- [ ] Add title
- [ ] Add date
- [ ] Add time
- [ ] Add location
- [ ] Add description
- [ ] Add status
- [ ] Add palette
- [ ] Add timestamps

**Event Statuses**
- Upcoming
- Past

### Other Models
- [ ] Create `Officer.ts`
- [ ] Create `Announcement.ts`
- [ ] Create `User.ts`
- [ ] Create `ContactSubmission.ts`

---

## 🟡 Phase 4 — Seed Existing Data
- [ ] Review existing `data.ts`
- [ ] Map mock data to MongoDB models
- [ ] Update artwork relationships from `artistSlug` to `artist: ObjectId`
- [ ] Create seed directory
- [ ] Create seed scripts
- [ ] Seed artists
- [ ] Seed artworks
- [ ] Seed events
- [ ] Seed outreach posts
- [ ] Seed officers
- [ ] Test seeded MongoDB data

**Suggested Structure**
```
src/
└── seeds/
    ├── artists.seed.ts
    ├── artworks.seed.ts
    ├── events.seed.ts
    └── index.ts
```

---

## 🟡 Phase 5 — Public API

### Artists API
- [ ] Create artist routes
- [ ] Create artist controller
- [ ] Create artist service
- [ ] Create artist validation

**Endpoints**
```
GET /api/v1/artists
GET /api/v1/artists/:slug
```

### Artworks API
- [ ] Create artwork routes
- [ ] Create artwork controller
- [ ] Create artwork service
- [ ] Create artwork validation
- [ ] Add filtering
- [ ] Add search
- [ ] Add pagination

**Endpoints**
```
GET /api/v1/artworks
GET /api/v1/artworks/:slug
```

**Filters**
```
artist
medium
category
status
q
page
limit

Example:
GET /api/v1/artworks?status=Available&q=abstract
```

### Outreach API
- [ ] Create outreach routes
- [ ] Create outreach controller
- [ ] Create outreach service
- [ ] Create outreach validation

```
GET /api/v1/outreach
GET /api/v1/outreach/:slug
```

### Events API
- [ ] Create event routes
- [ ] Create event controller
- [ ] Create event service
- [ ] Create event validation

```
GET /api/v1/events
GET /api/v1/events/:slug
```

**Filters**
```
status=upcoming
status=past
```

### Officers API
- [ ] Create officer route
- [ ] Create officer controller
- [ ] Create officer service

```
GET /api/v1/officers
```

### Partners API
- [ ] Decide where partner data will live
- [ ] Create partner model if needed
- [ ] Create API endpoint

```
GET /api/v1/partners
```

---

## 🟡 Phase 6 — Frontend Integration

### API Client
- [ ] Add `NEXT_PUBLIC_API_URL`
- [ ] Create `src/lib/api.ts`
- [ ] Create reusable API fetch wrapper
- [ ] Add error handling
- [ ] Configure Next.js fetch caching

**Migration Example**
```ts
// Before
import { getArtists } from "@/lib/data";

// After
import { getArtists } from "@/lib/api";
```

### Frontend Migration Order
- [ ] Gallery
- [ ] Artists list
- [ ] Artist detail
- [ ] Events list
- [ ] Event detail
- [ ] Outreach list
- [ ] Outreach detail
- [ ] Home page
- [ ] About page
- [ ] Remove old mock data dependencies
- [ ] Delete `data.ts` when no longer used

---

## 🟡 Phase 7 — Contact Form

### Backend
- [ ] Create `ContactSubmission` model
- [ ] Create contact validation schema
- [ ] Create contact service
- [ ] Create contact controller
- [ ] Create contact route

**Endpoint**
```
POST /api/v1/contact
```

### Contact Flow
- [ ] Validate request
- [ ] Save submission to MongoDB
- [ ] Send email notification
- [ ] Return success response

---

## 🔵 Phase 8 — Authentication

### User Management
- [ ] Create `User` model
- [ ] Add unique email
- [ ] Add password hash
- [ ] Add user roles

**Roles**
- admin
- officer

### Authentication
- [ ] Configure bcrypt
- [ ] Create password hashing utility
- [ ] Create JWT utility
- [ ] Create login endpoint
- [ ] Create logout endpoint
- [ ] Create current-user endpoint

```
POST /api/v1/auth/login
POST /api/v1/auth/logout
GET  /api/v1/auth/me
```

### Authorization
- [ ] Create `requireAuth` middleware
- [ ] Create `requireRole` middleware
- [ ] Protect admin routes
- [ ] Configure HTTP-only cookies
- [ ] Configure cross-origin cookies
- [ ] Configure CORS with `credentials: true`

---

## 🔵 Phase 9 — Cloudinary Integration
- [ ] Create Cloudinary configuration
- [ ] Add Cloudinary environment variables
- [ ] Create upload service
- [ ] Create signed upload endpoint

```
POST /api/v1/uploads/sign
```

- [ ] Test artwork image uploads
- [ ] Test artist portrait uploads
- [ ] Save Cloudinary URLs to MongoDB
- [ ] Implement image deletion if required

---

## 🔵 Phase 10 — Admin API

**Route Protection**
```
requireAuth
    ↓
requireRole("admin")
```

### Artists
- [ ] Create artist
- [ ] Update artist
- [ ] Delete artist

```
POST   /api/v1/admin/artists
PATCH  /api/v1/admin/artists/:id
DELETE /api/v1/admin/artists/:id
```

### Artworks
- [ ] Create artwork
- [ ] Update artwork
- [ ] Delete artwork

```
POST   /api/v1/admin/artworks
PATCH  /api/v1/admin/artworks/:id
DELETE /api/v1/admin/artworks/:id
```

### Events
- [ ] Create event
- [ ] Update event
- [ ] Delete event

```
POST   /api/v1/admin/events
PATCH  /api/v1/admin/events/:id
DELETE /api/v1/admin/events/:id
```

### Outreach
- [ ] Create outreach post
- [ ] Update outreach post
- [ ] Delete outreach post

```
POST   /api/v1/admin/outreach
PATCH  /api/v1/admin/outreach/:id
DELETE /api/v1/admin/outreach/:id
```

### Announcements
- [ ] Create announcement
- [ ] Update announcement
- [ ] Delete announcement

---

## 🔵 Phase 11 — Admin Frontend
- [ ] Create `/admin/login`
- [ ] Create admin layout
- [ ] Implement authentication check
- [ ] Create Artists management UI
- [ ] Create Artworks management UI
- [ ] Create Events management UI
- [ ] Create Outreach management UI
- [ ] Create Announcements management UI
- [ ] Integrate Cloudinary uploads
- [ ] Add loading states
- [ ] Add error states
- [ ] Add success feedback

---

## 🟣 Phase 12 — API Documentation
- [ ] Choose Swagger/OpenAPI approach
- [ ] Configure API documentation
- [ ] Document public endpoints
- [ ] Document authentication
- [ ] Document admin endpoints
- [ ] Document request bodies
- [ ] Document response formats
- [ ] Document error responses

**Optional Documentation Endpoint**
```
/api/docs
```

---

## 🟣 Phase 13 — Security & Production Polish

### Security
- [ ] Add rate limiting
- [ ] Rate limit `/api/v1/contact`
- [ ] Rate limit `/api/v1/auth/login`
- [ ] Configure production CORS origin
- [ ] Validate all environment variables
- [ ] Ensure secrets are not committed
- [ ] Review authentication cookies
- [ ] Add request size limits

### Logging
- [ ] Add request logging
- [ ] Add error logging
- [ ] Choose logging library

### Code Quality
- [ ] Add ESLint
- [ ] Add Prettier
- [ ] Add unit tests
- [ ] Add API integration tests

---

## 🚀 Phase 14 — Deployment

### Backend Deployment
- [ ] Choose deployment platform
- [ ] Configure production environment variables
- [ ] Deploy Express API
- [ ] Verify MongoDB production connection
- [ ] Configure production CORS
- [ ] Test health endpoint

### Frontend Deployment
- [ ] Configure `NEXT_PUBLIC_API_URL`
- [ ] Deploy Next.js frontend
- [ ] Test API connectivity
- [ ] Test authentication cookies
- [ ] Test admin functionality

### Domain Configuration
- [ ] Configure frontend domain
- [ ] Configure API subdomain

```
Example:
https://chromagarcia.art
https://api.chromagarcia.art
```

---

## 🔥 Current Priority — Next Tasks

1. [ ] Create `.env.example`
2. [ ] Create `src/config/env.ts`
3. [ ] Set up MongoDB Atlas
4. [ ] Create `src/config/db.ts`
5. [ ] Connect MongoDB in `index.ts`
6. [ ] Add centralized error handling
7. [ ] Create `src/routes/index.ts`
8. [ ] Create the Artist model
9. [ ] Create the Artwork model
10. [ ] Seed the existing frontend mock data
11. [ ] Build `GET /api/v1/artists`
12. [ ] Build `GET /api/v1/artworks`
13. [ ] Connect the Gallery and Artists pages
