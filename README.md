# MirrorMeMusic

A digital séance for independent artists: an AI-guided portal for release strategy, branding,
and creative direction. Built with Next.js (App Router), Prisma + SQLite, and the Gemini API.

## Stack

- **Frontend/Backend:** Next.js 16 (App Router, Route Handlers)
- **Database:** SQLite via Prisma 7 (`@prisma/adapter-better-sqlite3`)
- **AI:** Google Gemini (`@google/genai`, model `gemini-2.5-flash`)
- **Auth:** Custom email/password auth — bcrypt password hashing + signed JWT in an httpOnly
  cookie (via `jose`)

## Features

- **Mirror Hall** (`/`) — landing page with three portals
- **AI Strategist** (`/strategist`) — live chat with the Oracle (Gemini), with saved sessions
  ("Mirrors") persisted per user
- **Artist & Approach** (`/artist`) — editable artist profile (name, tagline, vision,
  methodology, bio)
- **Project Archive / Vault** (`/case-study`) — CRUD for your released projects
- **Project Roadmap** (`/roadmap`) — AI-generated 4-phase release roadmaps (Gemini drafts
  Songwriting → Branding → Production → Distribution), with phase tracking
- **Auth** (`/login`, `/signup`) — real accounts, each user's data is isolated

## Getting Started

1. Copy `.env` and make sure it has:
   ```
   DATABASE_URL="file:./dev.db"
   GEMINI_API_KEY="..."
   SESSION_SECRET="..."
   ```
2. Install dependencies and run migrations:
   ```bash
   npm install
   npx prisma migrate dev
   ```
3. Start the dev server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000), sign up, and start a session with the
   Oracle.

## Project structure

- `src/app` — pages and API route handlers (`src/app/api/**/route.ts`)
- `src/lib/auth.ts` — session/auth helpers
- `src/lib/gemini.ts` — Gemini client + Oracle system prompt
- `src/lib/prisma.ts` — Prisma client (SQLite driver adapter)
- `prisma/schema.prisma` — data model (User, ArtistProfile, ChatSession/ChatMessage,
  ArchiveProject, RoadmapPhase)
- `stitch-draft/` — original static HTML/CSS design drafts the UI was built from

## Note on the Docker setup

`Dockerfile` / `docker-compose.yml` in the repo root run a Claude Code agent shell, not the app
itself — they're for AI-assisted development, not for serving the site.
