# Aroha — Travel & Tourism Experience Platform

A full MERN-stack travel platform: destination exploration, auth, favorites,
trip/itinerary planning, travel services, and bookings — with a WebGL hero
(scroll-driven mountain scene) that gracefully falls back to a static
gradient on low-end devices or when `prefers-reduced-motion` is set.

## Structure

```
backend/    Node.js + Express + Mongoose REST API
frontend/   React + Vite + Tailwind + Three.js (react-three-fiber)
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB instance — either:
  - Local: install MongoDB Community Edition and run `mongod`, or
  - Free hosted: create a cluster at MongoDB Atlas and copy the connection string

## 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

```
MONGO_URI=mongodb://127.0.0.1:27017/travel_platform
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
CLIENT_URL=http://localhost:5173
```

Seed the database with sample destinations and services:

```bash
npm run seed
```

Start the API:

```bash
npm run dev
```

The API runs at `http://localhost:5000/api`. Check it's alive at
`http://localhost:5000/api/health`.

## 3. Frontend setup

In a second terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env` if your backend runs somewhere other than the default:

```
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:

```bash
npm run dev
```

Open `http://localhost:5173`.

## 4. Trying it out

1. Register a new account (`/register`)
2. Browse `/destinations`, search and filter by category
3. Open a destination, add it to favorites, then "Plan a Trip Here"
4. Build a day-by-day itinerary on the trip's detail page
5. Browse `/services`, book one, walk through the summary → confirmation flow
6. Check `/dashboard` for your personalized stats and `/bookings` for history

## 5. WebGL hero tiering

`frontend/src/hooks/useDeviceTier.js` detects GPU tier, device memory, and
`prefers-reduced-motion`, and routes the homepage hero
(`frontend/src/components/Hero.jsx`) between:

- **full** — full Three.js scene (`three/HeroScene.jsx`), scroll-bound camera
- **lite** — same scene, fewer stars, lower DPR, no antialiasing
- **static** — CSS/SVG gradient fallback (`three/HeroStatic.jsx`), zero WebGL shipped

## 6. Production notes

- Never commit real `.env` values — `.env.example` files are provided as templates
- `JWT_SECRET` should be a long random string in production
- Booking prices are always recalculated server-side (`service.price × numberOfPeople`) —
  the frontend's displayed total is never trusted as the source of truth
- Add an admin role/guard before exposing the destination/service `POST`,
  `PUT`, and `DELETE` routes publicly — they're currently open for demo/seeding convenience
