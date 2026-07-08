# 🛩️ Ragas Aerospace

**Indian defence drone technology company building next-gen autonomous aerial systems for surveillance, security, and mission-critical operations.**

[![Live Site](https://img.shields.io/badge/🌐_Live_Site-aerospace.ragasgroups.com-0099ff?style=for-the-badge)](https://aerospace.ragasgroups.com)
[![Status](https://img.shields.io/badge/Status-Active-00c853?style=for-the-badge)]()

---

## 🚀 About

Ragas Aerospace is developing cutting-edge unmanned aerial systems (UAS) that enhance defense capabilities and support national security objectives. Our platforms integrate AI, swarm autonomy, advanced sensing, and secure communications.

### Key Focus Areas
- **Autonomous Systems** — AI-first design removing humans from harm's way
- **Software-Defined** — Tying every sensor, weapon, and operator into one coherent picture
- **Speed of Relevance** — Building and fielding systems faster than adversaries

---

## 🏗️ Project Structure

```
RagasAerospace/
├── frontend/          # React web application
│   ├── public/        # Static assets, videos, favicon
│   └── src/           # Components, styles, logic
├── backend/           # FastAPI server
│   └── server.py      # Authentication, notifications, API
├── tests/             # Test suites
├── render.yaml        # Render deployment config
└── vercel.json        # Vercel deployment config
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎬 Cinematic Hero | Full-screen background video with gradient overlays |
| 🎯 Drone Scanner HUD | Blueprint grid, scanning laser, radar sweep & viewfinder overlays |
| 🛡️ Mission Background Video | Immersive full-section video with glassmorphism pillar cards |
| 🏆 Achievements Gallery | Click-to-open modal with milestone details |
| 📱 Responsive Mobile UI | Hamburger nav with full-screen glass overlay |
| 🔐 User Authentication | Login/Register with email notifications |
| 🚁 Product Showcase | Interactive cards with full specifications modal |
| 👥 Team Section | Founder cards with social links |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React, Vanilla CSS, Framer Motion |
| Backend | Python, FastAPI, PostgreSQL |
| Deployment | Vercel (frontend), Render (backend) |
| Design | Custom CSS animations, glassmorphism, HUD overlays |

---

## 🌐 Deployment

The application follows a split deployment architecture with the frontend and backend hosted on separate platforms for independent scaling and reliability.

### 🖥️ Frontend — Vercel
The React frontend is deployed on [Vercel](https://vercel.com) and served at [aerospace.ragasgroups.com](https://aerospace.ragasgroups.com). Vercel automatically builds the app from the repository on every push to `main`. Routing is handled by two `vercel.json` config files — the root-level one maps static assets and video files to the `/frontend` directory, while the nested one inside `frontend/` provides SPA fallback routing so React Router works correctly on page refresh and direct URL access.

### ⚙️ Backend — Render
The FastAPI backend is deployed on [Render](https://render.com) as a Python web service. The deployment is defined through `render.yaml` using Render's Blueprint infrastructure-as-code approach, which automatically configures the build command (`pip install -r requirements.txt`), the start command (`uvicorn server:app`), and all required environment variables. Render picks up changes from the same repository and redeploys automatically.

### 🗄️ Database — Supabase PostgreSQL
The backend connects to a **Supabase**-hosted PostgreSQL database via a connection pooler (PgBouncer in transaction mode). All database tables — `users`, `applications`, and `login_notifications` — are auto-created on server startup through `CREATE TABLE IF NOT EXISTS` statements in `server.py`, so no manual migrations or schema setup is needed. The connection pool is configured with `statement_cache_size=0` for compatibility with Supabase's transaction-mode pooler.

### 📧 Email Notifications
Login and registration events trigger admin notification emails via SMTP (Gmail). The backend also sends auto-reply acknowledgements to job applicants. All email delivery runs asynchronously in background threads to avoid blocking API responses.

---

## 📄 License

© 2026 Ragas Aerospace. All rights reserved.
