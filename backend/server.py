from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

import os
import logging
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import asyncio
import smtplib
from email.mime.text import MIMEText

import asyncpg
import bcrypt
import jwt
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from pydantic import BaseModel, EmailStr, Field
from starlette.middleware.cors import CORSMiddleware

# ------------------------------------------------------------------
# Logging
# ------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger("ragas")

# ------------------------------------------------------------------
# Config
# ------------------------------------------------------------------
DATABASE_URL = os.environ["DATABASE_URL"]
JWT_SECRET = os.environ["JWT_SECRET"]
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MIN = 60 * 24 * 7  # 7 days

ADMIN_NOTIFY_EMAIL = os.environ.get("ADMIN_NOTIFY_EMAIL", "")
SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587") or 587)
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("SMTP_FROM", "") or SMTP_USER


def _send_email_blocking(to: str, subject: str, body: str) -> str:
    if not (SMTP_HOST and SMTP_USER and SMTP_PASSWORD and to):
        return "skipped"
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = subject
    msg["From"] = SMTP_FROM or SMTP_USER
    msg["To"] = to
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=15) as s:
        s.ehlo()
        try:
            s.starttls()
            s.ehlo()
        except Exception:
            pass
        s.login(SMTP_USER, SMTP_PASSWORD)
        s.sendmail(msg["From"], [to], msg.as_string())
    return "sent"


async def send_login_notification(user_email: str, user_name: str, request: Request) -> None:
    ip = request.client.host if request.client else "?"
    ua = request.headers.get("user-agent", "?")
    ts = datetime.now(timezone.utc).isoformat()
    subject = f"[Ragas Aerospace] Login: {user_email}"
    body = (
        f"A user just signed in to Ragas Aerospace.\n\n"
        f"Name : {user_name}\n"
        f"Email: {user_email}\n"
        f"Time : {ts}\n"
        f"IP   : {ip}\n"
        f"Agent: {ua}\n"
    )
    status = "skipped"
    err = None
    try:
        if ADMIN_NOTIFY_EMAIL and SMTP_HOST:
            status = await asyncio.to_thread(
                _send_email_blocking, ADMIN_NOTIFY_EMAIL, subject, body
            )
    except Exception as exc:
        status = "error"
        err = str(exc)
        logger.warning("login notify email failed: %s", exc)
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """INSERT INTO login_notifications (id, user_email, user_name, ip, user_agent, status, error)
                   VALUES ($1,$2,$3,$4,$5,$6,$7)""",
                str(uuid.uuid4()), user_email, user_name, ip, ua, status, err,
            )
    except Exception as exc:
        logger.warning("login notify DB log failed: %s", exc)


async def send_register_notification(user_email: str, user_name: str, request: Request) -> None:
    ip = request.client.host if request.client else "?"
    ua = request.headers.get("user-agent", "?")
    ts = datetime.now(timezone.utc).isoformat()
    subject = f"[Ragas Aerospace] Registration: {user_email}"
    body = (
        f"A new user has registered on Ragas Aerospace.\n\n"
        f"Name : {user_name}\n"
        f"Email: {user_email}\n"
        f"Time : {ts}\n"
        f"IP   : {ip}\n"
        f"Agent: {ua}\n"
    )
    status = "skipped"
    err = None
    try:
        if ADMIN_NOTIFY_EMAIL and SMTP_HOST:
            status = await asyncio.to_thread(
                _send_email_blocking, ADMIN_NOTIFY_EMAIL, subject, body
            )
    except Exception as exc:
        status = "error"
        err = str(exc)
        logger.warning("register notify email failed: %s", exc)
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            await conn.execute(
                """INSERT INTO login_notifications (id, user_email, user_name, ip, user_agent, status, error)
                   VALUES ($1,$2,$3,$4,$5,$6,$7)""",
                str(uuid.uuid4()), user_email, user_name, ip, ua, f"register_{status}", err,
            )
    except Exception as exc:
        logger.warning("register notify DB log failed: %s", exc)


async def send_candidate_autoreply(candidate_email: str, candidate_name: str, role_title: str) -> str:
    """Send the candidate a friendly auto-acknowledgement. Returns status string."""
    if not (candidate_email and SMTP_HOST):
        return "skipped"
    subject = f"Thanks for applying to Ragas Aerospace — {role_title}"
    body = (
        f"Hi {candidate_name or 'there'},\n\n"
        f"Thanks for applying to the \"{role_title}\" opportunity at Ragas Aerospace.\n"
        f"We've received your application and our team will review it shortly.\n"
        f"If you're a strong match, we'll reach out for the next steps.\n\n"
        f"In the meantime, feel free to explore our work and follow along as we build the future of autonomous flight.\n\n"
        f"— Team Ragas Aerospace\n"
        f"ragasaerospace@gmail.com\n"
    )
    try:
        return await asyncio.to_thread(_send_email_blocking, candidate_email, subject, body)
    except Exception as exc:
        logger.warning("candidate autoreply failed: %s", exc)
        return "error"

# ------------------------------------------------------------------
# App
# ------------------------------------------------------------------
app = FastAPI(title="Ragas Aerospace API")
api_router = APIRouter(prefix="/api")

# ------------------------------------------------------------------
# DB pool
# ------------------------------------------------------------------
pg_pool: Optional[asyncpg.Pool] = None


async def get_pool() -> asyncpg.Pool:
    if pg_pool is None:
        raise RuntimeError("DB pool not initialised")
    return pg_pool


# ------------------------------------------------------------------
# Models
# ------------------------------------------------------------------
class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = Field(min_length=1, max_length=120)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    name: str
    is_admin: bool = False


class AdminStats(BaseModel):
    users: int
    applications: int
    logins: int


class LoginRow(BaseModel):
    id: str
    user_email: str
    user_name: Optional[str]
    ip: Optional[str]
    user_agent: Optional[str]
    status: Optional[str]
    created_at: datetime


class UserRow(BaseModel):
    id: str
    email: EmailStr
    name: str
    is_admin: bool
    created_at: datetime


class ApplicationIn(BaseModel):
    role: str  # internship | workshop
    role_title: Optional[str] = None
    data: dict


class ApplicationOut(BaseModel):
    id: str
    role: str
    role_title: Optional[str]
    data: dict
    created_at: datetime


# ------------------------------------------------------------------
# Helpers
# ------------------------------------------------------------------
def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(password.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MIN),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth = request.headers.get("Authorization", "")
        if auth.startswith("Bearer "):
            token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")

    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, email, name, is_admin FROM users WHERE id = $1", payload["sub"]
        )
    if not row:
        raise HTTPException(status_code=401, detail="User not found")
    return {"id": row["id"], "email": row["email"], "name": row["name"], "is_admin": bool(row["is_admin"])}


def set_auth_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,
        secure=True,
        samesite="none",
        max_age=ACCESS_TOKEN_EXPIRE_MIN * 60,
        path="/",
    )


# ------------------------------------------------------------------
# Startup / shutdown
# ------------------------------------------------------------------
@app.on_event("startup")
async def on_startup():
    global pg_pool
    try:
        pg_pool = await asyncpg.create_pool(
            DATABASE_URL,
            min_size=1,
            max_size=5,
            statement_cache_size=0,  # required for Supabase pgBouncer (transaction pooler)
        )
    except Exception as exc:
        logger.exception("Failed to create Postgres pool: %s", exc)
        raise

    async with pg_pool.acquire() as conn:
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                name TEXT NOT NULL,
                is_admin BOOLEAN NOT NULL DEFAULT FALSE,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
        # idempotent column add for existing DBs
        await conn.execute("ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN NOT NULL DEFAULT FALSE;")
        # auto-promote known admin emails
        admin_emails = [e.strip().lower() for e in os.environ.get("ADMIN_EMAILS", "studyhoodie25@gmail.com,raghavsaravanan22@gmail.com,sudhikshavbr@gmail.com,ragasaerospace@gmail.com").split(",") if e.strip()]
        if admin_emails:
            await conn.execute(
                "UPDATE users SET is_admin = TRUE WHERE LOWER(email) = ANY($1::text[])",
                admin_emails,
            )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS applications (
                id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                role TEXT NOT NULL,
                role_title TEXT,
                data JSONB NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
        await conn.execute(
            "CREATE INDEX IF NOT EXISTS applications_user_idx ON applications(user_id);"
        )
        await conn.execute(
            """
            CREATE TABLE IF NOT EXISTS login_notifications (
                id TEXT PRIMARY KEY,
                user_email TEXT NOT NULL,
                user_name TEXT,
                ip TEXT,
                user_agent TEXT,
                status TEXT,
                error TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            );
            """
        )
    logger.info("Postgres ready — tables ensured.")


@app.on_event("shutdown")
async def on_shutdown():
    global pg_pool
    if pg_pool:
        await pg_pool.close()


# ------------------------------------------------------------------
# Routes
# ------------------------------------------------------------------
@api_router.get("/")
async def root():
    return {"message": "Ragas Aerospace API", "ok": True}


@api_router.get("/health")
async def health():
    try:
        pool = await get_pool()
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        return {"status": "ok", "db": "connected"}
    except Exception as exc:
        return {"status": "degraded", "db": str(exc)}


@api_router.post("/auth/register", response_model=UserOut)
async def register(body: RegisterIn, request: Request, response: Response):
    email = body.email.lower().strip()
    pool = await get_pool()
    async with pool.acquire() as conn:
        existing = await conn.fetchrow("SELECT id FROM users WHERE email = $1", email)
        if existing:
            raise HTTPException(status_code=400, detail="Email already registered")
        user_id = str(uuid.uuid4())
        await conn.execute(
            "INSERT INTO users (id, email, password_hash, name) VALUES ($1, $2, $3, $4)",
            user_id,
            email,
            hash_password(body.password),
            body.name.strip(),
        )
    token = create_access_token(user_id, email)
    set_auth_cookie(response, token)
    response.headers["X-Auth-Token"] = token
    try:
        await send_register_notification(email, body.name.strip(), request)
    except Exception as exc:
        logger.warning("register notification failed: %s", exc)
    return UserOut(id=user_id, email=email, name=body.name.strip())


@api_router.post("/auth/login", response_model=UserOut)
async def login(body: LoginIn, request: Request, response: Response):
    email = body.email.lower().strip()
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "SELECT id, email, password_hash, name FROM users WHERE email = $1", email
        )
    if not row or not verify_password(body.password, row["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(row["id"], row["email"])
    set_auth_cookie(response, token)
    response.headers["X-Auth-Token"] = token
    try:
        await send_login_notification(row["email"], row["name"], request)
    except Exception as exc:
        logger.warning("login notification failed: %s", exc)
    return UserOut(id=row["id"], email=row["email"], name=row["name"])


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me", response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    return UserOut(**user)


def _require_admin(user: dict):
    if not user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")


@api_router.get("/admin/stats", response_model=AdminStats)
async def admin_stats(user: dict = Depends(get_current_user)):
    _require_admin(user)
    pool = await get_pool()
    async with pool.acquire() as conn:
        u = await conn.fetchval("SELECT COUNT(*) FROM users")
        a = await conn.fetchval("SELECT COUNT(*) FROM applications")
        l = await conn.fetchval("SELECT COUNT(*) FROM login_notifications")
    return AdminStats(users=u, applications=a, logins=l)


@api_router.get("/admin/users", response_model=List[UserRow])
async def admin_users(user: dict = Depends(get_current_user)):
    _require_admin(user)
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, email, name, is_admin, created_at FROM users ORDER BY created_at DESC"
        )
    return [UserRow(**dict(r)) for r in rows]


@api_router.get("/admin/applications", response_model=List[ApplicationOut])
async def admin_applications(user: dict = Depends(get_current_user)):
    _require_admin(user)
    import json as _json
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, role, role_title, data, created_at FROM applications ORDER BY created_at DESC"
        )
    return [
        ApplicationOut(
            id=r["id"],
            role=r["role"],
            role_title=r["role_title"],
            data=r["data"] if isinstance(r["data"], dict) else _json.loads(r["data"]),
            created_at=r["created_at"],
        )
        for r in rows
    ]


@api_router.get("/admin/logins", response_model=List[LoginRow])
async def admin_logins(user: dict = Depends(get_current_user)):
    _require_admin(user)
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, user_email, user_name, ip, user_agent, status, created_at "
            "FROM login_notifications ORDER BY created_at DESC LIMIT 500"
        )
    return [LoginRow(**dict(r)) for r in rows]


@api_router.post("/applications", response_model=ApplicationOut)
async def submit_application(
    body: ApplicationIn, user: dict = Depends(get_current_user)
):
    import json as _json

    pool = await get_pool()
    app_id = str(uuid.uuid4())
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            """
            INSERT INTO applications (id, user_id, role, role_title, data)
            VALUES ($1, $2, $3, $4, $5::jsonb)
            RETURNING id, role, role_title, data, created_at
            """,
            app_id,
            user["id"],
            body.role,
            body.role_title,
            _json.dumps(body.data),
        )

    # Build candidate contact info from form data or fall back to account email
    data_obj = body.data or {}
    cand_email = (data_obj.get("email") or user.get("email") or "").strip()
    cand_name = (
        " ".join(filter(None, [data_obj.get("first_name"), data_obj.get("last_name")])).strip()
        or user.get("name")
        or ""
    )
    role_label = body.role_title or body.role or "your application"

    # Fire-and-forget candidate auto-reply + admin notification
    try:
        await send_candidate_autoreply(cand_email, cand_name, role_label)
    except Exception as exc:
        logger.warning("autoreply error: %s", exc)
    try:
        if ADMIN_NOTIFY_EMAIL and SMTP_HOST:
            subj = f"[Ragas Aerospace] New application: {role_label}"
            adm_body = (
                f"A new application was submitted.\n\n"
                f"Role : {role_label}\n"
                f"Name : {cand_name}\n"
                f"Email: {cand_email}\n"
                f"User : {user.get('email')}\n"
                f"At   : {row['created_at']}\n\n"
                f"Data:\n{_json.dumps(data_obj, indent=2)}\n"
            )
            await asyncio.to_thread(_send_email_blocking, ADMIN_NOTIFY_EMAIL, subj, adm_body)
    except Exception as exc:
        logger.warning("admin notify error: %s", exc)

    return ApplicationOut(
        id=row["id"],
        role=row["role"],
        role_title=row["role_title"],
        data=row["data"] if isinstance(row["data"], dict) else _json.loads(row["data"]),
        created_at=row["created_at"],
    )


@api_router.get("/applications", response_model=List[ApplicationOut])
async def list_applications(user: dict = Depends(get_current_user)):
    import json as _json

    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, role, role_title, data, created_at FROM applications WHERE user_id = $1 ORDER BY created_at DESC",
            user["id"],
        )
    return [
        ApplicationOut(
            id=r["id"],
            role=r["role"],
            role_title=r["role_title"],
            data=r["data"] if isinstance(r["data"], dict) else _json.loads(r["data"]),
            created_at=r["created_at"],
        )
        for r in rows
    ]


# ------------------------------------------------------------------
# Wire up
# ------------------------------------------------------------------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origin_regex=".*",
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Auth-Token"],
)
