# Birthday Surprise Full-Stack Web Application

A production-ready full-stack interactive birthday surprise web application built with React, Vite, Tailwind CSS, Express, and MongoDB Mongoose (with automatic fallback to an embedded persistent store).

## Render Deployment Guide

This repository is pre-configured for one-click deployment on **Render Free Web Service**.

### 1. Render Dashboard Settings

When creating a new **Web Service** on Render:

| Setting | Recommended Value | Notes |
| :--- | :--- | :--- |
| **Name** | `birthday-surprise` | Or your choice |
| **Language / Runtime** | **Node** | Node 18+ or 20+ (Bun also supported) |
| **Root Directory** | *(Leave blank)* | Default root `/` |
| **Build Command** | `npm install && npm run build` | Builds both frontend and backend bundles |
| **Start Command** | `npm start` | Runs production server (`dist/server.cjs`) |
| **Plan** | **Free** | |

> **Note on Root Directory:**
> Keep **Root Directory** blank on Render. Render defaults the repository root to `/opt/render/project/src`. Setting Root Directory to `src` would misdirect execution into the frontend source folder instead of the project root.

---

### 2. Required Environment Variables

Set the following in the **Environment** tab in your Render Web Service dashboard:

| Variable | Required | Description | Example / Default |
| :--- | :--- | :--- | :--- |
| `NODE_ENV` | Yes | Node environment | `production` |
| `PORT` | Auto | Render injects this automatically | `10000` (handled by code) |
| `MONGODB_URI` | Recommended | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `SESSION_SECRET` | Yes | Random string for signing admin JWTs | `a_long_secure_random_string` |
| `ADMIN_USERNAME` | Optional | Admin panel login username | `admin` (default) |
| `ADMIN_PASSWORD` | Optional | Admin panel login password | `adminpassword123` (default) |

*Note: If `MONGODB_URI` is not provided, the server automatically uses an embedded persistent store (`.data/birthday_db.json`) so the site runs out-of-the-box.*

---

### 3. Alternative: Deploying with Bun on Render

If you prefer using the Bun runtime on Render:

- **Build Command:** `bun install && bun run build`
- **Start Command:** `bun run start`

The project includes an automatic fallback check in `package.json` that ensures `dist/server.cjs` is compiled if missing before the server begins listening.

---

### 4. Local Development

```bash
# Install dependencies
npm install

# Run full-stack dev server (port 3000)
npm run dev

# Build for production
npm run build

# Start production server locally
npm start
```
