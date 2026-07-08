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

The application is designed for cloud-native deployment with the frontend hosted on **Vercel** and the backend hosted on **Render**, backed by a **PostgreSQL** database.

### 🗄️ Database Setup
The backend uses **PostgreSQL** for persistent storage.
- **Auto-Initialization**: The database tables (`users`, `applications`, and `login_notifications`) are automatically initialized on application startup by [backend/server.py](file:///c:/Projects/RagasAerospace/RagasAerospace-main/backend/server.py). No manual migrations are required.
- **Connection Pooler Hint**: If using a connection pooler like Supabase's PgBouncer, the client is configured with `statement_cache_size=0` in the application pool setup to ensure compatibility with transaction mode.

---

### 🖥️ Frontend Deployment (Vercel)
The frontend React application is configured to deploy on [Vercel](https://vercel.com).

#### Vercel Configurations
- The root [vercel.json](file:///c:/Projects/RagasAerospace/RagasAerospace-main/vercel.json) routes traffic, static assets, and video files under `/frontend`.
- The nested [frontend/vercel.json](file:///c:/Projects/RagasAerospace/RagasAerospace-main/frontend/vercel.json) ensures React Router Single Page Application (SPA) routing is correctly resolved.

#### Deployment Steps
1. Push the repository to GitHub/GitLab/Bitbucket.
2. Import the project in Vercel.
3. Configure the following environment variable in the Vercel Dashboard:
   - `REACT_APP_BACKEND_URL`: The full URL of your deployed backend service (e.g. `https://ragas-aerospace-backend.onrender.com`).
4. Keep the **Root Directory** as the repository root, as Vercel will process [vercel.json](file:///c:/Projects/RagasAerospace/RagasAerospace-main/vercel.json) to build the frontend.

---

### ⚙️ Backend Deployment (Render)
The FastAPI backend is configured for deployment on [Render](https://render.com).

#### Infrastructure-as-Code (Render Blueprints)
The backend is defined via [render.yaml](file:///c:/Projects/RagasAerospace/RagasAerospace-main/render.yaml). You can deploy the backend using Render's **Blueprint** feature, which reads this file and configures the web service automatically.

#### Environment Variables Configuration
Ensure the following environment variables are set in the Render Dashboard:

| Variable | Description | Required | Example / Default |
|----------|-------------|----------|-------------------|
| `DATABASE_URL` | PostgreSQL connection string | **Yes** | `postgresql://user:pass@host:port/db` |
| `JWT_SECRET` | Secret key used for signing session tokens | **Yes** | Any secure random hex string |
| `ADMIN_EMAILS` | Comma-separated list of emails automatically promoted to admin status | **No** | `studyhoodie25@gmail.com,raghavsaravanan22@gmail.com` |
| `ADMIN_NOTIFY_EMAIL` | Email where admin alerts (like user sign-ins/sign-ups) are sent | **No** | `admin@example.com` |
| `SMTP_HOST` | Host address of SMTP server for sending emails | **No** | `smtp.gmail.com` |
| `SMTP_PORT` | SMTP port to connect to | **No** | `587` |
| `SMTP_USER` | SMTP username | **No** | `ragasaerospace@gmail.com` |
| `SMTP_PASSWORD` | SMTP password (or App Password) | **No** | `your-smtp-app-password` |
| `SMTP_FROM` | Sender email address for outgoing mail notifications | **No** | `ragasaerospace@gmail.com` |

---

## 📄 License

© 2026 Ragas Aerospace. All rights reserved.
