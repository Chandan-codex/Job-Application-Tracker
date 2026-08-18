# 💼 Job Application Tracker

A full-stack MERN application designed to help job hunters track, manage, and organize their internship and full-time job applications in one clean, intuitive dashboard.

---

## 🚀 Tech Stack

### Frontend
- **React (Vite, JavaScript)** — Fast, lightweight single-page application framework.
- **React Router (`react-router-dom`)** — Client-side declarative routing and protected routes.
- **Tailwind CSS** — Utility-first styling for responsive layouts and clean badges.
- **Native Fetch API** — Built-in browser HTTP client (no external library overhead).
- **React Context (`AuthContext`)** — Lightweight auth state management (`user`, `token`, `login`, `logout`).

### Backend
- **Node.js & Express.js** — RESTful API with MVC architecture.
- **MongoDB & Mongoose** — Document database with schema validation and user referencing.
- **JWT (`jsonwebtoken`)** — Stateless authentication and authorization.
- **bcryptjs** — Cryptographic password hashing.
- **cors & dotenv** — Cross-origin request handling and environment variable management.

---

## 🏛 Architecture & Data Flow

```text
User Action (React UI)
        │
        ▼
Native Fetch API -> Authorization: Bearer <JWT>
        │
        ▼
Express Router (/api/applications)
        │
        ▼
authMiddleware (Verifies JWT & attaches req.user = { id: decoded.id })
        │
        ▼
applicationController (Executes query scoped to user: req.user.id)
        │
        ▼
MongoDB (Mongoose Model)
        │
        ▼
JSON Response -> UI Updates with optimistic state
```

---

## 🔒 Security & User Isolation

1. **No Client-Supplied `userId`**: The backend **never** trusts `userId` in the request body. User identity is strictly derived from the verified JWT payload (`req.user.id`).
2. **Backend-Enforced Ownership**: All `find`, `update`, and `delete` operations query `{ _id: id, user: req.user.id }`. User A cannot view, modify, or delete User B's applications.
3. **Password Security**: Passwords are never saved in plaintext; they are salted and hashed with `bcryptjs` (10 rounds).
4. **Token Security**: Protected endpoints return `401 Unauthorized` for missing, expired, or tampered tokens.

---

## 📋 REST API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user (`name`, `email`, `password`) | No |
| `POST` | `/api/auth/login` | Log in user with credentials (`email`, `password`) | No |

### Applications (`/api/applications`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/applications` | Get all applications for the authenticated user | Yes (`Bearer <token>`) |
| `POST` | `/api/applications` | Create a new job application | Yes (`Bearer <token>`) |
| `PUT` | `/api/applications/:id` | Update an existing application (ownership verified) | Yes (`Bearer <token>`) |
| `DELETE` | `/api/applications/:id` | Delete an application (ownership verified) | Yes (`Bearer <token>`) |

### Health Check

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/health` | Server health check endpoint | No |

---

## 🛠 Local Setup Guide

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Job-Application-Tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
# Paste your MongoDB Atlas connection string:
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/jobtracker?retryWrites=true&w=majority
JWT_SECRET=super_secret_jwt_key_job_application_tracker_2026
```

Start the backend development server:
```bash
npm run dev
# Server will run on http://localhost:5000
```

### 3. Frontend Setup
Open a new terminal tab:
```bash
cd frontend
npm install
npm run dev
# Frontend will run on http://localhost:5173
```

---

## 💡 Key Interview Concepts

- **Why bcrypt for passwords?** One-way cryptographic hashing ensures that even database administrators cannot view plain passwords.
- **Why JWT?** It enables stateless authentication; the server verifies the token signature without querying a session store on every HTTP request.
- **Why use native Fetch?** Modern browsers support `fetch()` natively with `async/await`, eliminating the need for third-party HTTP libraries like Axios for straightforward REST APIs.
- **Why scope queries to `req.user.id`?** Prevents Insecure Direct Object References (IDOR), ensuring strict multi-tenant data isolation.

---

## 🌐 Deployment Overview

1. **Database**: MongoDB Atlas (create free M0 cluster, configure database user and IP whitelist `0.0.0.0/0`).
2. **Backend**: Render (Web Service from GitHub repository pointing to `backend/`, add `MONGO_URI`, `JWT_SECRET`, `PORT`).
3. **Frontend**: Vercel (Import `frontend/` directory, build command `npm run build`, output `dist`).
