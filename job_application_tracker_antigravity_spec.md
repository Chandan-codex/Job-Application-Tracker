# Job Application Tracker — Antigravity AI Agent Build Specification

## 0. Purpose

Build a beginner-friendly, interview-ready **Job Application Tracker** as a full-stack MERN-style web application.

The developer using this specification has only a few days and limited prior MERN knowledge. The AI agent should therefore:

- Keep the project simple and understandable.
- Prefer straightforward code over advanced abstractions.
- Use common beginner-friendly patterns.
- Avoid unnecessary libraries and features.
- Make every major implementation decision easy to explain in an interview.
- Build a complete working MVP before adding polish.
- Do not introduce technologies that are not listed in this document without a strong reason.

The developer will build the project with AI assistance first and learn the concepts while building. Therefore, after each major implementation step, the agent should provide a concise explanation of:
1. What was added.
2. Why it is needed.
3. How the data flows.
4. Which files changed.
5. What the developer should understand before proceeding.

---

# 1. Project Goal

Create a web app that lets authenticated users manage and track job/internship applications.

A user should be able to:

- Register.
- Log in.
- Log out.
- View only their own job applications.
- Add an application.
- Edit an application.
- Delete an application.
- Change application status.
- Search applications.
- Filter applications by status.
- View simple application statistics.

The application should be responsive and visually clean, but the priority is functionality and code clarity.

---

# 2. MVP Scope

## 2.1 Authentication

Required:

- Register
- Login
- Logout
- Password hashing with bcrypt
- JWT-based authentication
- Protected dashboard
- Protected application APIs

Do NOT add:

- OAuth
- Google login
- Email verification
- Password reset
- OTP
- Two-factor authentication

These are out of scope for the 4-day MVP.

---

## 2.2 Application Management

Each application should have:

| Field | Type | Required |
|---|---|---|
| company | String | Yes |
| position | String | Yes |
| status | String/Enum | Yes |
| applicationDate | Date | Yes |
| interviewDate | Date | No |
| jobType | String/Enum | No |
| location | String | No |
| notes | String | No |

### Allowed status values

- Applied
- Shortlisted
- Interview
- Selected
- Rejected

### Allowed job types

- Internship
- Full-time
- Part-time

Do not add more statuses or job types unless required later.

---

# 3. Final Technology Stack

## Frontend

- React
- React Router
- Tailwind CSS
- Native Fetch API

### Important

Do NOT use Axios.

Do NOT use Redux.

Do NOT use TypeScript for this project.

Do NOT use Next.js.

---

## Backend

- Node.js
- Express.js
- JavaScript
- JWT
- bcrypt
- dotenv
- cors

Use a simple MVC-style organization:

- routes
- controllers
- models
- middleware
- config

Do not over-engineer with services/repositories/factories unless absolutely necessary.

---

## Database

- MongoDB
- Mongoose
- MongoDB Atlas for cloud deployment

---

## Deployment

- Frontend: Vercel
- Backend: Render (or Railway if Render is unavailable)
- Database: MongoDB Atlas

Deployment should happen only after the local project works.

---

# 4. Architecture

Use this architecture:

```text
React Frontend
      |
      | Fetch API
      v
Express REST API
      |
      | JWT Middleware
      v
Controllers
      |
      | Mongoose
      v
MongoDB
```

## Feature flow example

### Add application

```text
User submits React form
        |
        v
fetch(POST /api/applications)
        |
        v
Express route
        |
        v
JWT middleware verifies user
        |
        v
Application controller
        |
        v
Mongoose model
        |
        v
MongoDB
        |
        v
JSON response
        |
        v
React updates UI
```

The agent must maintain this mental model throughout the implementation.

---

# 5. Recommended Folder Structure

## Root

```text
job-application-tracker/
├── frontend/
├── backend/
├── README.md
└── .gitignore
```

## Backend

```text
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── applicationController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   └── Application.js
├── routes/
│   ├── authRoutes.js
│   └── applicationRoutes.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

## Frontend

```text
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ApplicationForm.jsx
│   │   ├── ApplicationCard.jsx
│   │   ├── FilterBar.jsx
│   │   └── ProtectedRoute.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── .gitignore
└── package.json
```

The agent may add a small utility file only when it clearly reduces duplication and remains easy for a beginner to understand.

---

# 6. Database Design

## 6.1 User Model

Fields:

```text
name
email
password
createdAt
```

Rules:

- `name`: required
- `email`: required, unique, normalized to lowercase
- `password`: required, stored only as bcrypt hash
- never return the password hash in normal API responses

---

## 6.2 Application Model

Fields:

```text
company
position
status
applicationDate
interviewDate
jobType
location
notes
user
createdAt
updatedAt
```

Rules:

- `company`: required
- `position`: required
- `status`: required and restricted to allowed values
- `applicationDate`: required
- `interviewDate`: optional
- `jobType`: optional and restricted to allowed values
- `location`: optional
- `notes`: optional
- `user`: required ObjectId reference to User

### User ownership requirement

Every application must belong to exactly one user.

All read/update/delete queries must be scoped to the authenticated user.

For example:

```text
GET /api/applications
```

must return applications belonging only to the authenticated user.

A user must never be able to update or delete another user's application by changing the URL ID.

---

# 7. REST API Contract

Base URL locally:

```text
http://localhost:5000/api
```

## 7.1 Authentication

### POST /auth/register

Request:

```json
{
  "name": "Chandan",
  "email": "chandan@example.com",
  "password": "password123"
}
```

Success:

- HTTP 201
- return a safe user object
- return JWT token if using immediate-login registration

Validation:

- name required
- valid email format
- password required
- email must be unique

---

### POST /auth/login

Request:

```json
{
  "email": "chandan@example.com",
  "password": "password123"
}
```

Success:

- HTTP 200
- return JWT
- return safe user data

Failure:

- HTTP 401 for invalid credentials

---

## 7.2 Applications

All application endpoints require authentication.

### GET /applications

Returns the authenticated user's applications.

Optional query parameters:

```text
?search=google
?status=Interview
```

It is acceptable to implement search/filtering primarily on the frontend for the initial MVP, provided the API remains secure.

---

### POST /applications

Request example:

```json
{
  "company": "Google",
  "position": "Software Engineer Intern",
  "status": "Applied",
  "applicationDate": "2026-08-12",
  "interviewDate": "",
  "jobType": "Internship",
  "location": "Bangalore",
  "notes": "Applied through careers portal"
}
```

Success:

- HTTP 201
- return created application

---

### PUT /applications/:id

Update application.

Must verify:

1. JWT is valid.
2. Application exists.
3. Application belongs to the logged-in user.

Success:

- HTTP 200

Not found/unauthorized ownership:

- HTTP 404 or 403 according to implementation style, but be consistent.

---

### DELETE /applications/:id

Delete application.

Must verify authenticated ownership.

Success:

- HTTP 200 or 204

---

# 8. Authentication Design

Use:

- bcrypt for password hashing
- jsonwebtoken for JWT creation/verification

## Registration flow

```text
React Register Form
        |
POST /api/auth/register
        |
Validate input
        |
Check duplicate email
        |
bcrypt.hash(password)
        |
Create User
        |
Generate JWT
        |
Return token + user
```

## Login flow

```text
React Login Form
        |
POST /api/auth/login
        |
Find user by email
        |
bcrypt.compare(password, hash)
        |
Generate JWT
        |
Return token + user
```

## Protected request

The frontend should send:

```text
Authorization: Bearer <JWT>
```

The backend middleware should:

1. Read authorization header.
2. Extract token.
3. Verify token.
4. Attach user ID to `req.user`.
5. Continue to controller.
6. Reject invalid/missing token.

---

# 9. Frontend Pages

## 9.1 Register

Fields:

- Name
- Email
- Password
- Confirm Password

Actions:

- Submit
- Link to Login

Validation should be basic and user-friendly.

---

## 9.2 Login

Fields:

- Email
- Password

Actions:

- Login
- Link to Register

On successful login:

```text
Login -> store token -> navigate to Dashboard
```

---

## 9.3 Dashboard

Main layout:

```text
--------------------------------------------------
Navbar
--------------------------------------------------

Welcome, <user name>

[Total] [Applied] [Interview] [Selected] [Rejected]

[ + Add Application ]

Search: [____________]
Status: [All v]

--------------------------------------------------
Application List
--------------------------------------------------
Application Card
Application Card
Application Card
--------------------------------------------------
```

Dashboard should show:

- Total applications
- Applied count
- Interview count
- Selected count
- Rejected count

These statistics can be calculated from the currently loaded applications on the frontend.

---

# 10. Application Card

Each application card should show:

- Company
- Position
- Status badge
- Application date
- Interview date if available
- Job type
- Location
- Notes if available

Actions:

- Edit
- Delete

Keep cards visually simple.

---

# 11. Add/Edit Form

Use one reusable form component for both create and edit if practical.

Fields:

```text
Company
Position
Status
Application Date
Interview Date
Job Type
Location
Notes
```

The component should support:

- create mode
- edit mode

Avoid creating two separate forms with duplicate logic unless it is significantly easier to understand.

---

# 12. Search and Filter

Search should work against at least:

- company
- position

Filter:

- All
- Applied
- Shortlisted
- Interview
- Selected
- Rejected

Frontend filtering is sufficient for the MVP.

Use simple JavaScript methods such as:

- `filter()`
- `includes()`

Do not build Elasticsearch or server-side advanced search.

---

# 13. React State Design

Suggested Dashboard state:

```text
applications
loading
error
searchTerm
statusFilter
showForm
editingApplication
```

The agent should keep state local and simple.

Do not introduce global state management.

---

# 14. Fetch API

Use native Fetch API for all frontend/backend communication.

Do not install Axios.

Recommended patterns:

### GET

```js
const response = await fetch(url, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

if (!response.ok) {
  throw new Error("Failed to fetch applications");
}

const data = await response.json();
```

### POST

```js
const response = await fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify(formData)
});

if (!response.ok) {
  throw new Error("Failed to create application");
}

const data = await response.json();
```

The agent should use clear helper functions when helpful, but not create unnecessary abstractions.

---

# 15. React Concepts to Demonstrate

The code should naturally use:

- Components
- JSX
- Props
- `useState`
- `useEffect`
- Event handlers
- Controlled forms
- Conditional rendering
- `.map()`
- `.filter()`
- React Router

Do not use advanced React patterns unless necessary.

---

# 16. React Router

Required routes:

```text
/login
/register
/dashboard
```

Behavior:

- `/login` -> Login page
- `/register` -> Register page
- `/dashboard` -> protected page

If no valid token:

```text
/dashboard -> redirect to /login
```

If logged in:

```text
/login -> optionally redirect to /dashboard
/register -> optionally redirect to /dashboard
```

---

# 17. Tailwind CSS

Use Tailwind for:

- layout
- spacing
- responsive grid
- buttons
- forms
- cards
- status badges
- navigation

Keep styling clean and minimal.

Suggested visual direction:

- clean white/neutral dashboard
- readable typography
- rounded cards
- subtle borders/shadows
- clear status colors
- responsive mobile layout

Do not spend significant time on animation.

---

# 18. Error Handling

Implement basic error handling.

Frontend should display friendly messages for:

- invalid login
- duplicate email
- missing required fields
- API failure
- unauthorized session
- empty application list

Backend should:

- use appropriate HTTP status codes
- return consistent JSON error messages

Example:

```json
{
  "message": "Invalid credentials"
}
```

---

# 19. Environment Variables

Backend `.env` should contain:

```text
PORT=5000
MONGO_URI=...
JWT_SECRET=...
```

Do not hardcode secrets.

Do not commit `.env`.

Frontend should use environment variables only if needed for the deployed API base URL.

---

# 20. CORS

Configure Express CORS so the React frontend can communicate with the backend.

During local development, allow the local frontend origin.

For deployment, update allowed origin to the deployed frontend URL.

---

# 21. Development Sequence

The AI agent must follow this order.

## Phase 1 — Project setup

Create:

- root project
- frontend
- backend
- `.gitignore`
- package files

Verify:

- React runs
- Express runs

---

## Phase 2 — Backend foundation

Implement:

1. Express server.
2. Middleware.
3. MongoDB connection.
4. User model.
5. Application model.
6. Basic health/test route.

Verify database connection.

---

## Phase 3 — Authentication

Implement:

1. Register API.
2. bcrypt hashing.
3. Login API.
4. JWT generation.
5. JWT middleware.
6. Protected test route.

Test authentication before moving on.

---

## Phase 4 — Application CRUD

Implement:

1. Create application.
2. Get user applications.
3. Update application.
4. Delete application.

Test every endpoint.

---

## Phase 5 — Frontend foundation

Implement:

1. React Router.
2. Login page.
3. Register page.
4. Dashboard shell.
5. Navbar.
6. Protected route.

---

## Phase 6 — Connect frontend and backend

Use Fetch API.

Implement:

1. Register from React.
2. Login from React.
3. Store token.
4. Load dashboard applications.
5. Add application.
6. Edit application.
7. Delete application.

---

## Phase 7 — Search/filter/dashboard

Implement:

1. Search.
2. Status filter.
3. Statistics.
4. Empty state.

---

## Phase 8 — UI polish

Implement:

- responsive layout
- loading states
- errors
- confirmation before delete
- status badges
- form styling

---

## Phase 9 — Testing

Manually test all key flows.

### Authentication test matrix

| Test | Expected |
|---|---|
| Register valid user | Success |
| Register duplicate email | Error |
| Login correct credentials | Success |
| Login wrong password | Error |
| Dashboard without token | Redirect |
| Protected API without token | Unauthorized |

### Application test matrix

| Test | Expected |
|---|---|
| Add application | Appears |
| Edit application | Updated |
| Delete application | Removed |
| Search company | Matching results |
| Filter status | Matching status only |
| User A login | Sees only A data |
| User B login | Sees only B data |

---

# 22. Deployment Plan

Only deploy after local testing is complete.

## MongoDB Atlas

1. Create cluster.
2. Create database user.
3. Configure network access.
4. Get connection string.
5. Add `MONGO_URI` to backend environment variables.

## Backend

Deploy backend to Render.

Set environment variables:

```text
PORT
MONGO_URI
JWT_SECRET
```

Confirm:

```text
GET /api/health
```

works on the deployed backend.

## Frontend

Deploy React app to Vercel.

Configure deployed backend base URL.

Test login and CRUD from production.

---

# 23. Git Workflow

Use simple commits.

Suggested commits:

```text
Initial project setup
Setup Express server
Connect MongoDB
Add user authentication
Add application CRUD APIs
Build React pages
Connect frontend to backend
Add search and filters
Improve UI
Prepare deployment
```

Do not rewrite Git history unnecessarily.

---

# 24. README Requirements

Create a professional but simple README with:

## Project title

Job Application Tracker

## Overview

A short paragraph describing the problem and solution.

## Features

- JWT authentication
- CRUD application management
- Search/filter
- Dashboard statistics
- User-specific data

## Tech stack

- React
- Tailwind CSS
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Fetch API

## Screenshots

Add screenshots after UI completion.

## Local setup

Explain:

```text
git clone
cd backend
npm install
create .env
npm run dev

cd ../frontend
npm install
npm run dev
```

## Environment variables

Explain required variables without exposing real secrets.

## API endpoints

Include the API table.

## Future improvements

Examples:

- interview reminders
- pagination
- analytics
- resume management
- job link storage

Do not implement future improvements in the MVP.

---

# 25. Code Quality Rules for the AI Agent

The agent must:

- Use JavaScript, not TypeScript.
- Use clear variable names.
- Keep functions small.
- Avoid unnecessary abstractions.
- Prefer readable code over clever code.
- Add comments only when they explain something non-obvious.
- Handle API errors.
- Validate inputs.
- Never expose password hashes.
- Never commit secrets.
- Prevent cross-user application access.
- Avoid duplicate code where a small reusable component is clearer.
- Keep dependencies minimal.

The agent should not:

- install libraries without explaining why
- generate over-engineered architecture
- create 20+ files for simple functionality
- add advanced patterns without need
- add AI features
- add payment features
- add real-time features
- add social features
- add external APIs unless explicitly requested

---

# 26. Beginner Learning Mode

Because the developer plans to learn while building, the agent should work in **build + explain mode**.

After each logical task, provide:

### What we built

One or two sentences.

### Why we need it

Explain the role in the application.

### Important concepts

List only the concepts used in that task.

### Data flow

Show a short flow such as:

```text
Form -> Fetch -> Express -> Controller -> MongoDB
```

### Files changed

List exact files.

### What to learn now

Give 2–5 focused learning points.

### Quick self-check

Ask 2–4 simple questions the developer should be able to answer before continuing.

Example:

```text
1. Why do we hash passwords?
2. What does JWT identify?
3. Why is the application linked to a user?
```

Do NOT dump long theoretical lessons unless requested.

---

# 27. Interview Learning Targets

By the end, the developer should understand:

## JavaScript

- `let` vs `const`
- functions
- arrow functions
- objects
- arrays
- `map`
- `filter`
- `find`
- destructuring
- spread operator
- promises
- async/await
- try/catch
- modules

## React

- component
- JSX
- props
- state
- `useState`
- `useEffect`
- controlled forms
- conditional rendering
- React Router

## Backend

- Node.js
- Express
- route
- controller
- middleware
- request
- response
- REST API

## Database

- MongoDB
- collection
- document
- ObjectId
- schema
- model
- Mongoose
- CRUD

## Authentication

- password hashing
- bcrypt
- JWT
- bearer token
- protected route
- authorization vs authentication

## HTTP

- GET
- POST
- PUT
- DELETE
- 200
- 201
- 400
- 401
- 403
- 404
- 500

---

# 28. Important Interview Feature: User Isolation

The agent must make this easy to explain.

When an application is created:

```text
authenticated user ID
        +
application data
        |
        v
MongoDB application document
```

When applications are fetched:

```text
JWT
 |
 v
authenticated user ID
 |
 v
find applications where user == authenticated user ID
```

This prevents one user from seeing another user's data.

Do NOT rely only on the frontend to hide applications.

The backend must enforce ownership.

---

# 29. Final Acceptance Criteria

The project is considered complete only when all are true:

### Authentication

- [ ] Register works
- [ ] Login works
- [ ] Logout works
- [ ] Passwords are hashed
- [ ] JWT authentication works
- [ ] Dashboard is protected

### Applications

- [ ] Create works
- [ ] Read works
- [ ] Update works
- [ ] Delete works
- [ ] Status changes work
- [ ] Search works
- [ ] Filter works
- [ ] User ownership is enforced

### UI

- [ ] Responsive
- [ ] Form validation
- [ ] Loading states
- [ ] Error states
- [ ] Empty state
- [ ] Clean dashboard
- [ ] Clear status indicators

### Project quality

- [ ] `.env` not committed
- [ ] README exists
- [ ] GitHub repository is organized
- [ ] Local project works from a clean install
- [ ] Backend and frontend deployed
- [ ] Production API connection works

---

# 30. Scope Control — Very Important

The agent must stop after completing the MVP and not proactively add advanced features.

Do NOT add:

- AI
- chat
- notifications
- email integration
- OAuth
- payments
- file uploads
- resume parsing
- job scraping
- recommendation engine
- WebSockets
- admin dashboard
- Redux
- TypeScript
- Docker

The project should remain small enough that a beginner can understand it.

---

# 31. Suggested 4-Day Execution Plan

## Day 1 — Backend

Goal:

```text
Express + MongoDB + Mongoose + CRUD
```

Expected outcome:

```text
Working backend APIs
```

---

## Day 2 — Authentication + React

Goal:

```text
JWT + bcrypt + React + Router + Fetch
```

Expected outcome:

```text
Login/Register + basic frontend/backend connection
```

---

## Day 3 — Main Product

Goal:

```text
Dashboard + Add/Edit/Delete + Search + Filter
```

Expected outcome:

```text
Complete functional MVP
```

---

## Day 4 — Polish + Deployment + Learning

Goal:

```text
Bug fixing
Responsive UI
GitHub
MongoDB Atlas
Render
Vercel
Interview preparation
```

Expected outcome:

```text
Working deployed project + understanding of the implementation
```

---

# 32. Agent Behavior Rules

When implementing:

1. Start with project setup.
2. Work in small logical phases.
3. After each phase, verify that it works.
4. If a dependency or tool is added, explain why.
5. Do not move on when a core previous step is broken.
6. Prefer simple solutions.
7. Keep the developer informed about changed files.
8. Explain implementation concepts immediately after using them.
9. Never claim a feature is implemented unless it was actually implemented and verified.
10. Prioritize core functionality over visual polish.

---

# 33. Final Product Vision

The finished app should feel like a simple real-world productivity tool:

```text
---------------------------------------------------------
JOB APPLICATION TRACKER

Welcome, Chandan                              Logout

---------------------------------------------------------
TOTAL        APPLIED       INTERVIEW       SELECTED
  12            6              3              1

---------------------------------------------------------
[ + Add Application ]

Search [__________________]   Status [All ▼]

---------------------------------------------------------
Google
Software Engineer Intern
Status: Interview
Applied: Aug 10, 2026
Interview: Aug 18, 2026
Location: Bangalore

[Edit] [Delete]
---------------------------------------------------------
Microsoft
Software Engineer Intern
Status: Applied
Applied: Aug 11, 2026

[Edit] [Delete]
---------------------------------------------------------
```

The application does not need to look like a commercial SaaS product. It needs to be:

- working
- clean
- secure enough for a beginner project
- easy to understand
- easy to explain

---

# 34. Developer's Core Mental Model

Always remember:

```text
USER
  |
  v
REACT UI
  |
  | Fetch API
  v
EXPRESS ROUTE
  |
  | Middleware
  v
JWT AUTHENTICATION
  |
  v
CONTROLLER
  |
  | Mongoose
  v
MONGODB
  |
  v
JSON RESPONSE
  |
  v
REACT UI UPDATE
```

If the developer can explain this complete flow for:

- Register
- Login
- Add application
- Get applications
- Edit application
- Delete application

then the project has achieved its interview-learning goal.

---

# 35. Start Here

When starting the project, the first task should be:

```text
1. Create root directory.
2. Create backend with Node + Express.
3. Create frontend with React.
4. Run both locally.
5. Verify frontend and backend separately.
6. Then connect MongoDB.
```

Do not start by building the entire UI.

Do not start by adding advanced features.

Build the backend foundation first, verify it, then connect React.
