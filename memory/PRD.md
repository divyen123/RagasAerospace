# Ragas Aerospace — PRD

## Problem statement
User provided an HTML mock of Ragas Aerospace. They want:
1. Connect supplied Supabase Postgres
2. Sign-in gating before users can apply to Open Roles
3. Founders contact info in Support
4. Interactive drone animations
5. Royal purple (dark) theme replacing gold
6. Click product card → modal with image + details (order: Tri, Quad, Hexa, Octa, VTOL, FPV)
7. Social icons (Instagram, LinkedIn, X, YouTube, Email) with redirects
8. Only Founder + Co-Founder cards (founder=male photo, co-founder=female photo, contact: sudhikshavbr@gmail.com / +91 9444806265)
9. Notify `studyhoodie25@gmail.com` on each user login
10. Confirm DB persistence

## Architecture
- Frontend: React (CRA) + custom CSS (royal purple aesthetic, Barlow Condensed + DM Serif fonts)
- Backend: FastAPI + asyncpg connecting to Supabase Postgres (pgBouncer transaction pooler on aws-1-ap-south-1)
- Auth: bcrypt + PyJWT, JWT in httpOnly cookie + X-Auth-Token header; localStorage fallback for cross-origin
- Tables: `users`, `applications`, `login_notifications` (audit + email log)

## Implemented (2026-06-06)
- [x] Supabase Postgres connection (transaction pooler, statement_cache_size=0)
- [x] Email/password auth — register/login/logout/me + Bearer token + httpOnly cookie
- [x] Login notification — DB log every login, sends email when SMTP env vars are set
- [x] React UI with royal purple theme, animated SVG drone (hero flying + mouse cursor)
- [x] Product cards (Tri, Quad, Hexa, Octa, VTOL, FPV) with images and click-to-open detail modal
- [x] Founder + Co-Founder cards with provided photos, email and phone
- [x] Social icons (Instagram, LinkedIn, X, YouTube, Email) in Support section + footer
- [x] Open Roles modal — auth-gated application form, submits to /api/applications

## Verified end-to-end (curl)
- ✅ Registration creates row in `users`
- ✅ Login returns user + sets cookie/header; appends row to `login_notifications`
- ✅ /me returns the same user via Bearer
- ✅ POST /api/applications persists JSONB form data linked to user
- ✅ GET /api/applications returns user's submissions

## Backlog / Next
- [ ] Real email delivery — fill SMTP_* env vars (Gmail App Password recommended)
- [ ] Provide FPV drone image (user said "will give one more later")
- [ ] Optional: admin dashboard to view all applications
- [ ] Optional: enable Supabase RLS policies (currently using direct service-role connection)

## Update 2026-06-06 (iteration 2)
- [x] Plugged in FPV drone image (asset `81pursfl_…`)
- [x] Candidate auto-reply email on application submission — `Thanks for applying to Ragas Aerospace`
- [x] Admin notification email on every new application (to `studyhoodie25@gmail.com`)
- Both email features activate the moment SMTP_* env vars are set.
