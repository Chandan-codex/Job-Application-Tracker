# 📂 Job Application Tracker — Complete Project Structure & Codebase Guide

This document provides a detailed breakdown of the entire folder structure, explaining what each folder and file does, why it is structured this way, and how to explain it to an interviewer.

---

## 🌳 High-Level Directory Tree

```
Job-Application-Tracker/
│
├── 📁 backend/                        # Node.js & Express REST API Server
│   ├── 📁 config/                     # Database & service configurations
│   │   └── db.js                      # MongoDB connection setup using Mongoose
│   ├── 📁 controllers/                # Business logic & request handling
│   │   ├── applicationController.js   # Scoped CRUD operations for job applications
│   │   └── authController.js          # User registration & authentication logic
│   ├── 📁 middleware/                 # Express request interceptors
│   │   └── authMiddleware.js          # JWT verification & req.user attachment
│   ├── 📁 models/                     # Mongoose database schemas & models
│   │   ├── Application.js             # Job application schema (relational ref to User)
│   │   └── User.js                    # User account schema (hashed passwords)
│   ├── 📁 routes/                     # REST API route declarations
│   │   ├── applicationRoutes.js       # Endpoints for /api/applications
│   │   └── authRoutes.js              # Endpoints for /api/auth
│   ├── .env                           # Environment secrets (PORT, MONGO_URI, JWT_SECRET)
│   ├── .env.example                   # Template environment file for setup
│   ├── package.json                   # Backend dependencies & npm scripts
│   └── server.js                      # Express app entry point & middleware pipeline
│
├── 📁 frontend/                       # React Single Page Application (SPA)
│   ├── 📁 public/                     # Static assets (favicons, icons)
│   ├── 📁 src/                        # React source code
│   │   ├── 📁 components/             # Reusable, modular UI components
│   │   │   ├── ApplicationCard.jsx    # Displays individual job details & action buttons
│   │   │   ├── ApplicationForm.jsx    # Modal form for adding/editing job applications
│   │   │   ├── FilterBar.jsx          # Live search bar & status dropdown filter
│   │   │   ├── Navbar.jsx             # Top bar with user profile & logout action
│   │   │   └── ProtectedRoute.jsx     # Route guard for authenticated navigation
│   │   ├── 📁 context/                # React Context for global state
│   │   │   └── AuthContext.jsx        # Auth state provider (`user`, `token`, `login`, `logout`)
│   │   ├── 📁 pages/                  # Page-level route views
│   │   │   ├── Dashboard.jsx          # Main dashboard (metrics, search, filter & grid)
│   │   │   ├── Login.jsx              # User sign-in page
│   │   │   └── Register.jsx           # User sign-up page
│   │   ├── App.jsx                    # Root component with routing definitions
│   │   ├── index.css                  # Global styles & Tailwind CSS directives
│   │   └── main.jsx                   # React DOM entry point wrapping AuthProvider & Router
│   ├── index.html                     # HTML root template
│   ├── package.json                   # Frontend dependencies & npm scripts
│   └── vite.config.js                 # Vite build & bundler configuration
│
├── PROJECT_WALKTHROUGH.md             # Detailed interview preparation & technical deep dive
├── PROJECT_STRUCTURE.md               # Codebase directory breakdown & file responsibilities
└── README.md                          # Quick start instructions & documentation
```

---

## 🛠️ Backend Architecture & File Responsibilities

### 1. `backend/server.js` (Application Entry Point)
* **What it does**: Initializes the Express application, loads environment variables (`dotenv`), connects to MongoDB via `connectDB()`, attaches standard middleware (`cors()`, `express.json()`), mounts route modules, and configures a global error handling middleware.
* **Why it's structured this way**: Keeps server startup and global middleware separated from routing logic.

### 2. `backend/config/db.js` (Database Connection)
* **What it does**: Connects to the MongoDB instance using Mongoose with proper async connection handling and error logging.
* **Why it's structured this way**: Decouples database initialization from server lifecycle logic.

### 3. `backend/models/` (Data Schemas)
* **`User.js`**: Defines the user schema with required `name`, unique lowercase `email`, and hashed `password`.
* **`Application.js`**: Defines the job application schema (`company`, `position`, `status` with enums `["Applied", "Shortlisted", "Interview", "Selected", "Rejected"]`, `applicationDate`, `interviewDate`, `jobType`, `location`, `notes`), and a foreign key `user` referencing `User` via `mongoose.Schema.Types.ObjectId`.
* **Why it's structured this way**: Enforces strict schema-level data validation and automatic `timestamps` (`createdAt`, `updatedAt`).

### 4. `backend/routes/` (Route Definitions)
* **`authRoutes.js`**: Maps `POST /register` and `POST /login` to controller actions.
* **`applicationRoutes.js`**: Protects all endpoints with `authMiddleware` and routes `GET /`, `POST /`, `PUT /:id`, and `DELETE /:id`.
* **Why it's structured this way**: Clean separation between URL endpoint matching and request handling.

### 5. `backend/controllers/` (Business Logic)
* **`authController.js`**: Handles user registration, email collision checking, password hashing with `bcryptjs`, credential verification, and JWT generation.
* **`applicationController.js`**: Implements user-scoped CRUD operations (`find({ user: req.user.id })`, `findOneAndDelete({ _id: id, user: req.user.id })`) ensuring complete data isolation.
* **Why it's structured this way**: Controllers encapsulate all database operations and business rules, making code unit-testable.

### 6. `backend/middleware/authMiddleware.js` (Security Interceptor)
* **What it does**: Intercepts requests, validates the `Authorization: Bearer <token>` header, decodes the JWT using `process.env.JWT_SECRET`, and attaches `req.user = { id: decoded.id }`.
* **Why it's structured this way**: Reusable gatekeeper that ensures unauthenticated requests are rejected with `401 Unauthorized` before hitting controller logic.

---

## 🎨 Frontend Architecture & File Responsibilities

### 1. `frontend/src/main.jsx` & `App.jsx` (Application Shell & Routing)
* **`main.jsx`**: Bootstraps React into `#root`, wrapping the app with `<BrowserRouter>` and `<AuthProvider>`.
* **`App.jsx`**: Declares client routes (`/login`, `/register`, `/dashboard`). The `/dashboard` route is wrapped in `<ProtectedRoute>` to guard against unauthenticated visits.

### 2. `frontend/src/context/AuthContext.jsx` (Global Auth State)
* **What it does**: Centralizes `user`, `token`, `isAuthenticated`, `login()`, and `logout()`.
* **Session Persistence**: Lazily reads from `localStorage` on initial state creation so page refreshes don't lose the logged-in session.
* **`useAuth()` Custom Hook**: Provides an easy hook interface for any component to access authentication details.

### 3. `frontend/src/pages/` (View Layer)
* **`Dashboard.jsx`**: 
  * Fetches the user's applications upon mounting.
  * Calculates pipeline statistics using `useMemo` (Total, Applied, Shortlisted, Interview, Selected, Rejected).
  * Implements memoized search and status filtering.
  * Controls the Add/Edit modal state.
* **`Login.jsx` & `Register.jsx`**: Responsive forms with client-side validation, error handling alerts, and navigation redirects upon successful authentication.

### 4. `frontend/src/components/` (Reusable UI Modules)
* **`Navbar.jsx`**: Displays application branding, the logged-in user's name, and a one-click logout action.
* **`ProtectedRoute.jsx`**: Checks `isAuthenticated`; renders `<Navigate to="/login" replace />` if unauthenticated, or renders `<Outlet />`/children if authenticated.
* **`FilterBar.jsx`**: Controlled search input and status dropdown for instant filtering without additional network calls.
* **`ApplicationCard.jsx`**: Displays card layout for each job application, including color-coded status badges, formatted dates, and Edit/Delete action triggers.
* **`ApplicationForm.jsx`**: Modal dialog for creating new applications or updating existing ones with controlled form inputs and validation.

---

## 🎤 How to Explain This Project Structure to an Interviewer

> **Interviewer**: *"Can you walk me through how your project is structured and why?"*
>
> **Your Answer**:
> 1. **Clear Client-Server Separation**:
>    *"The codebase is organized as a decoupled monorepo with separate `frontend/` and `backend/` directories. This ensures a clean boundary between UI presentation and API services, allowing either layer to be deployed or scaled independently."*
> 2. **Modular Layered Architecture (MVC-inspired)**:
>    *"On the backend, I followed a layered architecture: `routes/` define the endpoints, `middleware/` handles cross-cutting concerns like JWT validation, `controllers/` execute the business logic, and `models/` define the data schemas with Mongoose. This separation of concerns makes the codebase easy to maintain and test."*
> 3. **Component-Driven Frontend**:
>    *"On the frontend, I organized the React codebase by dividing it into `pages/` for route views, `components/` for reusable UI elements (like cards, modals, and filter bars), and `context/` for centralized auth management. State that only matters to the dashboard stays in the dashboard, while global auth state is accessible anywhere via the `useAuth` hook."*
