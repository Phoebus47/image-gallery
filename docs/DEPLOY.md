# Deployment Guide

**Last updated:** February 28, 2026

This app is **deployed on Vercel**. The live URL is in [docs/PROJECT_STATUS.md](./PROJECT_STATUS.md). Below are options for running locally or self-hosted.

## Production / Server (actual project values)

This section and the deployment options below satisfy the assignment requirement for **architecture and production technology** (server specifications, OS/software, and deployment method).

| Item                        | Value                                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------------------- |
| **Runtime**                 | Node.js 20 (LTS)                                                                                  |
| **Framework**               | Next.js 16 (standalone output)                                                                    |
| **OS (Docker)**             | Linux (Alpine in Dockerfile)                                                                      |
| **Database**                | MySQL 8 (when using Docker or self-host)                                                          |
| **Vercel**                  | Serverless; no server specs to configure (managed by Vercel)                                      |
| **Self-host minimum (PM2)** | Ubuntu 22.04 LTS or equivalent, 1 vCPU, 1 GB RAM (2 GB recommended if MySQL runs on same machine) |

## Option 1: Vercel (deployed)

The app is deployed on Vercel. Reviewers can use the live URL directly.

- **Live URL:** [https://image-gallery-thanakrit-thanyawatsa.vercel.app/](https://image-gallery-thanakrit-thanyawatsa.vercel.app/)
- Without `DATABASE_URL` on Vercel, the app uses mock data.
- To connect a database: add env var `DATABASE_URL` (e.g. PlanetScale, Neon) in Vercel project settings, then redeploy.

## Option 2: Docker (full stack locally)

- **App image:** From Dockerfile – `node:20-alpine`, Next.js standalone, runs `node server.js`
- **MySQL:** `mysql:8` (official image), port 3306, volume `mysql_data`

```bash
# Build and run
docker compose up -d

# Initialize database (first time only)
docker compose exec app npm run db:push
docker compose exec app npm run db:seed

# Open http://localhost:3000
```

## Option 3: Ubuntu Server + PM2

- **OS:** Ubuntu 22.04 LTS (or Debian / any distro that supports Node 20)
- **Runtime:** Node.js 20.x (from package-lock.json via `npm ci`)
- **Process manager:** PM2 (ecosystem.config.cjs)

```bash
# On server
npm ci
npm run build
npm run db:push   # if MySQL is running
npm run db:seed

# With standalone output
cd .next/standalone
cp -r ../static ./
cp -r ../../prisma ./
cp -r ../../node_modules/.prisma ./node_modules/
cp -r ../../node_modules/@prisma ./node_modules/
cp -r ../../public ./

# Run with PM2
pm2 start ecosystem.config.cjs
```

## Database

- **MySQL 8** required for Prisma
- **Fallback:** If `DATABASE_URL` is missing or API fails, app uses mock data (no DB needed)
