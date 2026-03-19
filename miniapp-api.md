# Cinema Mini App API Documentation

REST API for the Telegram Mini App frontend. All endpoints are under `/api/miniapp/` and require Telegram Web App authentication.

## Base URL

```
https://yourdomain.com/api/miniapp
```

## Authentication

Every request must include the Telegram Web App `initData` in the `Authorization` header:

```
Authorization: tma <initData>
```

`initData` is provided by the Telegram Web App SDK via `window.Telegram.WebApp.initData`.

### How it works

1. Backend extracts `initData` from the header
2. Verifies HMAC-SHA256 signature using the bot token
3. Checks `auth_date` is not older than 24 hours
4. Extracts `telegram_id` from the `user` JSON parameter
5. Finds the `TelegramUser` record in the database
6. Sets the app locale based on the user's language preference

### Error responses

| Status | When |
|--------|------|
| `401` | Missing or invalid `Authorization` header |
| `403` | User not registered (must use the bot first to register) |

```json
{
  "message": "Missing Telegram Web App authorization."
}
```

### Frontend setup (TypeScript)

```typescript
const tg = window.Telegram.WebApp;

const api = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': `tma ${tg.initData}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};
```

---

## Common Response Format

All list endpoints return data wrapped in a `data` array:

```json
{
  "data": [ ... ]
}
```

Single resource endpoints return data wrapped in a `data` object:

```json
{
  "data": { ... }
}
```

### Error format

```json
{
  "message": "Error description."
}
```

### Validation error format (422)

```json
{
  "message": "The showtime id field is required.",
  "errors": {
    "showtime_id": ["The showtime id field is required."],
    "seat_ids": ["The seat ids field is required."]
  }
}
```

---

## TypeScript Types

```typescript
interface Movie {
  id: number;
  name: string;
  description: string | null;
  poster_url: string | null;
  duration: number;           // in minutes
  is_active: boolean;
  upcoming_showtimes_count: number;
}

interface Showtime {
  id: number;
  movie_id: number;
  hall_id: number;
  start_time: string;         // ISO 8601: "2026-03-20T19:00:00+05:00"
  start_date: string;         // "2026-03-20"
  price: number;              // in UZS (integer, no decimals)
  hall?: Hall;
  movie?: Movie;
  available_seats_count?: number;
}

interface Hall {
  id: number;
  name: string;
}

interface Seat {
  id: number;
  row: number;
  number: number;
  is_active: boolean;
  is_booked: boolean;
}

interface SeatMap {
  rows: SeatRow[];
}

interface SeatRow {
  row_number: number;
  seats: Seat[];
}

interface Booking {
  id: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  status_label: string;       // localized: "Kutilmoqda" / "В ожидании" / etc.
  ticket_code: string | null; // "TKT-A1B2C3D4" (only when confirmed)
  showtime: Showtime;
  seats: Seat[];
  total_price: number;        // price * seats count
  can_cancel: boolean;        // true only when status is "pending"
  created_at: string;         // ISO 8601
}

interface MovieRequest {
  id: number;
  movie_name: string;
  movie_year: number | null;
  trailer_url: string | null;
  preferred_date: string | null;  // "2026-03-25"
  preferred_time: string | null;  // "19:00"
  guests_count: number;
  status: 'pending' | 'approved' | 'rejected';
  status_label: string;           // localized
  admin_note: string | null;
  created_at: string;             // ISO 8601
}

interface Profile {
  id: number;
  telegram_id: string;
  first_name: string;
  last_name: string | null;
  username: string | null;
  phone: string | null;
  language: 'uz' | 'ru' | 'kk';
  bookings_count?: number;
}

interface BookingStats {
  total: number;
  confirmed: number;
  pending: number;
  cancelled: number;
}

interface CalendarDay {
  date: string;   // "2026-03-20"
  count: number;  // number of showtimes on that day
}
```

---

## Endpoints

### Movies

#### GET /movies

List all active movies, ordered by number of upcoming showtimes (most first).

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Filter movies by name (partial match) |

**Request:**

```
GET /api/miniapp/movies?search=Avatar
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Avatar 3",
      "description": "The next chapter of the Avatar saga.",
      "poster_url": "/storage/posters/avatar3.jpg",
      "duration": 150,
      "is_active": true,
      "upcoming_showtimes_count": 5
    },
    {
      "id": 2,
      "name": "Avatar 2",
      "description": "The Way of Water.",
      "poster_url": "/storage/posters/avatar2.jpg",
      "duration": 192,
      "is_active": true,
      "upcoming_showtimes_count": 2
    }
  ]
}
```

---

#### GET /movies/featured

Movies that have showtimes today. Use for hero section / carousel.

**Request:**

```
GET /api/miniapp/movies/featured
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Avatar 3",
      "description": "The next chapter of the Avatar saga.",
      "poster_url": "/storage/posters/avatar3.jpg",
      "duration": 150,
      "is_active": true,
      "upcoming_showtimes_count": 5
    }
  ]
}
```

---

#### GET /movies/{id}

Single movie with its upcoming showtimes grouped by date.

**Request:**

```
GET /api/miniapp/movies/1
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": {
    "id": 1,
    "name": "Avatar 3",
    "description": "The next chapter of the Avatar saga.",
    "poster_url": "/storage/posters/avatar3.jpg",
    "duration": 150,
    "is_active": true,
    "upcoming_showtimes_count": 5
  },
  "showtimes_by_date": {
    "2026-03-20": [
      {
        "id": 10,
        "movie_id": 1,
        "hall_id": 1,
        "start_time": "2026-03-20T14:00:00+05:00",
        "start_date": "2026-03-20",
        "price": 50000,
        "hall": { "id": 1, "name": "Zal 1" }
      },
      {
        "id": 11,
        "movie_id": 1,
        "hall_id": 1,
        "start_time": "2026-03-20T19:00:00+05:00",
        "start_date": "2026-03-20",
        "price": 60000,
        "hall": { "id": 1, "name": "Zal 1" }
      }
    ],
    "2026-03-21": [
      {
        "id": 12,
        "movie_id": 1,
        "hall_id": 2,
        "start_time": "2026-03-21T16:00:00+05:00",
        "start_date": "2026-03-21",
        "price": 50000,
        "hall": { "id": 2, "name": "VIP Zal" }
      }
    ]
  }
}
```

---

### Showtimes

#### GET /showtimes

List all upcoming showtimes with filters.

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `movie_id` | integer | Filter by movie |
| `date` | string (Y-m-d) | Filter by date |
| `hall_id` | integer | Filter by hall |

**Request:**

```
GET /api/miniapp/showtimes?movie_id=1&date=2026-03-20
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": 10,
      "movie_id": 1,
      "hall_id": 1,
      "start_time": "2026-03-20T14:00:00+05:00",
      "start_date": "2026-03-20",
      "price": 50000,
      "hall": { "id": 1, "name": "Zal 1" },
      "movie": {
        "id": 1,
        "name": "Avatar 3",
        "description": "The next chapter of the Avatar saga.",
        "poster_url": "/storage/posters/avatar3.jpg",
        "duration": 150,
        "is_active": true,
        "upcoming_showtimes_count": 0
      }
    }
  ]
}
```

---

#### GET /showtimes/{id}

Single showtime with movie and hall.

**Request:**

```
GET /api/miniapp/showtimes/10
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": {
    "id": 10,
    "movie_id": 1,
    "hall_id": 1,
    "start_time": "2026-03-20T14:00:00+05:00",
    "start_date": "2026-03-20",
    "price": 50000,
    "hall": { "id": 1, "name": "Zal 1" },
    "movie": {
      "id": 1,
      "name": "Avatar 3",
      "description": "The next chapter of the Avatar saga.",
      "poster_url": "/storage/posters/avatar3.jpg",
      "duration": 150,
      "is_active": true,
      "upcoming_showtimes_count": 0
    }
  }
}
```

---

#### GET /showtimes/{id}/seats

Seat map for a showtime. Returns all active seats grouped by row, with booking status.

**Request:**

```
GET /api/miniapp/showtimes/10/seats
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": {
    "rows": [
      {
        "row_number": 1,
        "seats": [
          { "id": 1, "row": 1, "number": 1, "is_active": true, "is_booked": false },
          { "id": 2, "row": 1, "number": 2, "is_active": true, "is_booked": true },
          { "id": 3, "row": 1, "number": 3, "is_active": true, "is_booked": false },
          { "id": 4, "row": 1, "number": 4, "is_active": true, "is_booked": false },
          { "id": 5, "row": 1, "number": 5, "is_active": true, "is_booked": true }
        ]
      },
      {
        "row_number": 2,
        "seats": [
          { "id": 6, "row": 2, "number": 1, "is_active": true, "is_booked": false },
          { "id": 7, "row": 2, "number": 2, "is_active": true, "is_booked": false },
          { "id": 8, "row": 2, "number": 3, "is_active": true, "is_booked": false },
          { "id": 9, "row": 2, "number": 4, "is_active": true, "is_booked": true },
          { "id": 10, "row": 2, "number": 5, "is_active": true, "is_booked": false }
        ]
      }
    ]
  }
}
```

**Frontend rendering tip:**

```tsx
// Render seat grid
seatMap.rows.map(row => (
  <div key={row.row_number} className="flex gap-1">
    <span className="w-8">R{row.row_number}</span>
    {row.seats.map(seat => (
      <button
        key={seat.id}
        disabled={seat.is_booked}
        onClick={() => toggleSeat(seat.id)}
        className={cn(
          'w-8 h-8 rounded',
          seat.is_booked && 'bg-red-400 cursor-not-allowed',
          selected.includes(seat.id) && 'bg-green-400',
          !seat.is_booked && !selected.includes(seat.id) && 'bg-gray-200',
        )}
      >
        {seat.number}
      </button>
    ))}
  </div>
))
```

---

#### GET /showtimes/calendar

List of dates that have showtimes, with count. Useful for date picker highlighting.

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `movie_id` | integer | Filter by movie |

**Request:**

```
GET /api/miniapp/showtimes/calendar?movie_id=1
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": [
    { "date": "2026-03-20", "count": 3 },
    { "date": "2026-03-21", "count": 2 },
    { "date": "2026-03-22", "count": 1 }
  ]
}
```

---

### Bookings

#### GET /bookings

User's bookings list. Only shows the authenticated user's bookings.

**Query parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `status` | string | Filter: `pending`, `confirmed`, `cancelled` |

**Request:**

```
GET /api/miniapp/bookings?status=confirmed
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": 42,
      "status": "confirmed",
      "status_label": "Tasdiqlangan",
      "ticket_code": "TKT-A1B2C3D4",
      "showtime": {
        "id": 10,
        "movie_id": 1,
        "hall_id": 1,
        "start_time": "2026-03-20T19:00:00+05:00",
        "start_date": "2026-03-20",
        "price": 50000,
        "hall": { "id": 1, "name": "Zal 1" },
        "movie": {
          "id": 1,
          "name": "Avatar 3",
          "description": "The next chapter of the Avatar saga.",
          "poster_url": "/storage/posters/avatar3.jpg",
          "duration": 150,
          "is_active": true,
          "upcoming_showtimes_count": 0
        }
      },
      "seats": [
        { "id": 1, "row": 1, "number": 1, "is_active": true, "is_booked": false },
        { "id": 3, "row": 1, "number": 3, "is_active": true, "is_booked": false }
      ],
      "total_price": 100000,
      "can_cancel": false,
      "created_at": "2026-03-18T10:30:00+05:00"
    }
  ]
}
```

---

#### POST /bookings

Create a new booking. Seats are locked in a database transaction to prevent double-booking.

**Request body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `showtime_id` | integer | yes | Showtime to book |
| `seat_ids` | integer[] | yes | Array of seat IDs to book (min: 1) |

**Request:**

```
POST /api/miniapp/bookings
Authorization: tma <initData>
Content-Type: application/json

{
  "showtime_id": 10,
  "seat_ids": [1, 3, 4]
}
```

**Response: `201 Created`**

```json
{
  "data": {
    "id": 43,
    "status": "pending",
    "status_label": "Kutilmoqda",
    "ticket_code": null,
    "showtime": {
      "id": 10,
      "movie_id": 1,
      "hall_id": 1,
      "start_time": "2026-03-20T19:00:00+05:00",
      "start_date": "2026-03-20",
      "price": 50000,
      "hall": { "id": 1, "name": "Zal 1" },
      "movie": {
        "id": 1,
        "name": "Avatar 3",
        "description": null,
        "poster_url": "/storage/posters/avatar3.jpg",
        "duration": 150,
        "is_active": true,
        "upcoming_showtimes_count": 0
      }
    },
    "seats": [
      { "id": 1, "row": 1, "number": 1, "is_active": true, "is_booked": false },
      { "id": 3, "row": 1, "number": 3, "is_active": true, "is_booked": false },
      { "id": 4, "row": 1, "number": 4, "is_active": true, "is_booked": false }
    ],
    "total_price": 150000,
    "can_cancel": true,
    "created_at": "2026-03-18T12:00:00+05:00"
  }
}
```

**Error responses:**

| Status | Message | When |
|--------|---------|------|
| `422` | `This showtime has already passed.` | Showtime `start_time` is in the past |
| `422` | `Some seats are already booked.` | One or more seats are taken by another booking |
| `422` | Validation errors | Missing/invalid fields |

```json
{
  "message": "Some seats are already booked."
}
```

---

#### GET /bookings/{id}

Single booking detail. Returns `403` if the booking belongs to another user.

**Request:**

```
GET /api/miniapp/bookings/43
Authorization: tma <initData>
```

**Response: `200 OK`**

Same shape as a single item in the bookings list response.

**Error: `403 Forbidden`**

```json
{
  "message": "Forbidden."
}
```

---

#### POST /bookings/{id}/cancel

Cancel a booking. Only `pending` bookings can be cancelled.

**Request:**

```
POST /api/miniapp/bookings/43/cancel
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": {
    "id": 43,
    "status": "cancelled",
    "status_label": "Bekor qilingan",
    "ticket_code": null,
    "showtime": { "..." : "..." },
    "seats": [ "..." ],
    "total_price": 150000,
    "can_cancel": false,
    "created_at": "2026-03-18T12:00:00+05:00"
  }
}
```

**Error responses:**

| Status | Message | When |
|--------|---------|------|
| `403` | `Forbidden.` | Booking belongs to another user |
| `422` | `Only pending bookings can be cancelled.` | Booking is confirmed or already cancelled |

---

#### GET /bookings/{id}/ticket

Get ticket info for a confirmed booking. Generates the PDF on the server side.

**Request:**

```
GET /api/miniapp/bookings/42/ticket
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "ticket_code": "TKT-A1B2C3D4",
  "download_url": "https://yourdomain.com/api/miniapp/bookings/42/ticket/download"
}
```

**Error responses:**

| Status | Message | When |
|--------|---------|------|
| `403` | `Forbidden.` | Booking belongs to another user |
| `422` | `Ticket is only available for confirmed bookings.` | Booking is not confirmed |

---

#### GET /bookings/stats

Booking statistics for the authenticated user.

**Request:**

```
GET /api/miniapp/bookings/stats
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": {
    "total": 12,
    "confirmed": 8,
    "pending": 2,
    "cancelled": 2
  }
}
```

---

### Movie Requests

Users can request movies they want to see in the cinema. Admin gets a Telegram notification.

#### GET /movie-requests

User's movie requests list.

**Request:**

```
GET /api/miniapp/movie-requests
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": [
    {
      "id": 5,
      "movie_name": "Inception 2",
      "movie_year": 2026,
      "trailer_url": "https://youtube.com/watch?v=abc123",
      "preferred_date": "2026-04-01",
      "preferred_time": "19:00",
      "guests_count": 10,
      "status": "pending",
      "status_label": "Kutilmoqda",
      "admin_note": null,
      "created_at": "2026-03-18T10:00:00+05:00"
    }
  ]
}
```

---

#### POST /movie-requests

Submit a new movie request.

**Request body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `movie_name` | string | yes | max 255 chars |
| `movie_year` | integer | no | 1900 - 2030 |
| `trailer_url` | string | no | valid URL, max 500 chars |
| `preferred_date` | string | no | valid date (Y-m-d) |
| `preferred_time` | string | no | format `HH:mm` |
| `guests_count` | integer | yes | 1 - 50 |

**Request:**

```
POST /api/miniapp/movie-requests
Authorization: tma <initData>
Content-Type: application/json

{
  "movie_name": "Inception 2",
  "movie_year": 2026,
  "trailer_url": "https://youtube.com/watch?v=abc123",
  "preferred_date": "2026-04-01",
  "preferred_time": "19:00",
  "guests_count": 10
}
```

**Response: `201 Created`**

```json
{
  "data": {
    "id": 6,
    "movie_name": "Inception 2",
    "movie_year": 2026,
    "trailer_url": "https://youtube.com/watch?v=abc123",
    "preferred_date": "2026-04-01",
    "preferred_time": "19:00",
    "guests_count": 10,
    "status": "pending",
    "status_label": "Kutilmoqda",
    "admin_note": null,
    "created_at": "2026-03-18T14:00:00+05:00"
  }
}
```

**Minimal request (only required fields):**

```json
{
  "movie_name": "Interstellar",
  "guests_count": 5
}
```

---

#### GET /movie-requests/{id}

Single movie request. Returns `403` if it belongs to another user.

**Request:**

```
GET /api/miniapp/movie-requests/5
Authorization: tma <initData>
```

**Response: `200 OK`**

Same shape as a single item in the movie requests list.

---

### Profile

#### GET /profile

Authenticated user's profile.

**Request:**

```
GET /api/miniapp/profile
Authorization: tma <initData>
```

**Response: `200 OK`**

```json
{
  "data": {
    "id": 1,
    "telegram_id": "123456789",
    "first_name": "Ali",
    "last_name": "Valiyev",
    "username": "alivaliyev",
    "phone": "+998901234567",
    "language": "uz",
    "bookings_count": 12
  }
}
```

---

#### PATCH /profile/language

Change the user's language. This affects all localized API responses.

**Request body:**

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `language` | string | yes | `uz`, `ru`, or `kk` |

**Request:**

```
PATCH /api/miniapp/profile/language
Authorization: tma <initData>
Content-Type: application/json

{
  "language": "ru"
}
```

**Response: `200 OK`**

```json
{
  "data": {
    "id": 1,
    "telegram_id": "123456789",
    "first_name": "Ali",
    "last_name": "Valiyev",
    "username": "alivaliyev",
    "phone": "+998901234567",
    "language": "ru"
  }
}
```

---

## Status Codes Summary

| Code | Meaning |
|------|---------|
| `200` | Success |
| `201` | Created (booking, movie request) |
| `401` | Invalid or missing auth |
| `403` | Not registered / accessing another user's resource |
| `404` | Resource not found |
| `422` | Validation error or business rule violation |
| `429` | Rate limited |

---

## Route Map

```
GET    /api/miniapp/movies/featured            Featured movies (today)
GET    /api/miniapp/movies                     All active movies
GET    /api/miniapp/movies/{id}                Movie detail + showtimes by date

GET    /api/miniapp/showtimes/calendar         Dates with showtimes
GET    /api/miniapp/showtimes                  All upcoming showtimes
GET    /api/miniapp/showtimes/{id}             Showtime detail
GET    /api/miniapp/showtimes/{id}/seats       Seat map

GET    /api/miniapp/bookings/stats             Booking statistics
GET    /api/miniapp/bookings                   User's bookings
POST   /api/miniapp/bookings                   Create booking
GET    /api/miniapp/bookings/{id}              Booking detail
POST   /api/miniapp/bookings/{id}/cancel       Cancel booking
GET    /api/miniapp/bookings/{id}/ticket        Get ticket info

GET    /api/miniapp/movie-requests             User's movie requests
POST   /api/miniapp/movie-requests             Create movie request
GET    /api/miniapp/movie-requests/{id}        Movie request detail

GET    /api/miniapp/profile                    User profile
PATCH  /api/miniapp/profile/language           Update language
```

---

## Typical User Flows

### 1. Home screen

```
parallel:
  GET /movies/featured    -> hero carousel
  GET /movies             -> movies grid
  GET /bookings/stats     -> stats badge on "My Bookings" tab
```

### 2. Movie detail -> select showtime

```
GET /movies/{id}                    -> movie info + showtimes_by_date
GET /showtimes/{showtimeId}/seats   -> seat map for selected showtime
```

### 3. Book seats

```
POST /bookings  { showtime_id, seat_ids }   -> new booking (status: pending)
```

### 4. My bookings

```
GET /bookings                -> all bookings
GET /bookings?status=pending -> filtered
```

### 5. Cancel booking

```
POST /bookings/{id}/cancel   -> booking with status: cancelled
```

### 6. View ticket

```
GET /bookings/{id}/ticket    -> { ticket_code, download_url }
```

### 7. Request a movie

```
POST /movie-requests  { movie_name, guests_count, ... }
GET  /movie-requests  -> list with status updates from admin
```

### 8. Showtime calendar

```
GET /showtimes/calendar?movie_id=1   -> dates with showtimes
GET /showtimes?movie_id=1&date=2026-03-20  -> showtimes for that date
```
