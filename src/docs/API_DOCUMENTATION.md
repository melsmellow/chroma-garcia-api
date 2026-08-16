# Chroma Garcia API Documentation

## Overview

This document serves as the API reference and development context for the Chroma Garcia frontend.

The backend is built with:

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- JWT authentication
- HTTP-only cookies
- Cloudinary for image storage
- Resend for password reset emails

---

# Base URL

## Development

```text
http://localhost:5000
```

Example:

```text
http://localhost:5000/api/artists
```

Recommended frontend environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

# Authentication

The backend uses JWT authentication.

After a successful login, the backend stores the JWT inside an HTTP-only cookie.

Because the cookie is HTTP-only:

- The frontend cannot access the JWT using JavaScript.
- The frontend should not store the token in `localStorage`.
- Authenticated requests should include credentials so cookies can be sent.

Example:

```ts
await fetch(`${API_URL}/api/artists`, {
  credentials: "include",
});
```

> The backend remains responsible for enforcing authentication and authorization.

---

# User Roles

```ts
type UserRole = "admin" | "officer";
```

| Role | Description |
| --- | --- |
| `admin` | Full administrative access |
| `officer` | Authorized staff/officer access |

---

# Authentication Routes

Base path:

```text
/api/auth
```

## Signup

```http
POST /api/auth/signup
```

**Authentication:** Not required.

### Request Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "officer"
}
```

| Field | Type | Required |
| --- | --- | --- |
| `name` | string | Yes |
| `email` | string | Yes |
| `password` | string | Yes |
| `role` | `"admin" \| "officer"` | No |

If no role is provided, the backend defaults to `admin`.

---

## Login

```http
POST /api/auth/login
```

**Authentication:** Not required.

### Request Body

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

### Success Response

```json
{
  "message": "Login successful.",
  "user": {
    "id": "USER_ID",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "officer"
  }
}
```

The JWT is stored in an HTTP-only cookie.

### Development

When `NODE_ENV=development`, the backend may expose the JWT in the response for development and Postman testing.

The frontend should still use the authentication cookie/session flow instead of manually storing the JWT.

---

## Logout

```http
POST /api/auth/logout
```

**Authentication:** Required.

### Behavior

Clears the JWT authentication cookie.

### Success Response

```json
{
  "message": "Logout successful."
}
```

---

## Forgot Password

```http
POST /api/auth/forgot-password
```

**Authentication:** Not required.

### Request Body

```json
{
  "email": "john@example.com"
}
```

### Validation

The backend:

- Requires an email.
- Validates email format.
- Trims whitespace.
- Normalizes the email to lowercase.

Invalid input example:

```json
{
  "email": "invalid-email"
}
```

Response:

```http
400 Bad Request
```

```json
{
  "message": "Please provide a valid email address."
}
```

### Email Enumeration Protection

A valid email that does not belong to a user returns the same response as an existing user:

```json
{
  "message": "If an account with that email exists, a password reset link will be sent."
}
```

Behavior:

```text
Existing user
→ Generic success response
→ Reset email is sent

Non-existing user
→ Same generic success response
→ No email is sent
```

### Rate Limiting

The forgot-password endpoint is rate-limited.

Current configuration:

```text
5 requests per IP within 15 minutes
```

When exceeded:

```json
{
  "message": "Too many password reset requests. Please try again later."
}
```

Expected HTTP status:

```text
429 Too Many Requests
```

### Password Reset Flow

```text
User enters email
        ↓
POST /api/auth/forgot-password
        ↓
Validate and normalize email
        ↓
Find user
        ↓
Generate secure random token
        ↓
Hash token before storing in MongoDB
        ↓
Store token expiration
        ↓
Generate reset URL
        ↓
Send reset email using Resend
```

The raw token is sent to the user via email.

MongoDB stores only the hashed token.

Current token expiration:

```text
1 hour
```

---

# Reset Password

The forgot-password flow is implemented, while the reset-password endpoint is still pending implementation.

Planned endpoint:

```http
POST /api/auth/reset-password
```

Planned request:

```json
{
  "token": "TOKEN_FROM_EMAIL",
  "password": "newPassword123"
}
```

Planned backend flow:

```text
Receive raw token
        ↓
Hash token
        ↓
Find matching user
        ↓
Validate expiration
        ↓
Hash new password
        ↓
Clear password reset token
        ↓
Clear expiration
```

---

# Artist Routes

Base path:

```text
/api/artists
```

## Get Artists

```http
GET /api/artists
```

**Authentication:** Not required.

### Query Parameters

| Parameter | Default | Maximum |
| --- | --- | --- |
| `page` | `1` | - |
| `limit` | `12` | `50` |

Example:

```http
GET /api/artists?page=1&limit=12
```

### Response

```json
{
  "artists": [
    {
      "_id": "ARTIST_ID",
      "slug": "juan-dela-cruz",
      "name": "Juan Dela Cruz",
      "artStyle": "Contemporary",
      "medium": "Acrylic",
      "bio": "Artist biography...",
      "palette": ["#FF0000", "#00FF00"],
      "social": {
        "instagram": "https://instagram.com/example",
        "facebook": "https://facebook.com/example",
        "website": "https://example.com"
      },
      "portraitUrl": "https://res.cloudinary.com/..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 35,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

---

## Get Artist By Slug

```http
GET /api/artists/:slug
```

Example:

```http
GET /api/artists/juan-dela-cruz
```

**Authentication:** Not required.

### Response

```json
{
  "artist": {
    "_id": "ARTIST_ID",
    "slug": "juan-dela-cruz",
    "name": "Juan Dela Cruz",
    "artStyle": "Contemporary",
    "medium": "Acrylic",
    "bio": "Artist biography...",
    "palette": ["#FF0000", "#00FF00"],
    "social": {
      "instagram": "https://instagram.com/example",
      "facebook": "https://facebook.com/example",
      "website": "https://example.com"
    },
    "portraitUrl": "https://res.cloudinary.com/..."
  }
}
```

---

## Get Artworks By Artist Slug

```http
GET /api/artists/:slug/artworks
```

Example:

```http
GET /api/artists/juan-dela-cruz/artworks?page=1&limit=12
```

**Authentication:** Not required.

### Query Parameters

| Parameter | Default | Maximum |
| --- | --- | --- |
| `page` | `1` | - |
| `limit` | `12` | `50` |

### Response

```json
{
  "artist": {
    "_id": "ARTIST_ID",
    "slug": "juan-dela-cruz",
    "name": "Juan Dela Cruz"
  },
  "artworks": [
    {
      "_id": "ARTWORK_ID",
      "title": "Midnight Colors",
      "slug": "midnight-colors",
      "imageUrl": "https://res.cloudinary.com/...",
      "likeCount": 12
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 35,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

> Route ordering matters in Express. `/api/artists/:slug/artworks` should be registered before `/api/artists/:slug`.

---

## Create Artist

```http
POST /api/artists
```

**Authentication:** Required.

### Content Type

```text
multipart/form-data
```

### Form Data

| Field | Type | Required |
| --- | --- | --- |
| `slug` | string | Yes |
| `name` | string | Yes |
| `artStyle` | string | Yes |
| `medium` | string | Yes |
| `bio` | string | Yes |
| `palette` | array/string | Yes |
| `social` | object/stringified JSON | No |
| `portrait` | file | No |

The portrait is uploaded to Cloudinary and the resulting URL is stored as `portraitUrl`.

---

# Artwork Routes

Base path:

```text
/api/artworks
```

## Artwork Model Context

An artwork belongs to an artist:

```text
Artist
   │
   ├── Artwork
   ├── Artwork
   └── Artwork
```

The artwork stores the artist's MongoDB ObjectId.

The backend validates:

1. The `artist` value exists.
2. The value is a valid MongoDB ObjectId.
3. The referenced artist exists.

---

## Artwork Likes

Artworks include:

```ts
likeCount: number;
```

The current design does not store `likedBy` users because likes are intended to support anonymous/public viewers.

Future plans may include:

```text
Socket.IO
        ↓
Real-time artwork like updates
        ↓
Anonymous/unique viewer tracking
```

For now, the frontend should treat `likeCount` as the total number of likes.

---

## Get Artworks

```http
GET /api/artworks
```

**Authentication:** Not required.

Expected pagination usage:

```http
GET /api/artworks?page=1&limit=12
```

The preferred pagination response structure is:

```json
{
  "artworks": [],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

## Get Artwork

The public artwork details route follows the artwork route implementation using its identifier, typically a slug.

Expected pattern:

```http
GET /api/artworks/:slug
```

Example:

```http
GET /api/artworks/midnight-colors
```

**Authentication:** Not required.

---

## Get Artworks By Artist

For public frontend pages, prefer the artist slug route:

```http
GET /api/artists/:slug/artworks?page=1&limit=12
```

Example:

```http
GET /api/artists/juan-dela-cruz/artworks?page=1&limit=12
```

---

## Create Artwork

```http
POST /api/artworks
```

**Authentication:** Required.

### Content Type

```text
multipart/form-data
```

### Typical Form Data

| Field | Description |
| --- | --- |
| `title` | Artwork title |
| `slug` | URL-friendly identifier |
| `artist` | Artist MongoDB ID |
| `medium` | Artwork medium |
| `category` | Artwork category |
| `tags` | Artwork tags |
| `description` | Artwork description |
| `year` | Year created |
| `dimensions` | Artwork dimensions |
| `palette` | Artwork color palette |
| `status` | Artwork availability/status |
| `price` | Artwork price |
| `currency` | Currency |
| `isFeatured` | Featured artwork |
| `image` | Artwork image file |

Example:

```text
artist=689f12345678901234567890
```

The `artist` field must contain a valid MongoDB ObjectId.

The backend uploads the image to Cloudinary.

If the Cloudinary upload fails, the request should fail instead of creating an artwork with an invalid image URL.

---

# Image Uploads

Artists and artworks use Cloudinary for image storage.

The frontend should send actual image files using `FormData`.

Example:

```ts
const formData = new FormData();

formData.append("title", "Midnight Colors");
formData.append("artist", artistId);
formData.append("image", selectedFile);
```

Request:

```ts
await fetch(`${API_URL}/api/artworks`, {
  method: "POST",
  body: formData,
  credentials: "include",
});
```

Do not manually set:

```text
Content-Type: multipart/form-data
```

when using browser `FormData`.

The browser automatically adds the required multipart boundary.

---

# Error Handling

The frontend should handle common status codes:

| Status | Meaning |
| --- | --- |
| `200` | Successful request |
| `201` | Resource successfully created |
| `400` | Invalid request or validation error |
| `401` | Authentication required or invalid credentials |
| `403` | Insufficient permissions |
| `404` | Resource not found |
| `429` | Too many requests / rate limited |
| `500` | Internal server error |

Example:

```ts
const response = await fetch(url);

const data = await response.json();

if (!response.ok) {
  throw new Error(
    data.message || "Something went wrong."
  );
}
```

---

# Shared Frontend Types

## Pagination

```ts
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

## Artists Response

```ts
export interface ArtistsResponse {
  artists: Artist[];
  pagination: Pagination;
}
```

## Artist Artworks Response

```ts
export interface ArtistArtworksResponse {
  artist: Artist;
  artworks: Artwork[];
  pagination: Pagination;
}
```

## User Types

```ts
export type UserRole = "admin" | "officer";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
```

---

# Recommended Frontend Structure

```text
src/
├── types/
│   ├── artist.ts
│   ├── artwork.ts
│   ├── user.ts
│   └── api.ts
│
├── services/
│   ├── auth.service.ts
│   ├── artist.service.ts
│   └── artwork.service.ts
│
├── lib/
│   └── api.ts
│
└── app/
```

---

# Shared API Client

Suggested file:

```text
src/lib/api.ts
```

```ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      credentials: "include",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong."
    );
  }

  return data;
};
```

---

# Example Artist Service

```ts
import { apiFetch } from "@/lib/api";

export const getArtists = async (
  page = 1,
  limit = 12
) => {
  return apiFetch<ArtistsResponse>(
    `/api/artists?page=${page}&limit=${limit}`
  );
};

export const getArtistBySlug = async (
  slug: string
) => {
  return apiFetch<{
    artist: Artist;
  }>(`/api/artists/${slug}`);
};

export const getArtistArtworks = async (
  slug: string,
  page = 1,
  limit = 12
) => {
  return apiFetch<ArtistArtworksResponse>(
    `/api/artists/${slug}/artworks?page=${page}&limit=${limit}`
  );
};
```

---

# Suggested Frontend Routes

## Public

```text
/
/artists
/artists/[slug]
/artists/[slug]/artworks
/artworks
/artworks/[slug]
```

## Authentication

```text
/login
/forgot-password
/reset-password
```

## Protected

```text
/dashboard
/dashboard/artists
/dashboard/artworks
```

The frontend can protect the UI, but the backend must independently enforce authentication.

---

# Current Development Status

## Authentication

- [x] User model
- [x] Signup
- [x] Login
- [x] Logout
- [x] JWT generation
- [x] JWT HTTP-only cookie
- [x] Authentication middleware
- [x] Protected routes
- [x] Forgot password
- [x] Email validation
- [x] Password reset token generation
- [x] Hashed reset token storage
- [x] Token expiration
- [x] Resend email integration
- [x] Forgot password rate limiting
- [ ] Reset password endpoint
- [ ] Reset password frontend page
- [ ] Per-email password reset cooldown

## Artists

- [x] Artist model
- [x] Create artist
- [x] Get artists
- [x] Artist pagination
- [x] Get artist by slug
- [x] Get artworks by artist slug
- [x] Artwork pagination by artist
- [x] Cloudinary portrait upload
- [ ] Update artist
- [ ] Delete artist

## Artworks

- [x] Artwork model
- [x] Create artwork
- [x] Artist ObjectId validation
- [x] Cloudinary image upload
- [x] Like count
- [x] Public artwork retrieval
- [x] Get artworks by artist
- [ ] Confirm/finalize pagination consistency for all artwork list routes
- [ ] Update artwork
- [ ] Delete artwork
- [ ] Like endpoint
- [ ] Socket.IO real-time likes

---

# Important Frontend Notes

## Prefer Slugs for Public URLs

Prefer:

```text
/artists/juan-dela-cruz
```

instead of:

```text
/artists/689f12345678901234567890
```

MongoDB IDs should mainly be used internally for relationships and protected CRUD operations.

## Always Handle Pagination

Do not assume all artists or artworks are returned in a single request.

Use:

```ts
pagination.hasNextPage
```

for:

- Load More buttons
- Infinite scrolling
- Previous/next navigation
- Numbered pagination

## Do Not Store JWT in Local Storage

Avoid:

```ts
localStorage.setItem("token", token);
```

The application uses HTTP-only cookies.

Use:

```ts
credentials: "include";
```

for requests that need browser authentication cookies.

---

# Future Improvements

- [ ] Reset password endpoint
- [ ] Per-email forgot-password cooldown
- [ ] Refresh token/session strategy
- [ ] Socket.IO
- [ ] Real-time artwork likes
- [ ] Anonymous viewer tracking
- [ ] Artwork search
- [ ] Artist search
- [ ] Artwork filtering
- [ ] Featured artworks endpoint
- [ ] Admin dashboard analytics
- [ ] Cloudinary image deletion
- [ ] Image replacement
- [ ] Soft delete
- [ ] Audit logs
