# Deployment Guide — Study Coach AI

## Overview

| Layer | Recommended Platform |
|---|---|
| Frontend (React + Vite) | Vercel |
| Backend (Node.js + Express) | Render (free tier) |
| Database | MongoDB Atlas (free tier) |

---

## Step 1 — MongoDB Atlas Setup

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign in
2. Create a free cluster (M0 tier)
3. Create a database user under **Database Access** → Add New Database User
4. Under **Network Access** → Add IP Address → Add `0.0.0.0/0` (allow all IPs for deployment)
5. Click **Connect** on your cluster → **Connect your application** → copy the connection string
6. Replace `<username>`, `<password>`, and the database name with `studyCoachAI`:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/studyCoachAI?retryWrites=true&w=majority
   ```

---

## Step 2 — Deploy Backend to Render

### 2a. Prepare your code
Make sure `backend/package.json` has:
```json
"scripts": {
  "start": "node server.js",
  "dev": "nodemon server.js"
}
```

### 2b. Deploy on Render
1. Go to [render.com](https://render.com) and sign in with GitHub
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Root Directory**: `backend` (if monorepo) or leave blank if backend is root
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

### 2c. Set Backend Environment Variables on Render
Go to your service → **Environment** → add these:

| Variable | Value |
|---|---|
| `PORT` | `10000` (Render sets this automatically — leave it or omit) |
| `MONGO_URI` | Your full MongoDB Atlas connection string |
| `JWT_SECRET` | A long random string (e.g. 64 random characters) |
| `FRONTEND_URL` | Your Vercel frontend URL (e.g. `https://study-coach-ai.vercel.app`) |
| `NODE_ENV` | `production` |

> **JWT_SECRET**: Generate one with: `node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"`

### 2d. Note your backend URL
After deployment your backend will have a URL like:
```
https://study-coach-ai-backend.onrender.com
```

---

## Step 3 — Deploy Frontend to Vercel

### 3a. Set the API URL
In `frontend/.env.production`, set:
```
VITE_API_URL=https://study-coach-ai-backend.onrender.com/api
```
*(Replace with your actual Render URL)*

Or set it as an environment variable directly in Vercel (see 3c).

### 3b. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend` (if monorepo)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### 3c. Set Frontend Environment Variables on Vercel
Go to your project → **Settings** → **Environment Variables** → add:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://study-coach-ai-backend.onrender.com/api` |

### 3d. Note your frontend URL
After deployment your frontend will have a URL like:
```
https://study-coach-ai.vercel.app
```

---

## Step 4 — Connect Frontend ↔ Backend

1. Copy your Vercel frontend URL (e.g. `https://study-coach-ai.vercel.app`)
2. Go to Render → your backend service → **Environment**
3. Set `FRONTEND_URL` = `https://study-coach-ai.vercel.app`
4. Redeploy the backend (Render will auto-redeploy on env change)

---

## Step 5 — Verify Deployment

### Backend health check
Open in browser or curl:
```
https://study-coach-ai-backend.onrender.com/
```
Should return: `{"status":"ok","message":"Study Coach AI Backend is running"}`

### Full test checklist

| Test | Expected |
|---|---|
| Open frontend URL | Landing page loads |
| Register a new account | Redirects to dashboard |
| Login | Dashboard shows |
| Create a Subject | Appears in list |
| Create a Topic | Appears in list |
| Open Topic Detail | Topic page loads with upload option |
| Upload a lecture PDF | Summary, concepts, and objectives appear |
| Generate Quiz | Quiz questions appear (from PDF content) |
| Submit Quiz | Score shown with source quotes |
| Generate Study Plan | Plan appears |
| Browse Resources | Resource cards show |
| Click Start Learning | Resource detail page opens |
| Self-Check Quiz | Questions appear, score shown |
| Add to Study Plan | Success message shown |
| Logout | Redirected to login page |

---

## Local Development

### Run backend
```bash
cd backend
npm install
# Make sure backend/.env exists with MONGO_URI, JWT_SECRET, PORT
npm run dev
```

### Run frontend
```bash
cd frontend
npm install
# Make sure frontend/.env.local has VITE_API_URL=http://localhost:5000/api
npm run dev
```

Frontend runs on http://localhost:3000
Backend runs on http://localhost:5000

### Build frontend (test production build locally)
```bash
cd frontend
npm run build
npm run preview
```

---

## Environment Variables Reference

### Backend (`backend/.env`)
```
PORT=5000
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/studyCoachAI?retryWrites=true&w=majority
JWT_SECRET=your_very_long_random_secret_here
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=development
```

### Frontend (`frontend/.env.local`)
```
VITE_API_URL=http://localhost:5000/api
```

### Frontend (`frontend/.env.production` / Vercel env var)
```
VITE_API_URL=https://your-backend.onrender.com/api
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| CORS error in browser console | Add your frontend URL to `FRONTEND_URL` env var in Render backend |
| 401 Unauthorized on all API calls | JWT_SECRET mismatch — make sure it's set correctly on Render |
| MongoDB connection fails | Check MONGO_URI and Atlas Network Access (allow 0.0.0.0/0) |
| PDF upload fails | Check that multer is using memory storage (no disk writes needed) |
| Frontend shows blank page | Check Vercel build log; ensure `VITE_API_URL` is set correctly |
| Backend on Render spins down | Render free tier sleeps after 15 min inactivity — first request takes ~30s to wake |

---

## Security Checklist

- [ ] `.env` files are in `.gitignore` and never committed
- [ ] `JWT_SECRET` is a long random string (min 32 chars, ideally 64+)
- [ ] MongoDB Atlas Network Access is configured (0.0.0.0/0 for deployment)
- [ ] `FRONTEND_URL` is set correctly so CORS only allows your domain
- [ ] No hardcoded secrets anywhere in source code
- [ ] All sensitive routes require JWT authentication
