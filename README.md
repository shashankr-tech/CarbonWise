# CarbonWise

CarbonWise is a carbon-footprint tracker (React frontend + Node/Express backend + MongoDB).
**MongoDB is the source of truth for all permanent data**: users and profiles, vehicles,
carbon entries and RTO submissions. The browser keeps only the login token.

## Requirements

- Node.js 18+
- MongoDB running locally (`mongodb://127.0.0.1:27017`) or a MongoDB Atlas connection string

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # on Windows: copy .env.example .env
```

Edit `backend/.env` and set `JWT_SECRET` to a long random string (and `MONGO_URI` if not using local MongoDB).

```bash
npm run dev              # starts the API on http://localhost:5000
```

### 2. Frontend (new terminal, project root)

```bash
npm install
npm start                # opens http://localhost:3000
```

To point the frontend at a different API, set `REACT_APP_API_URL` (default `http://localhost:5000`).

### 3. Production build and tests

```bash
npm run build
npm test -- --watchAll=false
```

## API overview

All routes except register/login need the header `Authorization: Bearer <token>`.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register`, `/api/auth/login` | Create account / log in |
| GET, PUT | `/api/auth/me` | View / update own profile |
| GET, POST | `/api/vehicles` | List / add own vehicles |
| PUT, DELETE | `/api/vehicles/:id` | Edit / delete own vehicle |
| GET, POST | `/api/entries` | List / add own carbon entries |
| DELETE | `/api/entries/:id` | Delete own carbon entry |
| POST | `/api/rto` | Submit vehicle details to RTO |
| GET | `/api/rto/my` | View own RTO submissions |
| GET | `/api/rto` | Officer only: all submissions |
| PATCH | `/api/rto/:id/status` | Officer only: update status |

Every vehicle, entry and RTO report is linked to the logged-in user, and the server only
returns or changes records belonging to that user (officers can see all RTO submissions).
Each new user starts with three default vehicles, added once on first visit. A vehicle's
`kgPerKm` is calculated on the server and used for carbon calculations.

## What is stored where

| Data | Location |
| --- | --- |
| Users, profile (name, email, city, age, country) | MongoDB `users` |
| Vehicles | MongoDB `vehicles` |
| Carbon entries | MongoDB `entries` |
| RTO submissions and status | MongoDB `rtoreports` |
| JWT login token (`carbonWiseToken`) | Browser `localStorage`; removed on logout or expiry |
| Entry waiting on the result page (`carbonWisePendingEntry`) | Browser `sessionStorage` (temporary) |

The old `carbonWiseEntries`, `carbonWiseVehicles` and `carbonWiseProfile` localStorage keys
are no longer used and are deleted at login/logout.

## Known limitations

- The JWT is kept in `localStorage`, which scripts on the page can read. An httpOnly cookie
  would be a safer future improvement.
- Officers are created by setting `role: "officer"` on a user directly in MongoDB.
