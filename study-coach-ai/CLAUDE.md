# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Study Coach AI** — a full-stack personalized learning assistant. Students create subjects and topics, then generate AI-powered study plans and quizzes. Backend: Node.js + Express 5 + MongoDB Atlas. Frontend: React 18 + Vite.

## Commands

### Backend (run from `backend/`)
```bash
npm run dev     # Start with nodemon (auto-restarts on .js, .json, .env changes)
npm start       # Production start with node
```

### Frontend (run from `frontend/`)
```bash
npm run dev     # Vite dev server on http://localhost:3000
npm run build   # Production build
npm run preview # Preview production build
npm run lint    # ESLint
```

Both servers must run simultaneously during development: backend on port 5000, frontend on port 3000.

## Architecture

### Backend (`backend/`)

```
server.js               ← Entry point: loads dotenv FIRST, then connectDB(), then routes
config/db.js            ← mongoose.connect() — calls process.exit(1) on failure
middleware/authMiddleware.js  ← JWT protect() middleware, attaches req.user
models/                 ← Mongoose schemas: User, Subject, Topic, StudyPlan, Quiz, QuizResult
routes/                 ← Express routers mounted under /api/*
controllers/            ← Business logic called by routes
services/aiService.js   ← Template-based study plan and quiz generator (no external AI API)
```

All routes are mounted on `/api` prefix: `/api/auth`, `/api/subjects`, `/api/topics`, `/api/study-plans`, `/api/quizzes`, `/api/dashboard`.

All routes except `/api/auth/register` and `/api/auth/login` are protected — they require a valid JWT `Authorization: Bearer <token>` header. The `protect` middleware loads the full user from DB and attaches it to `req.user`.

**Critical route ordering in `quizRoutes.js`:** `/results` must be registered before `/:id` or Express will treat the literal string "results" as an ID parameter.

**dotenv loading order matters:** `dotenv.config()` must be called before `connectDB()` and before any `process.env` access. This is already correct in `server.js` — do not reorder.

### Data relationships

Users own all data (every model has `userId`). Topics belong to Subjects (`subjectId`). StudyPlans and Quizzes optionally reference both a Topic and a Subject. QuizResults reference a Quiz.

### Frontend (`frontend/src/`)

```
api/axios.js        ← Axios instance (baseURL: http://localhost:5000/api) with JWT interceptor
context/AuthContext.jsx  ← Global auth state; login/register/logout; persists to localStorage
App.jsx             ← React Router setup; all non-auth pages wrapped in ProtectedRoute + Layout
pages/              ← Dashboard, Subjects, Topics, StudyPlans, Quizzes, QuizResults, Login, Register
components/         ← Navbar, ProtectedRoute, Loading, StatCard
```

Auth flow: `AuthContext` stores `token` and `user` in `localStorage`. `ProtectedRoute` checks `useAuth().user` — if null, redirects to `/login`. The Axios request interceptor automatically attaches the token to every API call.

## Environment Variables

Backend requires `backend/.env` with exactly these three variables:
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/studyCoachAI?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=<any secret string>
```

`nodemon.json` is configured to watch `.env` so the server restarts automatically when this file changes.

## Key Gotchas

- **bcryptjs v3** ships as ESM with a UMD CJS build — API is unchanged, `require('bcryptjs')` works fine.
- **dotenv v17** prints rotating tips to stdout on startup — this is cosmetic, not an error.
- **MongoDB Atlas:** the IP address of the development machine must be whitelisted in Atlas → Network Access. The database name in the URI must be `studyCoachAI` (not empty) so data lands in the correct database.
- **`aiService.js`** generates study plans and quizzes from templates — there is no OpenAI or external AI dependency. The architecture is designed so an OpenAI call can replace the template logic in the future.
