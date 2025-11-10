# CodeSingh Prisma Backend – Developer Guide

This document explains how the backend works end-to-end: setup, architecture, data models, auth, routes, and common workflows.

## 1) Tech Stack
- Node.js + Express
- Prisma ORM (MySQL)
- JSON Web Tokens (JWT) for authentication
- Joi for request validation
- Helmet, CORS, Rate limit, Morgan for security/ops

## 2) Getting Started
### Prerequisites
- Node 18+
- MySQL running locally on port 3306
  - user: `root`
  - password: `420969`

### Install deps
```bash
npm install
```

### Environment variables
Create a local environment with these values (export or use a local `.env`).
```bash
export DATABASE_URL="mysql://root:420969@localhost:3306/codesingh"
export JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
export JWT_REFRESH_SECRET="your-super-secret-refresh-jwt-key-change-this-in-production"
export JWT_EXPIRE="1h"
export JWT_REFRESH_EXPIRE="7d"
export CORS_ORIGIN="http://localhost:5173"
export PORT=3000
```

### Prisma generate + migrate
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Run server
```bash
npm run start
# http://localhost:3000
```

## 3) Project Structure
```
src/
  app.js                # Express app bootstrapping, middleware, routes
  config/jwt.js         # JWT config (pulls from env with defaults)
  controllers/          # Thin request handlers -> call services
  middlewares/          # auth, role, validate
  routes/               # Route registration (auth, users, courses, lectures)
  services/             # Business logic + DB via Prisma
  utils/                # prisma client, jwt helpers, response helpers
prisma/
  schema.prisma         # Prisma models and enums
```

## 4) Data Model (Prisma)
- `User` (id, username, email, password, role, timestamps)
- `Course` (title, description, isPublished, instructorId relation -> User)
- `Lecture` (title, topic, lectureType, youtubeUrl, questions JSON, code, description, order, courseId)
- Enums: `Role` (student, instructor, admin), `LectureType` (Live, Recorded)

Key relations:
- One `User` (instructor) has many `Course`s
- One `Course` has many `Lecture`s

See `prisma/schema.prisma` for exact fields and indexes.

## 5) Auth Flow
- Register: hashes password with bcrypt.
- Login: verifies password, returns `{ accessToken, refreshToken, user }`.
- Protect routes: `authenticate` reads `Authorization: Bearer <token>`, verifies, loads user.
- Authorization: `authorize('admin')` or `authorize('instructor','admin')` checks `req.user.role`.

Files:
- `src/utils/jwt.js` – sign/verify helpers
- `src/middlewares/auth.js` – token parsing + user load
- `src/middlewares/role.js` – role guard

## 6) Validation
- `validate(schema)` middleware uses Joi schemas under `src/validation/*`.
- Applied to create/update endpoints to enforce payload shape.

## 7) Routes Overview
Base prefix: `/api`

- Auth (`src/routes/auth.js`)
  - POST `/auth/register`
  - POST `/auth/login`
  - POST `/auth/logout`

- Users (`src/routes/user.js`) – admin-only listing, protected read/update/delete
  - GET `/users` (admin only). Optional `?role=admin|instructor|student`
  - GET `/users/:id`
  - PUT `/users/:id`
  - DELETE `/users/:id` (admin only)

- Courses (`src/routes/course.js`)
  - GET `/courses`
  - GET `/courses/:id`
  - POST `/courses` (instructor/admin)
  - PUT `/courses/:id` (instructor/admin, must own or admin)
  - DELETE `/courses/:id` (admin)
  - Lectures under course:
    - GET `/courses/:courseId/lectures`
    - POST `/courses/:courseId/lectures` (instructor/admin)

- Lectures (`src/routes/lecture.js`)
  - GET `/lectures` (instructor/admin)
  - GET `/lectures/:id`
  - PUT `/lectures/:id` (instructor/admin; must own course or admin)
  - DELETE `/lectures/:id` (admin)

## 8) Controllers and Services
- Controllers: parse/validate input, call services, format responses (`sendSuccess`/`sendError`).
- Services: business logic and Prisma calls.

Examples:
- `services/auth.js`: register/login, password hashing, token generation
- `services/course.js`: CRUD; ownership checks (`instructorId === req.user.id`) for updates
- `services/lecture.js`: CRUD; verifies course ownership before updates
- `services/user.js`: CRUD; hash password on update; optional role filtering in list

## 9) Responses and Errors
- Success: `{ success: true, message, data }`
- Error: `{ success: false, message, errors? }`
- Global error handler in `src/app.js` catches unhandled errors.

## 10) Pagination (seed support)
- Services accept `(page, limit)` but current controllers don’t expose query pagination to keep the API simple for the initial version. You can extend by adding `?page=&limit=` and mapping to service.

## 11) Security Notes
- CORS restricts to configured origins (env `CORS_ORIGIN` plus known hosts).
- Helmet sets safe headers.
- Rate limiting on `/api` (100 requests / 15m / IP).
- Never commit real secrets. Use env vars in production.

## 12) Local Testing – cURL Snippets
Register:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H 'Content-Type: application/json' \
  -d '{"username":"admin","email":"admin@example.com","password":"secret123","role":"admin"}'
```

Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@example.com","password":"secret123"}'
```
Use the `accessToken` as `Authorization: Bearer <token>`.

Create course (instructor/admin):
```bash
curl -X POST http://localhost:3000/api/courses \
  -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' \
  -d '{"title":"DSA 101","description":"Basics of DSA"}'
```

Add lecture to course:
```bash
curl -X POST http://localhost:3000/api/courses/$COURSE_ID/lectures \
  -H 'Authorization: Bearer $TOKEN' -H 'Content-Type: application/json' \
  -d '{"title":"Intro","lectureType":"Recorded","youtubeUrl":"https://youtu.be/..."}'
```

List users (admin):
```bash
curl -H 'Authorization: Bearer $TOKEN' \
  'http://localhost:3000/api/users?role=instructor'
```

## 13) Seeding an Initial Admin
Quick script (one-off) to create an admin can be added under `scripts/seed-admin.js` using Prisma create. Ask if you want me to include it now.

## 14) Deployment Notes
- Set `DATABASE_URL`, JWT secrets, and `CORS_ORIGIN` in your host.
- Run `npx prisma migrate deploy` on boot or in CI.
- Start with `npm run start` (or your process manager).

## 15) Extending
- Add pagination parameters to list endpoints.
- Add refresh token endpoint and rotation strategy if needed.
- Add soft-delete or audit logs through Prisma middleware if required.

If anything’s unclear or you want a seed/admin script or CI config, tell me and I’ll add it.

## 16) Fetching Data: Users, Courses, Lectures

Public (no auth):
- GET `/api/courses` – list all courses with `instructor` and `lectures` included.
- GET `/api/courses/:id` – single course with `instructor` and `lectures`.
- GET `/api/courses/:courseId/lectures` – lectures for a given course.
- GET `/api/lectures/:id` – single lecture by id.

Protected (requires JWT; use `Authorization: Bearer <token>`):
- GET `/api/lectures` – list all lectures (roles: `admin`, `instructor`).
- PUT `/api/lectures/:id` – update a lecture (roles: `admin` or the `instructor` who owns the course).
- DELETE `/api/lectures/:id` – delete a lecture (role: `admin`).

Users (admin-only list, optional role filter):
- GET `/api/users` – list users (role: `admin`). Accepts `?role=admin|instructor|student`.
- GET `/api/users/:id` – get single user (any authenticated user).
- PUT `/api/users/:id` – update user (authenticated; hashes password if provided).
- DELETE `/api/users/:id` – delete user (role: `admin`).

Quick cURL examples:
```bash
# Courses
curl http://localhost:3000/api/courses
curl http://localhost:3000/api/courses/<COURSE_ID>

# Lectures for a course
curl http://localhost:3000/api/courses/<COURSE_ID>/lectures

# All lectures (admin/instructor)
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/lectures

# Single lecture
curl http://localhost:3000/api/lectures/<LECTURE_ID>

# Update lecture (owner instructor or admin)
curl -X PUT -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"New Title"}' http://localhost:3000/api/lectures/<LECTURE_ID>

# Delete lecture (admin)
curl -X DELETE -H "Authorization: Bearer $TOKEN" http://localhost:3000/api/lectures/<LECTURE_ID>

# Users (admin; optional role filter)
curl -H "Authorization: Bearer $TOKEN" "http://localhost:3000/api/users?role=instructor"
```
