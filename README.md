# Chess Match Analytics API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-20%2B-green?style=for-the-badge&logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-5.x-blue?style=for-the-badge&logo=express" alt="Express">
  <img src="https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb" alt="MongoDB">
  <img src="https://img.shields.io/badge/JWT-Auth-yellow?style=for-the-badge&logo=json-web-tokens" alt="JWT">
</p>

A comprehensive RESTful backend API for storing, analyzing, and serving chess match data. Built with Node.js, Express.js, and MongoDB, featuring JWT authentication, advanced analytics, and complete CRUD operations.

---

## 🔗 Live Links

| Service | URL |
|---------|-----|
| **Backend (Live)** | [https://chess-game-dataset-rishab-ravikumar.onrender.com](https://chess-game-dataset-rishab-ravikumar.onrender.com) |
| **API Documentation (Postman)** | [https://documenter.getpostman.com/view/50839472/2sBXqRkcxQ](https://documenter.getpostman.com/view/50839472/2sBXqRkcxQ) |
| **GitHub Repository** | [https://github.com/rishab11250/chess_game_dataset_rishab_ravikumar](https://github.com/rishab11250/chess_game_dataset_rishab_ravikumar) |

---

## ✨ Features

- **Full CRUD Operations** — Create, Read, Update, Delete matches with soft-delete
- **Match Management** — Archive/restore matches, bulk operations
- **Player Analytics** — Win rates, rating history, opening preferences
- **Opening Theory** — Categorized openings with win-rate analytics
- **Advanced Search** — Multi-filter, fuzzy matching, autocomplete
- **Aggregation Analytics** — Victory distribution, color advantage, time control usage
- **JWT Authentication** — Register, login, logout, refresh tokens
- **Admin Panel** — User management, system health monitoring
- **Protected Routes** — Authenticated access to specific operations

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| Runtime | Node.js (v20+) |
| Framework | Express.js 5.x |
| Database | MongoDB (Mongoose ODM) |
| Authentication | JWT (jsonwebtoken + bcryptjs) |
| Validation | express-validator |
| Logging | morgan |
| Rate Limiting | express-rate-limit |

---

## 📁 Project Structure

```
server/
├── src/
│   ├── config/           # Database & environment configuration
│   ├── controllers/      # Request handlers (MVC)
│   ├── middlewares/      # Auth, error, logger, rate-limit, validate
│   ├── models/           # Mongoose schemas (Match, Player, Opening, User)
│   ├── routes/           # API route definitions
│   ├── services/        # Business logic layer
│   ├── utils/          # Helpers (apiResponse, pagination, etc.)
│   ├── app.js          # Express application setup
│   └── server.js       # Entry point
├── .env.example
├── package.json
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20 or higher)
- MongoDB (local or Atlas)
- pnpm (or npm/yarn)

### Installation

```bash
# Clone the repository
git clone https://github.com/rishab11250/chess_game_dataset_rishab_ravikumar.git
cd chess_game_dataset_rishab_ravikumar

# Navigate to server directory
cd server

# Install dependencies
pnpm install
```

### Environment Setup

Create a `.env` file in the `server/` directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication (generate using: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_32_character_hex_string
JWT_REFRESH_SECRET=your_32_character_hex_string
```

### Run the Server

```bash
# Development mode (auto-restart on changes)
pnpm run dev

# Production mode
pnpm start
```

The API will be available at: `http://localhost:5000`

---

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port (default: 5000) | Yes |
| `NODE_ENV` | Environment: `development` or `production` | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for access tokens (32+ chars) | Yes |
| `JWT_REFRESH_SECRET` | Secret key for refresh tokens (32+ chars) | Yes |

---

## 📊 API Overview

**Base URL:** `https://chess-game-dataset-rishab-ravikumar.onrender.com/api/v1`

### Available Modules

| Module | Endpoints |
|--------|-----------|
| Auth | 10 |
| Matches | 20 |
| Filters | 15 |
| Players | 15 |
| Openings | 15 |
| Search | 15 |
| Analytics | 15 |
| Stats | 15 |
| Bulk Operations | 5 |
| Admin | 13 |
| Middleware | 4 |
| Protected | 8 |
| System | 15 |
| Health | 1 |

**Total: 166+ endpoints**

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication.

### Authentication Flow

1. **Register:** `POST /api/v1/auth/register`
2. **Login:** `POST /api/v1/auth/login` → Returns `accessToken` and `refreshToken`
3. **Use Token:** Include `Authorization: Bearer <accessToken>` in request headers
4. **Refresh:** `POST /api/v1/auth/refresh-token` when access token expires

### Token Expiry
- **Access Token:** 15 minutes
- **Refresh Token:** 7 days

---

## 🧪 Testing with Postman

### Option 1: Import Collection

1. Download the Postman Collection JSON (in project root folder)
2. Open Postman → Import → Select the JSON file
3. Set the `baseUrl` variable to the deployed URL or `http://localhost:5000/api/v1`
4. Register a user → Copy `accessToken` to the variable
5. Start testing!

### Option 2: Online Documentation

Visit the [Postman Documentation](https://documenter.getpostman.com/view/50839472/2sBXqRkcxQ) for interactive testing with the live backend.

---

## 📝 API Endpoints Summary

### Authentication
```
POST   /auth/register        → Register new user
POST   /auth/login           → Login user
POST   /auth/logout          → Logout
GET    /auth/profile         → Get profile
PATCH  /auth/profile         → Update profile
DELETE /auth/profile         → Delete profile
POST   /auth/forgot-password → Request password reset
POST   /auth/reset-password  → Reset password
POST   /auth/verify-email   → Verify email
POST   /auth/refresh-token  → Refresh JWT token
```

### Matches
```
GET    /matches               → List matches (paginated)
GET    /matches/:id           → Get match by ID
POST   /matches               → Create match
PUT    /matches/:id           → Replace match
PATCH  /matches/:id          → Update match
DELETE /matches/:id          → Delete match
GET    /matches/latest       → Latest matches
GET    /matches/trending     → Trending matches
GET    /matches/random       → Random match
GET    /matches/:id/moves    → Get moves
GET    /matches/:id/pgn      → Get PGN
GET    /matches/:id/fen      → Get FEN
GET    /matches/:id/analysis → Get analysis
PATCH  /matches/:id/archive  → Archive match
PATCH  /matches/:id/restore  → Restore match
GET    /matches/sort/shortest → Shortest matches
GET    /matches/sort/longest  → Longest matches
GET    /matches/sort/highest-rated → Highest rated matches
GET    /matches/scroll        → Cursor-based pagination
GET    /matches/infinite      → Infinite scroll pagination
```

### Players
```
GET  /players                → List players
GET  /players/:username      → Player details
GET  /players/:username/history → Player match history
GET  /players/:username/stats → Player statistics
GET  /players/:username/openings → Opening preferences
GET  /players/:username/rating-history → ELO history
GET  /players/:username/win-rate → Win percentage
GET  /players/:username/loss-rate → Loss percentage
GET  /players/:username/draw-rate → Draw percentage
GET  /players/:username/recent → Recent matches
GET  /players/top-rated → Top rated players
GET  /players/top-active → Most active players
GET  /players/top-winning → Highest winning players
GET  /players/compare/:p1/:p2 → Compare two players
GET  /players/rating-range?min=1200&max=2000 → Filter by rating
```

### Filters
```
GET /matches/filter/rated
GET /matches/filter/unrated
GET /matches/filter/white-wins
GET /matches/filter/black-wins
GET /matches/filter/draws
GET /matches/filter/checkmates
GET /matches/filter/resignations
GET /matches/filter/timeouts
GET /matches/filter/rapid
GET /matches/filter/blitz
GET /matches/filter/bullet
GET /matches/filter/classical
GET /matches/filter/high-rated
GET /matches/filter/low-rated
GET /matches/filter/long-games
```

### Openings
```
GET /openings
GET /openings/popular
GET /openings/trending
GET /openings/eco/:ecoCode
GET /openings/search?q=sicilian
GET /openings/win-rates
GET /openings/aggressive
GET /openings/defensive
GET /openings/gambits
GET /openings/checkmates
GET /openings/rare
GET /openings/white-advantage
GET /openings/black-advantage
GET /openings/beginner-friendly
GET /openings/complexity
```

### Search
```
GET /search/matches?q=mate
GET /search/players?q=magnus
GET /search/openings?q=sicilian
GET /search/eco?q=B20
GET /search/moves?q=e4,e5
GET /search/fuzzy?q=carokann
GET /search/autocomplete?q=queen
GET /search/recent
GET /search/popular
GET /search/advanced
GET /search/player-rating?rating=2500
GET /search/date-range?from=2025-01-01&to=2025-02-01
GET /search/opening-family?q=indian
GET /search/checkmate-patterns?q=smothered
GET /search/endgames?q=rook
```

### Analytics
```
GET /analytics/victory-distribution
GET /analytics/color-advantage
GET /analytics/turn-count-average
GET /analytics/rated-vs-casual
GET /analytics/time-control-usage
GET /analytics/shortest-games
GET /analytics/longest-games
GET /analytics/rating-gap-upsets
GET /analytics/checkmate-frequency
GET /analytics/draw-frequency
GET /analytics/resignation-frequency
GET /analytics/timeouts
GET /analytics/opening-success
GET /analytics/player-growth
GET /analytics/hourly-activity
```

### Stats
```
GET /stats/total-matches
GET /stats/total-players
GET /stats/average-rating
GET /stats/top-openings
GET /stats/checkmate-rate
GET /stats/resignation-rate
GET /stats/timeout-rate
GET /stats/white-win-rate
GET /stats/black-win-rate
GET /stats/draw-rate
GET /stats/rated-games
GET /stats/unrated-games
GET /stats/daily-games
GET /stats/monthly-games
GET /stats/yearly-games
```

### Bulk Operations
```
POST /matches/bulk-upload
PATCH /matches/bulk-update
POST /matches/bulk-delete
PATCH /matches/bulk/archive
PATCH /matches/bulk/restore
```

### Admin
```
GET    /admin/dashboard
GET    /admin/users
GET    /admin/users/:id
PATCH  /admin/users/:id/role
PATCH  /admin/users/:id/ban
PATCH  /admin/users/:id/unban
GET    /admin/system/health
GET    /admin/logs
DELETE /admin/cache/clear
GET    /admin/matches/deleted
DELETE /admin/matches/:id
PUT    /admin/matches/:id/restore
GET    /admin/protected/dashboard
```

### Protected
```
GET    /protected/matches
POST   /protected/matches
PATCH  /protected/matches/:id
DELETE /protected/matches/:id
GET    /protected/matches/saved
POST   /protected/matches/:id/save
DELETE /protected/matches/:id/save
GET    /protected/profile/stats
```

### System
```
GET /system/info
GET /system/health
GET /system/config
GET /system/logs
GET /system/version
GET /system/status
GET /system/uptime
GET /system/database/status
GET /system/cache/status
POST /system/recalculate-stats
POST /system/reindex
POST /system/restart
GET  /system/security/events
GET  /system/performance
GET  /system/storage
```

### Middleware
```
GET /middleware/logger
GET /middleware/auth
GET /middleware/rate-limit
GET /middleware/error-handler
```

---

## 📄 License

MIT License.

---

## 👤 Contact

- **GitHub:** [rishab11250](https://github.com/rishab11250)
- **Deployed Backend:** [https://chess-game-dataset-rishab-ravikumar.onrender.com](https://chess-game-dataset-rishab-ravikumar.onrender.com)
- **API Docs:** [https://documenter.getpostman.com/view/50839472/2sBXqRkcxQ](https://documenter.getpostman.com/view/50839472/2sBXqRkcxQ)

---

<p align="center">Built with ❤️ using Node.js, Express, and MongoDB</p>